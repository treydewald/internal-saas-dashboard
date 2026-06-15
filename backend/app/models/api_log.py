"""API Log model"""
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class APILog(Base):
    """API request log model"""
    __tablename__ = "api_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    endpoint = Column(String(255))
    method = Column(String(10))  # GET, POST, PUT, DELETE
    status_code = Column(Integer)
    response_time_ms = Column(Float)
    request_id = Column(String(36), index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
