"""Pytest configuration and fixtures"""
import pytest
import os
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
