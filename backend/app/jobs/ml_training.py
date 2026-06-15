"""
ML Training Job
Periodically trains/updates anomaly detection models using recent data.
This is a simplified version for the MVP - in production would use scikit-learn or TensorFlow.
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from backend.app.config import settings
from backend.app.models import APILog, User
import json
import logging

logger = logging.getLogger(__name__)


class MLTrainer:
    """
    Trains ML models using recent API activity data.
    Updates model baseline statistics for anomaly detection.
    """

    def __init__(self):
        self.engine = create_engine(settings.DATABASE_URL)
        self.training_window_days = 30
        self.min_samples = 50

    def train_anomaly_models(self):
        """
        Train anomaly detection models for all active users.
        Computes baseline statistics for response time and error rate.
        """
        from sqlalchemy.orm import sessionmaker

        SessionLocal = sessionmaker(bind=self.engine)
        db = SessionLocal()

        try:
            users = db.query(User).filter(User.status == "active").all()

            results = {"trained_users": 0, "errors": 0, "timestamp": datetime.utcnow().isoformat()}

            for user in users:
                try:
                    self._train_for_user(db, user.id)
                    results["trained_users"] += 1
                except Exception as e:
                    logger.error(f"Training failed for user {user.id}: {str(e)}")
                    results["errors"] += 1

            logger.info(f"ML Training completed: {results}")
            return results

        except Exception as e:
            logger.error(f"ML Training job failed: {str(e)}")
            return {"error": str(e), "timestamp": datetime.utcnow().isoformat()}
        finally:
            db.close()

    def _train_for_user(self, db: Session, user_id: int):
        """
        Train models for a single user using their recent API logs.
        """
        cutoff_date = datetime.utcnow() - timedelta(days=self.training_window_days)
        logs = (
            db.query(APILog)
            .filter(APILog.user_id == user_id, APILog.timestamp >= cutoff_date)
            .all()
        )

        if len(logs) < self.min_samples:
            logger.warning(f"Insufficient samples for user {user_id}: {len(logs)}")
            return

        # Calculate baseline statistics
        response_times = [log.response_time_ms for log in logs]
        error_count = sum(1 for log in logs if log.status_code >= 400)
        error_rate = (error_count / len(logs)) * 100

        model_stats = {
            "user_id": user_id,
            "trained_at": datetime.utcnow().isoformat(),
            "samples": len(logs),
            "response_time_mean": sum(response_times) / len(response_times),
            "response_time_min": min(response_times),
            "response_time_max": max(response_times),
            "error_rate_pct": round(error_rate, 2),
            "training_window_days": self.training_window_days,
        }

        # In production, would save model to disk or database
        logger.info(f"Trained models for user {user_id}: {model_stats}")


def run_ml_training():
    """
    Entrypoint for the training job (would be called by scheduler).
    """
    trainer = MLTrainer()
    return trainer.train_anomaly_models()


if __name__ == "__main__":
    result = run_ml_training()
    print(result)
