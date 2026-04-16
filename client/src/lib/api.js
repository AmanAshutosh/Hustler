// client/src/lib/api.js
import axios from "axios";

// FIXED: Uses the environment variable if it exists (Vercel), otherwise defaults to local proxy
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach token from localStorage automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("devtrack_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("devtrack_token");
      localStorage.removeItem("devtrack_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
