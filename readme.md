# 🤖 ENIAD Academic Assistant

[![CI/CD Pipeline](https://github.com/ennajari/ENIAD-ASSISTANT/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/ennajari/ENIAD-ASSISTANT/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version: 2.0.0](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/ennajari/ENIAD-ASSISTANT/releases/tag/v2.0.0)

**ENIAD Academic Assistant** is an intelligent, multi-agent AI platform designed for the **École Nationale d'Intelligence Artificielle et du Digital (ENIAD)**. It combines a modern **React 18 + Vite** frontend, a **Retrieval-Augmented Generation (RAG)** backend powered by LangChain/LanceDB/MongoDB, and a **Smart Multi-Agent (SMA)** real-time web intelligence system powered by CrewAI and Gemini AI.

---

## 🌟 Architecture Overview

```
                      +----------------------------------+
                      |   React 18 + Vite Frontend       |
                      |   (chatbot-ui / Port 3000)       |
                      +----------------+-----------------+
                                       |
           +---------------------------+---------------------------+
           |                                                       |
+----------v------------------+                         +----------v------------------+
|  RAG Backend Service        |                         |  SMA Multi-Agent Service    |
|  (FastAPI / Port 8009)      |                         |  (FastAPI / Port 8002)      |
+----------+------------------+                         +----------+------------------+
           |                                                       |
+----------v------------------+                         +----------v------------------+
|  MongoDB + LanceDB / Qdrant |                         |  CrewAI + Web Scraper       |
|  (Port 27017)               |                         |  (DuckDuckGo / Tavily)      |
+-----------------------------+                         +-----------------------------+
```

---

## 🚀 Key Features

- **Multi-Model Intelligence**: Seamless coordination between Google Gemini AI, local Ollama / Llama3 (`llama3:8b-instruct-q4_K_M`), and Modal platform custom Llama3 endpoints via `coordinationService.js`.
- **Retrieval-Augmented Generation (RAG)**: Fast document indexing and retrieval over academic regulations, schedules, and program FAQs.
- **Smart Multi-Agent (SMA) Web Search**: Automated web scraping and news aggregation targeting official university portals (`eniad.ump.ma`).
- **Interactive UI & Multilingual Support**: Built with React 18, Tailwind CSS, Material-UI, speech synthesis (Text-to-Speech), and bilingual support (French & Arabic).
- **Firebase Authentication & Firestore Sync**: Persistent cloud sync for user profile settings and chat history.
- **Containerized & CI/CD Ready**: Native Docker Compose setup and GitHub Actions workflows targeting local Linux runners (`dual_portfolio_linux_runner`).

---

## 📡 Service Port Mapping

| Service | Technology | Internal Port | Environment Variable |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | React 18 / Vite / Nginx | `3000` / `80` | `VITE_PORT` |
| **RAG Service** | Python 3.12 / FastAPI | `8009` | `VITE_RAG_API_URL=http://localhost:8009` |
| **SMA Service** | Python 3.12 / FastAPI / CrewAI | `8002` | `VITE_SMA_API_URL=http://localhost:8002` |
| **MongoDB** | MongoDB 7.0 | `27017` | `MONGODB_URL=mongodb://localhost:27017` |
| **Local Ollama** | Ollama / Llama3 | `11434` | `OLLAMA_BASE_URL=http://localhost:11434` |

---

## 💻 Local Installation & Setup

### Prerequisites
- Node.js >= 18.x
- Python >= 3.10
- MongoDB instance (local or Docker)

### 1. Clone & Configure Environment Variables
```bash
git clone https://github.com/ennajari/ENIAD-ASSISTANT.git
cd ENIAD-ASSISTANT

# Create root and service environment files
cp .env.example .env
cp chatbot-ui/.env.example chatbot-ui/.env
cp SMA_Service/.env.example SMA_Service/.env
```

### 2. Install Dependencies
```bash
# Install Python backend dependencies
pip install -r requirements.txt

# Install Frontend dependencies
cd chatbot-ui
npm install
cd ..
```

### 3. Run Microservices

**Terminal 1: Start RAG Service (Port 8009)**
```bash
cd RAG_Project/src
python main.py
```

**Terminal 2: Start SMA Service (Port 8002)**
```bash
cd SMA_Service
python main.py
```

**Terminal 3: Start Frontend App (Port 3000)**
```bash
cd chatbot-ui
npm run dev
```

---

## 🐳 Docker Deployment

To launch all microservices simultaneously with Docker Compose:

```bash
docker-compose up --build -d
```

Check running containers:
```bash
docker-compose ps
```

---

## ⚙️ CI/CD Runner Configuration (`dual_portfolio_linux_runner`)

The repository includes a GitHub Actions pipeline (`.github/workflows/ci-cd.yml`) configured for custom Linux runners:

- **Runner Identifier**: `dual_portfolio_linux_runner` (`local-linux-runner:latest`, Container ID: `5da2569f49af`)
- **Workflow Pipeline Jobs**:
  1. **Lint & Formatting**: Runs `eslint` and Python compilation checks.
  2. **Test Suite**: Executes `pytest` on `tests/`.
  3. **Security Scan**: Audits secret leaks and dependency vulnerabilities.
  4. **Docker Validation**: Builds and verifies microservice containers.

---

## 🧪 Testing Suite

Run all backend unit tests locally using `pytest`:

```bash
pytest tests/ -v
```

Run frontend build verification:
```bash
cd chatbot-ui
npm run build
```

---

## 🛡️ Security Policy

Please refer to [SECURITY.md](SECURITY.md) for vulnerability disclosure guidelines. **Never commit `.env` secret files or raw PAT tokens to version control.**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
