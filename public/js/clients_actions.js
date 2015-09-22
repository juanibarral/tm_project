var socket = io.connect('http://guitaca.uniandes.edu.co:3005/clients');

var numberFormatterInt = d3.format("4n");
var numberFormatterFloat = d3.format(",.2f");
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var dows = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
var currentMonthSelected = 0;

var colorBrew = colorbrewer.Set1[4];
var colorMapEOW = [
	colorBrew[0],
	colorBrew[1],
	colorBrew[2],
	colorBrew[3],
];

var firstSelected = 'none';
var secondSelected = 'none';
socket.on("json", function(msg) {
	console.log(msg);

	newJson = L.geoJson(msg.json, {
		style : {
			weight : msg.name == 'zonas' ? 1 : 2,
			opacity : 1,
			fillColor : '#AAAAAA',
			fillOpacity : 0.0,
			color : '#000000'
		},
		onEachFeature : function(feature, layer) {
			if (msg.name == 'zonas') {
				layer.on({
					mouseover : function(e) {
						info.update(feature.properties.name);
						layer.setStyle({
							weight : 2
						});
					},
					mouseout : function(e) {
						info.update();
						layer.setStyle({
							weight : 1
						});
					}
				});
			}
		}
	}).addTo(map);

	layersControl.addOverlay(newJson, msg.name);
}); 


socket.on('data_clients', function(msg){
	console.log("Getting data_clients from server");
	updateChartDataClientsTrips(msg.month, msg.totalTrips, msg.totalClients, msg.average, msg.tripsData, msg.clientsData);
});

socket.on('data_weekends', function(msg){
	console.log("Getting data from server");
	console.log(msg);
	updateChartDataWeekends(msg);
});

socket.on('data_EOW_per_interval', function(msg){
	console.log("Getting data from server");
	console.log(msg);
	updateChartDataWeekendsInterval(msg);
});


function getClientsData()
{
	console.log("asking for clients data....");
	socket.emit('get_data_clients', 1);
	
}

function getDataPerInterval()
{
	if(currentMonthSelected == 0)
	{
		alert("There is no month selected");
	}
	else
	{
		console.log("arsking for data....");
		socket.emit('get_data_EOW_per_interval', currentMonthSelected);	
	}
	
}

function monthSelected(selected)
{
	d3.select("#chart_clients_trips").remove();
	d3.select('#charts').append('div').attr('id','chart_clients_trips').append('h3').text('loading data...');
	if (selected != 0) {
		console.log("asking for clients data, month " + selected);
		socket.emit('get_data_clients', selected);
		currentMonthSelected = selected;
	}

	
}

function updateChartDataClientsTrips(month, totalTrips, totalClients, average, tripData, clientsData)
{
	d3.select("#chart_clients_trips").remove();
	var chart_clients = d3.select('#charts').append('div').attr('id','chart_clients_trips');
	chart_clients.append('h4').text("Total trips: " + numberFormatterInt(totalTrips));
	chart_clients.append('h4').text("Total clients: " + numberFormatterInt(totalClients));
	chart_clients.append('h4').text("Average trips/client: " + numberFormatterFloat(average));
	chart_clients.append('div').attr('id','chart_clients_trips_bc')
	chart_clients.append('div').attr('id','chart_clients_clients_bc')
	console.log(tripData);
	console.log(clientsData);
	

	var categories = Object.keys(tripData).sort(function(x, y) {
		var x_val = parseInt(x.split(' ')[0]);
		var y_val = parseInt(y.split(' ')[0]);
		if (x_val < y_val) {
			return -1;
		}
		if (x_val > y_val) {
			return 1;
		}
		return 0;
	}); 


	var data = [
		['Number of clients per number of trips']
	];
	
	for(i in categories)
	{
		data[0].push(tripData[categories[i]]);
	}
	
	var firstChart = c3.generate({
		bindto : '#chart_clients_trips_bc',
		size : {
			height : 250
		},
		data : {
			type : 'bar',
			columns : data,
			selection: {
				enabled: true,
                draggable: false,
                multiple: false
            },
            onselected : function(d, element){
            	if(firstSelected == 'none' && secondSelected == 'none')
            	{
            		firstSelected = d.index;
            	}
            	else if (firstSelected != 'none' && secondSelected == 'none')
            	{
            		secondSelected = d.index;
            		var newData = ['Subsample'];
            		var newCategories = [];
            		var min = firstSelected < secondSelected ? firstSelected : secondSelected;
            		var max = firstSelected < secondSelected ? secondSelected : firstSelected;
            		for(var i = min; i <= max; i++ )
            		{
            			newData.push(data[0][i + 1]);
            			newCategories.push(categories[i]);
            		}
            		firstChart.load({
            			columns : [
            				newData
            			],
            			categories : newCategories,
            			unload: ['Number of clients per number of trips']
            			
            		})
            	}
            	else
            	{
            		firstSelected = 'none';
            		secondSelected = 'none';
            		firstChart.load({
            			columns : data,
            			categories : categories,
            			unload: ['Subsample']
            			
            		})
            	}
            }
		},
		axis : {
			x : {
				type : 'category',
				categories : categories,
				tick : {
					//rotate : -45,
					multiline : false,
					culling : {
						max : 10
					}
				},
				//height : 50,
				label : {
					text : 'Number of trips',
					position : 'outer-right'
				}
			},
			y : {
				label : {
					text : 'Number of users',
					position : 'outer-middle' 
				}
			}
		},
		interaction: {
              enabled: true
        },

	}); 
	
	
	var dataClients = ['Number of clients per day'];
	
	var categoriesClients = ['X'];
	var keysClients = Object.keys(clientsData).sort(function(a,b){
		var x = parseInt(a.split("-")[1]);
		var y = parseInt(b.split("-")[1]);
		if (x < y) {
        	return -1;
    	}
    	if (x > y) {
	        return 1;
	    }
	    return 0;
	});
	
	for(i in keysClients)
	{
		var d = clientsData[keysClients[i]];
		dataClients.push(d.counter);
		categoriesClients.push(new Date(2015,(month -1 ),d.dom,0,0,0,0));
	}
	
	console.log(dataClients);
	c3.generate({
		bindto : '#chart_clients_clients_bc',
		size : {
			height : 250
		},
		data : {
			x : 'X',
			xFormat: '%Y-%m-%dT%H:%M:%S.000Z',
			type : 'bar',
			columns : [
				categoriesClients,
				dataClients
			]
		},
		axis : {
			x : {
				type : 'timeseries',
				//categories : categoriesClients,
				tick : {
					// rotate : -45,
					// multiline : false,
					format : '%b-%d'
				},
				//height : 50,
				label : {
					text: 'date',
					position : 'outer-right'
				}
			},
			y : {
				label : {
					text : 'Number of clients',
					position : 'outer-middle' 
				}
			}
		},
	}); 

}


