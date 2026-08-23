# 🎓 ENIAD-ASSISTANT: Enterprise AI Academic Platform

[![CI/CD Pipeline](https://github.com/ennajari/ENIAD-ASSISTANT/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/ennajari/ENIAD-ASSISTANT/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
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
    User([Student / Professor]) <--> UI[Frontend Web App - React 18 / Vite<br/>Port: 3000 (Local) / 80 (Docker)]
    UI <--> RAG[RAG Service - FastAPI<br/>Port: 8009]
    UI <--> SMA[SMA Multi-Agent Service - FastAPI<br/>Port: 8002]
    UI <--> Modal[Custom Model Server - Modal API<br/>Llama-3 8B Fine-tuned]

    RAG <--> VectorDB[(LanceDB / Qdrant Vector Store)]
    SMA <--> Gemini[Google Gemini AI Engine]
    SMA <--> WebScraper[ENIAD / UMP Real-Time Web Scrapers]
```

### Microservice Port Map

| Component | Technology | Port | API Endpoint Base | Directory Location |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend UI** | React 18 + Vite + MUI | **3000** | `http://localhost:3000` | [`frontend/`](frontend/) |
| **SMA Service** | FastAPI + CrewAI + Gemini | **8002** | `http://localhost:8002/sma/intelligent-query` | [`services/sma-service/`](services/sma-service/) |
| **RAG Service** | FastAPI + LanceDB / Qdrant | **8009** | `http://localhost:8009/search/eniadassistant` | [`services/rag-service/`](services/rag-service/) |
| **MongoDB** | Database | **27017** | `mongodb://localhost:27017` | Standard Container |

---

## 📂 Repository Directory Map

```text
ENIAD-ASSISTANT/
├── .github/                      # CI/CD Workflows, Dependabot, Issue & PR Templates
│   ├── workflows/ci-cd.yml       # GitHub Actions CI/CD Pipeline
│   └── dependabot.yml            # Security scanner configuration
├── frontend/                     # React 18 + Vite Conversational Web UI (Port 3000)
│   ├── src/                      # UI Components, State Contexts & API Services
│   └── Dockerfile                # Nginx multi-stage build container
├── services/                     # Microservice Backend Applications
│   ├── rag-service/              # RAG Vector Search Microservice (Port 8009)
│   │   ├── src/                  # FastAPI Routes, LanceDB/Qdrant Vector DB Stores
│   │   └── data/                 # ENIAD Academic PDF & Text Documents
│   └── sma-service/              # Multi-Agent Web Intelligence Service (Port 8002)
│       ├── agents/               # Autonomous Agents (WebScraper, ContentAnalyzer, RAG)
│       └── crew/                 # CrewAI Multi-Agent Task Orchestrations
├── deployments/                  # Cloud & Infrastructure Deployments
│   └── modal/                    # Custom Fine-Tuned Llama-3 8B Serving Scripts
├── notebooks/                    # AI Research, Fine-Tuning & Deployment Notebooks
├── docs/                         # Project Documentation & Reports
│   ├── wiki/                     # Official Project Technical Wiki Documentation
│   └── reports/                  # Academic PFA Reports & Integration Results
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

#### Frontend (`frontend`):
```bash
cd frontend
npm install
npm run dev
```

#### RAG Microservice (`services/rag-service`):
```bash
cd services/rag-service
pip install -r src/requirements.txt
python src/main.py
```

#### SMA Microservice (`services/sma-service`):
```bash
cd services/sma-service
pip install -r requirements.txt
python main.py
```

#### Automated Unit Tests:
```bash
pytest tests/ -v
```

---

## ✅ Testing & CI/CD

- **Unit & integration tests**: `pytest` suite under [`tests/`](tests/) covering the RAG and SMA backend endpoints (`pytest tests/ -v`).
- **Continuous Integration**: [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) runs on every push/PR to `main` — Python syntax checks, frontend build, the pytest suite, a `.env`-leak guard, and a `docker compose config` validation. See the live status via the badge at the top of this README.
- **Dependency updates**: automated via [`.github/dependabot.yml`](.github/dependabot.yml) (npm for `frontend/`, pip for both microservices).

---

## 📖 Complete Documentation & Wiki

For in-depth architecture diagrams, API contracts, deployment guides, and troubleshooting:
👉 **[Visit the Official ENIAD-ASSISTANT GitHub Wiki](https://github.com/ennajari/ENIAD-ASSISTANT/wiki)** (mirrored under [`docs/wiki/`](docs/wiki/) in this repo)
👉 **[System Architecture Guide](ARCHITECTURE.md)** — microservice topology, data pipelines, and multi-agent workflow internals.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md) for the workflow and coding standards, and [`CODE_OF_CONDUCT.md`](.github/CODE_OF_CONDUCT.md) for community guidelines.

## 🔐 Security

To report a vulnerability, please follow the responsible-disclosure process described in [`SECURITY.md`](SECURITY.md) rather than opening a public issue.

## 📝 Changelog

Notable changes to this project are tracked in [`CHANGELOG.md`](CHANGELOG.md), following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

## 📄 License

This project is licensed under the **MIT License** — see [`LICENSE`](LICENSE) for the full text.

## 👤 Authors & Contributors

The "AI Engineering Team" table above lists the academic PFA project roles. Actual repository commit history (`git log`) additionally reflects:

- **Abdellah Ennajari** ([@ennajari](https://github.com/ennajari)) — repository owner
- **Oussama EL-HADJI** ([@Bosaj](https://github.com/Bosaj)) — frontend, SMA multi-agent service
- **Abdelilah Ourti** — RAG vector DB pipeline

Ahmed Oukacha's fine-tuning work (`ahmed-ouka/llama3-8b-eniad-merged-32bit`) was carried out outside this repository (Colab/Hugging Face) and is referenced but not committed here.
