"""Export jobs management routes"""
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.export_job import (
    ExportJobCreate,
    ExportJobResponse,
    ExportJobListResponse,
)
from app.services.export_job_service import ExportJobService

router = APIRouter(prefix="/api/exports", tags=["exports"])


@router.post("", response_model=ExportJobResponse, status_code=status.HTTP_201_CREATED)
async def create_export_job(
    job_data: ExportJobCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new export job (async)"""
    org_id = None  # Can be obtained from current_user or query param
    job = ExportJobService.create_export_job(db, current_user["user_id"], job_data, org_id)

    # TODO: Queue job for background processing
    # Example: celery.send_task('process_export', args=[job.id])

    return job


@router.get("", response_model=ExportJobListResponse)
async def list_export_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all export jobs for current user"""
    jobs, total_count = ExportJobService.get_user_jobs(
        db,
        current_user["user_id"],
        limit=limit,
        skip=skip,
    )
    return ExportJobListResponse(jobs=jobs, total_count=total_count)


@router.get("/{job_id}", response_model=ExportJobResponse)
async def get_export_job(
    job_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get export job details"""
    job = ExportJobService.get_job(db, job_id, current_user["user_id"])
    return job


@router.post("/{job_id}/cancel", response_model=ExportJobResponse)
async def cancel_export_job(
    job_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel pending export job"""
    job = ExportJobService.cancel_job(db, job_id, current_user["user_id"])
    return job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_export_job(
    job_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete export job"""
    ExportJobService.delete_job(db, job_id, current_user["user_id"])
    return None


@router.post("/{job_id}/retry", response_model=ExportJobResponse)
async def retry_export_job(
    job_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retry failed export job"""
    job = ExportJobService.get_job(db, job_id, current_user["user_id"])

    if job.status != "failed":
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only retry failed jobs",
        )

    # Reset job status and retry
    job = ExportJobService.update_job_status(db, job_id, "pending", progress=0.0)

    # TODO: Queue job for background processing

    return job
