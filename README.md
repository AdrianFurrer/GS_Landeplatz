## Funktionen
- Raster mit den besten Landeplätzen (Farblich abgestuft)
- Kürzseter Weg zur nächsten ÖV Haltestelle (onClick)
- Einbindung der MeteoSchweiz API für Windwerte
- Darstellung der Lufräume mit Bodenbezug

## Aufbau Architektur
Die Gleitschirmlandeplatz App ist mit Postgres/PostGIS mit einem Geoserver verbunden welcher die Daten als WMS oder WFS an die Applikation senden. Anschliessend werden die Daten mithilfe der Javascript Bibilothek Openlayers dargstellt. 

## Installation
Das GitHub Repository kann heruntergelden werden und mit der LiveServer Erweiterung in VisualStudioCode geöffnet werden. Die LiveServer erweiterung kann hier installiert werden. [LiveServer Installation](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

Für den GeoServer sind keine weiteren Installationen notwendig. Es ist möglich auf diesen extern über die URL: http://188.227.200.59:8080/geoserver zuzugreifen.
Die Postgres Datenbank ist Lokal mit dem Geoserver verbunden. Sämtliche Geodaten liegen auf dieser Datenbank



