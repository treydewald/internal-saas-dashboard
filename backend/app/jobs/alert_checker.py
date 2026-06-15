"""
Background job to check alert rules and create alerts when thresholds are breached.
This job runs periodically (e.g., every 5 minutes) to evaluate all active alert rules.
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from typing import Optional

from ..models.alert_rule import Alert
from ..services.alert_service import AlertService


class AlertChecker:
    """Evaluates alert rules against current metrics."""

    @staticmethod
    def get_current_metric(metric_name: str, db: Session) -> Optional[float]:
        """
        Fetch current metric value.
        In MVP, this queries the Metrics table for the most recent value.
        Real-time metrics can be fetched from analytics service.
        """
        try:
            from ..models.metric import Metric
            metric = db.query(Metric).filter(
                Metric.metric_name == metric_name
            ).order_by(Metric.aggregated_at.desc()).first()
            return metric.metric_value if metric else None
        except Exception:
            return None

    @staticmethod
    def check_all_rules(db: Session) -> int:
        """
        Check all enabled alert rules and create alerts if thresholds breached.
        Returns count of alerts created.
        """
        rules = AlertService.get_rules(db, enabled_only=True)
        alerts_created = 0

        for rule in rules:
            metric_value = AlertChecker.get_current_metric(rule.metric_name, db)

            if metric_value is None:
                continue

            threshold_breached = AlertService.check_rule_threshold(
                metric_value,
                rule.operator,
                rule.threshold
            )

            if threshold_breached:
                # Check if alert for this rule already exists in triggered/acknowledged state
                existing_alert = db.query(Alert).filter(
                    Alert.alert_rule_id == rule.id,
                    Alert.status.in_(["triggered", "acknowledged"])
                ).first()

                if not existing_alert:
                    # Create new alert
                    message = f"Alert: {rule.name} - {rule.metric_name} {rule.operator} {rule.threshold} (current: {metric_value})"
                    AlertService.create_alert(
                        db,
                        alert_rule_id=rule.id,
                        metric_value=metric_value,
                        message=message
                    )
                    alerts_created += 1
            else:
                # Resolve any triggered alerts for this rule
                triggered_alerts = db.query(Alert).filter(
                    Alert.alert_rule_id == rule.id,
                    Alert.status.in_(["triggered", "acknowledged"])
                ).all()

                for alert in triggered_alerts:
                    AlertService.resolve_alert(db, alert.id)

        return alerts_created

    @staticmethod
    def cleanup_old_alerts(db: Session, days: int = 30) -> int:
        """
        Delete resolved alerts older than specified days.
        Returns count of alerts deleted.
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        old_alerts = db.query(Alert).filter(
            Alert.status == "resolved",
            Alert.resolved_at < cutoff_date
        ).all()

        count = len(old_alerts)
        for alert in old_alerts:
            db.delete(alert)
        db.commit()
        return count
