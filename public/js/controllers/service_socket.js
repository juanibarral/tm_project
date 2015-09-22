tm_app.service('Service_socket', function(){
	
	observers = {};
	this.socket = io.connect();
	
	this.addObserver = function(o){
		observers[o.id] = o.observer;
		
	};
	this.getTmStations = function(){
		console.log("Sending message to server: get_shape");
		this.socket.emit('get_shape', {shape : 'tm_stations'});	
	};
	this.getOdMatrix = function(params){
		console.log('sending message to server: get_od_matrix');
		this.socket.emit('get_od_matrix', params);
	}
	
	this.socket.on('shape_tm_stations', function(data){
		observers['controller_od_matrices'].update({id : 'shape_tm_stations', data : data});

	});

	this.socket.on('od_matrix', function(data){
		observers['controller_od_matrices'].update({id : 'od_matrix', data : data});
	});
});