from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Callable
import re
from app.core.database import SessionLocal
from app.core.jwt_utils import decode_token
from app.services.audit_service import AuditService


class AuditMiddleware(BaseHTTPMiddleware):
    """
    Middleware to automatically log important actions to the audit trail.
    Logs POST, PUT, DELETE requests to protected resources.
    """

    # Pattern to detect important routes to audit
    AUDIT_PATTERNS = [
        (r"^/api/users/?.*", ["POST", "PUT", "DELETE"]),
        (r"^/api/alerts/?.*", ["POST", "PUT", "DELETE"]),
        (r"^/api/api-keys/?.*", ["POST", "DELETE"]),
        (r"^/api/reports/?.*", ["POST", "PUT", "DELETE"]),
        (r"^/api/exports/?.*", ["POST", "DELETE"]),
        (r"^/api/dashboards/?.*", ["POST", "PUT", "DELETE"]),
        (r"^/api/organizations/?.*", ["POST", "PUT", "DELETE"]),
    ]

    @staticmethod
    def _extract_user_id(request: Request) -> int | None:
        authorization = request.headers.get("authorization")
        if not authorization or not authorization.startswith("Bearer "):
            return None

        token = authorization.split(" ", 1)[1]
        payload = decode_token(token)
        if not payload:
            return None

        return payload.get("user_id")

    @staticmethod
    def _build_action(request: Request) -> tuple[str, str, int | None]:
        segments = [segment for segment in request.url.path.split("/") if segment]
        resource_segments = segments[1:] if segments and segments[0] == "api" else segments

        resource_type = resource_segments[0] if resource_segments else "unknown"
        resource_id = None
        action_name = request.method.lower()

        if resource_segments:
            last_segment = resource_segments[-1]
            if last_segment.isdigit():
                resource_id = int(last_segment)
            elif last_segment not in {resource_type, "rules"}:
                action_name = f"{action_name}_{last_segment.replace('-', '_')}"

            if len(resource_segments) > 1 and resource_segments[1] == "rules":
                resource_type = "alert_rules"

        return action_name, resource_type, resource_id

    async def dispatch(self, request: Request, call_next: Callable):
        response = await call_next(request)

        # Skip GET requests and non-protected routes
        if request.method == "GET":
            return response

        # Check if this route should be audited
        should_audit = any(
            re.match(pattern, request.url.path) and request.method in methods
            for pattern, methods in self.AUDIT_PATTERNS
        )

        if should_audit and response.status_code < 400:
            user_id = self._extract_user_id(request)
            action, resource_type, resource_id = self._build_action(request)

            db = SessionLocal()
            try:
                AuditService.log_action(
                    db=db,
                    user_id=user_id,
                    action=action,
                    resource_type=resource_type,
                    resource_id=resource_id,
                    status="success",
                    details={
                        "path": request.url.path,
                        "method": request.method,
                        "status_code": response.status_code,
                    },
                    ip_address=request.client.host if request.client else None,
                )
            finally:
                db.close()

        return response
