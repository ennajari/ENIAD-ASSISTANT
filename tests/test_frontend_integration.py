"""
Integration Tests for Frontend Microservice Configurations
"""

import pytest
import os
from pathlib import Path

def test_frontend_directory_structure():
    """Verify frontend directory structure and key entry files exist"""
    base_dir = Path(__file__).parent.parent / "frontend"
    assert (base_dir / "package.json").exists()
    assert (base_dir / "vite.config.js").exists()
    assert (base_dir / "src" / "App.jsx").exists()
    assert (base_dir / "app" / "api" / "chat" / "ai" / "route.js").exists()

def test_docker_compose_configuration():
    """Verify docker-compose context paths map to correct directories"""
    docker_file = Path(__file__).parent.parent / "docker-compose.yml"
    assert docker_file.exists()
    content = docker_file.read_text(encoding="utf-8")
    assert "./frontend" in content
    assert "./services/rag-service" in content
    assert "./services/sma-service" in content
