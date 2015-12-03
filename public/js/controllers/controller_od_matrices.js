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
	$scope.rawDatamap;
	$scope.valuesPerStation = {
		origins : null,
		destinations : null,
		originsminmax : [0,1],
		destinationsminmax : [0,1],
	};
	$scope.currentSelected;
	
	$scope.infoCharts = {
		datanames : ["d1","d2","d3","d4","d5","d6","d7","d8","d9"],
		origins : {
			chart : null,
			data : [],
			colors : {}
		},
		destinations : {
			chart : null,
			data : [],
			colors : {},
		}
	};
	
	$scope.origColors = {
		colormap : colorbrewer.YlOrBr[9],
		colorscale : null,
	};
	$scope.origColors.colorscale = d3.scale.threshold().domain([
		0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875
	]).range($scope.origColors.colormap);
	$scope.destColors = {
		colormap : colorbrewer.BuPu[9],
		colorscale : null
	};
	$scope.infoCharts.destinations.data.push(['data']);
	for(i in $scope.infoCharts.datanames)
	{
		//$scope.infoCharts.destinations.data.push([$scope.infoCharts.datanames[i], 0]);
		$scope.infoCharts.destinations.data[0].push(0);
		$scope.infoCharts.origins.data.push([$scope.infoCharts.datanames[i], 0]);
		
		$scope.infoCharts.destinations.colors[$scope.infoCharts.datanames[i]] = $scope.origColors.colormap[i];
		$scope.infoCharts.origins.colors[$scope.infoCharts.datanames[i]] = $scope.destColors.colormap[i];
	}
	
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
		//['Por Fase', 'fase'],
		['Por Troncal', 'troncal'],
		['Por Zona', 'zona'],
		['Total', 'total']
	];
	
	$scope.createInfoCharts = function()
	{
		$scope.infoCharts['destinations'].chart = c3.generate({
			bindto : '#div_infochart_dests',
			size : {
				width : 50,
				height : 150,
			},
			bar : {
				width : {
					ratio : 0.99
				}
			},
		    data: {
		    	type : 'bar',
		        columns: [
		            // ['data1', 30, 200, 100, 400, 150, 250],
		            // ['data2', 50, 20, 10, 40, 15, 25]
		        ],
		        color : function(color, d) {
		        	
		        	return $scope.origColors.colormap[d.index];
		        }
		       // colors : $scope.infoCharts.destinations.colors,
		       // order : null
		    },
		    // 
		    
		    axis: {
		        rotated: true,
		        x : {
		        	show : false
		        },
		        y : {
		        	show : false
		        },
		    },
		    legend : {
		    	show : false
		    },
		    
		    regions : [
		    	{axis : 'x', end : 0.5, class : 'region_dests_0'},
		    	{axis : 'x', start : 0.5, end : 1.5, class : 'region_dests_1'},
		    	{axis : 'x', start : 1.5, end : 2.5, class : 'region_dests_2'},
		    	{axis : 'x', start : 2.5, end : 3.5, class : 'region_dests_3'},
		    	{axis : 'x', start : 3.5, end : 4.5, class : 'region_dests_4'},
		    	{axis : 'x', start : 4.5, end : 5.5, class : 'region_dests_5'},
		    	{axis : 'x', start : 5.5, end : 6.5, class : 'region_dests_6'},
		    	{axis : 'x', start : 6.5, end : 7.5, class : 'region_dests_7'},
		    	{axis : 'x', start : 7.5, class : 'region_dests_8'},
		    ]
		});
	};
	

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
			// for (var i = 0; i < $scope.origColors.colormap.length; i++) {
			for (var i = $scope.origColors.colormap.length - 1; i >= 0; i--) {
				div.innerHTML += '<i style="background:' + $scope.origColors.colormap[i] + '"></i>';
				if(i == 0)
					div.innerHTML += '<span id="range_dests_min_value"></span>';
				if(i == $scope.origColors.colormap.length - 1)
					div.innerHTML += '<span id="range_dests_max_value"></span>';
				div.innerHTML += "</br>";		
			}
			//div.innerHTML += '<div id="div_infochart_dests">';
			return div;
		}; 

		$scope.data.legendOrig.addTo($scope.data.map);
		
		$scope.data.legendDest = L.control({position : 'bottomright'});

		$scope.data.legendDest.onAdd = function(map) {
			var div = L.DomUtil.create('div', 'info legend');
			// loop through our density intervals and generate a label with a colored square for each interval
			// for (var i = 0; i < $scope.destColors.colormap.length; i++) {
			for (var i = $scope.destColors.colormap.length - 1; i >= 0; i--) {
				div.innerHTML += '<i style="background:' + $scope.destColors.colormap[i] + '"></i>';
				if(i == 0)
					div.innerHTML += '<span id="range_origs_min_value"></span>';
				if(i == $scope.origColors.colormap.length - 1)
					div.innerHTML += '<span id="range_origs_max_value"></span>';
				div.innerHTML += "</br>";	
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
					if($scope.valuesPerStation['destinations'])
					{
						var formatter = d3.format(",.2f");
						if($scope.currentGroup[1] == 'total')
						{
							var tm_cod = props.numtm;
							var nombre = null;
							for(i in $scope.rawDatamap)
							{
								if(i == tm_cod)
								{
									nombre = $scope.rawDatamap[i] ? $scope.rawDatamap[i].estacion : "n/a";
									break;
								}
							}
							this._div.innerHTML += '<br><b> Trips from ' + $scope.currentSelected + '</b><br>' +
								formatter($scope.valuesPerStation['destinations'][nombre]);
						}
						else
						{
							var tm_id = props.numtm;	
							tm_id = tm_id.length == 4 ? '0' + tm_id : tm_id;
							this._div.innerHTML += '<br><b> Trips from ' + $scope.currentSelected + '</b><br>' +
								formatter($scope.valuesPerStation['destinations'][tm_id]);
						}
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
					if($scope.valuesPerStation['origins'])
					{
						var formatter = d3.format(",.2f");
						if($scope.currentGroup[1] == 'total')
						{
							var tm_cod = props.numtm;
							var nombre = null;
							for(i in $scope.rawDatamap)
							{
								if(i == tm_cod)
								{
									nombre = $scope.rawDatamap[i] ? $scope.rawDatamap[i].estacion : "n/a";
									break;
								}
							}
							this._div.innerHTML += '<br><b> Trips to ' + $scope.currentSelected + '</b><br>' +
								formatter($scope.valuesPerStation['origins'][nombre]);
						}
						else
						{
							var tm_id = props.numtm;	
							tm_id = tm_id.length == 4 ? '0' + tm_id : tm_id;
							this._div.innerHTML += '<br><b> Trips to ' + $scope.currentSelected + '</b><br>' +
								formatter($scope.valuesPerStation['origins'][tm_id]);
						}
					}
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
						0.1 : $scope.origColors.colormap[0], 
						0.2 : $scope.origColors.colormap[1], 
						0.3 : $scope.origColors.colormap[2], 
						0.4 : $scope.origColors.colormap[3],
						0.5 : $scope.origColors.colormap[4],
						0.6 : $scope.origColors.colormap[5], 
						0.7 : $scope.origColors.colormap[6], 
						0.8 : $scope.origColors.colormap[7], 
						0.9 : $scope.origColors.colormap[8]}
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
						0.1 : $scope.destColors.colormap[0], 
						0.2 : $scope.destColors.colormap[1], 
						0.3 : $scope.destColors.colormap[2], 
						0.4 : $scope.destColors.colormap[3],
						0.5 : $scope.destColors.colormap[4],
						0.6 : $scope.destColors.colormap[5], 
						0.7 : $scope.destColors.colormap[6], 
						0.8 : $scope.destColors.colormap[7], 
						0.9 : $scope.destColors.colormap[8]}
				}
			);
		$scope.layerHeatMap_dest.addTo($scope.data.map_dest);
		
		Service_socket.getTmStations({
			callback : $scope.updateTmStations
		});

		$scope.data.map.sync($scope.data.map_dest);
		$scope.data.map_dest.sync($scope.data.map);

		$scope.createInfoCharts();
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
							$scope.data.infoControl_dest.update(feature.properties);
							layer.setStyle({
								//weight : 3	
							});
						},
						mouseout : function()
						{
							$scope.data.infoControl.update();
							$scope.data.infoControl_dest.update();
							layer.setStyle({
								// weight : 1
								//weight : $scope.currentSelected == 'none' ? 1 : 2	
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
							$scope.data.infoControl.update(feature.properties);
							$scope.data.infoControl_dest.update(feature.properties);
							layer.setStyle({
								weight : 3	
							});
						},
						mouseout : function()
						{
							$scope.data.infoControl.update();
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
		$scope.rawMatrix = d.data;
		$scope.rawDatamap = d.datamap;
		
		// var total = 0;
		// var total_dest = 0;
		// for(each in d)
		// {
			// for(t in d[each]['raw'])
				// total += d[each]['raw'][t];
			// for(t in d[each]['raw_dest'])
				// total_dest += d[each]['raw_dest'][t];
		// }
		
		
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
		$scope.matrixKeys = Object.keys($scope.rawMatrix).sort();
		//Create matrix

		for (var i = 0; i < $scope.matrixKeys.length; i++) {
			$scope.matrix[i] = [];
			for (var j = 0; j < $scope.matrixKeys.length; j++) {
				$scope.matrix[i][j] = parseFloat($scope.rawMatrix[$scope.matrixKeys[i]][$scope.matrixKeys[j]]);
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
			origColor : $scope.origColors.colormap[9],
			destColor : $scope.destColors.colormap[9],
		});
		
		ODMatrix.createODMatrix();
		
		
		d3.select('#od_matrix_bar').remove();
		d3.select('#div_od_matrix_bar').append('div').attr('id','od_matrix_bar');
		ODMatrixBar = new GeoTabulaInfoVis.ODMatrixBar({
			div : '#od_matrix_bar',
			matrix : $scope.matrix,
			matrixKeys : $scope.matrixKeys,
			//width : '100%',
			width : 1140,
			height : 300,
			origcolor : $scope.origColors.colormap[6],
			destcolor : $scope.destColors.colormap[6],
			onmouseover : $scope.highlightStations,
			onmouseout : $scope.resetHighlightStations,
		});
		ODMatrixBar.create();
		
		$scope.resetHighlightStations();
	};
	
	$scope.createMap();
	
	$scope.highlightStations = function(d, i) {
		//console.log("over " + this.groupBy)
		//console.log($scope.currentGroup)
		$scope.currentSelected = d;
		var selectionFunction = function(parameter, tm_cod)
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
				color : color,
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
			var localData = valuesForEachOrig[tm_cod];
			if(localData)
			{
				var normal = origScale(localData);
				var color = $scope.origColors.colorscale(normal);
				$scope.infoCharts['destinations'].data[0][$scope.origColors.colormap.indexOf(color) + 1] += 1;
				var hmValue = 100 * normal;
				$scope.layerHeatMap.addLatLng([layer._latlng.lat, layer._latlng.lng, hmValue]);
			}
			localData = valuesForEachDest ? valuesForEachDest[tm_cod] : null;
			if(localData)
			{
				var normal = destScale(localData);
				var hmValue = 100 * normal;
				$scope.layerHeatMap_dest.addLatLng([layer._latlng.lat, layer._latlng.lng, hmValue]);
			}
		};
		
		
		var highlightLayerFunction = function(targetLayer) {
			for (each in targetLayer._layers) {
				var layer = targetLayer._layers[each];
				var feature = layer.feature;
				var fase = feature.properties.fase;
				var troncal = feature.properties.troncal;
				var zona = feature.properties.zona;
				var nombre = null;
				if($scope.currentGroup[1] == 'total')
				{
					var tm_cod = feature.properties.numtm;
					for(i in $scope.rawDatamap)
					{
						if(i == tm_cod)
						{
							nombre = $scope.rawDatamap[i] ? $scope.rawDatamap[i].estacion : "n/a";
							break;
						}
					}
				}
					
				var each_station = true;
				if(each_station)
				{
					var tm_id = feature.properties.numtm;	
					tm_id = tm_id.length == 4 ? '0' + tm_id : tm_id;
					if ($scope.currentGroup[1] == 'fase') {
						style = selectionFunction(fase, tm_id);
					} else if ($scope.currentGroup[1] == 'troncal') {
						style = selectionFunction(troncal, tm_id);
					} else if ($scope.currentGroup[1] == 'zona') {
						style = selectionFunction(zona, tm_id);
					} else if ($scope.currentGroup[1] == 'total') {
						style = selectionFunction(nombre, tm_id);
					}
					layer.setStyle(style);
					if($scope.currentGroup[1] == 'total')
					{
						tm_id = nombre;
					}
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
		
		
		$scope.valuesPerStation['destinations'] = $scope.rawMatrix[d]['raw'];
		var valuesForEachOrig = $scope.valuesPerStation['destinations'];
		$scope.valuesPerStation['destinationsminmax'] = [Number.MAX_VALUE, Number.MIN_VALUE];
		var total = 0;
		var minmax = $scope.valuesPerStation.destinationsminmax;
		
		for(v in valuesForEachOrig)
		{
			if(minmax[0] > valuesForEachOrig[v])
				minmax[0] = valuesForEachOrig[v];
			if(minmax[1] < valuesForEachOrig[v])
				minmax[1] = valuesForEachOrig[v];
			total += valuesForEachOrig[v];
		}
		
		var formatter = d3.format(",.2f");
		d3.select('#range_dests_min_value').text(formatter(minmax[0]));
		d3.select('#range_dests_max_value').text(formatter(minmax[1]));
		
		var origScale = d3.scale.linear().domain($scope.valuesPerStation['destinationsminmax']);
		
		$scope.valuesPerStation['origins'] = $scope.rawMatrix[d]['raw_dest'];
		var valuesForEachDest = $scope.valuesPerStation['origins'];
		$scope.valuesPerStation['originsminmax'] = [Number.MAX_VALUE, Number.MIN_VALUE];
		var totalDest = 0;
		var minmaxDest = $scope.valuesPerStation.originsminmax;
		for(v in valuesForEachDest)
		{
			if(minmaxDest[0] > valuesForEachDest[v])
				minmaxDest[0] = valuesForEachDest[v];
			if(minmaxDest[1] < valuesForEachDest[v])
				minmaxDest[1] = valuesForEachDest[v];
			totalDest += valuesForEachDest[v];
		}
		d3.select('#range_origs_min_value').text(formatter(minmaxDest[0]));
		d3.select('#range_origs_max_value').text(formatter(minmaxDest[1]));
		var destScale = d3.scale.linear().domain($scope.valuesPerStation['originsminmax']);
		
		$scope.infoCharts.destinations.data[0] = ['data'];
		for(i in $scope.infoCharts.datanames)
		{
			$scope.infoCharts.destinations.data[0].push(0);
		}
		
		highlightLayerFunction($scope.layerStations);
		highlightLayerFunction($scope.layerStations_dest);
		
		
		var testData = [['d1',0],['d2',100],['d3',0],['d4',20],['d5',0],['d6',0],['d7',50],['d8',200],['d9',100]];
		$scope.infoCharts.destinations.chart.load({
			columns : $scope.infoCharts.destinations.data
			//columns : testData
		});
	};


	$scope.resetHighlightStations = function() {
		
		$scope.valuesPerStation['origins'] = null;
		$scope.valuesPerStation['destinations'] = null;
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
		
		d3.select('#range_dests_min_value').text("");
		d3.select('#range_dests_max_value').text("");
		d3.select('#range_origs_min_value').text("");
		d3.select('#range_origs_max_value').text("");
		$scope.currentSelected = 'none';
	};
	
	

}]);
