"""Rate limiter utility for API key-based rate limiting"""
from datetime import datetime, timedelta
from typing import Optional
import time

# In-memory rate limit storage: {api_key: [(timestamp, count), ...]}
# In production, use Redis for distributed rate limiting
_rate_limit_store = {}


class RateLimiter:
    """Simple in-memory rate limiter for API keys"""

    def __init__(self, requests_per_minute: int = 60):
        """Initialize rate limiter"""
        self.requests_per_minute = requests_per_minute
        self.window_seconds = 60

    def is_allowed(self, api_key: str) -> bool:
        """Check if API key is within rate limit"""
        now = time.time()
        window_start = now - self.window_seconds

        # Initialize if key not in store
        if api_key not in _rate_limit_store:
            _rate_limit_store[api_key] = []

        # Remove old entries outside the window
        _rate_limit_store[api_key] = [
            ts for ts in _rate_limit_store[api_key] if ts > window_start
        ]

        # Check if within limit
        if len(_rate_limit_store[api_key]) < self.requests_per_minute:
            _rate_limit_store[api_key].append(now)
            return True

        return False

    def get_remaining(self, api_key: str) -> int:
        """Get remaining requests for API key in current window"""
        now = time.time()
        window_start = now - self.window_seconds

        if api_key not in _rate_limit_store:
            return self.requests_per_minute

        # Count requests in window
        requests_in_window = sum(
            1 for ts in _rate_limit_store[api_key] if ts > window_start
        )

        return max(0, self.requests_per_minute - requests_in_window)

    def get_reset_time(self, api_key: str) -> Optional[int]:
        """Get Unix timestamp when rate limit resets"""
        if api_key not in _rate_limit_store or not _rate_limit_store[api_key]:
            return None

        oldest_request = min(_rate_limit_store[api_key])
        reset_time = oldest_request + self.window_seconds
        return int(reset_time)


def cleanup_rate_limit_store():
    """Cleanup old entries from rate limit store (call periodically)"""
    now = time.time()
    window_start = now - 3600  # Keep 1 hour of data

    for api_key in list(_rate_limit_store.keys()):
        _rate_limit_store[api_key] = [
            ts for ts in _rate_limit_store[api_key] if ts > window_start
        ]
        if not _rate_limit_store[api_key]:
            del _rate_limit_store[api_key]
