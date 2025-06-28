import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  guestMode: boolean;
  setGuestMode: (guest: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [guestMode, setGuestModeState] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('focusreads-user');
    const savedGuestMode = localStorage.getItem('focusreads-guest');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedGuestMode) {
      setGuestModeState(JSON.parse(savedGuestMode));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setGuestModeState(false);
    localStorage.setItem('focusreads-user', JSON.stringify(userData));
    localStorage.removeItem('focusreads-guest');
  };

  const logout = () => {
    setUser(null);
    setGuestModeState(false);
    localStorage.removeItem('focusreads-user');
    localStorage.removeItem('focusreads-guest');
  };

  const setGuestMode = (guest: boolean) => {
    setGuestModeState(guest);
    if (guest) {
      setUser(null);
      localStorage.setItem('focusreads-guest', JSON.stringify(true));
      localStorage.removeItem('focusreads-user');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      guestMode,
      setGuestMode
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