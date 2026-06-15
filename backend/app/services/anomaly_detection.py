from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import APILog, Metric
import statistics


class AnomalyDetector:
    """
    Detects anomalies in API logs and metrics using statistical methods.
    Supports: z-score detection, moving average deviation, and threshold-based detection.
    """

    def __init__(self, std_dev_threshold: float = 2.0):
        """
        Args:
            std_dev_threshold: Number of standard deviations for z-score detection (default: 2.0)
        """
        self.std_dev_threshold = std_dev_threshold

    def detect_response_time_anomalies(
        self, db: Session, user_id: int, days: int = 7
    ) -> List[Dict[str, Any]]:
        """
        Detect anomalous response times in API logs using z-score method.
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        logs = (
            db.query(APILog)
            .filter(APILog.user_id == user_id, APILog.timestamp >= cutoff_date)
            .order_by(APILog.timestamp)
            .all()
        )

        if len(logs) < 3:
            return []

        response_times = [log.response_time_ms for log in logs]
        mean = statistics.mean(response_times)
        stdev = statistics.stdev(response_times) if len(response_times) > 1 else 0

        if stdev == 0:
            return []

        anomalies = []
        for log in logs:
            z_score = abs((log.response_time_ms - mean) / stdev)
            if z_score > self.std_dev_threshold:
                confidence = min(z_score / (self.std_dev_threshold * 2), 1.0)
                anomalies.append(
                    {
                        "log_id": log.id,
                        "timestamp": log.timestamp.isoformat(),
                        "endpoint": log.endpoint,
                        "response_time_ms": log.response_time_ms,
                        "z_score": round(z_score, 2),
                        "confidence_score": round(confidence, 2),
                        "insight_type": "response_time_anomaly",
                    }
                )

        return sorted(anomalies, key=lambda x: x["confidence_score"], reverse=True)

    def detect_error_rate_anomalies(
        self, db: Session, user_id: int, days: int = 7, threshold_pct: float = 20.0
    ) -> List[Dict[str, Any]]:
        """
        Detect anomalous error rates using moving average deviation.
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        logs = (
            db.query(APILog)
            .filter(APILog.user_id == user_id, APILog.timestamp >= cutoff_date)
            .order_by(APILog.timestamp)
            .all()
        )

        if len(logs) < 5:
            return []

        # Group logs by day and calculate daily error rates
        daily_stats = {}
        for log in logs:
            day = log.timestamp.date()
            if day not in daily_stats:
                daily_stats[day] = {"total": 0, "errors": 0}
            daily_stats[day]["total"] += 1
            if log.status_code >= 400:
                daily_stats[day]["errors"] += 1

        anomalies = []
        error_rates = [
            (stats["errors"] / stats["total"]) * 100 for stats in daily_stats.values()
        ]

        if not error_rates:
            return []

        baseline_rate = statistics.mean(error_rates)

        for day, stats in daily_stats.items():
            error_rate = (stats["errors"] / stats["total"]) * 100
            if abs(error_rate - baseline_rate) > threshold_pct:
                confidence = min(
                    abs(error_rate - baseline_rate) / (threshold_pct * 2), 1.0
                )
                anomalies.append(
                    {
                        "date": day.isoformat(),
                        "error_rate_pct": round(error_rate, 2),
                        "baseline_rate_pct": round(baseline_rate, 2),
                        "errors": stats["errors"],
                        "total_requests": stats["total"],
                        "confidence_score": round(confidence, 2),
                        "insight_type": "error_rate_anomaly",
                    }
                )

        return sorted(anomalies, key=lambda x: x["confidence_score"], reverse=True)

    def detect_traffic_anomalies(
        self, db: Session, user_id: int, days: int = 7
    ) -> List[Dict[str, Any]]:
        """
        Detect anomalous traffic patterns (spikes/drops).
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        logs = (
            db.query(APILog)
            .filter(APILog.user_id == user_id, APILog.timestamp >= cutoff_date)
            .order_by(APILog.timestamp)
            .all()
        )

        if len(logs) < 3:
            return []

        # Group by day
        daily_counts = {}
        for log in logs:
            day = log.timestamp.date()
            daily_counts[day] = daily_counts.get(day, 0) + 1

        counts = list(daily_counts.values())
        mean = statistics.mean(counts)
        stdev = statistics.stdev(counts) if len(counts) > 1 else 0

        if stdev == 0:
            return []

        anomalies = []
        for day, count in daily_counts.items():
            z_score = abs((count - mean) / stdev)
            if z_score > 2.0:
                confidence = min(z_score / 4.0, 1.0)
                anomalies.append(
                    {
                        "date": day.isoformat(),
                        "request_count": count,
                        "expected_count": round(mean, 0),
                        "z_score": round(z_score, 2),
                        "confidence_score": round(confidence, 2),
                        "insight_type": "traffic_anomaly",
                    }
                )

        return sorted(anomalies, key=lambda x: x["confidence_score"], reverse=True)
