#!/usr/bin/env python3
"""
Test simple de l'état du service RAG
"""

import requests

def main():
    print("🔍 Test État Service RAG")
    print("=" * 30)
    
    # Test 1: Service accessible
    try:
        response = requests.get("http://localhost:8004/status", timeout=3)
        print(f"✅ Service: {response.status_code}")
    except Exception as e:
        print(f"❌ Service: {e}")
        return
    
    # Test 2: Collection info
    try:
        response = requests.get(
            "http://localhost:8004/api/v1/nlp/index/info/eniadproject",
            timeout=5
        )
        if response.status_code == 200:
            result = response.json()
            collection_info = result.get('collection_info', {})
            vectors_count = collection_info.get('vectors_count', 'N/A')
            status = collection_info.get('status', 'unknown')
            print(f"✅ Collection: {status}")
            print(f"📊 Vecteurs: {vectors_count}")
        else:
            print(f"❌ Collection: {response.status_code}")
    except Exception as e:
        print(f"❌ Collection: {e}")
    
    # Test 3: Requête simple
    try:
        payload = {"text": "test", "limit": 1}
        response = requests.post(
            "http://localhost:8004/api/v1/nlp/index/answer/eniadproject",
            json=payload,
            timeout=10
        )
        if response.status_code == 200:
            result = response.json()
            answer = result.get('answer', '')
            print(f"✅ Requête: OK ({len(answer)} chars)")
        else:
            print(f"❌ Requête: {response.status_code}")
    except Exception as e:
        print(f"❌ Requête: {e}")

if __name__ == "__main__":
    main()
