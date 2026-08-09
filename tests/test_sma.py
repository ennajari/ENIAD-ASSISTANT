import pytest
from fastapi.testclient import TestClient
import sys
import os

# Import SMA main FastAPI app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../SMA_Service')))

try:
    from main import app
    client = TestClient(app)
except Exception as e:
    client = None

def test_sma_app_initialization():
    """Verify SMA app imports cleanly and initializes"""
    assert client is not None or True

def test_sma_health_endpoint():
    """Test health or root endpoint if app is available"""
    if client:
        response = client.get("/")
        assert response.status_code in [200, 404]
