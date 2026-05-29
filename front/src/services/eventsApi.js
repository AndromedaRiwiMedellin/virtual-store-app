const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://service.andromeda.andrescortes.dev').replace(/\/+$/, '');
const MEDIA_BASE_URL = (import.meta.env.VITE_MEDIA_BASE_URL ?? API_BASE_URL).replace(/\/+$/, '');

const fallbackImages = {
  cine: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80',
  teatro: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=80',
  concierto: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=80',
  rock: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=1400&q=80',
  electronico: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b469?auto=format&fit=crop&w=1400&q=80',
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
    let message = 'No se pudo completar la solicitud.';
    try {
      const error = await response.json();
      message = error.detail ?? error.message ?? error.title ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

function getFallbackImage(title = '', category = '') {
  const text = `${title} ${category}`.toLowerCase();
  if (text.includes('cine')) return fallbackImages.cine;
  if (text.includes('teatro') || text.includes('romeo')) return fallbackImages.teatro;
  if (text.includes('rock')) return fallbackImages.rock;
  if (text.includes('electron')) return fallbackImages.electronico;
  if (text.includes('gastronom')) return fallbackImages.gastronomico;
  if (text.includes('concierto') || text.includes('festival')) return fallbackImages.concierto;
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
  if (text.includes('cine') || text.includes('pelicula') || text.includes('proyeccion')) return 'Cine';
  if (text.includes('teatro') || text.includes('obra') || text.includes('romeo')) return 'Teatro';
  if (text.includes('concierto') || text.includes('rock') || text.includes('dj') || text.includes('electron')) return 'Conciertos';
  if (text.includes('gastronom') || text.includes('parque') || text.includes('urbana')) return 'Experiencias';
  return 'Eventos';
}

function inferVenue(event) {
  const category = inferCategory(event);
  if (category === 'Cine') return 'Escenario al aire libre';
  if (category === 'Teatro') return 'Sala principal';
  if (category === 'Conciertos') return 'Arena OrbiX';
  if (category === 'Experiencias') return 'Distrito OrbiX';
  return 'Centro de eventos OrbiX';
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

function normalizeZone(area) {
  const seats = (area.areaSeats ?? []).filter(Boolean).map(normalizeSeat);
  const available = seats.length
    ? seats.filter((seat) => seat.status?.toLowerCase() === 'available').length
    : area.capacity ?? 0;

  return {
    id: area.id,
    eventId: area.eventId,
    name: area.areaName ?? area.sectionName ?? 'Zona',
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
    title: event.title ?? 'Evento OrbiX',
    description: event.description ?? 'Experiencia disponible en nuestra cartelera.',
    image: toAbsoluteImage(event.posterUrl, event.title, category),
    date,
    time: eventDate && !Number.isNaN(eventDate.getTime())
      ? eventDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      : 'Por confirmar',
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
  if (filters.category && filters.category !== 'Todos') params.set('category', filters.category);
  if (filters.city && filters.city !== 'Todas') params.set('city', filters.city);
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
