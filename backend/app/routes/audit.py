from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..services.audit_service import AuditService
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/audit", tags=["audit"])


class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    resource_type: str
    resource_id: Optional[int]
    status: str
    details: dict
    ip_address: Optional[str]
    created_at: str


class AuditLogsListResponse(BaseModel):
    logs: List[AuditLogResponse]
    total_count: int


@router.get("/logs", response_model=AuditLogsListResponse)
def get_audit_logs(
    action: Optional[str] = Query(None),
    resource_type: Optional[str] = Query(None),
    user_id: Optional[int] = Query(None),
    limit: int = Query(100, le=500),
    offset: int = Query(0),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get audit logs (admin only)."""
    logs, total_count = AuditService.get_audit_logs(
        db,
        action=action,
        resource_type=resource_type,
        user_id=user_id,
        limit=limit,
        offset=offset
    )
    return {"logs": logs, "total_count": total_count}


@router.get("/logs/{log_id}", response_model=AuditLogResponse)
def get_audit_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get single audit log entry."""
    try:
        from ..models.audit_log import AuditLog
        log = db.query(AuditLog).filter(AuditLog.id == log_id).first()
        if not log:
            return {"error": "Audit log not found"}
        return {
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "resource_type": log.resource_type,
            "resource_id": log.resource_id,
            "status": log.status,
            "details": log.details,
            "ip_address": log.ip_address,
            "created_at": log.created_at.isoformat(),
        }
    except Exception as e:
        return {"error": str(e)}
