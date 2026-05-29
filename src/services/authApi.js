const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '');

async function request(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
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

  return response.json();
}

function normalizeUser(payload, fallback = {}) {
  const user = payload.user ?? payload;
  return {
    id: user.id ?? user.userId,
    fullName: user.fullName ?? fallback.fullName ?? fallback.email?.split('@')[0] ?? 'Usuario OrbiX',
    email: user.email ?? fallback.email,
    phone: user.phone ?? fallback.phone ?? ''
  };
}

export async function login(credentials) {
  const payload = await request('/auth/login', credentials);
  return normalizeUser(payload, credentials);
}

export async function register(data) {
  const payload = await request('/auth/register', data);
  return normalizeUser(payload, data);
}
