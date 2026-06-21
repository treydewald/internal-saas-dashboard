"""
Generate high-quality dummy data for portfolio demonstration
"""
import random
import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import engine, SessionLocal, Base
from app.models.user import User
from app.models.api_log import APILog
from app.models.metric import Metric
from app.models.alert_rule import AlertRule, Alert
from app.models.audit_log import AuditLog
from app.models.dashboard import Dashboard
from app.models.api_key import APIKey
from app.models.ml_insight import MLInsight
from app.models.scheduled_report import ScheduledReport
from app.models.export_job import ExportJob
from app.models.organization import Organization

# Portfolio-quality user data
USERS_DATA = [
    {"email": "admin@example.com", "password": "admin123", "name": "Admin User", "role": "admin", "plan": "enterprise", "usage": 45},
    {"email": "analyst@example.com", "password": "analyst123", "name": "Sarah Johnson", "role": "analyst", "plan": "pro", "usage": 62},
    {"email": "viewer@example.com", "password": "viewer123", "name": "Viewer User", "role": "viewer", "plan": "free", "usage": 28},
    {"email": "alice.chen@techcorp.com", "password": "password123", "name": "Alice Chen", "role": "admin", "plan": "enterprise", "usage": 78},
    {"email": "bob.wilson@techcorp.com", "password": "password123", "name": "Bob Wilson", "role": "analyst", "plan": "pro", "usage": 55},
    {"email": "carol.smith@startup.io", "password": "password123", "name": "Carol Smith", "role": "analyst", "plan": "pro", "usage": 71},
    {"email": "david.lee@startup.io", "password": "password123", "name": "David Lee", "role": "viewer", "plan": "free", "usage": 15},
    {"email": "emma.davis@enterprise.com", "password": "password123", "name": "Emma Davis", "role": "admin", "plan": "enterprise", "usage": 89},
    {"email": "frank.miller@enterprise.com", "password": "password123", "name": "Frank Miller", "role": "analyst", "plan": "pro", "usage": 52},
    {"email": "grace.taylor@startup.io", "password": "password123", "name": "Grace Taylor", "role": "viewer", "plan": "free", "usage": 22},
]

# API endpoints that would be common in a SaaS platform
API_ENDPOINTS = [
    "/api/auth/login", "/api/auth/logout", "/api/auth/refresh",
    "/api/users", "/api/users/{id}", "/api/users/{id}/profile",
    "/api/dashboards", "/api/dashboards/{id}", "/api/dashboards/{id}/widgets",
    "/api/analytics/metrics", "/api/analytics/kpis", "/api/analytics/trends",
    "/api/alerts", "/api/alerts/{id}", "/api/alerts/acknowledge",
    "/api/reports", "/api/reports/{id}", "/api/reports/schedule",
    "/api/exports", "/api/exports/{id}", "/api/exports/download",
    "/api/api-logs", "/api/api-logs/search", "/api/api-logs/export",
    "/api/audit-logs", "/api/audit-logs/filter",
    "/api/organizations", "/api/organizations/{id}", "/api/organizations/settings",
    "/api/settings", "/api/settings/profile", "/api/settings/notifications",
    "/api/webhooks", "/api/webhooks/test", "/api/websocket/connect",
    "/api/insights", "/api/insights/anomalies", "/api/insights/predictions",
]

HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"]
STATUS_CODES = [200, 201, 204, 400, 401, 403, 404, 429, 500, 502, 503]
STATUS_CODE_WEIGHTS = {200: 70, 201: 5, 204: 8, 400: 4, 401: 2, 403: 1, 404: 3, 429: 1, 500: 3, 502: 2, 503: 1}

def generate_realistic_response_time(status_code):
    """Generate realistic response time based on status code"""
    if status_code >= 500:
        return random.randint(500, 5000)
    elif status_code >= 400:
        return random.randint(50, 500)
    else:
        return random.randint(10, 1000)

def clear_existing_data(db: Session):
    """Clear existing data to start fresh"""
    print("Clearing existing data...")
    db.query(ExportJob).delete()
    db.query(ScheduledReport).delete()
    db.query(MLInsight).delete()
    db.query(APIKey).delete()
    db.query(Alert).delete()
    db.query(AlertRule).delete()
    db.query(AuditLog).delete()
    db.query(Dashboard).delete()
    db.query(APILog).delete()
    db.query(Metric).delete()
    db.query(User).delete()
    db.query(Organization).delete()
    db.commit()

