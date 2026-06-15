"""FastAPI dependencies"""
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.jwt_utils import decode_token
from app.utils.permissions import Permission, has_permission


def get_token_from_header(authorization: str = Header(None)) -> str:
    """Extract token from Authorization header"""
    if not authorization:
        return None

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None

    return parts[1]


def get_current_user(token: str = Depends(get_token_from_header), db: Session = Depends(get_db)):
    """Get current authenticated user from JWT token"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    return payload


def get_current_user_role(current_user: dict = Depends(get_current_user)) -> str:
    """Get the role of the current user"""
    role = current_user.get("role")
    if not role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User role not found in token",
        )
    return role


def require_permission(permission: Permission):
    """Dependency to check if current user has required permission"""
    async def permission_check(current_user: dict = Depends(get_current_user)) -> dict:
        role = current_user.get("role")
        if not role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User role not found in token",
            )

        if not has_permission(role, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

        return current_user

    return permission_check
