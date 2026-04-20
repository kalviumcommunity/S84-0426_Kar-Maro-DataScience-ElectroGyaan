import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

export const energyApi = {
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
