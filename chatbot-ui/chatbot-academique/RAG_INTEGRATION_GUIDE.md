# 🤖 RAG Integration Guide - ENIAD Academic Assistant

This guide explains how to integrate your existing RAG_Project with the ENIAD Academic Assistant interface.

## 📋 Overview

Your interface is now **ready** for your RAG model API integration. The system has been adapted to work seamlessly with your existing `RAG_Project` FastAPI structure.

## 🔧 Your RAG_Project Structure (Detected)

```
RAG_Project/
├── src/
│   ├── main.py                 # FastAPI application
│   ├── routes/
│   │   ├── nlp.py             # NLP endpoints (your main API)
│   │   ├── base.py            # Base routes
│   │   └── data.py            # Data management routes
│   ├── models/                # Data models
│   ├── controllers/           # Business logic
│   └── helpers/
│       └── config.py          # Configuration settings
```

## 🎯 API Endpoints (Already Integrated)

The interface is configured to use these endpoints from your RAG system:

### 1. **Main Chat Endpoint**
```
POST /api/v1/nlp/index/answer/{project_id}
```
**Payload:**
```json
{
  "text": "User's question",
  "limit": 5
}
```
**Response:**
```json
{
  "signal": "RAG_ANSWER_SUCCESS",
  "answer": "Generated response",
  "full_prompt": "Complete prompt used",
  "chat_history": "Conversation context"
}
```

### 2. **Search Endpoint**
```
POST /api/v1/nlp/index/search/{project_id}
```
**Payload:**
```json
{
  "text": "Search query",
  "limit": 5
}
```

### 3. **System Info Endpoint**
```
GET /api/v1/nlp/index/info/{project_id}
```

## ⚙️ Configuration Setup

### 1. **Environment Variables**

Create/update your `.env` file:

```bash
# RAG API Configuration
VITE_RAG_API_BASE_URL=http://localhost:8000
VITE_RAG_PROJECT_ID=eniad-assistant
VITE_RAG_API_KEY=your_api_key_here  # Optional

# Speech Services (Optional)
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
VITE_AZURE_SPEECH_KEY=your_azure_key
VITE_AZURE_SPEECH_REGION=eastus
VITE_GOOGLE_CLOUD_API_KEY=your_google_key

# Firebase (Existing)
VITE_FIREBASE_API_KEY=your_firebase_key
# ... other Firebase config
```

### 2. **Start Your RAG System**

```bash
# Navigate to your RAG_Project
cd RAG_Project/src

# Install dependencies (if not done)
pip install -r requirements.txt

# Start your FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. **Start the Interface**

```bash
# Navigate to the chatbot interface
cd chatbot-ui/chatbot-academique

# Install dependencies (if not done)
npm install --legacy-peer-deps

# Start the development server
npm run dev
```

## 🎯 How It Works

### **1. User Sends Message**
- User types a question in the interface
- Message is sent to your RAG system via `/api/v1/nlp/index/answer/{project_id}`

### **2. RAG Processing**
- Your system processes the query using your custom model
- Retrieves relevant documents from your vector database
- Generates a response using your LLM

### **3. Response Display**
- Interface receives the response and displays it
- Sources are extracted from the `full_prompt` if available
- Response can be read aloud using TTS services

## 🔍 RAG Status Monitoring

The interface includes a **RAG Status** component that:

- ✅ **Monitors connection** to your RAG system
- 📊 **Shows system health** and project information
- 🔄 **Auto-refreshes** every 5 minutes
- ⚠️ **Displays errors** if connection fails

Access it via: **Settings → RAG System**

## 🚀 Testing the Integration

### **1. Check RAG Status**
1. Open the interface
2. Go to Settings (gear icon)
3. Look for "RAG System" section
4. Should show "RAG System Online" if connected

### **2. Test Chat Functionality**
1. Type a question in the chat
2. Should receive response from your RAG system
3. Check browser console for detailed logs

### **3. Verify API Calls**
Check your FastAPI logs for incoming requests:
```
INFO: POST /api/v1/nlp/index/answer/eniad-assistant
```

## 🔧 Customization Options

### **1. Project ID**
Change the default project ID in `.env`:
```bash
VITE_RAG_PROJECT_ID=your-custom-project-id
```

### **2. API Authentication**
If you add authentication to your RAG system:
```bash
VITE_RAG_API_KEY=your_secret_api_key
```

### **3. Response Formatting**
The interface automatically formats your RAG responses. You can customize this in:
```
src/services/ragApiService.js → formatYourRagResponse()
```

## 🐛 Troubleshooting

### **Common Issues:**

1. **"RAG System Error" in status**
   - Check if your FastAPI server is running on port 8000
   - Verify the `VITE_RAG_API_BASE_URL` in your `.env`
   - Check CORS settings in your FastAPI app

2. **CORS Errors**
   Add CORS middleware to your `main.py`:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173", "http://localhost:5175"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **No Response from RAG**
   - Check your FastAPI logs for errors
   - Verify your MongoDB and vector database connections
   - Ensure your models are properly loaded

## 📝 Next Steps

1. **Start your RAG system** (`uvicorn main:app --port 8000`)
2. **Update your `.env`** with the correct RAG API URL
3. **Test the integration** using the interface
4. **Monitor the RAG status** in Settings
5. **Add authentication** if needed for production

## 🎉 Ready to Go!

Your interface is now **fully prepared** for your RAG model integration. Simply:

1. ✅ Start your RAG_Project FastAPI server
2. ✅ Update the `.env` configuration
3. ✅ Test the connection via Settings → RAG System
4. ✅ Start chatting with your custom RAG model!

The system will automatically use your RAG model for all chat interactions while providing fallback mechanisms for reliability.
