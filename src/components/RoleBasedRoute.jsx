import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Removed requiredPermissions prop for MVP simplicity, focusing on roles
export default function RoleBasedRoute({ children, allowedRoles }) {
  const { userRole, isLoading, isLoggedIn, isProfileSetupComplete } = useAuth();

  // Rely on ProtectedRoute to handle initial loading and basic login/profile check
  // but add a check here just in case it's used standalone or context updates slowly.
  if (isLoading) {
     // Can show a minimal loading state or null, as ProtectedRoute handles the main one.
     return null; 
  }

  // Although ProtectedRoute should handle this, double-check for safety.
  if (!isLoggedIn || !isProfileSetupComplete) {
     console.log('RoleBasedRoute: User not logged in or profile not set up.');
    return <Navigate to="/login" replace />;
  }

  // Check if the user's role (from profile) is included in the allowed roles
  if (!userRole || !allowedRoles || !allowedRoles.includes(userRole)) {
    // Redirect to unauthorized if role is missing or not allowed
    console.log(`RoleBasedRoute: Access denied. User role '${userRole}' not in allowed roles [${allowedRoles?.join(', ')}]`);
    return <Navigate to="/unauthorized" replace />;
  }

  // If role is allowed, render the child components
  return children;
} 