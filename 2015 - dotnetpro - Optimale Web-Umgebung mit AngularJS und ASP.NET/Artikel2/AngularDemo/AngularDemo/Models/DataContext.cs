using System.Data.Entity;

namespace AngularDemo.Models
{
    public class DataContext : DbContext, IDataContext
    {
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
    }
}