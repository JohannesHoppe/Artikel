# Optimale Web-Umgebung mit AngularJS und ASP.NET, Teil 1
## Gute Kommunikation

### AngularJS und der Microsoft Web Stack ergänzen sich ideal. Lernen Sie in dieser Artikelreihe eine Auswahl von Patterns und Frameworks kennen, welche Sie bei der Adaption und Integration von AngularJS in Ihre .NET-Anwendung berücksichtigen sollten. 

Für nahezu jede Webanwendung ist ein wohl definierter Datenaustausch zwischen Client und Server unerlässlich. Eine Single-Page-Architektur, wie Sie AngularJS vorgibt, ergänzt sich hierbei vortrefflich mit den Prinzipien des **Re**presentational **S**tate **T**ransfer (REST). Es gilt unter Entwicklern als Konsens, dass die Verwendung des REST-Architekturstils in der Webentwicklung so gut wie immer angebracht ist. REST ist jedoch kein Standard, sondern basiert auf einer abstrakten Dissertation von Roy Thomas Fielding [1]. Hinsichtlich der einzusetzenden Protokolle, Formate und Konventionen bleiben diverse Fragen für die praktische Umsetzung offen. Microsoft gibt hier mit dem Open Data Protocol (OData) eine ausführliche und standardisierte Antwort. Im folgenden Text wird zunächst ein simpler Web API OData Service aufgesetzt und dieser anschließend von einer AngularJS-Anwednung abgefragt.

Die Geschäftslogik

Zur Erläuterung dient eine sehr einfache Geschäftslogik auf Basis des Entity Frameworks Version 6 mit dem "Code First" Ansatz. Die vom Entity Framework erzeugten Instanzen sollen auch gleichzeitig die Geschäftsobjekte repräsentieren. Bitte beachten Sie, dass die feste Verdrahtung der Geschäftslogik mit einem Objektrelationen Mapper wie dem EF in der Praxis sorgfältig überlegt sein sollte! Für eine triviale Anwendung ist dies aber kein Problem. Es gibt somit die Entität Kunde, welcher eine beliebige Anzahl an Rechnungen besitzen kann.

##### Listing 1a -- Die "Geschäftslogik"
~~~~~
public class Customer
{
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

Mit diesem Model lässt sich bereits ein erster Anwendungsfall erstellen:
**Die AngularJS-Anwendung soll eine Liste von Kunden anzeigen. **
In Visual Studio 2013 existiert für diese einfache Aufgabe sogar ein "Scaffolding"-Template. Rechter Mausklick im "Solution Explorer" auf "Controllers" > "Add" > "Controller". Dort wählt man "Web API 2 Controller with actions, using Entity Framework" aus und gibt im folgenden Formular die passenden Werte an.  

![Abbildung 1](Images/image01_scaffolding_B.png)]
##### [Abb. 1] Scaffolding in Visual Studio 2013

Visual Studio generiert dabei folgenden Code, welcher für den Anfang gar nicht so verkehrt ist.

##### Listing 1b -- Generierter Code
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


 

 

# Auf einen Blick

**Johannes Hoppe** ist selbstständiger Webdesigner, Softwareentwickler und IT-Berater.

Er realisiert seit mehr als 10 Jahren Software-Projekte für das Web und entwickelt moderne Portale auf Basis von ASP.NET MVC und JavaScript. Seine Arbeit konzentriert sich auf SinglePage-Technologien und NoSQL-Datenbanken. Er unterrichtet als Lehrbeauftragter und schreibt über seine Vorlesungen, Trainings und Vorträge in seinem Blog. (http://blog.johanneshoppe.de/)


<hr>
[1] Roy Thomas Fielding - REST: http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm
