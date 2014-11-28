# Optimale Web-Umgebung mit AngularJS und ASP.NET, Teil 2
## Gute Kommunikation

### AngularJS und der Microsoft Web Stack ergänzen sich ideal. Lernen Sie in dieser Artikelreihe eine Auswahl von Patterns und Frameworks kennen, welche Sie bei der Adaption und Integration von AngularJS in Ihre .NET-Anwendung berücksichtigen sollten. 

Dank AngularJS ist es ein leichtes, eine Single-Page Anwendung zu entwicken. Durch die klarte Trennung von Client und Server wird eine ebenso klar definierter Datenaustausch zwischen Client und Server unerlässlich. Es bietet sich eine Architektur nach dem **Re**presentational **S**tate **T**ransfer (REST [1]) an. REST generell zu verwenden, gilt heutzutage als Konsens. Doch hinsichtlich der einzusetzenden Protokolle, Formate und Konventionen bleiben diverse Fragen für die praktische Umsetzung offen. Microsoft gibt hier mit dem Open Data Protocol (OData) eine ausführliche und standardisierte Antwort.

#### Die Geschäftslogik

Zur Erläuterung dient eine sehr einfache Geschäftslogik auf Basis des Entity Frameworks Version 6 mit dem "Code First"-Ansatz. Die vom Entity Framework erzeugten Instanzen sollen auch gleichzeitig die Geschäftsobjekte repräsentieren. Bitte beachten Sie, dass die feste Verdrahtung der Geschäftslogik mit einem Objektrelationen Mapper wie dem Entity Framework für eine größere Anwendung sorgfältig abgewägt sein sollte! Für eine triviale Beispiel-Anwendung ist dies aber kein Problem. Es gibt somit die Entität Kunde, welcher eine beliebige Anzahl an Rechnungen besitzen kann.

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

![Abbildung 1](Images/image01_scaffolding.png)]
##### [Abb. 1] Scaffolding in Visual Studio 2013

![Abbildung 1](Images/image01_scaffolding_B.png)]
##### [Abb. 2] Scaffolding in Visual Studio 2013

Visual Studio generiert dabei einen längeren Code, welcher per ASP.NET Web API den Entity Framework-Context zum Erzeugen, Lesen, Ändern und Löschen (CRUD) für die Außenwelt verfügbar macht. Folgender Ausschnitt zeigt die beiden generierten "Read"-Methoden, welche über die HTTP-GET Methode (z.b. GET http://exemple.org/api/Customers) aufgerufen werden kennen. 

##### Listing 1b -- CRUD per generiertem Code (Ausschnitt)
~~~~~
public class CustomersController : ApiController
{
    private DataContext db = new DataContext();

    // GET: api/Customers
    public IQueryable<Customer> GetCustomers()
    {
        return db.Customers;
    }

    // GET: api/Customers/5
    [ResponseType(typeof(Customer))]
    public IHttpActionResult GetCustomer(int id)
    {
        Customer customer = db.Customers.Find(id);
        if (customer == null)
        {
            return NotFound();
        }

        return Ok(customer);
    }

    /* [...] */
}
~~~~~

Auf der Browser-Seite lässt sich dieser Web API Controller über den `$http`-Service von AngularJS aufrufen. Der Service akzeptiert einen String oder ein Konfigurations-Objekt und gibt eine "promise"-Objekt zurück. Dieses Promise-Objekt besitzt zwei Methoden (success und error) über die ein entsprechender Callback registriert werden kann. Die Listings 1c und 1c zeigen, wie das Ergebnis des Web API Aufrufs per AngularJS und Bootstrap als Tabelle dargestellt werden kann.

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
 
#### Zweiter Versuch per OData

Per ASP.NET Web API Konvention ist festgelegt, dass der Aufruf eine Resource ohne weitere Parameter eine Liste aller Entitäten zurück gibt. So wie der in Listing 1b automatisch generierte Code implementiert ist, wird hierbei tatsächlich der gesamte Inhalt der Datenbank herausgeschleudert. Je mehr Daten vorhanden sind, desto unpraktikabler wird dieser Ansatz. Die offensichtliche Lösung für dieses Problem ist die seitweise Einschränkung der Ergebnismenge. Es wäre ein leichtes, das Beispiel zu erweitern um die Ergebnismenge per LINQ einzuschränken. Nur stellt sich dann die Frage, wie die notwendigen Parameter benannt werden sollten. Das OData Protokoll gibt hier mit standartisierten Konventionen die Benamung der Parameter exakt vor, so dass die Verwendung klar und eindeutig wird. [2] In OData 4 heißen die notwendigen Parameter `$top` und `$take`. $top gibt *n* Elemente der Zielmenge zurück, wobei $take *n* Elemente in der Menge überspringt. Möchte man etwa die Kunden 2 bis 7 abrufen, sähe eine Abfrage wie folgt aus:

~~~~~
Customers?$top=5&$skip=2
~~~~~






# Auf einen Blick

**Johannes Hoppe** ist selbstständiger Webdesigner, Softwareentwickler und IT-Berater.

Er realisiert seit mehr als 10 Jahren Software-Projekte für das Web und entwickelt moderne Portale auf Basis von ASP.NET MVC und JavaScript. Seine Arbeit konzentriert sich auf SinglePage-Technologien und NoSQL-Datenbanken. Er unterrichtet als Lehrbeauftragter und schreibt über seine Vorlesungen, Trainings und Vorträge in seinem Blog. (http://blog.johanneshoppe.de/)


<hr>
[1] Roy Thomas Fielding - REST: http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm
[2] OData Version 4.0 - URL Conventions - http://docs.oasis-open.org/odata/odata/v4.0/odata-v4.0-part2-url-conventions.html