# Alles schön asynchron
## Frameworks für AngularJS und den ASP.NET Webstack (Teil 1)

In diesem Artikel werden eine Auswahl von JavaScript-Frameworks rund um AngularJS und ASP.NET beleuchtet, welche Ihre Anwendung ideal vervollständigen können. Es dreht sich in diesem Teil alles um Asynchronität, sowohl beim Laden von Dateien als auch beim Verarbeitern von Daten mittels OData. In der nächsten Ausgabe erfahren Sie, wie sowohl auf dem Server als auch auf dem Client Ihre Software mit Unit Tests wasserdicht machen können.

Neue Technologien lassen sich dann am besten einführen, wenn Sie an bestehendes Wissen anknüpfen und vorhandenen Technologien ergänzen. Dies gilt vor allem für JavaScript-Frameworks, welche in der richtigen Kombination eine stimmige ASP.NET Webanwendung ergeben können. In diesem Sinne setzt dieser Artikel voraus, das Sie auf der "Serverseite" mit dem ASP.NET MVC Framework, der ASP.NET Web API, dem Entity Framework und der Paketverwaltung NuGet bereits vertraut sind. Den Client werden folgende neue Frameworks ergänzen: das populäre Framework AngularJS, das Ajax-Framework Breeze.js und als verbindende Element der Module-Loader require.js.

## Modulares AngularJS
In den beiden letzten Artikeln der Dotnetpro haben Sie die Grundlagen von AngularJS bereits kennen gelernt. Dort wurde das modulare Prinzip von AngularJS mittels "angular.module" vorgestellt. Mittels der Directive `ngApp` wird das Modul "exampleApp"  mit dem darin enthaltenen Controller "exampleController" angewendet.  Hinter dem Befehl versteckt sich ein mehrstufigen Prozess, den AngularJS schlicht "Bootstrapping" nennt. Dies geschieht, sobald das HTML-Dokument komplett fertig geladen wurde (`DOMContentLoaded` event).

### Listing 1
```html
<!DOCTYPE html>
<html>
<body ng-app="exampleApp">

    <h1 ng-controller="exampleController">
        {{model.text}}
    </h1>

    <script src="~/Scripts/angular.js"></script>
    <script src="~/Scripts/helloWorld.js"></script>
</body>
</html>
```
---
```js
//helloWorld.js
angular.module('exampleApp', [])
    .controller('exampleController', function($scope) {

        $scope.model = {
            text: 'Hello World'
        }
    });
```
# Modulares JavaScript
Das gezeigte Einfügen von JavaScript-Dateien durch Script-Tags bzw. optional durch das "Bundling-Feature" von ASP.NET MVC 4 funktioniert tadellos, jedoch ergeben sich durch dieses so genannte **synchrone Laden** eine Reihe von praktischen Problemen. Allen voran sieht man erst dann den gewünschten Output, wenn sowohl der DOM als auch alle JavaScript-Dateien (sowie in bestimmten Konstellationen auch alle CSS-Dateien) geladen wurden. In einer größeren Anwendung kann dies trotz vieler Optimierungsmöglichkeiten eine ganze Weile dauern. Es gestaltet sich recht schwierig, nur die Scripte zum Start zu laden, die gerade gebraucht werden und später gebrauchte Scripte ggf. auch erst später zu laden.  Einen ganzen Strauß an Problemen kann man vermeiden, wenn man seine Scripte **asynchron lädt**. Hierfür gibt es eine Reihe von Formaten und Frameworks, es hat sich aber für den Browser das "Asynchronous Module Definition (AMD)"-Format [1] mit der Referenz-Implementierung require.js [2] durchgesetzt.

AMD ist schnell erklärt, da man prinzipiell nur zwei globale Methoden benötigt: `define` und `require`. Wie der Name vermuten lässt, definiert `define` ein AMD-Modul.

