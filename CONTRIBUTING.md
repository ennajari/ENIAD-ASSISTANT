# Contributing to ENIAD Academic Assistant

Thank you for your interest in contributing to the **ENIAD Academic Assistant** project! This document outlines our development standards, workflow rules, and pull request procedures.

---

## 🛠️ Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ennajari/ENIAD-ASSISTANT.git
   cd ENIAD-ASSISTANT
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` in the root folder and in subfolders (`chatbot-ui/`, `SMA_Service/`):
   ```bash
   cp .env.example .env
   cp chatbot-ui/.env.example chatbot-ui/.env
   cp SMA_Service/.env.example SMA_Service/.env
   ```

3. **Install Dependencies**:
   - **Python Backends**:
     ```bash
     pip install -r requirements.txt
     ```
   - **Frontend UI**:
     ```bash
     cd chatbot-ui
     npm install
     ```

---

## 🌿 Branching Policy

- **`main`**: Production branch. Must always pass CI/CD pipeline tests.
- **`dev-<author>`**: Feature development branch (e.g. `dev-oussama`).
- **Feature Branches**: Name feature branches as `feature/<short-description>` or `fix/<bug-description>`.

---

## 🧪 Testing & Linting

Before submitting a Pull Request, verify your changes locally:

1. **Frontend Lint & Build**:
   ```bash
   cd chatbot-ui
   npm run lint
   npm run build
   ```

2. **Backend Syntax & Unit Tests**:
   ```bash
   pytest tests/
   python -m py_compile SMA_Service/main.py RAG_Project/src/main.py
   ```

---

## 🚀 Submitting Pull Requests

1. Fill out the `.github/PULL_REQUEST_TEMPLATE.md`.
2. Ensure no secret keys or `.env` files are tracked in your commit history.
3. Link relevant GitHub Issues in your PR description (e.g., `Closes #1`).
