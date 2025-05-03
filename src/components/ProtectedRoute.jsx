import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  // Get relevant state from the updated AuthContext
  const { isLoggedIn, isProfileSetupComplete, isLoading } = useAuth();

  // Show loading indicator while checking auth/profile state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* You can use your preferred loading spinner here */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not loading, check if user is logged in AND profile setup is complete
  if (!isLoggedIn || !isProfileSetupComplete) {
    // If either condition fails, redirect to login
    console.log('ProtectedRoute: Redirecting to login. LoggedIn:', isLoggedIn, 'ProfileSetup:', isProfileSetupComplete);
    return <Navigate to="/login" replace />;
  }

  // If logged in and profile is set up, render the child components
  return children;
}
  