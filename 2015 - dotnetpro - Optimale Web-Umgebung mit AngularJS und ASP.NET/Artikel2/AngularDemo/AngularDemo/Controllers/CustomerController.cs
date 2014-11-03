using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AngularDemo.Models;

namespace AngularDemo.Controllers
{
    public class CustomerController : ApiController
    {
        private readonly IDataContext dataContext;

        public CustomerController(IDataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        // GET api/customer
        public IEnumerable<Customer> Get()
        {
            return dataContext.Customers;
        }

        // GET api/customer/5
        /// <summary>
        /// Gets one customer by its Id
        /// </summary>
        /// <returns>One customer</returns>
        public Customer GetCustomer(int id)
        {
            return dataContext.Customers.FirstOrDefault(c => c.Id == id);
        }

        // POST api/customer
        /// <summary>
        /// Creates a new customer
        /// </summary>
        /// <param name="customer">Customer data</param>
        /// <returns>All the data of the customer</returns>
        public HttpResponseMessage Post([FromBody]Customer customer)
        {
            dataContext.Customers.Add(customer);

            return Request.CreateResponse(HttpStatusCode.Created, customer);
        }

        // PUT api/customer/5
        /// <summary>
        /// Updates an existing customer
        /// </summary>
        /// <param name="id">The Id of the customer</param>
        /// <param name="customer">Customer object</param>
        /// <returns>200 and customer data OR 404 and id</returns>
        public HttpResponseMessage Put(int id, [FromBody]Customer customer)
        {
            var foundCustomer = dataContext.Customers.FirstOrDefault(c => c.Id == id);
            if (foundCustomer == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, id);
            }

            foundCustomer.FirstName = customer.FirstName;
            foundCustomer.LastName = customer.LastName;
            foundCustomer.Mail = customer.Mail;

            return Request.CreateResponse(HttpStatusCode.OK, foundCustomer);
        }                  

        // DELETE api/<controller>/5
        /// <summary>
        /// Deletes one customer by id
        /// </summary>
        /// <param name="id">The id of the customer</param>
        /// <returns>404 or 200</returns>
        public HttpResponseMessage Delete(int id)
        {
            var foundCustomer = dataContext.Customers.FirstOrDefault(c => c.Id == id);
            if (foundCustomer == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, id);
            }

            dataContext.Customers.Remove(foundCustomer);
            return Request.CreateResponse(HttpStatusCode.OK, id);
        }
    }
}
