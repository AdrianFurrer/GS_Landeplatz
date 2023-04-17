// OpenLayers TileMap

var geoserverWFS_Jura_Norm_All = 'Gleitschirm_LP:Jura_Norm_All';
var geoserverWFS_Jura_Norm_All_klein = 'Gleitschirm_LP:Jura_Norm_All_klein';
var geoserverWFS_Airspace = 'Gleitschirm_LP:Airspace';
var swisstopoWMTSSwissimage = 'ch.swisstopo.swissimage'; // Swisstopo WMTS Layername
var swisstopoWMTSpixel_grau = 'ch.swisstopo.pixelkarte-grau';
var swisstopoWMTSpixel_farbe ='ch.swisstopo.pixelkarte-farbe';
var geoserverWFS_Path = 'Gleitschirm_LP:Jura_All_Path_klein';
let id_kachel = 9999

// Source -----------------------------------------------------------------------------

var sourceKacheln = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: function (extent) {
		return 'http://188.227.200.59:8080/geoserver/Gleitschirm_LP/ows?service=WFS&' +
			'version=1.1.0&request=GetFeature&typename=' + geoserverWFS_Jura_Norm_All_klein +
			'&outputFormat=application/json';
	},
	strategy: ol.loadingstrategy.bbox
});

// Airspace
var sourceAirspaceWFS = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: function (extent) {
		return 'http://188.227.200.59:8080/geoserver/Gleitschirm_LP/ows?service=WFS&' +
			'version=1.1.0&request=GetFeature&typename=' + geoserverWFS_Airspace +
			'&outputFormat=application/json';
	},
	strategy: ol.loadingstrategy.bbox
});

var sourceAirspaceWMS = new ol.source.TileWMS({
	url: 'http://188.227.200.59:8080/geoserver/wms',
	params: {
	  'LAYERS': 'Gleitschirm_LP:Airspace', 
	  'TILED': true,
	  'STYLES': "Airspace",
  },
	serverType: 'geoserver',
	transition: 0,
  });

var sourcePath = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: function (extent) {
		return 'http://188.227.200.59:8080/geoserver/Gleitschirm_LP/ows?service=WFS&' +
			'version=1.1.0&cql_filter=id=' + id_kachel + '&request=GetFeature&typename=' + geoserverWFS_Path +
			'&outputFormat=application/json';
	},
	strategy: ol.loadingstrategy.bbox
});

// Style ----------------------------------------------------------------------------
var red_stroke = new ol.style.Style({
	stroke: new ol.style.Stroke({
		color: 'rgba(255, 255, 0)', // Rot mit 50% Transparenz
		width: 5
	}),
})

// Layer -----------------------------------------------------------------------------
var vectorPath = new ol.layer.Vector({
	source: sourcePath,
	style: red_stroke,
});

var vectorWMS_Airspace = new ol.layer.Tile({
    source: sourceAirspaceWMS
})

var vectorWFSAirspace = new ol.layer.Vector({
	source: sourceAirspaceWFS,
	style: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'rgba(255, 0, 0, 0.5)', // Rot mit 50% Transparenz
			width: 2
		}),
		fill: new ol.style.Fill({
			color: 'rgba(255, 0, 0, 0.1)' // Rot mit 20% Transparenz
		})
	})
});

var vectorKacheln = new ol.layer.Vector({
	source: sourceKacheln,
	minZoom: 13.5,
	style: function (feature) {
		var norm_all = feature.get('norm_all');
		var color = '';
		if (norm_all <= 0.7) {
			color = 'rgba(255, 0, 0, 0.5)'; // Red with 50% opacity
		} else if (norm_all > 0.7 && norm_all <= 0.8) {
			color = 'rgba(255, 165, 0, 0.5)'; // Orange with 50% opacity
		} else if (norm_all > 0.8 && norm_all <= 0.9) {
			color = 'rgba(255, 255, 0, 0.5)'; // Yellow with 50% opacity
		} else if (norm_all > 0.9 && norm_all <= 1) {
			color = 'rgba(0, 128, 0, 0.5)'; // Green with 50% opacity
		}
		return new ol.style.Style({
			fill: new ol.style.Fill({
				color: color
			}),
		});
	}
});

var wmtsSwissimage = new ol.layer.Tile({
	visible: true,
	source: new ol.source.TileWMS({
		url: 'https://wms.geo.admin.ch/',
		crossOrigin: 'anonymous',
		attributions: '© <a href="http://www.geo.admin.ch/internet/geoportal/' +
			'en/home.html">SWISSIMAGE / geo.admin.ch</a>',
		projection: 'EPSG:4326',
		params: {
			'LAYERS': swisstopoWMTSSwissimage,
			'FORMAT': 'image/jpeg'
		},
		serverType: 'mapserver'
	}),
	
});

