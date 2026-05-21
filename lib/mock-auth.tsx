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

export function getMockUsers(): MockAuthUser[] {
  if (typeof window === 'undefined') return mockAuthUsers;
  const stored = localStorage.getItem('mock_users');
  if (stored) {
    try {
      return [...mockAuthUsers, ...JSON.parse(stored)];
    } catch {
      return mockAuthUsers;
    }
  }
  return mockAuthUsers;
}

export function authenticateMockUser(email: string, password: string): MockUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getMockUsers();

  const user = users.find(
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
  signup: (email: string, password: string, name: string) => boolean;
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

  const isAuthenticated = !!user;

  const login = (email: string, password: string): boolean => {
    const userData = authenticateMockUser(email, password);

    if (!userData) {
      return false;
    }

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return true;
  };

  const signup = (email: string, password: string, name: string): boolean => {
    const users = getMockUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return false;
    }

    const newUser: MockAuthUser = {
      email: normalizedEmail,
      password,
      name,
    };

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mock_users');
      let registeredUsers: MockAuthUser[] = [];
      if (stored) {
        try {
          registeredUsers = JSON.parse(stored);
        } catch {}
      }
      registeredUsers.push(newUser);
      localStorage.setItem('mock_users', JSON.stringify(registeredUsers));
    }

    const userData = { email: newUser.email, name: newUser.name };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, signup }}>
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
