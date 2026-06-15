"""Tests for WebSocket real-time data streaming"""
import pytest
import json
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    """Get test client"""
    return TestClient(app)


def test_websocket_status_endpoint(client):
    """Test WebSocket status endpoint returns server info"""
    response = client.get("/ws/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "active"
    assert "active_connections" in data
    assert data["real_time_enabled"] is True


def test_websocket_connection_with_user_id(client):
    """Test WebSocket connection with user_id parameter"""
    with client.websocket_connect("/ws/connect?user_id=test_user_123") as websocket:
        # Receive connection confirmation
        data = websocket.receive_json()
        assert data["type"] == "connection_status"
        assert data["data"]["status"] == "connected"
        assert data["data"]["user_id"] == "test_user_123"


def test_websocket_connection_without_user_id(client):
    """Test WebSocket connection without user_id parameter"""
    with client.websocket_connect("/ws/connect") as websocket:
        # Receive connection confirmation
        data = websocket.receive_json()
        assert data["type"] == "connection_status"
        assert data["data"]["status"] == "connected"
        assert data["data"]["user_id"] is None


def test_websocket_client_message_acknowledgment(client):
    """Test that server acknowledges client messages"""
    with client.websocket_connect("/ws/connect?user_id=test_user") as websocket:
        # Skip connection status message
        websocket.receive_json()

        # Send a message
        websocket.send_text("ping")

        # Receive acknowledgment
        data = websocket.receive_json()
        assert data["type"] == "ack"
        assert data["data"]["message"] == "Message received"


def test_websocket_disconnection(client):
    """Test WebSocket disconnection handling"""
    with client.websocket_connect("/ws/connect?user_id=test_user") as websocket:
        # Receive connection confirmation
        data = websocket.receive_json()
        assert data["type"] == "connection_status"

        # Connection closes gracefully without errors
        # (just checking that disconnect doesn't raise exceptions)


def test_multiple_websocket_connections(client):
    """Test multiple simultaneous WebSocket connections"""
    with client.websocket_connect("/ws/connect?user_id=user1") as ws1:
        with client.websocket_connect("/ws/connect?user_id=user2") as ws2:
            # Both connections should receive connection status
            data1 = ws1.receive_json()
            data2 = ws2.receive_json()

            assert data1["type"] == "connection_status"
            assert data2["type"] == "connection_status"
            assert data1["data"]["user_id"] == "user1"
            assert data2["data"]["user_id"] == "user2"


def test_websocket_status_shows_connection_count(client):
    """Test that WebSocket status endpoint reflects active connections"""
    # Check initial status
    response1 = client.get("/ws/status")
    initial_count = response1.json()["active_connections"]

    # Open a connection
    with client.websocket_connect("/ws/connect?user_id=test_user"):
        # Check status during connection
        response2 = client.get("/ws/status")
        during_count = response2.json()["active_connections"]

        # Should have one more connection
        assert during_count == initial_count + 1

    # Check status after disconnection
    response3 = client.get("/ws/status")
    after_count = response3.json()["active_connections"]

    # Should be back to initial count
    assert after_count == initial_count