var wmtsPixel_grau = new ol.layer.Tile({
	visible: false,
	source: new ol.source.TileWMS({
		url: 'https://wms.geo.admin.ch/',
		crossOrigin: 'anonymous',
		attributions: '© <a href="http://www.geo.admin.ch/internet/geoportal/' +
			'en/home.html">SWISSIMAGE / geo.admin.ch</a>',
		projection: 'EPSG:4326',
		params: {
			'LAYERS': swisstopoWMTSpixel_grau,
			'FORMAT': 'image/jpeg'
		},
		serverType: 'mapserver'
	})
});

var wmtsPixel_farbe = new ol.layer.Tile({
	visible: false,
	source: new ol.source.TileWMS({
		url: 'https://wms.geo.admin.ch/',
		crossOrigin: 'anonymous',
		attributions: '© <a href="http://www.geo.admin.ch/internet/geoportal/' +
			'en/home.html">SWISSIMAGE / geo.admin.ch</a>',
		projection: 'EPSG:4326',
		params: {
			'LAYERS': swisstopoWMTSpixel_farbe,
			'FORMAT': 'image/jpeg'
		},
		serverType: 'mapserver'
	})
});

var osm = new ol.layer.Tile({
	source: new ol.source.OSM()
})

// Wetter API ------------------------------------------------------------------
proj4.defs("EPSG:2056","+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs");
ol.proj.proj4.register(proj4);
var windLayer = new ol.layer.Vector({
	source: new ol.source.Vector({
	  format: new ol.format.GeoJSON({
		dataProjection: 'EPSG:2056',
		featureProjection: 'EPSG:4326'
	  }),
	  url: 'https://data.geo.admin.ch/ch.meteoschweiz.messwerte-windgeschwindigkeit-kmh-10min/ch.meteoschweiz.messwerte-windgeschwindigkeit-kmh-10min_de.json'
	}),
	style: function(feature) {
		var windSpeed = feature.get('value');
		var color;
		if (windSpeed < 10) {
		  color = 'rgba(0, 255, 0)';
		} else if (windSpeed < 20) {
		  color = 'rgba(255, 255, 0)';
		} else {
		  color = 'rgba(255, 0, 0)';
		}
		return new ol.style.Style({
		  image: new ol.style.Circle({
			radius: 5,
			fill: new ol.style.Fill({
			  color: color
			}),
			stroke: new ol.style.Stroke({
			  color: 'rgba(0, 0, 0, 0.9)',
			  width: 2
			})
		  }),
		  text: new ol.style.Text({
			text: windSpeed.toString(),
			font: '16px Roboto',
			fill: new ol.style.Fill({
			  color: '#000'
			}),
			offsetY: -20,
			offsetX: 20,
			backgroundFill: new ol.style.Fill({
			  color: 'white',
			}),
			backgroundStroke: new ol.style.Stroke({
				linecap:"round",
				color: 'white',
				width: 8
			})
		  })
		});
	  }
	})
  
// Map -------------------------------------------------------------------------
var map = new ol.Map({
	target: 'map',
	layers: [
		wmtsSwissimage, 
		wmtsPixel_grau, 
		wmtsPixel_farbe,
		vectorKacheln, 
		vectorWMS_Airspace,
		vectorPath,
		windLayer,
	],
	view: new ol.View({
		center: ol.proj.fromLonLat([7.81542463758229, 47.351794485583724]),
		zoom: 14
	})
});

// Click Function --------------------------------------------------------------
map.on('click', function (e) {
	map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
		console.log(feature.getProperties().id);
		id_kachel = feature.getProperties().id;
		vectorPath.getSource().refresh();
	});
});


// Buttons ---------------------------------------------------------------------
const toggleButton_swissimage = document.getElementById('swissimage-button');
toggleButton_swissimage.addEventListener('click', function () {
	// Toggle the visibility of each layer
	wmtsSwissimage.setVisible(true);
	wmtsPixel_grau.setVisible(false);
	wmtsPixel_farbe.setVisible(false);
});

const toggleButton_pixelgrau = document.getElementById('pixelgrau-button');
toggleButton_pixelgrau.addEventListener('click', function () {
	// Toggle the visibility of each layer
	wmtsSwissimage.setVisible(false);
	wmtsPixel_grau.setVisible(true);
	wmtsPixel_farbe.setVisible(false);
});

const toggleButton_pixelfarbe = document.getElementById('pixelfarbe-button');
toggleButton_pixelfarbe.addEventListener('click', function () {
	// Toggle the visibility of each layer
	wmtsSwissimage.setVisible(false);
	wmtsPixel_grau.setVisible(false);
	wmtsPixel_farbe.setVisible(true);
});

const toggleButton_wetterstationen = document.getElementById('wetterstationen-button');
toggleButton_wetterstationen.addEventListener('click', function () {
	// Toggle the visibility of each layer
	windLayer.setVisible(true);
});