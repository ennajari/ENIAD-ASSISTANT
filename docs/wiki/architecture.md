# 🏗️ System Architecture & Data Flow

This section details the architectural design, microservice interaction patterns, sequence diagrams, and port contracts for **ENIAD-ASSISTANT**.

---

## 1. Microservices System Topology

```mermaid
graph TD
    subgraph Client Layer
        UI["React 18 + Vite Conversational UI<br/>Port: 3000 / 80"]
    end

    subgraph Backend Microservices Layer
        RAG["RAG Service (FastAPI)<br/>Port: 8009"]
        SMA["SMA Multi-Agent Service (FastAPI)<br/>Port: 8002"]
        Modal["Modal Platform LLM Server<br/>Llama-3 8B Fine-tuned"]
    end

    subgraph Data & Storage Layer
        LanceDB[("LanceDB Vector DB")]
        Qdrant[("Qdrant Vector DB")]
        MongoDB[("MongoDB Database<br/>Port: 27017")]
        Gemini["Google Gemini AI API"]
    end

    UI <--> RAG
    UI <--> SMA
    UI <--> Modal

    RAG <--> LanceDB
    RAG <--> Qdrant
    RAG <--> MongoDB

    SMA <--> Gemini
```

---

## 2. Service Port Matrix & API Contracts

| Service Name | Primary Language | Framework | Port | Primary Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| **Chatbot UI** | JavaScript (ES6+) | React 18 / Vite | `3000` | N/A (Frontend Web Interface) |
| **SMA Microservice** | Python 3.12 | FastAPI | `8002` | `POST /sma/intelligent-query`, `GET /health`, `GET /sma/monitor` |
| **RAG Microservice** | Python 3.12 | FastAPI | `8009` | `POST /search/{project_id}`, `GET /status`, `POST /api/v1/data/process` |
| **MongoDB** | C++ | Database | `27017` | `mongodb://localhost:27017` |

---

## 3. End-to-End Query Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student / Professor
    participant UI as Chatbot UI (Port 3000)
    participant SMA as SMA Service (Port 8002)
    participant RAG as RAG Service (Port 8009)
    participant Modal as Modal Llama-3 API

    Student->>UI: Input Question (e.g. "Quelle est la date d'inscription?")
    
    par Parallel Real-time Scraping & Web Search
        UI->>SMA: POST /sma/intelligent-query
        SMA->>SMA: Execute Web Scraper & Gemini Content Analyzer
        SMA-->>UI: Scraped News & Web Context
    and Parallel Hybrid Vector Search
        UI->>RAG: POST /search/eniadassistant
        RAG->>RAG: Vector Similarity Match against LanceDB
        RAG-->>UI: Academic PDF Chunks & Text References
    end

    UI->>Modal: POST /api/chat (Query + RAG Chunks + Web Context)
    Modal->>Modal: Infer Response via Fine-tuned Llama-3 8B
    Modal-->>UI: Structured JSON Response
    UI-->>Student: Display Formatted Response with Sources & Suggestions
```

---

## 4. Module Decoupling Strategy

- **Stateless Microservices**: The RAG and SMA microservices run as independent, stateless FastAPI containers.
- **Fail-safe Fallback Routing**: In [coordinationService.js](../../chatbot-ui/src/services/coordinationService.js), if the SMA backend is unavailable, queries seamlessly fallback to local RAG or custom model inference.
