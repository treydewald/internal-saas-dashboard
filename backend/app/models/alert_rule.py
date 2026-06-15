from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON
from app.core.database import Base


class AlertRule(Base):
    """Alert rule model for defining threshold-based alerts."""
    __tablename__ = "alert_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    metric_name = Column(String(100), nullable=False)  # error_rate, response_time, active_users
    operator = Column(String(10), nullable=False)  # >, <, >=, <=, ==
    threshold = Column(Float, nullable=False)
    enabled = Column(Boolean, default=True)
    notification_channels = Column(JSON, default=[])  # ['email', 'slack', 'dashboard']
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Alert(Base):
    """Alert instance when rule threshold is breached."""
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_rule_id = Column(Integer, nullable=False)  # FK to AlertRule
    status = Column(String(20), default="triggered")  # triggered, acknowledged, resolved
    metric_value = Column(Float, nullable=False)  # Value that triggered alert
    message = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
