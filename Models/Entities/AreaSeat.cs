namespace tienda_virtual_app.Models.Entities;

public class AreaSeat
{
    public long Id { get; set; }
    public long EventAreaId { get; set; }
    public Guid? UserId { get; set; }
    public Guid? TicketId { get; set; }
    public string SeatNumber { get; set; } = string.Empty;
    public string? RowLabel { get; set; }
    public string Status { get; set; } = "available";
    public DateTime? ReservedAt { get; set; }
    public DateTime? SoldAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public EventArea? EventArea { get; set; }
}
