"""User CRUD endpoint tests"""
import pytest
import uuid
from fastapi.testclient import TestClient
from main import app
from tests.conftest import get_auth_headers

client = TestClient(app)


def get_unique_email(base: str = "user") -> str:
    """Generate a unique email address"""
    return f"{base}_{uuid.uuid4().hex[:8]}@example.com"


def get_admin_token(client_instance=None):
    """Get admin token for testing"""
    _client = client_instance or client
    response = _client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "admin_pass"}
    )
    return response.json().get("access_token") if response.status_code == 200 else None


def test_create_user(client):
    """Test creating a new user"""
    admin_token = get_admin_token(client)
    email = get_unique_email("newuser")
    response = client.post(
        "/api/users",
        json={
            "email": email,
            "name": "New User",
            "password": "password123",
            "role": "analyst",
            "plan": "pro",
            "status": "active",
        },
        headers=get_auth_headers(admin_token)
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == email
    assert data["name"] == "New User"
    assert data["role"] == "analyst"
    assert data["plan"] == "pro"
    assert "password_hash" not in data


def test_create_user_duplicate_email(client):
    """Test creating user with duplicate email"""
    admin_token = get_admin_token(client)
    email = get_unique_email("duplicate")
    # First user
    client.post(
        "/api/users",
        json={
            "email": email,
            "name": "User 1",
            "password": "password123",
        },
        headers=get_auth_headers(admin_token)
    )
    # Second user with same email
    response = client.post(
        "/api/users",
        json={
            "email": email,
            "name": "User 2",
            "password": "password123",
        },
        headers=get_auth_headers(admin_token)
    )
    assert response.status_code == 409
    data = response.json()
    assert "detail" in data


def test_create_user_weak_password(client):
    """Test creating user with weak password"""
    admin_token = get_admin_token(client)
    response = client.post(
        "/api/users",
        json={
            "email": get_unique_email("weakpwd"),
            "name": "User",
            "password": "short",
        },
        headers=get_auth_headers(admin_token)
    )
    assert response.status_code == 422


def test_list_users(client):
    """Test listing users"""
    admin_token = get_admin_token(client)
    # Create test users
    client.post(
        "/api/users",
        json={
            "email": get_unique_email("user1"),
            "name": "User One",
            "password": "password123",
            "plan": "free",
        },
        headers=get_auth_headers(admin_token)
    )
    client.post(
        "/api/users",
        json={
            "email": get_unique_email("user2"),
            "name": "User Two",
            "password": "password123",
            "plan": "pro",
        },
        headers=get_auth_headers(admin_token)
    )

    response = client.get("/api/users", headers=get_auth_headers(admin_token))
    assert response.status_code == 200
    data = response.json()
    assert "users" in data
    assert "total_count" in data
    assert data["total_count"] >= 2


def test_list_users_pagination(client):
    """Test user pagination"""
    admin_token = get_admin_token(client)
    response = client.get("/api/users?limit=10&skip=0", headers=get_auth_headers(admin_token))
    assert response.status_code == 200
    data = response.json()
    assert len(data["users"]) <= 10


def test_list_users_filter_by_plan(client):
    """Test filtering users by plan"""
    admin_token = get_admin_token(client)
    response = client.get("/api/users?plan=pro", headers=get_auth_headers(admin_token))
    assert response.status_code == 200
    data = response.json()
    for user in data["users"]:
        assert user["plan"] == "pro"


def test_list_users_search(client):
    """Test searching users by email/name"""
    admin_token = get_admin_token(client)
    # Create a test user
    search_email = get_unique_email("searchme")
    client.post(
        "/api/users",
        json={
            "email": search_email,
            "name": "Search User",
            "password": "password123",
        },
        headers=get_auth_headers(admin_token)
    )

    response = client.get(f"/api/users?search=searchme", headers=get_auth_headers(admin_token))
    assert response.status_code == 200
    data = response.json()
    assert any(u["email"] == search_email for u in data["users"])


def test_get_user(client):
    """Test getting single user by ID"""
    admin_token = get_admin_token(client)
    # Create a user
    create_response = client.post(
        "/api/users",
        json={
            "email": get_unique_email("getme"),
            "name": "Get User",
            "password": "password123",
        },
        headers=get_auth_headers(admin_token)
    )
    user_id = create_response.json()["id"]

    # Get user
    response = client.get(f"/api/users/{user_id}", headers=get_auth_headers(admin_token))
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert "@example.com" in data["email"]


def test_get_user_not_found(client):
    """Test getting nonexistent user"""
    admin_token = get_admin_token(client)
    response = client.get("/api/users/99999", headers=get_auth_headers(admin_token))
    assert response.status_code == 404


def test_update_user(client):
    """Test updating user"""
    admin_token = get_admin_token(client)
    # Create a user
    create_response = client.post(
        "/api/users",
        json={
            "email": get_unique_email("updateme"),
            "name": "Update User",
            "password": "password123",
            "plan": "free",
        },
        headers=get_auth_headers(admin_token)
    )
    user_id = create_response.json()["id"]

    # Update user
    response = client.put(
        f"/api/users/{user_id}",
        json={
            "name": "Updated User",
            "plan": "pro",
            "status": "inactive",
        },
        headers=get_auth_headers(admin_token)
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated User"
    assert data["plan"] == "pro"
    assert data["status"] == "inactive"


def test_update_user_not_found(client):
    """Test updating nonexistent user"""
    admin_token = get_admin_token(client)
    response = client.put(
        "/api/users/99999",
        json={"name": "Updated"},
        headers=get_auth_headers(admin_token)
    )
    assert response.status_code == 404


def test_delete_user(client):
    """Test deleting (soft delete) user"""
    admin_token = get_admin_token(client)
    # Create a user
    create_response = client.post(
        "/api/users",
        json={
            "email": get_unique_email("deleteme"),
            "name": "Delete User",
            "password": "password123",
        },
        headers=get_auth_headers(admin_token)
    )
    user_id = create_response.json()["id"]

    # Delete user
    response = client.delete(f"/api/users/{user_id}", headers=get_auth_headers(admin_token))
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "inactive"

    # Verify user is still retrievable but inactive
    get_response = client.get(f"/api/users/{user_id}", headers=get_auth_headers(admin_token))
    assert get_response.status_code == 200
    assert get_response.json()["status"] == "inactive"


def test_delete_user_not_found(client):
    """Test deleting nonexistent user"""
    admin_token = get_admin_token(client)
    response = client.delete("/api/users/99999", headers=get_auth_headers(admin_token))
    assert response.status_code == 404
