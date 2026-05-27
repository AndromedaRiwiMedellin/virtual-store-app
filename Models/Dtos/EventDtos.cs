namespace tienda_virtual_app.Models.Dtos;

public record EventSummaryDto(
    Guid Id,
    string Title,
    string Category,
    string City,
    string Venue,
    string Address,
    string Date,
    string Time,
    decimal PriceFrom,
    bool Featured,
    string Image,
    string Description,
    int TotalCapacity,
    int AvailableSeats);

public record EventDetailDto(
    Guid Id,
    string Title,
    string Category,
    string City,
    string Venue,
    string Address,
    string Date,
    string Time,
    decimal PriceFrom,
    bool Featured,
    string Image,
    string Description,
    int TotalCapacity,
    int AvailableSeats,
    IReadOnlyList<EventAreaDto> Zones);

public record EventAreaDto(
    long Id,
    string Name,
    decimal Price,
    int Capacity,
    int Available,
    string? Description);

public record AreaSeatDto(
    long Id,
    long EventAreaId,
    string SeatNumber,
    string? RowLabel,
    string Status);
