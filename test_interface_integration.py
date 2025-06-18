#!/usr/bin/env python3
"""
Test de l'intégration interface + RAG réel
"""
import requests
import time

def test_rag_backend():
    """Tester le backend RAG"""
    print("🔍 TEST BACKEND RAG")
    print("=" * 20)
    
    try:
        # Test status
        response = requests.get("http://localhost:8009/status", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend RAG accessible")
            print(f"   Status: {data.get('status')}")
            print(f"   Service: {data.get('service')}")
            return True
        else:
            print(f"❌ Backend RAG erreur: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend RAG inaccessible: {str(e)}")
        return False

def test_interface():
    """Tester l'interface"""
    print(f"\n🌐 TEST INTERFACE")
    print("=" * 20)
    
    try:
        response = requests.get("http://localhost:5174", timeout=10)
        if response.status_code == 200:
            print("✅ Interface accessible")
            print(f"   Port: 5174")
            return True
        else:
            print(f"❌ Interface erreur: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Interface inaccessible: {str(e)}")
        return False

def test_rag_api_integration():
    """Tester l'API RAG via l'interface"""
    print(f"\n🤖 TEST INTÉGRATION RAG")
    print("=" * 25)
    
    try:
        # Test endpoint info
        response = requests.get("http://localhost:8009/api/v1/nlp/index/info/1", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("✅ API RAG info accessible")
            print(f"   Documents: {data.get('documents_count')}")
            print(f"   Status: {data.get('status')}")
            
            # Test endpoint answer
            answer_response = requests.post(
                "http://localhost:8009/api/v1/nlp/index/answer/1",
                json={
                    "query": "Qu'est-ce que l'ENIAD?",
                    "language": "fr",
                    "max_results": 3
                },
                timeout=30
            )
            
            if answer_response.status_code == 200:
                answer_data = answer_response.json()
                print("✅ API RAG answer accessible")
                print(f"   Réponse: {answer_data.get('answer', '')[:100]}...")
                print(f"   Sources: {len(answer_data.get('sources', []))}")
                print(f"   Confiance: {answer_data.get('confidence')}")
                return True
            else:
                print(f"❌ API RAG answer erreur: {answer_response.status_code}")
                return False
        else:
            print(f"❌ API RAG info erreur: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API RAG erreur: {str(e)}")
        return False

def main():
    print("🧪 TEST INTÉGRATION INTERFACE + RAG RÉEL")
    print("=" * 45)
    print("🎯 Vérification de l'intégration complète")
    
    # Tests séquentiels
    tests = [
        ("Backend RAG", test_rag_backend),
        ("Interface", test_interface),
        ("Intégration API", test_rag_api_integration)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        print(f"\n🔄 Test: {test_name}")
        try:
            result = test_func()
            results[test_name] = result
        except Exception as e:
            print(f"❌ Erreur dans {test_name}: {str(e)}")
            results[test_name] = False
        
        time.sleep(1)  # Pause entre les tests
    
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
        print(f"\n🎉 INTÉGRATION COMPLÈTE RÉUSSIE!")
        print("✅ Interface + RAG réel fonctionnent ensemble")
        print("🚀 Prêt pour utilisation")
        print("\n📝 Instructions:")
        print("   1. Interface: http://localhost:5174")
        print("   2. Backend RAG: http://localhost:8009")
        print("   3. Sélectionnez 'RAG + Local Model' dans l'interface")
        print("   4. Posez vos questions sur l'ENIAD")
    elif success_count >= 2:
        print(f"\n⚠️ INTÉGRATION PARTIELLE")
        print("🔧 Certains composants fonctionnent")
        print("💡 Vérifiez les services défaillants")
    else:
        print(f"\n❌ INTÉGRATION DÉFAILLANTE")
        print("🔧 Corrections nécessaires")
        print("💡 Vérifiez que les serveurs sont démarrés")

if __name__ == "__main__":
    main()
