#!/usr/bin/env python3
"""
Test du système RAG corrigé
Vérifie que les corrections fonctionnent
"""
import requests
import json
import time

RAG_API_BASE = "http://localhost:8004/api/v1"
PROJECT_ID = "1"

def test_server_status():
    """Test du statut du serveur"""
    print("🔍 TEST STATUT SERVEUR")
    print("=" * 25)
    
    try:
        response = requests.get("http://localhost:8004/status", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Serveur accessible")
            print(f"   Service: {data.get('service', 'N/A')}")
            print(f"   Version: {data.get('version', 'N/A')}")
            return True
        else:
            print(f"❌ Serveur erreur: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Serveur inaccessible: {str(e)[:50]}")
        return False

def test_collection_info():
    """Test des informations de collection"""
    print(f"\n📊 TEST COLLECTION INFO")
    print("=" * 25)
    
    try:
        response = requests.get(f"{RAG_API_BASE}/nlp/index/info/{PROJECT_ID}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            collection_info = data.get('collection_info', {})
            vectors_count = collection_info.get('vectors_count', 0)
            
            print(f"✅ Collection accessible")
            print(f"   Vecteurs: {vectors_count}")
            
            if vectors_count > 0:
                print(f"✅ Base de données indexée")
                return True
            else:
                print(f"⚠️ Base de données vide - indexation requise")
                return False
        else:
            print(f"❌ Collection erreur: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Collection inaccessible: {str(e)[:50]}")
        return False

def test_search():
    """Test de recherche vectorielle"""
    print(f"\n🔍 TEST RECHERCHE")
    print("=" * 20)
    
    try:
        search_data = {
            "text": "formations ENIAD",
            "limit": 3
        }
        
        response = requests.post(
            f"{RAG_API_BASE}/nlp/index/search/{PROJECT_ID}",
            json=search_data,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            results = data.get('results', [])
            
            print(f"✅ Recherche fonctionnelle")
            print(f"   Résultats: {len(results)}")
            
            if len(results) > 0:
                print(f"✅ Documents trouvés")
                for i, result in enumerate(results[:2]):
                    text_preview = result.get('text', '')[:100]
                    score = result.get('score', 0)
                    print(f"   {i+1}. Score: {score:.3f} - {text_preview}...")
                return True
            else:
                print(f"⚠️ Aucun document trouvé")
                return False
        else:
            print(f"❌ Recherche erreur: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Recherche échouée: {str(e)[:50]}")
        return False

def test_rag_answer():
    """Test de génération RAG"""
    print(f"\n🤖 TEST GÉNÉRATION RAG")
    print("=" * 25)
    
    try:
        question_data = {
            "text": "Quelles sont les formations proposées par l'ENIAD ?",
            "limit": 5
        }
        
        response = requests.post(
            f"{RAG_API_BASE}/nlp/index/answer/{PROJECT_ID}",
            json=question_data,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            answer = data.get('answer', '')
            
            print(f"✅ Génération RAG fonctionnelle")
            print(f"   Longueur réponse: {len(answer)} caractères")
            
            # Vérifier que ce n'est pas une réponse fake
            fake_indicators = [
                "Simple mock response",
                "L'ENIAD propose plusieurs programmes d'études spécialisés:",
                "mock_sources"
            ]
            
            is_fake = any(indicator in answer for indicator in fake_indicators)
            
            if is_fake:
                print(f"❌ RÉPONSE FAKE DÉTECTÉE!")
                print(f"   Contenu: {answer[:200]}...")
                return False
            else:
                print(f"✅ Réponse basée sur RAG réel")
                print(f"   Aperçu: {answer[:150]}...")
                return True
        else:
            print(f"❌ Génération erreur: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Génération échouée: {str(e)[:50]}")
        return False

def test_data_processing():
    """Test du traitement des données"""
    print(f"\n📁 TEST TRAITEMENT DONNÉES")
    print("=" * 30)
    
    try:
        process_data = {
            "do_reset": False,
            "force_reprocess": False
        }
        
        response = requests.post(
            f"{RAG_API_BASE}/data/process/{PROJECT_ID}",
            json=process_data,
            timeout=120
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Traitement des données fonctionnel")
            print(f"   Réponse: {data}")
            return True
        else:
            print(f"❌ Traitement erreur: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Traitement échoué: {str(e)[:50]}")
        return False

def run_complete_test():
    """Exécuter tous les tests"""
    print("🧪 TEST COMPLET RAG CORRIGÉ")
    print("=" * 35)
    
    tests = [
        ("Statut serveur", test_server_status),
        ("Collection info", test_collection_info),
        ("Recherche", test_search),
        ("Génération RAG", test_rag_answer),
        ("Traitement données", test_data_processing)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🔄 Exécution: {test_name}")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Erreur dans {test_name}: {str(e)}")
            results.append((test_name, False))
        
        time.sleep(1)  # Pause entre les tests
    
    # Résumé
    print(f"\n📊 RÉSUMÉ DES TESTS")
    print("=" * 25)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} {test_name}")
    
    print(f"\n🎯 SCORE: {passed}/{total} tests réussis")
    
    if passed == total:
        print(f"\n🎉 TOUS LES TESTS RÉUSSIS!")
        print("✅ Le système RAG fonctionne correctement")
        print("🚀 Prêt pour l'intégration avec l'interface")
    elif passed >= total * 0.7:
        print(f"\n✅ SYSTÈME FONCTIONNEL")
        print("⚠️ Quelques problèmes mineurs à corriger")
        print("💡 Vérifier les tests échoués")
    else:
        print(f"\n❌ SYSTÈME DÉFAILLANT")
        print("🔧 Corrections majeures nécessaires")
        print("💡 Vérifier la configuration et l'indexation")

def main():
    print("🔍 DÉMARRAGE DES TESTS RAG")
    print("Assurez-vous que le serveur RAG est démarré!")
    print("cd RAG_Project/src && python main.py")
    
    input("\nAppuyez sur Entrée pour continuer...")
    
    run_complete_test()

if __name__ == "__main__":
    main()
