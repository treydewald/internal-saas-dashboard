"""Export Job schemas"""
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class ExportJobCreate(BaseModel):
    """Export job creation schema"""
    job_type: str  # users, api_logs, kpis
    filters: Optional[Dict[str, Any]] = None


class ExportJobResponse(BaseModel):
    """Export job response schema"""
    id: int
    user_id: int
    organization_id: Optional[int]
    job_type: str
    status: str
    file_url: Optional[str]
    row_count: int
    error_message: Optional[str]
    progress_percent: float
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class ExportJobListResponse(BaseModel):
    """Export job list response"""
    jobs: list[ExportJobResponse]
    total_count: int
