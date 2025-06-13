# 🤖 Custom Llama3 Model Integration Guide

This guide explains how to integrate your custom Llama3 model API with the ENIAD Academic Assistant interface.

## 📋 Overview

Your custom model API endpoint (`/api/chat`) has been integrated with the chatbot interface. The system now:

- ✅ Sends user queries to your custom Llama3 model
- ✅ Handles structured JSON responses from your model
- ✅ Integrates SMA (Smart Multi-Agent) web intelligence
- ✅ Supports multilingual responses (French, English, Arabic)
- ✅ Maintains conversation history via your API

## 🔧 API Integration Details

### Request Format
```javascript
POST /api/chat
{
  "chatId": "chat_1234567890_abc123def",
  "prompt": "User's question here"
}
```

### Response Format (Expected)
```javascript
{
  "success": true,
  "data": {
    "role": "assistant",
    "content": "Model response (can be JSON or plain text)",
    "timestamp": 1234567890
  }
}
```

### Structured Response Support
Your model can return structured JSON responses following this schema:
```javascript
{
  "contentment": "Polite acknowledgment",
  "main_answer": "Direct answer to the question",
  "details": "Additional explanations",
  "intent": "acadimique information",
  "related_questions": [
    {
      "question1": "Related question 1",
      "question2": "Related question 2", 
      "question3": "Related question 3"
    }
  ]
}
```

## 🧠 SMA Integration

When SMA (Smart Multi-Agent) is active, the system:

1. **Searches ENIAD/UMP websites** for real-time information
2. **Enhances user queries** with recent web content
3. **Passes enhanced context** to your model
4. **Displays web sources** alongside model responses

### Enhanced Query Format
```
Original user question

Recent information from ENIAD/UMP websites:
Title 1: Content summary...
Title 2: Content summary...
Title 3: Content summary...
```

## 🚀 Setup Instructions

### 1. Environment Configuration
Copy and configure your environment variables:
```bash
cp .env.example .env
```

Set your API configuration:
```env
# Custom Model API (usually empty for same domain)
VITE_RAG_API_BASE_URL=

# Optional: API key if your model requires authentication
VITE_RAG_API_KEY=your_api_key_here

# Project ID
VITE_RAG_PROJECT_ID=eniad-assistant
```

### 2. Model API Requirements
Ensure your `/api/chat` endpoint:
- ✅ Accepts POST requests with `chatId` and `prompt`
- ✅ Returns JSON with `success` and `data` fields
- ✅ Handles conversation history via `chatId`
- ✅ Supports multilingual responses
- ✅ Has appropriate CORS headers for frontend

### 3. Authentication (Optional)
If your model requires authentication:
- Set `VITE_RAG_API_KEY` in your `.env` file
- The system will include it as `Authorization: Bearer {key}`

## 🔄 How It Works

### 1. User Input
- User types a question in the interface
- System checks if SMA is active

### 2. SMA Enhancement (if active)
- Searches ENIAD and UMP websites
- Extracts relevant recent information
- Enhances user query with web context

### 3. Model Query
- Sends enhanced query to your `/api/chat` endpoint
- Includes `chatId` for conversation continuity
- Waits for model response (60s timeout)

### 4. Response Processing
- Parses structured JSON responses
- Extracts main answer, details, and related questions
- Combines with SMA sources if available
- Displays formatted response to user

### 5. Conversation Management
- Your API handles conversation history via `chatId`
- Frontend maintains local conversation list
- Automatic conversation titles from first message

## 🎯 Features Supported

### ✅ Core Features
- [x] Custom Llama3 model integration
- [x] Structured and plain text responses
- [x] Multilingual support (FR/EN/AR)
- [x] Conversation history
- [x] SMA web intelligence integration
- [x] Real-time typing indicators
- [x] Error handling and fallbacks

### ✅ Advanced Features
- [x] Related questions suggestions
- [x] Intent classification
- [x] Source attribution (SMA)
- [x] Response confidence scoring
- [x] Message editing and regeneration
- [x] Export conversations
- [x] Dark/light theme support

## 🐛 Troubleshooting

### Model Not Responding
1. Check your `/api/chat` endpoint is accessible
2. Verify CORS headers allow frontend domain
3. Check browser network tab for request details
4. Ensure response format matches expected structure

### SMA Not Working
1. Verify SMA service is running on port 8001
2. Check `VITE_SMA_API_BASE_URL` in `.env`
3. Ensure research button is toggled on
4. Check browser console for SMA errors

### Authentication Issues
1. Verify `VITE_RAG_API_KEY` is set correctly
2. Check your API accepts Bearer token authentication
3. Ensure API key has necessary permissions

## 📞 Support

For integration support:
- Check browser console for detailed error messages
- Verify API endpoint responses match expected format
- Test API endpoints directly with tools like Postman
- Review network requests in browser developer tools

## 🔄 Updates

This integration supports:
- **Model updates**: Simply update your `/api/chat` endpoint
- **Response format changes**: Modify `formatCustomModelResponse()` in `ragApiService.js`
- **New features**: Extend the API contract as needed

Your custom Llama3 model is now fully integrated with the ENIAD Academic Assistant! 🎉
