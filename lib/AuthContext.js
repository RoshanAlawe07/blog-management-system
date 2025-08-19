"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔐 AuthContext: Initializing Firebase auth listener...");
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔐 AuthContext: Auth state changed:", user ? `User: ${user.email}` : "No user");
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error("🔐 AuthContext: Auth error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      console.log("🔐 AuthContext: Logging out user...");
      await signOut(auth);
      console.log("🔐 AuthContext: User logged out successfully");
    } catch (error) {
      console.error('🔐 AuthContext: Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  };

  console.log("🔐 AuthContext: Current state - User:", user?.email, "Loading:", loading, "Authenticated:", !!user);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
