'use client';

import React, { createContext, useContext, useState } from 'react';
import type { EstablishmentCategory } from './reserva-types';
import { demoAuthUsers } from './data/auth-users';
import { getCategoryLabel } from './mock-data';

export type MockUser = {
  email: string;
  name: string;
  category: EstablishmentCategory;
  establishmentName: string;
};

type MockAuthUser = MockUser & {
  password: string;
};

const seedUsers: MockAuthUser[] = demoAuthUsers.map((user) => ({
  email: user.email,
  password: user.password,
  name: user.name,
  category: user.category,
  establishmentName: user.establishmentName,
}));

export function getMockUsers(): MockAuthUser[] {
  if (typeof window === 'undefined') return seedUsers;
  const stored = localStorage.getItem('mock_users');
  if (stored) {
    try {
      return [...seedUsers, ...JSON.parse(stored)];
    } catch {
      return seedUsers;
    }
  }
  return seedUsers;
}

export function authenticateMockUser(email: string, password: string): MockUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getMockUsers().find(
    (mockUser) => mockUser.email.toLowerCase() === normalizedEmail && mockUser.password === password,
  );

  if (!user) return null;

  return {
    email: user.email,
    name: user.name,
    category: user.category,
    establishmentName: user.establishmentName,
  };
}

type User = MockUser;

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  signup: (
    email: string,
    password: string,
    name: string,
    category: EstablishmentCategory,
    establishmentName?: string,
  ) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function persistUser(user: User) {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('owner_category', user.category);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const isAuthenticated = !!user;

  const login = (email: string, password: string): boolean => {
    const userData = authenticateMockUser(email, password);
    if (!userData) return false;
    persistUser(userData);
    setUser(userData);
    return true;
  };

  const signup = (
    email: string,
    password: string,
    name: string,
    category: EstablishmentCategory,
    establishmentName?: string,
  ): boolean => {
    const users = getMockUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return false;
    }

    const resolvedEstablishmentName =
      establishmentName?.trim() || `${name.split(' ')[0]}'s ${getCategoryLabel(category)}`;

    const newUser: MockAuthUser = {
      email: normalizedEmail,
      password,
      name,
      category,
      establishmentName: resolvedEstablishmentName,
    };

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mock_users');
      let registeredUsers: MockAuthUser[] = [];
      if (stored) {
        try {
          registeredUsers = JSON.parse(stored);
        } catch {
          registeredUsers = [];
        }
      }
      registeredUsers.push(newUser);
      localStorage.setItem('mock_users', JSON.stringify(registeredUsers));
    }

    const userData: User = {
      email: newUser.email,
      name: newUser.name,
      category: newUser.category,
      establishmentName: newUser.establishmentName,
    };
    persistUser(userData);
    setUser(userData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('owner_category');
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
