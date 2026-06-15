"""Organization model for multi-tenancy support"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Organization(Base):
    """Organization model for multi-tenancy"""
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    slug = Column(String(100), unique=True, index=True)  # URL-friendly identifier
    description = Column(Text, nullable=True)
    logo_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    user_orgs = relationship("UserOrg", back_populates="organization", cascade="all, delete-orphan")


class UserOrg(Base):
    """User-Organization membership model"""
    __tablename__ = "user_orgs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)  # Foreign key to users table
    organization_id = Column(Integer, index=True)  # Foreign key to organizations table
    role = Column(String(50), default="member")  # admin, member, viewer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="user_orgs")
