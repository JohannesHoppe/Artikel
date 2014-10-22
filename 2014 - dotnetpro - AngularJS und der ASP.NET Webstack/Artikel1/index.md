# Optimale Web-Umgebung mit AngularJS und ASP.NET, Teil 1
## Am Anfang war das Modul

### AngularJS und der Microsoft Web Stack ergänzen sich ideal. Lernen Sie in dieser Artikelreihe eine Auswahl von Patterns und Frameworks kennen, welche Sie bei der Adaption und Integration von AngularJS in Ihre .NET-Anwendung berücksichtigen sollten. 

Erste Schritte mit AngularJS sind leicht gemacht. Hierfür haben Sie in den Ausgaben 10/2014 und 11/2014 der dotnetpro die Grundlagen von AngularJS kennen gelernt. Im letzten Artikel kam auf dem Server node.js mit dem Express-Framework zum Einsatz. Der durchgängige Einsatz von JavaScript im Browser und auf dem Server ist jedoch nicht zwingend notwendig. AngularJS lässt sich ebenso gut mit Microsoft Technologien kombinieren. Dies hat den gewichtigen Vorteil, dass vorhandenes Wissen im Team sowie vorhandene Infrastruktur weiter verwendet werden kann. Unter Umständen kann es auch sinnvoll sein, existierende Web-Anwendungen auf Basis von ASP.NET Webforms oder ASP.NET MVC mithilfe von Angular zu modernisieren. In den nächsten drei Ausgaben der dotnetpro zu AngularJS sei daher der Fokus wieder mehr auf die .NET-Welt gerichtet.

Anhand einer fiktiven Web-Anwendung werden drei häufige Schwerpunkte in drei Artikeln betrachtet:
1. Das Laden von JavaScript-Dateien und die Verwaltung von Abhängigkeiten
2. Asynchronen Datenübertragung per OData / Web API
3. Unit-Testing auf dem Server und dem Client 

Hierzu werden drei weitere JavaScript-Frameworks in den jeweiligen Ausgaben vorgestellt:
1. Der Modul-Loader require.js
2. Das AJAX-Framework Breeze.js
3. Das Unit-Test-Framework Jasmine

Der erste Teil dieser Artikelreihe beleuchtet zunächst nur das Framework require.js. Die fiktive Web-Anwendung basiert auf ASP.NET MVC mit der Razor View Engine. Alle gezeigten Beispiele lassen sich ohne großen Aufwand auch auf die ASPX View Engine oder ASP.NET Web Forms anwenden, da im Endeffekt nur eine einzige HTML-Seite erzeugt wird (Single-Page Ansatz). 

#### Modulares AngularJS
In der Ausgabe 10/2014 wurde das modulare Prinzip von AngularJS mittels "angular.module" vorgestellt. Das Beispiel in Listing 1 demonstriert dies erneut. Mittels der Directive `ngApp` wird hier das Modul "exampleApp"  mit dem darin enthaltenen Controller "exampleController" ausgeführt.  Hinter dem Befehl versteckt sich ein mehrstufiger Prozess, den AngularJS schlicht "Bootstrapping" nennt. Dies geschieht, sobald das HTML-Dokument komplett fertig geladen wurde (`DOMContentLoaded` Event).

##### Listing 1a -- HelloWorld.cshtml
~~~~~
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
~~~~~

##### Listing 1b -- Die Datei helloWorld.js mit einem Angular-Modul
~~~~~
angular.module('exampleApp', [])
    .controller('exampleController', function($scope) {

        $scope.model = {
            text: 'Hello World'
        }
    });
~~~~~

#### Modulares JavaScript
Das gezeigte Einfügen von JavaScript-Dateien durch Script-Tags funktioniert tadellos. Ebenso verhält es sich, wenn man die die "Bundling and Minification"-Funktionalität aus dem System.Web.Optimization-Namespace von ASP.NET MVC verwendet. Der Browser wird alle angebenden JavaScript-Dateien bzw. Bundles **synchron laden** und das `DOMContentLoaded` Event auslösen, sobald alle Dateien verfügbar sind. Leider hat dieser klassische Ansatz eine Reihe von Nachteilen. So erscheint erst dann der gewünschten Output, wenn sowohl der DOM als auch alle JavaScript-Dateien geladen wurden. In einer größeren Anwendung kann dies trotz vieler Optimierungsmöglichkeiten eine ganze Weile dauern. Die notwendige Lade-Reihenfolge der Scripte ist nur durch technisches Hintergrundwissen zu bestimmen. Einer JavaScript-Datei ist nämlich nicht sofort anzusehen, welche Abhängigkeiten auf anderen Dateien bestehen. So gestaltet es sich aufwendig und umständlich, ausschließlich nur die Scripte zum Start zu laden, die tatsächlich benötigt werden. Zu allem Überfluss bringt die Einbindung von Scripts aus einem Content Delivery Network (CDN) erneut Komplexität in die Lösung.

