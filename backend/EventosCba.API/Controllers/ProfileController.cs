using Microsoft.AspNetCore.Mvc;

namespace EventosCba.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetProfile()
        {
            var profile = new
            {
                Name = "Agustin",
                Email = "agustin@example.com",
                Level = "Explorador Nivel 5",
                Points = 1250,
                JoinedDate = "2024-01-15"
            };
            return Ok(profile);
        }
    }
}
