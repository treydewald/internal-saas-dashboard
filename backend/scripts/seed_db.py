"""Seed database with realistic test data"""
import sys
import uuid
from datetime import datetime, timedelta
import random

# Add parent directory to path for imports
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.api_log import APILog


def seed_api_logs():
    """Seed API logs with realistic test data"""
    db = SessionLocal()
    try:
        # Only seed if table is empty
        if db.query(APILog).count() > 0:
            print("API logs already seeded")
            return

        endpoints = [
            "/api/users",
            "/api/analytics/kpis",
            "/api/api-logs",
            "/api/auth/login",
            "/api/reports",
        ]

        methods = ["GET", "POST", "PUT", "DELETE"]
        status_codes = [200, 201, 400, 401, 404, 500]
        status_weights = [0.7, 0.1, 0.05, 0.05, 0.05, 0.05]  # 70% success

        logs = []
        now = datetime.now()

        # Generate 1000+ API logs for the last 30 days
        for i in range(1200):
            # Random timestamp within last 30 days
            days_ago = random.randint(0, 29)
            hours_ago = random.randint(0, 23)
            minutes_ago = random.randint(0, 59)

            timestamp = now - timedelta(
                days=days_ago,
                hours=hours_ago,
                minutes=minutes_ago,
                seconds=random.randint(0, 59)
            )

            log = APILog(
                user_id=random.randint(1, 3),
                endpoint=random.choice(endpoints),
                method=random.choice(methods),
                status_code=random.choices(status_codes, weights=status_weights)[0],
                response_time_ms=random.uniform(10, 2000),
                request_id=str(uuid.uuid4()),
                timestamp=timestamp,
            )
            logs.append(log)

        db.add_all(logs)
        db.commit()
        print(f"Seeded {len(logs)} API logs")

    except Exception as e:
        db.rollback()
        print(f"Error seeding API logs: {e}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_api_logs()
