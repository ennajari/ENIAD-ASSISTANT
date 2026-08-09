# Changelog

All notable changes to the **ENIAD Academic Assistant** project will be documented in this file.

The format is based on [Keep a Changelog](https.keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-08-09

### 🚀 Production Launch & Architectural Overhaul
- **Frontend Modernization**: Replaced legacy Next.js setup with a high-performance React 18 + Vite + Tailwind CSS application (`chatbot-ui/`).
- **Microservices Restructuring**:
  - Flattened `RAG_Project` as an integrated FastAPI backend service running on port **8009**.
  - Integrated `SMA_Service` (Smart Multi-Agent system) running on port **8002**.
- **Model Coordination**: Unified multi-provider routing in `coordinationService.js`:
  - Google Gemini AI (`gemini-1.5-flash`).
  - Local Ollama / Llama3 (`llama3:8b-instruct-q4_K_M`).
  - Modal Platform custom endpoint (`https://testermodal--llama3-openai-compatible-serve.modal.run`).
- **Port Harmonization**: Fixed default API fallback ports across `realSmaService.js`, `smaService.js`, and `ragApiService.js`.
- **Security & Secret Protection**:
  - Centralized GitHub PAT management (`Big_Boss_PAT_Github`, `GITHUB_PERSONAL_ACCESS_TOKEN`, `REPO_PAT`).
  - Enforced strict `.gitignore` rules across all microservice directories to prevent credential leaks.
- **Docker & CI/CD Pipelines**:
  - Added multi-container `docker-compose.yml` for local & production deployment.
  - Added GitHub Actions pipeline (`.github/workflows/ci-cd.yml`) targeting self-hosted runner `dual_portfolio_linux_runner`.
- **Testing Suite**: Added `pytest` test suite in `tests/` covering RAG and SMA backend endpoints.

---

## [1.0.0] - 2025-04-15

### 📦 Initial Prototype
- Initial implementation of ENIAD Chatbot UI.
- Basic RAG system setup and MongoDB document index.
- Preliminary multi-language support (French & Arabic).
