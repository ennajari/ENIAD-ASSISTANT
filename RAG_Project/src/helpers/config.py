from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra='ignore')

    # Application Settings
    APP_NAME: str = "ENIAD RAG System"
    APP_VERSION: str = "2.0.0"
    APP_DESCRIPTION: str = "Enhanced RAG System with Docker MongoDB and Gemini AI"

    # File Processing Settings - Enhanced for ENIAD DATA
    FILE_ALLOWED_TYPES: list = [
        "text/plain", "application/pdf", "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg", "image/png", "image/tiff", "application/json"
    ]
    FILE_MAX_SIZE: int = 50  # MB
    FILE_DEFAULT_CHUNK_SIZE: int = 8192  # 8KB chunks for file reading (not text chunking)
    FILE_OVERLAP_SIZE: int = 100  # Better overlap for context

    # ENIAD Data Processing
    ENIAD_DATA_PATH: str = "../../DATA"  # Path to ENIAD-ASSISTANT/DATA
    AUTO_PROCESS_ENIAD_DATA: bool = True  # Auto-process on startup

    # MongoDB Settings (Fallback to local without Docker)
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DATABASE: str = "eniad_rag_db"
    MONGODB_COLLECTION_DOCUMENTS: str = "documents"
    MONGODB_COLLECTION_EMBEDDINGS: str = "embeddings"
    MONGODB_COLLECTION_CONVERSATIONS: str = "conversations"

    # AI Model Settings - FORCE OLLAMA
    GENERATION_BACKEND: str = "OLLAMA"
    EMBEDDING_BACKEND: str = "OLLAMA"
    # GEMINI_API_KEY: str = "AIzaSyDIDbm8CcUxtTTW3omJcOHQj1BWcmRWeYc"
    GEMINI_API_KEY: str = ""

    # Ollama Settings
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_GENERATION_MODEL: str = "llama3:8b-instruct-q4_K_M"
    OLLAMA_EMBEDDING_MODEL: str = "nomic-embed-text"

    # Model Configuration
    GENERATION_MODEL_ID: str = "llama3:8b-instruct-q4_K_M"
    EMBEDDING_MODEL_ID: str = "nomic-embed-text"
    EMBEDDING_MODEL_SIZE: int = 768
    INPUT_DEFAULT_MAX_CHARACTERS: int = 4096
    GENERATION_DEFAULT_MAX_TOKENS: int = 1000
    GENERATION_DEFAULT_TEMPERATURE: float = 0.3

    # Vector Database Settings (LanceDB Local)
    VECTOR_DB_BACKEND: str = "LANCEDB"
    VECTOR_DB_PATH: str = "lancedb_data"
    VECTOR_DB_URL: str = "http://localhost:6333"
    VECTOR_DB_COLLECTION: str = "eniad_documents"
    VECTOR_DB_DISTANCE_METHOD: str = "cosine"

    # Language Settings - ENIAD French Focus
    PRIMARY_LANG: str = "fr"
    DEFAULT_LANG: str = "fr"
    SUPPORTED_LANGUAGES: list = ["fr", "ar", "en"]

    # OCR Settings for Image Processing
    TESSERACT_CMD: str = r"C:\Program Files\Tesseract-OCR\tesseract.exe" if os.name == 'nt' else "tesseract"
    OCR_LANGUAGES: str = "fra+ara+eng"

def get_settings():
    return Settings()
