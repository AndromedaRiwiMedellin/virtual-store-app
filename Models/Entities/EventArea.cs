namespace tienda_virtual_app.Models.Entities;

public class EventArea
{
    public long Id { get; set; }
    public Guid EventId { get; set; }
    public string AreaName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Capacity { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Event? Event { get; set; }
    public ICollection<AreaSeat> Seats { get; set; } = new List<AreaSeat>();
}
