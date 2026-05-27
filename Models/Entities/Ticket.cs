namespace tienda_virtual_app.Models.Entities;

public class Ticket
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public Guid? EventId { get; set; }
    public string QrCode { get; set; } = string.Empty;
    public string? SeatNumber { get; set; }
    public string? Status { get; set; }
    public DateTime? PurchasedAt { get; set; }
}
