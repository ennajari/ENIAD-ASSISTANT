#!/usr/bin/env python3
"""
Debug interface errors and test functionality
"""

import requests
import json
import time

def test_interface_debug():
    """Debug interface functionality step by step"""
    print("🔧 INTERFACE DEBUG TEST")
    print("=" * 50)
    
    # Test 1: Check interface server
    print("\n1️⃣ Testing Interface Server...")
    try:
        response = requests.get("http://localhost:5173", timeout=5)
        if response.status_code == 200:
            print("✅ Interface: Running on port 5173")
        else:
            print(f"❌ Interface: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Interface: Not available - {e}")
    
    # Test 2: Check SMA service
    print("\n2️⃣ Testing SMA Service...")
    try:
        response = requests.get("http://localhost:8001/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ SMA Service: Running")
            print(f"   Status: {data.get('status', 'unknown')}")
            print(f"   Agents: {data.get('agents_active', 0)}")
            print(f"   Gemini API: {data.get('gemini_api', 'unknown')}")
        else:
            print(f"❌ SMA Service: Status {response.status_code}")
    except Exception as e:
        print(f"❌ SMA Service: Not available - {e}")
    
    # Test 3: Test Gemini with SMA context (working endpoint)
    print("\n3️⃣ Testing Gemini with SMA Context...")
    try:
        # Create mock SMA results
        mock_sma_results = {
            "results": [
                {
                    "title": "Test ENIAD Information",
                    "content": "Information de test pour vérifier le fonctionnement du système",
                    "source_url": "https://eniad.ump.ma/fr"
                }
            ],
            "sources": [{"url": "https://eniad.ump.ma/fr", "title": "ENIAD"}],
            "metadata": {"confidence": 0.9},
            "total_found": 1
        }
        
        payload = {
            "query": "Test de l'interface avec sélecteur de modèle",
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
            print("✅ Gemini + SMA: Working")
            print(f"   Model: {data.get('model', 'unknown')}")
            print(f"   Provider: {data.get('provider', 'unknown')}")
            print(f"   Answer length: {len(data.get('final_answer', ''))}")
            return True
        else:
            print(f"❌ Gemini + SMA: Failed with status {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
            return False
            
    except Exception as e:
        print(f"❌ Gemini + SMA: Error - {e}")
        return False
    
    # Test 4: Test SMA intelligent query
    print("\n4️⃣ Testing SMA Intelligent Query...")
    try:
        payload = {
            "query": "Test de l'interface",
            "language": "fr",
            "search_depth": "medium",
            "include_documents": True,
            "include_images": True,
            "max_results": 3
        }
        
        response = requests.post(
            "http://localhost:8001/sma/intelligent-query",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SMA Intelligent Query: Working")
            print(f"   Items found: {data.get('total_items_found', 0)}")
            print(f"   Confidence: {data.get('confidence', 0):.2f}")
            return True
        else:
            print(f"❌ SMA Intelligent Query: Failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ SMA Intelligent Query: Error - {e}")
        return False

def test_direct_api_calls():
    """Test the exact API calls the interface makes"""
    print("\n" + "=" * 50)
    print("🎯 TESTING EXACT INTERFACE API CALLS")
    print("=" * 50)
    
    # Test the exact call the interface makes for SMA
    print("\n🔍 Testing Interface SMA Call...")
    try:
        # This is exactly what the interface does
        payload = {
            "query": "Quelles formations en intelligence artificielle sont disponibles?",
            "language": "fr",
            "search_depth": "medium",
            "include_documents": True,
            "include_images": True,
            "max_results": 5
        }
        
        response = requests.post(
            "http://localhost:8001/sma/intelligent-query",
            json=payload,
            timeout=30
        )
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("✅ Interface SMA call successful")
            print(f"   Results: {len(data.get('results', []))}")
            print(f"   Total found: {data.get('total_items_found', 0)}")
            
            # Now test the chat-with-context call
            if data.get('results'):
                sma_results = {
                    "results": data.get('results', []),
                    "sources": data.get('sources', []),
                    "metadata": {"confidence": data.get('confidence', 0.8)},
                    "total_found": data.get('total_items_found', 0)
                }
                
                chat_payload = {
                    "query": "Quelles formations en intelligence artificielle sont disponibles?",
                    "language": "fr",
                    "sma_results": sma_results
                }
                
                chat_response = requests.post(
                    "http://localhost:8001/sma/chat-with-context",
                    json=chat_payload,
                    timeout=30
                )
                
                if chat_response.status_code == 200:
                    chat_data = chat_response.json()
                    print("✅ Chat with context successful")
                    print(f"   Answer preview: {chat_data.get('final_answer', '')[:100]}...")
                else:
                    print(f"❌ Chat with context failed: {chat_response.status_code}")
            
        else:
            print(f"❌ Interface SMA call failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Interface SMA call error: {e}")

def main():
    """Run all debug tests"""
    print("🎓 INTERFACE ERROR DEBUGGING")
    print("=" * 60)
    
    # Run basic tests
    test_interface_debug()
    
    # Run exact API call tests
    test_direct_api_calls()
    
    print("\n" + "=" * 60)
    print("📋 DEBUGGING SUMMARY")
    print("=" * 60)
    
    print("\n🔧 If you still see 'Désolé, une erreur est survenue':")
    print("1. Check browser console (F12) for JavaScript errors")
    print("2. Check network tab for failed requests")
    print("3. Make sure you're using http://localhost:5173")
    print("4. Try refreshing the page")
    print("5. Try switching between Gemini and Llama models")
    print("6. Try with and without SMA activation")
    
    print("\n💡 Quick Test Steps:")
    print("1. Open http://localhost:5173")
    print("2. Select 'Gemini API' in model selector")
    print("3. Click SMA button to activate")
    print("4. Ask: 'Quelles formations sont disponibles?'")
    print("5. You should get a response with ENIAD information")
    
    print("\n🎯 Expected Behavior:")
    print("• Model selector visible above input")
    print("• SMA button toggles on/off")
    print("• Responses include source information")
    print("• No 'Désolé, une erreur est survenue' messages")

if __name__ == "__main__":
    main()
