"""Authentication schemas"""
from pydantic import BaseModel


class LoginRequest(BaseModel):
    """Login request schema"""
    email: str
    password: str


class LoginResponse(BaseModel):
    """Login response schema"""
    access_token: str
    token_type: str
    user: dict


class UserResponse(BaseModel):
    """User response schema"""
    id: int
    email: str
    name: str
    role: str
    plan: str
    usage_percent: int
    status: str

    class Config:
        from_attributes = True
