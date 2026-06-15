from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..services.alert_service import AlertService
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


class AlertRuleCreate(BaseModel):
    name: str
    metric_name: str
    operator: str
    threshold: float
    notification_channels: List[str] = []


class AlertRuleUpdate(BaseModel):
    name: Optional[str] = None
    threshold: Optional[float] = None
    enabled: Optional[bool] = None
    notification_channels: Optional[List[str]] = None


class AlertRuleResponse(BaseModel):
    id: int
    name: str
    metric_name: str
    operator: str
    threshold: float
    enabled: bool
    notification_channels: List[str]
    created_at: str
    updated_at: str


class AlertResponse(BaseModel):
    id: int
    alert_rule_id: int
    status: str
    metric_value: float
    message: str
    created_at: str
    acknowledged_at: Optional[str]
    resolved_at: Optional[str]


@router.post("/rules", response_model=AlertRuleResponse)
def create_alert_rule(
    rule: AlertRuleCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create a new alert rule."""
    created_rule = AlertService.create_rule(
        db,
        name=rule.name,
        metric_name=rule.metric_name,
        operator=rule.operator,
        threshold=rule.threshold,
        notification_channels=rule.notification_channels
    )
    return {
        "id": created_rule.id,
        "name": created_rule.name,
        "metric_name": created_rule.metric_name,
        "operator": created_rule.operator,
        "threshold": created_rule.threshold,
        "enabled": created_rule.enabled,
        "notification_channels": created_rule.notification_channels,
        "created_at": created_rule.created_at.isoformat(),
        "updated_at": created_rule.updated_at.isoformat()
    }


@router.get("/rules", response_model=List[AlertRuleResponse])
def get_alert_rules(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get all alert rules."""
    rules = AlertService.get_rules(db, enabled_only=False)
    return [
        {
            "id": r.id,
            "name": r.name,
            "metric_name": r.metric_name,
            "operator": r.operator,
            "threshold": r.threshold,
            "enabled": r.enabled,
            "notification_channels": r.notification_channels,
            "created_at": r.created_at.isoformat(),
            "updated_at": r.updated_at.isoformat()
        }
        for r in rules
    ]


@router.put("/rules/{rule_id}", response_model=AlertRuleResponse)
def update_alert_rule(
    rule_id: int,
    rule_update: AlertRuleUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update alert rule."""
    updated_rule = AlertService.update_rule(
        db,
        rule_id,
        name=rule_update.name,
        threshold=rule_update.threshold,
        enabled=rule_update.enabled,
        notification_channels=rule_update.notification_channels
    )
    if not updated_rule:
        raise HTTPException(status_code=404, detail="Alert rule not found")

    return {
        "id": updated_rule.id,
        "name": updated_rule.name,
        "metric_name": updated_rule.metric_name,
        "operator": updated_rule.operator,
        "threshold": updated_rule.threshold,
        "enabled": updated_rule.enabled,
        "notification_channels": updated_rule.notification_channels,
        "created_at": updated_rule.created_at.isoformat(),
        "updated_at": updated_rule.updated_at.isoformat()
    }


@router.delete("/rules/{rule_id}")
def delete_alert_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Delete alert rule."""
    deleted = AlertService.delete_rule(db, rule_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Alert rule not found")
    return {"status": "deleted"}


@router.get("", response_model=List[AlertResponse])
def get_alerts(
    status: str = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get alerts."""
    alerts = AlertService.get_alerts(db, status=status, limit=limit)
    return [
        {
            "id": a.id,
            "alert_rule_id": a.alert_rule_id,
            "status": a.status,
            "metric_value": a.metric_value,
            "message": a.message,
            "created_at": a.created_at.isoformat(),
            "acknowledged_at": a.acknowledged_at.isoformat() if a.acknowledged_at else None,
            "resolved_at": a.resolved_at.isoformat() if a.resolved_at else None
        }
        for a in alerts
    ]


@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Acknowledge an alert."""
    alert = AlertService.acknowledge_alert(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {
        "id": alert.id,
        "status": alert.status,
        "acknowledged_at": alert.acknowledged_at.isoformat() if alert.acknowledged_at else None
    }


@router.post("/{alert_id}/resolve")
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Resolve an alert."""
    alert = AlertService.resolve_alert(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {
        "id": alert.id,
        "status": alert.status,
        "resolved_at": alert.resolved_at.isoformat() if alert.resolved_at else None
    }

