"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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

  const signIn = async (email, password) => {
    try {
      console.log("🔐 AuthContext: Signing in user:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("🔐 AuthContext: User signed in successfully:", userCredential.user.email);
      return userCredential.user;
    } catch (error) {
      console.error("🔐 AuthContext: Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (email, password, displayName) => {
    try {
      console.log("🔐 AuthContext: Creating user account:", email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
        console.log("🔐 AuthContext: User profile updated with display name:", displayName);
      }
      
      console.log("🔐 AuthContext: User account created successfully:", userCredential.user.email);
      return userCredential.user;
    } catch (error) {
      console.error("🔐 AuthContext: Sign up error:", error);
      throw error;
    }
  };

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
    signIn,
    signUp,
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
