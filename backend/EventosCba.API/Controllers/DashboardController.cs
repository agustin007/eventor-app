using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace EventosCba.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            var stats = new
            {
                TotalViews = 1250,
                TicketsSold = 45,
                Revenue = 67500,
                Rating = 4.8
            };
            return Ok(stats);
        }

        [HttpGet("events")]
        public IActionResult GetMyEvents()
        {
             var myEvents = new List<object>
            {
                new { Id = 1, Title = "Jazz Night", Status = "Published", Views = 450, Sales = 20 },
                new { Id = 101, Title = "Rock Festival", Status = "Draft", Views = 0, Sales = 0 }
            };
            return Ok(myEvents);
        }
    }
}