Kurzum: Einen ganzen Strauß an Problemen kann man vermeiden, wenn man seine Scripte im Browser **asynchron lädt**. Hierfür gibt es eine Reihe von Formaten und Frameworks. In der dotnetpro 11/2014 wurde als Modul-Loader Browserify vorgestellt - welcher das "CommonJS"-Format verwendet (erkennbar am Befehl `module.exports`). Doch CommonJs Module sind nicht für eine asynchrone Verwendung im Browser ausgelegt. Wer JavaScript ausschließlich für den Browser entwickelt, sollte als Standard das "**Asynchronous** Module Definition (AMD)"-Format [1] kennen. Bitte evaluieren Sie vorab, welche Features Sie von einem Modul-Loader erwarten. Sowohl Browserify als auch AMD/require.js haben ihre Berechtigung. Im Zweifelsfall macht man mit AMD nichts falsch. Die Referenzimplentierung von AMD wird durch das Framework require.js [2] gestellt. Sollte das das eigene Projekt sowohl AMD als auch CommonJS-Module benötigen, so hilft curl.js [3] aus der Misere. 

AMD ist schnell erklärt, da man prinzipiell nur zwei globale Methoden benötigt: `define` und `require`. Wie der Name vermuten lässt, definiert `define` ein AMD-Modul.

##### Listing 2a -- Die Datei myFirstModule.js im AMD-Format
~~~~~
define(['jquery'], function($) {
    var result = function() {
        $('body').text('Hello World');
    }
    return result;
});
~~~~~

Idealerweise befindet sich in einer JavaScript-Datei auch immer nur ein AMD-Modul. Folgt man dieser Konvention, so kann man ein anonymes Modul erstellen. Hier ergibt sich der Name des Moduls aus dem geladenen Dateinamen - bei dem Groß- und Kleinschreibung zu beachten sind!

Mit `require` kann man dieses Modul wieder anfordern und dessen Rückgabewert weiter verwenden:

##### Listing 2b -- myFirstModule verwenden
~~~~~
require(['myFirstModule'], function (myFirstModule) {
    myFirstModule();
});
~~~~~ 
Der `require`-Befehl akzeptiert ein Array aus Modulnamen, welche alle vollständig geladen sein müssen, bevor die angegebene Callback-Funktion ausgeführt wird. Durch den Callback wird die Definition von Abhängigkeiten und deren tatsächliche Bereitstellung zeitlich voneinander getrennt und die gewünschte Asynchronität komfortabel zur Verfügung gestellt. Im vorliegenden Beispiel ist der Rückgabewert des Moduls eine einfache Funktion, welche "Hello World" im Browser ausgibt. Bemerkenswert ist die Tatsache, dass es für Verwender des Moduls nicht von Belang ist, welche weiteren Abhängigkeiten benötigt werden. Wie zu erkennen ist, hat das "myFirstModule" nämlich selbst eine Abhängigkeit zum Framework jQuery. Es ergibt sich ein Graph von Abhängigkeiten, welche require.js in der korrekten Reihenfolge auflösen wird. Viele Frameworks wie etwa jQuery, Underscore oder Knockout.js bringen AMD-Unterstützung bereits mit, andere Frameworks lassen sich durch ein wenig Konfiguration (so genannte "Shims") als Modul wrappen. Dank der breiten Unterstützung und der Möglichkeit von "Shims" kann man nun Objekten im globalen Gültigkeitsbereich (einer sehr schlechten Praxis) ganz und gar den Kampf ansagen und dennoch die Komplexität der Lösung gering halten.

#### Modul ist nicht gleich Modul
Es wurden zwei Arten von Modulen vorgestellt. Module von AngularJS (`angular.module`) sowie Module von Require.js (`define`). Die Vermutung liegt nahe, dass es sich hier um zwei konkurrierende Funktionalitäten handelt. Dies ist in der Tat der Fall! Beide Frameworks dienen der Kapselung von Software und der Definition von Abhängigkeiten. Es besteht jedoch ein gewichtiger Unterschied in der Ausrichtung der beiden Frameworks. 

**Module im AMD-Format** haben einen starken Fokus auf das asynchrone Nachladen von Code. Viele bekannte JavaScript-Frameworks unterstützen das Format. AMD macht jedoch keine strengen Vorgaben darüber, was der Inhalt eines Moduls ist. Der Rückgabewert eines Moduls kann jede Art von JavaScript Objekt sein. Das "ausmocken" von Abhängigkeiten zwecks Unit Tests bzw. das Zurücksetzen von Modulen ist hingegen nicht sehr komfortabel (siehe z.B. [4]). 
 
