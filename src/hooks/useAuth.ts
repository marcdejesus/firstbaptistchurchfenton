"use client";

import { useState, useEffect } from 'react';

// This is a placeholder auth hook.
// In a real application, this would be replaced with your actual authentication logic,
// likely interacting with a context provider that wraps your app and connects to Firebase Auth.

interface User {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'user'; 
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    const timer = setTimeout(() => {
      // To test the admin view, you can manually set the user here.
      // In a real app, you'd get this from onAuthStateChanged from Firebase.
      setUser({
        uid: 'admin123',
        name: 'Admin User',
        email: 'admin@fbc.com',
        role: 'admin',
      });

      // To test the "Access Denied" view, comment out the above and uncomment below:
      // setUser({
      //   uid: 'user456',
      //   name: 'Regular User',
      //   email: 'user@fbc.com',
      //   role: 'user',
      // });

      // To test the logged-out state:
      // setUser(null);

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { user, loading };
}; 