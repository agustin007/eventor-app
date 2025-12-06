using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EventosCba.API.Data;
using EventosCba.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EventosCba.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("purchase")]
        public async Task<IActionResult> PurchaseTicket([FromBody] PurchaseRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var eventItem = await _context.Events.FindAsync(request.EventId);
            if (eventItem == null) return NotFound(new { message = "Event not found" });

            // Create ticket
            var ticket = new Ticket
            {
                EventId = request.EventId,
                UserId = userId,
                PricePaid = eventItem.Price,
                QRCode = Guid.NewGuid().ToString(), // Simple QR generation
                PurchasedAt = DateTime.UtcNow
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ticket purchased successfully", ticketId = ticket.Id, qrCode = ticket.QRCode });
        }

        [HttpGet("my-tickets")]
        public async Task<IActionResult> GetMyTickets()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var tickets = await _context.Tickets
                .Where(t => t.UserId == userId)
                .Select(t => new
                {
                    t.Id,
                    t.EventId,
                    EventTitle = t.Event!.Title,
                    EventDate = t.Event.Date,
                    t.QRCode,
                    t.PricePaid,
                    t.IsUsed
                })
                .ToListAsync();

            return Ok(tickets);
        }
    }

    public class PurchaseRequest
    {
        public int EventId { get; set; }
    }
}
