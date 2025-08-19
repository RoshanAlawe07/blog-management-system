'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'react-toastify';

const TestAuthPage = () => {
  const { signIn, signUp, user, isAuthenticated, logout } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Test User');

  const handleTestSignUp = async () => {
    try {
      await signUp(email, password, name);
      toast.success('Test sign up successful!');
    } catch (error) {
      toast.error(`Test sign up failed: ${error.message}`);
    }
  };

  const handleTestSignIn = async () => {
    try {
      await signIn(email, password);
      toast.success('Test sign in successful!');
    } catch (error) {
      toast.error(`Test sign in failed: ${error.message}`);
    }
  };

  const handleTestLogout = async () => {
    try {
      await logout();
      toast.success('Test logout successful!');
    } catch (error) {
      toast.error(`Test logout failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Firebase Auth Test Page
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Test your Firebase authentication setup
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={handleTestSignUp}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Test Sign Up
              </button>

              <button
                onClick={handleTestSignIn}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Test Sign In
              </button>

              <button
                onClick={handleTestLogout}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Test Logout
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Current Auth State:</h3>
              <p className="text-sm text-gray-600">
                <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
              </p>
              {user && (
                <>
                  <p className="text-sm text-gray-600">
                    <strong>User Email:</strong> {user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Display Name:</strong> {user.displayName || 'Not set'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuthPage;
