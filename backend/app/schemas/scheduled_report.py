from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime


class ScheduleConfig(BaseModel):
    cron: str  # Cron expression for custom schedules
    timezone: str = "UTC"
    next_run: Optional[datetime] = None


class ScheduledReportCreate(BaseModel):
    name: str
    description: Optional[str] = None
    report_type: str  # "kpis", "users", "api_logs", "custom"
    filters: Optional[Dict[str, Any]] = None
    include_charts: bool = True
    export_format: str = "pdf"  # "pdf", "csv"
    schedule_type: str  # "daily", "weekly", "monthly", "custom"
    schedule_config: Dict[str, Any]
    recipient_emails: List[str]
    delivery_method: str = "email"
    is_active: bool = True


class ScheduledReportUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    report_type: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None
    include_charts: Optional[bool] = None
    export_format: Optional[str] = None
    schedule_type: Optional[str] = None
    schedule_config: Optional[Dict[str, Any]] = None
    recipient_emails: Optional[List[str]] = None
    delivery_method: Optional[str] = None
    is_active: Optional[bool] = None


class ScheduledReportResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str]
    report_type: str
    filters: Optional[Dict[str, Any]]
    include_charts: bool
    export_format: str
    schedule_type: str
    schedule_config: Dict[str, Any]
    recipient_emails: List[str]
    delivery_method: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    last_run_at: Optional[datetime]
    next_run_at: Optional[datetime]

    class Config:
        from_attributes = True


class ReportExecutionResponse(BaseModel):
    id: int
    scheduled_report_id: int
    status: str
    error_message: Optional[str]
    file_path: Optional[str]
    file_size: Optional[int]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    execution_time_ms: Optional[int]
    delivery_status: str
    delivery_error: Optional[str]
    delivered_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
