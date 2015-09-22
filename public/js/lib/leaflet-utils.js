var tileEsri;
var tileGoogleHybrid;
var tileGoogleRoadmap;
var tileOSM;
var tileOSMBW;

function createDefaultBaseLayers(map, layersControl)
{
	tileEsri = new L.TileLayer.provider('Esri.WorldGrayCanvas');
	map.addLayer(tileEsri);

	//tileGoogleHybrid = new L.Google('HYBRID');
	//tileGoogleRoadmap = new L.Google('ROADMAP');
	tileOSM = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
	tileOSMBW = new L.TileLayer.provider('OpenStreetMap.BlackAndWhite');
	
	layersControl.addBaseLayer(tileEsri, "ESRI");
	//layersControl.addBaseLayer(tileGoogleHybrid, "Google maps (Hybrid)");
	//layersControl.addBaseLayer(tileGoogleRoadmap, "Google maps (Roadmap)");
	layersControl.addBaseLayer(tileOSM, "Open Street maps");
	layersControl.addBaseLayer(tileOSMBW, "Open Street maps (B/W)");
	
	layersControl.addTo(map);

}

