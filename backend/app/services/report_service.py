from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from backend.app.models.scheduled_report import ScheduledReport, ReportExecution
from backend.app.schemas.scheduled_report import (
    ScheduledReportCreate,
    ScheduledReportUpdate,
)
from backend.app.services.export_service import ExportService
from backend.app.utils.email import EmailService
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import os
import json
from croniter import croniter


class ReportService:
    """Service for managing scheduled reports."""

    def __init__(self, db: Session):
        self.db = db
        self.export_service = ExportService()
        self.email_service = EmailService()

    def create_report(self, user_id: int, report_data: ScheduledReportCreate) -> ScheduledReport:
        """Create a new scheduled report."""
        # Calculate next run time
        next_run = self._calculate_next_run(report_data.schedule_type, report_data.schedule_config)

        db_report = ScheduledReport(
            user_id=user_id,
            name=report_data.name,
            description=report_data.description,
            report_type=report_data.report_type,
            filters=report_data.filters,
            include_charts=report_data.include_charts,
            export_format=report_data.export_format,
            schedule_type=report_data.schedule_type,
            schedule_config=report_data.schedule_config,
            recipient_emails=report_data.recipient_emails,
            delivery_method=report_data.delivery_method,
            is_active=report_data.is_active,
            next_run_at=next_run,
        )

        self.db.add(db_report)
        self.db.commit()
        self.db.refresh(db_report)
        return db_report

    def get_report(self, report_id: int, user_id: Optional[int] = None) -> Optional[ScheduledReport]:
        """Get a scheduled report by ID."""
        query = self.db.query(ScheduledReport).filter(ScheduledReport.id == report_id)
        if user_id:
            query = query.filter(ScheduledReport.user_id == user_id)
        return query.first()

    def list_reports(
        self, user_id: Optional[int] = None, is_active: Optional[bool] = None, skip: int = 0, limit: int = 50
    ) -> List[ScheduledReport]:
        """List scheduled reports with optional filters."""
        query = self.db.query(ScheduledReport)

        if user_id:
            query = query.filter(ScheduledReport.user_id == user_id)
        if is_active is not None:
            query = query.filter(ScheduledReport.is_active == is_active)

        return query.offset(skip).limit(limit).all()

    def update_report(self, report_id: int, report_data: ScheduledReportUpdate, user_id: int) -> Optional[
        ScheduledReport
    ]:
        """Update a scheduled report."""
        report = self.get_report(report_id, user_id)
        if not report:
            return None

        update_data = report_data.dict(exclude_unset=True)

        # Recalculate next_run if schedule changed
        if "schedule_type" in update_data or "schedule_config" in update_data:
            schedule_type = update_data.get("schedule_type", report.schedule_type)
            schedule_config = update_data.get("schedule_config", report.schedule_config)
            update_data["next_run_at"] = self._calculate_next_run(schedule_type, schedule_config)

        for field, value in update_data.items():
            setattr(report, field, value)

        self.db.commit()
        self.db.refresh(report)
        return report

    def delete_report(self, report_id: int, user_id: int) -> bool:
        """Delete a scheduled report."""
        report = self.get_report(report_id, user_id)
        if not report:
            return False

        self.db.delete(report)
        self.db.commit()
        return True

    def get_due_reports(self) -> List[ScheduledReport]:
        """Get all reports that are due to run now."""
        now = datetime.utcnow()
        return self.db.query(ScheduledReport).filter(
            and_(
                ScheduledReport.is_active == True,
                ScheduledReport.next_run_at <= now,
            )
        ).all()

    def execute_report(self, report: ScheduledReport) -> ReportExecution:
        """Execute a scheduled report and generate file."""
        execution = ReportExecution(
            scheduled_report_id=report.id,
            status="running",
            started_at=datetime.utcnow(),
        )
        self.db.add(execution)
        self.db.commit()

        try:
            # Generate report file
            file_path = self._generate_report_file(report)

            # Update execution record
            execution.file_path = file_path
            execution.file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0
            execution.status = "completed"
            execution.completed_at = datetime.utcnow()
            execution.execution_time_ms = int(
                (execution.completed_at - execution.started_at).total_seconds() * 1000
            )

            # Deliver report
            if report.delivery_method == "email":
                delivery_success = self._deliver_via_email(report, execution, file_path)
                execution.delivery_status = "sent" if delivery_success else "failed"
                if not delivery_success:
                    execution.delivery_error = "Failed to send email"

            # Update scheduled report
            report.last_run_at = execution.completed_at
            report.next_run_at = self._calculate_next_run(report.schedule_type, report.schedule_config)

        except Exception as e:
            execution.status = "failed"
            execution.error_message = str(e)
            execution.completed_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(execution)
        return execution

    def _generate_report_file(self, report: ScheduledReport) -> str:
        """Generate the report file based on report configuration."""
        # This would call the export service to generate the actual report
        # For now, create a placeholder
        os.makedirs("temp_reports", exist_ok=True)

        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        filename = f"{report.report_type}_{timestamp}.{report.export_format}"
        filepath = os.path.join("temp_reports", filename)

        # Create a placeholder file
        with open(filepath, "w") as f:
            f.write(f"Report: {report.name}\n")
            f.write(f"Type: {report.report_type}\n")
            f.write(f"Generated: {datetime.utcnow()}\n")

        return filepath

    def _deliver_via_email(self, report: ScheduledReport, execution: ReportExecution, file_path: str) -> bool:
        """Deliver report via email."""
        subject = f"Scheduled Report: {report.name}"
        body = EmailService.generate_report_email_body(
            report_name=report.name,
            report_type=report.report_type,
            generated_at=execution.completed_at,
        )

        filename = os.path.basename(file_path)
        return self.email_service.send_report(
            recipient_emails=report.recipient_emails,
            subject=subject,
            body=body,
            attachment_path=file_path if os.path.exists(file_path) else None,
            attachment_filename=filename,
        )

    @staticmethod
    def _calculate_next_run(schedule_type: str, schedule_config: Dict[str, Any]) -> datetime:
        """Calculate the next run time based on schedule type."""
        now = datetime.utcnow()

        if schedule_type == "daily":
            return now + timedelta(days=1)
        elif schedule_type == "weekly":
            return now + timedelta(weeks=1)
        elif schedule_type == "monthly":
            # Add roughly 30 days
            return now + timedelta(days=30)
        elif schedule_type == "custom":
            # Use cron expression if provided
            cron_expr = schedule_config.get("cron")
            if cron_expr:
                try:
                    cron = croniter(cron_expr, now)
                    return cron.get_next(datetime)
                except Exception:
                    pass
        return now + timedelta(days=1)  # Default to daily

    def get_execution_history(self, report_id: int, limit: int = 10) -> List[ReportExecution]:
        """Get execution history for a report."""
        return (
            self.db.query(ReportExecution)
            .filter(ReportExecution.scheduled_report_id == report_id)
            .order_by(ReportExecution.created_at.desc())
            .limit(limit)
            .all()
        )

    def count_reports(self, user_id: Optional[int] = None) -> int:
        """Count total reports."""
        query = self.db.query(ScheduledReport)
        if user_id:
            query = query.filter(ScheduledReport.user_id == user_id)
        return query.count()
