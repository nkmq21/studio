
"use client";

import type { User, UserRole } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_USERS } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';

interface CredentialsToUpdate {
  credentialIdNumber?: string;
  credentialIdImageUrl?: string;
}
interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>; // Pass is unused for mock
  signup: (name: string, email: string, pass: string, role: UserRole) => Promise<boolean>; // Pass is unused
  logout: () => void;
  loginWithGoogle: () => Promise<boolean>;
  updateUserCredentials: (credentials: CredentialsToUpdate) => Promise<boolean>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUser = localStorage.getItem('motoRentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem('motoRentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _pass: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const foundUser = MOCK_USERS.find(u => u.email === email); // In a real app, MOCK_USERS would be a database
    if (foundUser) {
      const userToStore = { ...foundUser, lastLogin: new Date() }; // Update lastLogin on login
      setUser(userToStore);
      localStorage.setItem('motoRentUser', JSON.stringify(userToStore));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const signup = async (name: string, email: string, _pass: string, role: UserRole) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user exists in MOCK_USERS (simulating database check)
    // This is a simplified check; a real app would query a DB.
    let existingUser = MOCK_USERS.find(u => u.email === email);
    if (!existingUser) {
        // Also check localStorage in case user signed up but isn't in MOCK_USERS (edge case for mock)
        const storedUserString = localStorage.getItem('motoRentUser');
        if (storedUserString) {
            try {
                const storedUser = JSON.parse(storedUserString);
                if (storedUser.email === email) {
                    existingUser = storedUser;
                }
            } catch (e) { /* ignore parsing error */ }
        }
    }

    if (existingUser) {
      setLoading(false);
      return false; // User already exists
    }

    const newUser: User = { 
        id: `user${Date.now()}`, 
        name, 
        email, 
        role, 
        avatarUrl: 'https://placehold.co/100x100.png',
        lastLogin: new Date(),
        credentialIdNumber: undefined,
        credentialIdImageUrl: undefined,
    };
    // In a real app, this would be an API call that also updates MOCK_USERS or DB
    setUser(newUser);
    localStorage.setItem('motoRentUser', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const googleUserEmail = 'google.user@vroomvroom.vn'; // Changed domain
    
    // Check if this Google user exists in MOCK_USERS or localStorage
    let foundUser = MOCK_USERS.find(u => u.email === googleUserEmail);
    if (!foundUser) {
        const storedUserString = localStorage.getItem('motoRentUser');
        if (storedUserString) {
            try {
                const storedUser = JSON.parse(storedUserString);
                if (storedUser.email === googleUserEmail) {
                    foundUser = storedUser;
                }
            } catch (e) { /* ignore */ }
        }
    }

    const userToLogin: User = foundUser || { 
      id: `user-google-${Date.now()}`, 
      name: 'Google User', 
      email: googleUserEmail, 
      role: 'renter', 
      avatarUrl: 'https://placehold.co/100x100.png',
      credentialIdNumber: undefined,
      credentialIdImageUrl: undefined,
    };
    
    userToLogin.lastLogin = new Date(); // Update lastLogin

    setUser(userToLogin);
    localStorage.setItem('motoRentUser', JSON.stringify(userToLogin));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('motoRentUser');
    router.push('/auth/login'); // Ensure redirect to login after logout
  };

  const updateUserCredentials = async (credentials: CredentialsToUpdate) => {
    if (!user) return false;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
    const updatedUser = { 
      ...user, 
      ...credentials 
    };
    setUser(updatedUser);
    localStorage.setItem('motoRentUser', JSON.stringify(updatedUser));

    // Also update in MOCK_USERS if the user exists there (for consistency in admin views etc.)
    const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (userIndex > -1) {
      MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...credentials };
    }
    
    setLoading(false);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loginWithGoogle, updateUserCredentials, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
