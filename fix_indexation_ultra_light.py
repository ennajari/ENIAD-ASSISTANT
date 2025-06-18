#!/usr/bin/env python3
"""
Script ultra-léger pour indexation progressive
"""

import requests
import json
import os
import time

def test_service():
    """Test rapide du service"""
    try:
        response = requests.get("http://localhost:8004/status", timeout=3)
        return response.status_code == 200
    except:
        return False

def index_single_document(text, metadata, timeout=300):
    """Indexer un seul document avec timeout long"""
    try:
        payload = {
            "documents": [{
                "text": text,
                "metadata": metadata
            }],
            "do_reset": False
        }
        
        response = requests.post(
            "http://localhost:8004/api/v1/nlp/index/push/eniadproject",
            json=payload,
            timeout=timeout
        )
        
        if response.status_code == 200:
            result = response.json()
            return True, result.get('inserted_items_count', 0)
        else:
            return False, f"HTTP {response.status_code}"
            
    except Exception as e:
        return False, str(e)

def reset_collection():
    """Reset de la collection"""
    try:
        payload = {
            "documents": [],
            "do_reset": True
        }
        
        response = requests.post(
            "http://localhost:8004/api/v1/nlp/index/push/eniadproject",
            json=payload,
            timeout=30
        )
        
        return response.status_code == 200
    except:
        return False

def main():
    """Indexation ultra-progressive"""
    print("🔧 INDEXATION ULTRA-LÉGÈRE")
    print("=" * 40)
    
    # 1. Vérifier le service
    if not test_service():
        print("❌ Service RAG non accessible")
        return
    
    print("✅ Service RAG accessible")
    
    # 2. Reset de la collection
    print("🧹 Reset de la collection...")
    if reset_collection():
        print("✅ Collection réinitialisée")
    else:
        print("⚠️ Reset échoué, on continue...")
    
    # 3. Préparer UN SEUL document de test
    arabic_file = "DATA/ENIAD_COMPLET_AR.txt"
    if not os.path.exists(arabic_file):
        print(f"❌ Fichier manquant: {arabic_file}")
        return
    
    with open(arabic_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Prendre seulement les 1000 premiers caractères pour le test
    test_content = content[:1000]
    
    test_doc = {
        "source": "ENIAD_COMPLET_AR.txt",
        "language": "ar", 
        "chunk_id": 0,
        "document_type": "official_regulation",
        "institution": "ENIAD Berkane",
        "is_real_data": True
    }
    
    print(f"📝 Document de test préparé: {len(test_content)} caractères")
    
    # 4. Indexer le document de test
    print("📤 Indexation du document de test...")
    print("⏳ Cela peut prendre 5-10 minutes (génération d'embedding)...")
    
    success, result = index_single_document(test_content, test_doc, timeout=600)
    
    if success:
        print(f"✅ Document indexé avec succès! ({result} éléments)")
        
        # 5. Tester une requête
        print("🧪 Test de requête...")
        try:
            payload = {"text": "إنياد", "limit": 1}
            response = requests.post(
                "http://localhost:8004/api/v1/nlp/index/answer/eniadproject",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                answer = result.get('answer', '')
                print(f"✅ Requête réussie: {len(answer)} caractères")
                
                # Vérifier la qualité
                has_arabic = any('\u0600' <= char <= '\u06FF' for char in answer)
                has_eniad = 'eniad' in answer.lower() or 'إنياد' in answer
                
                if has_eniad:
                    print("🎉 SUCCÈS! L'indexation fonctionne!")
                    print("💡 Le système peut maintenant indexer plus de documents")
                else:
                    print("⚠️ Réponse reçue mais contenu limité")
            else:
                print(f"❌ Erreur requête: {response.status_code}")
        except Exception as e:
            print(f"❌ Erreur test: {e}")
    else:
        print(f"❌ Échec indexation: {result}")
        
        # Diagnostics
        print("\n🔍 DIAGNOSTICS:")
        print("- Le système Ollama est peut-être surchargé")
        print("- Essayez de redémarrer Ollama")
        print("- Vérifiez l'utilisation RAM/CPU")

if __name__ == "__main__":
    main()