**AngularJS-Module** haben einen starken Fokus auf Dependency Injection (DI), was unerlässlich für Unit Tests ist. Durch die strengen Strukturen (z.B. sind Methoden für Services, Controller oder Filter immer als solche erkennbar) und die gute Unterstützung von Mocking sind AngularJS-Module sehr einfach zu testen. AngularJS kann jedoch von Haus aus keine Abhängigkeiten nachladen. Es gibt noch den asynchronen "angular-loader", welcher aber keinen großen Funktionsumfang bietet.

#### AngularJS mit AMD kombinieren
AMD-Module und Angular-Module sind somit zwei Konzepte, die unterschiedliche Schwerpunkte setzen. Mit ein paar kleinen Anpassungen lassen sich beide Welten kombinieren. 

Zuerst muss die Directive `ng-app` entfernt werden, da sonst das Bootstrapping zu früh beginnen würde. Man darf nicht mehr auf `DOMContentLoaded` warten, welches bereits dann feuern würde, wenn die wenigen synchron geladenen Scripte bereit stehen würden. Dies ist im folgenden Beispiel lediglich require.js selbst. Es wird weiterhin fast immer notwendig sein, ein paar Pfade anzupassen und Shims zu setzen. Dies erledigt man mit dem Befehl `require.config`. Anschließend kann die AngularJs Anwendung mittels `require()` angefordert werden.

##### Listing 3 -- HelloWorld.cshtml wird um require.js ergänzt
~~~~~
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
~~~~~

Leider hat sich durch die Konfiguration und den `require`-Befehl die Anzahl der Codezeilen im Vergleich zu Listing 1 erhöht. Doch zum Glück unterstützt require.js die Angabe eines  einzigen Moduls direkt im script-Tag. Es bietet sich an, an dieser zentralen Stelle zunächst die Konfiguration selbst nachzuladen (hier "require.config" genannt) und anschließend die Anwendung anzufordern. So erhält man eine Lösung, die im Vergleich mit einer Zeile weniger auskommt.  

##### Listing 4a -- HelloWorld.cshtml refactored
~~~~~
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
~~~~~

##### Listing 4b -- Die Datei init.js im AMD-Format
~~~~~
require(['require', 'require.config'], function (require) {
    require(['examples/exampleApp']);
});
~~~~~

Es fehlt zur Vervollständigung des Beispiels jene Datei für die Anwendung selbst. Laut Quelltext ist diese auf dem Webserver unter dem Pfad "/Scripts/examples/examplesApp.js" aufrufbar, beinhaltet ein AMD-Modul mit dem Namen "examples/exampleApp" sowie darin enthalten ein AngularJS-Modul mit dem Namen "exampleApp". Wie Sie sehen, müssen die beiden Modul-Welten nicht denselben Namen haben. Es liegt an Ihnen, für die Benennung und Verzeichnisorganisation passende Konventionen zu finden.

##### Listing 4c -- Die Datei exampleApp.js im AMD-Format mit Angular-Modul
~~~~~
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
~~~~~

Ungeklärt ist immer noch das Bootstrapping, welches nicht mehr über `ng-app` realisiert werden kann. Man sieht in Listing 4c hierfür einen require-Befehl, welcher ein Loader-Plugin Namens "domReady" anfordert [5]. Loader-Plugins sind am angehängten Ausrufezeichen erkennbar. DomReady wartet, wie der Name vermuten lässt, darauf das der DOM bereitsteht - was entweder umgehend der Fall ist oder mit dem `DOMContentLoaded` Event geschieht. Wie für Scripte dieser Art üblich, wird die fehlende Standardkonformität älterer IE-Browser ausgebügelt. Der Trick in dem verschachtelten Aufbau besteht darin, dass beim Aufruf von `angular.bootstrap` bereits alle AMD-Abhängigkeiten geladen wurden und damit ebenso die notwendigen Angular-Module definiert sind. Da alle notwendigen Dateien geladen sind, ist es an der Zeit das AngularJS-Bootsrapping zu beginnen. Et voilà - die ersten beiden Zutaten aus unserem Technologiemix sind angerichtet!

