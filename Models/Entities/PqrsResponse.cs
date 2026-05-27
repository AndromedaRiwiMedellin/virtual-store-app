namespace tienda_virtual_app.Models.Entities;

public class PqrsResponse
{
    public Guid Id { get; set; }
    public Guid? PqrsId { get; set; }
    public Guid? EmployeeId { get; set; }
    public string? Response { get; set; }
    public DateTime? CreatedAt { get; set; }
}
