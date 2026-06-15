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

export const discoverApi = {
  browseTravelers: (params, token) => {
    const query = new URLSearchParams();
    if (params?.destination) query.set('destination', params.destination);
    if (params?.interests) query.set('interests', params.interests);
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    const qs = query.toString();
    return apiFetch(`/api/users/discover${qs ? `?${qs}` : ''}`, { token });
  },
  getTraveler: (id, token) => apiFetch(`/api/users/${id}`, { token }),
  getMatchScore: (id, token) => apiFetch(`/api/users/${id}/match-score`, { token }),
};

export const connectionApi = {
  sendRequest: (targetUserId, token) =>
    apiFetch('/api/connections', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
      token,
    }),
  list: (status, token) => {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiFetch(`/api/connections${qs}`, { token });
  },
  accept: (id, token) =>
    apiFetch(`/api/connections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'accepted' }),
      token,
    }),
  reject: (id, token) =>
    apiFetch(`/api/connections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'rejected' }),
      token,
    }),
};

export const groupApi = {
  list: (params, token) => {
    const query = new URLSearchParams();
    if (params?.destination) query.set('destination', params.destination);
    if (params?.dateFrom) query.set('dateFrom', params.dateFrom);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    const qs = query.toString();
    return apiFetch(`/api/groups${qs ? `?${qs}` : ''}`, { token });
  },
  get: (id, token) => apiFetch(`/api/groups/${id}`, { token }),
  create: (body, token) =>
    apiFetch('/api/groups', { method: 'POST', body: JSON.stringify(body), token }),
  update: (id, body, token) =>
    apiFetch(`/api/groups/${id}`, { method: 'PATCH', body: JSON.stringify(body), token }),
  join: (id, token) => apiFetch(`/api/groups/${id}/join`, { method: 'POST', token }),
  leave: (id, token) =>
    apiFetch(`/api/groups/${id}/members/me`, { method: 'DELETE', token }),
};

export const uploadApi = {
  image: (file, token) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiUpload('/api/uploads/image', formData, token);
  },
};

export const travelApi = {
  list: (params, token) => {
    const query = new URLSearchParams();
    if (params?.destination) query.set('destination', params.destination);
    if (params?.status) query.set('status', params.status);
    if (params?.upcoming) query.set('upcoming', 'true');
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    const qs = query.toString();
    return apiFetch(`/api/travels${qs ? `?${qs}` : ''}`, { token });
  },
  get: (id, token) => apiFetch(`/api/travels/${id}`, { token }),
};

export const adminTravelApi = {
  list: (params, token) => {
    const query = new URLSearchParams();
    if (params?.destination) query.set('destination', params.destination);
    if (params?.status) query.set('status', params.status);
    if (params?.published) query.set('published', params.published);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    const qs = query.toString();
    return apiFetch(`/api/admin/travels${qs ? `?${qs}` : ''}`, { token });
  },
  get: (id, token) => apiFetch(`/api/admin/travels/${id}`, { token }),
  create: (body, token) =>
    apiFetch('/api/admin/travels', { method: 'POST', body: JSON.stringify(body), token }),
  update: (id, body, token) =>
    apiFetch(`/api/admin/travels/${id}`, { method: 'PATCH', body: JSON.stringify(body), token }),
  delete: (id, token) => apiFetch(`/api/admin/travels/${id}`, { method: 'DELETE', token }),
};

export const conversationApi = {
  list: (token) => apiFetch('/api/conversations', { token }),
  create: (targetUserId, token) =>
    apiFetch('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
      token,
    }),
  get: (id, token) => apiFetch(`/api/conversations/${id}`, { token }),
  getMessages: (id, params, token) => {
    const query = new URLSearchParams();
    if (params?.before) query.set('before', params.before);
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return apiFetch(`/api/conversations/${id}/messages${qs ? `?${qs}` : ''}`, { token });
  },
  sendMessage: (id, text, token) =>
    apiFetch(`/api/conversations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
      token,
    }),
  markRead: (id, token) =>
    apiFetch(`/api/conversations/${id}/read`, { method: 'PATCH', token }),
  search: (q, token) =>
    apiFetch(`/api/conversations/search?q=${encodeURIComponent(q)}`, { token }),
};
