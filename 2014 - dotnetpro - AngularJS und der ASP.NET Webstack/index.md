# Alles schön asynchron
## Frameworks für AngularJS und den ASP.NET Webstack (Teil 1)

In diesem Artikel werden eine Auswahl von JavaScript-Frameworks rund um AngularJS und ASP.NET beleuchtet, welche Ihre Anwendung ideal vervollständigen können. Es dreht sich in diesem Teil alles um Asynchronität, sowohl beim Laden von Dateien als auch beim Verarbeitern von Daten mittels OData. In der nächsten Ausgabe erfahren Sie, wie sowohl auf dem Server als auch auf dem Client Ihre Software mit Unit Tests wasserdicht machen können.

Neue Technologien lassen sich dann am besten einführen, wenn Sie an bestehendes Wissen anknüpfen und vorhandenen Technologien ergänzen. Dies gilt vor allem für JavaScript-Frameworks, welche in der richtigen Kombination eine stimmige ASP.NET Webanwendung ergeben können. In diesem Sinne setzt dieser Artikel voraus, das Sie auf der "Serverseite" mit dem ASP.NET MVC Framework, der ASP.NET Web API, dem Entity Framework und der Paketverwaltung NuGet bereits vertraut sind. Den Client werden folgende Frameworks ergänzen: das populäre Framework AngularJS, das Ajax-Framework Breeze.js und als verbindende Element der Module-Loader require.js.

## Modulares AngularJS
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
# Modulares JavaScript
Das Einfügen von JavaScript-Dateien durch Script-Tags bzw. durch das "Bundling-Feature" von ASP.NET MVC 4 funktioniert tadellos, jedoch ergeben sich durch dieses so genannte **synchrone Laden** eine Reihe von praktischen Problemen. Allen voran sieht man erst dann den gewünschten Output, wenn sowohl der DOM als auch alle JavaScript-Dateien (sowie in bestimmten Konstellationen auch alle CSS-Dateien) geladen wurden. In einer größeren Anwendung kann dies trotz vieler Optimierungsmöglichkeiten eine ganze Weile dauern. Es gestaltet sich recht schwierig, nur die Scripte zum Start zu laden, die gerade gebraucht werden und später gebrauchte Scripte auch erst später zu laden. Einen ganzen Strauß an Problemen kann man vermeiden, wenn man seine Scripte **asynchron lädt**. Hierfür gibt es eine Reihe von Formaten und Frameworks, es hat sich aber für den Browser das "Asynchronous Module Definition (AMD)"-Format [1] mit der Referenz-Implementierung require.js [2] durchgesetzt.

AMD ist schnell erklärt, da man prinzipiell nur zwei globale Methoden benötigt: `define` und `require`. Wie der Name vermuten lässt, definiert `define` ein AMD-Modul.

### Listing 2a
```
//myFirstModule.js
define(['jquery'], function($) {
    var result = function() {
        $("body").text("Hello World");
    }
    return result;
});

```
Idealerweise befindet sich in einer JavaScript-Datei auch immer nur ein AMD-Modul. Folgt man dieser Konvention, so kann man ein anonymes Modul erstellen. Hier ergibt sich der Name des Moduls aus dem geladenen Dateinamen - bei dem Groß- und Kleinschreibung zu beachten sind!

Mit `require` kann man nun dieses Modul wieder anfordern:

### Listing 2b
```
require(["myFirstModule"], function (myFirstModule) {
    myFirstModule();
});
``` 
Der `require`-Befehl akzeptiert ein Array aus Modulnamen, welche alle fertig geladen sein müssen, bevor die angegebene Callback-Funktion ausgeführt wird. Durch den Callback wird die Definition von Abhängigkeiten und deren tatsächliche Bereitstellung zeitlich voneinander getrennt und die gewünschte Asynchronität komfortabel zur Verfügung gestellt.  Im vorliegenden Beispiel wird der Rückgabewert des Moduls verwendet (in diesem Fall handelt es sich um eine einfache Funktion, welche "Hello World" im Browser ausgibt) ohne das die weiteren Abhängigkeiten von Belang gewesen sind. Wie zu erkennen ist, hat "myFirstModule" wiederum selbst eine weitere Abhängigkeit zum Framework jQuery. Es ergibt sich ein Graph von Abhängkeiten, welche require.js in der korrekten Reihenfolge auflösen wird. Viele Frameworks wie etwa jQuery, Underscore oder Knockout.js bringen AMD-Unterstützung bereits mit, andere Frameworks lassen sich durch ein wenig Konfiguration (so genannte "Shims") als Modul maskieren. Dank der breiten Unterstützung und der Möglichkeit von "Shims" kann man nun Objekte im globalen Gültigkeitsbereich (einer sehr schlechten Praxis) ganz und gar den Kampf ansagen.

# Modul ist nicht gleich Modul
Es wurden nun zwei Arten von Modulen vorgestellt. Module von AngularJS (`angular.module`) sowie Module von Require.js (`define`). Die Vermutung liegt nahe, dass es sich hier um zwei konkurrierende Funktionalitäten handelt. Zwar dienen beide Frameworks der Kapselung von Software und der Definition von Abhängigkeiten, aber es besteht ein gewichtiger Unterschied in der Ausrichtung der beiden Frameworks. 

**Module im AMD-Format** haben einen starken Fokus auf das asynchrone Nachladen von Code. AMD gibt jedoch keine Vorgaben darüber, was der Inhalt eines Moduls ist. Es herrscht die gleiche Freiheit, wie bei allen anderen JavaScript-Objekten. Viele große Frameworks unterstützen das Format. Dies ist jedoch auch die Crux an AMD: Module sind jede Art von JavaScript Objekt. Das "ausmocken" von Abhängkeiten zwecks Unit Tests, bzw. das Zurücksetzen von Werten ist nicht sehr komfortabel (siehe z.B. [3]) 
 
**AngularJS-Module** haben einen starken Fokus auf Dependency Injection (DI), was unerlässlich für Unit Tests ist. Durch die festen Strukturen (z.B. sind Services, Controller oder Filter immer als solche erkennbar)  AngularJS kann von Haus aus keine Abhängigkeiten nachladen.

Wie sich gezeigt hat, sind AMD-Module und Angular-Module zwei Konzepte, die unterschiedliche Schwerpunkte setzen. Mit ein paar kleinen Anpassungen lassen sich beide Konzepte kombinieren. 




<hr>

# Über Johannes Hoppe

Johannes Hoppe ist selbstständiger Webdesigner, Softwareentwickler und IT-Berater.

Er realisiert seit mehr als 10 Jahren Software-Projekte für das Web und entwickelt moderne Portale auf Basis von ASP.NET MVC und JavaScript. Seine Arbeit konzentriert sich auf SinglePage-Technologien und NoSQL-Datenbanken. Er unterrichtet als Lehrbeauftragter und schreibt über seine Vorlesungen, Trainings und Vorträge in seinem Blog. (http://blog.johanneshoppe.de/)


<hr>
[1] AMD.Format: https://github.com/amdjs/amdjs-api/wiki/AMD
[2] Require.js: http://requirejs.org/
[3] Effective Unit Testing with AMD: http://bocoup.com/weblog/effective-unit-testing-with-amd/



Vor allem aber ist die



<hr>
