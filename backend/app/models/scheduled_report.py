from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base


class ScheduledReport(Base):
    __tablename__ = "scheduled_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Report configuration
    report_type = Column(String(50), nullable=False)  # "kpis", "users", "api_logs", "custom"
    filters = Column(JSON, nullable=True)  # JSON filters to apply
    include_charts = Column(Boolean, default=True)
    export_format = Column(String(20), default="pdf")  # "pdf", "csv"

    # Scheduling
    schedule_type = Column(String(20), nullable=False)  # "daily", "weekly", "monthly", "custom"
    schedule_config = Column(JSON, nullable=False)  # {cron: "...", timezone: "UTC", next_run: ...}
    is_active = Column(Boolean, default=True)

    # Delivery
    recipient_emails = Column(JSON, nullable=False)  # ["email1@example.com", "email2@example.com"]
    delivery_method = Column(String(20), default="email")  # "email", "webhook", "download"

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_run_at = Column(DateTime, nullable=True)
    next_run_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="scheduled_reports")
    executions = relationship("ReportExecution", back_populates="scheduled_report", cascade="all, delete-orphan")


class ReportExecution(Base):
    __tablename__ = "report_executions"

    id = Column(Integer, primary_key=True, index=True)
    scheduled_report_id = Column(Integer, ForeignKey("scheduled_reports.id"), nullable=False)

    # Execution status
    status = Column(String(20), default="pending")  # "pending", "running", "completed", "failed"
    error_message = Column(Text, nullable=True)

    # File information
    file_path = Column(String(512), nullable=True)  # S3 path or local path
    file_size = Column(Integer, nullable=True)  # Size in bytes

    # Timing
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    execution_time_ms = Column(Integer, nullable=True)

    # Delivery tracking
    delivery_status = Column(String(20), default="pending")  # "pending", "sent", "failed"
    delivery_error = Column(Text, nullable=True)
    delivered_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    scheduled_report = relationship("ScheduledReport", back_populates="executions")
