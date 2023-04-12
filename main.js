import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileWMS from 'ol/source/TileWMS.js';
import View from 'ol/View.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';

// Verschiedenen Maps
const map_osm = new TileLayer({
  source: new OSM(),
})

const map_kacheln_wms = new TileLayer({ 
  source: new TileWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: {'LAYERS': 'GIS_Gleitschirm_LP:Kacheln_WGS84', 'TILED': true},
    serverType: 'geoserver',
    transition: 0,
  }),
  visible: false
})

const map_airspaces_wms = new TileLayer({ 
  source: new TileWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: {'LAYERS': 'GIS_Gleitschirm_LP:Airspaces_WGS84', 'TILED': true},
    serverType: 'geoserver',
    transition: 0,
  }),
  visible: false
})

// Set opacity of map_airspaces_wms layer to 0.5 (50% transparency)
map_airspaces_wms.setOpacity(0.5);

// Layer Anordung
const layers = [
  map_osm, map_kacheln_wms, map_airspaces_wms
];

// Map Darstlung
const map = new Map({
  layers: layers,
  target: 'map',
  view: new View({
    center: [860000,6000000],
    zoom: 13,
  }),
});

<<<<<<< HEAD
=======
// Button zum Umschalten zwischen den Maps erstellen
const toggleButton_1 = document.getElementById('wms-button');
toggleButton_1.addEventListener('click', function() {
  // Toggle the visibility of each layer
  map_kacheln_wms.setVisible(!map_kacheln_wms.getVisible());
});

const toggleButton_2 = document.getElementById('airspace-button');
toggleButton_2.addEventListener('click', function() {
  // Toggle the visibility of each layer
  map_airspaces_wms.setVisible(!map_airspaces_wms.getVisible());
});