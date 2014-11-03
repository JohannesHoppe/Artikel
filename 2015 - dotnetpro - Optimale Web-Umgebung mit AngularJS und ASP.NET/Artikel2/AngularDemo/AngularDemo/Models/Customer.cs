using System.Collections.Generic;

namespace AngularDemo.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mail { get; set; }
        public ICollection<Invoice> Invoices { get; set; }
    }
}
