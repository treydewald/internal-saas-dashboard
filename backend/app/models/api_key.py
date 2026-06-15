"""API Key model for API authentication and rate limiting"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class APIKey(Base):
    """API Key model for user API authentication"""
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    key_prefix = Column(String(20), unique=True, index=True)  # sk_xxxx (first 20 chars)
    key_hash = Column(String(255), unique=True)  # hashed full key
    name = Column(String(255))  # descriptive name
    is_active = Column(Boolean, default=True)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", back_populates="api_keys")
