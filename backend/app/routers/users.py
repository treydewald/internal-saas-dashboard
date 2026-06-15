"""User management routes"""
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_permission
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserListResponse
from app.services.user_service import UserService
from app.utils.permissions import Permission

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=UserListResponse)
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    plan: str = Query(None),
    status: str = Query(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get paginated list of users with optional filters"""
    users, total_count = UserService.get_users(
        db,
        skip=skip,
        limit=limit,
        search=search,
        plan=plan,
        status=status,
    )
    return UserListResponse(users=users, total_count=total_count)


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    _: dict = Depends(require_permission(Permission.USER_CREATE)),
    db: Session = Depends(get_db),
):
    """Create a new user"""
    user = UserService.create_user(db, user_data)
    return user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user by ID"""
    user = UserService.get_user(db, user_id)
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    _: dict = Depends(require_permission(Permission.USER_UPDATE)),
    db: Session = Depends(get_db),
):
    """Update user fields"""
    user = UserService.update_user(db, user_id, user_data)
    return user


@router.delete("/{user_id}", response_model=UserResponse)
async def delete_user(
    user_id: int,
    _: dict = Depends(require_permission(Permission.USER_DELETE)),
    db: Session = Depends(get_db),
):
    """Soft delete user (set status to inactive)"""
    user = UserService.delete_user(db, user_id)
    return user
