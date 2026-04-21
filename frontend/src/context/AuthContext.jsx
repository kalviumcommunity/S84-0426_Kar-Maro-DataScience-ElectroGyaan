import { createContext, useContext, useState, useEffect } from 'react';
import { energyApi } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await energyApi.getMe();
        if (response.success) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        // Silent fail - user is not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const response = await energyApi.login({ email, password });
    if (response.success) {
      setUser(response.data);
      return { success: true };
    }
    throw new Error(response.message || 'Login failed');
  };

  const signUp = async (name, email, password) => {
    const response = await energyApi.signup({ name, email, password });
    if (response.success) {
      setUser(response.data);
      return { success: true };
    }
    throw new Error(response.message || 'Signup failed');
  };

  const googleLogin = async (token) => {
    const response = await energyApi.googleLogin({ token });
    if (response.success) {
      setUser(response.data);
      return { success: true };
    }
    throw new Error(response.message || 'Google login failed');
  };

  const logout = async () => {
    try {
      await energyApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, googleLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);