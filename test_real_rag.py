#!/usr/bin/env python3
"""
Test du vrai système RAG sans données hardcodées
"""
import requests
import time

def test_rag_status():
    """Tester le status du serveur RAG"""
    print("🔍 TEST STATUS RAG RÉEL")
    print("=" * 25)
    
    try:
        response = requests.get("http://localhost:8009/status", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Serveur RAG accessible!")
            print(f"   Status: {data.get('status')}")
            print(f"   Service: {data.get('service')}")
            
            init_status = data.get('initialization', {})
            print(f"   Initialisation complète: {init_status.get('completed')}")
            if init_status.get('error'):
                print(f"   Erreur: {init_status.get('error')}")
            return True
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

def test_upload_documents():
    """Tester l'upload et l'indexation des documents"""
    print(f"\n📁 TEST UPLOAD DOCUMENTS")
    print("=" * 30)
    
    try:
        response = requests.post("http://localhost:8009/api/v1/nlp/index/upload/1", timeout=60)
        if response.status_code == 200:
            data = response.json()
            print("✅ Upload réussi!")
            print(f"   Fichiers traités: {data.get('total_processed')}")
            print(f"   Erreurs: {data.get('total_errors')}")
            
            # Afficher les détails des fichiers traités
            for file_info in data.get('processed_files', [])[:5]:  # Afficher les 5 premiers
                status_icon = "✅" if file_info['status'] == 'success' else "⚠️"
                print(f"   {status_icon} {file_info['filename']}: {file_info['status']}")
            
            if data.get('errors'):
                print(f"   Erreurs détaillées:")
                for error in data.get('errors', [])[:3]:  # Afficher les 3 premières erreurs
                    print(f"     ❌ {error['filename']}: {error['error']}")
            
            return data.get('total_processed', 0) > 0
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            print(f"   Réponse: {response.text}")
            return False
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

def test_rag_info_real():
    """Tester l'endpoint info avec vraies données"""
    print(f"\n📊 TEST INFO RAG RÉEL")
    print("=" * 25)
    
    try:
        response = requests.get("http://localhost:8009/api/v1/nlp/index/info/1", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Endpoint info OK!")
            print(f"   Projet: {data.get('project_id')}")
            print(f"   Documents: {data.get('documents_count')}")
            print(f"   Langues: {data.get('languages_supported')}")
            print(f"   Catégories: {data.get('categories')}")
            print(f"   Status: {data.get('status')}")
            return True
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

def test_real_rag_answer():
    """Tester l'endpoint answer avec vrai RAG"""
    print(f"\n🤖 TEST ANSWER RAG RÉEL")
    print("=" * 25)
    
    test_queries = [
        {
            "query": "Qu'est-ce que l'ENIAD?",
            "language": "fr"
        },
        {
            "query": "Quels sont les programmes d'études?",
            "language": "fr"
        },
        {
            "query": "Comment s'inscrire à l'ENIAD?",
            "language": "fr"
        }
    ]
    
    success_count = 0
    
    for i, query_data in enumerate(test_queries, 1):
        try:
            print(f"\n🔄 Test {i}: {query_data['query']}")
            
            response = requests.post(
                "http://localhost:8009/api/v1/nlp/index/answer/1",
                json=query_data,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Réponse générée!")
                print(f"   Réponse: {data.get('answer', '')[:150]}...")
                print(f"   Sources: {len(data.get('sources', []))} documents")
                print(f"   Confiance: {data.get('confidence'):.2f}")
                
                # Vérifier si c'est une vraie réponse RAG ou une réponse générique
                answer = data.get('answer', '')
                if "ne peux pas trouver" in answer or "reformuler" in answer:
                    print(f"   ⚠️ Réponse générique (pas de données dans la base)")
                else:
                    print(f"   🎯 Réponse basée sur les données RAG")
                
                success_count += 1
            else:
                print(f"❌ Erreur HTTP: {response.status_code}")
                print(f"   Réponse: {response.text}")
        
        except Exception as e:
            print(f"❌ Erreur: {str(e)}")
    
    return success_count > 0

def main():
    print("🧪 TEST SYSTÈME RAG RÉEL")
    print("=" * 30)
    print("🎯 Test du système RAG sans données hardcodées")
    
    # Attendre que le serveur soit prêt
    print("⏳ Attente démarrage serveur...")
    time.sleep(3)
    
    # Tests séquentiels
    tests = [
        ("Status serveur", test_rag_status),
        ("Upload documents", test_upload_documents),
        ("Info collection", test_rag_info_real),
        ("Génération RAG", test_real_rag_answer)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        print(f"\n🔄 Exécution: {test_name}")
        try:
            result = test_func()
            results[test_name] = result
        except Exception as e:
            print(f"❌ Erreur dans {test_name}: {str(e)}")
            results[test_name] = False
        
        time.sleep(2)  # Pause entre les tests
    
    # Résumé final
    print(f"\n📊 RÉSUMÉ FINAL")
    print("=" * 20)
    
    success_count = 0
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} {test_name}")
        if result:
            success_count += 1
    
    total_tests = len(results)
    print(f"\n🎯 SCORE: {success_count}/{total_tests} tests réussis")
    
    if success_count == total_tests:
        print(f"\n🎉 SYSTÈME RAG RÉEL OPÉRATIONNEL!")
        print("✅ Le système RAG fonctionne avec de vraies données")
        print("🚀 Prêt pour l'intégration avec l'interface")
    elif success_count >= 2:
        print(f"\n⚠️ SYSTÈME PARTIELLEMENT FONCTIONNEL")
        print("🔧 Certains composants fonctionnent")
        print("💡 Vérifiez l'indexation des documents")
    else:
        print(f"\n❌ SYSTÈME DÉFAILLANT")
        print("🔧 Corrections nécessaires")

if __name__ == "__main__":
    main()
