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
	
	$scope.origColor = '#d95f0e';
	$scope.destColor = '#88419d';
	
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
					radius: 15,
					gradient : {0.35 : '#fff7bc', 0.65 : '#fec44f', 1 : '#d95f0e'}
				}
			);
		//$scope.layerHeatMap.bringToBack();
		$scope.layerHeatMap.addTo($scope.data.map);
		
		
		
		$scope.layerHeatMap_dest = L.heatLayer(
				[], 
				{
					radius: 15,
					gradient : {0.35 : '#b3cde3', 0.65 : '#8c96c6', 1 : '#88419d'}
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
			origColor : $scope.origColor,
			destColor : $scope.destColor,
		});
		
		ODMatrix.createODMatrix();
		
		$scope.resetHighlightStations();
	};
	
	$scope.createMap();
	
	$scope.highlightStations = function(d, i) {
		//console.log("over " + this.groupBy)
		//console.log($scope.currentGroup)
		
		
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
				// fillOpacity : opacity,
				// fillColor : color
				weight : weight,
				color : color
				//opacity : opacity
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
		
		
		var highlightLayerFunction = function(targetLayer) {
			for (each in targetLayer._layers) {
				var layer = targetLayer._layers[each];
				var feature = layer.feature;
				var fase = feature.properties.fase;
				var troncal = feature.properties.troncal;
				var zona = feature.properties.zona;
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
		};

		$scope.layerHeatMap.setLatLngs([]);
		$scope.layerHeatMap_dest.setLatLngs([]);
		highlightLayerFunction($scope.layerStations);
		highlightLayerFunction($scope.layerStations_dest);
		
		
	};


	$scope.resetHighlightStations = function() {
		
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
