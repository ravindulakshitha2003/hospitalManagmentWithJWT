import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userInfo = localStorage.getItem('user_info');
    const role = localStorage.getItem('selected_role');

    if (accessToken && userInfo) {
      try {
        setUser(JSON.parse(userInfo));
        setSelectedRole(role);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(username, password);

      // Store tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);

      // Store user info
      const userInfo = {
        username: response.username || username,
        roles: response.roles || [],
        email: response.email,
        mobile: response.mobile,
      };
      localStorage.setItem('user_info', JSON.stringify(userInfo));

      setUser(userInfo);

      // If multiple roles, return roles and let component handle selection
      // If single role, auto-select it
      if (response.roles && response.roles.length > 1) {
        return { success: true, roles: response.roles, requiresRoleSelection: true };
      } else if (response.roles && response.roles.length === 1) {
        setSelectedRole(response.roles[0]);
        localStorage.setItem('selected_role', response.roles[0]);
        setIsAuthenticated(true);
        return { success: true, roles: response.roles, requiresRoleSelection: false };
      }

      return { success: true, roles: response.roles, requiresRoleSelection: false };
    } catch (err) {
      const errorMessage = err.error || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const selectRole = useCallback((role) => {
    setSelectedRole(role);
    localStorage.setItem('selected_role', role);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(async (username, password, email, mobile) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(username, password, email, mobile);
      return { success: true, message: response.message || 'Registration successful' };
    } catch (err) {
      const errorMessage = err.error || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setSelectedRole(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const value = {
    user,
    selectedRole,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    selectRole,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
