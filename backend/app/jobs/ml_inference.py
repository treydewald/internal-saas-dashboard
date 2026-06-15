"""
ML Inference Job
Periodically generates predictions (anomalies, forecasts, churn risk).
Stores results in MLInsight table for quick dashboard retrieval.
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from backend.app.config import settings
from backend.app.models import User, MLInsight
from backend.app.services.anomaly_detection import AnomalyDetector
from backend.app.services.forecasting import Forecaster
from backend.app.services.churn_prediction import ChurnPredictor
import logging

logger = logging.getLogger(__name__)


class MLInferenceRunner:
    """
    Runs inference on all users and stores results.
    Generates anomaly detections, forecasts, and churn predictions.
    """

    def __init__(self):
        self.engine = create_engine(settings.DATABASE_URL)
        self.anomaly_detector = AnomalyDetector()
        self.forecaster = Forecaster()
        self.churn_predictor = ChurnPredictor()

    def run_inference(self):
        """
        Run inference for all active users and store results.
        """
        from sqlalchemy.orm import sessionmaker

        SessionLocal = sessionmaker(bind=self.engine)
        db = SessionLocal()

        try:
            users = db.query(User).filter(User.status == "active").all()

            results = {
                "inference_run_at": datetime.utcnow().isoformat(),
                "users_processed": 0,
                "insights_generated": 0,
                "errors": 0,
            }

            for user in users:
                try:
                    count = self._run_inference_for_user(db, user.id)
                    results["insights_generated"] += count
                    results["users_processed"] += 1
                except Exception as e:
                    logger.error(f"Inference failed for user {user.id}: {str(e)}")
                    results["errors"] += 1

            logger.info(f"Inference run completed: {results}")
            db.commit()
            return results

        except Exception as e:
            logger.error(f"Inference job failed: {str(e)}")
            db.rollback()
            return {"error": str(e), "timestamp": datetime.utcnow().isoformat()}
        finally:
            db.close()

    def _run_inference_for_user(self, db: Session, user_id: int) -> int:
        """
        Run all inference types for a single user.
        Returns count of insights generated.
        """
        insight_count = 0

        # Clear old insights (older than 30 days)
        cutoff_date = datetime.utcnow() - timedelta(days=30)
        db.query(MLInsight).filter(
            MLInsight.user_id == user_id, MLInsight.created_at < cutoff_date
        ).delete()

        # Generate anomaly insights
        anomalies = self._generate_anomaly_insights(db, user_id)
        insight_count += len(anomalies)

        # Generate forecast insights
        forecasts = self._generate_forecast_insights(db, user_id)
        insight_count += len(forecasts)

        # Generate churn insights
        churn = self._generate_churn_insights(db, user_id)
        if churn:
            insight_count += 1

        return insight_count

    def _generate_anomaly_insights(self, db: Session, user_id: int) -> int:
        """Generate and store anomaly detection insights."""
        insights = []

        # Response time anomalies
        response_anomalies = self.anomaly_detector.detect_response_time_anomalies(db, user_id)
        for anomaly in response_anomalies[:3]:  # Top 3
            insight = MLInsight(
                user_id=user_id,
                insight_type="anomaly",
                metric_name="response_time",
                confidence_score=anomaly["confidence_score"],
                insight_data=anomaly,
                generated_at=datetime.utcnow(),
            )
            insights.append(insight)

        # Error rate anomalies
        error_anomalies = self.anomaly_detector.detect_error_rate_anomalies(db, user_id)
        for anomaly in error_anomalies[:3]:  # Top 3
            insight = MLInsight(
                user_id=user_id,
                insight_type="anomaly",
                metric_name="error_rate",
                confidence_score=anomaly["confidence_score"],
                insight_data=anomaly,
                generated_at=datetime.utcnow(),
            )
            insights.append(insight)

        # Traffic anomalies
        traffic_anomalies = self.anomaly_detector.detect_traffic_anomalies(db, user_id)
        for anomaly in traffic_anomalies[:2]:  # Top 2
            insight = MLInsight(
                user_id=user_id,
                insight_type="anomaly",
                metric_name="traffic",
                confidence_score=anomaly["confidence_score"],
                insight_data=anomaly,
                generated_at=datetime.utcnow(),
            )
            insights.append(insight)

        for insight in insights:
            db.add(insight)

        return len(insights)

    def _generate_forecast_insights(self, db: Session, user_id: int) -> int:
        """Generate and store forecast insights."""
        insights = []

        # Request volume forecast
        request_forecast = self.forecaster.forecast_request_volume(db, user_id)
        insight = MLInsight(
            user_id=user_id,
            insight_type="forecast",
            metric_name="request_volume",
            confidence_score=request_forecast["confidence_score"],
            insight_data=request_forecast,
            generated_at=datetime.utcnow(),
        )
        insights.append(insight)

        # Error rate forecast
        error_forecast = self.forecaster.forecast_error_rate(db, user_id)
        insight = MLInsight(
            user_id=user_id,
            insight_type="forecast",
            metric_name="error_rate",
            confidence_score=error_forecast["confidence_score"],
            insight_data=error_forecast,
            generated_at=datetime.utcnow(),
        )
        insights.append(insight)

        # Revenue forecast
        revenue_forecast = self.forecaster.forecast_revenue(db, user_id)
        insight = MLInsight(
            user_id=user_id,
            insight_type="forecast",
            metric_name="revenue",
            confidence_score=revenue_forecast["confidence_score"],
            insight_data=revenue_forecast,
            generated_at=datetime.utcnow(),
        )
        insights.append(insight)

        for insight in insights:
            db.add(insight)

        return len(insights)

    def _generate_churn_insights(self, db: Session, user_id: int) -> bool:
        """Generate and store churn prediction insight."""
        churn_prediction = self.churn_predictor.predict_user_churn(db, user_id)

        insight = MLInsight(
            user_id=user_id,
            insight_type="churn_prediction",
            metric_name="churn_risk",
            confidence_score=churn_prediction["churn_risk"],
            insight_data=churn_prediction,
            generated_at=datetime.utcnow(),
        )
        db.add(insight)
        return True


def run_ml_inference():
    """
    Entrypoint for the inference job (would be called by scheduler).
    """
    runner = MLInferenceRunner()
    return runner.run_inference()


if __name__ == "__main__":
    result = run_ml_inference()
    print(result)
