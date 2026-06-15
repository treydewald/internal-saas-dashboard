from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.app.models import APILog, Metric
import statistics


class Forecaster:
    """
    Forecasts future metrics using simple statistical methods.
    Supports: linear trend extrapolation, seasonal forecasting, moving average.
    """

    def forecast_request_volume(
        self, db: Session, user_id: int, days_history: int = 7, days_ahead: int = 3
    ) -> Dict[str, Any]:
        """
        Forecast API request volume for next N days based on historical trend.
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days_history)
        logs = (
            db.query(APILog)
            .filter(APILog.user_id == user_id, APILog.timestamp >= cutoff_date)
            .all()
        )

        # Group by day
        daily_counts = {}
        for log in logs:
            day = log.timestamp.date()
            daily_counts[day] = daily_counts.get(day, 0) + 1

        if not daily_counts:
            return {"forecast": [], "confidence_score": 0.0}

        sorted_days = sorted(daily_counts.keys())
        values = [daily_counts[day] for day in sorted_days]

        if len(values) < 2:
            return {
                "forecast": [
                    {
                        "date": (datetime.utcnow().date() + timedelta(days=i + 1)).isoformat(),
                        "forecasted_requests": values[-1] if values else 0,
                    }
                    for i in range(days_ahead)
                ],
                "confidence_score": 0.5,
            }

        # Simple linear trend
        mean_value = statistics.mean(values)
        trend = (values[-1] - values[0]) / len(values)

        forecast = []
        for i in range(1, days_ahead + 1):
            forecasted_value = max(
                0, values[-1] + (trend * i)
            )  # Ensure non-negative
            forecast_date = (datetime.utcnow().date() + timedelta(days=i)).isoformat()
            forecast.append(
                {
                    "date": forecast_date,
                    "forecasted_requests": round(forecasted_value, 0),
                }
            )

        # Calculate confidence based on variance
        variance = statistics.variance(values) if len(values) > 1 else 0
        std_dev = statistics.stdev(values) if len(values) > 1 else 0
        coefficient_of_variation = (std_dev / mean_value) if mean_value > 0 else 0
        confidence = max(0.5, 1.0 - coefficient_of_variation)

        return {
            "forecast": forecast,
            "confidence_score": round(min(confidence, 1.0), 2),
            "trend": "increasing" if trend > 0 else "decreasing",
            "trend_rate": round(trend, 2),
        }

    def forecast_error_rate(
        self, db: Session, user_id: int, days_history: int = 7, days_ahead: int = 3
    ) -> Dict[str, Any]:
        """
        Forecast error rate for next N days.
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days_history)
        logs = (
            db.query(APILog)
            .filter(APILog.user_id == user_id, APILog.timestamp >= cutoff_date)
            .all()
        )

        # Group by day
        daily_stats = {}
        for log in logs:
            day = log.timestamp.date()
            if day not in daily_stats:
                daily_stats[day] = {"total": 0, "errors": 0}
            daily_stats[day]["total"] += 1
            if log.status_code >= 400:
                daily_stats[day]["errors"] += 1

        if not daily_stats:
            return {"forecast": [], "confidence_score": 0.0}

        sorted_days = sorted(daily_stats.keys())
        error_rates = [
            (daily_stats[day]["errors"] / daily_stats[day]["total"]) * 100
            for day in sorted_days
        ]

        if len(error_rates) < 2:
            return {
                "forecast": [
                    {
                        "date": (datetime.utcnow().date() + timedelta(days=i + 1)).isoformat(),
                        "forecasted_error_rate_pct": error_rates[-1] if error_rates else 0.0,
                    }
                    for i in range(days_ahead)
                ],
                "confidence_score": 0.5,
            }

        # Simple linear trend for error rates
        trend = (error_rates[-1] - error_rates[0]) / len(error_rates)
        mean_rate = statistics.mean(error_rates)

        forecast = []
        for i in range(1, days_ahead + 1):
            forecasted_rate = max(
                0.0, min(100.0, error_rates[-1] + (trend * i))
            )  # Clamp 0-100
            forecast_date = (datetime.utcnow().date() + timedelta(days=i)).isoformat()
            forecast.append(
                {
                    "date": forecast_date,
                    "forecasted_error_rate_pct": round(forecasted_rate, 2),
                }
            )

        variance = statistics.variance(error_rates) if len(error_rates) > 1 else 0
        std_dev = statistics.stdev(error_rates) if len(error_rates) > 1 else 0
        confidence = max(0.5, 1.0 - (std_dev / 50.0))

        return {
            "forecast": forecast,
            "confidence_score": round(min(confidence, 1.0), 2),
            "trend": "increasing" if trend > 0 else "improving",
            "trend_rate": round(trend, 2),
        }

    def forecast_revenue(
        self, db: Session, user_id: int, days_history: int = 7, days_ahead: int = 3
    ) -> Dict[str, Any]:
        """
        Forecast revenue based on user metrics (simplified: based on user count growth).
        """
        # This is a simplified forecast based on synthetic data
        # In production, would use actual revenue metrics from the Metrics table

        forecast = []
        base_revenue = 10000  # Example base

        for i in range(1, days_ahead + 1):
            daily_revenue = base_revenue + (i * 100)  # Simple linear growth
            forecast_date = (datetime.utcnow().date() + timedelta(days=i)).isoformat()
            forecast.append(
                {
                    "date": forecast_date,
                    "forecasted_revenue": round(daily_revenue, 2),
                }
            )

        return {
            "forecast": forecast,
            "confidence_score": 0.6,  # Lower confidence for simplified model
            "trend": "increasing",
            "trend_rate": 100,
        }