def create_users(db: Session):
    """Create portfolio-quality users"""
    print("Creating users...")
    users = []
    for user_data in USERS_DATA:
        user = User(
            email=user_data["email"],
            password_hash=user_data["password"],
            name=user_data["name"],
            role=user_data["role"],
            plan=user_data["plan"],
            usage_percent=user_data["usage"],
            status="active"
        )
        users.append(user)
    db.add_all(users)
    db.commit()
    return users

def create_api_logs(db: Session, users: list):
    """Create comprehensive API logs for realistic analytics"""
    print("Creating API logs...")
    logs = []
    base_time = datetime.utcnow() - timedelta(days=30)

    # Generate 2000+ realistic API logs
    for day_offset in range(30):
        current_day = base_time + timedelta(days=day_offset)

        # Generate logs throughout the day
        for hour in range(24):
            timestamp = current_day.replace(hour=hour, minute=random.randint(0, 59), second=random.randint(0, 59))

            # More requests during business hours
            request_count = random.randint(15, 40) if 8 <= hour <= 18 else random.randint(3, 15)

            for _ in range(request_count):
                user = random.choice(users)
                endpoint = random.choice(API_ENDPOINTS)
                method = random.choice(HTTP_METHODS)
                status_code = random.choices(
                    list(STATUS_CODE_WEIGHTS.keys()),
                    weights=list(STATUS_CODE_WEIGHTS.values())
                )[0]
                response_time = generate_realistic_response_time(status_code)

                log = APILog(
                    user_id=user.id,
                    endpoint=endpoint,
                    method=method,
                    status_code=status_code,
                    response_time_ms=response_time,
                    request_id=f"req-{random.randint(10000, 99999)}",
                    timestamp=timestamp
                )
                logs.append(log)

    db.add_all(logs)
    db.commit()
    print(f"Created {len(logs)} API logs")
    return logs

def create_metrics(db: Session):
    """Create realistic metrics data"""
    print("Creating metrics...")
    metrics = []
    base_time = datetime.utcnow().date()

    metric_types = {
        "active_users": lambda: random.randint(500, 2500),
        "requests": lambda: random.randint(10000, 50000),
        "error_rate": lambda: round(random.uniform(0.5, 5.0), 2),
        "revenue": lambda: random.randint(5000, 25000),
        "response_time_avg": lambda: random.randint(50, 500),
        "cpu_usage": lambda: random.randint(20, 90),
        "memory_usage": lambda: random.randint(30, 85),
        "database_queries": lambda: random.randint(1000, 10000),
    }

    # Generate 30 days of metrics
    for i in range(30):
        date = base_time - timedelta(days=i)
        for metric_name, value_generator in metric_types.items():
            metric = Metric(
                metric_name=metric_name,
                metric_value=value_generator(),
                date=date
            )
            metrics.append(metric)

    db.add_all(metrics)
    db.commit()
    print(f"Created {len(metrics)} metrics")
    return metrics

def create_alert_rules(db: Session):
    """Create alert rules for monitoring"""
    print("Creating alert rules...")
    rules = [
        AlertRule(
            name="High Error Rate",
            metric_name="error_rate",
            operator=">",
            threshold=3.0,
            enabled=True,
            notification_channels=["email", "slack"]
        ),
        AlertRule(
            name="High Response Time",
            metric_name="response_time_avg",
            operator=">",
            threshold=500,
            enabled=True,
            notification_channels=["email", "dashboard"]
        ),
        AlertRule(
            name="Low Active Users",
            metric_name="active_users",
            operator="<",
            threshold=100,
            enabled=True,
            notification_channels=["email"]
        ),
        AlertRule(
            name="High CPU Usage",
            metric_name="cpu_usage",
            operator=">",
            threshold=80,
            enabled=True,
            notification_channels=["slack", "dashboard"]
        ),
        AlertRule(
            name="Memory Alert",
            metric_name="memory_usage",
            operator=">",
            threshold=85,
            enabled=True,
            notification_channels=["email", "slack"]
        ),
    ]
    db.add_all(rules)
    db.commit()

    # Create alert instances
    alerts = []
    for rule in rules:
        for i in range(random.randint(3, 8)):
            alert = Alert(
                alert_rule_id=rule.id,
                status=random.choice(["triggered", "acknowledged", "resolved"]),
                metric_value=rule.threshold + random.uniform(0.5, 50),
                message=f"{rule.name} - Threshold exceeded",
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
                acknowledged_at=datetime.utcnow() - timedelta(days=random.randint(0, 25)) if random.random() > 0.3 else None,
                resolved_at=datetime.utcnow() - timedelta(days=random.randint(0, 20)) if random.random() > 0.5 else None,
            )
            alerts.append(alert)

    db.add_all(alerts)
    db.commit()
    print(f"Created {len(rules)} alert rules and {len(alerts)} alerts")

