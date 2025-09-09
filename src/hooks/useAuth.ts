"use client";

import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR'; 
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const { data: session, status } = useSession();

  const user = session?.user ? {
    id: session.user.id,
    name: session.user.name || '',
    email: session.user.email || '',
    role: session.user.role as 'ADMIN' | 'EDITOR',
  } : null;

  return {
    user,
    loading: status === 'loading',
  };
}; 