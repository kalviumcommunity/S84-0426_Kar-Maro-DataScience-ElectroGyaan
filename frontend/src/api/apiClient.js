import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // Don't log 401 errors (expected when not logged in)
    if (err.response?.status !== 401) {
      console.error('[API Error]', err.message);
    }
    return Promise.reject(err);
  }
);

// Authentication API methods
export const energyApi = {
  // Auth endpoints
  signup: async (data) => {
    try {
      const response = await apiClient.post('/api/auth/signup', data);
      return { success: true, data: response.data.user };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  },

  login: async (data) => {
    try {
      const response = await apiClient.post('/api/auth/login', data);
      return { success: true, data: response.data.user };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  },

  googleLogin: async (data) => {
    try {
      const response = await apiClient.post('/api/auth/google', data);
      return { success: true, data: response.data.user };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Google login failed' };
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/api/auth/logout');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Logout failed' };
    }
  },

  getMe: async () => {
    try {
      const response = await apiClient.get('/api/auth/me');
      return { success: true, data: response.data.user };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to get user' };
    }
  }
};

export default apiClient;
