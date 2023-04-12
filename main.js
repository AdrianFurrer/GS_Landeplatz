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


var layer_2 = new VectorLayer({
  source: new VectorSource({
    url: "http://localhost:8080/geoserver/GIS_Gleitschirm_LP/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Gleitschirm_LP%3AKacheln_WGS84&maxFeatures=50&outputFormat=json",
    format: new GeoJSON(),
    attributions: "geoserver"
  })
})

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
})

const map_airspaces_wms = new TileLayer({ 
  source: new TileWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: {'LAYERS': 'GIS_Gleitschirm_LP:Airspaces_WGS84', 'TILED': true},
    serverType: 'geoserver',
    transition: 0,
  }),
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

