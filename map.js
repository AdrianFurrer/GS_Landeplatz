// URLs

var geosWMS = 'http://188.227.200.59:8080/geoserver/wms'
var geosWFS = 'http://188.227.200.59:8080/geoserver/Gleitschirm_LP/ows?service=WFS&'

// OpenLayers TileMap

var geoserverWFS_Jura_Norm_All = 'Gleitschirm_LP:Jura_Norm_All';
var geoserverWFS_Jura_Norm_All_klein = 'Gleitschirm_LP:Jura_Norm_All_klein';
var geoserverWFS_Airspace = 'Gleitschirm_LP:Airspace';
var swisstopoWMTSSwissimage = 'ch.swisstopo.swissimage'; // Swisstopo WMTS Layername
var swisstopoWMTSpixel_grau = 'ch.swisstopo.pixelkarte-grau';
var swisstopoWMTSpixel_farbe ='ch.swisstopo.pixelkarte-farbe';
var geoserverWFS_Path = 'Gleitschirm_LP:Jura_All_Path_klein';
var geoserverWFS_Haltestellen = 'Gleitschirm_LP:Haltestellen'
let id_kachel = 9999



// Source -----------------------------------------------------------------------------
// Source -----------------------------------------------------------------------------
// Source -----------------------------------------------------------------------------
// Source -----------------------------------------------------------------------------

// Tile Analysis
// WFS
var sourceKachelnWFS = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: function (extent) {
		return geosWFS +
			'version=1.1.0&request=GetFeature&typename=' + geoserverWFS_Jura_Norm_All_klein +
			'&outputFormat=application/json';
	},
	strategy: ol.loadingstrategy.all
});

//WMS
var sourceKachelnWMS = new ol.source.TileWMS({
	url: geosWMS,
	params: {
	  'LAYERS': 'Gleitschirm_LP:Jura_Norm_All_klein', 
	  'TILED': true,
	  'STYLES': "KachelnWMS",
  },
	serverType: 'geoserver',
	transition: 0,
});

// Airspace
//WFS
var sourceAirspaceWFS = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: function (extent) {
		return geosWFS +
			'version=1.1.0&request=GetFeature&typename=' + geoserverWFS_Airspace +
			'&outputFormat=application/json';
	},
	strategy: ol.loadingstrategy.bbox
});

//WMS
var sourceAirspaceWMS = new ol.source.TileWMS({
	url: geosWMS,
	params: {
	  'LAYERS': 'Gleitschirm_LP:Airspace', 
	  'TILED': true,
	  'STYLES': "Airspace",
  },
	serverType: 'geoserver',
	transition: 0,
  });

// Path from LP to OeV
//WFS
var sourcePath = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: function (extent) {
		return geosWFS +
			'version=1.1.0&cql_filter=id=' + id_kachel + '&request=GetFeature&typename=' + geoserverWFS_Path +
			'&outputFormat=application/json';
	},
	strategy: ol.loadingstrategy.all
});

// OeV stops

var sourveOeVstopsWFS = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: function (extent) {
		return geosWFS +
		'version=1.1.0&request=GetFeature&typename=' + geoserverWFS_Haltestellen +
		'&outputFormat=application/json'
		
	},
	strategy: ol.loadingstrategy.all
})

// Railways
//WMS
var sourceRailwaysWMS = new ol.source.TileWMS({
	url: geosWMS,
	params: {
		'LAYERS': 'Gleitschirm_LP:Bahnlinien', 
		'TILED': true,
		'STYLES': "Bahnlinien",
	},
	  serverType: 'geoserver',
	  transition: 0,
	});

// Style ----------------------------------------------------------------------------
var pathstyle = new ol.style.Style({
	stroke: new ol.style.Stroke({
		color: 'rgba(255, 255, 0)', // yellow
		width: 2
	}),
});

// var pointstyle = new ol.style.Style({
// 	image: new ol.style.Circle({
// 	  radius: 5,
// 	  fill: new ol.style.Fill({
// 		color: 'rgba(255, 0, 0, 0.7)', // red with opacity 0.7
// 	  }),
// 	  stroke: new ol.style.Stroke({
// 		color: 'rgba(255, 255, 255, 1)', // white with opacity 1
// 		width: 2,
// 	  }),
// 	}),
//   });

var whitestroke = new ol.style.Stroke({
	color: 'rgba(255, 255, 255, 1)', // white with opacity 1
	width: 2,
  });

