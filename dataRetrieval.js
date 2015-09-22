var geo = require('geotabuladb');
//var async = require('async');

var shapes = {
	'tm_stations' : 'estaciones_tm'
}

var od_matrices = {
	'noc' : 'matriz_od_01',
	'pun_man' : 'matriz_od_01',
	'tra_pun_man' : 'matriz_od_01',
	'valle' : 'matriz_od_01',
	'tra_pun_tar' : 'matriz_od_01',
	'pun_tar' : 'matriz_od_01',
	'pre_noc' : 'matriz_od_01',
}

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
}

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
}

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
		properties : ['numtm','troncal','zona','fase']
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

}


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
}