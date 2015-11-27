tm_app.controller('controller_stations_io',['Service_socket', '$scope', 
function(Service_socket, $scope) 
{
	$scope.iohistogram = {
		sorted : false,
		text : "sort by value",
	};
	$scope.clock = new Clock();
	
	$scope.selectionChart = {
		raw : {},
		data : [],
		categories : [],
		BY_NAME : 0,
		BY_VALUE : 1,
		sortedBy : 0,
		update : function(){
			switch ( this.sortedBy )
			{
				case this.BY_VALUE :
					this.data = [['Quantity']];
					this.categories = [];
					_this = this;
					var keys = Object.keys(this.raw).sort(function(a,b){
						var x = _this.raw[a].value;
						var y = _this.raw[b].value;
						if(x > y)
						{
							return 1;
						}
						else if(x < y)
						{
							return -1;
						}
						else
						{
							return 0;
						}
					});
					this.categories = keys;
					for	(k in keys)
					{
						this.data[0].push(this.raw[keys[k]].value);
					}
					
				break;
				case this.BY_NAME :
					this.data = [['Quantity']];
					var catt = [];
					var keys = Object.keys(this.raw).sort();
					this.categories = keys;
					for	(k in keys)
					{
						this.data[0].push(this.raw[keys[k]].value);
					}
				break;
			}
		},
		selected : {},
	};
	
	
	$scope.sortHistogram = function(){
		$scope.iohistogram.sorted = !$scope.iohistogram.sorted;
		if($scope.iohistogram.sorted)
		{
			$scope.iohistogram.text = 'sort by name';
			$scope.selectionChart.sortedBy = $scope.selectionChart.BY_VALUE; 
			
		}
		else
		{
			$scope.iohistogram.text = 'sort by value';
			$scope.selectionChart.sortedBy = $scope.selectionChart.BY_NAME;
		}
		$scope.selectionChart.update();
		$scope.updateSelectionData();
	};
	
	$scope.stationsData = {
		raw : [],
		min : 0,
		max : 0,
		colorScheme : 'YlOrBr',
		colorMap : null,
		colorScale : null,
		colorTicks : null,
		currentSelected : {}
	};
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
	$scope.selrange = {
		min : 0,
		max : 100,
		disabled : true,
		model_min : 20,
		model_max : 80
	};
	
	$scope.$watch('range.model_max', function(newVal, oldVal){
    	if(!$scope.range.disabled)
    	{
    		$scope.range.model_date = $scope.stationsData.raw.categories[newVal];
    		var model_date = $scope.range.model_date;
    		$scope.colorStations(model_date);
    		$scope.data.iochart.xgrids([{value : $scope.formatDate($scope.range.model_date)}]);
    		
    		if($scope.data.selectionChart)
    		{
	    		var chartData = [['Trips']];
				var selectedHour = $scope.stationsData.raw.categories[$scope.range.model_max];
				var data = $scope.stationsData.raw.data;
				for(index in data)
				{
					chartData[0].push(data[index][$scope.range.model_date]);
					
					var stationId = index.substring(2);
					var stationName = $scope.stationsMap[stationId] ? $scope.stationsMap[stationId].estacion : "n/a";
					$scope.selectionChart.raw[stationName].value = data[index][$scope.range.model_date];
				}
				//$scope.selectionChart.data = chartData;
				//$scope.updateSelectionData(chartData);
				//console.log($scope.selectionChart);
				$scope.selectionChart.update();
				$scope.updateSelectionData();
    		}
    		
    		var date = new Date();
    		var hours = parseInt(model_date.substring(11,13));
    		var minutes = parseInt(model_date.substring(14));
    		date.setHours(hours, minutes);
    		$scope.clock.update(date);
    	}
  	});
  	
  	$scope.$watch('selrange.model_max', function(newVal, oldVal){
    	if(!$scope.selrange.disabled)
    	{
    		
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
			var rawData = $scope.stationsData.raw.data[$scope.selectedItem.id];
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
		infoControl : null,
		mapLegend : null
	};
	
	
	
	$scope.data.infoControl = L.control();
	$scope.data.infoControl.onAdd = function(map){
		this._div = L.DomUtil.create('div','info');
		this.update();
		return this._div;
	};
		
	$scope.data.infoControl.update = function(props) {
		if (props) {
			var trips = 'n/a';
			var tm_cod = 'e_' + props.numtm;
			
			if($scope.stationsData.raw.data && $scope.stationsData.raw.data[tm_cod])
			{
				trips = $scope.stationsData.raw.data[tm_cod][$scope.range.model_date];
			}
			
			this._div.innerHTML = '<h4>Info</h4>' + 
				'<b>Name: </b>' + props.nombre + '<br>' +
				'<b>Cod: </b>' + props.numtm + "<br>" + 
				'<b>Fase: </b>' + props.fase + "<br>" + 
				'<b>Troncal: </b>' + props.troncal + "<br>" + 
				'<b>Zona: </b>' + props.zona + '<br>' + 
				'<b>Trips: </b>' + trips;
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
						color : '#AAA',
						weight : 1,
						fillOpacity : 0.8
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
				height : 150
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
						delete $scope.stationsData.currentSelected[id];
					},
					onmouseover : function(id){
						// console.log(id);
						// console.log($scope.stationsData.currentSelected);
						$scope.colorStations($scope.range.model_date, $scope.stationsData.currentSelected[id]);
					},
					onmouseout : function(id){
						$scope.colorStations($scope.range.model_date);
					}
				}
			},
			transition : {
				duration : 0
			}
		}); 
	};
	
	$scope.createSelectionChart = function()
	{
		
		d3.select("#div_selection_data_chart").remove();
		d3.select("#div_io_selection").append("div").attr("id", "div_selection_data_chart");
		$scope.data.selectionChart = c3.generate({
			bindto : '#div_selection_data_chart',
			size : {
				height : 250
			},
			data : {
				type : 'bar',
				columns : [],
				selection : {
					enabled : true,
					multiple : true,
					draggable : true,
				},
				onselected : function(d){
					var id = $scope.selectionChart.categories[d.index];
					var cod_tm = $scope.selectionChart.raw[id].cod;
					$scope.selectionChart.raw[id]['chartLegend'] = $scope.addStationToChart(cod_tm);
				},
				onunselected : function(d){
					var id = $scope.selectionChart.categories[d.index];
					var chartLegend = $scope.selectionChart.raw[id].chartLegend;
					$scope.data.iochart.load({
						unload : chartLegend
					});
				},
				onmouseover : function(d){
					var id = $scope.selectionChart.categories[d.index];
					$scope.colorStations($scope.range.model_date, $scope.selectionChart.raw[id].cod.substring(2));
				},
				onmouseout : function(d){
					$scope.colorStations($scope.range.model_date);
				}
			},
			axis: {
				x: {
					type : 'category',
    				categories: [],
    				show : false
  					}
			},
			transition : {
				duration : 0
			},
			interaction : {
				enabled : true,
			}
		}); 
	};
	
	$scope.updateData = function(data){
		//console.log("data")
		$scope.stationsData.raw = data.data;
		$scope.items = [];
		$scope.stationsMap = data.stationsMap;
		
		$scope.stationsData.min = Number.MAX_VALUE;
    	$scope.stationsData.max = Number.MIN_VALUE;
		
		for(d in $scope.stationsData.raw.data)
		{
			var name = $scope.stationsMap[d.substring(2)] ? $scope.stationsMap[d.substring(2)].estacion : "n/a";
			
			$scope.items.push({id: d, name : name});
			
			for(i in $scope.stationsData.raw.data[d])
			{
				var value = $scope.stationsData.raw.data[d][i];
				if($scope.stationsData.min > value)
				{
					$scope.stationsData.min = value;
				}
				if($scope.stationsData.max < value)
				{
					$scope.stationsData.max = value;
				}
			}
		}
		//$scope.$apply();
		//console.log($scope.stationsData);
		var linearScale = d3.scale.linear().domain([$scope.stationsData.min, $scope.stationsData.max]);
		$scope.stationsData.colorTicks = linearScale.ticks(8);
		var ticks = $scope.stationsData.colorTicks;
		if(ticks.length > 9)
		{
			var rawTicks = [];
			for(var i = 0; i < 8; i++)
			{
				rawTicks.push(ticks[i]);
			}
			ticks = rawTicks;
		}
		$scope.stationsData.colorTicks = ticks;
		$scope.stationsData.colorMap = colorbrewer[$scope.stationsData.colorScheme][ticks.length + 1];
		$scope.stationsData.colorMap[0] = '#ff0000';
		var colorMap = $scope.stationsData.colorMap;
		$scope.stationsData.colorScale = d3.scale.threshold().domain(ticks).range(colorMap);
		
		
		if($scope.data.mapLegend)
		{
			$scope.data.mapLegend.removeFrom($scope.data.map);
			$scope.data.mapLegend = null;
		}
		$scope.data.mapLegend = L.control({position : 'bottomright'});
		$scope.data.mapLegend.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'info legend');
		    // loop through our density intervals and generate a label with a colored square for each interval
		    var colors = $scope.stationsData.colorMap;
		    var values = $scope.stationsData.colorTicks;
		    //div.innerHTML += '<i style="background:' + colors[0] + '"></i>' + values[0] + '<br>';
		    for (var i = 1; i < colors.length ; i++) {
		        div.innerHTML +=
		            '<i style="background:' + colors[i] + '"></i>' + 
		            	values[i - 1] + (values[i] ? '<br>' : '+');
		    }
		
		    return div;
		};
		
		$scope.data.mapLegend.addTo($scope.data.map);

		
		$scope.range.max = $scope.stationsData.raw.categories.length - 1;
		$scope.range.disabled = false;
		$scope.range.model_max = 1;
		$scope.$apply();
		$scope.range.model_max = 0;
		$scope.$apply();
		
		
		
		$scope.createSelectionChart();
		
		var chartData = [['Trips']];
		var selectedHour = $scope.stationsData.raw.categories[$scope.range.model_max];
		var data = $scope.stationsData.raw.data;
		var categories = [];
		for(index in data)
		{
			var dataName = index.substring(2) ;
			dataName = $scope.stationsMap[dataName] ? $scope.stationsMap[dataName].estacion : "n/a" ;
			categories.push(dataName);
			chartData[0].push(data[index][selectedHour]);
			
			$scope.selectionChart.raw[dataName] = 
			{
				cod : index,
				value :	data[index][selectedHour]
			} 
		}
		categories.sort();
		$scope.selrange.max = categories.length - 1;
		$scope.selrange.disabled = false;
		$scope.selrange.model_max = 50;
		$scope.$apply();
		
		
		
		// $scope.selectionChart.data = chartData;
		// $scope.selectionChart.categories = categories;
		//$scope.updateSelectionData(chartData, categories);
		$scope.selectionChart.update();
		$scope.updateSelectionData();
		
	};
	
	$scope.updateChart = function(rawCategories, chartData)
	{
		var categories = ['X'];
		for(i in rawCategories)
		{
			var rawDate = rawCategories[i];
			categories.push($scope.formatDate(rawDate));
		}
		
		
		$scope.data.iochart.load({
			columns : [categories, chartData],
		});
		
	};
	
	$scope.mouseClicked = function(e){
		var cod_tm = e.target.feature.properties.codigo_tm;
		var selectedId = 'e_' + cod_tm;
		$scope.addStationToChart(selectedId);
	};
	
	$scope.addStationToChart = function (selectedId)
	{
		var rawData = $scope.stationsData.raw.data[selectedId];
		var chartData = [selectedId];
		for (i in rawData) {
			chartData.push(rawData[i]);
		}

		var stationId = chartData[0].substring(2);
		var dataName = $scope.stationsMap[stationId] ? $scope.stationsMap[stationId].estacion : "n/a";
		chartData[0] = dataName;
		$scope.stationsData.currentSelected[dataName] = stationId;
		$scope.updateChart($scope.stationsData.raw.categories, chartData); 
		return dataName;
	}

	$scope.createMap();

	$scope.formatDate = function(rawDate)
	{
		var year = parseInt(rawDate.substring(0,4));
		var month = parseInt(rawDate.substring(5,7));
		var day = parseInt(rawDate.substring(8,10));
		var hour = parseInt(rawDate.substring(11,13));
		var minute = parseInt(rawDate.substring(14,16));
		return new Date(year, month, day, hour, minute, 0, 0);
	};
	
	$scope.colorStations = function(date, stationId)
	{
		var targetLayer = $scope.data.stationsLayer;
		for (each in targetLayer._layers) {
			var layer = targetLayer._layers[each];
			var feature = layer.feature;
			var tm_cod = "e_" + feature.properties.codigo_tm;
			 
			if($scope.stationsData.raw.data[tm_cod])
			{
				var value = $scope.stationsData.raw.data[tm_cod][date];
				var color = $scope.stationsData.colorScale(value);
				
				if(stationId)
				{
					if('e_' + stationId == tm_cod)
					{
						$scope.data.infoControl.update(feature.properties);
					}	
					else
					{
						color = '#AAA';
					}						
				}
				else
				{
					$scope.data.infoControl.update();
				}
				
				layer.setStyle({
					fillColor : color
				});
			}
			else
			{
				console.log(tm_cod + " not found");
			}
		}
	};
	
	// $scope.updateSelectionData = function(chartData, categories)
	$scope.updateSelectionData = function()
	{
		var chartData = $scope.selectionChart.data;
		var categories = $scope.selectionChart.categories;
		$scope.data.selectionChart.load({
			columns : chartData,
			categories : categories
		});
	};
	
	$scope.clock.create("#div_clock");
	$scope.clock.update(new Date());
	
	
}]);