# Optimale Web-Umgebung mit AngularJS und ASP.NET, Teil 2
## Gute Kommunikation

### AngularJS und der Microsoft Web Stack ergänzen sich ideal. Lernen Sie in dieser Artikelreihe eine Auswahl von Patterns und Frameworks kennen, welche Sie bei der Adaption und Integration von AngularJS in Ihre .NET-Anwendung berücksichtigen sollten. 

In einer typischen ASP.NET MVC oder Web Forms Anwendung kann es leicht geschehen, dass eine saubere Trennung von Daten und Layout verloren geht. Setzt man auf eine Single-Page-Anwendung, so hat man die Gelegenheit den Datenfluss zu überdenken und neu zu definieren. Es bietet sich eine Architektur nach dem **Re**presentational **S**tate **T**ransfer (REST [1]) an. Doch hinsichtlich der einzusetzenden Protokolle, Formate und Konventionen bleiben diverse Fragen für die praktische Umsetzung von REST offen. Wie sollen etwa die Query-Parameter heißen? Welchem Format soll eine Antwort genügen? Wie lassen sich die Schnittstellen maschinenlesbar definieren? Microsoft gibt hier mit dem Open Data Protocol (OData) eine ausführliche und standardisierte Antwort.

#### Die Geschäftslogik

In diesem Artikel dient zur Erläuterung dient eine sehr einfache Geschäftslogik auf Basis des Entity Frameworks Version 6. Es wird der "Code First"-Ansatz verwendet. Die vom Entity Framework erzeugten Instanzen sollen auch gleichzeitig die Geschäftsobjekte repräsentieren. Bitte beachten Sie, dass die feste Verdrahtung der Geschäftslogik mit einem Objektrelationen Mapper wie dem Entity Framework für eine größere Anwendung sorgfältig abgewägt sein sollte! Für eine Beispiel-Anwendung ist dies aber kein Problem. Es gibt somit die Entität Kunde, welcher eine beliebige Anzahl an Rechnungen besitzen kann.

##### Listing 1a -- Die "Geschäftslogik"
~~~~~
public class Customer
{
    public Customer()
    {
        Invoices = new List<Invoice>();
    }

    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Mail { get; set; }
    public DateTime Date { get; set; }
    public ICollection<Invoice> Invoices { get; set; }
}

public class Invoice
{
    public int Id { get; set; }
    public decimal Amount { get; set; } 
}

public class DataContext : DbContext, IDataContext
{
    public DbSet<Customer> Customers { get; set; }
}
~~~~~

#### Daten per Web API abrufen

Als erster Anwendungsfall soll eine Liste von Kunden angezeigt wird. Für diese häufig benötigte Aufgabe existiert sogar ein "Scaffolding" T4-Template in Visual Studio 2013. (Auswahl: "Web API 2 Controller with actions, using Entity Framework")

![Abbildung 1](Images/image01_scaffolding.png)
##### [Abb. 1] Scaffolding in Visual Studio 2013

![Abbildung 2](Images/image01_scaffolding_B.png)
##### [Abb. 2] Scaffolding in Visual Studio 2013

Visual Studio generiert dabei einen längeren Code, welcher per ASP.NET Web API den Entity Framework-Context zum Erzeugen, Lesen, Ändern und Löschen (CRUD) für die Außenwelt verfügbar macht. In einer an REST orientierten Schnittstelle kann man diese atomaren Operationen mit dem HTTP-Verben POST, GET, PUT und DELETE ausdrücken. Folgender Aufruf gibt etwa eine Liste von Kunden zurück:

~~~~~
GET: http://example.org/api/Customers
~~~~~  

Passende dazu zeigt der Ausschnitt aus Listing 1b die von Visual Studio generierte "READ"-Methode.

##### Listing 1b -- Web API Controller per generiertem Code (Ausschnitt)
~~~~~
public class CustomersController : ApiController
{
    private DataContext db = new DataContext();

    // GET: api/Customers
    public IQueryable<Customer> GetCustomers()
    {
        return db.Customers;
    }

    /* [...] */
}
~~~~~

Mit AngularJS  lässt sich dieser Web API Controller über den `$http`-Service aufrufen. Der Service akzeptiert einen String oder ein Konfigurations-Objekt. Der Rückgabewert der Methode ist ein "promise"-Objekt, welches die Methoden (success und error) besitzt. Über diese beiden Methoden lassen Callback für einen erfolgreichen bzw. fehlerhaften Aufruf registrieren. Das Listings 1c zeigt den vollständigen Code, um Daten per `$http` zu landen. Listing 1c demonstriert, wie die empfangenen Daten mittels `ng-repeat` und dem CSS-Framework Bootstrap [2] tabellarisch dargestellt werden können.

##### Listing 1c -- AngularJS Controller fragt Daten per GET ab
~~~~~
define(['angular'], function(angular) {

    return angular.module('listing1', [])
        .controller('listing1Controller', [
            '$scope', '$http', function($scope, $http) {

                $scope.customers = [];

                $http.get('/api/Customers').success(function(data) {
                    $scope.customers = data;
                });
            }
        ]);
});
~~~~~ 


##### Listing 1d -- AngularJS Template rendert Daten als Tabelle
~~~~~
<div class="table-responsive">
    <table class="table table-striped">
        <thead>
            <tr>
                <th>#</th>
                <th>FirstName</th>
                <th>LastName</th>
                <th>Mail</th>
            </tr>
        </thead>
        <tbody>
            <tr ng-repeat="customer in customers">
                <td ng-bind="customer.Id"></td>
                <td ng-bind="customer.FirstName"></td>
                <td ng-bind="customer.LastName"></td>
                <td><a ng-href="mailto:{{customer.Mail}}" ng-bind="customer.Mail"></a></td>
            </tr>
        </tbody>
    </table>
