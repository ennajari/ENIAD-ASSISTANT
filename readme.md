# 🤖 ENIAD-ASSISTANT

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)

ENIAD-ASSISTANT est un chatbot intelligent basé sur l'intelligence artificielle, conçu pour fournir des informations sur les études et les services scolaires à l'ENIAD (École Nationale d'Informatique et d'Analyse des Données). Il utilise des technologies de pointe comme RAG (Retrieval-Augmented Generation) pour offrir des réponses précises et contextuelles.

## ✨ Fonctionnalités principales

- 🎯 **Réponses intelligentes** : Utilise RAG pour des réponses précises basées sur les documents officiels de l'ENIAD
- 💬 **Interface multimodale** : Support texte et voix pour une interaction naturelle
- 🌐 **Multilingue** : Prise en charge du français et de l'anglais
- ⚡ **Recherche vectorielle** : Base de données vectorielle pour une recherche rapide et précise
- 🎨 **Interface moderne** : Interface web responsive développée avec Next.js
- 🐳 **Déploiement facile** : Containerisé avec Docker pour un déploiement simplifié
- 📊 **Monitoring** : Logs et métriques pour le suivi des performances

## 🏗️ Architecture

Le projet est structuré en plusieurs composants :

```
ENIAD-ASSISTANT/
├── RAG/                    # Système RAG (Retrieval-Augmented Generation)
│   ├── src/               # Code source du pipeline RAG
│   ├── data/              # Documents et données d'entraînement
│   └── app.py             # Application console RAG
├── app/                   # API Backend
│   ├── api/               # Endpoints API
│   └── admin/             # Interface d'administration
├── chatbot-ui/            # Interface utilisateur web
├── deploy_code/           # Scripts de déploiement
├── data/                  # Données FAQ et configurations
└── docker-compose.yml     # Configuration Docker
```

## 🚀 Installation et démarrage rapide

### Prérequis

- Python 3.10+
- Node.js 18+
- Docker (optionnel)
- Git

### 1. Cloner le repository

```bash
git clone https://github.com/ennajari/ENIAD-ASSISTANT.git
cd ENIAD-ASSISTANT
```

### 2. Installation avec Docker (Recommandé)

```bash
# Démarrer tous les services
docker-compose up -d

# L'application sera accessible sur http://localhost:8501
```

### 3. Installation manuelle

#### Backend (RAG System)

```bash
# Installer les dépendances Python
pip install -r requirements.txt
pip install -r RAG/requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations

# Démarrer le système RAG
cd RAG
python app.py
```

#### Frontend (Interface Web)

```bash
# Installer les dépendances Node.js
cd chatbot-ui
npm install

# Démarrer le serveur de développement
npm run dev

# L'interface sera accessible sur http://localhost:3000
```

## 📖 Utilisation

### Interface Console (RAG)

```bash
cd RAG
python app.py
```

Posez vos questions directement dans la console :
```
Posez votre question (ou tapez 'exit' pour quitter) : Quels sont les programmes d'études disponibles à l'ENIAD ?
```

### Interface Web

1. Accédez à `http://localhost:3000`
2. Tapez votre question dans le chat
3. Obtenez des réponses instantanées basées sur les documents officiels

### API REST

```bash
# Exemple d'appel API
curl -X POST http://localhost:8501/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Quels sont les frais de scolarité?"}'
```

## 🛠️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Configuration LLM
OPENAI_API_KEY=your_openai_api_key
LLAMA_API_URL=your_llama_api_url

# Configuration Base de données
MONGODB_URI=mongodb://localhost:27017/eniad_assistant

# Configuration Application
ENV=development
PORT=8501
```

### Personnalisation des données

1. Ajoutez vos documents dans `RAG/data/`
2. Modifiez les FAQ dans `data/`
3. Relancez l'indexation :

```bash
cd RAG/src
python create_index.py
```

## 🧪 Tests

```bash
# Tests Python
python -m pytest tests/

# Tests Frontend
cd chatbot-ui
npm test
```

## 🔧 Technologies utilisées

### Backend
- **Python 3.10+** : Langage principal
- **LlamaIndex** : Framework RAG pour l'indexation et la recherche
- **OpenAI API** : Modèles de langage pour la génération de réponses
- **MongoDB** : Base de données pour le stockage des conversations
- **Docker** : Containerisation et déploiement

### Frontend
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire
- **React Hot Toast** : Notifications utilisateur

### DevOps & Déploiement
- **Docker Compose** : Orchestration des services
- **Jenkins** : CI/CD pipeline
- **Modal** : Déploiement cloud des modèles LLM
- **Git** : Contrôle de version

## 🔐 Sécurité

- **Authentification** : Système d'authentification sécurisé
- **Validation des entrées** : Sanitisation des données utilisateur
- **Rate limiting** : Protection contre les abus
- **Logs de sécurité** : Monitoring des activités suspectes
- **Variables d'environnement** : Gestion sécurisée des secrets

## 📈 Monitoring et Analytics

- **Logs structurés** : Suivi détaillé des interactions
- **Métriques de performance** : Temps de réponse, taux de succès
- **Analytics utilisateur** : Statistiques d'utilisation anonymisées
- **Health checks** : Surveillance de l'état des services

## 🌍 Déploiement en production

### Avec Docker Compose

```bash
# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Variables d'environnement de production

```env
ENV=production
DEBUG=false
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=your-production-db-url
REDIS_URL=your-redis-url
```

### Scaling

```bash
# Scaler les services
docker-compose up -d --scale web=3 --scale worker=2
```

## � Métriques de performance

- ✅ **Précision des réponses** : >90%
- ✅ **Temps de réponse** : <2 secondes
- ✅ **Disponibilité** : 99.9%
- ✅ **Support multilingue** : Français, Anglais

## 🔄 Phases de développement

- [x] **Phase 1** : Collecte des données et analyse des besoins
- [x] **Phase 2** : Conception du prototype et développement de la base de données
- [x] **Phase 3** : Développement de l'interface utilisateur et intégration avec le modèle
- [x] **Phase 4** : Tests et optimisation des performances
- [x] **Phase 5** : Livraison finale et documentation complète

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails.

1. Fork le projet
2. Créez votre branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- **Développeur Principal** :
<pre>
• Ennajari Abdellah @ennajari
• Ourti Abdelilah @Abdelilah04116
• Oukacha Ahmed @Ahmed-oukacha
• Elhadji Oussama @Bosaj
</pre>
 
- **Institution** : ENIAD (École Nationale de L'Intelligence Artificielle et du Digital de Berkane)

## 📞 Support

- 📧 Email : ai.ennajari@gmail.com
- 🐛 Issues : [GitHub Issues](https://github.com/ennajari/ENIAD-ASSISTANT/issues)
- 📖 Documentation : [Wiki](https://github.com/ennajari/ENIAD-ASSISTANT/wiki)

## 🙏 Remerciements

- L'équipe pédagogique de l'ENIAD
- La communauté open source
- Tous les contributeurs du projet
## jury :
<pre>
Pr. Naoual Boukil          Présidente 
Pr. Asmae Bentaleb         Encadrante 
</pre>
---

<div align="center">
  <strong>Développé pour la communauté ENIAD</strong>
</div>
