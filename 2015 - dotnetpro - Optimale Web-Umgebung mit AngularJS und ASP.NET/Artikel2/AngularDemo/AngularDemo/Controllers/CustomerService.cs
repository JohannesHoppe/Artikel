using System.Collections.Generic;
using AngularDemo.Models;

namespace AngularDemo.Controllers
{
    /// <summary>
    /// Just demo code
    /// </summary>
    public static class CustomerService
    {
        public static IList<Invoice> PurchaseAndSendMail(int amount)
        {
            return new[]
                   {
                       new Invoice
                       {
                           Amount = 12.99M,
                       }
                   };
        }
    }
}