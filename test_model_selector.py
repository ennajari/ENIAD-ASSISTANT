#!/usr/bin/env python3
"""
Test script to verify model selector functionality
"""

import requests
import json

def test_gemini_model():
    """Test Gemini model via SMA service"""
    print("🧪 Testing Gemini Model...")
    
    try:
        # Mock SMA results for testing
        mock_sma_results = {
            "results": [
                {
                    "title": "Test ENIAD Information",
                    "content": "Information de test pour démontrer le fonctionnement du modèle Gemini avec contexte SMA",
                    "source_url": "https://eniad.ump.ma/fr"
                }
            ],
            "sources": [{"url": "https://eniad.ump.ma/fr", "title": "ENIAD"}],
            "metadata": {"confidence": 0.9},
            "total_found": 1
        }
        
        payload = {
            "query": "Test du modèle Gemini avec sélecteur",
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
            print("✅ Gemini model working!")
            print(f"   Model: {data.get('model', 'unknown')}")
            print(f"   Provider: {data.get('provider', 'unknown')}")
            print(f"   Answer preview: {data.get('final_answer', '')[:100]}...")
            return True
        else:
            print(f"❌ Gemini model failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Gemini model error: {e}")
        return False

def test_llama_model():
    """Test Llama model (if available)"""
    print("\n🦙 Testing Llama Model...")
    
    try:
        # Test if RAG service is available for Llama model
        response = requests.get("http://localhost:8000/health", timeout=5)
        
        if response.status_code == 200:
            print("✅ Llama model service available!")
            print("   RAG service is running on port 8000")
            return True
        else:
            print("⚠️ Llama model service not available")
            print("   RAG service not running on port 8000")
            return False
            
    except Exception as e:
        print("⚠️ Llama model service not available")
        print(f"   Error: {e}")
        return False

def test_sma_intelligent_query():
    """Test SMA intelligent query endpoint"""
    print("\n🧠 Testing SMA Intelligent Query...")
    
    try:
        payload = {
            "query": "Test de sélection de modèle avec SMA",
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
            print("✅ SMA intelligent query working!")
            print(f"   Query: {data.get('query', 'unknown')}")
            print(f"   Language: {data.get('language', 'unknown')}")
            print(f"   Items found: {data.get('total_items_found', 0)}")
            return True
        else:
            print(f"❌ SMA intelligent query failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ SMA intelligent query error: {e}")
        return False

def main():
    print("🎓 MODEL SELECTOR FUNCTIONALITY TEST")
    print("=" * 50)
    
    # Test Gemini model
    gemini_ok = test_gemini_model()
    
    # Test Llama model
    llama_ok = test_llama_model()
    
    # Test SMA intelligent query
    sma_ok = test_sma_intelligent_query()
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS:")
    print(f"✅ Gemini Model: {'Working' if gemini_ok else 'Failed'}")
    print(f"✅ Llama Model: {'Available' if llama_ok else 'Not Available'}")
    print(f"✅ SMA Service: {'Working' if sma_ok else 'Failed'}")
    
    print("\n🎯 Model Selector Status:")
    if gemini_ok:
        print("• ✨ Gemini API: Ready for intelligent responses")
    if llama_ok:
        print("• 🦙 Llama Model: Ready for custom ENIAD responses")
    else:
        print("• ⚠️ Llama Model: Not available (RAG service not running)")
    
    if sma_ok:
        print("• 🧠 SMA System: Ready for web intelligence")
    
    print("\n📋 Interface Instructions:")
    print("1. Open http://localhost:5174")
    print("2. Look for the Model Selector above the input")
    print("3. Choose between:")
    print("   • Gemini API (Google's advanced AI)")
    print("   • Llama (Your custom ENIAD project)")
    print("4. Click SMA button for web scraping")
    print("5. Ask questions and compare results!")
    
    print("\n💡 What you'll see:")
    print("• Different response styles between models")
    print("• Gemini: More general, well-structured responses")
    print("• Llama: More ENIAD-specific, customized responses")
    print("• SMA: Enhanced with real-time web content")

if __name__ == "__main__":
    main()
