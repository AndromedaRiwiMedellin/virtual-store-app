const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '');
const MEDIA_BASE_URL = (import.meta.env.VITE_MEDIA_BASE_URL ?? API_BASE_URL).replace(/\/+$/, '');

const fallbackImages = {
  cine: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80',
  teatro: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=80',
  concierto: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=80',
  rock: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=1400&q=80',
  electronic: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b469?auto=format&fit=crop&w=1400&q=80',
  gastronomico: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1400&q=80',
  default: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=80'
};

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    let message = 'The request could not be completed.';
    try {
      const error = await response.json();
      message = error.detail ?? error.message ?? error.title ?? message;
    } catch {
      message = response.statusText || message;
    }
    const requestError = new Error(message);
    requestError.status = response.status;
    throw requestError;
  }

  if (response.status === 204) return null;
  return response.json();
}

function getFallbackImage(title = '', category = '') {
  const text = `${title} ${category}`.toLowerCase();
  if (text.includes('cine') || text.includes('movie') || text.includes('film')) return fallbackImages.cine;
  if (text.includes('teatro') || text.includes('theater') || text.includes('theatre') || text.includes('romeo')) return fallbackImages.teatro;
  if (text.includes('rock')) return fallbackImages.rock;
  if (text.includes('electron')) return fallbackImages.electronic;
  if (text.includes('gastronom') || text.includes('food')) return fallbackImages.gastronomico;
  if (text.includes('concierto') || text.includes('concert') || text.includes('festival')) return fallbackImages.concierto;
  return fallbackImages.default;
}

function toAbsoluteImage(posterUrl, title = '', category = '') {
  if (posterUrl?.startsWith('http')) return posterUrl;
  if (posterUrl) {
    const absoluteUrl = `${MEDIA_BASE_URL}/${posterUrl.replace(/^\/+/, '')}`;
    return absoluteUrl.includes('/posters/') ? getFallbackImage(title, category) : absoluteUrl;
  }

  return getFallbackImage(title, category);
}

function inferCategory(event) {
  const text = `${event.title ?? ''} ${event.description ?? ''}`.toLowerCase();
  if (text.includes('cine') || text.includes('pelicula') || text.includes('movie') || text.includes('film') || text.includes('proyeccion')) return 'Movies';
  if (text.includes('teatro') || text.includes('theater') || text.includes('theatre') || text.includes('obra') || text.includes('romeo')) return 'Theater';
  if (text.includes('concierto') || text.includes('concert') || text.includes('rock') || text.includes('dj') || text.includes('electron')) return 'Concerts';
  if (text.includes('gastronom') || text.includes('food') || text.includes('parque') || text.includes('urbana')) return 'Experiences';
  return 'Events';
}

function inferVenue(event) {
  const category = inferCategory(event);
  if (category === 'Movies') return 'Open-air venue';
  if (category === 'Theater') return 'Main hall';
  if (category === 'Concerts') return 'OrbiX Arena';
  if (category === 'Experiences') return 'OrbiX District';
  return 'OrbiX Event Center';
}

function normalizeSeat(seat) {
  return {
    id: seat.id,
    eventAreaId: seat.eventAreaId,
    seatNumber: seat.seatNumber,
    rowLabel: seat.rowLabel,
    status: seat.status ?? 'available'
  };
}

function getSeatNumberValue(seat) {
  const value = Number(String(seat.seatNumber ?? '').replace(/[^0-9]/g, ''));
  return Number.isFinite(value) ? value : 0;
}

function sortSeats(a, b) {
  const rowA = a.rowLabel ?? '';
  const rowB = b.rowLabel ?? '';
  if (rowA !== rowB) return rowA.localeCompare(rowB, 'en', { numeric: true });
  return getSeatNumberValue(a) - getSeatNumberValue(b);
}

function normalizeZone(area) {
  const seats = (area.areaSeats ?? []).filter(Boolean).map(normalizeSeat).sort(sortSeats);
  const available = seats.length
    ? seats.filter((seat) => seat.status?.toLowerCase() === 'available').length
    : area.capacity ?? 0;

  return {
    id: area.id,
    eventId: area.eventId,
    name: area.areaName ?? area.sectionName ?? 'Zone',
    description: area.description ?? '',
    price: Number(area.price ?? 0),
    capacity: area.capacity ?? seats.length,
    available,
    seats
  };
}

