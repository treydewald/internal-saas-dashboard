"""API log service - business logic for API log operations"""
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
from app.models.api_log import APILog


class APILogService:
    """Service for API log operations"""

    @staticmethod
    def get_logs(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        date_from: datetime = None,
        date_to: datetime = None,
        status_code: int = None,
        endpoint: str = None,
    ) -> tuple[list[APILog], int]:
        """Get paginated list of API logs with optional filters"""
        query = db.query(APILog)

        # Apply filters
        filters = []
        if date_from:
            filters.append(APILog.timestamp >= date_from)
        if date_to:
            filters.append(APILog.timestamp <= date_to)
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
