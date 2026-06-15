/**
 * Role-based permission utilities for frontend access control
 */

export const UserRole = {
  ADMIN: 'admin',
  ANALYST: 'analyst',
  VIEWER: 'viewer',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const Permission = {
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  API_LOGS_READ: 'api_logs:read',
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
  REPORTS_READ: 'reports:read',
  ANALYTICS_READ: 'analytics:read',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

// Role to permissions mapping (mirrored from backend)
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,
    Permission.API_LOGS_READ,
    Permission.REPORTS_READ,
    Permission.ANALYTICS_READ,
  ],
  [UserRole.ANALYST]: [
    Permission.USER_READ,
    Permission.SETTINGS_READ,
    Permission.API_LOGS_READ,
    Permission.REPORTS_READ,
    Permission.ANALYTICS_READ,
  ],
  [UserRole.VIEWER]: [
    Permission.USER_READ,
    Permission.SETTINGS_READ,
    Permission.ANALYTICS_READ,
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: string | undefined, permission: Permission): boolean {
  if (!role) return false;

  const roleEnum = role.toLowerCase() as UserRole;
  const permissions = ROLE_PERMISSIONS[roleEnum] || [];
  return permissions.includes(permission);
}

/**
 * Check if a user can create something (admin only)
 */
export function canCreate(role: string | undefined): boolean {
  return hasPermission(role, Permission.USER_CREATE);
}

/**
 * Check if a user can edit something (admin only)
 */
export function canEdit(role: string | undefined): boolean {
  return hasPermission(role, Permission.USER_UPDATE);
}

/**
 * Check if a user can delete something (admin only)
 */
export function canDelete(role: string | undefined): boolean {
  return hasPermission(role, Permission.USER_DELETE);
}

/**
 * Check if a user can read (all roles)
 */
export function canRead(role: string | undefined): boolean {
  return hasPermission(role, Permission.USER_READ);
}

/**
 * Check if a user can view API logs (admin and analyst)
 */
export function canViewAPILogs(role: string | undefined): boolean {
  return hasPermission(role, Permission.API_LOGS_READ);
}

/**
 * Check if a user can access settings (all roles)
 */
export function canAccessSettings(role: string | undefined): boolean {
  return hasPermission(role, Permission.SETTINGS_READ);
}

/**
 * Check if a user can update settings (admin only)
 */
export function canUpdateSettings(role: string | undefined): boolean {
  return hasPermission(role, Permission.SETTINGS_UPDATE);
}

/**
 * Check if a user is admin
 */
export function isAdmin(role: string | undefined): boolean {
  return role?.toLowerCase() === UserRole.ADMIN;
}

/**
 * Check if a user is analyst or admin
 */
export function isAnalystOrAdmin(role: string | undefined): boolean {
  const normalizedRole = role?.toLowerCase();
  return normalizedRole === UserRole.ANALYST || normalizedRole === UserRole.ADMIN;
}
