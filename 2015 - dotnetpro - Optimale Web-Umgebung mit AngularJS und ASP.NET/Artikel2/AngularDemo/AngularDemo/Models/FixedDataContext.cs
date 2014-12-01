using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AngularDemo.Models
{
    /// <summary>
    /// Code First DbContext workaround,
    /// see: http://www.getbreezenow.com/documentation/odata-server
    /// </summary>
    public class FixedDataContext  : DataContext
    {
    }
}