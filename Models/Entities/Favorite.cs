namespace tienda_virtual_app.Models.Entities;

public class Favorite
{
    public Guid UserId { get; set; }
    public Guid EventId { get; set; }
}
