# 🚀 ENIAD AI Assistant - Quick Start Guide

## 🎯 One-Command Setup

### **Windows Users:**
```bash
# Double-click or run in Command Prompt:
start_eniad.bat
```

### **Linux/Mac Users:**
```bash
# Make executable and run:
chmod +x start_eniad.sh
./start_eniad.sh
```

### **Manual Python Launch:**
```bash
python start_all_services.py
```

---

## 🎉 What This Does

When you run the startup command, it automatically:

✅ **Checks Dependencies** - Verifies Python 3.8+ and Node.js are installed  
✅ **Sets Up Environment** - Creates all necessary .env files with proper configuration  
✅ **Installs Dependencies** - Installs all Python and Node.js packages automatically  
✅ **Starts All Services** - Launches RAG, SMA, API Server, and Frontend together  
✅ **Monitors Health** - Checks that all services are running properly  
✅ **Opens Browser** - Your AI Assistant will be ready at http://localhost:5173  

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   🌐 Frontend   │    │   📡 API Server │    │  🤖 Llama3 AI  │
│  React + Vite   │◄──►│   Express.js    │◄──►│  Modal Service  │
│  Port: 5173     │    │   Port: 3000    │    │   Your Model    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  📚 RAG System  │    │  🧠 SMA Service │
│   FastAPI       │    │   FastAPI       │
│   Port: 8000    │    │   Port: 8001    │
└─────────────────┘    └─────────────────┘
```

---

## 🔧 Services Included

### **🌐 Frontend (Port 5173)**
- React-based chat interface
- Firebase authentication & conversation storage
- Multilingual support (French, English, Arabic)
- Speech-to-text and text-to-speech
- Real-time conversation management

### **📚 RAG System (Port 8000)**
- Document retrieval and context generation
- ENIAD knowledge base integration
- Vector database with ChromaDB
- Intelligent document chunking and embedding

### **🧠 SMA Service (Port 8001)**
- Smart Multi-Agent web intelligence
- Real-time website monitoring (ENIAD, UMP)
- Content extraction and analysis
- Web scraping with intelligent filtering

### **📡 API Server (Port 3000)**
- Integration layer between all services
- Enhanced context building (RAG + SMA + User input)
- Your custom Llama3 model integration
- Response optimization and formatting

---

## 🎯 Available Features

### **💬 Chat Interface:**
- Send messages in French, English, or Arabic
- Get AI responses enhanced with RAG and SMA data
- Conversation history with Firebase persistence
- Edit, delete, and rename conversations

### **🤖 AI Capabilities:**
- **RAG Enhancement** - Retrieves relevant ENIAD documents
- **SMA Intelligence** - Fetches real-time web information
- **Custom Model** - Your fine-tuned Llama3 model responses
- **Multilingual** - Responds in your preferred language

### **🔊 Voice Features:**
- Speech-to-text input (microphone button)
- Text-to-speech output (speaker buttons)
- Auto-read responses (toggle in settings)

### **💾 Persistence:**
- Google account login with Firebase
- All conversations saved automatically
- Cross-device synchronization
- Real-time conversation updates

---

## 🌐 Access Your AI Assistant

Once all services are running:

1. **Open your browser** and go to: **http://localhost:5173**
2. **Login with Google** for conversation persistence
3. **Start chatting** - Ask questions about ENIAD, academics, or anything!
4. **Enjoy enhanced responses** powered by RAG + SMA + your Llama3 model

---

## 📋 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| 🌐 **Main Interface** | http://localhost:5173 | Your AI chat interface |
| 📚 **RAG API Docs** | http://localhost:8000/docs | RAG system documentation |
| 🧠 **SMA API Docs** | http://localhost:8001/docs | SMA service documentation |
| 📡 **API Server** | http://localhost:3000 | Integration layer |

---

## 🛑 Stopping Services

To stop all services:
- **Press `Ctrl+C`** in the terminal where services are running
- All services will be gracefully shut down automatically

---

## 🔧 Troubleshooting

### **If services fail to start:**

1. **Check Dependencies:**
   ```bash
   python --version  # Should be 3.8+
   node --version    # Should be 14+
   npm --version     # Should be 6+
   ```

2. **Install Missing Dependencies:**
   ```bash
   # Python packages
   pip install fastapi uvicorn requests

   # Node.js packages (in each directory)
   npm install
   ```

3. **Check Ports:**
   - Make sure ports 3000, 5173, 8000, 8001 are not in use
   - Close any other applications using these ports

4. **Manual Service Start:**
   ```bash
   # Start each service individually for debugging
   cd RAG_Project/src && python -m uvicorn main:app --port 8000
   cd SMA_Service && python -m uvicorn main:app --port 8001  
   cd eniad-api-server && node server.js
   cd chatbot-ui/chatbot-academique && npm run dev
   ```

---

## 🎉 Success Indicators

You'll know everything is working when you see:

✅ **All services show "running" status**  
✅ **Frontend loads at http://localhost:5173**  
✅ **You can login with Google**  
✅ **Chat responses include RAG and SMA data**  
✅ **Conversations persist after refresh**  

---

## 🚀 Ready to Go!

Your complete ENIAD AI Assistant with RAG + SMA + Llama3 integration is now ready!

**Just run `start_eniad.bat` (Windows) or `./start_eniad.sh` (Linux/Mac) and start chatting!**
