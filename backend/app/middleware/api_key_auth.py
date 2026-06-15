"""API Key authentication middleware"""
from fastapi import HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.services.api_key_service import APIKeyService
from app.utils.rate_limiter import RateLimiter


async def verify_api_key(
    api_key: Optional[str] = Header(None),
    db: Session = None,
) -> dict:
    """
    Verify API key from header.
    Usage: current_user = Depends(verify_api_key)
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key required",
        )

    # Remove "Bearer " prefix if present
    if api_key.startswith("Bearer "):
        api_key = api_key[7:]

    try:
        # Verify key exists and is valid
        key_record = APIKeyService.verify_api_key(db, api_key)

        # Return user info
        return {
            "user_id": key_record.user_id,
            "api_key_id": key_record.id,
            "auth_type": "api_key",
        }
    except HTTPException:
        raise


def create_rate_limit_middleware(requests_per_minute: int = 60):
    """Create rate limiting middleware factory"""
    rate_limiter = RateLimiter(requests_per_minute=requests_per_minute)

    async def rate_limit_check(api_key: Optional[str] = Header(None)):
        """Check rate limit for API key"""
        if not api_key:
            # Rate limiting only for API keys
            return None

        if api_key.startswith("Bearer "):
            api_key = api_key[7:]

        if not rate_limiter.is_allowed(api_key):
            reset_time = rate_limiter.get_reset_time(api_key)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
                headers={"Retry-After": str(reset_time - int(__import__('time').time()))},
            )

        return rate_limiter

    return rate_limit_check
