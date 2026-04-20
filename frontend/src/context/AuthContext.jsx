import { createContext, useContext, useState, useEffect } from 'react';
import { energyApi } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Temporary bypass: Treat the user as logged out or mock a logged-in user without making API calls
      // because the backend might not be running right now.
      setUser({ name: 'Admin', email: 'admin@greenmeadows.com', role: 'admin' });
      setLoading(false);
      /*
      try {
        const response = await energyApi.getMe();
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
      */
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const response = await energyApi.login({ email, password });
    if (response.success) {
      setUser(response.data);
      return { success: true };
    }
    return response;
  };

  const signUp = async (name, email, password) => {
    const response = await energyApi.signup({ name, email, password });
    if (response.success) {
      setUser(response.data);
      return { success: true };
    }
    return response;
  };

  const googleLogin = async (token) => {
    const response = await energyApi.googleLogin({ token });
    if (response.success) {
      setUser(response.data);
      return { success: true };
    }
    return response;
  };

  const logout = async () => {
    await energyApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, googleLogin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);