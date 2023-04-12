import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileWMS from 'ol/source/TileWMS.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector.js';
import XYZ from 'ol/source/XYZ.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';
import { format } from 'ol/coordinate';


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

// Layer Anordung
const layers = [
  map_osm, map_kacheln_wms
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

// Button zum Umschalten zwischen den Maps erstellen
const toggleButton = document.getElementById('toggle-button');
toggleButton.addEventListener('click', function() {
  // Toggle the visibility of each layer
  map_kacheln_wms.setVisible(!map_kacheln_wms.getVisible());
});