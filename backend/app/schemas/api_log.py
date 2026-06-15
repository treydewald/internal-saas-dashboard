"""API log schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class APILogResponse(BaseModel):
    """API log response schema"""
    id: int
    timestamp: datetime
    endpoint: str
    method: str
    status_code: int
    response_time_ms: int
    user_id: Optional[int] = None
    request_id: Optional[str] = None

    class Config:
        from_attributes = True


class APILogListResponse(BaseModel):
    """API log list response with pagination"""
    logs: list[APILogResponse]
    total_count: int
