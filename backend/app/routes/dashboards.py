"""Dashboard API routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import DashboardCreate, DashboardUpdate, DashboardResponse
from typing import List

router = APIRouter(prefix="/api/dashboards", tags=["dashboards"])


@router.get("", response_model=List[DashboardResponse])
def get_dashboards(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Get all dashboards for current user"""
    dashboards = DashboardService.get_user_dashboards(db, current_user["user_id"])
    return dashboards


@router.get("/default", response_model=DashboardResponse)
def get_default_dashboard(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Get default dashboard for current user"""
    dashboard = DashboardService.get_default_dashboard(db, current_user["user_id"])
    if not dashboard:
        raise HTTPException(status_code=404, detail="Default dashboard not found")
    return dashboard


@router.get("/{dashboard_id}", response_model=DashboardResponse)
def get_dashboard(
    dashboard_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)
):
    """Get a specific dashboard"""
    dashboard = DashboardService.get_dashboard_by_id(db, dashboard_id, current_user["user_id"])
    if not dashboard:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return dashboard


@router.post("", response_model=DashboardResponse, status_code=status.HTTP_201_CREATED)
def create_dashboard(
    dashboard: DashboardCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)
):
    """Create a new dashboard"""
    new_dashboard = DashboardService.create_dashboard(db, current_user["user_id"], dashboard)
    return new_dashboard


@router.put("/{dashboard_id}", response_model=DashboardResponse)
def update_dashboard(
    dashboard_id: int,
    dashboard_update: DashboardUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Update a dashboard"""
    updated = DashboardService.update_dashboard(db, dashboard_id, current_user["user_id"], dashboard_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return updated


@router.delete("/{dashboard_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dashboard(
    dashboard_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)
):
    """Delete a dashboard"""
    success = DashboardService.delete_dashboard(db, dashboard_id, current_user["user_id"])
    if not success:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return None


@router.post("/{dashboard_id}/set-default", response_model=DashboardResponse)
def set_default_dashboard(
    dashboard_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)
):
    """Set a dashboard as default"""
    dashboard = DashboardService.set_default_dashboard(db, dashboard_id, current_user["user_id"])
    if not dashboard:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return dashboard