### Listing 2a
```js
//myFirstModule.js
define(['jquery'], function($) {
    var result = function() {
        $('body').text('Hello World');
    }
    return result;
});
```
Idealerweise befindet sich in einer JavaScript-Datei auch immer nur ein AMD-Modul. Folgt man dieser Konvention, so kann man ein anonymes Modul erstellen. Hier ergibt sich der Name des Moduls aus dem geladenen Dateinamen - bei dem Groß- und Kleinschreibung zu beachten sind!

Mit `require` kann man dieses Modul wieder anfordern und seinen Rückgabewert weiter verwenden:

### Listing 2b
```js
require(['myFirstModule'], function (myFirstModule) {
    myFirstModule();
});
``` 
Der `require`-Befehl akzeptiert ein Array aus Modulnamen, welche alle fertig geladen sein müssen, bevor die angegebene Callback-Funktion ausgeführt wird. Durch den Callback wird die Definition von Abhängigkeiten und deren tatsächliche Bereitstellung zeitlich voneinander getrennt und die gewünschte Asynchronität komfortabel zur Verfügung gestellt.  Im vorliegenden Beispiel ist der Rückgabewert des Moduls eine einfache Funktion, welche "Hello World" im Browser ausgibt. Bemerkenswert ist die Tatsache, dass es für Verwender des Moduls nicht von Belang ist, welche weiteren Abhängigkeiten benötigt werden. Wie zu erkennen ist, hat das "myFirstModule" nämlich selbst eine Abhängigkeit zum Framework jQuery. Es ergibt sich ein Graph von Abhängkeiten, welche require.js in der korrekten Reihenfolge auflösen wird. Viele Frameworks wie etwa jQuery, Underscore oder Knockout.js bringen AMD-Unterstützung bereits mit, andere Frameworks lassen sich durch ein wenig Konfiguration (so genannte "Shims") als Modul maskieren. Dank der breiten Unterstützung und der Möglichkeit von "Shims" kann man nun Objekte im globalen Gültigkeitsbereich (einer sehr schlechten Praxis) ganz und gar den Kampf ansagen und dennoch die Komplexität der Lösung gering halten.

# Modul ist nicht gleich Modul
Es wurden zwei Arten von Modulen vorgestellt. Module von AngularJS (`angular.module`) sowie Module von Require.js (`define`). Die Vermutung liegt nahe, dass es sich hier um zwei konkurrierende Funktionalitäten handelt. Dies ist zum Teil korrekt. Beide Frameworks dienen der Kapselung von Software und der Definition von Abhängigkeiten. Es besteht jedoch ein gewichtiger Unterschied in der Ausrichtung der beiden Frameworks. 

**Module im AMD-Format** haben einen starken Fokus auf das asynchrone Nachladen von Code. Viele große Frameworks unterstützen das Format. AMD gibt jedoch keine Vorgaben darüber, was der Inhalt eines Moduls ist. Der Rückgabewert eines Moduls sind jede Art von JavaScript Objekt sein. Das "ausmocken" von Abhängkeiten zwecks Unit Tests bzw. das Zurücksetzen von Modulen ist nicht sehr komfortabel (siehe z.B. [3]). 
 
**AngularJS-Module** haben einen starken Fokus auf Dependency Injection (DI), was unerlässlich für Unit Tests ist. Durch die festeren Strukturen (z.B. sind Methoden für Services, Controller oder Filter immer als solche erkennbar) und die gute Unterstützung von Mocking sind AngularJS-Module sehr einfach zu testen. Angular-Core kann jedoch von Haus aus keine Abhängigkeiten nachladen.

Wie sich gezeigt hat, sind AMD-Module und Angular-Module zwei Konzepte, die unterschiedliche Schwerpunkte setzen. Mit ein paar kleinen Anpassungen lassen sich beide Konzepte kombinieren. 

