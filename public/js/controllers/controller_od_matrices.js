tm_app.controller('controller_od_matrices', ['Service_socket', '$scope',
function(Service_socket, $scope) {
	
	//console.log('Creating controller')
	$scope.currentTime = null;
	$scope.currentGroup = null;
	$scope.layerStations = null;
	$scope.layerStations_dest = null;
	$scope.layerHeatMap = null;
	$scope.layerHeatMap_dest = null;
	$scope.matrix;
	$scope.matrixKeys;
	$scope.rawMatrix;
	$scope.origValuesPerStation;
	$scope.destValuesPerStation;
	$scope.currentSelected;
	
	$scope.origColors = colorbrewer.YlOrBr[9];//'#d95f0e';
	$scope.destColors = colorbrewer.BuPu[9];//'#88419d';
	
	$scope.timeItems = [
		['Nocturno', 'noc'],
		['Hora pico (a.m.)', 'pun_man'],
		['Tra_Pun_Man', 'tra_pun_man'],
		['Hora valle', 'valle'],
		['Tra_Pun_Tar', 'tra_pun_tar'],
		['Hora pico (p.m.)', 'pun_tar'],
		['Pre-noctuno', 'pre_noc'],
	];
	
	$scope.groupItems = [
		['Por Fase', 'fase'],
		['Por Troncal', 'troncal'],
		['Por Zona', 'zona'],
	];
	

	$scope.selectGroup = function(selected) {
		$scope.currentGroup = selected;
		
		d3.select("#single-button-gb").text($scope.currentGroup[0]);
		
		if($scope.currentGroup && $scope.currentTime )
		{
			Service_socket.getOdMatrix({
				od_matrix : $scope.currentTime[1],
				group : $scope.currentGroup[1],
				callback : $scope.updateODMatrix
			});
		}
		else
		{
			d3.select("#od_loading").remove();
			d3.select("#od_loading_dest").remove();
			d3.select('#div_od_matrix').append('h6').attr('id', 'od_loading').text('Please select a time of day');
		}
	};
	$scope.selectTimeOfDay = function(selectedItem) {
		$scope.currentTime = selectedItem;
		d3.select("#single-button-tod").text($scope.currentTime[0]);
		if($scope.currentGroup && $scope.currentTime )
		{
			Service_socket.getOdMatrix({
				od_matrix : $scope.currentTime[1],
				group : $scope.currentGroup[1],
				callback : $scope.updateODMatrix
			});
		}
		else
		{
			d3.select("#od_loading").remove();
			d3.select("#od_loading_dest").remove();
			d3.select('#div_od_matrix').append('h6').attr('id', 'od_loading').text('Please select a group');
		}
	};

	$scope.data = {
		map : null,
		layersControl : null,
		infoControl : null,
		map_dest : null,
		layersControl_dest : null,
		infoControl_dest : null,
		
	};
	$scope.createMap = function() {
		//console.log("create map")
		d3.select("#map_orig").remove();
		d3.select("#div_map_orig").append("div").attr("id","map_orig").attr("style", "height : 500px");
		
		d3.select("#map_dest").remove();
		d3.select("#div_map_dest").append("div").attr("id","map_dest").attr("style", "height : 500px");
		
		
		$scope.data.map = L.map('map_orig').setView([4.66198, -74.09866], 11);
		$scope.data.map_dest = L.map('map_dest').setView([4.66198, -74.09866], 11);
		$scope.data.layersControl = L.control.layers();
		$scope.data.layersControl_dest = L.control.layers();
		$scope.data.legendOrig = L.control({position : 'bottomright'});

		$scope.data.legendOrig.onAdd = function(map) {
			var div = L.DomUtil.create('div', 'info legend');
			// loop through our density intervals and generate a label with a colored square for each interval
			for (var i = 0; i < $scope.origColors.length; i++) {
				div.innerHTML += '<i style="background:' + $scope.origColors[i] + '"></i><br>';
			}

			return div;
		}; 

		$scope.data.legendOrig.addTo($scope.data.map);
		
		$scope.data.legendDest = L.control({position : 'bottomright'});

		$scope.data.legendDest.onAdd = function(map) {
			var div = L.DomUtil.create('div', 'info legend');
			// loop through our density intervals and generate a label with a colored square for each interval
			for (var i = 0; i < $scope.destColors.length; i++) {
				div.innerHTML += '<i style="background:' + $scope.destColors[i] + '"></i><br>';
			}

			return div;
		}; 

		$scope.data.legendDest.addTo($scope.data.map_dest);
		
		$scope.data.infoControl = L.control();
		$scope.data.infoControl.onAdd = function(map){
			this._div = L.DomUtil.create('div','info');
			this.update();
			return this._div;
		};
		$scope.data.infoControl.update = function(props){
				if(props)
				{
					this._div.innerHTML = '<h4>Info</h4><b>Nombre: </b>' + props.nombre + '<br>' +
						'<b>Cod: </b>' + props.numtm + "<br>" +
						'<b>Fase: </b>' + props.fase + "<br>" +
						'<b>Troncal: </b>' + props.troncal + "<br>" +
						'<b>Zona: </b>' + props.zona;
					if($scope.origValuesPerStation)
					{
						var tm_id = props.numtm;	
						tm_id = tm_id.length == 4 ? '0' + tm_id : tm_id;
						this._div.innerHTML += '<br><b> Trips from ' + $scope.currentSelected + '</b><br>' +
							$scope.origValuesPerStation[tm_id];
						
					}
				}
				else
				{
					this._div.innerHTML = '<h4>Info</h4>';
				}
		};
		
		$scope.data.infoControl_dest = L.control();
		$scope.data.infoControl_dest.onAdd = function(map){
			this._div = L.DomUtil.create('div','info');
			this.update();
			return this._div;
		};
		$scope.data.infoControl_dest.update = function(props){
				if(props)
				{
					this._div.innerHTML = '<h4>Info</h4><b>Nombre: </b>' + props.nombre + '<br>' +
						'<b>Cod: </b>' + props.numtm + "<br>" +
						'<b>Fase: </b>' + props.fase + "<br>" +
						'<b>Troncal: </b>' + props.troncal + "<br>" +
						'<b>Zona: </b>' + props.zona;
				}
				else
				{
					this._div.innerHTML = '<h4>Info</h4>';
				}
		};
		
		createDefaultBaseLayers($scope.data.map, $scope.data.layersControl);
		createDefaultBaseLayers($scope.data.map_dest, $scope.data.layersControl_dest);
		$scope.data.infoControl.addTo($scope.data.map);
		$scope.data.infoControl_dest.addTo($scope.data.map_dest);

		L.control.scale({
			position : 'bottomleft',
			imperial : false
		}).addTo($scope.data.map);
		
		L.control.scale({
			position : 'bottomleft',
			imperial : false
		}).addTo($scope.data.map_dest);

		$scope.layerHeatMap = L.heatLayer(
				[], 
				{
					radius: 10,
					//gradient : {0.35 : '#fff7bc', 0.65 : '#fec44f', 1 : '#d95f0e'}
					gradient : {
						0.1 : $scope.origColors[0], 
						0.2 : $scope.origColors[1], 
						0.3 : $scope.origColors[2], 
						0.4 : $scope.origColors[3],
						0.5 : $scope.origColors[4],
						0.6 : $scope.origColors[5], 
						0.7 : $scope.origColors[6], 
						0.8 : $scope.origColors[7], 
						0.9 : $scope.origColors[8]}
				}
			);
		//$scope.layerHeatMap.bringToBack();
		$scope.layerHeatMap.addTo($scope.data.map);
		
		
		
		$scope.layerHeatMap_dest = L.heatLayer(
				[], 
				{
					radius: 10,
					//gradient : {0.35 : '#b3cde3', 0.65 : '#8c96c6', 1 : '#88419d'}
					gradient : {
						0.1 : $scope.destColors[0], 
						0.2 : $scope.destColors[1], 
						0.3 : $scope.destColors[2], 
						0.4 : $scope.destColors[3],
						0.5 : $scope.destColors[4],
						0.6 : $scope.destColors[5], 
						0.7 : $scope.destColors[6], 
						0.8 : $scope.destColors[7], 
						0.9 : $scope.destColors[8]}
				}
			);
		$scope.layerHeatMap_dest.addTo($scope.data.map_dest);
		
		Service_socket.getTmStations({
			callback : $scope.updateTmStations
		});

		$scope.data.map.sync($scope.data.map_dest);
		$scope.data.map_dest.sync($scope.data.map);

	};
	$scope.updateTmStations = function(d)
	{
		
		//console.log("adding layer")
		//console.log(d)
			//console.log(d.data.json)
			$scope.layerStations = L.geoJson(d.json, {
				pointToLayer : function(feature, latlng) {
					return L.circleMarker(latlng, {
						radius : 2,
						color : '#000',
						fillOpacity : 0,
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
						}
					});
				}
			}).addTo($scope.data.map);
			
			$scope.layerStations_dest = L.geoJson(d.json, {
				pointToLayer : function(feature, latlng) {
					return L.circleMarker(latlng, {
						radius : 2,
						color : '#000',
						fillOpacity : 0,
						weight : 1,
						
					});
				},
				onEachFeature : function(feature, layer){
					
					layer.on({
						mouseover : function(){
							$scope.data.infoControl_dest.update(feature.properties);
							layer.setStyle({
								weight : 3	
							});
						},
						mouseout : function()
						{
							$scope.data.infoControl_dest.update();
							layer.setStyle({
								weight : 1	
							});
						}
					});
				}
			}).addTo($scope.data.map_dest);
	};
	
	
	$scope.updateODMatrix = function(d) {
		$scope.rawMatrix = d;
		
		var total = 0;
		var total_dest = 0;
		for(each in d)
		{
			for(t in d[each]['raw'])
				total += d[each]['raw'][t];
			for(t in d[each]['raw_dest'])
				total_dest += d[each]['raw_dest'][t];
		}
		
		
		
		
		
		
		
		d3.select('#od_matrix_chord').remove();
		d3.select("#od_loading").remove();
		d3.select('#div_od_matrix').append('h6').attr('id', 'od_loading').text('Loading data....');
		d3.select('#div_od_matrix').append('div').attr('id', 'od_matrix_chord');
		
		d3.select('#od_matrix_chord_dest').remove();
		d3.select("#od_loading_dest").remove();
		d3.select('#div_od_matrix_dest').append('h6').attr('id', 'od_loading_dest').text('Loading data....');
		d3.select('#div_od_matrix_dest').append('div').attr('id', 'od_matrix_chord_dest');
		
		$scope.matrix = [];
		//console.log(rawData);
		$scope.matrixKeys = Object.keys(d).sort();
		//Create matrix

		for (var i = 0; i < $scope.matrixKeys.length; i++) {
			$scope.matrix[i] = [];
			for (var j = 0; j < $scope.matrixKeys.length; j++) {
				$scope.matrix[i][j] = parseFloat(d[$scope.matrixKeys[i]][$scope.matrixKeys[j]]);
			}
		}
		
		ODMatrix = new GeoTabulaInfoVis.ODMatrix({
			matrix : $scope.matrix,
			matrixKeys : $scope.matrixKeys,
			divOrig : 'od_matrix_chord',
			divDest : 'od_matrix_chord_dest',
			origWidth : 500,
			origHeight : 500,
			destWidth : 500,
			destHeight : 500,
			onmouseover : $scope.highlightStations,
			onmouseout : $scope.resetHighlightStations,
			origColor : $scope.origColors[9],
			destColor : $scope.destColors[9],
		});
		
		ODMatrix.createODMatrix();
		
		$scope.resetHighlightStations();
	};
	
	$scope.createMap();
	
	$scope.highlightStations = function(d, i) {
		//console.log("over " + this.groupBy)
		//console.log($scope.currentGroup)
		$scope.currentSelected = d;
		var selectionFunction = function(parameter)
		{
			var weight = 1;
			var color = '#555';
			var opacity = 0;
			if(d == parameter)
			{
				weight = 2;
				color = '#000';
				opacity = 1;
			}
			return {
				weight : weight,
				color : color
			};
		};
		
		var selectionHMFunction = function(param, total, total_dest, layer)
		{
			//console.log($scope.currentGroup)
			var index = $scope.matrixKeys.indexOf(param);
			var perc = $scope.matrix[i][index]/total;
			$scope.layerHeatMap.addLatLng([layer._latlng.lat, layer._latlng.lng, 10 + (60 * perc)]);
			
			var perc_dest = $scope.matrix[index][i]/total_dest;
			$scope.layerHeatMap_dest.addLatLng([layer._latlng.lat, layer._latlng.lng, 10 + (60 * perc_dest)]);
		};
		var selectionHMFunctionForEach = function(layer, tm_cod)
		{
			var localData = $scope.origValuesPerStation[tm_cod];
			var normal = origScale(localData);
			var hmValue = 100 * normal;
			
			$scope.layerHeatMap.addLatLng([layer._latlng.lat, layer._latlng.lng, hmValue]);
			localData = valuesForEachDest[tm_cod];
			normal = destScale(localData);
			hmValue = 100 * normal;
			$scope.layerHeatMap_dest.addLatLng([layer._latlng.lat, layer._latlng.lng, hmValue]);
		};
		
		
		var highlightLayerFunction = function(targetLayer) {
			for (each in targetLayer._layers) {
				var layer = targetLayer._layers[each];
				var feature = layer.feature;
				var fase = feature.properties.fase;
				var troncal = feature.properties.troncal;
				var zona = feature.properties.zona;
					
				var each_station = true;
				if(each_station)
				{
					var tm_id = feature.properties.numtm;	
					tm_id = tm_id.length == 4 ? '0' + tm_id : tm_id;
					if ($scope.currentGroup[1] == 'fase') {
						style = selectionFunction(fase);
					} else if ($scope.currentGroup[1] == 'troncal') {
						style = selectionFunction(troncal);
					} else if ($scope.currentGroup[1] == 'zona') {
						style = selectionFunction(zona);
					}
					layer.setStyle(style);
					
					selectionHMFunctionForEach(layer, tm_id);
				}
				else
				{
					
					var color = '#000000';
					var style;
					var values = $scope.matrix[i];
					var values_dest = [];
					for (index in $scope.matrix) {
						values_dest.push($scope.matrix[index][i]);
					}
					var total = 0;
					var total_dest = 0;
					for (index in values) {
						total += values[index];
					}
					for (index in values_dest) {
						total_dest += values_dest[index];
					}
	
					if ($scope.currentGroup[1] == 'fase') {
						style = selectionFunction(fase);
						selectionHMFunction(fase, total, total_dest, layer);
					} else if ($scope.currentGroup[1] == 'troncal') {
						style = selectionFunction(troncal);
						selectionHMFunction(troncal, total, total_dest, layer);
					} else if ($scope.currentGroup[1] == 'zona') {
						style = selectionFunction(zona);
						selectionHMFunction(zona, total, total_dest, layer);
					}
					layer.setStyle(style);
				}
			}
		};

		$scope.layerHeatMap.setLatLngs([]);
		$scope.layerHeatMap_dest.setLatLngs([]);
		
		
		$scope.origValuesPerStation = $scope.rawMatrix[d]['raw'];
		var valuesForEach = $scope.origValuesPerStation;
		var minmax = [Number.MAX_VALUE, Number.MIN_VALUE];
		var total = 0;
		
		/*
		for(each in $scope.rawMatrix)
		{
			var raw_i = $scope.rawMatrix[each]['raw'];
			for(v in raw_i)
			{
				if(minmax[0] > raw_i[v])
					minmax[0] = raw_i[v];
				if(minmax[1] < raw_i[v])
					minmax[1] = raw_i[v];
				total += raw_i[v];
			}
		}
		*/
		
		///*
		for(v in valuesForEach)
		{
			if(minmax[0] > valuesForEach[v])
				minmax[0] = valuesForEach[v];
			if(minmax[1] < valuesForEach[v])
				minmax[1] = valuesForEach[v];
			total += valuesForEach[v];
		}
		//*/
		
		var origScale = d3.scale.linear().domain(minmax);
		
		var valuesForEachDest = {};
		var rawMatrix = $scope.rawMatrix;
		
		for(each in valuesForEach)
		{
			valuesForEachDest[each] = 0;
			for(each_i in rawMatrix)
			{
				valuesForEachDest[each] += rawMatrix[each_i]['raw'][each];
			}
		}
		
		var minmaxDest = [Number.MAX_VALUE, Number.MIN_VALUE];
		var totalDest = 0;
		for(v in valuesForEachDest)
		{
			if(minmaxDest[0] > valuesForEachDest[v])
				minmaxDest[0] = valuesForEachDest[v];
			if(minmaxDest[1] < valuesForEachDest[v])
				minmaxDest[1] = valuesForEachDest[v];
			totalDest += valuesForEachDest[v];
		}
		var destScale = d3.scale.linear().domain(minmaxDest);
		
		
		highlightLayerFunction($scope.layerStations);
		highlightLayerFunction($scope.layerStations_dest);
		
		
	};


	$scope.resetHighlightStations = function() {
		
		$scope.origValuesPerStation = null;
		var resetHighlightFunction = function(targetLayer) {
			for (each in targetLayer._layers) {
				var layer = targetLayer._layers[each];
				layer.setStyle({
					weight : 1,
					color : "#000"
					//opacity : 1
				});
			}
		};

		$scope.layerHeatMap.setLatLngs([]);
		$scope.layerHeatMap_dest.setLatLngs([]);
		
		resetHighlightFunction($scope.layerStations);
		resetHighlightFunction($scope.layerStations_dest);
	};

}]);
