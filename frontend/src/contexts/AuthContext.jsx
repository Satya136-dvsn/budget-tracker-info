import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    if (token) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUserProfile = async () => {
    try {
      const profile = await apiService.getUserProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      if (response.token) {
        setToken(response.token);
        setUser(response);
        localStorage.setItem('authToken', response.token);
        return response;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      if (response.token && response.id) {
        setToken(response.token);
        setUser(response);
        localStorage.setItem('authToken', response.token);
        return response;
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    loadUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};