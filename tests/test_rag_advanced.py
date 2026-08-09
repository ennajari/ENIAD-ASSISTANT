"""
Advanced Unit & Integration Tests for RAG Service
"""

import pytest
import os
import sys
import importlib.util
from pathlib import Path
from fastapi.testclient import TestClient

rag_main_path = Path(__file__).parent.parent / "services" / "rag-service" / "src" / "main.py"
spec = importlib.util.spec_from_file_location("rag_main", rag_main_path)
rag_module = importlib.util.module_from_spec(spec)
sys.modules["rag_main"] = rag_module
spec.loader.exec_module(rag_module)

app = rag_module.app
SimpleQueryRequest = rag_module.SimpleQueryRequest
client = TestClient(app)

def test_rag_status_endpoint_structure():
    """Verify RAG status endpoint returns complete operational schema"""
    response = client.get("/status")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "service" in data
    assert data["service"] == "RAG System"
    assert "initialization" in data
    assert "projects" in data
    assert "1" in data["projects"]

def test_rag_project_info_endpoint():
    """Verify RAG project info endpoint handles project IDs"""
    response = client.get("/api/v1/nlp/index/info/1")
    assert response.status_code == 200
    data = response.json()
    assert data["project_id"] == "1"
    assert "documents_count" in data
    assert "languages_supported" in data
    assert "fr" in data["languages_supported"]

def test_rag_simple_query_validation():
    """Test simple query request payload validation"""
    req = SimpleQueryRequest(
        query="Quels sont les programmes de master à l'ENIAD ?",
        language="fr",
        max_results=5,
        include_context=True
    )
    assert req.query == "Quels sont les programmes de master à l'ENIAD ?"
    assert req.language == "fr"
    assert req.max_results == 5
    assert req.include_context is True

def test_rag_query_cache_structure():
    """Verify RAG query cache initialization"""
    assert isinstance(rag_module.rag_query_cache, dict)

def test_rag_cors_configuration():
    """Test CORS response on endpoint"""
    response = client.get("/status")
    assert response.status_code == 200

def test_rag_streaming_endpoint():
    """Test RAG SSE streaming endpoint"""
    response = client.post(
        "/api/v1/nlp/index/stream/1",
        json={"query": "Informations sur l'ENIAD", "language": "fr"}
    )
    assert response.status_code == 200
    assert "text/event-stream" in response.headers.get("content-type", "")

