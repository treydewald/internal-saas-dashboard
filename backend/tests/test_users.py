"""User CRUD endpoint tests"""
import pytest
import uuid
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def get_unique_email(base: str = "user") -> str:
    """Generate a unique email address"""
    return f"{base}_{uuid.uuid4().hex[:8]}@example.com"


def test_create_user():
    """Test creating a new user"""
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
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == email
    assert data["name"] == "New User"
    assert data["role"] == "analyst"
    assert data["plan"] == "pro"
    assert "password_hash" not in data


def test_create_user_duplicate_email():
    """Test creating user with duplicate email"""
    email = get_unique_email("duplicate")
    # First user
    client.post(
        "/api/users",
        json={
            "email": email,
            "name": "User 1",
            "password": "password123",
        }
    )
    # Second user with same email
    response = client.post(
        "/api/users",
        json={
            "email": email,
            "name": "User 2",
            "password": "password123",
        }
    )
    assert response.status_code == 409
    data = response.json()
    assert "detail" in data


def test_create_user_weak_password():
    """Test creating user with weak password"""
    response = client.post(
        "/api/users",
        json={
            "email": get_unique_email("weakpwd"),
            "name": "User",
            "password": "short",
        }
    )
    assert response.status_code == 422


def test_list_users():
    """Test listing users"""
    # Create test users
    client.post(
        "/api/users",
        json={
            "email": get_unique_email("user1"),
            "name": "User One",
            "password": "password123",
            "plan": "free",
        }
    )
    client.post(
        "/api/users",
        json={
            "email": get_unique_email("user2"),
            "name": "User Two",
            "password": "password123",
            "plan": "pro",
        }
    )

    response = client.get("/api/users")
    assert response.status_code == 200
    data = response.json()
    assert "users" in data
    assert "total_count" in data
    assert data["total_count"] >= 2


def test_list_users_pagination():
    """Test user pagination"""
    response = client.get("/api/users?limit=10&skip=0")
    assert response.status_code == 200
    data = response.json()
    assert len(data["users"]) <= 10


def test_list_users_filter_by_plan():
    """Test filtering users by plan"""
    response = client.get("/api/users?plan=pro")
    assert response.status_code == 200
    data = response.json()
    for user in data["users"]:
        assert user["plan"] == "pro"


def test_list_users_search():
    """Test searching users by email/name"""
    # Create a test user
    search_email = get_unique_email("searchme")
    client.post(
        "/api/users",
        json={
            "email": search_email,
            "name": "Search User",
            "password": "password123",
        }
    )

    response = client.get(f"/api/users?search=searchme")
    assert response.status_code == 200
    data = response.json()
    assert any(u["email"] == search_email for u in data["users"])


def test_get_user():
    """Test getting single user by ID"""
    # Create a user
    create_response = client.post(
        "/api/users",
        json={
            "email": get_unique_email("getme"),
            "name": "Get User",
            "password": "password123",
        }
    )
    user_id = create_response.json()["id"]

    # Get user
    response = client.get(f"/api/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert "@example.com" in data["email"]


def test_get_user_not_found():
    """Test getting nonexistent user"""
    response = client.get("/api/users/99999")
    assert response.status_code == 404


def test_update_user():
    """Test updating user"""
    # Create a user
    create_response = client.post(
        "/api/users",
        json={
            "email": get_unique_email("updateme"),
            "name": "Update User",
            "password": "password123",
            "plan": "free",
        }
    )
    user_id = create_response.json()["id"]

    # Update user
    response = client.put(
        f"/api/users/{user_id}",
        json={
            "name": "Updated User",
            "plan": "pro",
            "status": "inactive",
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated User"
    assert data["plan"] == "pro"
    assert data["status"] == "inactive"


def test_update_user_not_found():
    """Test updating nonexistent user"""
    response = client.put(
        "/api/users/99999",
        json={"name": "Updated"}
    )
    assert response.status_code == 404


def test_delete_user():
    """Test deleting (soft delete) user"""
    # Create a user
    create_response = client.post(
        "/api/users",
        json={
            "email": get_unique_email("deleteme"),
            "name": "Delete User",
            "password": "password123",
        }
    )
    user_id = create_response.json()["id"]

    # Delete user
    response = client.delete(f"/api/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "inactive"

    # Verify user is still retrievable but inactive
    get_response = client.get(f"/api/users/{user_id}")
    assert get_response.status_code == 200
    assert get_response.json()["status"] == "inactive"


def test_delete_user_not_found():
    """Test deleting nonexistent user"""
    response = client.delete("/api/users/99999")
    assert response.status_code == 404
