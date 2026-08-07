/**
 * File: client/src/components/AuthContext.jsx
 * Description: Global authentication context provider managing user session,
 *              JWT HTTP-only cookie validation, registration, local & Google OAuth login,
 *              logout, account deletion, and global auth modal state.
 */

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Check active user session on mount
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.success && response.data?.user) {
      setUser(response.data.user);
      setIsAuthModalOpen(false);
      return response.data.user;
    }
    throw new Error(response.data?.message || 'Login failed.');
  };

  // Google OAuth Login handler
  const googleLogin = async (credential) => {
    const response = await api.post('/auth/google', { credential });
    if (response.data?.success && response.data?.user) {
      setUser(response.data.user);
      setIsAuthModalOpen(false);
      return response.data.user;
    }
    throw new Error(response.data?.message || 'Google login failed.');
  };

  // Register handler (accepts FormData with profilePic file)
  const register = async (formData) => {
    const response = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (response.data?.success && response.data?.user) {
      setUser(response.data.user);
      setIsAuthModalOpen(false);
      return response.data.user;
    }
    throw new Error(response.data?.message || 'Registration failed.');
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  // Delete account handler
  const deleteAccount = async () => {
    try {
      await api.delete('/auth/delete');
    } catch (err) {
      console.error('Delete account error:', err);
      throw err;
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      googleLogin, 
      register, 
      logout, 
      deleteAccount, 
      checkAuth,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
