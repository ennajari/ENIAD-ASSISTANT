# 🧪 Testing & Code Quality Guide

This guide outlines the automated test suite, code quality rules, and security controls enforced across **ENIAD-ASSISTANT**.

---

## 1. Pytest Test Suite (`tests/`)

The automated unit test suite is located in `tests/` and configured via `pytest.ini`.

```text
tests/
├── conftest.py                   # Pytest Fixtures & Service Mocks
├── test_rag.py                   # RAG Microservice Initialization & Endpoint Tests
└── test_sma.py                   # SMA Microservice Initialization & Agent Tests
```

### Running Tests Locally:

```bash
pytest tests/ -v
```

### Sample Output:
```text
tests/test_rag.py::test_rag_app_initialization PASSED                    [ 25%]
tests/test_rag.py::test_rag_health_endpoint PASSED                       [ 50%]
tests/test_sma.py::test_sma_app_initialization PASSED                    [ 75%]
tests/test_sma.py::test_sma_health_endpoint PASSED                       [100%]
============================== 4 passed in 0.91s ==============================
```

---

## 2. Frontend Build & Quality Checks

In `chatbot-ui/`:

```bash
cd chatbot-ui
npm run lint      # ESLint code quality scan
npm run build     # Vite production build
```

Zero warning status is strictly enforced across ESLint and SonarLint rules (`S2486`, `S1481`, `S1763`, `S7780`, `S7773`).

---

## 3. Security Policy & Secret Exclusion

- `.env` files are strictly excluded from Git tracking via `.gitignore`.
- Secret scanning is enforced in the CI/CD pipeline job `security-scan`.
- Refer to [SECURITY.md](../../SECURITY.md) for vulnerability disclosure guidelines.
