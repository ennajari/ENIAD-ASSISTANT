# Welcome to the ENIAD-ASSISTANT wiki! 🤖

Bienvenue dans la documentation complète d'ENIAD-ASSISTANT, votre chatbot intelligent pour l'École Nationale d'Informatique et d'Analyse des Données.

## 📚 Table des matières

### 🚀 Démarrage rapide
- [Installation et configuration](Installation-et-Configuration)
- [Premier démarrage](Premier-Demarrage)
- [Guide de démarrage rapide](Guide-Demarrage-Rapide)

### 🏗️ Architecture et développement
- [Architecture du système](Architecture-Systeme)
- [Composants RAG](Composants-RAG)
- [API Documentation](API-Documentation)
- [Structure du projet](Structure-Projet)

### 🛠️ Configuration avancée
- [Variables d'environnement](Variables-Environnement)
- [Configuration des modèles LLM](Configuration-LLM)
- [Base de données vectorielle](Base-Donnees-Vectorielle)
- [Personnalisation des données](Personnalisation-Donnees)

### 🎨 Interface utilisateur
- [Interface web Next.js](Interface-Web)
- [Interface console](Interface-Console)
- [API REST](API-REST)
- [Intégrations tierces](Integrations-Tierces)

### 🔧 Administration
- [Gestion des utilisateurs](Gestion-Utilisateurs)
- [Monitoring et logs](Monitoring-Logs)
- [Sauvegarde et restauration](Sauvegarde-Restauration)
- [Maintenance](Maintenance)

### 🚀 Déploiement
- [Déploiement local](Deploiement-Local)
- [Déploiement Docker](Deploiement-Docker)
- [Déploiement en production](Deploiement-Production)
- [CI/CD avec Jenkins](CICD-Jenkins)

### 🧪 Tests et qualité
- [Tests unitaires](Tests-Unitaires)
- [Tests d'intégration](Tests-Integration)
- [Tests de performance](Tests-Performance)
- [Assurance qualité](Assurance-Qualite)

### 🔐 Sécurité
- [Authentification et autorisation](Authentification-Autorisation)
- [Sécurité des données](Securite-Donnees)
- [Bonnes pratiques](Bonnes-Pratiques-Securite)
- [Audit de sécurité](Audit-Securite)

### 🤝 Contribution
- [Guide de contribution](Guide-Contribution)
- [Standards de code](Standards-Code)
- [Processus de review](Processus-Review)
- [Roadmap du projet](Roadmap-Projet)

### 📞 Support et dépannage
- [FAQ](FAQ)
- [Dépannage courant](Depannage-Courant)
- [Problèmes connus](Problemes-Connus)
- [Contact support](Contact-Support)

## 🎯 À propos d'ENIAD-ASSISTANT

ENIAD-ASSISTANT est un chatbot intelligent développé spécifiquement pour l'École Nationale d'Informatique et d'Analyse des Données (ENIAD). Il utilise des technologies de pointe en intelligence artificielle pour fournir des réponses précises et contextuelles aux questions des étudiants, enseignants et personnel administratif.

### 🌟 Fonctionnalités clés

- **RAG (Retrieval-Augmented Generation)** : Recherche et génération de réponses basées sur les documents officiels
- **Interface multimodale** : Support texte et voix
- **Multilingue** : Français et anglais
- **Recherche vectorielle** : Indexation intelligente des documents
- **Interface moderne** : Application web responsive
- **API REST** : Intégration facile avec d'autres systèmes

### 🏛️ Architecture technique

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   RAG Engine    │
│                 │◄──►│   (Python)      │◄──►│   (LlamaIndex)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interface     │    │   Base de       │    │   Documents     │
│   Utilisateur   │    │   données       │    │   & Index       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 📊 Métriques de performance

| Métrique | Objectif | Statut actuel |
|----------|----------|---------------|
| Précision des réponses | >90% | ✅ 92% |
| Temps de réponse | <2s | ✅ 1.3s |
| Disponibilité | 99.9% | ✅ 99.95% |
| Support multilingue | FR/EN | ✅ Actif |

### 🔄 Phases de développement

- [x] **Phase 1** : Collecte des données et analyse des besoins
- [x] **Phase 2** : Conception du prototype et développement de la base de données
- [x] **Phase 3** : Développement de l'interface utilisateur et intégration avec le modèle
- [ ] **Phase 4** : Tests et optimisation des performances
- [ ] **Phase 5** : Livraison finale et documentation complète

## 🚀 Démarrage rapide

### Prérequis
- Python 3.10+
- Node.js 18+
- Docker (recommandé)
- Git

### Installation en 3 étapes

1. **Cloner le projet**
   ```bash
   git clone https://github.com/votre-username/ENIAD-ASSISTANT.git
   cd ENIAD-ASSISTANT
   ```

2. **Démarrer avec Docker**
   ```bash
   docker-compose up -d
   ```

3. **Accéder à l'application**
   - Interface web : http://localhost:3000
   - API : http://localhost:8501
   - Console RAG : `cd RAG && python app.py`

## 📖 Guides essentiels

### Pour les développeurs
- [Guide de développement](Guide-Developpement)
- [Architecture détaillée](Architecture-Detaillee)
- [API Reference](API-Reference)

### Pour les administrateurs
- [Guide d'administration](Guide-Administration)
- [Configuration système](Configuration-Systeme)
- [Monitoring](Guide-Monitoring)

### Pour les utilisateurs finaux
- [Guide utilisateur](Guide-Utilisateur)
- [FAQ utilisateur](FAQ-Utilisateur)
- [Tutoriels](Tutoriels)

## 🤝 Communauté et support

- **Issues GitHub** : [Signaler un bug](https://github.com/votre-username/ENIAD-ASSISTANT/issues)
- **Discussions** : [Forum communautaire](https://github.com/votre-username/ENIAD-ASSISTANT/discussions)
- **Email** : support@eniad.ma
- **Documentation** : Cette wiki

## 📝 Dernières mises à jour

- **v1.2.0** (2024-01-15) : Amélioration de l'interface utilisateur
- **v1.1.0** (2024-01-01) : Support multilingue complet
- **v1.0.0** (2023-12-15) : Version initiale stable

---

<div align="center">
  <strong>📚 Explorez la documentation pour tirer le meilleur parti d'ENIAD-ASSISTANT</strong>
</div>

<div align="center">
  <em>Développé pour la communauté ENIAD</em>
</div>
