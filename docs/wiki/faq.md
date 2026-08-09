# ❓ Frequently Asked Questions & Troubleshooting Guide

Common issues, diagnostics, and solutions for developers working on **ENIAD-ASSISTANT**.

---

## 1. Port Conflict & Service Binding Errors

### Problem: `Error: listen EADDRINUSE: already in use :::8002` or `:::8009`

### Solution:
Verify running processes using PowerShell:
```powershell
Get-NetTCPConnection -LocalPort 8002,8009 -ErrorAction SilentlyContinue | Select-Object LocalPort, OwningProcess
```
Kill conflicting processes or launch via Docker Compose:
```powershell
docker compose restart
```

---

## 2. RAG Microservice Document Search Returns Empty Chunks

### Problem: `POST /search/eniadassistant` returns `[]`.

### Solution:
Verify that academic PDFs exist in `RAG_Project/data/` and re-index vector embeddings:
```bash
python RAG_Project/src/main.py --reindex
```

---

## 3. SMA Scraper Returns HTTP 403 / Forbidden

### Problem: `web_scraper_agent.py` fails to parse ENIAD portal.

### Solution:
Ensure `GEMINI_API_KEY` is present in `SMA_Service/.env`. The SMA service automatically uses Google Gemini AI fallback extraction when scrapers encounter anti-bot protection.

---

## 4. Frontend `npm run build` Lockfile Mismatch

### Problem: `npm ci` fails due to lockfile drift.

### Solution:
Sync lockfile dependencies:
```bash
cd chatbot-ui
npm install
git add package-lock.json
```
