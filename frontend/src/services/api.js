import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Auth Routes
export const loginUser = async (credentials) => (await api.post('/auth/login', credentials)).data;
export const googleLogin = async (token) => (await api.post('/auth/google', { token })).data;
export const getCurrentUser = async () => (await api.get('/auth/me')).data;

// Energy / Dashboard Routes
export const getDashboardKPIs = async () => (await api.get('/energy/dashboard/kpis')).data;
export const getActiveAnomalies = async () => (await api.get('/energy/anomalies/active')).data;
export const getSocietyApartments = async () => (await api.get('/energy/apartments')).data;
export const getApartmentDetails = async (flatId) => (await api.get(`/energy/apartments/${flatId}`)).data;

export default api;