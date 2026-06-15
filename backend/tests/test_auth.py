"""Authentication endpoint tests"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_login_success():
    """Test successful login"""
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "admin123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "admin@example.com"
    assert data["user"]["role"] == "admin"


def test_login_invalid_password():
    """Test login with invalid password"""
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    data = response.json()
    assert "detail" in data


def test_login_nonexistent_user():
    """Test login with nonexistent email"""
    response = client.post(
        "/api/auth/login",
        json={"email": "nonexistent@example.com", "password": "password"}
    )
    assert response.status_code == 401


def test_logout():
    """Test logout endpoint"""
    response = client.post("/api/auth/logout")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data


def test_login_analyst():
    """Test login with analyst credentials"""
    response = client.post(
        "/api/auth/login",
        json={"email": "analyst@example.com", "password": "analyst123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "analyst"


def test_login_viewer():
    """Test login with viewer credentials"""
    response = client.post(
        "/api/auth/login",
        json={"email": "viewer@example.com", "password": "viewer123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "viewer"
