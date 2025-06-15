#!/usr/bin/env python3
"""
Test script to verify the exact SMA endpoint used by the interface
"""

import requests
import json

def test_intelligent_query_endpoint():
    """Test the /sma/intelligent-query endpoint that the interface actually uses"""
    print("🧪 Testing SMA Intelligent Query Endpoint...")
    
    try:
        # Test the exact endpoint the interface uses
        payload = {
            "query": "Quelles formations en intelligence artificielle sont disponibles à ENIAD?",
            "language": "fr",
            "search_depth": "medium",
            "include_documents": True,
            "include_images": True,
            "max_results": 5
        }
        
        print(f"📤 Sending request to: http://localhost:8001/sma/intelligent-query")
        print(f"📋 Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(
            "http://localhost:8001/sma/intelligent-query",
            json=payload,
            timeout=30
        )
        
        print(f"📥 Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SMA Intelligent Query successful!")
            print(f"   Query: {data.get('query', 'N/A')}")
            print(f"   Language: {data.get('language', 'N/A')}")
            print(f"   Total items found: {data.get('total_items_found', 0)}")
            print(f"   Confidence: {data.get('confidence', 0) * 100:.1f}%")
            print(f"   Answer preview: {data.get('answer', '')[:100]}...")
            
            # Check if results are present
            results = data.get('results', [])
            if results:
                print(f"   Results count: {len(results)}")
                for i, result in enumerate(results[:2]):
                    print(f"   Result {i+1}: {result.get('title', 'No title')[:50]}...")
            else:
                print("   ⚠️ No results found")
            
            return True
        else:
            print(f"❌ SMA Intelligent Query failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ SMA Intelligent Query error: {e}")
        return False

def test_chat_with_context_endpoint():
    """Test the chat-with-context endpoint"""
    print("\n🧪 Testing Chat with Context Endpoint...")
    
    # Mock SMA results
    mock_sma_results = {
        "results": [
            {
                "title": "Cycle Ingénieur - Intelligence Artificielle (IA)",
                "content": "L'École Nationale de l'Intelligence Artificielle et du Digital (ENIAD) propose un cycle ingénieur spécialisé en Intelligence Artificielle. Ce programme couvre les domaines du machine learning, deep learning, et traitement du langage naturel.",
                "source_url": "https://eniad.ump.ma/fr/cycle-ingenieur-intelligence-artificielle-ia"
            }
        ],
        "sources": [{"url": "https://eniad.ump.ma/fr", "title": "ENIAD"}],
        "metadata": {"confidence": 0.9},
        "total_found": 1
    }
    
    try:
        payload = {
            "query": "Quelles formations en intelligence artificielle sont disponibles à ENIAD?",
            "language": "fr",
            "sma_results": mock_sma_results
        }
        
        response = requests.post(
            "http://localhost:8001/sma/chat-with-context",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Chat with Context successful!")
            print(f"   Model: {data.get('model', 'N/A')}")
            print(f"   Provider: {data.get('provider', 'N/A')}")
            print(f"   SMA Enhanced: {data.get('sma_enhanced', False)}")
            print(f"   Answer preview: {data.get('final_answer', '')[:100]}...")
            return True
        else:
            print(f"❌ Chat with Context failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Chat with Context error: {e}")
        return False

def main():
    print("🎓 INTERFACE SMA ENDPOINT TEST")
    print("=" * 50)
    
    # Test the intelligent query endpoint (used by interface)
    intelligent_query_ok = test_intelligent_query_endpoint()
    
    # Test the chat with context endpoint
    chat_context_ok = test_chat_with_context_endpoint()
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS:")
    print(f"✅ SMA Intelligent Query: {'Working' if intelligent_query_ok else 'Failed'}")
    print(f"✅ Chat with Context: {'Working' if chat_context_ok else 'Failed'}")
    
    if intelligent_query_ok and chat_context_ok:
        print("\n🎉 ALL ENDPOINTS WORKING!")
        print("\n📋 Interface should now work properly:")
        print("1. Start interface: npm run dev")
        print("2. Click SMA button (🔍)")
        print("3. Ask questions about ENIAD")
        print("4. Get intelligent responses!")
    else:
        print("\n⚠️ Some endpoints failed")
        print("Check SMA service logs for details")

if __name__ == "__main__":
    main()
