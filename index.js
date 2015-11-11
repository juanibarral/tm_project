var express = require('express');
var app = require('express')();
var geo = require('geotabuladb');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var async = require('async');
//var jsonfile = require('jsonfile');

var Twitter = require('twitter');

var client = new Twitter({
	consumer_key : 'WyQtno7Lm7bf4CL5R0CV2NBoz',
	consumer_secret : 'ML3BuPPCprtvOlZW0vAXEyz5TyHvy7p8a3I7fnGwasMzEOSrBQ',
	access_token_key: '388142247-zCgkREXLKp5Nn7OlIQXlAyEzojLHNZSS0VNPuTIo',
  	access_token_secret: 'GcsEAmVKGgOnLx3BPs1Jig25PNeazhrsQrXlnzvmuPVa5'
});


//Local libraries
var dataRetrieval = require('./dataRetrieval.js');
//var dataProcessing = require('./dataProcessing.js');

//Global attributes

io.on('connection', function(socket) {
	
	socket.on('get_shape', function(msg){
		console.log("******************");
		console.log("get_shape");
		console.log(msg);
		dataRetrieval.getShape(msg, function(shape){
			console.log("******************");
			console.log("sending_shape");
			
			if(msg.shape == 'tm_stations')
			{
				dataRetrieval.getStationsMap(function(map){
					//console.log(map);
					//console.log(shape.json);
					for(each in shape.json.features)
					{
						var feature = shape.json.features[each];
						var id = parseInt(feature.properties.codigo_tm);
						if(map[id])
						{
							for(newP in map[id])
							{
								//console.log(newP)
								shape.json.features[each].properties[newP] = map[id][newP];
							}
							//console.log("Agrego")
							//console.log(shape.json.features[each].properties)
						}
					}
					
					socket.emit('shape_' + msg.shape, {caller : msg.caller, data : shape});
				});
			}
			else
			{
				socket.emit('shape_' + msg.shape, {caller : msg.caller, data : shape});	
			}
			
		});
	});
	
	
	socket.on('get_od_matrix', function(msg){
		console.log("******************");
		console.log("get_od_matrix");
		console.log(msg);
		dataRetrieval.getOdMatrix(msg, function(matrix){
			dataRetrieval.getStationsMap(function(map){
				var newMatrix = buildMatrix(msg.group, matrix, map);
				console.log("******************");
				console.log("sending_od_matrix");
				console.log(msg);
				socket.emit('od_matrix', {caller : msg.caller, data : newMatrix});
			});
		});
	});
	
	socket.on('get_data_salidas', function(msg){
		console.log("******************");
		console.log("get_data_salidas");
		console.log(msg);
		dataRetrieval.getSalidasData(msg, function(salidasData){
			dataRetrieval.getStationsMap(function(map){
				console.log("******************");
				console.log("sending_data_salidas");
				console.log(msg);
				socket.emit('data_salidas', {caller : msg.caller, data : salidasData, stationsMap : map});	
			});
			
			
		});
	});
	
	socket.on('get_twitter_data_rest', function(msg){
		console.log("******************");
		console.log("get_twitter_data_rest");
		console.log(msg);
		client.get('search/tweets', msg.restparams, function(error, tweets, response){
			if(error)
				console.log(error);
			else
				socket.emit("twitter_data", {caller : msg.caller, data : tweets});
		});
	});
	
	socket.on('get_twitter_data_stream', function(msg){
		console.log("******************");
		console.log("get_twitter_data_stream");
		console.log(msg);
		client.stream('statuses/filter', msg.streamparams, function(stream) {
  			stream.on('data', function(tweet) {
    			socket.emit('twitter_data_stream', {caller : msg.caller, data : tweet});
  			});
 
  			stream.on('error', function(error) {
    			throw error;
  			});
		});
	});
}); 


function buildMatrix(group, matrix, map)
{
	var newMatrix = {};
	var destMatrix = {};
	//console.log(map);
	//console.log(group);
	//console.log(matrix);
	var total = 0;
	for(each in matrix)
	{
		destMatrix[each] = {};
		var destinations = matrix[each];
		var newOrigin = map[parseInt(each)][group];
		
		if(!newMatrix[newOrigin])
		{
			newMatrix[newOrigin] = {};
			newMatrix[newOrigin]['raw'] = {};
		}

		for(dest in destinations)
		{
			var newDestination = map[parseInt(dest)][group];
			if(!newMatrix[newOrigin][newDestination])
			{
				newMatrix[newOrigin][newDestination] = 0;
			}
			newMatrix[newOrigin][newDestination] += parseInt(destinations[dest]);
			
			
			if(!newMatrix[newOrigin]['raw'][dest])
			{
				newMatrix[newOrigin]['raw'][dest] = 0;
			}
			newMatrix[newOrigin]['raw'][dest] += parseInt(destinations[dest]);
			total += parseInt(destinations[dest]);
		}
	}
	
	for(each in destMatrix)
	{
		for(e in matrix)
		{
			if(!destMatrix[each][e])
				destMatrix[each][e] = 0;
			destMatrix[each][e] = matrix[e][each];
		}
	}
	
	var total_dest = 0;
	for(each in destMatrix)
	{
		var origins = destMatrix[each];
		var newDest = map[parseInt(each)][group];
		if(!newMatrix[newDest]['raw_dest'])
		{
			newMatrix[newDest]['raw_dest'] = {};	
		}
		
		for(orig in origins)
		{
			var newOrigin = map[parseInt(orig)][group];
			if(!newMatrix[newDest]['raw_dest'][orig])
			{
				newMatrix[newDest]['raw_dest'][orig] = 0;
			}
			newMatrix[newDest]['raw_dest'][orig] += parseInt(origins[orig]);
			total_dest += parseInt(origins[orig]);
		}
	}
	
	console.log(total);
	console.log(total_dest);
	
	var total = 0;
	var total_dest = 0;
	var d = newMatrix;
	for(each in d)
	{
		for(t in d[each]['raw'])
			total += d[each]['raw'][t];
		for(t in d[each]['raw_dest'])
			total_dest += d[each]['raw_dest'][t];
	}

	console.log(total);
	console.log(total_dest);
	return newMatrix;
}





app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
	
	res.sendFile(__dirname + '/public/views/home.html');
	
});

//var server = http.listen(5938, function () {
var server = http.listen(3006, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
  
});

