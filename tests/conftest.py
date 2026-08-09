import os
import sys

try:
    import pytest  # type: ignore # pyright: ignore # noqa
except ImportError:
    pytest = None

# Add project subdirectories to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../services/rag-service/src')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../services/sma-service')))

if pytest:
    @pytest.fixture
    def dummy_env():
        """Ensure test environment variables exist"""
        os.environ['GEMINI_API_KEY'] = os.getenv('GEMINI_API_KEY', 'test_key')
        os.environ['MONGODB_URL'] = os.getenv('MONGODB_URL', 'mongodb://localhost:27017')
        yield
