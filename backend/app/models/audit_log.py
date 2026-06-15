from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON

Base_audit = None


class AuditLog:
    """Audit log model for tracking user actions and system events."""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)  # User who performed action
    action = Column(String(100), nullable=False)  # create_user, update_user, delete_user, etc.
    resource_type = Column(String(100), nullable=False)  # user, alert_rule, etc.
    resource_id = Column(Integer, nullable=True)
    status = Column(String(20), default="success")  # success, failure
    details = Column(JSON, default={})  # Additional context
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
