# Alles schön asynchron
## Frameworks für AngularJS und den ASP.NET Webstack (Teil 1)

In diesem Artikel werden eine Auswahl von JavaScript-Frameworks rund um AngularJS und ASP.NET beleuchtet, welche Ihre Anwendung ideal vervollständigen können. Es dreht sich in diesem Teil alles um Asynchronität, sowohl beim Laden von Dateien als auch beim Verarbeitern von Daten mittels OData. In der nächsten Ausgabe erfahren Sie, wie sowohl auf dem Server als auch auf dem Client Ihre Software mit Unit Tests wasserdicht machen können.

Neue Technologien lassen sich dann am besten einführen, wenn Sie an bestehendes Wissen anknüpfen und vorhandenen Technologien ergänzen. Dies gilt vor allem für JavaScript-Frameworks, welche in der richtigen Kombination eine stimmige ASP.NET Webanwendung ergeben können. In diesem Sinne setzt dieser Artikel voraus, das Sie auf der "Serverseite" mit dem ASP.NET MVC Framework, der ASP.NET Web API, dem Entity Framework und der Paketverwaltung NuGet bereits vertraut sind. Den Client werden folgende Frameworks ergänzen: das populäre Framework AngularJS, das Ajax-Framework Breeze.js und als verbindende Element der Module-Loader require.js.

## Modulares JavaScript
In den beiden letzten Artikeln der Dotnetpro haben Sie die Grundlagen von AngularJS bereits kennen gelernt. Dort wurde das modulare Prinzip von AngularJS mittels "angular.module" vorgestellt. Mittels der Directive `ngApp` wird das Modul "exampleApp"  mit dem darin enthaltenen Controller "exampleController" geladen. Dies geschieht, sobald das HTML-Dokument komplett fertig geladen wurde (`DOMContentLoaded` event) 

### Listing 1
```
<!DOCTYPE html>
<html>
<body ng-app="exampleApp">

    <h1 ng-controller="exampleController">
        {{model.text}}
    </h1>

    <script src="~/scripts/angular.js"></script>
    <script src="~/scripts/helloWorld.js"></script>
</body>
</html>
```
---
```
//helloWorld.js
angular.module('exampleApp', [])
    .controller('exampleController', function($scope) {

        $scope.model = {
            text: 'Hello World'
        }
    });

```

Das Einfügen von JavaScript-Dateien durch Script-Tags bzw. durch das "Bundling-Feature" von ASP.NET MVC 4 funktioniert tadellos, jedoch ergeben sich durch dieses so genannte **synchrone Laden** eine Reihe von praktischen Problemen. Allen voran sieht man erst dann den gewünschten Output, wenn sowohl der DOM als auch alle JavaScript-Dateien (sowie in bestimmten Konstellationen auch alle CSS-Dateien) geladen wurden. In einer größeren Anwendung kann dies trotz vieler Optimierungsmöglichkeiten eine ganze Weile dauern. Es gestaltet sich recht schwierig, nur die Scripte zum Start zu laden, die gerade gebraucht werden und später gebrauchte Scripte auch erst später zu laden. Einen ganzen Strauß an Problemen kann man vermeiden, wenn man seine Scripte **asynchron lädt**. Hierfür gibt es eine Reihe von Formaten und Frameworks, es hat sich aber für den Browser das "Asynchronous Module Definition (AMD)"-Format [1] mit der Referenz-Implementierung require.js [2] durchgesetzt.

AMD ist schnell erklärt, da man prinzipiell nur zwei Befehle benötigt: `define` und `require`. Wie der Name vermuten lässt, definiert `define` ein AMD-Modul.

### Listing 2
```
//myFirstModule.js
define(['jquery'], function($) {
    var result = function() {
        $("body").text("Hello World");
    }
    return result;
});

```
Idealerweise befindet sich in einer JavaScript-Datei auch immer nur ein AMD-Modul. In diesem Fall entspricht der Name der Datei auch dem Namen des AMD-Moduls.


wohingegen man mit `require` dieses Modul anfordern kann. 


Aufgrund des asynchronen Designs von AMD muss die Datei (bzw. das entsprechende.bietet einen Callback an, der ausgeführt wird sobald  

<hr>

# Über Johannes Hoppe

Johannes Hoppe ist selbstständiger Webdesigner, Softwareentwickler und IT-Berater.

Er realisiert seit mehr als 10 Jahren Software-Projekte für das Web und entwickelt moderne Portale auf Basis von ASP.NET MVC und JavaScript. Seine Arbeit konzentriert sich auf SinglePage-Technologien und NoSQL-Datenbanken. Er unterrichtet als Lehrbeauftragter und schreibt über seine Vorlesungen, Trainings und Vorträge in seinem Blog. (http://blog.johanneshoppe.de/)


<hr>
[1] AMD.Format: https://github.com/amdjs/amdjs-api/wiki/AMD
[2] Require.js: http://requirejs.org/




Vor allem aber ist die



<hr>
