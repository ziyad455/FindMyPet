// Authentication Context Provider
// Manages user authentication state across the application

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { User, AuthContextType } from '../types';
import {
  loginWithEmailPassword,
  registerWithEmailPassword,
  signInWithGoogle,
  logout as authLogout,
  onAuthChange,
  getUserData
} from '../services/authService';

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: async () => {},
  isAdmin: false
});

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use a ref to store resolve functions for pending auth operations
  const authResolverRef = useRef<((user: User | null) => void) | null>(null);
  const isAuthenticatingRef = useRef(false);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid || 'null');
      
      if (firebaseUser) {
        // Fetch user data from Firestore including role
        const userData = await getUserData(firebaseUser.uid);
        console.log('User data fetched:', userData);
        setUser(userData);
        
        // Resolve any pending auth operation
        if (authResolverRef.current) {
          console.log('Resolving pending auth operation');
          authResolverRef.current(userData);
          authResolverRef.current = null;
        }
      } else {
        setUser(null);
        // Resolve any pending auth operation
        if (authResolverRef.current) {
          authResolverRef.current(null);
          authResolverRef.current = null;
        }
      }
      
      setLoading(false);
      isAuthenticatingRef.current = false;
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Helper to wait for auth state to update
  const waitForAuthUpdate = (): Promise<User | null> => {
    return new Promise((resolve) => {
      // Set a timeout to prevent hanging forever
      const timeout = setTimeout(() => {
        console.log('Auth update timeout - resolving with current user');
        if (authResolverRef.current === resolve) {
          authResolverRef.current = null;
        }
        resolve(user);
      }, 10000);
      
      authResolverRef.current = (userData) => {
        clearTimeout(timeout);
        resolve(userData);
      };
    });
  };

  // Login with email and password
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    isAuthenticatingRef.current = true;
    setLoading(true);
    try {
      await loginWithEmailPassword(email, password);
      // Wait for onAuthChange to update user state
      const userData = await waitForAuthUpdate();
      console.log('Login complete, user:', userData);
    } catch (error) {
      setLoading(false);
      isAuthenticatingRef.current = false;
      throw error;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login with Google
  const loginWithGoogle = useCallback(async (): Promise<void> => {
    isAuthenticatingRef.current = true;
    setLoading(true);
    try {
      await signInWithGoogle();
      // Wait for onAuthChange to update user state
      const userData = await waitForAuthUpdate();
      console.log('Google login complete, user:', userData);
    } catch (error) {
      setLoading(false);
      isAuthenticatingRef.current = false;
      throw error;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Register new user
  const register = useCallback(async (
    email: string,
    password: string,
    displayName: string
  ): Promise<void> => {
    isAuthenticatingRef.current = true;
    setLoading(true);
    try {
      await registerWithEmailPassword(email, password, displayName);
      // Wait for onAuthChange to update user state
      const userData = await waitForAuthUpdate();
      console.log('Registration complete, user:', userData);
    } catch (error) {
      setLoading(false);
      isAuthenticatingRef.current = false;
      throw error;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Logout current user
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authLogout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if current user is admin
  const isAdmin = user?.role === 'admin';

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
