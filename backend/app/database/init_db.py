"""Database initialization script"""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import engine, SessionLocal, Base
from app.models.user import User
from app.models.role import Role
from app.models.api_log import APILog
from app.models.metric import Metric
# Import all models so Base.metadata knows about all tables
from app.models.alert_rule import AlertRule
from app.models.api_key import APIKey
from app.models.audit_log import AuditLog
from app.models.dashboard import Dashboard
from app.models.export_job import ExportJob
from app.models.ml_insight import MLInsight
from app.models.organization import Organization
from app.models.scheduled_report import ScheduledReport


def init_db():
    """Initialize database with tables and seed data"""
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Create roles if they don't exist
        if db.query(Role).count() == 0:
            roles = [
                Role(name="admin", permissions='["all"]'),
                Role(name="analyst", permissions='["read", "write_own"]'),
                Role(name="viewer", permissions='["read"]'),
            ]
            db.add_all(roles)
            db.commit()

        # Seed users if empty
        if db.query(User).count() == 0:
            users = [
                User(
                    email="admin@example.com",
                    password_hash="admin123",
                    name="Admin User",
                    role="admin",
                    plan="enterprise",
                    usage_percent=45,
                    status="active",
                ),
                User(
                    email="analyst@example.com",
                    password_hash="analyst123",
                    name="Analyst User",
                    role="analyst",
                    plan="pro",
                    usage_percent=62,
                    status="active",
                ),
                User(
                    email="viewer@example.com",
                    password_hash="viewer123",
                    name="Viewer User",
                    role="viewer",
                    plan="free",
                    usage_percent=28,
                    status="active",
                ),
            ]
            db.add_all(users)
            db.commit()

        # Seed metrics if empty
        if db.query(Metric).count() == 0:
            today = datetime.now().date()
            metrics = []

            # Generate 30 days of metrics
            for i in range(30):
                date = today - timedelta(days=i)
                metrics.extend([
                    Metric(
                        metric_name="active_users",
                        metric_value=100 + (i * 5),
                        date=date,
                    ),
                    Metric(
                        metric_name="requests",
                        metric_value=5000 + (i * 200),
                        date=date,
                    ),
                    Metric(
                        metric_name="error_rate",
                        metric_value=2.5 - (i * 0.05),
                        date=date,
                    ),
                    Metric(
                        metric_name="revenue",
                        metric_value=10000 + (i * 500),
                        date=date,
                    ),
                ])

            db.add_all(metrics)
            db.commit()

        print("Database initialized successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error initializing database: {e}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    init_db()
