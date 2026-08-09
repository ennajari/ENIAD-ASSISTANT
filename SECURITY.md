# Security Policy

## 🔒 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.0.x   | :x:                |

---

## 🛡️ Reporting a Vulnerability

If you discover a security vulnerability within the **ENIAD Academic Assistant** repository, please follow these reporting steps:

1. **Do NOT open a public GitHub issue.**
2. Send a detailed report to the repository security maintainers.
3. Include the following information:
   - Type of issue (e.g., secret leak, API vulnerability, XSS, insecure endpoint).
   - Step-by-step instructions to reproduce the vulnerability.
   - Potential impact of the issue.

---

## 🔑 Secret & Credential Protection

- **Strict Exclusion**: All `.env`, `.env.local`, `.env.*.local`, credentials, and token files are explicitly listed in `.gitignore` and **must never be committed**.
- **Automated Scanning**: The CI/CD pipeline runs secret scanning jobs on every push to detect uncommitted API tokens or PATs.
- **Revocation**: If a token is accidentally committed, it must be revoked immediately via the provider platform.
