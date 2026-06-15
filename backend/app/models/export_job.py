"""Export Job model for async bulk operations"""
from sqlalchemy import Column, Integer, String, DateTime, JSON, Float, Enum, ForeignKey
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.core.database import Base


class ExportStatus(PyEnum):
    """Export job status"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ExportJob(Base):
    """Export job model for async data exports"""
    __tablename__ = "export_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    organization_id = Column(Integer, index=True, nullable=True)
    job_type = Column(String(50))  # users, api_logs, kpis, custom
    status = Column(String(20), default="pending")  # pending, processing, completed, failed
    file_url = Column(String(255), nullable=True)  # S3/storage URL once ready
    row_count = Column(Integer, default=0)
    error_message = Column(String(500), nullable=True)
    filters = Column(JSON, nullable=True)  # Store filter params as JSON
    progress_percent = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