def create_audit_logs(db: Session, users: list):
    """Create audit logs for compliance"""
    print("Creating audit logs...")
    audit_logs = []
    actions = [
        "create_user", "update_user", "delete_user", "login", "logout",
        "create_dashboard", "update_dashboard", "delete_dashboard",
        "create_alert", "update_alert", "delete_alert",
        "export_data", "download_report", "update_settings",
    ]
    resources = ["user", "dashboard", "alert_rule", "report", "export_job"]

    base_time = datetime.utcnow() - timedelta(days=30)

    for i in range(200):
        audit_log = AuditLog(
            user_id=random.choice(users).id if random.random() > 0.1 else None,
            action=random.choice(actions),
            resource_type=random.choice(resources),
            resource_id=random.randint(1, 100) if random.random() > 0.2 else None,
            status=random.choice(["success", "failure"]) if random.random() > 0.9 else "success",
            details={
                "change": random.choice(["name", "status", "configuration"]),
                "old_value": random.choice(["active", "inactive", "pending"]),
                "new_value": random.choice(["active", "inactive", "pending"]),
            },
            ip_address=f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
            created_at=base_time + timedelta(hours=random.randint(0, 720))
        )
        audit_logs.append(audit_log)

    db.add_all(audit_logs)
    db.commit()
    print(f"Created {len(audit_logs)} audit logs")

def create_dashboards(db: Session, users: list):
    """Create dashboards for users"""
    print("Creating dashboards...")
    dashboards = []
    dashboard_configs = [
        {"name": "Executive Summary", "widgets": ["kpi_cards", "trend_chart", "metric_gauge", "alert_status"]},
        {"name": "API Performance", "widgets": ["response_time_chart", "error_rate_chart", "endpoint_breakdown", "status_codes"]},
        {"name": "User Analytics", "widgets": ["active_users_chart", "user_growth", "plan_distribution", "engagement_metrics"]},
        {"name": "System Health", "widgets": ["cpu_chart", "memory_chart", "database_queries", "uptime_status"]},
        {"name": "Revenue Dashboard", "widgets": ["revenue_chart", "customer_churn", "mrr_breakdown", "ltv_analysis"]},
    ]

    for user in users:
        if user.role in ["admin", "analyst"]:
            for i, config in enumerate(dashboard_configs[:random.randint(2, 4)]):
                dashboard = Dashboard(
                    user_id=user.id,
                    name=config["name"],
                    description=f"Dashboard for {config['name'].lower()}",
                    is_default=i == 0,
                    layout=json.dumps({
                        "widgets": config["widgets"],
                        "refreshInterval": 30,
                        "theme": "light"
                    })
                )
                dashboards.append(dashboard)

    db.add_all(dashboards)
    db.commit()
    print(f"Created {len(dashboards)} dashboards")

def create_api_keys(db: Session, users: list):
    """Create API keys for users"""
    print("Creating API keys...")
    api_keys = []
    for user in users:
        if user.role in ["admin", "analyst"]:
            for i in range(random.randint(1, 3)):
                key_prefix = f"sk_{random.randint(100000, 999999)}"
                api_key = APIKey(
                    user_id=user.id,
                    key_prefix=key_prefix,
                    key_hash=f"sha256_{random.randint(10000000, 99999999)}",
                    name=f"{user.name}'s API Key {i+1}",
                    is_active=random.random() > 0.2,
                    last_used_at=datetime.utcnow() - timedelta(days=random.randint(0, 30)) if random.random() > 0.3 else None
                )
                api_keys.append(api_key)

    db.add_all(api_keys)
    db.commit()
    print(f"Created {len(api_keys)} API keys")

def create_ml_insights(db: Session, users: list):
    """Create ML insights"""
    print("Creating ML insights...")
    insights = []
    insight_types = ["anomaly", "forecast", "churn_prediction"]
    metrics = ["error_rate", "response_time_avg", "active_users", "revenue"]

    for user in users:
        for _ in range(random.randint(2, 6)):
            insight = MLInsight(
                user_id=user.id,
                insight_type=random.choice(insight_types),
                metric_name=random.choice(metrics),
                confidence_score=round(random.uniform(0.6, 0.99), 2),
                predicted_value=random.randint(100, 10000) if random.random() > 0.3 else None,
                actual_value=random.randint(100, 10000),
                insight_data={
                    "trend": random.choice(["up", "down", "stable"]),
                    "significance": random.choice(["low", "medium", "high"]),
                    "recommendation": "Monitor closely" if random.random() > 0.5 else "No action needed"
                },
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
            )
            insights.append(insight)

    db.add_all(insights)
    db.commit()
    print(f"Created {len(insights)} ML insights")