</div>
~~~~~ 

![Abbildung 3](Images/image02_bootstrap_tabelle.png)
##### [Abb. 3] Die Tabelle aus Listing 1d im Bootstrap-Design


#### Zweiter Versuch per OData

Die Konventionen der Web API legen fest, dass der Aufruf eine Ressource ohne weitere Parameter eine Liste aller Entitäten zurück gibt. Der Code aus Listing 1b wird hierbei tatsächlich der gesamte Inhalt der Datenbank-Tabelle ausgeben! Je mehr Daten vorhanden sind, desto unpraktikabler wird dieser Ansatz. Es fehlt eine seitenweise Einschränkung der Ergebnismenge. An diesem Punkt stellt sich die Frage, wie die notwendigen Query-Parameter in der URL benannt werden sollten. Man könnte etwa "page" und "pagesize" verwenden. Man könnte sich auch von LINQ inspirieren lassen und auf "skip" und "take" setzen. Man könnte aber auch einen HTTP Range-Header [3] setzen, um die Menge an Entitäten einzuschränken (Erläuterung siehe [4]).

Die Entscheidungsmatrix lässt sich beliebig weiterführen und auf weitere Probleme ausweiten. Klärungsbedarf innerhalb eines Teams sind vorbestimmt. Die Entscheidungsfindung lässt sich gänzlich vermeiden, wenn man auf das OData Protokoll setzt. OData gibt die Namen der Parameter exakt vor, so dass die Verwendung unstrittig wird [5]. Die notwendigen Parameter heißen `$top` und `$skip`. `$top` gibt *n* Elemente der Ergebnismenge zurück. `$skip` überspringt *n* Elemente in der Ergebnismenge. Möchte man z.B. die Kunden mit der fortlaufenden Nummer 3 bis 7 abrufen, so verwendet man folgendes Query:

~~~~~
GET: http://example.org/odata/Customers?$top=5&$skip=2
~~~~~

Weitere Query-Parameter sind unter anderem `$filter`, `$orderby`, `$count` oder `$search`. Der bestehende Web API Controller kann durch ein paar Änderungen um die Funktionalität von OData ergänzt werden. Der Controller muss hierzu vom ODataController erben. Weiterhin ist es notwendig, das Funktionalität per `[EnableQuery]` explizit freizuschalten.    

##### Listing 2a -- OData v3 Controller (Ausschnitt)
~~~~~
public class CustomersController : ODataController
{
    private DataContext db = new DataContext();

    // GET: odata/Customers
    [EnableQuery]
    public IQueryable<Customer> GetCustomers2()
    {
        return db.Customers;
    }

    /* [...] */
}
~~~~~

#### Infobox: Hinweis zu den verschiedenen OData-Versionen 
Das OData-Protokoll in der Version 4 wurde bereits im Frühjahr 2014 als OASIS Standard bestätigt. Dennoch vollzieht sich die Adaption der neuesten Version bislang noch recht schleppend. Grund dafür mag sein, dass Microsoft in den letzten Jahren mehrere miteinander inkompatiblem OData-Spezifikationen herausgebracht hat. Auch verhielten sich in der Vergangenheit die serverseitigen Implementierungen von OData für Web API und WCF unterschiedlich, was den Sinn einer Spezifikation konterkariert. Den Autoren von Client-Bibliotheken und damit auch den Anwendern wurde das Leben so unnötig schwer gemacht. Das Framework data.js, welches die Grundlage von breeze.js ist, hat noch keine stabile Unterstützung von OData v4. Selbst in Visual Studio hat zum Zeitpunkt des Schreibens hat noch kein "Scaffolding"-Template für OData v4 existiert. Der Menüpunkt "Web API 2 OData Controller with actions, using Entity Framework" erzeugt Code für die Version 3 des OData Protokolls. Verwendet man das Template, so werden ebenso die Nuget-Pakete für das alte Protokoll eingebunden! Da hätte man mehr von Microsoft erwarten können. Immerhin hat Telerik mit dem "November 2014" Release des Kendo UI Framweworks jüngst Support für die neueste Version nachgeliefert. **Um Inkompatibilitäten zu vermeiden, basieren alle Beispiele in diesem Artikel auf der gut etablierten Version 3 von OData.** Sollten Sie sich nicht sicher sein, welche Version ein OData Service implementiert, so lässt sich dies über das Metadaten-Dokument herausfinden (z.B. http://example.org/odata/$metadata).

# Auf einen Blick

**Johannes Hoppe** ist selbstständiger Webdesigner, Softwareentwickler und IT-Berater.

Er realisiert seit mehr als 10 Jahren Software-Projekte für das Web und entwickelt moderne Portale auf Basis von ASP.NET MVC und JavaScript. Seine Arbeit konzentriert sich auf SinglePage-Technologien und NoSQL-Datenbanken. Er unterrichtet als Lehrbeauftragter und schreibt über seine Vorlesungen, Trainings und Vorträge in seinem Blog. (http://blog.johanneshoppe.de/)


<hr>
[1] Roy Thomas Fielding - REST: http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm
[2] Bootstrap: http://getbootstrap.com/
[3] HTTP/1.1 (RFC 2616) Abschnitt 14.35.2 - Range Retrieval Requests: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.35.2
[4] John Gietzen - Range header: http://otac0n.com/blog/2012/11/21/range-header-i-choose-you.html
[5] OData Version 4.0 - URL Conventions - http://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part2-url-conventions.html