"""Metric model"""
from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class Metric(Base):
    """Metrics/KPI model"""
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String(100), index=True)  # active_users, requests, error_rate, revenue
    metric_value = Column(Float)
    date = Column(Date, index=True)
    aggregated_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
