using System;

namespace EventosCba.API.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string QRCode { get; set; } = string.Empty;
        public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;
        public decimal PricePaid { get; set; }
        public bool IsUsed { get; set; } = false;
        
        // Navigation
        public Event? Event { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
