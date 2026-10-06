const API_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  signup: (body) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login:  (body) => request('/api/auth/login',  { method: 'POST', body: JSON.stringify(body) }),
  me:     ()     => request('/api/me'),
};