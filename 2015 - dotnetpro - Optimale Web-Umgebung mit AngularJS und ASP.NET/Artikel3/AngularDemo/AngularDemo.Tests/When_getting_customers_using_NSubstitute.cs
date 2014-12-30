using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Linq;
using AngularDemo.Controllers;
using AngularDemo.Models;
using FluentAssertions;
using Machine.Specifications;
using Moq;
using NSubstitute;
using It = Machine.Specifications.It;

namespace AngularDemo.Tests
{
    [Subject(typeof(CustomersApiController))]
    public class When_getting_customers_using_NSubstitute
    {
        static CustomersApiController controller;
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

                controller = new CustomersApiController(mockContext);

            };

        Because of = () => { result = controller.GetCustomers(); };

        It should_return_all_customers = () => result.Count().Should().Be(2);
    }
}
