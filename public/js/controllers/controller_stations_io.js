tm_app.controller('controller_stations_io',['Service_socket', '$scope', 
function(Service_socket, $scope) 
{
	$scope.stationsData = [];
	$scope.selectedItem;
	$scope.stationsMap;
	$scope.items = [
		
	];
	
	$scope.range = {
		min : 0,
		max : 100,
		disabled : true,
		model_min : 0,
		model_max : 0,
		model_date : "n/a",
	};
	
	$scope.$watch('range.model_max', function(newVal, oldVal){
    	if(!$scope.range.disabled)
    	{
    		$scope.range.model_date = $scope.stationsData.categories[newVal];
    		var targetLayer = $scope.data.stationsLayer;
    		var localMin = Number.MAX_VALUE;
    		var localMax = Number.MIN_VALUE;
    		for (each in targetLayer._layers) {
    			var layer = targetLayer._layers[each];
				var feature = layer.feature;
				var tm_cod = "e_" + feature.properties.codigo_tm;
				if($scope.stationsData.data[tm_cod])
				{
					var value = $scope.stationsData.data[tm_cod][$scope.range.model_date];
					if(localMin > value)
					{
						localMin = value;
					}
					if(localMax < value)
					{
						localMax = value;
					}
				}
				else
				{
					console.log(tm_cod + " not found");
				}
    		}
    		console.log(localMin + " ---- " + localMax);
    	}
  	});
	
	$scope.dates = [
		{
			id : '2015_05_20_in',
			name : 'In, May 20 2015'
		},
		{
			id : '2015_05_21_in',
			name : 'In, May 21 2015'
		},
		{
			id : '2015_05_20_out',
			name : 'Out, May 20 2015'
		},
		{
			id : '2015_05_21_out',
			name : 'Out, May 21 2015'
		},
	];
	$scope.update = function()
	{
		if ($scope.selectedItem) {
			var rawData = $scope.stationsData.data[$scope.selectedItem.id];
			//console.log(rawData)
			var chartData = [$scope.selectedItem.id];
			for (i in rawData) {
				chartData.push(rawData[i]);
			}
			
			var dataName = chartData[0].substring(2) ;
			dataName = $scope.stationsMap[dataName] ? $scope.stationsMap[dataName].estacion : "n/a" ;
			chartData[0] = dataName;
			
			$scope.updateChart($scope.stationsData.categories, chartData);
		}
	};
	$scope.updateDate = function()
	{
		//console.log($scope.selectedDate);
		//console.log($scope.stationsSalidasData);
		Service_socket.getIOData({
			data : 'all',
			date : $scope.selectedDate.id,
			callback : $scope.updateData,
		});
		
		$scope.createChart();
	};
	
	$scope.data = {
		map : null,
		layersControl : null,
		iochart : null,
		infoControl : null
	};
	
	$scope.data.infoControl = L.control();
	$scope.data.infoControl.onAdd = function(map){
		this._div = L.DomUtil.create('div','info');
		this.update();
		return this._div;
	};
		
	$scope.data.infoControl.update = function(props) {
		if (props) {
			this._div.innerHTML = '<h4>Info</h4><b>Nombre: </b>' + props.nombre + '<br>' + '<b>Cod: </b>' + props.numtm + "<br>" + '<b>Fase: </b>' + props.fase + "<br>" + '<b>Troncal: </b>' + props.troncal + "<br>" + '<b>Zona: </b>' + props.zona;
		} else {
			this._div.innerHTML = '<h4>Info</h4>';
		}
	}; 

	$scope.createMap = function() {
		$scope.data.map = L.map('map').setView([4.66198, -74.09866], 11);

		$scope.data.layersControl = L.control.layers();

		createDefaultBaseLayers($scope.data.map, $scope.data.layersControl);
		$scope.data.infoControl.addTo($scope.data.map);

		L.control.scale({
			position : 'bottomleft',
			imperial : false
		}).addTo($scope.data.map);

		Service_socket.getTmStations({
			callback : 	$scope.updateStations
		});
	};
	
	$scope.updateStations = function(d) {
		
			$scope.data.stationsLayer = L.geoJson(d.json, {
				pointToLayer : function(feature, latlng) {
					return L.circleMarker(latlng, {
						radius : 4,
						color : '#000',
						weight : 1,
						
					});
				},
				onEachFeature : function(feature, layer){
					
					layer.on({
						mouseover : function(){
							$scope.data.infoControl.update(feature.properties);
							layer.setStyle({
								weight : 3	
							});
						},
						mouseout : function()
						{
							$scope.data.infoControl.update();
							layer.setStyle({
								weight : 1	
							});
						},
						click : $scope.mouseClicked
					});
				}
				
				
				
			}).addTo($scope.data.map);
		 	
	};
	
	$scope.createChart = function()
	{
		d3.select("#div_io_data_chart").remove();
		d3.select("#div_io").append("div").attr("id", "div_io_data_chart");
		$scope.data.iochart = c3.generate({
			bindto : '#div_io_data_chart',
			size : {
				height : 250
			},
			data : {
				x : 'X',
				xFormat: '%Y-%m-%d',
				type : 'spline',
				columns : [],
			},
			axis : {
				x : {
					type : 'timeseries',
					tick : {
						format : '%H:%M'
					},
				},
				y : {
					// label : {
						// text : 'Number of',
						// position : 'outer-middle' 
					// }
				}
			},
			legend : {
				item : {
					onclick : function(id){
						$scope.data.iochart.load({
							unload : id
						});
					}
				}
			}
		}); 
	};
	$scope.updateData = function(data){
		//console.log("data")
		$scope.stationsData = data.data;
		$scope.items = [];
		$scope.stationsMap = data.stationsMap;
		
		for(d in $scope.stationsData.data)
		{
			var name = $scope.stationsMap[d.substring(2)] ? $scope.stationsMap[d.substring(2)].estacion : "n/a";
			
			$scope.items.push({id: d, name : name});
		}
		//$scope.$apply();
		//console.log($scope.stationsData);
		$scope.range.max = $scope.stationsData.categories.length - 1;
		$scope.range.disabled = false;
		$scope.$apply();
	};
	
	$scope.updateChart = function(rawCategories, chartData)
	{
		//console.log(rawCategories);
		//var rawCategories = rawData.categories;
		var categories = ['X'];
		for(i in rawCategories)
		{
			var rawDate = rawCategories[i];
			var year = parseInt(rawDate.substring(0,4));
			var month = parseInt(rawDate.substring(5,7));
			var day = parseInt(rawDate.substring(8,10));
			var hour = parseInt(rawDate.substring(11,13));
			var minute = parseInt(rawDate.substring(14,16));
			var date = new Date(year, month, day, hour, minute, 0, 0);
			categories.push(date);
		}
		
		
		$scope.data.iochart.load({
			columns : [categories, chartData],
		});
		
	};
	
	$scope.mouseClicked = function(e){
		var cod_tm = e.target.feature.properties.codigo_tm;
		var selectedId = 'e_' + cod_tm;
		var rawData = $scope.stationsData.data[selectedId];
			//console.log(rawData)
		var chartData = [selectedId];
		for (i in rawData) {
			chartData.push(rawData[i]);
		}

		var dataName = chartData[0].substring(2);
		dataName = $scope.stationsMap[dataName] ? $scope.stationsMap[dataName].estacion : "n/a";
		chartData[0] = dataName;

		$scope.updateChart($scope.stationsData.categories, chartData); 
	};

	$scope.createMap();
	$scope.updateRange = function()
	{
		console.log($scope.range.model_max);
	};
	
}]);