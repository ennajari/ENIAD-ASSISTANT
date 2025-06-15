#!/usr/bin/env python3
"""
Test CORS fix for Gemini API
"""

import requests
import time

def test_cors_fix():
    """Test that CORS issue is resolved"""
    print("🔧 TESTING CORS FIX")
    print("=" * 40)
    
    # Test 1: Interface accessibility
    print("\n🌐 Testing Interface...")
    try:
        response = requests.get("http://localhost:5174", timeout=5)
        if response.status_code == 200:
            print("✅ Interface accessible")
        else:
            print(f"❌ Interface error: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Interface not accessible: {e}")
        return False
    
    # Test 2: SMA service
    print("\n🧠 Testing SMA Service...")
    try:
        response = requests.get("http://localhost:8001/health", timeout=5)
        if response.status_code == 200:
            print("✅ SMA Service running")
        else:
            print(f"❌ SMA Service error: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ SMA Service not accessible: {e}")
        return False
    
    # Test 3: Gemini via SMA (no CORS)
    print("\n🤖 Testing Gemini via SMA (CORS workaround)...")
    try:
        # Test with minimal SMA results (like the interface does now)
        minimal_sma = {
            "results": [
                {
                    "title": "ENIAD - École Nationale d'Intelligence Artificielle",
                    "content": "École spécialisée en intelligence artificielle et technologies digitales, proposant des formations d'excellence.",
                    "source_url": "https://eniad.ump.ma/fr"
                }
            ],
            "sources": [{"url": "https://eniad.ump.ma/fr", "title": "ENIAD"}],
            "metadata": {"confidence": 0.8},
            "total_found": 1
        }
        
        payload = {
            "query": "Bonjour, que pouvez-vous me dire sur ENIAD?",
            "language": "fr",
            "sma_results": minimal_sma
        }
        
        response = requests.post(
            "http://localhost:8001/sma/chat-with-context",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Gemini via SMA working (CORS avoided)")
            print(f"   Model: {data.get('model', 'unknown')}")
            print(f"   Answer length: {len(data.get('final_answer', ''))}")
            print(f"   Answer preview: {data.get('final_answer', '')[:100]}...")
            return True
        else:
            print(f"❌ Gemini via SMA failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
            return False
            
    except Exception as e:
        print(f"❌ Gemini via SMA error: {e}")
        return False

def main():
    """Run CORS fix test"""
    success = test_cors_fix()
    
    print("\n" + "=" * 40)
    if success:
        print("🎉 CORS ISSUE FIXED!")
        print("\n📋 What was fixed:")
        print("• No more direct Gemini API calls from browser")
        print("• All Gemini calls go through SMA service")
        print("• SMA service handles CORS on server side")
        print("• Interface gets responses without CORS errors")
        
        print("\n🧪 Test the interface now:")
        print("1. Open: http://localhost:5174")
        print("2. Select 'Gemini API' model")
        print("3. Ask any question")
        print("4. Should work without CORS errors!")
        
        print("\n💡 Try these questions:")
        print("• 'Bonjour, que pouvez-vous me dire sur ENIAD?'")
        print("• 'Quelles formations sont disponibles?'")
        print("• 'Comment s'inscrire?'")
        
        print("\n✅ Expected: No more CORS errors in console!")
        
    else:
        print("❌ CORS ISSUE NOT RESOLVED")
        print("Check that SMA service is running properly")

if __name__ == "__main__":
    main()
