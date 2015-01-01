# Optimale Web-Umgebung mit AngularJS und ASP.NET, Teil 3
## Solides Handwerk

### AngularJS und der Microsoft Web Stack ergänzen sich ideal. Lernen Sie in dieser Artikelreihe eine Auswahl von Patterns und Frameworks kennen, welche Sie bei der Adaption und Integration von AngularJS in Ihre .NET-Anwendung berücksichtigen sollten. 

In der ersten Ausgaben dieser Artikelreihe wurden der Modul-Loader require.js vorgestellt. Die zweiten Ausgabe widmete sich dem OData-Protokoll und dem AJAX-Framework breeze.js. Doch waren alle vorgestellten Quellcode-Beispiele tatsächlich fehlerfrei? Es gilt zu beweisen, dass sowohl der C#-Code als auch der JavaScript-Code korrekt implementiert wurde. Dieser Artikel widmet sich daher ganz dem Thema Unit-Testings und zeigt Wege auf, wie sie die Qualität Ihrer Software auf dem Server und auf dem Client sicher stellen können.

#### Code auf Basis des Entity Frameworks testen

In der Ausgabe 02/2015 wurde eine simple Geschäftslogik mit zwei Entitäten eingeführt. Die technische Grundlage bildete das Entity Framework in Version 6 mit dem "Code First"-Ansatz. Die vom Entity Framework erzeugten Instanzen repräsentierten auch gleichzeitig die Geschäftsobjekte. Die Geschäftslogik bestand aus der Entität "Kunde", welche eine beliebige Anzahl an Rechnungen besitzen konnte. 

##### Listing 1a -- Die "Geschäftslogik" aus Ausgabe 02/2015
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
    public DateTime DateOfBirth { get; set; }
    public virtual ICollection<Invoice> Invoices { get; set; }
}

public class Invoice
{
    public int Id { get; set; }
    public decimal Amount { get; set; }

    public int CustomerId { get; set; }                     
    public virtual Customer Customer { get; set; } 
}

public class DataContext : DbContext
{
    public virtual DbSet<Customer> Customers { get; set; }
    public virtual DbSet<Invoice> Invoices { get; set; }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
        modelBuilder.Configurations.Add(new InvoiceMap());
    }
}
~~~~~

Weiterhin wurde ein ASP.NET Web Api Controller verwendet, um eine Liste aller Kunden per REST zur Verfügung zu stellen.  

##### Listing 1b -- Web API Controller aus Ausgabe 02/2015
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

So wie der `CustomersController` in der letzten Ausgabe vorgestellt wurde, lässt dieser sich nur schwer automatisch Testen! Der Code hat eine fest definierte Abhängigkeit auf den DataContext. Durch diese Abhängigkeit auf den `DataContext` kann der Controller nicht mehr losgelöst von allen anderen "Units" getestet werden. Im konkreten Fall würde das Entity Framework stets versuchen, eine Datenbankverbindung aufzubauen. Solange dies der Fall ist, kann ein Unit-Test nicht implementiert werden. Mittels des "Inversion of Control" Prinzips (IoC) lässt sich der Controller jedoch schnell korrigieren. Statt eine Instanz vom `DataContext` selbst zu erzeugen, wird diese einfach dem Konstruktor übergeben: 

~~~~~
public class CustomersController : ApiController
{
    private readonly DataContext db;

    public CustomersController(DataContext dataContext)
    {
        db = dataContext;
    }

    /* [...] */
}
~~~~~

Üblicherweise verwendet man einen IoC-Container, welcher bei der "Dependency Injection" viel Arbeit abnehmen kann. Die Frage nach dem "richtigen" Framework füllt ganze Bücher [X]. Der Quelltext auf der Heft-CD verwendet das Framework Autofac [X], welches ohne Mehraufwand auf eine nahtlose Integration in ASP.NET MVC und ASP.NET Web API bietet (siehe Datei "IocConfig.cs"). 
 
Der Controller istDas Entity Framework unterstützt Unit-Tests, welche mit Objekten im Arbeitsspeicher interagieren.





Das Entity Framework ist ein objektrelationaler Mapper (ORM). Es verbindet die objektorientierte .NET-Welt mit einer relationalen Datenbank wie dem SQL Server. Testet man Code, welcher mit einer Datenbank interagiert, so spricht man von einem Integrationstest. In der Regel sind Integrationstests verhältnismäßig langsam und fehleranfällig. Andererseits sind Sie unverzichtbar, denn nur ein Test gegen eine echte Datenbank stellt sicher, das alle Feinheiten des Ziel-Datenbanksystems berücksichtigt wurden. Idealerweise lässt man Integrationstests regelmäßig automatisch laufen (zum Beispiel einmal Nachts) und verwendet während der Entwicklung bevorzugt Unit-Tests. 
 
Sollten die Entscheidung dennoch auf Unit-Tests per "LINQ to Objects" fallen, sind übrigens keine Anpassungen am `DataContext` Objekt notwendig. Für die Version 5 des Entity Frameworks war es noch notwendig, das Context-Objekt mit einem Interface zu maskieren. Seit Version 6 ist ein Interface nicht mehr notwendig, es da alle relevanten Properties von `DbSet<T>` als virtuell markiert wurden. 

 Dieser Ansatz hilft dabei, mit einfachen Mitteln eine gute Testabdeckung zu erreichen. Leider wird bei "In-Memory"-Daten der "LINQ to Objects" Provider verwendet, welcher sich vom "LINQ to Entities" Provider für echte Datenbankoperationen unterscheidet. Die Limitation bei "In-Memory"-Daten beschreibt Microsoft unter anderem in einem ausführlichen Artikel [1]. 






