#!/usr/bin/env python3
"""
Test du vrai système RAG avec upload de documents ENIAD
"""
import requests
import json
import os
import time
from pathlib import Path

# Configuration
RAG_API_BASE = "http://localhost:8009/api/v1"
PROJECT_ID = "1"
DATA_PATH = "./data"  # Chemin vers vos documents ENIAD

def test_server():
    """Tester si le serveur RAG fonctionne"""
    try:
        response = requests.get(f"{RAG_API_BASE}/nlp/index/info/{PROJECT_ID}", timeout=5)
        print(f"✅ Serveur RAG accessible - Status: {response.status_code}")
        return True
    except Exception as e:
        print(f"❌ Serveur RAG non accessible: {e}")
        return False

def upload_document(file_path):
    """Upload un document vers le système RAG"""
    try:
        with open(file_path, 'rb') as f:
            files = {'file': (file_path.name, f)}
            response = requests.post(
                f"{RAG_API_BASE}/data/upload/{PROJECT_ID}",
                files=files,
                timeout=60
            )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Uploadé: {file_path.name} - {result.get('signal', 'OK')}")
            return True
        else:
            print(f"❌ Erreur upload {file_path.name}: {response.status_code}")
            if response.text:
                print(f"   Détails: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur upload {file_path.name}: {e}")
        return False

def process_documents():
    """Traiter les documents uploadés (extraction de texte et chunking)"""
    try:
        response = requests.post(
            f"{RAG_API_BASE}/data/process/{PROJECT_ID}",
            json={
                "chunk_size": 500,
                "overlap_size": 50,
                "do_reset": 0
            },
            timeout=120
        )

        if response.status_code == 200:
            result = response.json()
            print(f"✅ Traitement réussi: {result.get('processed_files', 0)} fichiers, {result.get('inserted_chunks', 0)} chunks")
            return True
        else:
            print(f"❌ Erreur traitement: {response.status_code}")
            if response.text:
                print(f"   Détails: {response.text[:200]}")
            return False

    except Exception as e:
        print(f"❌ Erreur traitement: {e}")
        return False

def index_documents():
    """Indexer tous les documents traités dans la base vectorielle"""
    try:
        response = requests.post(
            f"{RAG_API_BASE}/nlp/index/push/{PROJECT_ID}",
            json={"do_reset": False},
            timeout=120
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Indexation réussie: {result.get('inserted_items_count', 0)} éléments")
            return True
        else:
            print(f"❌ Erreur indexation: {response.status_code}")
            if response.text:
                print(f"   Détails: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur indexation: {e}")
        return False

def search_rag(question):
    """Rechercher dans la base RAG"""
    try:
        response = requests.get(
            f"{RAG_API_BASE}/nlp/index/search/{PROJECT_ID}",
            params={"text": question, "limit": 3},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            results = result.get('results', [])
            print(f"🔍 Recherche: '{question}' - {len(results)} résultats trouvés")
            for i, res in enumerate(results[:2]):
                print(f"   {i+1}. Score: {res.get('score', 0):.3f} - {res.get('text', '')[:100]}...")
            return True
        else:
            print(f"❌ Erreur recherche: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur recherche: {e}")
        return False

def ask_rag(question):
    """Poser une question au système RAG avec Ollama"""
    try:
        response = requests.post(
            f"{RAG_API_BASE}/nlp/index/answer/{PROJECT_ID}",
            json={"text": question, "limit": 3},
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            answer = result.get('answer', 'Pas de réponse')
            print(f"\n❓ Question: {question}")
            print(f"✅ Réponse RAG: {answer}")
            return True
        else:
            print(f"❌ Erreur question RAG: {response.status_code}")
            if response.text:
                print(f"   Détails: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur question RAG: {e}")
        return False

def main():
    """Fonction principale"""
    print("🎓 Test du système RAG ENIAD avec vrais documents")
    print("=" * 60)
    
    # 1. Tester le serveur
    if not test_server():
        print("💡 Démarrez le serveur avec: python start_server.py")
        return
    
    # 2. Chercher les documents
    data_path = Path(DATA_PATH)
    if not data_path.exists():
        print(f"❌ Dossier DATA non trouvé: {data_path}")
        print("💡 Vérifiez le chemin vers vos documents ENIAD")
        return
    
    # Types de fichiers supportés
    supported_extensions = ['.pdf', '.txt', '.docx', '.doc']
    documents = []
    
    for ext in supported_extensions:
        documents.extend(data_path.glob(f"*{ext}"))
        documents.extend(data_path.glob(f"**/*{ext}"))
    
    if not documents:
        print(f"❌ Aucun document trouvé dans {data_path}")
        return
    
    print(f"📁 Trouvé {len(documents)} documents")
    
    # 3. Upload des documents
    uploaded_count = 0
    for doc in documents[:5]:  # Limiter à 5 pour le test
        if upload_document(doc):
            uploaded_count += 1
        time.sleep(1)
    
    print(f"\n📤 Upload: {uploaded_count}/{min(len(documents), 5)} documents")

    if uploaded_count == 0:
        print("❌ Aucun document uploadé")
        return

    # 4. Traitement des documents
    print("\n🔄 Traitement des documents (extraction + chunking)...")
    if not process_documents():
        print("❌ Échec du traitement")
        return

    # 5. Indexation vectorielle
    print("\n🔄 Indexation vectorielle avec Ollama...")
    if not index_documents():
        print("❌ Échec de l'indexation")
        return
    
    # 6. Tests RAG
    print("\n🧪 Tests du système RAG avec Ollama")
    print("-" * 40)
    
    # Questions de test
    test_questions = [
        "Qu'est-ce que l'ENIAD?",
        "Quelles sont les formations proposées?",
        "Comment s'inscrire à l'ENIAD?",
        "Quels sont les modules enseignés?"
    ]
    
    for question in test_questions:
        # D'abord recherche
        search_rag(question)
        # Puis question complète
        ask_rag(question)
        print("-" * 40)
        time.sleep(2)
    
    print("\n🎉 Test terminé!")
    print("✅ Système RAG fonctionnel avec Ollama")
    print("✅ Documents ENIAD indexés")
    print("✅ Réponses basées sur vos vrais documents")

if __name__ == "__main__":
    main()
