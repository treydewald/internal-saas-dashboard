from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.app.models import User, APILog


class ChurnPredictor:
    """
    Predicts user churn risk based on activity patterns.
    Uses: recency of activity, frequency of requests, plan status.
    """

    def __init__(self):
        self.risk_thresholds = {
            "high": 0.7,
            "medium": 0.4,
            "low": 0.0,
        }

    def predict_user_churn(
        self, db: Session, user_id: int, inactivity_days: int = 14
    ) -> Dict[str, Any]:
        """
        Predict churn risk for a single user.
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return {"churn_risk": 0.0, "risk_level": "unknown"}

        # Get last activity
        last_activity = (
            db.query(APILog)
            .filter(APILog.user_id == user_id)
            .order_by(APILog.timestamp.desc())
            .first()
        )

        if not last_activity:
            return {
                "user_id": user_id,
                "churn_risk": 0.95,  # Very high risk if no activity
                "risk_level": "high",
                "reason": "No API activity detected",
            }

        days_inactive = (datetime.utcnow() - last_activity.timestamp).days

        # Count recent activity
        cutoff_date = datetime.utcnow() - timedelta(days=30)
        recent_requests = (
            db.query(APILog)
            .filter(APILog.user_id == user_id, APILog.timestamp >= cutoff_date)
            .count()
        )

        # Calculate churn risk
        churn_risk = self._calculate_churn_risk(days_inactive, recent_requests, user.plan)

        risk_level = "low"
        if churn_risk >= self.risk_thresholds["high"]:
            risk_level = "high"
        elif churn_risk >= self.risk_thresholds["medium"]:
            risk_level = "medium"

        return {
            "user_id": user_id,
            "user_email": user.email,
            "churn_risk": round(churn_risk, 2),
            "risk_level": risk_level,
            "days_inactive": days_inactive,
            "recent_requests_30d": recent_requests,
            "plan": user.plan,
            "last_activity": last_activity.timestamp.isoformat() if last_activity else None,
        }

    def predict_cohort_churn(
        self, db: Session, days_future: int = 30, inactivity_threshold: int = 14
    ) -> Dict[str, Any]:
        """
        Predict churn risk for all active users.
        Returns users at high risk of churning in the next N days.
        """
        users = (
            db.query(User).filter(User.status == "active").order_by(User.id).all()
        )

        high_risk_users = []
        medium_risk_users = []

        for user in users:
            prediction = self.predict_user_churn(db, user.id, inactivity_threshold)
            if prediction["risk_level"] == "high":
                high_risk_users.append(prediction)
            elif prediction["risk_level"] == "medium":
                medium_risk_users.append(prediction)

        return {
            "prediction_date": datetime.utcnow().isoformat(),
            "forecast_days": days_future,
            "high_risk_count": len(high_risk_users),
            "medium_risk_count": len(medium_risk_users),
            "high_risk_users": high_risk_users[:10],  # Top 10
            "medium_risk_users": medium_risk_users[:10],  # Top 10
            "total_at_risk": len(high_risk_users) + len(medium_risk_users),
        }

    def _calculate_churn_risk(
        self, days_inactive: int, recent_requests: int, plan: str
    ) -> float:
        """
        Calculate churn risk score (0.0 - 1.0).
        Factors:
        - Days since last activity (higher = more risk)
        - Recent request frequency (lower = more risk)
        - Plan type (free = more likely to churn)
        """
        # Inactivity risk: increases with days inactive (capped at 30 days)
        inactivity_risk = min(days_inactive / 30.0, 1.0)

        # Activity frequency risk: fewer requests = higher risk
        activity_risk = max(0.0, 1.0 - (recent_requests / 100.0))  # Normalize to 100 requests/month

        # Plan-based risk: free users churn more
        plan_risk = {"free": 0.3, "pro": 0.1, "enterprise": 0.05}.get(plan, 0.2)

        # Weighted combination
        churn_risk = (
            (inactivity_risk * 0.5) + (activity_risk * 0.3) + (plan_risk * 0.2)
        )

        return min(churn_risk, 1.0)
