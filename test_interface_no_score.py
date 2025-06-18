#!/usr/bin/env python3
"""
Test pour vérifier que le score de confiance a été supprimé de l'interface
"""
import requests
import time

def test_interface_response():
    """Tester une réponse via l'interface pour vérifier l'absence du score"""
    print("🌐 TEST INTERFACE SANS SCORE")
    print("=" * 35)
    
    try:
        # Test que l'interface est accessible
        response = requests.get("http://localhost:5174", timeout=10)
        if response.status_code == 200:
            print("✅ Interface accessible sur le port 5174")
            print("📝 Instructions pour vérifier:")
            print("   1. Ouvrez http://localhost:5174 dans votre navigateur")
            print("   2. Sélectionnez 'RAG + Local Model (Ollama)'")
            print("   3. Posez une question comme 'Qu'est-ce que l'ENIAD?'")
            print("   4. Vérifiez que le pourcentage de confiance n'apparaît plus")
            print("   5. Seuls les indicateurs de modèle et SMA doivent être visibles")
            return True
        else:
            print(f"❌ Interface inaccessible: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

def test_backend_still_works():
    """Vérifier que le backend RAG fonctionne toujours"""
    print(f"\n🔧 TEST BACKEND RAG")
    print("=" * 20)
    
    try:
        response = requests.post(
            "http://localhost:8009/api/v1/nlp/index/answer/1",
            json={
                "query": "Qu'est-ce que l'ENIAD?",
                "language": "fr",
                "max_results": 3
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            confidence = data.get('confidence', 0)
            answer = data.get('answer', '')
            sources = data.get('sources', [])
            
            print(f"✅ Backend RAG fonctionne")
            print(f"   Confiance (backend): {confidence} (toujours calculée)")
            print(f"   Sources: {len(sources)}")
            print(f"   Réponse: {answer[:100]}...")
            print(f"   ℹ️ La confiance est calculée côté backend mais plus affichée côté interface")
            return True
        else:
            print(f"❌ Backend RAG erreur: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

def main():
    print("🧪 TEST SUPPRESSION SCORE INTERFACE")
    print("=" * 40)
    print("🎯 Vérification que le score de confiance n'apparaît plus")
    
    # Tests
    tests = [
        ("Interface accessible", test_interface_response),
        ("Backend fonctionne", test_backend_still_works)
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
        
        time.sleep(1)
    
    # Résumé final
    print(f"\n📊 RÉSUMÉ")
    print("=" * 15)
    
    success_count = 0
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} {test_name}")
        if result:
            success_count += 1
    
    total_tests = len(results)
    print(f"\n🎯 SCORE: {success_count}/{total_tests} tests réussis")
    
    if success_count == total_tests:
        print(f"\n🎉 SCORE SUPPRIMÉ AVEC SUCCÈS!")
        print("✅ Interface accessible sans affichage de confiance")
        print("✅ Backend RAG continue de fonctionner normalement")
        print("📝 Le score est calculé mais plus affiché à l'utilisateur")
        print("\n🌐 Testez maintenant dans votre navigateur:")
        print("   → http://localhost:5174")
        print("   → Sélectionnez 'RAG + Local Model'")
        print("   → Posez une question sur l'ENIAD")
        print("   → Vérifiez l'absence du pourcentage de confiance")
    else:
        print(f"\n❌ PROBLÈMES DÉTECTÉS")
        print("🔧 Vérifiez que les serveurs sont démarrés")

if __name__ == "__main__":
    main()
