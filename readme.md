# ENIAD-ASSISTANT

ENIAD-ASSISTANT est un chatbot intelligent basé sur l'intelligence artificielle, conçu pour fournir des informations sur les études et les services scolaires à l'ENIAD. Il vise à aider les étudiants, les enseignants et l’administration à obtenir rapidement et facilement les informations dont ils ont besoin.

## 📌 Que fait ce chatbot ?

- ✅ Répondre aux questions sur les études et les services scolaires.
- ✅ Interagir avec les utilisateurs via texte ou voix.
- ✅ Prendre en charge trois langues : français et anglais.
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



import gradio as gr
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import make_pipeline
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import speech_recognition as sr
from gtts import gTTS
import os
import tempfile
# Données JSON (50 questions/réponses)
qa_data = [
    {"question": "Quels sont les horaires d'ouverture de la bibliothèque de l'ENIAD Berkane ?", "réponse": "La bibliothèque est ouverte de 8h à 20h du lundi au vendredi, et de 9h à 17h le samedi."},
   
]
# Préparation des données
questions = [item["question"] for item in qa_data]
responses = [item["réponse"] for item in qa_data]
labels = list(range(len(questions)))
# Vectorisation TF-IDF
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(questions)
# Entraînement du modèle SVM
model = LinearSVC()
model.fit(X, labels)
# Message d'encouragement
encouragement = "\n\nN’hésitez pas à explorer nos programmes comme l’IA, la robotique ou le Big Data, et à participer à nos hackathons ou ateliers !"
# Fonction Speech-to-Text
def speech_to_text(audio):
    if audio is None:
        return "Veuillez enregistrer une question avec le microphone."
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio) as source:
        audio_data = recognizer.record(source)
    try:
        text = recognizer.recognize_google(audio_data, language="fr-FR")
        return text
    except sr.UnknownValueError:
        return "Désolé, je n’ai pas compris ce que vous avez dit."
    except sr.RequestError:
        return "Erreur de connexion au service de reconnaissance vocale."
# Fonction Text-to-Speech
def text_to_speech(text):
    tts = gTTS(text=text, lang="fr", slow=False)
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tts.save(temp_file.name)
    return temp_file.name
# Fonction principale du chatbot
def chatbot_response(text_input=None, audio_input=None):
    # Priorité à l'audio si fourni, sinon utiliser le texte
    if audio_input is not None:
        user_input = speech_to_text(audio_input)
    else:
        user_input = text_input if text_input else ""
    
    if not user_input or user_input.strip() == "":
        return "Veuillez poser une question par texte ou voix.", None

    # Vectorisation de la question
    user_vector = vectorizer.transform([user_input])
    similarities = cosine_similarity(user_vector, X)[0]
    best_match_idx = np.argmax(similarities)
    confidence = similarities[best_match_idx]

    # Réponse basée sur la confiance
    if confidence > 0.3:
        response = responses[best_match_idx]
    else:
        response = "Désolé, je ne suis pas sûr de la réponse. Essayez une autre question sur les cours, les clubs ou le Big Data à l’ENIAD !"

    # Ajouter encouragement
    full_response = response + encouragement

    # Générer fichier audio
    audio_file = text_to_speech(full_response)

    return full_response, audio_file

# Interface Gradio avec audio corrigée
interface = gr.Interface(
    fn=chatbot_response,
    inputs=[
        gr.Textbox(label="Posez votre question ici", placeholder="Tapez ou utilisez le microphone..."),
        gr.Audio(label="Parlez ici", type="filepath")  # Suppression de 'source'
    ],
    outputs=[
        gr.Textbox(label="Réponse du Chatbot"),
        gr.Audio(label="Écoutez la réponse", type="filepath")
    ],
    title="ENIAD Assistant Chatbot avec Parole",
    description="Posez-moi vos questions sur l’ENIAD Berkane par texte ou voix ! Je réponds avec du texte et de l’audio.",
    theme="soft",
    examples=[
        ["Quels sont les horaires d'ouverture de la bibliothèque ?", None],
        ["Y a-t-il des clubs étudiants ?", None],
        ["Qu’est-ce que le Big Data à l’ENIAD ?", None]
    ],
    allow_flagging="never"
)
# Lancer l'interface
interface.launch()
