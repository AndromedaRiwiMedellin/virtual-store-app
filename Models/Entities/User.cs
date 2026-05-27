namespace tienda_virtual_app.Models.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public string? ProfileImage { get; set; }
    public DateTime? CreatedAt { get; set; }
}
