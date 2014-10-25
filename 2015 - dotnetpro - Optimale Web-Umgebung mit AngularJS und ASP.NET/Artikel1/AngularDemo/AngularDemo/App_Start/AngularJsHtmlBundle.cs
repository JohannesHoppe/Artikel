using System.Web.Optimization;

namespace AngularDemo
{
    /// <summary>
    /// Bundling AngularJS HTML pages with ASP.NET
    /// see: http://code.dortikum.net/2014/04/13/bundling-angularjs-html-pages-with-asp-net/
    /// </summary>
    public class AngularJsHtmlBundle : Bundle
    {
        public AngularJsHtmlBundle(string virtualPath)
            : base(virtualPath, null, new[] { (IBundleTransform)new AngularJsHtmlCombine() })
        {
        }
    }
}