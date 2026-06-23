// client/src/store/auth.js
import { create } from 'zustand';
import api from '../lib/api.js';

const stored = () => {
  try {
    return {
      user:  JSON.parse(localStorage.getItem('devtrack_user') || 'null'),
      token: localStorage.getItem('devtrack_token') || null,
    };
  } catch { return { user: null, token: null }; }
};

export const useAuth = create((set) => ({
  ...stored(),

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('devtrack_token', data.token);
    localStorage.setItem('devtrack_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    return data;
  },

  register: async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('devtrack_token', data.token);
    localStorage.setItem('devtrack_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    return data;
  },

  // Validates the stored token against the server.
  // If the server no longer has the user (e.g. after a restart), logs out.
  validateToken: async () => {
    const state = useAuth.getState();
    if (!state.token) return false;
    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem('devtrack_user', JSON.stringify(data));
      set({ user: data });
      return true;
    } catch (err) {
      // Only invalidate on explicit auth rejection — not network/server errors
      if (err?.response?.status === 401) {
        localStorage.removeItem('devtrack_token');
        localStorage.removeItem('devtrack_user');
        set({ user: null, token: null });
      }
      return false;
    }
  },

  logout: () => {
    // Fire-and-forget — don't block the UI logout on the network call,
    // but still record the event for the activity timeline.
    api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('devtrack_token');
    localStorage.removeItem('devtrack_user');
    set({ user: null, token: null });
  },

  setUser: (user) => {
    localStorage.setItem('devtrack_user', JSON.stringify(user));
    set({ user });
  },
}));
