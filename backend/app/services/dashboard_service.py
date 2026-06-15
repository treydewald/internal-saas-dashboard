"""Dashboard service for CRUD operations"""
from sqlalchemy.orm import Session
from app.models.dashboard import Dashboard
from app.schemas.dashboard import DashboardCreate, DashboardUpdate
from typing import List, Optional


class DashboardService:
    @staticmethod
    def create_dashboard(db: Session, user_id: int, dashboard: DashboardCreate) -> Dashboard:
        db_dashboard = Dashboard(
            user_id=user_id,
            name=dashboard.name,
            description=dashboard.description,
            layout=dashboard.layout,
            is_default=dashboard.is_default,
        )
        db.add(db_dashboard)
        db.commit()
        db.refresh(db_dashboard)
        return db_dashboard

    @staticmethod
    def get_user_dashboards(db: Session, user_id: int) -> List[Dashboard]:
        return db.query(Dashboard).filter(Dashboard.user_id == user_id).all()

    @staticmethod
    def get_default_dashboard(db: Session, user_id: int) -> Optional[Dashboard]:
        return (
            db.query(Dashboard)
            .filter(Dashboard.user_id == user_id, Dashboard.is_default == True)
            .first()
        )

    @staticmethod
    def get_dashboard_by_id(db: Session, dashboard_id: int, user_id: int) -> Optional[Dashboard]:
        return (
            db.query(Dashboard)
            .filter(Dashboard.id == dashboard_id, Dashboard.user_id == user_id)
            .first()
        )

    @staticmethod
    def update_dashboard(
        db: Session, dashboard_id: int, user_id: int, dashboard_update: DashboardUpdate
    ) -> Optional[Dashboard]:
        db_dashboard = DashboardService.get_dashboard_by_id(db, dashboard_id, user_id)
        if not db_dashboard:
            return None

        update_data = dashboard_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_dashboard, field, value)

        db.commit()
        db.refresh(db_dashboard)
        return db_dashboard

    @staticmethod
    def delete_dashboard(db: Session, dashboard_id: int, user_id: int) -> bool:
        db_dashboard = DashboardService.get_dashboard_by_id(db, dashboard_id, user_id)
        if not db_dashboard:
            return False

        db.delete(db_dashboard)
        db.commit()
        return True

    @staticmethod
    def set_default_dashboard(db: Session, dashboard_id: int, user_id: int) -> Optional[Dashboard]:
        db.query(Dashboard).filter(Dashboard.user_id == user_id).update({Dashboard.is_default: False})

        db_dashboard = DashboardService.get_dashboard_by_id(db, dashboard_id, user_id)
        if db_dashboard:
            db_dashboard.is_default = True
            db.commit()
            db.refresh(db_dashboard)

        return db_dashboard
