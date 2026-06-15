"""API Key schemas for CRUD operations"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class APIKeyBase(BaseModel):
    """Base API key schema"""
    name: str = Field(..., min_length=1, max_length=255)


class APIKeyCreate(APIKeyBase):
    """API key creation schema"""
    pass


class APIKeyResponse(APIKeyBase):
    """API key response schema (with prefix, not full key)"""
    id: int
    user_id: int
    key_prefix: str  # Only prefix shown (e.g., sk_xxxx)
    is_active: bool
    last_used_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class APIKeyWithSecret(APIKeyBase):
    """API key with full secret (only returned on creation)"""
    key: str  # Full key, only shown once on creation


class APIKeyListResponse(BaseModel):
    """API key list response"""
    api_keys: list[APIKeyResponse]
    total_count: int
