using System.Web.Mvc;

namespace AngularDemo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Angular Demo";
            return View("Index", "~/Views/Shared/_Layout.cshtml");
        }        
        
        public ActionResult HelloWorld()
        {
            return View();
        }
    }
}
