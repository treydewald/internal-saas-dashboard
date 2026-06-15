"""Analytics endpoint tests"""
import pytest
from fastapi.testclient import TestClient
from main import app
from tests.conftest import get_auth_headers

client = TestClient(app)


def test_get_kpis_authenticated(auth_token_admin):
    """Test getting KPIs with authentication"""
    headers = get_auth_headers(auth_token_admin)
    response = client.get("/api/analytics/kpis", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert isinstance(data["kpis"], list)
    assert len(data["kpis"]) == 4  # Should have 4 KPIs

    # Check KPI structure
    for kpi in data["kpis"]:
        assert "name" in kpi
        assert "value" in kpi
        assert kpi["name"] in ["Active Users", "API Requests", "Error Rate", "Revenue"]


def test_get_kpis_as_analyst(auth_token_analyst):
    """Test KPI access as analyst"""
    headers = get_auth_headers(auth_token_analyst)
    response = client.get("/api/analytics/kpis", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data


def test_get_kpis_as_viewer(auth_token_viewer):
    """Test KPI access as viewer"""
    headers = get_auth_headers(auth_token_viewer)
    response = client.get("/api/analytics/kpis", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data


def test_get_kpis_unauthenticated():
    """Test KPI access without authentication"""
    response = client.get("/api/analytics/kpis")
    assert response.status_code == 401
