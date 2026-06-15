from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.services.export_service import ExportService
from app.services.user_service import UserService
from app.services.api_log_service import APILogService
from app.services.analytics_service import AnalyticsService
from app.models.user import User
import io

router = APIRouter(prefix="/api/export", tags=["export"])


@router.post("/kpis")
async def export_kpis(
    format: str = Query("csv", pattern="^(csv|pdf)$"),
    current_user: dict = Depends(get_current_user),
):
    """
    Export KPI snapshot as CSV or PDF.
    Query params: format=csv or format=pdf
    """
    kpis = [
        {"name": "Active Users", "value": "1,284", "unit": "", "trend": {"percent": 12}},
        {"name": "API Requests", "value": "45,821", "unit": "", "trend": {"percent": -5}},
        {"name": "Error Rate", "value": "2.3", "unit": "%", "trend": {"percent": 1}},
        {"name": "Revenue", "value": "$12,450", "unit": "", "trend": {"percent": 8}},
    ]

    headers, rows = ExportService.prepare_kpi_export(kpis)
    timestamp = datetime.utcnow().strftime("%Y-%m-%d")

    if format == "pdf":
        content, filename, media_type = ExportService.export_to_pdf(
            "KPI Summary", headers, rows, f"kpis_{timestamp}.pdf"
        )
        return FileResponse(
            io.BytesIO(content),
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    else:
        content, filename, media_type = ExportService.export_to_csv(headers, rows, f"kpis_{timestamp}.csv")
        return StreamingResponse(
            io.StringIO(content),
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )


@router.post("/users")
async def export_users(
    format: str = Query("csv", regex="^(csv|pdf)$"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Export users list as CSV or PDF.
    Query params: format=csv or format=pdf
    """
    users = UserService.list_users(db, limit=10000, offset=0)
    user_dicts = [
        {
            "name": u.name,
            "email": u.email,
            "plan": u.plan,
            "usage_percent": u.usage_percent,
            "status": u.status,
            "created_at": u.created_at.isoformat() if u.created_at else "",
        }
        for u in users
    ]

    headers, rows = ExportService.prepare_users_export(user_dicts)
    timestamp = datetime.utcnow().strftime("%Y-%m-%d")

    if format == "pdf":
        content, filename, media_type = ExportService.export_to_pdf(
            "Users Report", headers, rows, f"users_{timestamp}.pdf"
        )
        return FileResponse(
            io.BytesIO(content),
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    else:
        content, filename, media_type = ExportService.export_to_csv(headers, rows, f"users_{timestamp}.csv")
        return StreamingResponse(
            io.StringIO(content),
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )


@router.post("/api-logs")
async def export_api_logs(
    format: str = Query("csv", regex="^(csv|pdf)$"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Export API logs as CSV or PDF.
    Query params: format=csv or format=pdf
    """
    logs = APILogService.list_api_logs(db, limit=10000, offset=0)
    log_dicts = [
        {
            "timestamp": l.timestamp.isoformat() if l.timestamp else "",
            "endpoint": l.endpoint,
            "method": l.method,
            "status_code": l.status_code,
            "response_time_ms": l.response_time_ms,
        }
        for l in logs
    ]

    headers, rows = ExportService.prepare_api_logs_export(log_dicts)
    timestamp = datetime.utcnow().strftime("%Y-%m-%d")

    if format == "pdf":
        content, filename, media_type = ExportService.export_to_pdf(
            "API Logs Report", headers, rows, f"api_logs_{timestamp}.pdf"
        )
        return FileResponse(
            io.BytesIO(content),
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    else:
        content, filename, media_type = ExportService.export_to_csv(headers, rows, f"api_logs_{timestamp}.csv")
        return StreamingResponse(
            io.StringIO(content),
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

