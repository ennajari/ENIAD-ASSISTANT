#!/usr/bin/env python3
"""
🔧 ENIAD Environment Setup
Automatically configures all environment files and dependencies
"""

import os
import shutil
from pathlib import Path

def create_env_files():
    """Create all necessary .env files with proper configuration"""
    
    print("🔧 Setting up environment files...")
    
    # 1. Frontend .env file
    frontend_env = Path("chatbot-ui/chatbot-academique/.env")
    frontend_env_content = """# 🔥 Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDjOBmfBAVvCXFv5WpiIYjI7b6w8XJ1tIs
VITE_FIREBASE_AUTH_DOMAIN=calcoussama-21fb8b71.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=calcoussama-21fb8b71
VITE_FIREBASE_STORAGE_BUCKET=calcoussama-21fb8b71.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=426852414544
VITE_FIREBASE_APP_ID=1:426852414544:web:9148e00249f24d6c334d55

# 🤖 RAG API Configuration
VITE_RAG_API_BASE_URL=http://localhost:8000
VITE_RAG_API_KEY=
VITE_RAG_PROJECT_ID=eniad-assistant

# 🧠 SMA Configuration
VITE_SMA_API_BASE_URL=http://localhost:8001
VITE_SMA_API_KEY=

# 📡 API Server Configuration
VITE_API_BASE_URL=http://localhost:3000

# 🔊 Speech Services (Optional)
VITE_ELEVENLABS_API_KEY=
VITE_AZURE_SPEECH_KEY=
VITE_AZURE_SPEECH_REGION=eastus
VITE_GOOGLE_CLOUD_API_KEY=
"""
    
    frontend_env.parent.mkdir(parents=True, exist_ok=True)
    with open(frontend_env, 'w', encoding='utf-8') as f:
        f.write(frontend_env_content)
    print(f"✅ Created {frontend_env}")
    
    # 2. RAG System .env file
    rag_env = Path("RAG_Project/src/.env")
    rag_env_content = """APP_NAME="ENIAD RAG System"
APP_VERSION="1.0"
OPENAI_API_KEY=""

FILE_ALLOWED_TYPES=["text/plain","application/pdf"]
FILE_MAX_SIZE=10
FILE_DEFAULT_CHUNK_SIZE=512000

MONGODB_URL="mongodb://localhost:27017"
MONGODB_DATABASE="eniad_rag_db"

# LLM Configuration
GENERATION_BACKEND="GEMINI"
EMBEDDING_BACKEND="LOCAL"
GEMINI_API_KEY=""

GENERATION_MODEL_ID="gemini-pro"
EMBEDDING_MODEL_ID="text-embedding-3-small"
EMBEDDING_MODEL_SIZE=1536

VECTOR_DB_BACKEND="CHROMA"
VECTOR_DB_PATH="./chroma_storage"
VECTOR_DB_DISTANCE_METHOD="cosine"

PRIMARY_LANG="fr"
DEFAULT_LANG="fr"
"""
    
    rag_env.parent.mkdir(parents=True, exist_ok=True)
    with open(rag_env, 'w', encoding='utf-8') as f:
        f.write(rag_env_content)
    print(f"✅ Created {rag_env}")
    
    # 3. SMA Service .env file
    sma_env = Path("SMA_Service/.env")
    sma_env_content = """# SMA Service Configuration
APP_NAME="ENIAD SMA Service"
APP_VERSION="1.0.0"
DEBUG=false

HOST="0.0.0.0"
PORT=8001
RELOAD=true

# Target Websites
TARGET_WEBSITES=["https://eniad.ump.ma/fr", "https://www.ump.ma/"]

# Rate Limiting
MAX_REQUESTS_PER_MINUTE=60
MAX_CONCURRENT_REQUESTS=10

# Caching
CACHE_TTL_SECONDS=3600
ENABLE_CACHING=true

# Optional AI Service Keys
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
COHERE_API_KEY=""
"""
    
    sma_env.parent.mkdir(parents=True, exist_ok=True)
    with open(sma_env, 'w', encoding='utf-8') as f:
        f.write(sma_env_content)
    print(f"✅ Created {sma_env}")
    
    # 4. API Server .env file
    api_env = Path("eniad-api-server/.env")
    api_env_content = """# Server Configuration
PORT=3000

# RAG System
RAG_API_BASE_URL=http://localhost:8000
RAG_PROJECT_ID=eniad-assistant

# SMA System
SMA_API_BASE_URL=http://localhost:8001
SMA_ENABLED=true

# Llama3 Model (Modal)
LLAMA3_BASE_URL=https://abdellah-ennajari-23--llama3-openai-compatible-serve.modal.run/v1
LLAMA3_API_KEY=super-secret-key
LLAMA3_MODEL=ahmed-ouka/llama3-8b-eniad-merged-32bit
"""
    
    api_env.parent.mkdir(parents=True, exist_ok=True)
    with open(api_env, 'w', encoding='utf-8') as f:
        f.write(api_env_content)
    print(f"✅ Created {api_env}")

def create_requirements_files():
    """Ensure all requirements files exist"""
    
    print("📦 Checking requirements files...")
    
    # RAG requirements
    rag_req = Path("RAG_Project/src/requirements.txt")
    if not rag_req.exists():
        rag_req_content = """fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pydantic==2.5.0
pydantic-settings==2.1.0
python-dotenv==1.0.0
chromadb==0.4.18
sentence-transformers==2.2.2
langchain==0.0.350
langchain-community==0.0.1
pymongo==4.6.0
pandas==2.1.4
numpy==1.24.3
"""
        with open(rag_req, 'w') as f:
            f.write(rag_req_content)
        print(f"✅ Created {rag_req}")
    
    # SMA requirements
    sma_req = Path("SMA_Service/requirements.txt")
    if sma_req.exists():
        print(f"✅ Found {sma_req}")
    else:
        print(f"⚠️ {sma_req} not found - using existing file")

def setup_directories():
    """Create necessary directories"""
    
    print("📁 Setting up directories...")
    
    directories = [
        "chroma_storage",
        "RAG_Project/src/data",
        "SMA_Service/logs",
        "eniad-api-server/logs"
    ]
    
    for dir_path in directories:
        Path(dir_path).mkdir(parents=True, exist_ok=True)
        print(f"✅ Created directory: {dir_path}")

def main():
    print("""
╔══════════════════════════════════════════════════════════════╗
║                🔧 ENIAD Environment Setup                    ║
║                                                              ║
║  Configuring all services for seamless integration          ║
╚══════════════════════════════════════════════════════════════╝
    """)
    
    try:
        create_env_files()
        create_requirements_files()
        setup_directories()
        
        print("""
🎉 Environment setup complete!

📋 What was configured:
   ✅ Frontend .env file with Firebase config
   ✅ RAG System .env file with database settings
   ✅ SMA Service .env file with web scraping config
   ✅ API Server .env file with Llama3 endpoint
   ✅ Required directories created
   ✅ Requirements files verified

🚀 Next steps:
   1. Run: python start_all_services.py
   2. Or run: start_eniad.bat (Windows) / ./start_eniad.sh (Linux/Mac)
   3. Open: http://localhost:5173

🔧 Optional configuration:
   - Add your API keys to the .env files for enhanced features
   - Modify target websites in SMA_Service/.env
   - Adjust database settings in RAG_Project/src/.env
        """)
        
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    main()
