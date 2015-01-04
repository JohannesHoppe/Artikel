using System.Data.Common;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Results;
using AngularDemo.Controllers;
using AngularDemo.Models;
using FluentAssertions;
using Machine.Specifications;

namespace AngularDemo.Tests
{
    // see http://blogs.msmvps.com/theproblemsolver/2013/11/13/unit-testing-a-asp-net-webapi-2-controller/ for more text examples!
    public class SetupCustomersApiController
    {
        public static CustomersApiController controller;
        public static IHttpActionResult result;

        Establish context = () =>
        {
            DbConnection connection = Effort.DbConnectionFactory.CreateTransient();
            DataContext context = new DataContext(connection);
            controller = new CustomersApiController(context);

            Customer customer = new Customer { FirstName = "Test" };

            context.Customers.Add(customer);
            context.SaveChanges();
        };
    }

    [Subject(typeof(CustomersApiController))]
    public class When_getting_an_existing_customer : SetupCustomersApiController
    {
        Because of = () => result = controller.GetCustomer(1);

        It should_respond_with_status_code_200 = () => result.Should().BeOfType<OkNegotiatedContentResult<Customer>>();
        It should_return_the_requested_id = () => ((OkNegotiatedContentResult<Customer>)result).Content.Id.Should().Be(1);
    }

    [Subject(typeof(CustomersApiController))]
    public class When_getting_a_not_existing_customer : SetupCustomersApiController
    {
        Because of = () => result = controller.GetCustomer(2);
        It should_respond_with_status_code_200 = () => result.Should().BeOfType<NotFoundResult>();
    }
}
