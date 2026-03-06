
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  username: string;
  encryptionKey: string | null;
};

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  generateKey: () => string;
  setEncryptionKey: (key: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Check if user is stored in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('vaultify-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('vaultify-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vaultify-user');
    }
  }, [user]);

  const login = (username: string) => {
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      encryptionKey: null,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const generateKey = () => {
    // Create a random key - in a real app, this would be more sophisticated
    const key = Array(64)
      .fill('')
      .map(() => Math.random().toString(36).charAt(2))
      .join('');
    
    if (user) {
      setUser({ ...user, encryptionKey: key });
    }
    
    return key;
  };

  const setEncryptionKey = (key: string) => {
    if (user) {
      setUser({ ...user, encryptionKey: key });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    generateKey,
    setEncryptionKey,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
