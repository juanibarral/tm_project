var socket = io();

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


socket.on('data_weekends_per_month', function(msg){
	console.log("Getting data from server");
	console.log(msg);
	updateChartDataWeekendsPerMonth(msg);
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


function getData()
{
	console.log("arsking for data....");
	socket.emit('get_data_weekends', "");
	document.getElementById("cb_month_selection").value = "None";
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
	
	if (selected != 0) {
		console.log("arsking for data for month " + selected);
		socket.emit('get_data_weekends_per_month', selected);
		currentMonthSelected = selected;
	}

	
}

function updateChartDataWeekends(rawData)
{
	
	var data = [
		['Thursdays'],
		['Fridays'],
		['Saturdays'],
		['Sundays']
	];
	
	var colors = {};
	colors[data[0]] = colorMapEOW[0];
	colors[data[1]] = colorMapEOW[1];
	colors[data[2]] = colorMapEOW[2];
	colors[data[3]] = colorMapEOW[3];
	
	var regions = [];
	var currentMonth = 0;
	var dayCounter = 0;
	regions.push(['','']);
	
	var categories = [];
	for(each in rawData)
	{
		var d = rawData[each];
		var dow = 'none';
		switch(d.dow)
		{
			case 4:
				dow = 'Th';
				data[0].push(d.counter);
				data[1].push(null);
				data[2].push(null);
				data[3].push(null);
			break;
			case 5:
				dow = 'Fr';
				data[0].push(null);
				data[1].push(d.counter);
				data[2].push(null);
				data[3].push(null);
			break;
			case 6:
				dow = 'Sa';
				data[0].push(null);
				data[1].push(null);
				data[2].push(d.counter);
				data[3].push(null);
			break;
			case 0:
				dow = 'Su';
				data[0].push(null);
				data[1].push(null);
				data[2].push(null);
				data[3].push(d.counter);
			break;
		}
		
		if(d.month != currentMonth)
		{
			regions[currentMonth][1] = dayCounter;
			currentMonth = d.month;
			regions.push([dayCounter, '']);
		}
		categories.push(dow + ' ' + d.dom + " " + months[d.month]);
		dayCounter++;
	}
	console.log(data);
	console.log(regions);
	
	c3.generate({
		bindto : '#line_chart',
		size : {
			height : 250
		},
		data : {
			columns : data,
			colors : colors
		},
		axis : {
			x : {
				type : 'category',
				categories : categories,
				tick : {
					rotate : -45,
					multiline : false
				},
				height : 80
			}
		},
		regions: [
			{axis: 'x', end: regions[0][1], class: 'regionMonth'},
			{axis: 'x', start: regions[2][0], end: regions[2][1], class: 'regionMonth'},
			{axis: 'x', start: regions[4][0], end: regions[4][1], class: 'regionMonth'},
			{axis: 'x', start: regions[6][0], end: regions[6][1], class: 'regionMonth'},
		]
	}); 

}

function updateChartDataWeekendsInterval(rawData)
{
	
	var data = [
		['Number of Trips']
	];
	var regions = [];
	
	var currentDow = 0;
	var counter = 0;
	var categories = [];
	var first = true;
	for(each in rawData)
	{
		var d = rawData[each];
		var dow = dows[d.dow];
		
		if(first)
		{
			first = false;
			currentDow = dow;
			regions.push([dow, 0]);
		}
		
		data[0].push(d.counter);
		
		if(dow != currentDow)
		{
			regions.push([dow, counter]);
			currentDow = dow;
		}
		var splittedInterval = d.interval.split(" - ");
		categories.push(dow + ' ' + d.dom + " " + months[d.month] + ", " + d.hour + ":" + splittedInterval[0] + " - " + d.hour + ":" + splittedInterval[1]);
		counter++;
	}
	console.log(data);
	//console.log(categories);
	console.log(regions);
	var regionsToDraw = [];
	
	for(var i = 1; i < regions.length; i++)
	{
		if( regions[i][0] == dows[4])
		{
			regionsToDraw.push({axis: 'x', start: regions[i - 1][1],end: regions[i][1], class: 'regionRed'});
		}
		else if( regions[i][0] == dows[5])
		{
			regionsToDraw.push({axis: 'x', start: regions[i - 1][1],end: regions[i][1], class: 'regionGreen'});
		}
		else if( regions[i][0] == dows[6])
		{
			regionsToDraw.push({axis: 'x', start: regions[i - 1][1],end: regions[i][1], class: 'regionBlue'});
		}
		else if( regions[i][0] == dows[0])
		{
			regionsToDraw.push({axis: 'x', start: regions[i - 1][1],end: regions[i][1], class: 'regionPurple'});
		} 
	}
	
	console.log(regionsToDraw)
	c3.generate({
		bindto : '#line_chart',
		size : {
			height : 250
		},
		data : {
			columns : data
		},
		point : {
			//show : false,
			r : 1
		},
		tooltip : {
			show : true
		},
		axis : {
			x : {
				show : false,
				values : [2, 5],
				type : 'category',
				categories : categories,
				tick : {
					rotate : -45,
					multiline : false
				},
				 height : 80
			}
		},
		regions : regionsToDraw,
		// regions: [
			// {axis: 'x', end: regions[0][1], class: 'regionMonth'},
			// {axis: 'x', start: regions[2][0], end: regions[2][1], class: 'regionMonth'},
			// {axis: 'x', start: regions[4][0], end: regions[4][1], class: 'regionMonth'},
			// {axis: 'x', start: regions[6][0], end: regions[6][1], class: 'regionMonth'},
		// ],
    	subchart: {
        	show: true, 
        	axis : {
				x : {
					show : false,
					values : [2, 5],
				}
			},
			regions : regionsToDraw,
    	}
	}); 

}

function updateChartDataWeekendsPerMonth(rawData)
{
	
	var data = [
		['Thursdays'],
		['Fridays'],
		['Saturdays'],
		['Sundays']
	];
	
	var colors = {};
	colors[data[0]] = colorMapEOW[0];
	colors[data[1]] = colorMapEOW[1];
	colors[data[2]] = colorMapEOW[2];
	colors[data[3]] = colorMapEOW[3];
	/*
	for(each in rawData)
	{
		var d = rawData[each];
		switch(d.dow)
		{
			case 4:
				data[0].push(d.counter);
			break;
			case 5:
				data[1].push(d.counter);
			break;
			case 6:
				data[2].push(d.counter);
			break;
			case 0:
				data[3].push(d.counter);
			break;
		}
	}
	*/
	
	//var data = ['Uber trips'];

	var categories = [];
	for(each in rawData)
	{
		var d = rawData[each];
		
		var dow = 'none';
		switch(d.dow)
		{
			case 4:
				dow = 'Th';
				data[0].push(d.counter);
				data[1].push(null);
				data[2].push(null);
				data[3].push(null);
			break;
			case 5:
				dow = 'Fr';
				data[0].push(null);
				data[1].push(d.counter);
				data[2].push(null);
				data[3].push(null);
			break;
			case 6:
				dow = 'Sa';
				data[0].push(null);
				data[1].push(null);
				data[2].push(d.counter);
				data[3].push(null);
			break;
			case 0:
				dow = 'Su';
				data[0].push(null);
				data[1].push(null);
				data[2].push(null);
				data[3].push(d.counter);
			break;
		}

		categories.push(dow + ' ' + d.dom + " " + months[currentMonthSelected - 1]);
	}
	console.log(data);
	
	c3.generate({
		bindto : '#line_chart',
		size : {
			height : 250
		},
		data : {
			columns : data,
			colors : colors
		},
		axis : {
			x : {
				type : 'category',
				categories : categories,
				tick : {
					rotate : -45,
					multiline : false
				},
				height : 80
			}
		}
	}); 

}
