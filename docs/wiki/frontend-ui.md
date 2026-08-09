# 💻 Frontend Architecture Guide (`chatbot-ui`)

The frontend application (`eniad-assistant-ui`) is built using **React 18**, **Vite**, and **Material-UI (MUI)**. It provides a real-time conversational interface with speech synthesis, question suggestions, and multi-model coordination.

---

## 1. Directory Structure (`chatbot-ui/src/`)

```text
chatbot-ui/src/
├── App.jsx                       # Root React Application & Route Provider
├── main.jsx                      # React 18 DOM Entry Point
├── index.css                     # Tailwind / Custom Styling Rules
├── firebase.js                   # Firebase Configuration & Firestore Auth
├── components/                   # React UI Components
│   ├── ChatInput.jsx             # User Prompt Input with Speech STT
│   ├── ChatSidebar.jsx           # Session History & Navigation Sidebar
│   ├── ChatContent.jsx           # Conversational Message Stream
│   ├── MessageBubble.jsx         # Message Rendering with Markdown & Code Formatting
│   ├── ModelSelector.jsx         # Model Switcher (Local RAG vs SMA vs Modal Llama-3)
│   ├── RagStatus.jsx             # Real-time Microservice Health Status Badge
│   └── TTSFloatingPanel.jsx      # Text-to-Speech Control Panel
└── services/                     # Service Layer API Clients
    ├── coordinationService.js    # Master Request Router & Model Orchestrator
    ├── ragApiService.js          # RAG Microservice API Client (Port 8009)
    ├── realSmaService.js         # SMA Multi-Agent Service API Client (Port 8002)
    ├── geminiService.js          # Direct Google Gemini AI Service Client
    ├── speechService.js          # Web Speech API Speech-to-Text & Text-to-Speech
    └── firebaseStorageService.js # Firestore Chat History Persistence
```

---

## 2. API Service Layer Architecture

### `coordinationService.js` (Master Request Router)
Routes user queries to the selected model provider:
- **`custom_model`**: Routes to Modal API via `ragApiService.js` with SMA web search context.
- **`sma_agent`**: Triggers full SMA Multi-Agent workflow via `realSmaService.js`.
- **`rag_local`**: Queries local LanceDB vector search via `ragApiService.js`.

### `ragApiService.js` (RAG API Client)
- Communicates with FastAPI RAG backend at `http://localhost:8009`.
- Endpoints:
  - `/search/{project_id}`: Performs hybrid vector similarity search.
  - `/status`: Checks RAG vector database health.

### `realSmaService.js` (SMA Multi-Agent Client)
- Communicates with FastAPI SMA backend at `http://localhost:8002`.
- Endpoints:
  - `/sma/intelligent-query`: Initiates intelligent multi-agent web scraping & Gemini AI analysis.
  - `/health`: Checks SMA backend availability.

---

## 3. Building for Production

```bash
cd chatbot-ui
npm install
npm run build
```

Production build generates static HTML/JS/CSS assets in `chatbot-ui/dist/` served via Nginx in Docker container.
