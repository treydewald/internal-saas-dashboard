from datetime import datetime
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import and_

from ..models.alert_rule import AlertRule, Alert


class AlertService:
    """Service for managing alert rules and alert instances."""

    @staticmethod
    def create_rule(
        db: Session,
        name: str,
        metric_name: str,
        operator: str,
        threshold: float,
        notification_channels: List[str] = None
    ) -> AlertRule:
        """Create a new alert rule."""
        rule = AlertRule(
            name=name,
            metric_name=metric_name,
            operator=operator,
            threshold=threshold,
            notification_channels=notification_channels or []
        )
        db.add(rule)
        db.commit()
        db.refresh(rule)
        return rule

    @staticmethod
    def get_rules(db: Session, enabled_only: bool = True) -> List[AlertRule]:
        """Get alert rules."""
        query = db.query(AlertRule)
        if enabled_only:
            query = query.filter(AlertRule.enabled == True)
        return query.all()

    @staticmethod
    def get_rule(db: Session, rule_id: int) -> Optional[AlertRule]:
        """Get single alert rule."""
        return db.query(AlertRule).filter(AlertRule.id == rule_id).first()

    @staticmethod
    def update_rule(
        db: Session,
        rule_id: int,
        name: Optional[str] = None,
        threshold: Optional[float] = None,
        enabled: Optional[bool] = None,
        notification_channels: Optional[List[str]] = None
    ) -> Optional[AlertRule]:
        """Update alert rule."""
        rule = AlertService.get_rule(db, rule_id)
        if not rule:
            return None

        if name is not None:
            rule.name = name
        if threshold is not None:
            rule.threshold = threshold
        if enabled is not None:
            rule.enabled = enabled
        if notification_channels is not None:
            rule.notification_channels = notification_channels
        rule.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(rule)
        return rule

    @staticmethod
    def delete_rule(db: Session, rule_id: int) -> bool:
        """Delete alert rule."""
        rule = AlertService.get_rule(db, rule_id)
        if not rule:
            return False
        db.delete(rule)
        db.commit()
        return True

    @staticmethod
    def create_alert(
        db: Session,
        alert_rule_id: int,
        metric_value: float,
        message: str
    ) -> Alert:
        """Create a new alert instance."""
        alert = Alert(
            alert_rule_id=alert_rule_id,
            metric_value=metric_value,
            message=message
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        return alert

    @staticmethod
    def get_alerts(
        db: Session,
        status: Optional[str] = None,
        limit: int = 50
    ) -> List[Alert]:
        """Get alerts with optional status filter."""
        query = db.query(Alert)
        if status:
            query = query.filter(Alert.status == status)
        return query.order_by(Alert.created_at.desc()).limit(limit).all()

    @staticmethod
    def acknowledge_alert(db: Session, alert_id: int) -> Optional[Alert]:
        """Mark alert as acknowledged."""
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if alert:
            alert.status = "acknowledged"
            alert.acknowledged_at = datetime.utcnow()
            db.commit()
            db.refresh(alert)
        return alert

    @staticmethod
    def resolve_alert(db: Session, alert_id: int) -> Optional[Alert]:
        """Mark alert as resolved."""
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if alert:
            alert.status = "resolved"
            alert.resolved_at = datetime.utcnow()
            db.commit()
            db.refresh(alert)
        return alert

    @staticmethod
    def check_rule_threshold(metric_value: float, operator: str, threshold: float) -> bool:
        """Check if metric value exceeds threshold based on operator."""
        if operator == ">":
            return metric_value > threshold
        elif operator == "<":
            return metric_value < threshold
        elif operator == ">=":
            return metric_value >= threshold
        elif operator == "<=":
            return metric_value <= threshold
        elif operator == "==":
            return metric_value == threshold
        return False
