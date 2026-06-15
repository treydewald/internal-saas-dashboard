"""User schemas for CRUD operations"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    name: str
    role: str = "viewer"
    plan: str = "free"
    status: str = "active"


class UserCreate(UserBase):
    """User creation schema"""
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """User update schema"""
    name: Optional[str] = None
    plan: Optional[str] = None
    status: Optional[str] = None
    role: Optional[str] = None


class UserResponse(BaseModel):
    """User response schema"""
    id: int
    email: str
    name: str
    role: str
    plan: str
    usage_percent: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """User list response with pagination"""
    users: list[UserResponse]
    total_count: int
