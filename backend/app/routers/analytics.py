"""Analytics routes"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import require_permission
from app.schemas.analytics import KPIsResponse, APIActivityResponse, MetricsResponse
from app.services.analytics_service import AnalyticsService
from app.utils.permissions import Permission

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/kpis", response_model=KPIsResponse)
async def get_kpis(
    date_from: str = Query(None),
    date_to: str = Query(None),
    _: dict = Depends(require_permission(Permission.ANALYTICS_READ)),
    db: Session = Depends(get_db),
):
    """Get KPI metrics, optionally filtered by date range"""
    return AnalyticsService.get_kpis(db, date_from=date_from, date_to=date_to)


@router.get("/api-activity", response_model=APIActivityResponse)
async def get_api_activity(
    days: int = Query(7, ge=1, le=90),
    date_from: str = Query(None),
    date_to: str = Query(None),
    _: dict = Depends(require_permission(Permission.ANALYTICS_READ)),
    db: Session = Depends(get_db),
):
    """Get API activity aggregated by day"""
    return AnalyticsService.get_api_activity(db, days=days, date_from=date_from, date_to=date_to)


@router.get("/metrics", response_model=MetricsResponse)
async def get_advanced_metrics(
    date_from: str = Query(None),
    date_to: str = Query(None),
    _: dict = Depends(require_permission(Permission.ANALYTICS_READ)),
    db: Session = Depends(get_db),
):
    """Get advanced derived metrics"""
    return AnalyticsService.get_advanced_metrics(db, date_from=date_from, date_to=date_to)
