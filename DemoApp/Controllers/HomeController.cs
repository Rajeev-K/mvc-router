using Microsoft.AspNetCore.Mvc;

namespace Shell.Controllers
{
    public class HomeController : Controller
    {
        private IConfiguration config;

        public HomeController(IConfiguration configuration)
        {
            this.config = configuration;
        }

        public IActionResult Index()
        {
            return File("~/index.html", "text/html");
        }
    }
}
