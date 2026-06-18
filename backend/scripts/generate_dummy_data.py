#!/usr/bin/env python3
"""
Dummy Data Generator for DataPulse SaaS Dashboard
Generates realistic test data for development and QA testing
"""

import sys
import os
from datetime import datetime, timedelta
from random import randint, choice, uniform, random
import hashlib

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.user import User
from app.models.organization import Organization
from app.models.role import Role
from app.models.api_log import APILog
from app.models.api_key import APIKey
from app.models.export_job import ExportJob
from app.models.alert_rule import AlertRule, Alert
from app.models.audit_log import AuditLog
from app.models.dashboard import Dashboard
from app.models.metric import Metric
from app.models.ml_insight import MLInsight
from app.models.scheduled_report import ScheduledReport
from app.core.security import hash_password


# Configuration
DB_URL = os.getenv("DATABASE_URL", "sqlite:///saas_dashboard.db")
ENGINE = create_engine(DB_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=ENGINE)


def generate_password_hash(password: str) -> str:
    """Generate bcrypt hash for password"""
    return hash_password(password)


def seed_organizations(session, count: int = 3) -> list:
    """Create dummy organizations"""
    print(f"[ORG] Generating {count} organizations...")

    org_names = [
        "Acme Corp",
        "TechStart Inc",
        "Global Solutions Ltd",
    ]

    organizations = []
    for i, name in enumerate(org_names[:count]):
        org = Organization(
            name=name,
            domain=name.lower().replace(" ", "").replace("&", "and"),
            subscription_plan="enterprise" if i == 0 else ("pro" if i == 1 else "free"),
            billing_email=f"billing@{name.lower().replace(' ', '')}.com",
            monthly_api_quota=1000000 * (10 if i == 0 else (5 if i == 1 else 1)),
            created_at=datetime.utcnow() - timedelta(days=randint(30, 365)),
        )
        session.add(org)
        organizations.append(org)

    session.commit()
    print(f"[OK] Created {len(organizations)} organizations")
    return organizations


def seed_roles(session) -> dict:
    """Create default roles"""
    print("[ROLE] Generating roles...")

    roles_data = [
        {"name": "admin", "permissions": ["read", "write", "delete", "admin"]},
        {"name": "analyst", "permissions": ["read", "write", "analytics"]},
        {"name": "viewer", "permissions": ["read"]},
    ]

    roles = {}
    for role_data in roles_data:
        role = Role(
            name=role_data["name"],
            permissions=role_data["permissions"],
            description=f"{role_data['name'].title()} role",
        )
        session.add(role)
        roles[role_data["name"]] = role

    session.commit()
    print(f"[OK] Created {len(roles)} roles")
    return roles


def seed_users(session, organizations: list, count: int = 15) -> list:
    """Create dummy users"""
    print(f"[USR] Generating {count} users...")

    first_names = ["John", "Jane", "Bob", "Alice", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry",
                   "Ivy", "Jack", "Kate", "Liam", "Mia"]
    last_names = ["Smith", "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
                  "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Lee"]

    users = []
    for i in range(count):
        first = first_names[i % len(first_names)]
        last = last_names[i % len(last_names)]
        email = f"{first.lower()}.{last.lower()}{i}@example.com"

        user = User(
            email=email,
            password_hash=generate_password_hash("password123"),
            name=f"{first} {last}",
            role=choice(["admin", "analyst", "viewer"]),
            plan=choice(["free", "pro", "enterprise"]),
            usage_percent=randint(10, 95),
            status=choice(["active", "inactive"]),
            created_at=datetime.utcnow() - timedelta(days=randint(1, 365)),
        )
        session.add(user)
        users.append(user)

    # Add demo admin user
    admin_user = User(
        email="admin@example.com",
        password_hash=generate_password_hash("admin123"),
        name="Admin User",
        role="admin",
        plan="enterprise",
        usage_percent=45,
        status="active",
        created_at=datetime.utcnow() - timedelta(days=365),
    )
    session.add(admin_user)
    users.append(admin_user)

    session.commit()
    print(f"[OK] Created {len(users)} users")
    return users


