namespace tienda_virtual_app.Models.Entities;

public class Pqrs
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public string? Type { get; set; }
    public string? Subject { get; set; }
    public string? Message { get; set; }
    public string? Status { get; set; }
    public DateTime? CreatedAt { get; set; }
}
