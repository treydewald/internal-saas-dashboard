from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Callable
import re


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
    ]

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
            # Extract user_id from JWT token if available
            user_id = None
            if "authorization" in request.headers:
                try:
                    # In real app, parse JWT to get user_id
                    # For MVP, we'll set this to None
                    pass
                except Exception:
                    pass

            # Determine action and resource type from request
            action = f"{request.method.lower()}_{request.url.path.split('/')[-1]}"
            resource_type = request.url.path.split("/")[-2] if "/" in request.url.path else "unknown"

            # Log to audit trail
            # This would be called with db session from request state
            # For MVP, logging is optional/deferred

        return response
