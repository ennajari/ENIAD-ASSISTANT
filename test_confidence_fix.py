#!/usr/bin/env python3
"""
Test rapide pour vérifier que la confiance est corrigée
"""
import requests

def test_confidence():
    print("📈 TEST CONFIANCE CORRIGÉE")
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
            answer = data.get('answer', '')
            sources = data.get('sources', [])
            
            print(f"✅ Réponse reçue")
            print(f"   Confiance: {confidence} ({confidence*100:.1f}%)")
            print(f"   Sources: {len(sources)}")
            print(f"   Réponse: {answer[:100]}...")
            
            # Vérifier que la confiance est normale
            if 0.0 <= confidence <= 1.0:
                print(f"🎯 CONFIANCE NORMALE: {confidence*100:.1f}%")
                return True
            else:
                print(f"❌ CONFIANCE ANORMALE: {confidence}")
                return False
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

if __name__ == "__main__":
    test_confidence()
