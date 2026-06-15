"""User service - business logic for user CRUD operations"""
from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password


class UserService:
    """Service for user CRUD operations"""

    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        """Create a new user"""
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        # Hash password
        hashed_password = hash_password(user_data.password)

        # Create new user
        new_user = User(
            email=user_data.email,
            password_hash=hashed_password,
            name=user_data.name,
            role=user_data.role,
            plan=user_data.plan,
            status=user_data.status,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def get_user(db: Session, user_id: int) -> User:
        """Get user by ID"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user

    @staticmethod
    def get_users(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        search: str = None,
        plan: str = None,
        status: str = None,
    ) -> tuple[list[User], int]:
        """Get paginated list of users with optional filters"""
        query = db.query(User)

        # Apply filters
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                or_(
                    User.email.ilike(search_pattern),
                    User.name.ilike(search_pattern),
                )
            )

        if plan:
            query = query.filter(User.plan == plan)

        if status:
            query = query.filter(User.status == status)

        # Get total count
        total_count = query.count()

        # Apply pagination
        users = query.offset(skip).limit(limit).all()

        return users, total_count

    @staticmethod
    def update_user(db: Session, user_id: int, user_data: UserUpdate) -> User:
        """Update user fields"""
        user = UserService.get_user(db, user_id)

        # Update allowed fields only
        update_data = user_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if value is not None:
                setattr(user, field, value)

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete_user(db: Session, user_id: int) -> User:
        """Soft delete user (set status to inactive)"""
        user = UserService.get_user(db, user_id)
        user.status = "inactive"
        db.commit()
        db.refresh(user)
        return user
