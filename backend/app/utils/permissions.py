"""Role-based access control and permission definitions"""
from enum import Enum
from typing import List, Set


class Permission(str, Enum):
    """Permissions for user actions"""
    USER_READ = "user:read"
    USER_CREATE = "user:create"
    USER_UPDATE = "user:update"
    USER_DELETE = "user:delete"
    SETTINGS_READ = "settings:read"
    SETTINGS_UPDATE = "settings:update"
    API_LOGS_READ = "api_logs:read"
    REPORTS_READ = "reports:read"
    ANALYTICS_READ = "analytics:read"


class Role(str, Enum):
    """User roles"""
    ADMIN = "admin"
    ANALYST = "analyst"
    VIEWER = "viewer"


# Role to permissions mapping
ROLE_PERMISSIONS: dict[Role, Set[Permission]] = {
    Role.ADMIN: {
        Permission.USER_READ,
        Permission.USER_CREATE,
        Permission.USER_UPDATE,
        Permission.USER_DELETE,
        Permission.SETTINGS_READ,
        Permission.SETTINGS_UPDATE,
        Permission.API_LOGS_READ,
        Permission.REPORTS_READ,
        Permission.ANALYTICS_READ,
    },
    Role.ANALYST: {
        Permission.USER_READ,
        Permission.SETTINGS_READ,
        Permission.API_LOGS_READ,
        Permission.REPORTS_READ,
        Permission.ANALYTICS_READ,
    },
    Role.VIEWER: {
        Permission.USER_READ,
        Permission.SETTINGS_READ,
        Permission.ANALYTICS_READ,
    },
}


def has_permission(role: str, permission: Permission) -> bool:
    """Check if a role has a specific permission"""
    try:
        role_enum = Role(role.lower())
        return permission in ROLE_PERMISSIONS.get(role_enum, set())
    except (ValueError, KeyError):
        return False


def get_permissions(role: str) -> Set[Permission]:
    """Get all permissions for a role"""
    try:
        role_enum = Role(role.lower())
        return ROLE_PERMISSIONS.get(role_enum, set())
    except ValueError:
        return set()
