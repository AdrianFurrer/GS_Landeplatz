## Funktionen
- Raster mit den besten Landeplätzen (Farblich abgestuft)
- Kürzester Weg zur nächsten ÖV Haltestelle (onClick)
- Einbindung der MeteoSchweiz API für Windwerte
- Darstellung der Lufträume mit Bodenbezug

## Aufbau Architektur
Die Gleitschirmlandeplatz App ist mit Postgres/PostGIS mit einem Geoserver verbunden welcher die Daten als WMS oder WFS an die Applikation senden. Anschliessend werden die Daten mithilfe der JavaScript Bibliothek OpenLayers dargestellt. 

## Installation
Das GitHub Repository kann heruntergeladen werden und mit der Live Server Erweiterung in VisualStudioCode geöffnet werden. Die Live Server Erweiterung kann hier installiert werden. [LiveServer Installation](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

Für den GeoServer sind keine weiteren Installationen notwendig. Es ist möglich auf diesen extern über die URL: http://188.227.200.59:8080/geoserver zuzugreifen.
Die Postgres Datenbank ist Lokal mit dem Geoserver verbunden. Sämtliche Geodaten liegen auf dieser Datenbank.

## Upload/Anpassungen von Daten in PostGIS
Die Daten wurden mithilfe von FME in die Datenbank übertragen. Die Geodaten sind im Projektionssystem [EPSG:4336](https://epsg.io/4326)abgelegt. Werden die Attribute eines Layers auf der Datenbank angepasst oder gelöscht, muss auf dem GeoServer der Button "Reload feature type" gedrückt werden. Ansonsten werden die Attribute nicht aktualisiert und die Attribute stehen einem beim WFS oder WMS nicht zur Verfügung.

![[Reload-feature-type.JPG]]

## Bild der Applikation
![[Übersicht-GS-App.JPG]]
