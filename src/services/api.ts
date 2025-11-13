const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request(endpoint: string, options: RequestOptions = {}) {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const authAPI = {
  register: (data: { email: string; password: string; name: string; age: number; gender?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  logout: (token: string) =>
    request('/auth/logout', { method: 'POST', token }),

  refresh: (refresh_token: string) =>
    request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refresh_token }) }),

  verify: (token: string) =>
    request('/auth/verify', { method: 'POST', token }),
};

export const profileAPI = {
  getMe: (token: string) =>
    request('/profiles/me', { token }),

  getProfile: (userId: string) =>
    request(`/profiles/${userId}`),

  updateProfile: (data: any, token: string) =>
    request('/profiles/me', { method: 'PUT', body: JSON.stringify(data), token }),

  updateDetails: (data: any, token: string) =>
    request('/profiles/me/details', { method: 'PUT', body: JSON.stringify(data), token }),

  getExploreFeeds: (token: string, limit = 10, offset = 0) =>
    request(`/profiles/explore/feed?limit=${limit}&offset=${offset}`, { token }),
};

export const interactionAPI = {
  create: (data: { target_user_id: string; interaction_type: string; comment_text?: string }, token: string) =>
    request('/interactions', { method: 'POST', body: JSON.stringify(data), token }),

  getUserInteractions: (userId: string, token: string) =>
    request(`/interactions/user/${userId}`, { token }),

  getStats: (token: string) =>
    request('/interactions/stats', { token }),
};

export const matchAPI = {
  getAll: (token: string) =>
    request('/matches', { token }),

  getOne: (matchId: string, token: string) =>
    request(`/matches/${matchId}`, { token }),
};

export const messageAPI = {
  send: (matchId: string, content: string, token: string) =>
    request(`/messages/${matchId}`, { method: 'POST', body: JSON.stringify({ content }), token }),

  getMessages: (matchId: string, token: string, limit = 50, offset = 0) =>
    request(`/messages/${matchId}?limit=${limit}&offset=${offset}`, { token }),

  markAsRead: (messageId: string, token: string) =>
    request(`/messages/${messageId}/read`, { method: 'PATCH', token }),
};

export const uploadAPI = {
  uploadAvatar: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }

    return response.json();
  },

  uploadPhotos: async (files: File[], token: string) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE}/upload/profile-photos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload photos');
    }

    return response.json();
  },

  deletePhoto: (photoId: string, token: string) =>
    request(`/upload/profile-photos/${photoId}`, { method: 'DELETE', token }),
};
