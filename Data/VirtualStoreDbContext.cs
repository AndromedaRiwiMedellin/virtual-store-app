using Microsoft.EntityFrameworkCore;
using tienda_virtual_app.Models.Entities;

namespace tienda_virtual_app.Data;

public class VirtualStoreDbContext : DbContext
{
    public VirtualStoreDbContext(DbContextOptions<VirtualStoreDbContext> options)
        : base(options)
    {
    }

    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventArea> EventAreas => Set<EventArea>();
    public DbSet<AreaSeat> AreaSeats => Set<AreaSeat>();
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<Pqrs> Pqrs => Set<Pqrs>();
    public DbSet<PqrsResponse> PqrsResponses => Set<PqrsResponse>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Event>(entity =>
        {
            entity.ToTable("events");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.PosterUrl).HasColumnName("poster_url");
            entity.Property(e => e.EventDate).HasColumnName("event_date");
            entity.Property(e => e.SaleStart).HasColumnName("sale_start");
            entity.Property(e => e.SaleEnd).HasColumnName("sale_end");
            entity.Property(e => e.TotalCapacity).HasColumnName("total_capacity");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");

            entity.HasMany(e => e.Areas)
                .WithOne(a => a.Event)
                .HasForeignKey(a => a.EventId);
        });

        modelBuilder.Entity<EventArea>(entity =>
        {
            entity.ToTable("event_area");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.EventId).HasColumnName("event_id");
            entity.Property(e => e.AreaName).HasColumnName("area_name");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.Capacity).HasColumnName("capacity");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasMany(e => e.Seats)
                .WithOne(s => s.EventArea)
                .HasForeignKey(s => s.EventAreaId);
        });

        modelBuilder.Entity<AreaSeat>(entity =>
        {
            entity.ToTable("area_seats");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.EventAreaId).HasColumnName("event_area_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.TicketId).HasColumnName("ticket_id");
            entity.Property(e => e.SeatNumber).HasColumnName("seat_number");
            entity.Property(e => e.RowLabel).HasColumnName("row_label");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.ReservedAt).HasColumnName("reserved_at");
            entity.Property(e => e.SoldAt).HasColumnName("sold_at");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.ToTable("tickets");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.EventId).HasColumnName("event_id");
            entity.Property(e => e.QrCode).HasColumnName("qr_code");
            entity.Property(e => e.SeatNumber).HasColumnName("seat_number");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.PurchasedAt).HasColumnName("purchased_at");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.FullName).HasColumnName("full_name");
            entity.Property(e => e.Phone).HasColumnName("phone");
            entity.Property(e => e.ProfileImage).HasColumnName("profile_image");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.ToTable("favorites");
            entity.HasKey(e => new { e.UserId, e.EventId });
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.EventId).HasColumnName("event_id");
        });

        modelBuilder.Entity<Pqrs>(entity =>
        {
            entity.ToTable("pqrs");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Type).HasColumnName("type");
            entity.Property(e => e.Subject).HasColumnName("subject");
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<PqrsResponse>(entity =>
        {
            entity.ToTable("pqrs_responses");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PqrsId).HasColumnName("pqrs_id");
            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.Response).HasColumnName("response");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });
    }
}
