var express = require('express');
var app = require('express')();
var geo = require('geotabuladb');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var async = require('async');
//var jsonfile = require('jsonfile');


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
			socket.emit('shape_' + msg.shape, shape);
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
				socket.emit('od_matrix', newMatrix);
			});
			/*
			console.log("******************");
			console.log("sending_od_matrix");
			console.log(msg);
			socket.emit('od_matrix_' + msg.od_matrix, matrix);
			*/
		});
	});
	
}); 


function buildMatrix(group, matrix, map)
{
	var newMatrix = {}
	//console.log(map);
	for(each in matrix)
	{
		var destinations = matrix[each];
		var newOrigin = map[parseInt(each)][group];
		
		if(!newMatrix[newOrigin])
		{
			newMatrix[newOrigin] = {};
		}

		for(dest in destinations)
		{
			var newDestination = map[parseInt(dest)][group];
			if(!newMatrix[newOrigin][newDestination])
			{
				newMatrix[newOrigin][newDestination] = 0;
			}
			newMatrix[newOrigin][newDestination] += parseInt(destinations[dest]);
		}

	}



	return newMatrix;
}





app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
	
	res.sendFile(__dirname + '/public/views/home.html');
	
});

var server = http.listen(3006, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
  
});

