const BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
const token = () => localStorage.getItem('campushub-token') || '';

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(`${BASE}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
  return body;
}

export const authApi = {
  login: data => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: data => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),
};

export const taskApi = {
  list: () => request('/tasks'),
  create: task => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  update: (id, patch) => request(`/tasks/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  remove: id => request(`/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  health: () => request('/health'),
};
