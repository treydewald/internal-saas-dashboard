"""User model"""
from enum import Enum
from typing import Optional


class UserRole(str, Enum):
    """User roles"""
    ADMIN = "admin"
    ANALYST = "analyst"
    VIEWER = "viewer"


class User:
    """User model for MVP (in-memory storage)"""

    # Mock users database (will be replaced with actual DB in T1-02)
    # MVP: plain text passwords for simplicity (NOT for production!)
    _users = {
        "admin@example.com": {
            "id": 1,
            "email": "admin@example.com",
            "password_hash": "admin123",
            "name": "Admin User",
            "role": UserRole.ADMIN,
            "plan": "enterprise",
            "usage_percent": 45,
            "status": "active",
        },
        "analyst@example.com": {
            "id": 2,
            "email": "analyst@example.com",
            "password_hash": "analyst123",
            "name": "Analyst User",
            "role": UserRole.ANALYST,
            "plan": "pro",
            "usage_percent": 62,
            "status": "active",
        },
        "viewer@example.com": {
            "id": 3,
            "email": "viewer@example.com",
            "password_hash": "viewer123",
            "name": "Viewer User",
            "role": UserRole.VIEWER,
            "plan": "free",
            "usage_percent": 28,
            "status": "active",
        },
    }

    @classmethod
    def get_by_email(cls, email: str) -> Optional[dict]:
        """Get user by email"""
        return cls._users.get(email)

    @classmethod
    def create(cls, email: str, password_hash: str, name: str, role: str = UserRole.VIEWER) -> dict:
        """Create a new user"""
        user_id = max([u["id"] for u in cls._users.values()], default=0) + 1
        user = {
            "id": user_id,
            "email": email,
            "password_hash": password_hash,
            "name": name,
            "role": role,
            "plan": "free",
            "usage_percent": 0,
            "status": "active",
        }
        cls._users[email] = user
        return user
