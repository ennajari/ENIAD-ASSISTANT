#!/usr/bin/env python3
"""
Quick Test Script for ENIAD Assistant
Tests basic functionality of all services
"""

import requests
import time
import sys

def test_service(name, url, endpoint=""):
    """Test if a service is responding"""
    try:
        full_url = f"{url}{endpoint}"
        response = requests.get(full_url, timeout=3)
        if response.status_code == 200:
            print(f"✅ {name}: Online")
            return True
        else:
            print(f"❌ {name}: HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException:
        print(f"❌ {name}: Offline")
        return False

def test_gemini_api():
    """Test Gemini API"""
    try:
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
        params = {"key": "AIzaSyDIDbm8CcUxtTTW3omJcOHQj1BWcmRWeYc"}
        
        data = {
            "contents": [{
                "parts": [{
                    "text": "Hello, test message"
                }]
            }],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 50
            }
        }
        
        response = requests.post(url, json=data, params=params, timeout=10)
        if response.status_code == 200:
            print("✅ Gemini API: Working")
            return True
        else:
            print(f"❌ Gemini API: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Gemini API: {str(e)}")
        return False

def main():
    print("🚀 ENIAD Assistant - Quick Test")
    print("=" * 40)
    
    # Wait for services to start
    print("⏳ Waiting 3 seconds for services...")
    time.sleep(3)
    
    services = [
        ("eSpeak TTS", "http://localhost:8002", "/espeak/status"),
        ("Document Extractor", "http://localhost:8003", "/status"),
        ("RAG Service", "http://localhost:8000", "/status"),
        ("SMA Service", "http://localhost:8001", "/sma/status"),
    ]
    
    results = []
    
    # Test services
    for name, url, endpoint in services:
        result = test_service(name, url, endpoint)
        results.append(result)
    
    # Test Gemini API
    gemini_result = test_gemini_api()
    results.append(gemini_result)
    
    # Summary
    print("\n" + "=" * 40)
    passed = sum(results)
    total = len(results)
    
    print(f"📊 Results: {passed}/{total} services working")
    
    if passed == total:
        print("🎉 All services are ready!")
        print("\n📋 Next steps:")
        print("1. Open demo-rag-system.html")
        print("2. Open demo_sma_system.html") 
        print("3. Open http://localhost:5173")
    else:
        print("⚠️  Some services need attention")
        print("\n🔧 Troubleshooting:")
        print("- Check if all services are started")
        print("- Wait a bit longer for services to initialize")
        print("- Check the terminal windows for errors")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
