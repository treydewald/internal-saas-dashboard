"""Pytest configuration and fixtures"""
import pytest
import os
from fastapi.testclient import TestClient
from main import app
from app.database.init_db import init_db


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Initialize test database before running tests"""
    # Set test database
    os.environ["DATABASE_URL"] = "sqlite:///./test.db"

    # Initialize database
    init_db()

    yield

    # Cleanup
    if os.path.exists("./test.db"):
        os.remove("./test.db")


@pytest.fixture
def client():
    """Get authenticated test client"""
    return TestClient(app)


@pytest.fixture
def auth_token_admin(client):
    """Get admin authentication token"""
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "admin123"}
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    return None


@pytest.fixture
def auth_token_analyst(client):
    """Get analyst authentication token"""
    response = client.post(
        "/api/auth/login",
        json={"email": "analyst@example.com", "password": "analyst123"}
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    return None


@pytest.fixture
def auth_token_viewer(client):
    """Get viewer authentication token"""
    response = client.post(
        "/api/auth/login",
        json={"email": "viewer@example.com", "password": "viewer123"}
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    return None


def get_auth_headers(token: str) -> dict:
    """Get authorization headers with token"""
    return {"Authorization": f"Bearer {token}"} if token else {}
