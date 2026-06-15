import smtplib
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate
from email import encoders
from typing import List, Optional
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Email delivery service for scheduled reports."""

    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "localhost")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.sender_email = os.getenv("SENDER_EMAIL", "noreply@dashboard.local")
        self.sender_password = os.getenv("SENDER_PASSWORD", "")
        self.use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"

    def send_report(
        self,
        recipient_emails: List[str],
        subject: str,
        body: str,
        attachment_path: Optional[str] = None,
        attachment_filename: Optional[str] = None,
    ) -> bool:
        """
        Send report via email with optional attachment.

        Args:
            recipient_emails: List of email addresses
            subject: Email subject
            body: Email body text
            attachment_path: Path to file to attach
            attachment_filename: Filename for attachment

        Returns:
            True if sent successfully, False otherwise
        """
        try:
            # Create message
            msg = MIMEMultipart()
            msg["From"] = self.sender_email
            msg["To"] = ", ".join(recipient_emails)
            msg["Date"] = formatdate(localtime=True)
            msg["Subject"] = subject

            # Add body
            msg.attach(MIMEText(body, "plain"))

            # Add attachment if provided
            if attachment_path and attachment_filename and os.path.exists(attachment_path):
                self._attach_file(msg, attachment_path, attachment_filename)

            # Send email
            if self.use_tls:
                with smtplib.SMTP(self.smtp_server, self.smtp_port, timeout=10) as server:
                    server.starttls()
                    if self.sender_password:
                        server.login(self.sender_email, self.sender_password)
                    server.send_message(msg)
            else:
                with smtplib.SMTP(self.smtp_server, self.smtp_port, timeout=10) as server:
                    if self.sender_password:
                        server.login(self.sender_email, self.sender_password)
                    server.send_message(msg)

            return True

        except Exception as e:
            logger.error(f"Error sending email to {recipient_emails}: {str(e)}", exc_info=True)
            return False

    def _attach_file(self, msg: MIMEMultipart, filepath: str, filename: str) -> None:
        """Attach a file to email message."""
        try:
            with open(filepath, "rb") as attachment:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header(
                    "Content-Disposition",
                    f"attachment; filename= {filename}",
                )
                msg.attach(part)
        except Exception as e:
            logger.error(f"Error attaching file {filepath}: {str(e)}", exc_info=True)

    @staticmethod
    def generate_report_email_body(
        report_name: str,
        report_type: str,
        generated_at: datetime,
        recipient_name: Optional[str] = None,
    ) -> str:
        """Generate a professional email body for scheduled report."""
        greeting = f"Hi {recipient_name}," if recipient_name else "Hi,"
        timestamp = generated_at.strftime("%Y-%m-%d %H:%M:%S UTC")

        body = f"""{greeting}

Your scheduled report has been generated and is attached.

Report Details:
- Report Name: {report_name}
- Report Type: {report_type}
- Generated At: {timestamp}

Please review the attached file for the full report data.

If you have any questions or need to modify the report schedule,
please contact your administrator.

Best regards,
Dashboard Team
"""
        return body
