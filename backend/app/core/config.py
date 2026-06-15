"""Application configuration"""
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./saas_dashboard.db")

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24

    # CORS
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]

    # Debug
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"

    class Config:
        env_file = ".env"


settings = Settings()
