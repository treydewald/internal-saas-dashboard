"""Analytics routes"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_permission
from app.schemas.analytics import KPIsResponse, APIActivityResponse
from app.services.analytics_service import AnalyticsService
from app.utils.permissions import Permission

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/kpis", response_model=KPIsResponse)
async def get_kpis(
    _: dict = Depends(require_permission(Permission.ANALYTICS_READ)),
    db: Session = Depends(get_db),
):
    """Get KPI metrics"""
    return AnalyticsService.get_kpis(db)


@router.get("/api-activity", response_model=APIActivityResponse)
async def get_api_activity(
    days: int = Query(7, ge=1, le=90),
    _: dict = Depends(require_permission(Permission.ANALYTICS_READ)),
    db: Session = Depends(get_db),
):
    """Get API activity aggregated by day"""
    return AnalyticsService.get_api_activity(db, days=days)
