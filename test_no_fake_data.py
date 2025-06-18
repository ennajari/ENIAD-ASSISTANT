#!/usr/bin/env python3
"""
Test pour vérifier qu'il n'y a pas de données hardcodées/fake
et que le RAG utilise vraiment les documents uploadés
"""
import requests
import time

def test_unique_query():
    """Tester avec une requête très spécifique qui ne peut venir que des documents"""
    print("🔍 TEST REQUÊTE UNIQUE")
    print("=" * 25)
    
    # Requête très spécifique qui ne peut être dans du code hardcodé
    unique_query = "Quel est le règlement intérieur spécifique de l'ENIAD Berkane?"
    
    try:
        response = requests.post(
            "http://localhost:8009/api/v1/nlp/index/answer/1",
            json={
                "query": unique_query,
                "language": "fr",
                "max_results": 5
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            answer = data.get('answer', '')
            sources = data.get('sources', [])
            confidence = data.get('confidence', 0)
            
            print("✅ Réponse reçue")
            print(f"   Réponse: {answer[:200]}...")
            print(f"   Sources: {len(sources)}")
            print(f"   Confiance: {confidence}")
            
            # Vérifier si la réponse contient des éléments spécifiques aux documents
            real_indicators = [
                "règlement",
                "ENIAD",
                "Berkane",
                "étudiant",
                "article",
                "chapitre"
            ]
            
            fake_indicators = [
                "je ne peux pas",
                "désolé",
                "reformuler",
                "contacter l'administration",
                "base de données actuelle"
            ]
            
            real_count = sum(1 for indicator in real_indicators if indicator.lower() in answer.lower())
            fake_count = sum(1 for indicator in fake_indicators if indicator.lower() in answer.lower())
            
            print(f"   Indicateurs réels: {real_count}")
            print(f"   Indicateurs fake: {fake_count}")
            
            if real_count > fake_count and len(sources) > 0:
                print("🎯 RÉPONSE BASÉE SUR VRAIS DOCUMENTS")
                return True
            else:
                print("⚠️ RÉPONSE POSSIBLEMENT GÉNÉRIQUE")
                return False
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

def test_document_content():
    """Vérifier que les sources contiennent du vrai contenu"""
    print(f"\n📄 TEST CONTENU DOCUMENTS")
    print("=" * 30)
    
    try:
        response = requests.post(
            "http://localhost:8009/api/v1/nlp/index/answer/1",
            json={
                "query": "Quels sont les programmes de formation à l'ENIAD?",
                "language": "fr",
                "max_results": 5
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            sources = data.get('sources', [])
            
            print(f"✅ {len(sources)} sources trouvées")
            
            real_content = False
            for i, source in enumerate(sources[:3]):  # Vérifier les 3 premières sources
                content = source.get('content', '')
                title = source.get('title', '')
                relevance = source.get('relevance', 0)
                
                print(f"   Source {i+1}:")
                print(f"     Titre: {title}")
                print(f"     Contenu: {content[:100]}...")
                print(f"     Pertinence: {relevance}")
                
                # Vérifier si le contenu semble réel
                if len(content) > 50 and any(word in content.lower() for word in ['eniad', 'formation', 'intelligence', 'artificielle']):
                    real_content = True
            
            if real_content:
                print("🎯 SOURCES CONTIENNENT DU VRAI CONTENU")
                return True
            else:
                print("⚠️ SOURCES SEMBLENT GÉNÉRIQUES")
                return False
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

def test_collection_info():
    """Vérifier les informations de la collection"""
    print(f"\n📊 TEST INFO COLLECTION")
    print("=" * 25)
    
    try:
        response = requests.get("http://localhost:8009/api/v1/nlp/index/info/1", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            documents_count = data.get('documents_count', 0)
            status = data.get('status', '')
            categories = data.get('categories', [])
            
            print(f"✅ Collection accessible")
            print(f"   Documents: {documents_count}")
            print(f"   Status: {status}")
            print(f"   Catégories: {categories}")
            
            if documents_count > 0:
                print("🎯 COLLECTION CONTIENT DES DOCUMENTS")
                return True
            else:
                print("⚠️ COLLECTION VIDE")
                return False
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

def test_confidence_fix():
    """Tester que la confiance est maintenant correcte"""
    print(f"\n📈 TEST CONFIANCE CORRIGÉE")
    print("=" * 30)
    
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
            
            print(f"✅ Confiance reçue: {confidence}")
            
            # Vérifier que la confiance est dans une plage raisonnable
            if 0.0 <= confidence <= 1.0:
                print("🎯 CONFIANCE DANS PLAGE NORMALE (0-1)")
                return True
            else:
                print(f"⚠️ CONFIANCE ANORMALE: {confidence}")
                return False
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

def main():
    print("🧪 TEST ANTI-FAKE DATA")
    print("=" * 25)
    print("🎯 Vérification que le RAG utilise de vraies données")
    
    # Tests pour vérifier l'authenticité
    tests = [
        ("Collection Info", test_collection_info),
        ("Requête Unique", test_unique_query),
        ("Contenu Documents", test_document_content),
        ("Confiance Corrigée", test_confidence_fix)
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
        
        time.sleep(2)  # Pause entre les tests
    
    # Résumé final
    print(f"\n📊 RÉSUMÉ ANTI-FAKE")
    print("=" * 25)
    
    success_count = 0
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} {test_name}")
        if result:
            success_count += 1
    
    total_tests = len(results)
    print(f"\n🎯 SCORE: {success_count}/{total_tests} tests réussis")
    
    if success_count == total_tests:
        print(f"\n🎉 RAG UTILISE DE VRAIES DONNÉES!")
        print("✅ Aucune donnée hardcodée détectée")
        print("✅ Réponses basées sur documents uploadés")
        print("✅ Confiance corrigée")
        print("🚀 Système RAG authentique et fonctionnel")
    elif success_count >= 3:
        print(f"\n⚠️ RAG MAJORITAIREMENT AUTHENTIQUE")
        print("🔧 Quelques améliorations possibles")
        print("💡 Vérifiez les tests échoués")
    else:
        print(f"\n❌ PROBLÈMES DÉTECTÉS")
        print("🔧 Corrections nécessaires")
        print("💡 Vérifiez l'upload des documents")

if __name__ == "__main__":
    main()
