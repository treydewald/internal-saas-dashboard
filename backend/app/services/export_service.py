from datetime import datetime
from typing import List, Dict, Any
from app.utils.csv_utils import generate_csv
from app.utils.pdf_utils import generate_pdf_content


class ExportService:
    """Service for generating CSV and PDF exports."""

    @staticmethod
    def export_to_csv(headers: List[str], rows: List[Dict[str, Any]], filename: str = None) -> tuple:
        """
        Export data to CSV format.
        Returns (content, filename, media_type)
        """
        if not filename:
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            filename = f"export_{timestamp}.csv"

        content = generate_csv(headers, rows)
        return content, filename, "text/csv"

    @staticmethod
    def export_to_pdf(title: str, headers: List[str], rows: List[Dict[str, Any]], filename: str = None) -> tuple:
        """
        Export data to PDF format.
        Returns (content_bytes, filename, media_type)
        """
        if not filename:
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            filename = f"export_{timestamp}.pdf"

        content = generate_pdf_content(title, headers, rows)
        return content, filename, "application/pdf"

    @staticmethod
    def prepare_kpi_export(kpis: List[Dict[str, Any]]) -> tuple:
        """Prepare KPI data for export."""
        headers = ["Metric", "Value", "Unit", "Trend"]
        rows = []
        for kpi in kpis:
            row = {
                "Metric": kpi.get("name", ""),
                "Value": kpi.get("value", ""),
                "Unit": kpi.get("unit", ""),
                "Trend": kpi.get("trend", {}).get("percent", ""),
            }
            rows.append(row)
        return headers, rows

    @staticmethod
    def prepare_users_export(users: List[Dict[str, Any]]) -> tuple:
        """Prepare users data for export."""
        headers = ["Name", "Email", "Plan", "Usage %", "Status", "Created"]
        rows = []
        for user in users:
            row = {
                "Name": user.get("name", ""),
                "Email": user.get("email", ""),
                "Plan": user.get("plan", ""),
                "Usage %": user.get("usage_percent", ""),
                "Status": user.get("status", ""),
                "Created": user.get("created_at", ""),
            }
            rows.append(row)
        return headers, rows

    @staticmethod
    def prepare_api_logs_export(logs: List[Dict[str, Any]]) -> tuple:
        """Prepare API logs data for export."""
        headers = ["Timestamp", "Endpoint", "Method", "Status", "Response Time (ms)"]
        rows = []
        for log in logs:
            row = {
                "Timestamp": log.get("timestamp", ""),
                "Endpoint": log.get("endpoint", ""),
                "Method": log.get("method", ""),
                "Status": log.get("status_code", ""),
                "Response Time (ms)": log.get("response_time_ms", ""),
            }
            rows.append(row)
        return headers, rows
