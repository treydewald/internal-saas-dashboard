"""API logs endpoint tests"""
import pytest
from fastapi.testclient import TestClient
from main import app
from app.core.database import SessionLocal
from app.services.api_log_service import APILogService
from tests.conftest import get_auth_headers

client = TestClient(app)


def get_analyst_token(client_instance=None):
    """Get analyst token for testing"""
    _client = client_instance or client
    response = _client.post(
        "/api/auth/login",
        json={"email": "analyst@example.com", "password": "analyst_pass"}
    )
    return response.json().get("access_token") if response.status_code == 200 else None


@pytest.fixture
def db():
    """Get database session for tests"""
    return SessionLocal()


def test_get_api_logs_empty(db, client):
    """Test getting API logs when none exist"""
    token = get_analyst_token(client)
    response = client.get("/api/api-logs", headers=get_auth_headers(token))
    assert response.status_code == 200
    data = response.json()
    assert "logs" in data
    assert "total_count" in data
    assert isinstance(data["logs"], list)


def test_create_and_get_api_log(db, client):
    """Test creating and retrieving API logs"""
    token = get_analyst_token(client)
    # Create some test logs
    APILogService.create_log(
        db,
        endpoint="/api/users",
        method="GET",
        status_code=200,
        response_time_ms=45,
        user_id=1,
    )
    APILogService.create_log(
        db,
        endpoint="/api/users",
        method="POST",
        status_code=201,
        response_time_ms=120,
        user_id=1,
    )
    APILogService.create_log(
        db,
        endpoint="/api/auth/login",
        method="POST",
        status_code=401,
        response_time_ms=30,
    )

    # Get logs
    response = client.get("/api/api-logs", headers=get_auth_headers(token))
    assert response.status_code == 200
    data = response.json()
    assert data["total_count"] >= 3
    assert len(data["logs"]) > 0


def test_get_api_logs_pagination(db, client):
    """Test API logs pagination"""
    token = get_analyst_token(client)
    response = client.get("/api/api-logs?limit=10&skip=0", headers=get_auth_headers(token))
    assert response.status_code == 200
    data = response.json()
    assert len(data["logs"]) <= 10
    assert isinstance(data["total_count"], int)


def test_get_api_logs_filter_by_status_code(db, client):
    """Test filtering API logs by status code"""
    token = get_analyst_token(client)
    # Create logs with different status codes
    APILogService.create_log(
        db, "/api/test", "GET", 200, 10, user_id=1
    )
    APILogService.create_log(
        db, "/api/test", "GET", 500, 50, user_id=1
    )

    response = client.get("/api/api-logs?status_code=200", headers=get_auth_headers(token))
    assert response.status_code == 200
    data = response.json()
    for log in data["logs"]:
        assert log["status_code"] == 200


def test_get_api_logs_filter_by_endpoint(db, client):
    """Test filtering API logs by endpoint"""
    token = get_analyst_token(client)
    # Create logs with different endpoints
    APILogService.create_log(
        db, "/api/users", "GET", 200, 10, user_id=1
    )
    APILogService.create_log(
        db, "/api/analytics", "GET", 200, 15, user_id=1
    )

    response = client.get("/api/api-logs?endpoint=users", headers=get_auth_headers(token))
    assert response.status_code == 200
    data = response.json()
    for log in data["logs"]:
        assert "users" in log["endpoint"]


def test_get_api_logs_sorted_by_timestamp_desc(db, client):
    """Test API logs sorted by timestamp descending"""
    token = get_analyst_token(client)
    # Create multiple logs (should be created with different timestamps)
    APILogService.create_log(
        db, "/api/test1", "GET", 200, 10, user_id=1
    )
    APILogService.create_log(
        db, "/api/test2", "GET", 200, 20, user_id=1
    )
    APILogService.create_log(
        db, "/api/test3", "GET", 200, 30, user_id=1
    )

    response = client.get("/api/api-logs", headers=get_auth_headers(token))
    assert response.status_code == 200
    data = response.json()

    # Check if logs are sorted by timestamp descending
    if len(data["logs"]) > 1:
        for i in range(len(data["logs"]) - 1):
            # Each subsequent log should have an earlier or equal timestamp
            current_timestamp = data["logs"][i]["timestamp"]
            next_timestamp = data["logs"][i + 1]["timestamp"]
            assert current_timestamp >= next_timestamp


def test_api_logs_response_format(db, client):
    """Test API logs response format"""
    token = get_analyst_token(client)
    APILogService.create_log(
        db,
        endpoint="/api/test",
        method="GET",
        status_code=200,
        response_time_ms=42,
        user_id=1,
        request_id="req-123",
    )

    response = client.get("/api/api-logs?limit=1", headers=get_auth_headers(token))
    assert response.status_code == 200
    data = response.json()
    assert len(data["logs"]) > 0

    log = data["logs"][0]
    assert "id" in log
    assert "timestamp" in log
    assert "endpoint" in log
    assert "method" in log
    assert "status_code" in log
    assert "response_time_ms" in log
    assert isinstance(log["response_time_ms"], int)


def test_api_logs_response_time_range(db, client):
    """Test API logs with different response times"""
    token = get_analyst_token(client)
    APILogService.create_log(
        db, "/api/fast", "GET", 200, 5, user_id=1
    )
    APILogService.create_log(
        db, "/api/slow", "GET", 200, 1500, user_id=1
    )

    response = client.get("/api/api-logs", headers=get_auth_headers(token))
    assert response.status_code == 200
    data = response.json()

    response_times = [log["response_time_ms"] for log in data["logs"]]
    assert any(rt < 100 for rt in response_times), "Should have fast logs"
    assert any(rt > 1000 for rt in response_times), "Should have slow logs"
