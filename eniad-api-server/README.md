# 🤖 ENIAD Enhanced API Server

## 🎯 Overview

This API server integrates your custom Llama3 model with RAG (Retrieval-Augmented Generation) and SMA (Smart Multi-Agent) systems to provide enhanced, context-aware responses for the ENIAD Academic Assistant.

## 🏗️ Architecture

```
User Query → RAG Search → SMA Web Intelligence → Enhanced Context → Llama3 Model → Enhanced Response
```

### Components:

1. **Custom Llama3 Model**: `ahmed-ouka/llama3-8b-eniad-merged-32bit` hosted on Modal
2. **RAG System**: Document retrieval from ENIAD knowledge base
3. **SMA System**: Real-time web intelligence from ENIAD/UMP websites
4. **Context Enhancement**: Combines RAG + SMA data for richer responses

## 🚀 Features

### ✅ **Enhanced Response Generation**
- **RAG Integration**: Searches ENIAD documents for relevant context
- **SMA Integration**: Fetches real-time web information
- **Context Fusion**: Combines multiple data sources intelligently
- **Multilingual Support**: French, English, Arabic responses

### ✅ **Fallback Mechanisms**
- **Local RAG Fallback**: Uses local JSON files when external RAG is unavailable
- **Graceful SMA Degradation**: Works without SMA when service is down
- **Model Fallback**: Provides helpful responses when Modal is unavailable

### ✅ **Smart Context Building**
- **Document Prioritization**: Most relevant RAG documents first
- **Web Intelligence**: Recent information from official websites
- **Source Attribution**: Tracks and provides source information
- **Context Optimization**: Prevents context overflow

## 📡 API Endpoints

### `POST /api/chat`
Enhanced chat endpoint with RAG and SMA integration.

**Request:**
```json
{
  "chatId": "unique_chat_id",
  "prompt": "User's question",
  "enableRAG": true,
  "enableSMA": true,
  "language": "fr"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "role": "assistant",
    "content": "Enhanced response with context",
    "timestamp": 1234567890,
    "metadata": {
      "ragDocuments": 3,
      "smaResults": 2,
      "hasEnhancedContext": true,
      "sources": {
        "rag": ["local", "eniad_docs"],
        "sma": ["https://eniad.ump.ma", "https://ump.ma"]
      }
    }
  }
}
```

### `GET /api/test-modal`
Test Modal endpoint connectivity.

### `GET /health`
Health check with Modal status.

## 🔧 Configuration

### Environment Variables (`.env`)
```env
# Server
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
```

## 🧠 How Enhancement Works

### 1. **RAG Document Search**
```javascript
// Searches for relevant documents
const ragResults = await searchRAGDocuments(query, language, 5);
```

### 2. **SMA Web Intelligence**
```javascript
// Fetches real-time web information
const smaResults = await searchSMAWebIntelligence(query, language);
```

### 3. **Context Building**
```javascript
// Combines RAG + SMA into enhanced context
const enhancedContext = buildEnhancedContext(query, ragResults, smaResults, language);
```

### 4. **Enhanced Prompt**
```
=== INFORMATIONS DOCUMENTAIRES ENIAD ===
Document 1: [RAG content]
---

=== INFORMATIONS WEB RÉCENTES (ENIAD/UMP) ===
Source 1: [SMA content]
---

## Question de l'utilisateur : [Original query]
```

## 🔄 Response Flow

1. **Query Reception**: API receives user question
2. **RAG Search**: Searches ENIAD documents for relevant information
3. **SMA Search**: Fetches recent web information (if enabled)
4. **Context Enhancement**: Builds comprehensive context from all sources
5. **Model Query**: Sends enhanced prompt to Llama3 model
6. **Response Processing**: Returns structured response with metadata

## 🛠️ Testing

Run the test script to verify all components:

```bash
node test-enhanced.js
```

This tests:
- ✅ Basic chat functionality
- ✅ RAG-enhanced responses
- ✅ SMA-enhanced responses  
- ✅ Full RAG + SMA integration

## 📊 Response Enhancement Examples

### Without Enhancement:
```
Q: "Quelles sont les conditions d'admission à l'ENIAD?"
A: "L'ENIAD a des conditions d'admission standard..."
```

### With RAG Enhancement:
```
Q: "Quelles sont les conditions d'admission à l'ENIAD?"
A: "Selon les documents officiels de l'ENIAD, les conditions d'admission incluent:
- Baccalauréat scientifique ou technique
- Concours d'entrée national
- Entretien de motivation
[Sources: Documents ENIAD officiels]"
```

### With RAG + SMA Enhancement:
```
Q: "Quelles sont les conditions d'admission à l'ENIAD?"
A: "Selon les informations les plus récentes de l'ENIAD:
- Baccalauréat scientifique ou technique (requis)
- Concours d'entrée national (session 2024 ouverte)
- Entretien de motivation (nouveauté 2024)
- Inscription en ligne disponible sur le site officiel
[Sources: Documents ENIAD + Site web officiel mis à jour]"
```

## 🚀 Deployment

1. **Start RAG System** (optional): `cd RAG_Project && python app.py`
2. **Start SMA System** (optional): `cd SMA_Service && python main.py`
3. **Start API Server**: `cd eniad-api-server && npm start`
4. **Start Frontend**: `cd chatbot-ui/chatbot-academique && npm run dev`

## 🔍 Monitoring

The server provides detailed logging for:
- 📚 RAG document searches and results
- 🧠 SMA web intelligence queries
- 🤖 Model API calls and responses
- ⚠️ Fallback activations and errors

## 🎯 Benefits

- **Accuracy**: RAG provides verified ENIAD information
- **Freshness**: SMA delivers real-time updates
- **Reliability**: Multiple fallback mechanisms
- **Transparency**: Source attribution and metadata
- **Performance**: Optimized context building and caching

Your custom Llama3 model now has access to the full ENIAD knowledge base plus real-time web intelligence! 🎉
