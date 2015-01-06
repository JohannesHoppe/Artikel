using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AngularDemo.Models;
using AutoPoco;
using AutoPoco.DataSources;
using AutoPoco.Engine;


namespace AngularDemo.Controllers
{
    public class ResetController : ApiController
    {
        private readonly DataContext db;

        public ResetController(DataContext db)
        {
            this.db = db;
        }

        /// <summary>
        /// Resets the demo data to its initial state
        /// </summary>
        /// <returns>200 and a text</returns>
        public HttpResponseMessage Get()
        {
            var DemoData = GenerateDemoCustomers();

            db.Invoices.RemoveRange(db.Invoices.Select(i => i));
            db.Customers.RemoveRange(db.Customers.Select(c => c));
            db.SaveChanges();

            foreach (var customer in DemoData)
            {
                db.Customers.Add(customer);
                db.SaveChanges();

                var invoices = GenerateDemoInvoices(customer.Id);

                foreach (var invoice in invoices)
                {
                    invoice.Customer = customer;
                    invoice.CustomerId = customer.Id;
                    customer.Invoices.Add(invoice);
                }

                db.SaveChanges();
            }
            

            return Request.CreateResponse(HttpStatusCode.OK, "Demo Data was resetted!");
        }

        private static IEnumerable<Customer> GenerateDemoCustomers()
        {
            IGenerationSessionFactory factory = AutoPocoContainer.Configure(x =>
            {
                x.Conventions(c => c.UseDefaultConventions());
                x.AddFromAssemblyContainingType<Customer>();

                x.Include<Customer>()
                    .Setup(c => c.FirstName).Use<FirstNameSource>()
                    .Setup(c => c.LastName).Use<LastNameSource>()
                    .Setup(c => c.Mail).Use<EmailAddressSource>()
                    .Setup(c => c.DateOfBirth).Use<DateOfBirthSource>();
            });

            IGenerationSession session = factory.CreateSession();
            return session.List<Customer>(1000)
                  .First(100)
                      .Impose(x => x.LastName, "Ashton")
                  .Next(100)
                      .Impose(x => x.LastName, "Smith")
                  .Next(100)
                      .Impose(x => x.LastName, "Dexter")
                  .Next(100)
                      .Impose(x => x.LastName, "Grimes")
                  .Next(100)
                      .Impose(x => x.LastName, "Walsh")
                  .Next(100)
                      .Impose(x => x.LastName, "Rhee")
                  .Next(100)
                      .Impose(x => x.LastName, "Horvath")
                  .Next(100)
                      .Impose(x => x.LastName, "Dixon")                  
                  .Next(100)
                      .Impose(x => x.LastName, "Jones")
                  .Next(100)
                      .Impose(x => x.LastName, "Martinez")
                  .All()
                  .Get();
                    
        }

        private static IEnumerable<Invoice> GenerateDemoInvoices(int customerId)
        {
            Random rnd = new Random(customerId);
            int amountOfInvoices = rnd.Next(0, 10);

            IGenerationSessionFactory factory = AutoPocoContainer.Configure(x =>
            {
                x.Conventions(c => c.UseDefaultConventions());
                x.AddFromAssemblyContainingType<Invoice>();

                x.Include<Invoice>()
                    .Setup(c => c.Amount).Use<DecimalSource>(1m, 200m);
            });

            IGenerationSession session = factory.CreateSession();
            return session.List<Invoice>(amountOfInvoices).Get();
        }
    }
}
