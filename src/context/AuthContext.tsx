// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
  setUser: () => {},
  setIsAuthenticated: () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isTokenValid()) {
          const currentUser = authService.getCurrentUser();
          const currentUserId = authService.getUserId();
          if (currentUser && currentUserId) {
            setUser(currentUser);
            setUserId(currentUserId);
            setIsAuthenticated(true);
          } else {
            // If we have a valid token but no user data, clear everything
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  // Don't render children until authentication is initialized
  if (isLoading) {
    return null; // Or return a loading spinner/placeholder
  }

  return (
    <AuthContext.Provider value={{
      user,
      userId,
      isAuthenticated,
      isLoading,
      logout,
      setUser,
      setIsAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
}