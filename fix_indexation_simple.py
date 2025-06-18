#!/usr/bin/env python3
"""
Script simplifié pour corriger l'indexation RAG
"""

import requests
import json
import os
import time

def test_service():
    """Test simple du service RAG"""
    try:
        response = requests.get("http://localhost:8004/status", timeout=5)
        return response.status_code == 200
    except:
        return False

def get_collection_info():
    """Récupérer les informations de collection"""
    try:
        response = requests.get(
            "http://localhost:8004/api/v1/nlp/index/info/eniadproject",
            timeout=10
        )
        if response.status_code == 200:
            result = response.json()
            return result.get('collection_info', {})
        return {}
    except:
        return {}

def index_arabic_data():
    """Indexer uniquement les données arabes"""
    print("📚 Indexation des données arabes...")
    
    # Lire le fichier arabe
    arabic_file = "DATA/ENIAD_COMPLET_AR.txt"
    if not os.path.exists(arabic_file):
        print(f"❌ Fichier manquant: {arabic_file}")
        return False
    
    with open(arabic_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"📖 Contenu lu: {len(content)} caractères")
    
    # Créer des chunks plus petits pour éviter les timeouts
    documents = []
    chunk_size = 800  # Plus petit pour éviter les timeouts
    overlap = 50
    start = 0
    chunk_id = 0
    
    while start < len(content) and chunk_id < 20:  # Limiter à 20 chunks pour le test
        end = start + chunk_size
        
        if end < len(content):
            # Chercher la fin d'une phrase
            last_sentence_end = max(
                content.rfind('.', start, end),
                content.rfind('؟', start, end),
                content.rfind('!', start, end),
            )
            
            if last_sentence_end > start:
                end = last_sentence_end + 1
        
        chunk = content[start:end].strip()
        if chunk:
            documents.append({
                "text": chunk,
                "metadata": {
                    "source": "ENIAD_COMPLET_AR.txt",
                    "language": "ar",
                    "chunk_id": chunk_id,
                    "document_type": "official_regulation",
                    "institution": "ENIAD Berkane",
                    "is_real_data": True  # Marquer comme données réelles
                }
            })
            chunk_id += 1
        
        start = end - overlap
    
    print(f"📝 Préparé {len(documents)} chunks")
    
    # Envoyer par petits lots
    batch_size = 5
    total_inserted = 0
    
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i+batch_size]
        
        try:
            payload = {
                "documents": batch,
                "do_reset": i == 0  # Reset seulement pour le premier lot
            }
            
            print(f"📤 Envoi lot {i//batch_size + 1}/{(len(documents)-1)//batch_size + 1} ({len(batch)} docs)...")
            
            response = requests.post(
                "http://localhost:8004/api/v1/nlp/index/push/eniadproject",
                json=payload,
                timeout=120  # 2 minutes par lot
            )
            
            if response.status_code == 200:
                result = response.json()
                inserted = result.get('inserted_items_count', 0)
                total_inserted += inserted
                print(f"   ✅ Lot {i//batch_size + 1} indexé: {inserted} éléments")
                
                # Attendre entre les lots
                time.sleep(2)
            else:
                print(f"   ❌ Erreur lot {i//batch_size + 1}: {response.status_code}")
                print(f"   📄 Réponse: {response.text[:100]}")
                
        except Exception as e:
            print(f"   ❌ Exception lot {i//batch_size + 1}: {e}")
    
    print(f"📊 Total indexé: {total_inserted} éléments")
    return total_inserted > 0

def test_arabic_query():
    """Tester une requête arabe simple"""
    print("🧪 Test de requête arabe...")
    
    try:
        payload = {
            "text": "إنياد",
            "limit": 2
        }
        
        response = requests.post(
            "http://localhost:8004/api/v1/nlp/index/answer/eniadproject",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            answer = result.get('answer', '')
            
            print(f"✅ Réponse reçue ({len(answer)} chars)")
            
            # Vérifier la qualité
            has_arabic = any('\u0600' <= char <= '\u06FF' for char in answer)
            has_eniad = 'eniad' in answer.lower() or 'إنياد' in answer
            is_meaningful = len(answer) > 50
            
            print(f"🔤 Contient arabe: {has_arabic}")
            print(f"🏫 Mentionne ENIAD: {has_eniad}")
            print(f"💡 Significative: {is_meaningful}")
            
            if has_eniad and is_meaningful:
                print("🎉 Test réussi!")
                return True
            else:
                print("⚠️ Réponse limitée")
                return False
        else:
            print(f"❌ Erreur: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    """Fonction principale simplifiée"""
    print("🔧 CORRECTION INDEXATION RAG - VERSION SIMPLIFIÉE")
    print("=" * 60)
    
    # 1. Vérifier le service
    if not test_service():
        print("❌ Service RAG non accessible")
        print("💡 Démarrez le service: cd RAG_Project/src && python main.py")
        return
    
    print("✅ Service RAG accessible")
    
    # 2. Vérifier l'état actuel
    collection_info = get_collection_info()
    vectors_count = collection_info.get('vectors_count', 0)
    status = collection_info.get('status', 'unknown')
    
    print(f"📊 Collection status: {status}")
    print(f"📈 Vecteurs actuels: {vectors_count}")
    
    # 3. Indexer les données arabes
    if index_arabic_data():
        print("\n✅ Indexation terminée!")
        
        # 4. Vérifier l'état après indexation
        time.sleep(5)  # Attendre que l'indexation se stabilise
        
        new_info = get_collection_info()
        new_vectors = new_info.get('vectors_count', 0)
        print(f"📈 Nouveaux vecteurs: {new_vectors}")
        
        # 5. Tester une requête
        if test_arabic_query():
            print("\n🎉 SUCCÈS! L'indexation fonctionne!")
            print("💡 Testez dans l'interface: http://localhost:5174")
        else:
            print("\n⚠️ Indexation OK mais réponses limitées")
            print("💡 Attendez que le traitement se termine")
    else:
        print("\n❌ Échec de l'indexation")
        print("💡 Vérifiez les logs du service RAG")

if __name__ == "__main__":
    main()
