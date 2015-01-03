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
    public class When_getting_customers_using_Moq
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

                var mockSet = new Mock<DbSet<Customer>>();
                mockSet.As<IQueryable<Customer>>().Setup(m => m.Provider).Returns(data.Provider);
                mockSet.As<IQueryable<Customer>>().Setup(m => m.Expression).Returns(data.Expression);
                mockSet.As<IQueryable<Customer>>().Setup(m => m.ElementType).Returns(data.ElementType);
                mockSet.As<IQueryable<Customer>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());

                var mockContext = new Mock<DataContext>();
                mockContext.Setup(c => c.Customers).Returns(mockSet.Object);

                controller = new CustomersApiController(mockContext.Object);
            };

        Because of = () => result = controller.GetCustomers();

        It should_return_all_customers = () => result.Count().Should().Be(2);
    }
}
