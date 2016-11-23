using System.Web.Routing;

namespace BankDemo
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.MapPageRoute("", "{*url}", "~/index.html");
        }
    }
}