export function normalizeEvent(payload, index = 0) {
  const event = payload.event ?? payload;
  const areas = payload.areas ?? event.eventAreas ?? [];
  const zones = areas.filter(Boolean).map(normalizeZone);
  const eventDate = event.eventDate ? new Date(event.eventDate) : null;
  const date = eventDate && !Number.isNaN(eventDate.getTime())
    ? eventDate.toISOString().slice(0, 10)
    : '';

  const category = inferCategory(event);

  return {
    id: event.id,
    title: event.title ?? 'OrbiX Event',
    description: event.description ?? 'Experience available in our lineup.',
    image: toAbsoluteImage(event.posterUrl, event.title, category),
    date,
    time: eventDate && !Number.isNaN(eventDate.getTime())
      ? eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : 'To be confirmed',
    city: 'Medellin',
    venue: inferVenue(event),
    category,
    featured: index < 2,
    priceFrom: zones.length ? Math.min(...zones.map((zone) => zone.price)) : 0,
    capacity: event.totalCapacity ?? zones.reduce((total, zone) => total + zone.capacity, 0),
    availableSeats: zones.reduce((total, zone) => total + zone.available, 0),
    zones,
    raw: event
  };
}

export function getEvents(filters = {}) {
  const params = new URLSearchParams();
  if (filters.query) params.set('query', filters.query);
  if (filters.category && filters.category !== 'All') params.set('category', filters.category);
  if (filters.city && filters.city !== 'All') params.set('city', filters.city);
  return request(`/events${params.toString() ? `?${params}` : ''}`)
    .then(async (events) => {
      const normalizedEvents = events.map((event, index) => normalizeEvent(event, index));
      const enrichedEvents = await Promise.all(normalizedEvents.map(async (event) => {
        if (event.zones.length > 0) return event;

        try {
          const detail = await getEvent(event.id);
          return {
            ...event,
            priceFrom: detail.priceFrom,
            availableSeats: detail.availableSeats,
            capacity: detail.capacity,
            zones: detail.zones
          };
        } catch {
          return event;
        }
      }));

      return enrichedEvents;
    });
}

export function getEvent(eventId) {
  return request(`/events/${eventId}`).then((event) => normalizeEvent(event));
}

export function getEventSeats(eventId, areaId) {
  return getEvent(eventId).then((event) => {
    const zones = areaId
      ? event.zones.filter((zone) => String(zone.id) === String(areaId))
      : event.zones;

    return zones.flatMap((zone) => zone.seats);
  });
}

export function lockSeats(areaId, seats) {
  return request(`/events/${areaId}/seats/lock`, {
    method: 'POST',
    body: JSON.stringify({ seats })
  });
}

export function getTicket(ticketId) {
  return request(`/tickets/${ticketId}`);
}

function normalizePurchase(purchase, user) {
  const eventDate = purchase.event?.eventDate ? new Date(purchase.event.eventDate) : null;
  const date = eventDate && !Number.isNaN(eventDate.getTime())
    ? eventDate.toISOString().slice(0, 10)
    : '';

  return {
    id: purchase.id,
    event: {
      id: purchase.event?.id,
      title: purchase.event?.title ?? 'OrbiX Event',
      date,
      time: eventDate && !Number.isNaN(eventDate.getTime())
        ? eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : 'To be confirmed',
      venue: inferVenue(purchase.event ?? {}),
      category: inferCategory(purchase.event ?? {}),
      image: toAbsoluteImage(purchase.event?.image, purchase.event?.title)
    },
    zone: {
      id: purchase.zone?.id,
      name: purchase.zone?.name ?? 'Zone',
      price: Number(purchase.zone?.price ?? 0)
    },
    seats: (purchase.tickets ?? []).map((ticket) => ({
      id: ticket.id,
      seatNumber: ticket.seatNumber
    })),
    tickets: purchase.tickets ?? [],
    total: Number(purchase.total ?? 0),
    status: purchase.status ?? 'Paid',
    purchasedAt: purchase.purchasedAt,
    user: {
      id: user?.id,
      fullName: user?.fullName,
      email: user?.email
    }
  };
}

export function getUserPurchases(user) {
  if (!user?.email) return Promise.resolve([]);
  return request(`/tickets/purchases?email=${encodeURIComponent(user.email)}`)
    .then((purchases) => purchases.map((purchase) => normalizePurchase(purchase, user)));
}

export function purchaseTickets({ user, event, zone, seats }) {
  return request('/tickets/purchase-pos', {
    method: 'POST',
    body: JSON.stringify({
      email: user.email,
      fullName: user.fullName ?? user.email,
      phone: user.phone ?? '',
      eventId: event.id,
      areaId: zone.id,
      seats: seats.map((seat) => seat.seatNumber)
    })
  });
}
