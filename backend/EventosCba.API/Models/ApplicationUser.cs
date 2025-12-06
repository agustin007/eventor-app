using Microsoft.AspNetCore.Identity;

namespace EventosCba.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // Add other custom properties here if needed (e.g., ProfilePictureUrl, Bio)
    }
}
