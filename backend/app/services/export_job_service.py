"""Export job service - manage async export operations"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.export_job import ExportJob
from app.schemas.export_job import ExportJobCreate
from datetime import datetime


class ExportJobService:
    """Service for managing export jobs"""

    @staticmethod
    def create_export_job(
        db: Session,
        user_id: int,
        job_data: ExportJobCreate,
        org_id: int = None,
    ) -> ExportJob:
        """Create a new export job"""
        job = ExportJob(
            user_id=user_id,
            organization_id=org_id,
            job_type=job_data.job_type,
            filters=job_data.filters,
            status="pending",
        )

        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def get_job(db: Session, job_id: int, user_id: int) -> ExportJob:
        """Get export job (verify ownership)"""
        job = db.query(ExportJob).filter(
            ExportJob.id == job_id,
            ExportJob.user_id == user_id,
        ).first()

        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Export job not found",
            )
        return job

    @staticmethod
    def get_user_jobs(
        db: Session,
        user_id: int,
        limit: int = 20,
        skip: int = 0,
    ) -> tuple[list[ExportJob], int]:
        """Get all export jobs for user"""
        query = db.query(ExportJob).filter(ExportJob.user_id == user_id)
        total_count = query.count()
        jobs = query.order_by(ExportJob.created_at.desc()).offset(skip).limit(limit).all()
        return jobs, total_count

    @staticmethod
    def update_job_status(
        db: Session,
        job_id: int,
        status: str,
        progress: float = None,
        file_url: str = None,
        row_count: int = None,
        error_msg: str = None,
    ) -> ExportJob:
        """Update export job status"""
        job = db.query(ExportJob).filter(ExportJob.id == job_id).first()
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Export job not found",
            )

        job.status = status

        if progress is not None:
            job.progress_percent = progress

        if file_url is not None:
            job.file_url = file_url

        if row_count is not None:
            job.row_count = row_count

        if error_msg is not None:
            job.error_message = error_msg

        if status == "completed":
            job.completed_at = datetime.utcnow()

        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def cancel_job(db: Session, job_id: int, user_id: int) -> ExportJob:
        """Cancel pending export job"""
        job = ExportJobService.get_job(db, job_id, user_id)

        if job.status not in ["pending", "processing"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only cancel pending or processing jobs",
            )

        job.status = "failed"
        job.error_message = "Cancelled by user"
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def delete_job(db: Session, job_id: int, user_id: int) -> None:
        """Delete export job"""
        job = ExportJobService.get_job(db, job_id, user_id)
        db.delete(job)
        db.commit()
