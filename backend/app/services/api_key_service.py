"""API Key service - business logic for API key management"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.api_key import APIKey
from app.models.user import User
from app.schemas.api_key import APIKeyCreate
from app.core.security import hash_password
import secrets
from datetime import datetime


class APIKeyService:
    """Service for API key management"""

    # API key prefix and length
    KEY_PREFIX = "sk_"
    KEY_LENGTH = 32

    @staticmethod
    def generate_api_key() -> tuple[str, str]:
        """Generate a new API key and return (key, prefix)"""
        # Generate random key
        random_part = secrets.token_urlsafe(APIKeyService.KEY_LENGTH)
        full_key = APIKeyService.KEY_PREFIX + random_part
        # Prefix is first 20 characters for display
        prefix = full_key[:20]
        return full_key, prefix

    @staticmethod
    def create_api_key(db: Session, user_id: int, key_data: APIKeyCreate) -> tuple[APIKey, str]:
        """Create a new API key for user"""
        # Verify user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        # Generate key
        full_key, prefix = APIKeyService.generate_api_key()
        key_hash = hash_password(full_key)

        # Create key record
        api_key = APIKey(
            user_id=user_id,
            key_prefix=prefix,
            key_hash=key_hash,
            name=key_data.name,
            is_active=True,
        )

        db.add(api_key)
        db.commit()
        db.refresh(api_key)

        # Return key with full secret (only time it's shown)
        return api_key, full_key

    @staticmethod
    def get_api_key(db: Session, key_id: int, user_id: int) -> APIKey:
        """Get API key by ID (user can only access their own keys)"""
        api_key = db.query(APIKey).filter(
            APIKey.id == key_id,
            APIKey.user_id == user_id,
        ).first()

        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found",
            )
        return api_key

    @staticmethod
    def get_api_keys(db: Session, user_id: int) -> tuple[list[APIKey], int]:
        """Get all API keys for user"""
        query = db.query(APIKey).filter(APIKey.user_id == user_id)
        total_count = query.count()
        keys = query.order_by(APIKey.created_at.desc()).all()
        return keys, total_count

    @staticmethod
    def verify_api_key(db: Session, api_key_string: str) -> APIKey:
        """Verify API key string against database and return key record"""
        from app.core.security import verify_password

        # Find key by prefix for efficiency
        prefix = api_key_string[:20]
        api_key = db.query(APIKey).filter(
            APIKey.key_prefix == prefix,
            APIKey.is_active == True,
        ).first()

        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key",
            )

        # Verify hash
        if not verify_password(api_key_string, api_key.key_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key",
            )

        # Update last_used_at
        api_key.last_used_at = datetime.utcnow()
        db.commit()

        return api_key

    @staticmethod
    def revoke_api_key(db: Session, key_id: int, user_id: int) -> APIKey:
        """Revoke (deactivate) an API key"""
        api_key = APIKeyService.get_api_key(db, key_id, user_id)
        api_key.is_active = False
        db.commit()
        db.refresh(api_key)
        return api_key

    @staticmethod
    def delete_api_key(db: Session, key_id: int, user_id: int) -> None:
        """Delete an API key"""
        api_key = APIKeyService.get_api_key(db, key_id, user_id)
        db.delete(api_key)
        db.commit()