##### In Produktion gehen
Die Anwendung ist nun in der Lage, JavaScript-Dateien asynchron nachzuladen. Das ist während der Entwicklung sehr praktisch, aber leider werden nun viele kleine JavaScript-Dateien durch die Leitung geschickt. Bitte denken Sie daran, den RequireJS Optimizer "r.js" [6] einzusetzen, um AMD-Module zu einem Bundle zusammenzufügen. Es gibt viele Möglichkeiten diesen Schritt regelmäßig anzustoßen. Sie sollten solche Aufgaben dem Build-Server überlassen. Sofern dies keine Option ist, kann man auch ganz pragmatisch den Aufruf von des RequireJS Optimizer in das "AfterBuild Target" der jeweiligen Projektdatei aufnehmen. AngularJS lädt übrigens Templates dynamisch nach, wenn Sie über das Property `templateUrl` definiert wurden (`templateUrl` wurde in den letzten beiden Ausgaben vorgestellt). Dies gilt es zu vermeiden, um die Performance der Anwendung nicht negativ zu beeinflussen. AngularJS verwendet intern den so gennanten $templateCache [7], welchen man auch selbst vorab befüllen kann. Es bietet sich an, das Bundling-Feature aus System.Web.Optimization für Angular-Templates zu verwenden:

##### Listing 5 -- Bundling mit Angular-Templates
~~~~~
public static void Register(BundleCollection bundles)
{
    bundles.Add(new AngularJsHtmlBundle("~/bundles/templateCache")
        .Include("~/Content/*.html"));
}
~~~~~

Den vollständigen Quelltext des "AngularJsHtmlBundle" steht als Download und auf der Heft-CD bereit. Die Idee stammt aus einem Blog-Eintrag von  Boyan Mihaylov [8].

##### Fazit und Ausblick
Die vorgestellte AMD-Unterstützung in einem AngularJS-Projekt wird sich garantiert mehrfach auszeichnen, denn die Software kann sich nun aus dem großen Fundus an bestehenden AMD-kompatiblen Bibliotheken bedienen. Die Verwendung von zwei Modul-Welten ist zudem leicht mit ein paar wenigen Code-Zeilen umsetzbar. Für die zukünftige Version 2 von AngularJS kann man übrigens auf eine direktere Unterstützung von modularem Laden dank ES6-Modulen (ECMAScript 6) gespannt sein [9]. Dank require.js und AMD muss man jedoch nicht auf eine zukünftige Lösung durch AngularJS warten! Durch die Verwendung des AMD-Patterns ist übrigens der Einsatz eines Task-Runners wie Grunt nicht notwendig. Zusätzlichen Anpassungen im Build-Prozess müssen nicht zwingend durchgeführt werden.

Es liegt in der Natur der Sache, dass bei einer SinglePage-Anwendung die verwendete Server-Technologie zunächst in den Hintergrund tritt. Ob nun ASP.NET Webforms, ASP.NET MVC oder auch nur eine simple Index.html eingesetzt wird, war für die bisherige Betrachtung fast unerheblich. Dies wird sich jedoch in der nächsten Ausgabe ändern, wenn die Verwendung der ASP.NET Web API beleuchtet wird. Dank OData und dem AMD-kompatiblen Ajax-Framework Breeze.js kann ASP.NET hier seine Stärken besser ausspielen.

<hr>

##### Infobox: Verwendete Nuget Pakete

Alle hier vorstellten JavaScript-Frameworks lassen sich per Nuget einbinden. Den vollständigen Quelltext finden Sie als Download bzw. auf der Heft-CD.

* PM> Install-Package AngularJS.Core
* PM> Install-Package jQuery
* PM> Install-Package RequireJS

<hr>



# Auf einen Blick

**Johannes Hoppe** ist selbstständiger Webdesigner, Softwareentwickler und IT-Berater.

Er realisiert seit mehr als 10 Jahren Software-Projekte für das Web und entwickelt moderne Portale auf Basis von ASP.NET MVC und JavaScript. Seine Arbeit konzentriert sich auf SinglePage-Technologien und NoSQL-Datenbanken. Er unterrichtet als Lehrbeauftragter und schreibt über seine Vorlesungen, Trainings und Vorträge in seinem Blog. (http://blog.johanneshoppe.de/)


<hr>
[1] AMD.Format: https://github.com/amdjs/amdjs-api/wiki/AMD  
[2] Require.js: http://requirejs.org/  
[3] Curls.js: https://github.com/cujojs/curl
[4] Effective Unit Testing with AMD: http://bocoup.com/weblog/effective-unit-testing-with-amd/  
[5] domReady Plugin: https://github.com/requirejs/domready
[6] RequireJS Optimizer: http://requirejs.org/docs/optimization.html
[7] $templateCache: https://docs.angularjs.org/api/ng/service/$templateCache
[8] Bundling AngularJS HTML pages with ASP.NET: http://code.dortik.net/bundling-angularjs-html-pages-with-asp-net/
[9] AngularJS 2.0: http://angularjs.blogspot.de/2014/03/angular-20.html 