Zuerst muss die Directive `ng-app` entfernt werden, da sonst das Bootstrapping zu früh beginnen würde. Wir können nun nicht mehr auf `DOMContentLoaded` warten, welches bereits dann feuern würde, wenn die wenigen sychron geladenen Scripte bereit stehen würden. Dies ist im folgenden Beispiel lediglich require.js selbst. Es wird fast immer notwendig sein, ein paar Pfade anzupassen und Shims zu setzen. Dies erledigt man mit dem Befehl `require.config`. Anschließend kann die Beispiel-AngularJs Anwendung mittels `require()` angefordert werden.

###Listing 3
```html
<!DOCTYPE html>
<html>
<head>
    <title>Hello World AMD</title>
</head>
<body>

    <h1 ng-controller="exampleController">
        {{model.text}}
    </h1>

    <script src="~/Scripts/require.js"></script>
    <script>
        
        requirejs.config({
            baseUrl: '/Scripts',
            paths: {
                'jquery': 'jquery-2.1.1'
            },
            shim: {
                angular: {
                    exports: 'angular',
                    deps: ['jquery']
                }
            }
        });

        require(['examples/exampleApp']);
    </script>
</body>
</html>
```

Leider hat sich durch die Konfiguration und den `require`-Befehl die Menge an Code ziemlich erhöht. Equivalent zum `require`-Befehl unterstützt require.js die Angabe eines  einzigen Moduls direkt im script-Tag. Es bietet sich an, an dieser zentralen Stelle zunächst die Konfiguration selbst nachzuladen und anschließend die Anwendung anzufordern. So erhält man eine Lösung, die sogar mit einer Zeile weniger als in Listing 1 auskommt.  

###Listing 4a
```html
<!DOCTYPE html>
<html>
<head>
    <title>Hello World AMD</title>
</head>
<body>

    <h1 ng-controller="exampleController">
        {{model.text}}
    </h1>

    <script src="~/Scripts/require.js" data-main="Scripts/init"></script>
</body>
</html>
```
###Listing 4b
```js
//init.js
require(['require', 'require.config'], function (require) {
    require(['examples/exampleApp']);
});
```
Es fehlt nur die Datei für die Anwendung selbst. Laut Quelltext ist diese auf dem Webserver unter dem Pfad "/Scripts/examples/examplesApp.js" aufrufbar, beinhaltet ein AMD-Modul mit dem Namen "examples/exampleApp" sowie darin enthalten ein AngularJS-Modul mit dem Namen "exampleApp". Wie sie sehen, müssen die Module nicht denselben Namen haben. Es liegt an Ihnen, passende Konventionen zu finden.

```js
//exampleApp.js
define(['require', 'angular'], function (require, angular) {

    var app = angular.module('exampleApp', [])
        .controller('exampleController', function ($scope) {

            $scope.model = {
                text: 'Hello World'
            }
        });

    require(['domReady!'], function (domReady) {
        angular.bootstrap(domReady, ['exampleApp']);
    });

    return app;
});
```

Man sieht einen weiteren require-Befehl, welcher ein Loader-Plugin Namens "domReady" anfordert [4]. Loader-Plugins sind am angehängten 

<hr>

# Über Johannes Hoppe

Johannes Hoppe ist selbstständiger Webdesigner, Softwareentwickler und IT-Berater.

Er realisiert seit mehr als 10 Jahren Software-Projekte für das Web und entwickelt moderne Portale auf Basis von ASP.NET MVC und JavaScript. Seine Arbeit konzentriert sich auf SinglePage-Technologien und NoSQL-Datenbanken. Er unterrichtet als Lehrbeauftragter und schreibt über seine Vorlesungen, Trainings und Vorträge in seinem Blog. (http://blog.johanneshoppe.de/)


<hr>
[1] AMD.Format: https://github.com/amdjs/amdjs-api/wiki/AMD  
[2] Require.js: http://requirejs.org/  
[3] Effective Unit Testing with AMD: http://bocoup.com/weblog/effective-unit-testing-with-amd/  
[4] DomReady: XXX



Vor allem aber ist die



<hr>
