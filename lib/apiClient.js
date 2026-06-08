const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function getApiUrl(path) {
  const base = API_URL.replace(/\/$/, '');
  const route = path.startsWith('/') ? path : `/${path}`;
  return `${base}${route}`;
}

export async function apiFetch(path, options = {}) {
  const { token, skipContentType, ...fetchOptions } = options;
  const headers = {
    ...(skipContentType ? {} : { 'Content-Type': 'application/json' }),
    ...(fetchOptions.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(getApiUrl(path), {
    ...fetchOptions,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed');
  }

  return data;
}

export async function apiUpload(path, formData, token) {
  const response = await fetch(getApiUrl(path), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Upload failed');
  }

  return data;
}

export const authApi = {
  signup: (body) => apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: (token) => apiFetch('/api/auth/logout', { method: 'POST', token }),
  me: (token) => apiFetch('/api/auth/me', { token }),
  forgotPassword: (body) =>
    apiFetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) =>
    apiFetch('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  changePassword: (body, token) =>
    apiFetch('/api/auth/change-password', { method: 'POST', body: JSON.stringify(body), token }),
};

export const profileApi = {
  getProfile: (token) => apiFetch('/api/users/me', { token }),
  updateProfile: (body, token) =>
    apiFetch('/api/users/me', { method: 'PATCH', body: JSON.stringify(body), token }),
  uploadAvatar: (file, token) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiUpload('/api/users/me/avatar', formData, token);
  },
  getInterests: (token) => apiFetch('/api/users/me/interests', { token }),
  updateInterests: (interests, token) =>
    apiFetch('/api/users/me/interests', {
      method: 'PUT',
      body: JSON.stringify({ interests }),
      token,
    }),
  getPreferences: (token) => apiFetch('/api/users/me/preferences', { token }),
  updatePreferences: (travelPreferences, token) =>
    apiFetch('/api/users/me/preferences', {
      method: 'PUT',
      body: JSON.stringify(travelPreferences),
      token,
    }),
};
