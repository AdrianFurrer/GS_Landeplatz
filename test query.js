import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileWMS from 'ol/source/TileWMS.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector.js';
import XYZ from 'ol/source/XYZ.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { bbox as bboxStrategy } from 'ol/loadingstrategy.js';

// Führen Sie die GetFeature-Abfrage durch
fetch('http://localhost:8080/geoserver/GIS_Gleitschirm_LP/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Gleitschirm_LP%3AAirspaces_WGS84&outputFormat=json')
  .then(response => response.json())
  .then(data => {
    // Extrahieren Sie die Features aus der JSON-Antwort
    const features = new GeoJSON().readFeatures(data);
    
    // Überprüfen Sie, ob Features vorhanden sind
    if (features.length > 0) {
      // Nehmen Sie das erste Feature als Beispiel
      const exampleFeature = features[0];
      
      // Rufen Sie die Eigenschaften (Attribute) des Features ab
      const properties = exampleFeature.getProperties();
      
      // Iterieren Sie über die Eigenschaften und geben Sie sie aus
      for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
          console.log('Attribute: ' + key + ', Wert: ' + properties[key]);
        }
      }
    } else {
      console.log('Keine Features gefunden');
    }
  })
  .catch(error => console.error('Fehler beim Abfragen der Attribute: ' + error));
