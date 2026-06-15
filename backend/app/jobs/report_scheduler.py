import asyncio
import logging
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base, engine, SessionLocal
from app.services.report_service import ReportService

logger = logging.getLogger(__name__)


class ReportScheduler:
    """Background job scheduler for executing scheduled reports."""

    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.engine = engine
        self.SessionLocal = SessionLocal
        self.is_running = False

    def start(self):
        """Start the scheduler."""
        if not self.is_running:
            self.scheduler.add_job(
                self.check_and_execute_reports,
                trigger=IntervalTrigger(minutes=1),  # Check every minute
                id="report_scheduler",
                name="Report Scheduler",
                replace_existing=True,
            )
            self.scheduler.start()
            self.is_running = True
            logger.info("Report scheduler started")

    def stop(self):
        """Stop the scheduler."""
        if self.is_running:
            self.scheduler.shutdown()
            self.is_running = False
            logger.info("Report scheduler stopped")

    async def check_and_execute_reports(self):
        """Check for due reports and execute them."""
        db = self.SessionLocal()
        try:
            service = ReportService(db)
            due_reports = service.get_due_reports()

            for report in due_reports:
                try:
                    logger.info(f"Executing scheduled report: {report.name} (ID: {report.id})")
                    execution = service.execute_report(report)
                    logger.info(
                        f"Report execution completed: {report.name} - "
                        f"Status: {execution.status}, "
                        f"Delivery: {execution.delivery_status}"
                    )
                except Exception as e:
                    logger.error(f"Error executing report {report.id}: {str(e)}", exc_info=True)

        except Exception as e:
            logger.error(f"Error in report scheduler: {str(e)}", exc_info=True)
        finally:
            db.close()


# Global scheduler instance
_scheduler: ReportScheduler = None


def get_scheduler() -> ReportScheduler:
    """Get or create the global scheduler instance."""
    global _scheduler
    if _scheduler is None:
        _scheduler = ReportScheduler()
    return _scheduler


def start_report_scheduler():
    """Start the report scheduler."""
    scheduler = get_scheduler()
    scheduler.start()


def stop_report_scheduler():
    """Stop the report scheduler."""
    scheduler = get_scheduler()
    scheduler.stop()
