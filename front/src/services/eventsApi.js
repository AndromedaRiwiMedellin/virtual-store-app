const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export function getEvents(filters = {}) {
  const params = new URLSearchParams();
  if (filters.query) params.set('query', filters.query);
  if (filters.category && filters.category !== 'Todos') params.set('category', filters.category);
  if (filters.city && filters.city !== 'Todas') params.set('city', filters.city);
  return request(`/events${params.toString() ? `?${params}` : ''}`);
}

export function getEvent(eventId) {
  return request(`/events/${eventId}`);
}

export function getEventSeats(eventId, areaId) {
  const params = areaId ? `?areaId=${areaId}` : '';
  return request(`/events/${eventId}/seats${params}`);
}
