import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devtrack_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect on 401 for non-auth routes (login/register return 401 for bad creds)
    const isAuthRoute = err.config?.url?.includes('/auth/');
    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('devtrack_token');
      localStorage.removeItem('devtrack_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;
