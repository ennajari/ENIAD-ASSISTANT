# ENIAD-ASSISTANT

ENIAD-ASSISTANT est un chatbot intelligent basé sur l'intelligence artificielle, conçu pour fournir des informations sur les études et les services scolaires à l'ENIAD. Il vise à aider les étudiants, les enseignants et l’administration à obtenir rapidement et facilement les informations dont ils ont besoin.

## 📌 Que fait ce chatbot ?

- ✅ Répondre aux questions sur les études et les services scolaires.
- ✅ Interagir avec les utilisateurs via texte ou voix.
- ✅ Prendre en charge trois langues : arabe, français et anglais.
- ✅ Utiliser une base de données vectorielle pour une recherche rapide et précise.

## 🔧 Technologies utilisées

- 🛠 **APIs** : OpenAI, Gemini, DeepSeek
- 🛠 **Frameworks** : LangChain, LangGraph, CrewAI
- 🛠 **Synthèse vocale (TTS) et reconnaissance vocale (ASR)**
- 🛠 **Base de données vectorielle**
- 🛠 **Backend** : FastAPI
- 🛠 **Frontend** : React.js avec Material-UI

## ⏳ Phases de développement

1. **Phase 1** : Collecte des données et analyse des besoins.
2. **Phase 2** : Conception du prototype et développement de la base de données.
3. **Phase 3** : Développement de l’interface utilisateur et intégration avec le modèle.
4. **Phase 4** : Tests et optimisation des performances.
5. **Phase 5** : Livraison finale et documentation.

📅 **Date limite du projet** : 1er juillet 2025

## 🎯 Critères de qualité

- ✅ **Précision des réponses** : Supérieure à 90 %
- ✅ **Temps de réponse** : Inférieur à 2 secondes
- ✅ **Interface utilisateur** : Intuitive et facile à utiliser

Ce projet sera très utile pour les étudiants, les enseignants et l'administration, car il facilitera l'accès aux informations et améliorera l'expérience utilisateur. 🚀


Structure simplifiée pour le projet ENIAD-ASSISTANT (PFA)
<pre>
eniad-assistant/
│
├── data/                        # Toutes les données
│   ├── questions_fr.json        # Questions-réponses en français
│   └── questions_en.json        # Questions-réponses en anglais
│
├── notebooks/                   # Notebooks Jupyter pour le développement
│   ├── 01_exploration.ipynb     # Explorer et comprendre les données
│   ├── 02_modele.ipynb          # Développer le modèle de chatbot
│   └── 03_evaluation.ipynb      # Tester et évaluer le chatbot
│
├── src/                         # Code source du projet
│   ├── app.py                   # Application principale
│   ├── chatbot.py               # Logique du chatbot
│   ├── database.py              # Gestion de la base de données
│   └── utils.py                 # Fonctions utilitaires
│
├── frontend/                    # Code de l'interface utilisateur
│   ├── index.html               # Page principale
│   ├── style.css                # Styles
│   └── script.js                # JavaScript pour l'interface
│
├── tests/                       # Tests simples
│   └── test_chatbot.py          # Tests de base du chatbot
│
├── requirements.txt             # Liste des dépendances
└── README.md                    # Instructions et documentation </pre>