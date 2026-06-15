"""Dashboard Pydantic schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DashboardCreate(BaseModel):
    name: str
    description: Optional[str] = None
    layout: str
    is_default: Optional[bool] = False


class DashboardUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    layout: Optional[str] = None
    is_default: Optional[bool] = None


class DashboardResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str]
    is_default: bool
    layout: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
