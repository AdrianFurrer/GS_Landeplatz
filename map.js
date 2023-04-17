// OpenLayers TileMap

var geoserverWFS_Jura_Norm_All = 'Gleitschirm_LP:Jura_Norm_All'
var geoserverWFS_Jura_Norm_All_klein = 'Gleitschirm_LP:Jura_Norm_All_klein'
var geoserverWFS_Airspace ='Gleitschirm_LP:Airspace'
var swisstopoWMTSLayer = 'ch.swisstopo.swissimage'; // Swisstopo WMTS Layername
var geoserverWFS_Path = 'Gleitschirm_LP:Jura_All_Path_klein'
let id_kachel = 9999

// Source -----------------------------------------------------------------------------



var sourceKacheln = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: function(extent) {
		return 'http://188.227.200.59:8080/geoserver/Gleitschirm_LP/ows?service=WFS&' +
		'version=1.1.0&request=GetFeature&typename=' +geoserverWFS_Jura_Norm_All_klein+
		'&outputFormat=application/json';
	},
	strategy: ol.loadingstrategy.bbox
});

var sourceAirspace = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: function(extent) {
		return 'http://188.227.200.59:8080/geoserver/Gleitschirm_LP/ows?service=WFS&' +
		'version=1.1.0&request=GetFeature&typename=' +geoserverWFS_Airspace+
		'&outputFormat=application/json';
	},
	strategy: ol.loadingstrategy.bbox
});


var sourcePath = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: function(extent) {
		return 'http://188.227.200.59:8080/geoserver/Gleitschirm_LP/ows?service=WFS&' +
		'version=1.1.0&cql_filter=id='+id_kachel+'&request=GetFeature&typename=' +geoserverWFS_Path+
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

var vectorAirspace = new ol.layer.Vector({
	source: sourceAirspace,
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
	style: function(feature) {
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
  

var wmtsLayer = new ol.layer.Tile({
	source: new ol.source.TileWMS({
		url: 'https://wms.geo.admin.ch/',
		crossOrigin: 'anonymous',
		attributions: '© <a href="http://www.geo.admin.ch/internet/geoportal/' +
			'en/home.html">SWISSIMAGE / geo.admin.ch</a>',
		projection: 'EPSG:4326',
		params: {
			'LAYERS': swisstopoWMTSLayer,
			'FORMAT': 'image/jpeg'
		},
		serverType: 'mapserver'
	})
});

var osm = new ol.layer.Tile({
	source: new ol.source.OSM()
  })


// Map -------------------------------------------------------------------------
var map = new ol.Map({
	target: 'map',
	layers: [wmtsLayer,vectorKacheln,vectorAirspace,vectorPath],
	view: new ol.View({
	  center: ol.proj.fromLonLat([7.81542463758229,47.351794485583724]),
	  zoom: 14
	})
});

// Click Function --------------------------------------------------------------
map.on('click', function(e) {
	map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
	  console.log(feature.getProperties().id);
	  id_kachel = feature.getProperties().id;
	  vectorPath.getSource().refresh();
	});
  });
