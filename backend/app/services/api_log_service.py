"""API log service - business logic for API log operations"""
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, time
from app.models.api_log import APILog


class APILogService:
    """Service for API log operations"""

    @staticmethod
    def _parse_date_filter(value: str | None, *, end_of_day: bool = False) -> datetime | None:
        """Accept either ISO datetimes or date-only values from the UI filters."""
        if not value:
            return None

        try:
            return datetime.fromisoformat(value)
        except ValueError:
            parsed_date = datetime.fromisoformat(f"{value}T00:00:00").date()
            return datetime.combine(
                parsed_date,
                time.max if end_of_day else time.min,
            )

    @staticmethod
    def get_logs(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        date_from: str | None = None,
        date_to: str | None = None,
        status_code: int = None,
        endpoint: str = None,
    ) -> tuple[list[APILog], int]:
        """Get paginated list of API logs with optional filters"""
        query = db.query(APILog)
        parsed_date_from = APILogService._parse_date_filter(date_from)
        parsed_date_to = APILogService._parse_date_filter(date_to, end_of_day=True)

        # Apply filters
        filters = []
        if parsed_date_from:
            filters.append(APILog.timestamp >= parsed_date_from)
        if parsed_date_to:
            filters.append(APILog.timestamp <= parsed_date_to)
        if status_code:
            filters.append(APILog.status_code == status_code)
        if endpoint:
            filters.append(APILog.endpoint.ilike(f"%{endpoint}%"))

        if filters:
            query = query.filter(and_(*filters))

        # Get total count
        total_count = query.count()

        # Sort by timestamp descending and apply pagination
        logs = query.order_by(APILog.timestamp.desc()).offset(skip).limit(limit).all()

        return logs, total_count

    @staticmethod
    def create_log(
        db: Session,
        endpoint: str,
        method: str,
        status_code: int,
        response_time_ms: int,
        user_id: int = None,
        request_id: str = None,
    ) -> APILog:
        """Create a new API log entry"""
        log = APILog(
            endpoint=endpoint,
            method=method,
            status_code=status_code,
            response_time_ms=response_time_ms,
            user_id=user_id,
            request_id=request_id,
        )

        db.add(log)
        db.commit()
        db.refresh(log)
        return log
