"""
Advanced Unit & Integration Tests for SMA Multi-Agent Service
"""

import pytest
import os
import sys
import importlib.util
from pathlib import Path
from fastapi.testclient import TestClient

sma_main_path = Path(__file__).parent.parent / "services" / "sma-service" / "main.py"
spec = importlib.util.spec_from_file_location("sma_main", sma_main_path)
sma_module = importlib.util.module_from_spec(spec)
sys.modules["sma_main"] = sma_module
spec.loader.exec_module(sma_module)

app = sma_module.app
WebScraperAgent = sma_module.WebScraperAgent
client = TestClient(app)

def test_sma_status_endpoint():
    """Test root status endpoint for SMA service"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "ENIAD SMA Service"
    assert data["status"] == "operational"

def test_web_scraper_agent_initialization():
    """Test WebScraperAgent headers and session setup"""
    agent = WebScraperAgent()
    assert "User-Agent" in agent.session.headers
    assert "Mozilla" in agent.session.headers["User-Agent"]

def test_sma_intelligent_query_valid_structure():
    """Test intelligent query response format"""
    response = client.post("/sma/intelligent-query", json={
        "query": "concours recrutement",
        "language": "fr",
        "deep_search": False,
        "include_rag": False
    })
    assert response.status_code == 200
    data = response.json()
    assert "query" in data
    assert data["query"] == "concours recrutement"
    assert "final_answer" in data or "sources" in data

def test_sma_monitoring_tasks_endpoint():
    """Test monitoring status endpoint returns 404 for non-existent monitoring task"""
    response = client.get("/sma/monitor/non_existent_id/status")
    assert response.status_code == 404