def create_scheduled_reports(db: Session, users: list):
    """Create scheduled reports"""
    print("Creating scheduled reports...")
    reports = []
    report_types = ["kpis", "users", "api_logs", "custom"]

    for user in users:
        if user.role in ["admin", "analyst"]:
            for _ in range(random.randint(1, 3)):
                schedule_type = random.choice(["daily", "weekly", "monthly"])
                report = ScheduledReport(
                    user_id=user.id,
                    name=f"{schedule_type.title()} {random.choice(report_types).title()} Report",
                    description=f"Automated {schedule_type} report",
                    report_type=random.choice(report_types),
                    filters={"date_range": "last_30_days"} if random.random() > 0.5 else None,
                    include_charts=True,
                    export_format=random.choice(["pdf", "csv"]),
                    schedule_type=schedule_type,
                    schedule_config={
                        "cron": "0 9 * * *" if schedule_type == "daily" else "0 9 * * 1",
                        "timezone": "UTC",
                        "next_run": (datetime.utcnow() + timedelta(days=1)).isoformat()
                    },
                    is_active=random.random() > 0.2,
                    recipient_emails=[user.email],
                    delivery_method="email",
                    last_run_at=datetime.utcnow() - timedelta(days=random.randint(0, 7)) if random.random() > 0.3 else None,
                    next_run_at=datetime.utcnow() + timedelta(days=random.randint(1, 7))
                )
                reports.append(report)

    db.add_all(reports)
    db.commit()
    print(f"Created {len(reports)} scheduled reports")

def create_export_jobs(db: Session, users: list):
    """Create export jobs"""
    print("Creating export jobs...")
    jobs = []
    statuses = ["completed", "pending", "processing", "failed"]
    job_types = ["users", "api_logs", "kpis", "custom"]

    for user in users:
        for _ in range(random.randint(1, 4)):
            status = random.choice(statuses)
            job = ExportJob(
                user_id=user.id,
                organization_id=random.randint(1, 4) if random.random() > 0.5 else None,
                job_type=random.choice(job_types),
                status=status,
                file_url=f"https://storage.example.com/exports/{random.randint(10000, 99999)}.csv" if status == "completed" else None,
                row_count=random.randint(100, 50000) if status == "completed" else 0,
                error_message="Processing failed" if status == "failed" else None,
                filters={"date_from": "2026-05-21", "date_to": "2026-06-21"} if random.random() > 0.5 else None,
                progress_percent=100.0 if status == "completed" else (0.0 if status == "pending" else random.randint(10, 90)),
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
                completed_at=datetime.utcnow() - timedelta(days=random.randint(0, 30)) if status == "completed" else None
            )
            jobs.append(job)

    db.add_all(jobs)
    db.commit()
    print(f"Created {len(jobs)} export jobs")

def create_organizations(db: Session, users: list):
    """Create organizations"""
    print("Creating organizations...")
    org_names = ["TechCorp Inc", "StartUp.io", "Enterprise Solutions LLC", "Cloud Systems Co"]

    organizations = []
    for org_name in org_names:
        org = Organization(
            name=org_name,
            slug=org_name.lower().replace(" ", "-").replace(".", ""),
            description=f"{org_name} - Providing analytics and insights",
            is_active=True
        )
        organizations.append(org)

    db.add_all(organizations)
    db.commit()
    print(f"Created {len(organizations)} organizations")

def generate_portfolio_data():
    """Main function to generate all portfolio data"""
    db = SessionLocal()
    try:
        print("=" * 60)
        print("GENERATING HIGH-QUALITY PORTFOLIO DATA")
        print("=" * 60)

        # Clear existing data
        clear_existing_data(db)

        # Create data in order
        users = create_users(db)
        create_organizations(db, users)
        create_api_logs(db, users)
        create_metrics(db)
        create_alert_rules(db)
        create_audit_logs(db, users)
        create_dashboards(db, users)
        create_api_keys(db, users)
        create_ml_insights(db, users)
        create_scheduled_reports(db, users)
        create_export_jobs(db, users)

        print("=" * 60)
        print("✓ Portfolio data generation complete!")
        print("=" * 60)
        print("\nYour application is now filled with realistic, high-quality")
        print("demonstration data suitable for portfolio presentation.")

    except Exception as e:
        print(f"Error generating data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    generate_portfolio_data()
