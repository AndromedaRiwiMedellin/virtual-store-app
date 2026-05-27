using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tienda_virtual_app.Data;
using tienda_virtual_app.Models.Dtos;
using tienda_virtual_app.Models.Entities;

namespace tienda_virtual_app.Controllers.Api;

[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly VirtualStoreDbContext _dbContext;

    public EventsController(VirtualStoreDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<EventSummaryDto>>> GetEvents(
        [FromQuery] string? query,
        [FromQuery] string? category,
        [FromQuery] string? city)
    {
        var eventsQuery = _dbContext.Events
            .AsNoTracking()
            .Include(e => e.Areas)
                .ThenInclude(a => a.Seats)
            .OrderBy(e => e.EventDate)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var normalizedQuery = query.Trim().ToLower();
            eventsQuery = eventsQuery.Where(e =>
                e.Title.ToLower().Contains(normalizedQuery) ||
                (e.Description != null && e.Description.ToLower().Contains(normalizedQuery)));
        }

        var events = await eventsQuery.ToListAsync();

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("Todos", StringComparison.OrdinalIgnoreCase))
        {
            events = events
                .Where(e => GetCategory(e.Title).Equals(category, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        if (!string.IsNullOrWhiteSpace(city) && !city.Equals("Todas", StringComparison.OrdinalIgnoreCase))
        {
            events = events
                .Where(e => GetCity(e.Title).Equals(city, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        return events.Select(ToSummaryDto).ToList();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EventDetailDto>> GetEvent(Guid id)
    {
        var eventItem = await _dbContext.Events
            .AsNoTracking()
            .Include(e => e.Areas)
                .ThenInclude(a => a.Seats)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (eventItem is null)
        {
            return NotFound();
        }

        return ToDetailDto(eventItem);
    }

    [HttpGet("{id:guid}/areas")]
    public async Task<ActionResult<IReadOnlyList<EventAreaDto>>> GetEventAreas(Guid id)
    {
        var exists = await _dbContext.Events.AnyAsync(e => e.Id == id);
        if (!exists)
        {
            return NotFound();
        }

        var areas = await _dbContext.EventAreas
            .AsNoTracking()
            .Include(a => a.Seats)
            .Where(a => a.EventId == id)
            .OrderBy(a => a.Price)
            .ToListAsync();

        return areas.Select(ToAreaDto).ToList();
    }

    [HttpGet("{id:guid}/seats")]
    public async Task<ActionResult<IReadOnlyList<AreaSeatDto>>> GetEventSeats(Guid id, [FromQuery] long? areaId)
    {
        var exists = await _dbContext.Events.AnyAsync(e => e.Id == id);
        if (!exists)
        {
            return NotFound();
        }

        var seatsQuery = _dbContext.AreaSeats
            .AsNoTracking()
            .Include(s => s.EventArea)
            .Where(s => s.EventArea != null && s.EventArea.EventId == id);

        if (areaId.HasValue)
        {
            seatsQuery = seatsQuery.Where(s => s.EventAreaId == areaId.Value);
        }

        var seats = await seatsQuery
            .OrderBy(s => s.EventAreaId)
            .ThenBy(s => s.RowLabel)
            .ThenBy(s => s.SeatNumber)
            .ToListAsync();

        return seats
            .Select(s => new AreaSeatDto(s.Id, s.EventAreaId, s.SeatNumber, s.RowLabel, s.Status))
            .ToList();
    }

    private static EventSummaryDto ToSummaryDto(Event eventItem)
    {
        var date = eventItem.EventDate ?? DateTime.UtcNow;
        return new EventSummaryDto(
            eventItem.Id,
            eventItem.Title,
            GetCategory(eventItem.Title),
            GetCity(eventItem.Title),
            GetVenue(eventItem.Title),
            GetAddress(eventItem.Title),
            date.ToString("yyyy-MM-dd"),
            date.ToString("HH:mm"),
            GetPriceFrom(eventItem),
            IsFeatured(eventItem.Title),
            GetPosterUrl(eventItem),
            eventItem.Description ?? "Evento disponible en la cartelera OrbiX.",
            eventItem.TotalCapacity ?? eventItem.Areas.Sum(a => a.Capacity),
            GetAvailableSeats(eventItem));
    }

    private static EventDetailDto ToDetailDto(Event eventItem)
    {
        var summary = ToSummaryDto(eventItem);
        return new EventDetailDto(
            summary.Id,
            summary.Title,
            summary.Category,
            summary.City,
            summary.Venue,
            summary.Address,
            summary.Date,
            summary.Time,
            summary.PriceFrom,
            summary.Featured,
            summary.Image,
            summary.Description,
            summary.TotalCapacity,
            summary.AvailableSeats,
            eventItem.Areas
                .OrderBy(a => a.Price)
                .Select(ToAreaDto)
                .ToList());
    }

    private static EventAreaDto ToAreaDto(EventArea area)
    {
        return new EventAreaDto(
            area.Id,
            area.AreaName,
            area.Price,
            area.Capacity,
            area.Seats.Count(s => s.Status.Equals("available", StringComparison.OrdinalIgnoreCase)),
            area.Description);
    }

    private static decimal GetPriceFrom(Event eventItem)
    {
        return eventItem.Areas.Count == 0 ? 0 : eventItem.Areas.Min(a => a.Price);
    }

    private static int GetAvailableSeats(Event eventItem)
    {
        return eventItem.Areas
            .SelectMany(a => a.Seats)
            .Count(s => s.Status.Equals("available", StringComparison.OrdinalIgnoreCase));
    }

    private static bool IsFeatured(string title)
    {
        return title.Contains("Rock", StringComparison.OrdinalIgnoreCase)
            || title.Contains("Jazz", StringComparison.OrdinalIgnoreCase);
    }

    private static string GetCategory(string title)
    {
        if (title.Contains("Rock", StringComparison.OrdinalIgnoreCase)
            || title.Contains("Jazz", StringComparison.OrdinalIgnoreCase)
            || title.Contains("Electronico", StringComparison.OrdinalIgnoreCase)
            || title.Contains("Electrónico", StringComparison.OrdinalIgnoreCase)
            || title.Contains("Concierto", StringComparison.OrdinalIgnoreCase))
        {
            return "Conciertos";
        }

        if (title.Contains("Teatro", StringComparison.OrdinalIgnoreCase)
            || title.Contains("Comedy", StringComparison.OrdinalIgnoreCase)
            || title.Contains("Comedia", StringComparison.OrdinalIgnoreCase))
        {
            return "Teatro";
        }

        if (title.Contains("Cine", StringComparison.OrdinalIgnoreCase))
        {
            return "Familia";
        }

        return "Experiencias";
    }

    private static string GetCity(string title)
    {
        if (title.Contains("Rock", StringComparison.OrdinalIgnoreCase)
            || title.Contains("Comedy", StringComparison.OrdinalIgnoreCase))
        {
            return "Medellin";
        }

        if (title.Contains("Teatro", StringComparison.OrdinalIgnoreCase))
        {
            return "Bogota";
        }

        if (title.Contains("Jazz", StringComparison.OrdinalIgnoreCase))
        {
            return "Cali";
        }

        return "Medellin";
    }

    private static string GetVenue(string title)
    {
        if (title.Contains("Rock", StringComparison.OrdinalIgnoreCase))
        {
            return "Arena OrbiX";
        }

        if (title.Contains("Jazz", StringComparison.OrdinalIgnoreCase))
        {
            return "Parque de los Artistas";
        }

        if (title.Contains("Teatro", StringComparison.OrdinalIgnoreCase))
        {
            return "Teatro Central";
        }

        if (title.Contains("Comedy", StringComparison.OrdinalIgnoreCase))
        {
            return "Club Escenario";
        }

        if (title.Contains("Cine", StringComparison.OrdinalIgnoreCase))
        {
            return "Parque Cultural OrbiX";
        }

        if (title.Contains("Electronico", StringComparison.OrdinalIgnoreCase)
            || title.Contains("Electrónico", StringComparison.OrdinalIgnoreCase))
        {
            return "Club Neon";
        }

        if (title.Contains("Gastronomico", StringComparison.OrdinalIgnoreCase)
            || title.Contains("Gastronómico", StringComparison.OrdinalIgnoreCase))
        {
            return "Distrito Gastronomico";
        }

        if (title.Contains("Danza", StringComparison.OrdinalIgnoreCase))
        {
            return "Plaza del Ritmo";
        }

        return "Centro de Eventos OrbiX";
    }

    private static string GetAddress(string title)
    {
        return GetCity(title) switch
        {
            "Bogota" => "Calle 45 # 18-22",
            "Cali" => "Av. 3 Norte # 12-30",
            _ => "Carrera 48 # 10-45"
        };
    }

    private static string GetPosterUrl(Event eventItem)
    {
        if (!string.IsNullOrWhiteSpace(eventItem.PosterUrl))
        {
            return eventItem.PosterUrl;
        }

        var title = eventItem.Title;
        if (title.Contains("Rock", StringComparison.OrdinalIgnoreCase))
        {
            return "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80";
        }

        if (title.Contains("Jazz", StringComparison.OrdinalIgnoreCase))
        {
            return "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1400&q=80";
        }

        if (title.Contains("Teatro", StringComparison.OrdinalIgnoreCase))
        {
            return "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=80";
        }

        if (title.Contains("Comedy", StringComparison.OrdinalIgnoreCase)
            || title.Contains("Comedia", StringComparison.OrdinalIgnoreCase))
        {
            return "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1400&q=80";
        }

        return "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80";
    }
}
