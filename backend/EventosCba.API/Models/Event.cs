using System;

namespace EventosCba.API.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Location { get; set; } = string.Empty;
        public decimal Price { get; set; }
        
        // New Fields for Discovery
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Category { get; set; } = "General"; // Music, Food, Art, etc.
        
        // Relationships
        public string? OrganizerId { get; set; }
        // public ApplicationUser? Organizer { get; set; } // Uncomment when ready to link
    }
}
