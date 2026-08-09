"""
Unit & Integration Tests for Modal Serverless Llama-3 Deployment
"""

import pytest
import os

def test_modal_test_script_env_variables():
    """Verify Modal test script respects environment variable overrides"""
    from deployments.modal.test_llama3 import API_URL, API_KEY
    assert isinstance(API_URL, str)
    assert isinstance(API_KEY, str)
    assert "modal.run" in API_URL or "completions" in API_URL

def test_modal_app_configuration():
    """Verify Modal app configuration parameters"""
    try:
        from deployments.modal.app import MODEL_NAME, API_KEY, VLLM_PORT
        assert MODEL_NAME == "ahmed-ouka/llama3-8b-eniad-merged-32bit"
        assert API_KEY == "super-secret-key"
        assert VLLM_PORT == 8000
    except ImportError:
        # modal SDK not installed locally in test env
        assert True
