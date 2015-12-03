tm_app.service('Service_socket', function(){
	this.socket = io.connect();
	first = true;
	tmStations = null;
	tmStationsCallers = [];
	
	subscribers = {
		'get_od_matrix' : {},
		'get_data_salidas' : {},
		'get_shape' : {},
		'get_twitter_data_rest' : {},
		'get_twitter_data_stream' : {},
	};
	
	
	this.getTmStations = function(params){
		if(!tmStations)
		{
			console.log("Sending message to server: get_shape");
			params['caller'] = guid();
			subscribers['get_shape'][params.caller] = params.callback;
			params['shape'] = 'tm_stations';
			this.socket.emit('get_shape', params);
		}
		else
		{
			params.callback(tmStations);
		}	
	};
	this.getOdMatrix = function(params){
		console.log('sending message to server: get_od_matrix');
		params['caller'] = guid();
		subscribers['get_od_matrix'][params.caller] = params.callback;
		this.socket.emit('get_od_matrix', params);
	}
	
	this.getIOData = function(params){
		console.log('sending message to server: get_data_salidas');
		params['caller'] = guid();
		subscribers['get_data_salidas'][params.caller] = params.callback; 
		
		this.socket.emit('get_data_salidas', params);
	}
	
	this.getTweets = function(params)
	{
		var message = 'get_twitter_data_rest';
		console.log("sending message to server: " + message);
		params['caller'] = guid();
		subscribers[message][params.caller] = params.callback;
		this.socket.emit(message, params);	
	}
	
	this.getTweetsStream = function(params)
	{
		var message = 'get_twitter_data_stream';
		console.log("sending message to server: " + message);
		params['caller'] = guid();
		subscribers[message][params.caller] = params.callback;
		this.socket.emit(message, params);	
	}
	
	
	this.socket.on('shape_tm_stations', function(data){
		tmStations = data.data;
		subscribers['get_shape'][data.caller](tmStations);
		delete subscribers['get_shape'][data.caller]
	});

	this.socket.on('od_matrix', function(data){
		subscribers['get_od_matrix'][data.caller](data);
		delete subscribers['get_od_matrix'][data.caller]
	});
	
	this.socket.on('data_salidas', function(data){
		subscribers['get_data_salidas'][data.caller]({data : data.data, stationsMap : data.stationsMap});
		delete subscribers['get_data_salidas'][data.caller];
	});
	
	this.socket.on("twitter_data", function(data){
		subscribers['get_twitter_data_rest'][data.caller]({data : data.data});
		delete subscribers['get_data_salidas'][data.caller];
	});
	
	this.socket.on("twitter_data_stream", function(data){
		console.log("getting twitter stream...")
		subscribers['get_twitter_data_stream'][data.caller]({data : data.data});
		delete subscribers['get_data_salidas'][data.caller];
	});
	
	
	var guid = function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}

		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

});