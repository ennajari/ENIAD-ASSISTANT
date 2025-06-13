# 🔧 Git Management Guide - ENIAD Academic Assistant

## 📋 **Overview**

This guide explains the Git configuration and management practices for the ENIAD Academic Assistant project, including submodule handling, file organization, and collaboration workflows.

---

## 📁 **Project Structure**

```
ENIAD-ASSISTANT/
├── .git/                           # Git repository data
├── .gitignore                      # Files to ignore
├── .gitmodules                     # Submodule configuration
├── .gitattributes                  # File handling rules
├── RAG_Project/                    # Submodule (colleague's RAG system)
├── SMA_Service/                    # Smart Multi-Agent service
├── chatbot-ui/                     # Frontend React application
├── data/                           # JSON data files
├── requirements*.txt               # Python dependencies
└── *.md                           # Documentation files
```

---

## 🔍 **Git Configuration Files**

### **📝 .gitignore**
Comprehensive ignore patterns for:
- **🐍 Python**: `__pycache__/`, `venv/`, `.env`, `*.pyc`
- **📦 Node.js**: `node_modules/`, `dist/`, `*.log`
- **🔧 Development**: `.vscode/`, `.idea/`, `*.swp`
- **🔐 Security**: API keys, credentials, secrets
- **📊 Data**: Temporary files, logs, caches
- **🧠 SMA Service**: Virtual environments, logs, temp files
- **🤖 RAG Project**: Submodule-specific ignores

### **📋 .gitmodules**
Submodule configuration:
- **RAG_Project**: Colleague's repository
- **Update strategy**: Manual (`update = none`)
- **Ignore dirty**: Prevents status pollution
- **Branch tracking**: `main` branch

### **🎯 .gitattributes**
File handling rules:
- **Line endings**: LF for source code, CRLF for Windows scripts
- **Binary detection**: Images, documents, executables
- **Language detection**: Proper GitHub language statistics
- **Diff settings**: Special handling for JSON, YAML, Jupyter notebooks
- **Security**: Sensitive file marking

---

## 🤖 **Submodule Management**

### **RAG_Project Submodule**
The RAG_Project is maintained by a colleague and included as a submodule.

#### **Initial Setup**
```bash
# Clone with submodules
git clone --recursive https://github.com/ennajari/ENIAD-ASSISTANT.git

# Or initialize submodules after cloning
git submodule init
git submodule update
```

#### **Working with Submodules**
```bash
# Check submodule status
git submodule status

# Update submodule to latest commit
cd RAG_Project
git pull origin main
cd ..
git add RAG_Project
git commit -m "update: RAG_Project to latest version"

# Update all submodules
git submodule update --remote

# Reset submodule to committed version
git submodule update --init --recursive
```

#### **Submodule Best Practices**
- **Don't modify** RAG_Project files directly
- **Coordinate updates** with colleague
- **Test integration** after submodule updates
- **Document changes** when updating submodule reference

---

## 🌿 **Branching Strategy**

### **Main Branches**
- **`main`**: Production-ready code
- **`dev-oussama`**: Development branch
- **`feature/*`**: Feature development
- **`hotfix/*`**: Critical fixes

### **Branch Workflow**
```bash
# Create feature branch
git checkout -b feature/sma-enhancement dev-oussama

# Work on feature
git add .
git commit -m "feat: add new SMA functionality"

# Push feature branch
git push origin feature/sma-enhancement

# Merge back to dev
git checkout dev-oussama
git merge feature/sma-enhancement
git push origin dev-oussama
```

---

## 📦 **Commit Conventions**

### **Commit Message Format**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### **Types**
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Maintenance tasks

### **Examples**
```bash
git commit -m "feat(sma): add web scraping agent with CrewAI"
git commit -m "fix(ui): resolve chat input focus issue"
git commit -m "docs: update SMA service documentation"
git commit -m "chore: update dependencies to latest versions"
```

---

## 🔐 **Security Practices**

### **Sensitive Files**
Never commit:
- **API keys**: OpenAI, Firebase, etc.
- **Environment files**: `.env`, `.env.local`
- **Credentials**: `secrets.json`, `credentials.json`
- **Private keys**: `*.key`, `*.pem`

### **Environment Variables**
```bash
# Use .env.example as template
cp .env.example .env
# Edit .env with your actual values
# .env is automatically ignored by .gitignore
```

### **Pre-commit Checks**
```bash
# Check for sensitive data before committing
git diff --cached | grep -E "(api_key|password|secret|token)"

# Use git-secrets tool (recommended)
git secrets --scan
```

---

## 🚀 **Deployment Workflow**

### **Development to Production**
```bash
# 1. Ensure dev branch is ready
git checkout dev-oussama
git pull origin dev-oussama

# 2. Merge to main
git checkout main
git merge dev-oussama

# 3. Tag release
git tag -a v1.0.0 -m "Release version 1.0.0"

# 4. Push everything
git push origin main
git push origin --tags
```

### **Hotfix Workflow**
```bash
# 1. Create hotfix from main
git checkout main
git checkout -b hotfix/critical-bug-fix

# 2. Fix and commit
git add .
git commit -m "fix: resolve critical security issue"

# 3. Merge to main and dev
git checkout main
git merge hotfix/critical-bug-fix
git checkout dev-oussama
git merge hotfix/critical-bug-fix

# 4. Push and tag
git push origin main
git push origin dev-oussama
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin --tags
```

---

## 🔧 **Maintenance Tasks**

### **Regular Cleanup**
```bash
# Remove merged branches
git branch --merged | grep -v "\*\|main\|dev" | xargs -n 1 git branch -d

# Clean up remote tracking branches
git remote prune origin

# Garbage collection
git gc --prune=now
```

### **Submodule Maintenance**
```bash
# Check for submodule updates
git submodule foreach git fetch

# Update submodule references
git submodule update --remote --merge

# Sync submodule URLs
git submodule sync --recursive
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Submodule Problems**
```bash
# Submodule appears as modified but no changes
git submodule update --init --recursive

# Submodule stuck in detached HEAD
cd RAG_Project
git checkout main
cd ..
git add RAG_Project
git commit -m "fix: update RAG_Project to main branch"
```

#### **Line Ending Issues**
```bash
# Fix line endings globally
git config --global core.autocrlf input  # Linux/macOS
git config --global core.autocrlf true   # Windows

# Refresh repository with correct line endings
git rm --cached -r .
git reset --hard
```

#### **Large File Issues**
```bash
# Remove large files from history (use carefully)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/large/file' \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 📚 **Additional Resources**

### **Git Commands Reference**
- [Git Documentation](https://git-scm.com/docs)
- [Git Submodules Guide](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Conventional Commits](https://www.conventionalcommits.org/)

### **Tools**
- **Git GUI**: GitKraken, SourceTree, GitHub Desktop
- **VS Code Extensions**: GitLens, Git Graph
- **Command Line**: git-extras, hub, gh

---

## 🤝 **Collaboration Guidelines**

### **For Team Members**
1. **Always pull** before starting work
2. **Use feature branches** for new development
3. **Write descriptive** commit messages
4. **Test thoroughly** before pushing
5. **Coordinate** submodule updates

### **For External Contributors**
1. **Fork** the repository
2. **Create feature branch** from `dev-oussama`
3. **Follow commit conventions**
4. **Submit pull request** with clear description
5. **Respond to** code review feedback

---

**🔧 Efficient Git Management for Academic Excellence**
