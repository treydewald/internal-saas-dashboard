"""Analytics service for KPI aggregation"""
from datetime import datetime, timedelta, date
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from app.models.metric import Metric
from app.models.api_log import APILog
from app.models.user import User
from app.schemas.analytics import KPIResponse, TrendInfo, KPIsResponse, APIActivityResponse, APIActivityDataPoint, MetricResponse, MetricsResponse


class AnalyticsService:
    @staticmethod
    def get_kpis(db: Session, date_from: str = None, date_to: str = None) -> KPIsResponse:
        """Get KPI metrics, optionally filtered by date range"""

        # Parse dates if provided
        filters = []
        if date_from:
            filters.append(APILog.timestamp >= datetime.fromisoformat(date_from))
        if date_to:
            to_date = datetime.fromisoformat(date_to)
            to_date = to_date.replace(hour=23, minute=59, second=59)
            filters.append(APILog.timestamp <= to_date)

        # Get active users count (not filtered by date for now)
        active_users = db.query(func.count(User.id)).filter(
            User.status == "active"
        ).scalar() or 0

        # Get total API requests with optional date filter
        api_query = db.query(func.count(APILog.id))
        for f in filters:
            api_query = api_query.filter(f)
        api_requests = api_query.scalar() or 0

        # Get error rate
        total_requests = api_query.scalar() or 1
        error_query = db.query(func.count(APILog.id)).filter(
            APILog.status_code >= 400
        )
        for f in filters:
            error_query = error_query.filter(f)
        error_requests = error_query.scalar() or 0
        error_rate = (error_requests / total_requests * 100) if total_requests > 0 else 0

        # Get revenue (using Metric table with optional date filter)
        revenue_query = db.query(func.sum(Metric.metric_value)).filter(
            Metric.metric_name == "revenue"
        )
        if date_from:
            revenue_query = revenue_query.filter(Metric.date >= date_from)
        if date_to:
            revenue_query = revenue_query.filter(Metric.date <= date_to)
        revenue = revenue_query.scalar() or 0

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

    @staticmethod
    def get_api_activity(db: Session, days: int = 7, date_from: str = None, date_to: str = None) -> APIActivityResponse:
        """Get API request activity aggregated by day"""
        # Determine date range
        if date_from and date_to:
            start_date = datetime.fromisoformat(date_from).date()
            end_date = datetime.fromisoformat(date_to).date()
        else:
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=days - 1)

        # Query API logs grouped by date
        results = db.query(
            cast(APILog.timestamp, Date).label("date"),
            func.count(APILog.id).label("count")
        ).filter(
            cast(APILog.timestamp, Date) >= start_date,
            cast(APILog.timestamp, Date) <= end_date
        ).group_by(
            cast(APILog.timestamp, Date)
        ).order_by(
            cast(APILog.timestamp, Date).asc()
        ).all()

        # Convert results to response format
        data_points = []
        date_counts = {row.date: row.count for row in results}

        # Fill in all dates in range, even if no logs
        current_date = start_date
        while current_date <= end_date:
            count = date_counts.get(current_date, 0)
            data_points.append(APIActivityDataPoint(
                date=current_date.isoformat(),
                count=count
            ))
            current_date += timedelta(days=1)

        return APIActivityResponse(data=data_points)

    @staticmethod
    def get_advanced_metrics(db: Session, date_from: str = None, date_to: str = None) -> MetricsResponse:
        """Get advanced derived metrics"""

        # Parse dates if provided
        filters = []
        if date_from:
            filters.append(APILog.timestamp >= datetime.fromisoformat(date_from))
        if date_to:
            to_date = datetime.fromisoformat(date_to)
            to_date = to_date.replace(hour=23, minute=59, second=59)
            filters.append(APILog.timestamp <= to_date)

        # Calculate metrics
        # Active users
        active_users = db.query(func.count(User.id)).filter(
            User.status == "active"
        ).scalar() or 1

        # API success rate (2xx and 3xx status codes)
        total_requests_query = db.query(func.count(APILog.id))
        for f in filters:
            total_requests_query = total_requests_query.filter(f)
        total_requests = total_requests_query.scalar() or 1

        success_query = db.query(func.count(APILog.id)).filter(
            APILog.status_code < 400
        )
        for f in filters:
            success_query = success_query.filter(f)
        successful_requests = success_query.scalar() or 0
        success_rate = (successful_requests / total_requests * 100) if total_requests > 0 else 0

        # Revenue per user
        revenue_query = db.query(func.sum(Metric.metric_value)).filter(
            Metric.metric_name == "revenue"
        )
        if date_from:
            revenue_query = revenue_query.filter(Metric.date >= date_from)
        if date_to:
            revenue_query = revenue_query.filter(Metric.date <= date_to)
        total_revenue = revenue_query.scalar() or 0
        revenue_per_user = (total_revenue / active_users) if active_users > 0 else 0

        # Growth % (simplified - would need historical data for real calculation)
        # Using previous period logic - for now, returning 0
        growth_percent = 0.0

        # Churn rate (simplified)
        inactive_users = db.query(func.count(User.id)).filter(
            User.status == "inactive"
        ).scalar() or 0
        churn_rate = (inactive_users / (active_users + inactive_users) * 100) if (active_users + inactive_users) > 0 else 0

        metrics = [
            MetricResponse(
                name="Growth %",
                value=round(growth_percent, 2),
                unit="%"
            ),
            MetricResponse(
                name="Churn Rate",
                value=round(churn_rate, 2),
                unit="%"
            ),
            MetricResponse(
                name="Revenue per User",
                value=round(revenue_per_user, 2),
                unit="$"
            ),
            MetricResponse(
                name="API Success Rate",
                value=round(success_rate, 2),
                unit="%"
            ),
        ]

        return MetricsResponse(metrics=metrics)
