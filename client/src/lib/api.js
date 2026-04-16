// client/src/lib/api.js
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach token from localStorage automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('devtrack_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear token and redirect to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('devtrack_token');
      localStorage.removeItem('devtrack_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