var greenpointstyle = new ol.style.Style({
	image: new ol.style.Circle({
	  radius: 5,
	  fill: new ol.style.Fill({
		color: 'rgba(0, 255, 0, 0.7)', // green with opacity 0.7
	  }),
	  stroke: whitestroke
	}),
  });

var redpointstyle = new ol.style.Style({
	image: new ol.style.Circle({
	  radius: 5,
	  fill: new ol.style.Fill({
		color: 'rgba(255, 0, 0, 0.7)', // red with opacity 0.7
	  }),
	  stroke: whitestroke
	}),
  });

  var bluepointstyle = new ol.style.Style({
	image: new ol.style.Circle({
	  radius: 5,
	  fill: new ol.style.Fill({
		color: 'rgba(173, 216, 230, 0.7)', // light blue with opacity 0.7
	  }),
	  stroke: whitestroke
	}),
  });

  
  

// Layer -----------------------------------------------------------------------------
// Layer -----------------------------------------------------------------------------
// Layer -----------------------------------------------------------------------------
// Layer -----------------------------------------------------------------------------



  

var layerWFSOeVstops = new ol.layer.Vector({
	source: sourveOeVstopsWFS,
	style: function(feature, resolution) {
		var verkehrsmittel_code = feature.get('verkehrsmittel_code');
		if ((verkehrsmittel_code === 'A' || verkehrsmittel_code === 'C' || verkehrsmittel_code === 'D') && resolution < 10) {
		  return greenpointstyle;
		} else if (verkehrsmittel_code === 'I' && resolution < 30) {
		  return bluepointstyle;
		} else if (verkehrsmittel_code === 'B' && resolution < 30) {
			return redpointstyle;
		} else {
			return null;
		}
	}
})

var layerWMSKacheln = new ol.layer.Tile({
	source: sourceKachelnWMS
});

var layerWMSRailways = new ol.layer.Tile({
	visible: true,
	source: sourceRailwaysWMS
});

var layerPath = new ol.layer.Vector({
	source: sourcePath,
	style: pathstyle,
	minZoom: 13.5,
});

var layerWMSAirspace = new ol.layer.Tile({
    source: sourceAirspaceWMS
})

var layerWFSAirspace = new ol.layer.Vector({
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

var layerWFSKacheln = new ol.layer.Vector({
	source: sourceKachelnWFS,
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
	// style
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
			// ende Style
		  })
		});
	  }
	})
  
// Map -------------------------------------------------------------------------
// Map -------------------------------------------------------------------------
// Map -------------------------------------------------------------------------
// Map -------------------------------------------------------------------------
// The layer order corresponds to the order of presentation.

// const view = new ol.View({
// 	center: [0, 0],
// 	zoom: 1,
//   });

var map = new ol.Map({
	target: 'map',
	layers: [
		wmtsSwissimage, 
		wmtsPixel_grau, 
		wmtsPixel_farbe, 
		//layerWMSKacheln,
		layerWFSKacheln,
		layerWMSAirspace,
		layerPath,
		layerWMSRailways,
		windLayer,
		layerWFSOeVstops,
	],
	// view: view
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
		layerPath.getSource().refresh();
	});
});


// Interaktion

var select = new ol.interaction.Select({
	style: redpointstyle,
	layers: [layerWFSOeVstops], // replace with your vector layer
  });
  
  map.addInteraction(select);
  
  var popup = new ol.Overlay({
	element: document.getElementById('popup'),
	positioning: 'bottom-center',
	offset: [0, -5],
  });
  
  map.addOverlay(popup);
  
  map.on('click', function(evt) {
	var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
	  return feature;
	});
  
	if (feature) {
	  var name = feature.get('name'); // replace with the actual attribute name that contains the name
	  var coordinate = evt.coordinate;
	  popup.setPosition(coordinate);
	  popup.getElement().innerHTML = name;
	} else {
	  popup.setPosition(undefined);
	}
  });

// Click Function WMS --------------------------------------------------------------

// map.on('click', function (e) {

// 	const viewResolution = /** @type {number} */ (view.getResolution());
//     // var viewResolution = map.getView().getResolution();
//     var coordinate = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
//     var url = sourceKachelnWMS.getFeatureInfoUrl(
//         coordinate,
//         viewResolution,
//         'EPSG:4326',
//         {'INFO_FORMAT': 'application/json'}
//     );
//     if (url) {
//         fetch(url)
//             .then(function (response) {
//                 return response.json();
//             })
//             .then(function (json) {
//                 console.log(json);
//             });
//     }
// });






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