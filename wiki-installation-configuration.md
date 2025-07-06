# Installation et Configuration

Ce guide vous accompagne dans l'installation complète d'ENIAD-ASSISTANT sur votre système.

## 📋 Prérequis système

### Minimum requis
- **OS** : Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Python** : 3.10 ou supérieur
- **Node.js** : 18.0 ou supérieur
- **RAM** : 8 GB minimum, 16 GB recommandé
- **Stockage** : 10 GB d'espace libre
- **Réseau** : Connexion internet pour les API externes

### Recommandé
- **Docker** : 20.10+ avec Docker Compose
- **Git** : Pour le contrôle de version
- **VS Code** : Éditeur recommandé avec extensions Python et TypeScript

## 🐳 Installation avec Docker (Recommandée)

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/ENIAD-ASSISTANT.git
cd ENIAD-ASSISTANT
```

### 2. Configuration des variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env
nano .env
```

Variables essentielles :
```env
# Configuration LLM
OPENAI_API_KEY=sk-your-openai-key
LLAMA_API_URL=https://your-llama-endpoint.com

# Base de données
MONGODB_URI=mongodb://localhost:27017/eniad_assistant

# Application
ENV=development
PORT=8501
DEBUG=true
```

### 3. Démarrer les services

```bash
# Construire et démarrer tous les services
docker-compose up -d

# Vérifier le statut
docker-compose ps
```

### 4. Vérification de l'installation

```bash
# Tester l'API
curl http://localhost:8501/health

# Tester l'interface web
curl http://localhost:3000
```

## 🔧 Installation manuelle

### 1. Installation Python et dépendances

```bash
# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement (Windows)
venv\Scripts\activate

# Activer l'environnement (Linux/macOS)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
pip install -r RAG/requirements.txt
```

### 2. Installation Node.js et frontend

```bash
# Aller dans le dossier frontend
cd chatbot-ui

# Installer les dépendances
npm install

# Construire le projet
npm run build
```

### 3. Configuration de la base de données

```bash
# Installer MongoDB (Ubuntu)
sudo apt-get install mongodb

# Démarrer MongoDB
sudo systemctl start mongodb

# Créer la base de données
mongo
> use eniad_assistant
> db.createCollection("conversations")
> exit
```

### 4. Initialisation des données

```bash
# Indexer les documents
cd RAG/src
python create_index.py

# Charger les FAQ
python load_documents.py
```

## ⚙️ Configuration avancée

### Configuration LLM

```python
# RAG/src/config.py
LLM_CONFIG = {
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "max_tokens": 1000,
    "timeout": 30
}

EMBEDDING_CONFIG = {
    "model": "text-embedding-ada-002",
    "chunk_size": 1000,
    "chunk_overlap": 200
}
```

### Configuration de la base vectorielle

```python
# Configuration Chroma
VECTOR_DB_CONFIG = {
    "persist_directory": "./chroma_db",
    "collection_name": "eniad_documents",
    "distance_metric": "cosine"
}
```

### Configuration du serveur web

```javascript
// next.config.js
module.exports = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8501',
    WEBSOCKET_URL: process.env.WEBSOCKET_URL || 'ws://localhost:8501/ws'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8501/api/:path*'
      }
    ]
  }
}
```

## 🔐 Configuration de sécurité

### 1. Authentification

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h

# OAuth (optionnel)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. CORS et sécurité

```python
# app/config/security.py
CORS_ORIGINS = [
    "http://localhost:3000",
    "https://your-domain.com"
]

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block"
}
```

## 📊 Monitoring et logs

### Configuration des logs

```python
# config/logging.py
LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'detailed': {
            'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        }
    },
    'handlers': {
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'eniad_assistant.log',
            'formatter': 'detailed'
        }
    },
    'loggers': {
        'eniad_assistant': {
            'handlers': ['file'],
            'level': 'INFO'
        }
    }
}
```

## 🧪 Tests de l'installation

### Tests automatisés

```bash
# Tests Python
python -m pytest tests/ -v

# Tests frontend
cd chatbot-ui
npm test

# Tests d'intégration
python -m pytest tests/integration/ -v
```

### Tests manuels

```bash
# Test du système RAG
cd RAG
python app.py
# Poser une question test

# Test de l'API
curl -X POST http://localhost:8501/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test de connexion"}'

# Test de l'interface web
# Ouvrir http://localhost:3000 dans le navigateur
```

## 🔧 Dépannage courant

### Problèmes Python

```bash
# Erreur de dépendances
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall

# Problème d'encodage
export PYTHONIOENCODING=utf-8
```

### Problèmes Node.js

```bash
# Nettoyer le cache npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Problème de permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm
```

### Problèmes Docker

```bash
# Reconstruire les images
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Nettoyer Docker
docker system prune -a
```

## 📝 Prochaines étapes

Après l'installation réussie :

1. [Configuration des données](Personnalisation-Donnees)
2. [Guide utilisateur](Guide-Utilisateur)
3. [Administration](Guide-Administration)
4. [Déploiement en production](Deploiement-Production)

---

💡 **Besoin d'aide ?** Consultez la [FAQ](FAQ) ou contactez le [support](Contact-Support).
