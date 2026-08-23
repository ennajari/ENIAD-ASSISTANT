# Changelog

All notable changes to the **ENIAD Academic Assistant** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

Work merged into `main` since the `v2.0.0` tag (not yet released as a version bump):

### Added
- Hybrid Search combining BM25 and vector similarity via Reciprocal Rank Fusion in the RAG service.
- JWT authentication dependency for RAG endpoints.
- `AgentProgressVisualizer` frontend component and Server-Sent Events (SSE) streaming endpoint for real-time agent progress.
- Async `aiofiles`-based document indexing in the RAG service.
- Dedicated `frontend/Dockerfile` and corrected service paths across all Dockerfiles.
- Expanded automated test coverage from 4 to 17 unit/integration tests across the RAG and SMA microservices.
- `pyrightconfig.json` / VS Code workspace settings for consistent Python type-checking (Pyright/Pyrefly).

### Changed
- Repository re-organized into a standard monorepo layout (`frontend/`, `services/rag-service/`, `services/sma-service/`).
- SMA service migrated to an async lifespan manager.
- `requirements.txt` dependency bounds updated to resolve known vulnerable versions; CI dependency resolution optimized.
- `dependabot.yml` reconfigured to track the current microservice paths.

### Fixed
- SonarLint findings (S6772, S3358, S7503, S112, S7493, S6582, S8786, S2245, and others) across the RAG and SMA services.
- CORS middleware configuration regression in the RAG service.
- Removed an accidental stray build-artifact file (`frontend/str`) that had been committed by mistake.

### Security
- **Historical credential exposure**: earlier commits on this repository's history contain committed `.env` files (under the pre-restructure `RAG/` and `chatbot-ui/` paths) with a real third-party API key and a real Firebase client configuration. These paths are no longer present on `main` and are excluded via `.gitignore`, but the values remain readable in git history. **The affected API key and Firebase project credentials should be rotated/revoked by their owner**; this PR does not (and cannot) remove them from history and does not reproduce the values here.
- **Tracked secret removed**: `.clerk/.tmp/keyless.json`, a Clerk "keyless mode" development credentials file containing a live test-mode secret key, was tracked in the repository despite `.clerk/` being listed in `.gitignore` (the ignore rule was added after the file was first committed). It has been removed from tracking in this PR. Because it was previously committed, **the corresponding Clerk keyless instance should still be revoked/rotated** from the Clerk dashboard as a precaution.

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