Listing 1d demonstriert einen solchen Unit-Test, welcher eine simple Liste verwendet. Als Mocking-Framework wird hier NSubstitute [5] eingesetzt:

##### Listing 1d - Ein Unit-Test mit NSubstitute 
```
[Subject(typeof(CustomersController))]
public class When_getting_customers
{
    static CustomersController controller;
    static IQueryable<Customer> result;

    Establish context = () =>
        {
            var data = new List<Customer> 
            { 
                new Customer { FirstName = "Test1" }, 
                new Customer { FirstName = "Test2" } 
            }.AsQueryable();

            var mockSet = Substitute.For<IDbSet<Customer>, DbSet<Customer>>();
            mockSet.Provider.Returns(data.Provider);
            mockSet.Expression.Returns(data.Expression);
            mockSet.ElementType.Returns(data.ElementType);
            mockSet.GetEnumerator().Returns(data.GetEnumerator());

            var mockContext = Substitute.For<DataContext>();
            mockContext.Customers.Returns(mockSet);

            controller = new CustomersController(mockContext);

        };

    Because of = () => { result = controller.GetCustomers(); };

    It should_return_all_customers = () => result.Count().Should().Be(2);
}
``` 





Neben den beiden üblichen Vorgehensweisen (Integrationstests oder Unit-Tests im Arbeitsspeicher) gibt es einen interessanten Zwischenweg. Das Framework "Effort" (**E**ntity **F**ramework **F**ake **O**bjectContext **R**ealization **T**ool) [2]. Effort verwendet eine eigene In-Memory Datenbank und emuliert einen relationalen Datenbankserver. Das Ergebnis ist sehr realitätsnah. Man muss aber beachten, dass Stored Procedures, Views und Trigger nicht unterstützt werden. Dies muss aber kein Problem darstellen. Gerade Stored Procedures werden häufig gescholten, da sie Logik in der Datenbank verlagern. Ähnlich verhält es sich mit Views und Trigger, welche aus der Datenbank eine Black-Box machen. Sofern man die Wahl hat, sollte man daher dem Entity Framework (oder einem anderen ORM) eine führende Rolle überlassen und Stored Procedures, Views und Trigger gar nicht erst verwenden.

Für den "Code First"-Ansatz stellt Effort die `DbConnectionFactory` zur Verfügung. Hiermit lässt sich eine komplett isolierte In-Memory Datenbank erstellen, welche nach der Verwendung wieder verworfen wird. Der Befehl hierfür lautet:

```
DbConnection connection = Effort.DbConnectionFactory.CreateTransient();
````

Nun muss der `DataContext` noch um einen weiteren Konstruktor ergänzt werden, damit dieser die gefälschte Datenbankverbindung akzeptiert:

```
public class DataContext : DbContext
{
    public DataContext() { }
    public DataContext(DbConnection connection) : base(connection, true) { }

    /* [...] */
}
``` 

Das Listing Nr. 1b demonstriert die Verwendung von Effort anhand des CustomersController. In diesem Beispiel wird das Unit-Test Framework Machine.Specifications (MSpec) [3] verwendet. Zusätzlich wird das Framework Fluent Assertions [5], welches die Erweiterungs-Methode "Should()" bereitstellt [4]. Den Quelltext zu allen Listings finden Sie auf der Heft-CD sowie zum Download auf der dotnetpro Website. 

##### Listing 1c - Ein leichtgewichtiger Integrationstest mit Effort 
~~~~~
[Subject(typeof(CustomersController))]
public class When_getting_customers
{
    static CustomersController controller;
    static IQueryable<Customer> result;

    Establish context = () =>
        {
            DbConnection connection = Effort.DbConnectionFactory.CreateTransient();
            DataContext context = new DataContext(connection);
            controller = new CustomersController(context);

            Customer customer1 = new Customer { FirstName = "Test1" };
            Customer customer2 = new Customer { FirstName = "Test2" };

            context.Customers.AddRange(new[] {customer1, customer2});
            context.SaveChanges();
        };

    Because of = () => { result = controller.GetCustomers(); };

    It should_return_all_customers = () => result.Count().Should().Be(2);
}
~~~~~

  

<hr>


# Auf einen Blick

**Johannes Hoppe** ist selbstständiger Webdesigner, Softwareentwickler und IT-Berater.

Er realisiert seit mehr als 10 Jahren Software-Projekte für das Web und entwickelt moderne Portale auf Basis von ASP.NET MVC und JavaScript. Seine Arbeit konzentriert sich auf SinglePage-Technologien und NoSQL-Datenbanken. Er unterrichtet als Lehrbeauftragter und schreibt über seine Vorlesungen, Trainings und Vorträge in seinem Blog. (http://blog.johanneshoppe.de/)

<hr>


[1] MSDN - Testing with a mocking framework (EF6 onwards): http://msdn.microsoft.com/en-us/data/dn314429.aspx
[X] Autofac: http://autofac.org/
[X] Dependency Injection in .NET: ISBN 1935182501
[X] Effort: https://effort.codeplex.com/
[X] MSpec: https://github.com/machine/machine.specifications
[X] Fluent Assertions: http://www.fluentassertions.com/
[X] NSubstitute: http://nsubstitute.github.io/