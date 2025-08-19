"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Image from 'next/image';

const AuthButton = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  console.log("🔐 AuthButton: Current state - User:", user?.email, "Authenticated:", isAuthenticated);

  const handleSignInSwitch = () => {
    console.log("🔐 AuthButton: Switching to Sign In");
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const handleSignUpSwitch = () => {
    console.log("🔐 AuthButton: Switching to Sign Up");
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const handleLogout = async () => {
    console.log("🔐 AuthButton: Logging out...");
    await logout();
    setShowUserMenu(false);
  };

  if (!isAuthenticated) {
    console.log("🔐 AuthButton: User not authenticated, showing Sign In/Sign Up buttons");
    return (
      <>
        <div className="flex gap-3">
          <button
            onClick={() => {
              console.log("🔐 AuthButton: Sign In button clicked");
              setShowSignIn(true);
            }}
            className="auth-button-secondary px-4 py-2 rounded-md font-medium"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              console.log("🔐 AuthButton: Sign Up button clicked");
              setShowSignUp(true);
            }}
            className="auth-button px-4 py-2 rounded-md font-medium"
          >
            Sign Up
          </button>
        </div>

        {showSignIn && (
          <SignIn
            onClose={() => setShowSignIn(false)}
            onSwitchToSignUp={handleSignUpSwitch}
          />
        )}

        {showSignUp && (
          <SignUp
            onClose={() => setShowSignUp(false)}
            onSwitchToSignIn={handleSignInSwitch}
          />
        )}
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:block text-gray-700 font-medium">
          {user?.displayName || user?.email}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <div className="font-medium">{user?.displayName || 'User'}</div>
            <div className="text-gray-500">{user?.email}</div>
          </div>
          <button
            onClick={() => window.location.href = '/admin'}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Admin Panel
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
