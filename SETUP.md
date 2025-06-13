# 🚀 ENIAD Academic Assistant - Setup Guide

## 📋 **Prerequisites**

### **Required Software**
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.8+** - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)

### **Optional (for enhanced features)**
- **Firebase Account** - For authentication
- **ElevenLabs API Key** - For premium TTS
- **Azure Speech Services** - For enterprise TTS/STT
- **Google Cloud Account** - For multilingual speech

---

## 🔧 **Quick Setup (Automated)**

### **Option 1: Linux/macOS**
```bash
# Make script executable
chmod +x fix-dependencies.sh

# Run setup script
./fix-dependencies.sh
```

### **Option 2: Windows**
```cmd
# Run setup script
fix-dependencies.bat
```

---

## 🛠️ **Manual Setup**

### **1. Clone Repository**
```bash
git clone https://github.com/ennajari/ENIAD-ASSISTANT.git
cd ENIAD-ASSISTANT
```

### **2. Frontend Setup**
```bash
cd chatbot-ui/chatbot-academique

# Clean previous installations
rm -rf node_modules package-lock.json
npm cache clean --force

# Install dependencies
npm install --legacy-peer-deps

# Copy environment template
cp .env.example .env
```

### **3. Backend Setup**
```bash
# Go back to root
cd ../..

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r RAG_Project/src/requirements.txt
```

### **4. Environment Configuration**

#### **Frontend (.env)**
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# RAG API Configuration
VITE_RAG_API_BASE_URL=http://localhost:8000
VITE_RAG_PROJECT_ID=eniad-assistant

# Speech Services (Optional)
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
VITE_AZURE_SPEECH_KEY=your_azure_key
VITE_AZURE_SPEECH_REGION=eastus
VITE_GOOGLE_CLOUD_API_KEY=your_google_key
```

#### **Backend (RAG_Project/src/.env)**
```env
# Application Settings
APP_NAME=ENIAD Academic Assistant
APP_VERSION=1.0.0

# Database
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=eniad_assistant

# AI Services
OPENAI_API_KEY=your_openai_key
COHERE_API_KEY=your_cohere_key
GEMINI_API_KEY=your_gemini_key

# Vector Database
VECTOR_DB_BACKEND=qdrant
VECTOR_DB_PATH=./data/vector_db
```

---

## 🚀 **Running the Application**

### **1. Start Backend (Terminal 1)**
```bash
# Activate virtual environment
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# Navigate to RAG project
cd RAG_Project/src

# Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### **2. Start Frontend (Terminal 2)**
```bash
# Navigate to frontend
cd chatbot-ui/chatbot-academique

# Start development server
npm run dev
```

### **3. Access Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Frontend Issues**
```bash
# Peer dependency conflicts
npm install --legacy-peer-deps

# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Node version issues
nvm use 18  # if using nvm
```

#### **Backend Issues**
```bash
# Python version conflicts
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip

# Package conflicts
pip install --force-reinstall -r requirements.txt

# Missing dependencies
pip install -r requirements-dev.txt
```

#### **Environment Issues**
- Check `.env` files exist and have correct values
- Verify API keys are valid and have proper permissions
- Ensure Firebase project is configured correctly

---

## 📦 **Dependency Files**

### **Available Requirements Files**
- `requirements.txt` - Main Python dependencies
- `requirements-dev.txt` - Development dependencies
- `requirements-docker.txt` - Docker/production dependencies
- `package.json` - Frontend dependencies

### **Installation Commands**
```bash
# Production
pip install -r requirements.txt

# Development
pip install -r requirements.txt -r requirements-dev.txt

# Docker
pip install -r requirements-docker.txt
```

---

## 🐳 **Docker Setup (Optional)**

```bash
# Build Docker image
docker build -t eniad-assistant .

# Run with Docker Compose
docker-compose up -d
```

---

## ✅ **Verification**

### **Check Installation**
```bash
# Frontend
cd chatbot-ui/chatbot-academique
npm run build

# Backend
cd RAG_Project/src
python -c "import fastapi; print('FastAPI installed successfully')"
```

### **Test Application**
1. Open http://localhost:5173
2. Check if interface loads correctly
3. Test authentication (if configured)
4. Verify RAG system connection in settings

---

## 🆘 **Getting Help**

If you encounter issues:
1. Check this setup guide
2. Review error messages carefully
3. Check [GitHub Issues](https://github.com/ennajari/ENIAD-ASSISTANT/issues)
4. Contact support at support@eniad-assistant.com

---

## 🎉 **Success!**

Once setup is complete, you should have:
- ✅ Frontend running on http://localhost:5173
- ✅ Backend API running on http://localhost:8000
- ✅ All dependencies installed correctly
- ✅ Environment variables configured

**Happy coding! 🚀**
