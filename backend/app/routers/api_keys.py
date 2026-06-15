"""API Key management routes"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.api_key import (
    APIKeyCreate,
    APIKeyResponse,
    APIKeyWithSecret,
    APIKeyListResponse,
)
from app.services.api_key_service import APIKeyService

router = APIRouter(prefix="/api/api-keys", tags=["api_keys"])


@router.post("", response_model=APIKeyWithSecret, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    key_data: APIKeyCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new API key (returns secret once)"""
    api_key, full_key = APIKeyService.create_api_key(db, current_user["user_id"], key_data)
    return APIKeyWithSecret(
        name=api_key.name,
        key=full_key,
    )


@router.get("", response_model=APIKeyListResponse)
async def list_api_keys(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all API keys for current user"""
    keys, total_count = APIKeyService.get_api_keys(db, current_user["user_id"])
    return APIKeyListResponse(api_keys=keys, total_count=total_count)


@router.get("/{key_id}", response_model=APIKeyResponse)
async def get_api_key(
    key_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get API key details"""
    api_key = APIKeyService.get_api_key(db, key_id, current_user["user_id"])
    return api_key


@router.post("/{key_id}/revoke", response_model=APIKeyResponse)
async def revoke_api_key(
    key_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Revoke (deactivate) an API key"""
    api_key = APIKeyService.revoke_api_key(db, key_id, current_user["user_id"])
    return api_key


@router.delete("/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_api_key(
    key_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete an API key"""
    APIKeyService.delete_api_key(db, key_id, current_user["user_id"])
    return None
