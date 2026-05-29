const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '');

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
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function createPqrs(user, data) {
  return request('/pqrs', {
    method: 'POST',
    body: JSON.stringify({
      userId: user?.id,
      email: user?.email,
      type: data.type,
      subject: data.subject,
      message: data.message
    })
  });
}

export function getMyPqrs(user) {
  if (!user?.id && !user?.email) return Promise.resolve([]);

  const params = new URLSearchParams();
  if (user.id) params.set('userId', user.id);
  if (user.email) params.set('email', user.email);

  return request(`/pqrs/my?${params.toString()}`);
}
