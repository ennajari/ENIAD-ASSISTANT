# Contributing to ENIAD-ASSISTANT

Thank you for your interest in contributing to **ENIAD-ASSISTANT**! This project is maintained by the **ENIAD AI Engineering PFA Team** at **École Nationale d'Intelligence Artificielle et du Digital (ENIAD)**, Université Mohammed Premier (UMP), Oujda, Morocco.

---

## 👥 Core AI Engineering Team

- **Abdellah ENNAJARI** – Lead AI & MLOps Engineer (*Architecture, SMA Multi-Agent, CI/CD Pipeline*)
- **Ahmed OUKACHA** – AI Systems & Fine-Tuning Specialist (*Fine-tuned Llama-3 8B, Model API Server*)
- **Oussama ELHADJI** – Vector Indexing & RAG Engineer (*LanceDB / Qdrant RAG Pipeline*)
- **Abdelilah OURTI** – Full-Stack AI Interface Developer (*React 18 + Vite Conversational UI*)

---

## 🌿 Branching Workflow

1. **Production Branch**: `main` — Always stable, production-ready, passing all CI/CD pipelines.
2. **Development Branch**: `dev-oussama` — Active development and integration branch.
3. **Feature Branches**: `feature/<feature-name>` — Short-lived branches off `dev-oussama`.

---

## 🛠️ Development & Pull Request Rules

1. **Pull Requests**: Submit all PRs against the `dev-oussama` branch.
2. **Linting & Code Quality**: Enforce 0 warnings in ESLint/SonarLint and Flake8.
3. **Unit Testing**: Ensure all unit tests pass locally before pushing (`pytest tests/`).
4. **Secret Protection**: Never commit `.env` files or hardcoded credentials.

---

## 🧪 Running Tests

```bash
pytest tests/ -v
```

Thank you for adhering to our engineering standards!
