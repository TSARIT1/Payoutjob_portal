import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  clearAuthSession,
  fetchCurrentUser,
  getStoredToken,
  getStoredUser,
  loginUser,
  storeAuthSession,
  updateUserProfile
} from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getStoredToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const { user: currentUser } = await fetchCurrentUser();
        storeAuthSession({ token, user: currentUser });
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthSession();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password, role = 'Student') => {
    try {
      setIsLoading(true);
      const data = await loginUser({ email, password, role });
      storeAuthSession(data);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error?.response?.data?.error || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsEmployer = (email, password) => login(email, password, 'Employer');

  const applySession = ({ token, user: sessionUser }) => {
    storeAuthSession({ token, user: sessionUser });
    setUser(sessionUser);
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
  };

  const updateProfile = async (updatedData) => {
    const { user: updatedUser } = await updateUserProfile(updatedData);
    storeAuthSession({ token: getStoredToken(), user: updatedUser });
    setUser(updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    isLoading,
    login,
    loginAsEmployer,
    applySession,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};