var geo = require('geotabuladb');
var async = require('async');

var shapes = {
	'tm_stations' : 'estaciones_shape'
};

var od_matrices = {
	'noc' 			: 'matriz_od_01',
	'pun_man' 		: 'matriz_od_02',
	'tra_pun_man' 	: 'matriz_od_03',
	'valle' 		: 'matriz_od_04',
	'tra_pun_tar' 	: 'matriz_od_05',
	'pun_tar' 		: 'matriz_od_06',
	'pre_noc' 		: 'matriz_od_07',
};

var ioData = {
	'2015_05_20_in' : 'entradas_2015_05_20_cod',
	'2015_05_21_in' : 'entradas_2015_05_21_cod',
	'2015_05_20_out' : 'salidas_2015_05_20_cod',
	'2015_05_21_out' : 'salidas_2015_05_21_cod',
};

var getShape = function(params, callback)
{
	geo.setCredentials({
		type : 'postgis',
		host : 'localhost',
		user : 'vafuser',
		password : '1234',
		database : 'tmdb'
	});

	var table = shapes[params.shape];
	geo.geoQuery({
		tableName : table,
		geometry : 'geom',
		properties : params.properties ? params.properties : 'all',
	}, function(json) {
		callback( {json : json, name: params.shape});
	});
};

var getOdMatrix = function(params, callback)
{
	geo.setCredentials({
		type : 'postgis',
		host : 'localhost',
		user : 'vafuser',
		password : '1234',
		database : 'tmdb'
	});

	var table = od_matrices[params.od_matrix];

	geo.query({
		//debug : true,
		tableName : table,
		properties : 'all'
	}, function(rows){
		var od_matrix = {};

		for(i in rows)
		{
			var row = rows[i];
			var rowKeys = Object.keys(row);
			var origin = row.row_labels.substring(1,6);
			if(origin.indexOf('a') == -1)
			{
				if(!od_matrix[origin])
				{
					od_matrix[origin] = {};
				}
				for(j in rowKeys)
				{
					var key = rowKeys[j];
					if(key != 'row_labels' && key != 'grand_total')
					{
						var destination = key.substring(2,7);
						if(!od_matrix[origin][destination])
						{
							od_matrix[origin][destination]	= 0;
						}
						od_matrix[origin][destination]	= row[key];
					}
				}
			}
		}
		callback(od_matrix);
	});
};

var getStationsMap = function(callback)
{
	geo.setCredentials({
		type : 'postgis',
		host : 'localhost',
		user : 'vafuser',
		password : '1234',
		database : 'tmdb'
	});

	geo.query({
		debug : true,
		tableName : 'estaciones',
		properties : ['numtm','estacion','troncal','zona','fase']
	}, function(rows){
		var data = {};
		for(i in rows)
		{
			var row = rows[i];
			if(!data[row.numtm])
			{
				data[row.numtm] = {};
			}
			data[row.numtm] = row;
		}
		callback(data);
	});

};

var getSalidasData = function(params, callback)
{
	geo.setCredentials({
		type : 'postgis',
		host : 'localhost',
		user : 'vafuser',
		password : '1234',
		database : 'tmdb'
	});
	
	var data = {};
	var date = params.date;
	var year = date.substring(0,4);
	var month = date.substring(5,7);
	var day = date.substring(8,10);
	var tableName = ioData[params.date];
	geo.query({
		debug : true,
		tableName : tableName,
		properties : 'all'
	}, function(rows){
		var categories = [];
		for(r in rows)
		{
			var row = rows[r];
			//Calculate hour in date format
			var raw = row['hora'];
			
			var hour = 0;
			hour = parseInt(raw.substring(0,2));
			if(raw[9] == 'a')
			{
				hour = hour == 12 ? 0 : hour; 
			}
			else
			{
				hour = hour == 12 ? hour : 12 + hour;
			}
			
			var min = parseInt(raw.substring(3,5));
			var date = new Date(parseInt(year), parseInt(month), parseInt(day), hour, min, 0, 0);
			
			var formatDate = dateFormatter(date); 
			categories.push(formatDate);
			
			var rowKeys = Object.keys(row);
			for(i in rowKeys)
			{
				if(rowKeys[i] != 'hora') 
				{
					var station = rowKeys[i]; 
		
					
					if (!data[station]) 
					{
						data[station] = {};
					}
					data[station][formatDate] = row[station];
				}
			}
		}
		
		callback({categories : categories, data : data});
	});	
	
};

var dateFormatter = function(date)
{
	var month = date.getMonth() + 1;
	month = month < 10 ? '0'+ month : month;
	var day = date.getDate();
	day = day < 10 ? '0' + day : day;
	var hour = date.getHours();
	hour = hour < 10 ? '0' + hour : hour;
	var minute = date.getMinutes();
	minute = minute < 10 ? '0' + minute : minute;
	return date.getFullYear() + "-" + month + "-" + day + " " + hour +":" +minute; 
};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


module.exports = {
	getShape : getShape,
	getOdMatrix : getOdMatrix,
	getStationsMap : getStationsMap,
	getSalidasData : getSalidasData,
};