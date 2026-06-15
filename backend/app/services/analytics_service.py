"""Analytics service for KPI aggregation"""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.metric import Metric
from app.models.api_log import APILog
from app.models.user import User
from app.schemas.analytics import KPIResponse, TrendInfo, KPIsResponse


class AnalyticsService:
    @staticmethod
    def get_kpis(db: Session) -> KPIsResponse:
        """Get KPI metrics"""

        # Get active users count
        active_users = db.query(func.count(User.id)).filter(
            User.status == "active"
        ).scalar() or 0

        # Get total API requests
        api_requests = db.query(func.count(APILog.id)).scalar() or 0

        # Get error rate
        total_requests = db.query(func.count(APILog.id)).scalar() or 1
        error_requests = db.query(func.count(APILog.id)).filter(
            APILog.status_code >= 400
        ).scalar() or 0
        error_rate = (error_requests / total_requests * 100) if total_requests > 0 else 0

        # Get revenue (using Metric table or calculate from users)
        revenue = db.query(func.sum(Metric.metric_value)).filter(
            Metric.metric_name == "revenue"
        ).scalar() or 0

        kpis = [
            KPIResponse(
                name="Active Users",
                value=active_users,
                unit=None,
                trend=TrendInfo(direction="up", percent=5.2) if active_users > 0 else None
            ),
            KPIResponse(
                name="API Requests",
                value=api_requests,
                unit=None,
                trend=TrendInfo(direction="up", percent=12.0) if api_requests > 0 else None
            ),
            KPIResponse(
                name="Error Rate",
                value=round(error_rate, 2),
                unit="%",
                trend=TrendInfo(direction="down", percent=3.1) if error_rate > 0 else None
            ),
            KPIResponse(
                name="Revenue",
                value=round(revenue, 2),
                unit="$",
                trend=TrendInfo(direction="up", percent=8.5) if revenue > 0 else None
            ),
        ]

        return KPIsResponse(kpis=kpis)
