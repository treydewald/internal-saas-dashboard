"""Authentication routes"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.jwt_utils import create_access_token
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login endpoint - returns JWT token on success"""
    user = db.query(User).filter(User.email == request.email).first()

    # For MVP mock auth: simple password check (not for production!)
    if not user or user.password_hash != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "email": user.email,
            "role": user.role,
        }
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "plan": user.plan,
        },
    )


@router.post("/logout")
async def logout():
    """Logout endpoint - client-side token deletion"""
    return {"message": "Logged out successfully"}
