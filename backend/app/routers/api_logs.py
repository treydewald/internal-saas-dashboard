"""API logs routes"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.schemas.api_log import APILogListResponse
from app.services.api_log_service import APILogService

router = APIRouter(prefix="/api/api-logs", tags=["api-logs"])


@router.get("", response_model=APILogListResponse)
async def get_api_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    date_from: datetime = Query(None),
    date_to: datetime = Query(None),
    status_code: int = Query(None),
    endpoint: str = Query(None),
    db: Session = Depends(get_db),
):
    """Get paginated list of API logs with optional filters"""
    logs, total_count = APILogService.get_logs(
        db,
        skip=skip,
        limit=limit,
        date_from=date_from,
        date_to=date_to,
        status_code=status_code,
        endpoint=endpoint,
    )
    return APILogListResponse(logs=logs, total_count=total_count)
