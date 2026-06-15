import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAnalystOrAdmin, isAdmin } from '../utils/rolePermissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'analyst' | 'viewer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole) {
    const hasRequiredRole =
      requiredRole === 'admin' ? isAdmin(user?.role) :
      requiredRole === 'analyst' ? isAnalystOrAdmin(user?.role) :
      true;

    if (!hasRequiredRole) {
      // Redirect to home with insufficient permissions
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
