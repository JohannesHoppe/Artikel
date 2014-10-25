using System;
using System.Globalization;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Optimization;
using Newtonsoft.Json;

namespace AngularDemo
{
    public class AngularJsHtmlCombine : IBundleTransform
    {
        public virtual void Process(BundleContext context, BundleResponse response)
        {
            #if DEBUG
            // set BundleContext.UseServerCache to false in order to process all bundle request and generate dynamic response
            context.UseServerCache = false;
            response.Cacheability = HttpCacheability.NoCache;
            #endif

            var contentBuilder = new StringBuilder();
            contentBuilder.AppendLine("// Created on: " + DateTime.Now.ToString(CultureInfo.InvariantCulture));
            contentBuilder.AppendLine("require(['angular'], function(angular) {");
            contentBuilder.AppendLine("    angular.module('bundleTemplateCache', []).run(['$templateCache', function($templateCache) {");
            contentBuilder.AppendLine("        $templateCache.removeAll();");
            foreach (BundleFile file in response.Files)
            {
                string fileId = VirtualPathUtility.ToAbsolute(file.IncludedVirtualPath);
                string filePath = HttpContext.Current.Server.MapPath(file.IncludedVirtualPath);
                string fileContent = File.ReadAllText(filePath);

                contentBuilder.AppendFormat("        $templateCache.put({0},{1});" + Environment.NewLine,
                    JsonConvert.SerializeObject(fileId),
                    JsonConvert.SerializeObject(fileContent));
            }

            contentBuilder.AppendLine("    }]);");
            contentBuilder.AppendLine("});");

            response.Content = contentBuilder.ToString();
            response.ContentType = "text/javascript";
        }
    }
}