import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true,
});

export const energyApi = {
  /* --- AUTHENTICATION ROUTES --- */
  login: async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      return res.data;
    } catch (err) {
      return err.response?.data || { success: false, message: 'Server error' };
    }
  },
  signup: async (userData) => {
    try {
      const res = await api.post('/auth/signup', userData);
      return res.data;
    } catch (err) {
      return err.response?.data || { success: false, message: 'Server error' };
    }
  },
  googleLogin: async (data) => {
    try {
      const res = await api.post('/auth/google', data);
      return res.data;
    } catch (err) {
      return err.response?.data || { success: false, message: 'Server error' };
    }
  },
  logout: async () => {
    try {
      const res = await api.post('/auth/logout');
      return res.data;
    } catch (err) {
      return err.response?.data || { success: false, message: 'Server error' };
    }
  },
  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err) {
      return err.response?.data || { success: false, message: 'Server error' };
    }
  },

  // Fetch distinct users list
  getUsers: async () => {
    const res = await api.get('/energy/users');
    return res.data;
  },

  // Fetch specific user's historical and real-time energy context
  getEnergyData: async (userId, limit = 168) => {
    const res = await api.get(`/energy/${userId}?limit=${limit}`);
    return res.data;
  },

  // Fetch ML anomaly alerts
  getAlerts: async (userId, limit = 10) => {
    const res = await api.get(`/energy/${userId}/alerts?limit=${limit}`);
    return res.data;
  }
};

export default api;
