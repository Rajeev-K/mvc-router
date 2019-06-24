using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;

namespace Shell.Controllers
{
    public class HomeController : Controller
    {
        private IHostingEnvironment hostingEnvironment;
        private IMemoryCache memoryCache;
        private IConfiguration config;

        public HomeController(IConfiguration configuration, IMemoryCache memoryCache, IHostingEnvironment hostingEnvironment)
        {
            this.config = configuration;
            this.memoryCache = memoryCache;
            this.hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
