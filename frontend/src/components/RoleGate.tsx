import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { hasPermission, Permission } from '../utils/rolePermissions';

interface RoleGateProps {
  permission?: Permission;
  requiredRole?: 'admin' | 'analyst' | 'viewer';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user role and permissions
 */
export const RoleGate: React.FC<RoleGateProps> = ({
  permission,
  requiredRole,
  fallback = null,
  children,
}) => {
  const { user } = useAuth();
  const userRole = user?.role;

  // Check role-based access
  if (requiredRole) {
    const hasRole = userRole?.toLowerCase() === requiredRole;
    if (!hasRole) return fallback as React.ReactElement | null;
  }

  // Check permission-based access
  if (permission) {
    if (!hasPermission(userRole, permission)) {
      return fallback as React.ReactElement | null;
    }
  }

  return children as React.ReactElement | null;
};
