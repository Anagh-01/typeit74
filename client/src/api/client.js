const API_BASE = import.meta.env.VITE_API_URL ?? '';

const getToken = () => localStorage.getItem('typeit74_token');

const request = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};

export const getContent = (mode, difficulty) =>
  request(`/api/v1/practice/content?mode=${encodeURIComponent(mode)}&difficulty=${encodeURIComponent(difficulty)}`);

export const saveResult = (payload) =>
  request('/api/v1/practice/results', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const login = (email, password) =>
  request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (username, email, password) =>
  request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });

export const getProfile = () => request('/api/v1/auth/me');

export const getLeaderboard = (period = 'all-time') =>
  request(`/api/v1/leaderboard?period=${encodeURIComponent(period)}`);

export const getUserStats = () => request('/api/v1/user/stats');
