"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { AuthService, SignUpData, SignInData } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types';

interface UserContextType {
  user: User | null;
  signUp: (data: SignUpData) => Promise<User>;
  signIn: (data: SignInData) => Promise<User>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: isLoading } = useAuth();

  const signUp = async (data: SignUpData): Promise<User> => {
    return await AuthService.signUp(data);
  };

  const signIn = async (data: SignInData): Promise<User> => {
    return await AuthService.signIn(data);
  };

  const signOut = async (): Promise<void> => {
    await AuthService.signOut();
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    await AuthService.sendPasswordReset(email);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      signUp, 
      signIn, 
      signOut, 
      sendPasswordReset, 
      isLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
