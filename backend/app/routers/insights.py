from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.dependencies import get_db, get_current_user
from app.models import User, MLInsight
from app.services.anomaly_detection import AnomalyDetector
from app.services.forecasting import Forecaster
from app.services.churn_prediction import ChurnPredictor

router = APIRouter(prefix="/api/insights", tags=["insights"])

anomaly_detector = AnomalyDetector()
forecaster = Forecaster()
churn_predictor = ChurnPredictor()


@router.get("/anomalies")
def get_anomalies(
    days: int = 7,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get detected anomalies in user's API activity.
    Includes: response time anomalies, error rate anomalies, traffic anomalies.
    """
    try:
        response_time_anomalies = anomaly_detector.detect_response_time_anomalies(
            db, current_user["user_id"], days
        )
        error_rate_anomalies = anomaly_detector.detect_error_rate_anomalies(
            db, current_user["user_id"], days
        )
        traffic_anomalies = anomaly_detector.detect_traffic_anomalies(
            db, current_user["user_id"], days
        )

        return {
            "detected_at": datetime.utcnow().isoformat(),
            "response_time_anomalies": response_time_anomalies[:5],
            "error_rate_anomalies": error_rate_anomalies[:5],
            "traffic_anomalies": traffic_anomalies[:5],
            "total_anomalies": (
                len(response_time_anomalies)
                + len(error_rate_anomalies)
                + len(traffic_anomalies)
            ),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting anomalies: {str(e)}")


@router.get("/forecast/requests")
def forecast_requests(
    days_history: int = 7,
    days_ahead: int = 3,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get forecast for API request volume.
    """
    try:
        forecast = forecaster.forecast_request_volume(
            db, current_user["user_id"], days_history, days_ahead
        )
        return {
            "forecast_type": "request_volume",
            "generated_at": datetime.utcnow().isoformat(),
            **forecast,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating forecast: {str(e)}")


@router.get("/forecast/error-rate")
def forecast_error_rate(
    days_history: int = 7,
    days_ahead: int = 3,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get forecast for error rate.
    """
    try:
        forecast = forecaster.forecast_error_rate(
            db, current_user["user_id"], days_history, days_ahead
        )
        return {
            "forecast_type": "error_rate",
            "generated_at": datetime.utcnow().isoformat(),
            **forecast,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating forecast: {str(e)}")


@router.get("/forecast/revenue")
def forecast_revenue(
    days_history: int = 7,
    days_ahead: int = 3,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get revenue forecast.
    """
    try:
        forecast = forecaster.forecast_revenue(
            db, current_user["user_id"], days_history, days_ahead
        )
        return {
            "forecast_type": "revenue",
            "generated_at": datetime.utcnow().isoformat(),
            **forecast,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating forecast: {str(e)}")


@router.get("/churn-risk/user/{user_id}")
def get_user_churn_risk(
    user_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get churn risk prediction for a specific user.
    Only allow admins or the user to view their own risk.
    """
    if current_user["role"] != "admin" and current_user["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    try:
        prediction = churn_predictor.predict_user_churn(db, user_id)
        return {
            "prediction_type": "user_churn",
            "generated_at": datetime.utcnow().isoformat(),
            **prediction,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting churn: {str(e)}")


@router.get("/churn-risk/cohort")
def get_cohort_churn_risk(
    days_future: int = 30,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get churn risk prediction for entire user cohort.
    Admin only.
    """
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    try:
        prediction = churn_predictor.predict_cohort_churn(db, days_future)
        return {
            "prediction_type": "cohort_churn",
            "generated_at": datetime.utcnow().isoformat(),
            **prediction,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting cohort churn: {str(e)}")


@router.get("/dashboard")
def get_insights_dashboard(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get comprehensive insights dashboard combining:
    - Anomalies
    - Forecasts
    - Churn risk (admin only)
    """
    try:
        anomalies_response = get_anomalies(days=7, current_user=current_user, db=db)
        requests_forecast = forecast_requests(
            days_history=7, days_ahead=3, current_user=current_user, db=db
        )
        error_forecast = forecast_error_rate(
            days_history=7, days_ahead=3, current_user=current_user, db=db
        )

        dashboard = {
            "generated_at": datetime.utcnow().isoformat(),
            "anomalies": anomalies_response,
            "forecasts": {
                "requests": requests_forecast,
                "error_rate": error_forecast,
            },
        }

        # Add churn risk only for admins
        if current_user["role"] == "admin":
            churn_response = get_cohort_churn_risk(days_future=30, current_user=current_user, db=db)
            dashboard["churn_risk"] = churn_response

        return dashboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating dashboard: {str(e)}")

