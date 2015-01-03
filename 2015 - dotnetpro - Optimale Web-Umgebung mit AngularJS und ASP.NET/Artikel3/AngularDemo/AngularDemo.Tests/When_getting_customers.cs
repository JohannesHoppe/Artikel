using System.Data.Common;
using System.Linq;
using AngularDemo.Controllers;
using AngularDemo.Models;
using FluentAssertions;
using Machine.Specifications;

namespace AngularDemo.Tests
{
    [Subject(typeof(CustomersApiController))]
    public class When_getting_customers
    {
        static CustomersApiController controller;
        static IQueryable<Customer> result;

        Establish context = () =>
            {
                DbConnection connection = Effort.DbConnectionFactory.CreateTransient();
                DataContext context = new DataContext(connection);
                controller = new CustomersApiController(context);

                Customer customer1 = new Customer { FirstName = "Test1" };
                Customer customer2 = new Customer { FirstName = "Test2" };

                context.Customers.AddRange(new[] {customer1, customer2});
                context.SaveChanges();
            };

        Because of = () => result = controller.GetCustomers();

        It should_return_all_customers = () => result.Count().Should().Be(2);
        It should_increment_primary_keys = () => result.First().Id.Should().Be(1);
    }
}