def seed_api_keys(session, users: list) -> list:
    """Create dummy API keys"""
    print(f"[KEY] Generating API keys...")

    api_keys = []
    # Create 2-3 keys per user (randomly)
    for user in users[:len(users) // 2]:  # Only for half the users
        num_keys = randint(1, 3)
        for i in range(num_keys):
            key = APIKey(
                user_id=user.id,
                key_name=f"{user.name}'s API Key {i + 1}",
                key_value=f"sk_live_{hashlib.sha256(f'{user.email}{i}{datetime.utcnow()}'.encode()).hexdigest()[:32]}",
                last_used_at=datetime.utcnow() - timedelta(hours=randint(0, 168)) if random() > 0.3 else None,
                created_at=datetime.utcnow() - timedelta(days=randint(1, 180)),
            )
            session.add(key)
            api_keys.append(key)

    session.commit()
    print(f"[OK] Created {len(api_keys)} API keys")
    return api_keys


def seed_api_logs(session, users: list, count: int = 200) -> list:
    """Create dummy API logs"""
    print(f"[LOG] Generating {count} API logs...")

    endpoints = [
        "/api/users",
        "/api/metrics",
        "/api/reports",
        "/api/alerts",
        "/api/exports",
        "/api/dashboards",
        "/api/settings",
        "/api/analytics",
        "/api/insights",
        "/api/audit-log",
    ]

    methods = ["GET", "POST", "PUT", "DELETE"]
    status_codes = [200, 201, 400, 401, 403, 404, 500, 502, 503]

    api_logs = []
    for _ in range(count):
        user = choice(users)
        timestamp = datetime.utcnow() - timedelta(
            hours=randint(0, 720),  # Last 30 days
            minutes=randint(0, 59),
            seconds=randint(0, 59)
        )

        # Bias towards successful responses
        status = choice([200] * 70 + [201] * 10 + [400] * 5 + [401] * 5 + [500] * 5 + [503] * 5)

        log = APILog(
            user_id=user.id,
            endpoint=choice(endpoints),
            method=choice(methods),
            status_code=status,
            response_time_ms=uniform(10, 2000) if status == 200 else uniform(50, 5000),
            request_id=hashlib.sha256(f'{user.id}{timestamp}{random()}'.encode()).hexdigest()[:36],
            timestamp=timestamp,
        )
        session.add(log)
        api_logs.append(log)

    session.commit()
    print(f"[OK] Created {len(api_logs)} API logs")
    return api_logs


def seed_export_jobs(session, users: list, count: int = 25) -> list:
    """Create dummy export jobs"""
    print(f"[EXP] Generating {count} export jobs...")

    export_types = ["users", "api_logs", "analytics", "reports", "audit_log"]
    statuses = ["completed", "processing", "pending", "failed"]

    export_jobs = []
    for _ in range(count):
        user = choice(users)
        status = choice(statuses)
        created_time = datetime.utcnow() - timedelta(days=randint(0, 30))

        job = ExportJob(
            user_id=user.id,
            job_type=choice(export_types),
            status=status,
            file_url=f"https://storage.example.com/exports/{user.id}/{hashlib.sha256(str(random()).encode()).hexdigest()}.csv" if status == "completed" else None,
            row_count=randint(100, 10000) if status in ["completed", "failed"] else 0,
            progress_percent=100.0 if status == "completed" else (0.0 if status == "pending" else uniform(10, 90)),
            error_message="Storage quota exceeded" if status == "failed" else None,
            created_at=created_time,
            updated_at=created_time + timedelta(hours=randint(0, 24)) if status != "pending" else created_time,
            completed_at=created_time + timedelta(hours=randint(1, 24)) if status == "completed" else None,
        )
        session.add(job)
        export_jobs.append(job)

    session.commit()
    print(f"[OK] Created {len(export_jobs)} export jobs")
    return export_jobs


def seed_alert_rules(session, count: int = 8) -> list:
    """Create dummy alert rules"""
    print(f"[ALR] Generating {count} alert rules...")

    metrics = [
        ("error_rate", ">", 5.0, "Error rate exceeds 5%"),
        ("response_time", ">", 1000.0, "Response time exceeds 1s"),
        ("active_users", "<", 100.0, "Active users drop below 100"),
        ("cpu_usage", ">", 80.0, "CPU usage exceeds 80%"),
        ("memory_usage", ">", 85.0, "Memory usage exceeds 85%"),
        ("api_requests", ">", 10000.0, "API requests exceed 10k/min"),
        ("failed_requests", ">", 100.0, "Failed requests exceed 100/min"),
        ("database_latency", ">", 500.0, "Database latency exceeds 500ms"),
    ]

    alert_rules = []
    for i, (metric, op, threshold, description) in enumerate(metrics[:count]):
        rule = AlertRule(
            name=f"Alert: {description}",
            metric_name=metric,
            operator=op,
            threshold=threshold,
            enabled=choice([True, True, True, False]),  # Bias towards enabled
            notification_channels=choice([["email"], ["slack"], ["email", "slack", "dashboard"], ["dashboard"]]),
            created_at=datetime.utcnow() - timedelta(days=randint(1, 90)),
        )
        session.add(rule)
        alert_rules.append(rule)

    session.commit()
    print(f"[OK] Created {len(alert_rules)} alert rules")
    return alert_rules


def seed_alerts(session, alert_rules: list, count: int = 30) -> list:
    """Create dummy alerts"""
    print(f"[WRN]  Generating {count} alerts...")

    statuses = ["triggered", "acknowledged", "resolved"]

    alerts = []
    for _ in range(count):
        rule = choice(alert_rules)
        created_time = datetime.utcnow() - timedelta(hours=randint(0, 168))
        status = choice(statuses)

        alert = Alert(
            alert_rule_id=rule.id,
            status=status,
            metric_value=rule.threshold + uniform(0, rule.threshold * 0.5),
            message=f"{rule.name} - Value: {rule.threshold + uniform(0, rule.threshold * 0.5):.2f}",
            created_at=created_time,
            acknowledged_at=created_time + timedelta(minutes=randint(5, 120)) if status in ["acknowledged", "resolved"] else None,
            resolved_at=created_time + timedelta(hours=randint(1, 24)) if status == "resolved" else None,
        )
        session.add(alert)
        alerts.append(alert)

    session.commit()
    print(f"[OK] Created {len(alerts)} alerts")
    return alerts


def seed_audit_logs(session, users: list, count: int = 100) -> list:
    """Create dummy audit logs"""
    print(f"[AUD] Generating {count} audit logs...")

    actions = ["CREATE", "UPDATE", "DELETE", "VIEW", "EXPORT", "LOGIN", "LOGOUT"]
    resources = ["User", "APIKey", "Dashboard", "AlertRule", "ExportJob", "Report", "Organization"]

    audit_logs = []
    for _ in range(count):
        user = choice(users)
        timestamp = datetime.utcnow() - timedelta(
            hours=randint(0, 720),
            minutes=randint(0, 59)
        )

        log = AuditLog(
            user_id=user.id,
            action=choice(actions),
            resource_type=choice(resources),
            resource_id=randint(1, 1000),
            old_values={} if random() > 0.5 else {"field": "old_value"},
            new_values={"field": "new_value"},
            timestamp=timestamp,
            ip_address=f"192.168.{randint(1, 255)}.{randint(1, 255)}",
        )
        session.add(log)
        audit_logs.append(log)

    session.commit()
    print(f"[OK] Created {len(audit_logs)} audit logs")
    return audit_logs


def seed_metrics(session, count: int = 50) -> list:
    """Create dummy metrics"""
    print(f"[MET] Generating {count} metrics...")

    metric_types = [
        "active_users",
        "total_requests",
        "error_rate",
        "response_time",
        "cpu_usage",
        "memory_usage",
        "database_queries",
        "cache_hit_rate",
    ]

    metrics = []
    base_time = datetime.utcnow()

    for i in range(count):
        timestamp = base_time - timedelta(hours=i // (count // 24))
        metric = Metric(
            metric_name=choice(metric_types),
            value=uniform(0, 100) if "rate" in choice(metric_types) else uniform(0, 10000),
            timestamp=timestamp,
        )
        session.add(metric)
        metrics.append(metric)

    session.commit()
    print(f"[OK] Created {len(metrics)} metrics")
    return metrics


def seed_dashboards(session, users: list, count: int = 12) -> list:
    """Create dummy dashboards"""
    print(f"[DSH] Generating {count} dashboards...")

    dashboard_names = [
        "Executive Overview",
        "API Performance",
        "User Analytics",
        "System Health",
        "Financial Metrics",
        "Customer Insights",
        "Operational Metrics",
        "Real-time Monitoring",
        "Trend Analysis",
        "Compliance Dashboard",
        "Security Overview",
        "Cost Analysis",
    ]

    dashboards = []
    for name in dashboard_names[:count]:
        user = choice(users)
        dashboard = Dashboard(
            user_id=user.id,
            name=name,
            description=f"Dashboard for {name.lower()}",
            widgets=[
                {
                    "id": f"widget_{i}",
                    "type": choice(["chart", "metric", "table", "timeline"]),
                    "position": {"x": i % 4, "y": i // 4},
                    "size": {"w": 2, "h": 2},
                }
                for i in range(randint(2, 6))
            ],
            layout="grid",
            is_default=name == "Executive Overview",
            created_at=datetime.utcnow() - timedelta(days=randint(1, 180)),
        )
        session.add(dashboard)
        dashboards.append(dashboard)

    session.commit()
    print(f"[OK] Created {len(dashboards)} dashboards")
    return dashboards


def seed_ml_insights(session, users: list, count: int = 20) -> list:
    """Create dummy ML insights"""
    print(f"[AI] Generating {count} ML insights...")

    insight_types = [
        "anomaly_detection",
        "forecast",
        "trend_analysis",
        "correlation",
        "outlier",
        "pattern_recognition",
    ]

    ml_insights = []
    for _ in range(count):
        user = choice(users)
        insight = MLInsight(
            user_id=user.id,
            insight_type=choice(insight_types),
            title=f"AI-Generated {choice(['Alert', 'Insight', 'Recommendation', 'Analysis'])}",
            description="Detected unusual pattern in user behavior over the past 7 days",
            data={
                "confidence_score": uniform(0.5, 0.99),
                "affected_metric": choice(["error_rate", "response_time", "user_activity"]),
                "recommendation": choice([
                    "Investigate root cause",
                    "Consider scaling up",
                    "Review recent changes",
                    "Check external factors",
                ]),
            },
            created_at=datetime.utcnow() - timedelta(hours=randint(0, 168)),
        )
        session.add(insight)
        ml_insights.append(insight)

    session.commit()
    print(f"[OK] Created {len(ml_insights)} ML insights")
    return ml_insights


def seed_scheduled_reports(session, users: list, count: int = 10) -> list:
    """Create dummy scheduled reports"""
    print(f"[RPT] Generating {count} scheduled reports...")

    report_types = ["daily", "weekly", "monthly", "quarterly"]

    scheduled_reports = []
    for _ in range(count):
        user = choice(users)
        report = ScheduledReport(
            user_id=user.id,
            name=f"Report: {choice(['Performance', 'Analytics', 'Summary', 'Executive'])}",
            schedule_type=choice(report_types),
            recipient_emails=[user.email],
            template_config={
                "sections": ["overview", "metrics", "trends", "recommendations"],
                "date_range": "last_7_days",
            },
            last_sent_at=datetime.utcnow() - timedelta(days=randint(0, 7)),
            next_send_at=datetime.utcnow() + timedelta(days=randint(1, 30)),
            enabled=choice([True, True, True, False]),
            created_at=datetime.utcnow() - timedelta(days=randint(1, 180)),
        )
        session.add(report)
        scheduled_reports.append(report)

    session.commit()
    print(f"[OK] Created {len(scheduled_reports)} scheduled reports")
    return scheduled_reports


def main():
    """Generate all dummy data"""
    print("\n" + "="*60)
    print("[START] DataPulse Dummy Data Generator")
    print("="*60 + "\n")

    session = SessionLocal()

    try:
        # Check if data already exists
        existing_users = session.query(User).count()
        if existing_users > 0:
            response = input(
                f"Database already contains {existing_users} users. "
                "Continue and add more data? (y/n): "
            )
            if response.lower() != 'y':
                print("[ERR] Cancelled")
                return

        # Generate data in dependency order
        organizations = seed_organizations(session, count=3)
        roles = seed_roles(session)
        users = seed_users(session, organizations, count=15)
        api_keys = seed_api_keys(session, users)
        api_logs = seed_api_logs(session, users, count=200)
        export_jobs = seed_export_jobs(session, users, count=25)
        alert_rules = seed_alert_rules(session, count=8)
        alerts = seed_alerts(session, alert_rules, count=30)
        audit_logs = seed_audit_logs(session, users, count=100)
        metrics = seed_metrics(session, count=50)
        dashboards = seed_dashboards(session, users, count=12)
        ml_insights = seed_ml_insights(session, users, count=20)
        scheduled_reports = seed_scheduled_reports(session, users, count=10)

        print("\n" + "="*60)
        print("[OK] DATA GENERATION COMPLETE!")
        print("="*60)
        print(f"\n[MET] Summary:")
        print(f"  • Organizations: {len(organizations)}")
        print(f"  • Roles: {len(roles)}")
        print(f"  • Users: {len(users)}")
        print(f"  • API Keys: {len(api_keys)}")
        print(f"  • API Logs: {len(api_logs)}")
        print(f"  • Export Jobs: {len(export_jobs)}")
        print(f"  • Alert Rules: {len(alert_rules)}")
        print(f"  • Alerts: {len(alerts)}")
        print(f"  • Audit Logs: {len(audit_logs)}")
        print(f"  • Metrics: {len(metrics)}")
        print(f"  • Dashboards: {len(dashboards)}")
        print(f"  • ML Insights: {len(ml_insights)}")
        print(f"  • Scheduled Reports: {len(scheduled_reports)}")

        print(f"\n🔐 Demo Account:")
        print(f"  Email: admin@example.com")
        print(f"  Password: admin123")

        print("\n" + "="*60 + "\n")

    except Exception as e:
        print(f"\n[ERR] Error generating data: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()


if __name__ == "__main__":
    main()
