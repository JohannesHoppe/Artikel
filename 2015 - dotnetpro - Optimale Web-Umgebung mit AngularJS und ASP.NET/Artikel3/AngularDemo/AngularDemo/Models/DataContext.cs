using System.Data.Common;
using System.Data.Entity;

namespace AngularDemo.Models
{
    public class DataContext : DbContext
    {
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual  DbSet<Invoice> Invoices { get; set; }

        public DataContext()
        {
            
        }

        public DataContext(DbConnection connection) : base(connection, true)
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new InvoiceMap());
        }
    }
}