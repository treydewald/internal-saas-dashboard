from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc


class AuditService:
    """Service for logging and querying audit events."""

    @staticmethod
    def log_action(
        db: Session,
        user_id: Optional[int],
        action: str,
        resource_type: str,
        resource_id: Optional[int] = None,
        status: str = "success",
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> Dict[str, Any]:
        """Log an action to the audit trail."""
        try:
            from ..models.audit_log import AuditLog

            audit_entry = AuditLog(
                user_id=user_id,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                status=status,
                details=details or {},
                ip_address=ip_address
            )
            db.add(audit_entry)
            db.commit()
            db.refresh(audit_entry)

            return {
                "id": audit_entry.id,
                "user_id": audit_entry.user_id,
                "action": audit_entry.action,
                "resource_type": audit_entry.resource_type,
                "resource_id": audit_entry.resource_id,
                "status": audit_entry.status,
                "details": audit_entry.details,
                "ip_address": audit_entry.ip_address,
                "created_at": audit_entry.created_at.isoformat(),
            }
        except Exception as e:
            print(f"Error logging audit action: {e}")
            return {}

    @staticmethod
    def get_audit_logs(
        db: Session,
        action: Optional[str] = None,
        resource_type: Optional[str] = None,
        user_id: Optional[int] = None,
        limit: int = 100,
        offset: int = 0
    ) -> tuple[List[Dict[str, Any]], int]:
        """Get audit logs with optional filtering."""
        try:
            from ..models.audit_log import AuditLog

            query = db.query(AuditLog)

            if action:
                query = query.filter(AuditLog.action == action)
            if resource_type:
                query = query.filter(AuditLog.resource_type == resource_type)
            if user_id:
                query = query.filter(AuditLog.user_id == user_id)

            total_count = query.count()
            logs = query.order_by(desc(AuditLog.created_at)).offset(offset).limit(limit).all()

            return [
                {
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
                for log in logs
            ], total_count
        except Exception as e:
            print(f"Error retrieving audit logs: {e}")
            return [], 0

    @staticmethod
    def cleanup_old_logs(db: Session, days: int = 90) -> int:
        """Delete audit logs older than specified days (compliance/storage)."""
        try:
            from ..models.audit_log import AuditLog
            from datetime import timedelta

            cutoff_date = datetime.utcnow() - timedelta(days=days)
            old_logs = db.query(AuditLog).filter(AuditLog.created_at < cutoff_date).all()
            count = len(old_logs)

            for log in old_logs:
                db.delete(log)
            db.commit()
            return count
        except Exception as e:
            print(f"Error cleaning up audit logs: {e}")
            return 0
