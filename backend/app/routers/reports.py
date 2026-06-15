from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.services.report_service import ReportService
from app.schemas.scheduled_report import (
    ScheduledReportCreate,
    ScheduledReportUpdate,
    ScheduledReportResponse,
    ReportExecutionResponse,
)
from app.models.user import User
from typing import List

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("", response_model=ScheduledReportResponse, status_code=201)
def create_scheduled_report(
    report_data: ScheduledReportCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new scheduled report."""
    service = ReportService(db)
    report = service.create_report(current_user["user_id"], report_data)
    return report


@router.get("", response_model=List[ScheduledReportResponse])
def list_scheduled_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    is_active: bool = Query(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all scheduled reports for current user."""
    service = ReportService(db)
    reports = service.list_reports(
        user_id=current_user["user_id"],
        is_active=is_active,
        skip=skip,
        limit=limit,
    )
    return reports


@router.get("/{report_id}", response_model=ScheduledReportResponse)
def get_scheduled_report(
    report_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific scheduled report."""
    service = ReportService(db)
    report = service.get_report(report_id, current_user["user_id"])
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.put("/{report_id}", response_model=ScheduledReportResponse)
def update_scheduled_report(
    report_id: int,
    report_data: ScheduledReportUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a scheduled report."""
    service = ReportService(db)
    report = service.update_report(report_id, report_data, current_user["user_id"])
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.delete("/{report_id}", status_code=204)
def delete_scheduled_report(
    report_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a scheduled report."""
    service = ReportService(db)
    success = service.delete_report(report_id, current_user["user_id"])
    if not success:
        raise HTTPException(status_code=404, detail="Report not found")
    return None


@router.post("/{report_id}/run", response_model=ReportExecutionResponse, status_code=202)
def run_report_now(
    report_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Manually trigger report execution."""
    service = ReportService(db)
    report = service.get_report(report_id, current_user["user_id"])
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    execution = service.execute_report(report)
    return execution


@router.get("/{report_id}/executions", response_model=List[ReportExecutionResponse])
def get_report_executions(
    report_id: int,
    limit: int = Query(10, ge=1, le=50),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get execution history for a scheduled report."""
    service = ReportService(db)
    report = service.get_report(report_id, current_user["user_id"])
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    executions = service.get_execution_history(report_id, limit)
    return executions
