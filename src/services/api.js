import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('essai_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const tracksAPI = {
  getAll: (params) => api.get('/tracks', { params }),
  getById: (id) => api.get(`/tracks/${id}`),
  getFeatured: () => api.get('/tracks/featured'),
  getGenres: () => api.get('/tracks/genres'),
  search: (query) => api.post('/tracks/search', { query }),
  incrementPlay: (id) => api.post(`/tracks/${id}/play`),
};

export const playlistsAPI = {
  getAll: () => api.get('/playlists'),
  getById: (id) => api.get(`/playlists/${id}`),
  create: (data) => api.post('/playlists', data),
  update: (id, data) => api.put(`/playlists/${id}`, data),
  delete: (id) => api.delete(`/playlists/${id}`),
  addTrack: (playlistId, trackId) => api.post(`/playlists/${playlistId}/tracks`, { trackId }),
  removeTrack: (playlistId, trackId) => api.delete(`/playlists/${playlistId}/tracks/${trackId}`),
};

export const userAPI = {
  getFavorites: () => api.get('/user/favorites'),
  addFavorite: (trackId) => api.post(`/user/favorites/${trackId}`),
  removeFavorite: (trackId) => api.delete(`/user/favorites/${trackId}`),
  getRecentlyPlayed: () => api.get('/user/recently-played'),
  addRecentlyPlayed: (trackId) => api.post('/user/recently-played', { trackId }),
};

export const seedAPI = {
  populateFromAudioDB: () => api.post('/seed/populate-from-audiodb'),
  clearAll: () => api.delete('/seed/clear-all'),
};

export default api;
