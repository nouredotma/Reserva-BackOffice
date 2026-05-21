'use client';

import React, { createContext, useContext, useState } from 'react';

export type MockUser = {
  email: string;
  name: string;
};

type MockAuthUser = MockUser & {
  password: string;
};

export const mockAuthUsers: MockAuthUser[] = [
  {
    email: 'omar@gmail.com',
    password: 'omar123',
    name: 'Omar',
  },
];

export function authenticateMockUser(email: string, password: string): MockUser | null {
  const normalizedEmail = email.trim().toLowerCase();

  const user = mockAuthUsers.find(
    (mockUser) => mockUser.email.toLowerCase() === normalizedEmail && mockUser.password === password
  );

  if (!user) {
    return null;
  }

  return {
    email: user.email,
    name: user.name,
  };
}

// React Auth Context logic
type User = MockUser;

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('user');
    }
    return false;
  });

  const login = (email: string, password: string): boolean => {
    const userData = authenticateMockUser(email, password);

    if (!userData) {
      return false;
    }

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
