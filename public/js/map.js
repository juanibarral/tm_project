var map;
var layersControl;
var info = L.control();

info.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'info');
	// create a div with a class "info"
	this.update();
	return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function(nombre) {
	this._div.innerHTML = '<h4>Zona:</h4>' + ( nombre ? nombre : "");
}; 


	
var monthDataChart;

function createMap() {
	map = L.map('map').setView([4.66198, -74.09866], 11);
	
	layersControl = L.control.layers();
	
	createDefaultBaseLayers(layersControl);

	L.control.scale({
		position : 'bottomleft',
		imperial : false
	}).addTo(map);
	
	info.addTo(map); 
	
	createLineChart();

}

function createLineChart()
{

	monthDataChart = c3.generate({
		bindto : '#line_chart',
		size : {
			height : 250
		},
		data : {
			columns : []
		},
		axis : {
			x : {
				type : 'category',
				tick : {
					rotate : -45,
					multiline : false
				},
				height : 80
			}
		}
	}); 

}
