"""
SMA Service Configuration Settings
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Application Settings
    app_name: str = "ENIAD SMA Service"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Server Settings
    host: str = "0.0.0.0"
    port: int = 8001
    reload: bool = True
    
    # API Settings
    api_prefix: str = "/sma"
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:5175", 
        "http://localhost:3000"
    ]
    
    # Target Websites
    target_websites: List[str] = [
        "https://eniad.ump.ma/fr",
        "https://www.ump.ma/"
    ]
    
    # Scraping Settings
    scraping_delay: float = 2.0  # Seconds between requests
    max_concurrent_requests: int = 5
    request_timeout: int = 30
    max_retries: int = 3
    
    # Content Processing
    max_content_length: int = 10000
    max_keywords: int = 10
    summary_max_length: int = 200
    
    # Monitoring Settings
    default_monitoring_interval: str = "1h"
    max_monitoring_tasks: int = 10
    
    # Language Settings
    default_language: str = "fr"
    supported_languages: List[str] = ["fr", "en", "ar"]
    
    # Categories
    supported_categories: List[str] = [
        "news", "documents", "announcements", 
        "events", "photos", "research", "academic"
    ]
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Optional AI Service Keys
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    cohere_api_key: Optional[str] = None
    
    # Database (if needed for storing results)
    database_url: Optional[str] = None
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

# Create global settings instance
settings = Settings()
