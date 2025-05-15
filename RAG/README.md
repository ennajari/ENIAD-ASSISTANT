# ENIAD Assistant RAG

Un système de Retrieval-Augmented Generation (RAG) pour l'École Nationale d'Intelligence Artificielle de Dijon (ENIAD).

## Description

Ce projet implémente un système de question-réponse basé sur les documents fournis. Il utilise la technique de RAG pour récupérer des informations pertinentes à partir de documents spécifiques à l'ENIAD, puis génère des réponses en utilisant le LLM Llama-2-70B via l'API Together.

## Structure du projet

```
RAG/
├── .env                                    # Fichier de configuration avec la clé API
├── app.py                                  # Application principale
├── README.md                               # Documentation du projet
├── requirements.txt                        # Dépendances Python
│
├── data/                                   # Dossier contenant les documents
│   ├── CNPN_Cycle-ingenieur_2024.pdf
│   ├── CNPN-Cycle Ingénieur_Français_2014.pdf
│   ├── CORECTION.jpg
│   ├── Liste des données.docx
│   ├── PFA_ENIAD_ChatBot (1) (1).pdf
│   └── reglement_int étudiants ENIADB.pdf
│
└── src/                                    # Code source
    ├── __init__.py                         # Fichier d'initialisation du package
    ├── config.py                           # Configuration (variables d'environnement)
    ├── create_index.py                     # Création de l'index vectoriel
    ├── llama_api_wrapper.py                # Interface avec l'API Llama
    ├── load_documents.py                   # Chargement des documents
    ├── query_engine.py                     # Moteur de requête
    └── rag_pipeline.py                     # Pipeline RAG principal
```

## Installation

1. Clonez ce dépôt
2. Créez un environnement virtuel:
   ```
   python -m venv eniad-assistant-env
   ```
3. Activez l'environnement virtuel:
   - Windows: `eniad-assistant-env\Scripts\activate`
   - Linux/Mac: `source eniad-assistant-env/bin/activate`
4. Installez les dépendances:
   ```
   pip install -r requirements.txt
   ```
5. Créez un fichier `.env` à la racine du projet avec votre clé API:
   ```
   LLAMA_API_KEY=votre_clé_api_together
   ```

## Utilisation

Lancez l'application:
```
python app.py
```

Posez vos questions concernant l'ENIAD, et le système récupérera les informations pertinentes depuis les documents fournis pour générer une réponse.

## Dépendances principales

- llama-index: Pour l'indexation et la recherche de documents
- python-dotenv: Pour la gestion des variables d'environnement
- sentence-transformers: Pour les embeddings textuels
- requests: Pour les appels API
- pypdf, docx2txt: Pour le traitement des différents formats de documents

## Note

Assurez-vous d'avoir les documents nécessaires dans le dossier `data/` avant d'exécuter l'application.