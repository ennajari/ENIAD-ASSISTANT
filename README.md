# 🎓 ENIAD-ASSISTANT: Enterprise AI Academic Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-Multi--Container-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)

**ENIAD-ASSISTANT** is an enterprise conversational AI assistant engineered for **École Nationale d'Intelligence Artificielle et du Digital (ENIAD)** at **Université Mohammed Premier (UMP)** in Oujda, Morocco.

The system combines **Hybrid Vector RAG Search**, an autonomous **Multi-Agent Web Scraper (SMA)**, and a custom **Fine-Tuned Llama-3 8B LLM Model** deployed on serverless GPU infrastructure.

---

## 👥 The ENIAD AI Engineering Team

This platform was developed as part of the **Projet de Fin d'Année (PFA)** by a team of **4 AI Engineers**:

| AI Engineer | Official Role | Domain & Core Contributions |
| :--- | :--- | :--- |
| **Abdellah ENNAJARI** | **Lead AI & MLOps Engineer** | Microservice System Architecture, CI/CD Pipeline Automation, Multi-stage Docker Containerization, System Integration & Service Port Harmonization |
| **Ahmed OUKACHA** | **AI Systems & Fine-Tuning Specialist** | Custom Fine-Tuned Llama-3 8B Academic Model (`ahmed-ouka/llama3-8b-eniad-merged-32bit`), Model Server & Modal Platform API Integration |
| **Oussama ELHADJI** | **Full-Stack AI UI & SMA Multi-Agent Engineer** | React 18 + Vite Conversational Frontend UI, Real-Time Agent Streaming, SMA Multi-Agent Web Intelligence Service & Web Scrapers |
| **Abdelilah OURTI** | **Vector DB & RAG Pipeline Engineer** | LanceDB / Qdrant Vector Store Indexing, Academic Document Embedding Pipelines, RAG Query Optimizations & Fast Search Backend |

---

## 🏛️ System Architecture & Service Network Matrix

```mermaid
graph TD
    User([Student / Professor]) <--> UI[Chatbot UI - React 18 / Vite<br/>Port: 3000 (Local) / 80 (Docker)]
    UI <--> RAG[RAG Service - FastAPI<br/>Port: 8009]
    UI <--> SMA[SMA Multi-Agent Service - FastAPI<br/>Port: 8002]
    UI <--> Modal[Custom Model Server - Modal API<br/>Llama-3 8B Fine-tuned]

    RAG <--> VectorDB[(LanceDB / Qdrant Vector Store)]
    SMA <--> Gemini[Google Gemini AI Engine]
    SMA <--> WebScraper[ENIAD / UMP Real-Time Web Scrapers]
```

### Microservice Port Map

| Component | Technology | Port | API Endpoint Base |
| :--- | :--- | :--- | :--- |
| **Chatbot UI** | React 18 + Vite + MUI | **3000** | `http://localhost:3000` |
| `SMA_Service` | FastAPI + CrewAI + Gemini | **8002** | `http://localhost:8002/sma/intelligent-query` |
| `RAG_Project` | FastAPI + LanceDB / Qdrant | **8009** | `http://localhost:8009/search/eniadassistant` |
| `MongoDB` | Database | **27017** | `mongodb://localhost:27017` |

---

## 📂 Repository Directory Map

```text
ENIAD-ASSISTANT/
├── .github/                      # CI/CD Workflows, Dependabot, Issue & PR Templates
│   ├── workflows/ci-cd.yml       # GitHub Actions CI/CD Pipeline
│   └── dependabot.yml            # Security scanner configuration
├── chatbot-ui/                   # React 18 + Vite Conversational Frontend (Port 3000)
│   ├── src/                      # UI Components, State Contexts & API Services
│   └── Dockerfile                # Nginx multi-stage build container
├── RAG_Project/                  # RAG Vector Search Microservice (Port 8009)
│   ├── src/                      # FastAPI Routes, LanceDB/Qdrant Vector DB Stores
│   └── data/                     # ENIAD Academic PDF & Text Documents
├── SMA_Service/                  # Multi-Agent Web Intelligence Service (Port 8002)
│   ├── agents/                   # Autonomous Agents (WebScraper, ContentAnalyzer, RAG)
│   └── crew/                     # CrewAI Multi-Agent Task Orchestrations
├── deploy_code/                  # Custom Fine-Tuned Llama-3 8B Deployment Scripts
│   └── app.py                    # Modal Serverless Serving script
├── docs/wiki/                    # Official Project Technical Wiki Documentation
├── tests/                        # Automated Pytest Suite
└── docker-compose.yml            # Multi-Container Production Deployer
```

---

## ⚡ Quickstart Guide

### 1. Run Local Microservices with Docker Compose

```bash
git clone https://github.com/ennajari/ENIAD-ASSISTANT.git
cd ENIAD-ASSISTANT
docker compose up -d --build
```
Access the application at `http://localhost:3000`.

### 2. Manual Development Setup

#### Frontend (`chatbot-ui`):
```bash
cd chatbot-ui
npm install
npm run dev
```

#### RAG Microservice (`RAG_Project`):
```bash
cd RAG_Project
pip install -r src/requirements.txt
python src/main.py
```

#### SMA Microservice (`SMA_Service`):
```bash
cd SMA_Service
pip install -r requirements.txt
python main.py
```

#### Automated Unit Tests:
```bash
pytest tests/ -v
```

---

## 📖 Complete Documentation & Wiki

For in-depth architecture diagrams, API contracts, deployment guides, and troubleshooting:
👉 **[Visit the Official ENIAD-ASSISTANT GitHub Wiki](https://github.com/ennajari/ENIAD-ASSISTANT/wiki)**
