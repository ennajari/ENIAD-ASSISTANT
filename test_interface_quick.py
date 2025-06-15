#!/usr/bin/env python3
"""
Quick test to verify interface is working
"""

import requests
import time

def test_interface_quick():
    """Quick test of interface functionality"""
    print("⚡ QUICK INTERFACE TEST")
    print("=" * 40)
    
    # Test interface accessibility
    print("\n🌐 Testing Interface...")
    try:
        response = requests.get("http://localhost:5174", timeout=5)
        if response.status_code == 200:
            print("✅ Interface accessible on http://localhost:5174")
        else:
            print(f"❌ Interface error: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Interface not accessible: {e}")
        return False
    
    # Test SMA service
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
    
    # Test Gemini with mock SMA results
    print("\n🤖 Testing Gemini Response...")
    try:
        mock_sma = {
            "results": [{
                "title": "Test ENIAD",
                "content": "Test content for ENIAD",
                "source_url": "https://eniad.ump.ma/fr"
            }],
            "sources": [{"url": "https://eniad.ump.ma/fr", "title": "ENIAD"}],
            "metadata": {"confidence": 0.9},
            "total_found": 1
        }
        
        payload = {
            "query": "Test de l'interface",
            "language": "fr",
            "sma_results": mock_sma
        }
        
        response = requests.post(
            "http://localhost:8001/sma/chat-with-context",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Gemini response working")
            print(f"   Model: {data.get('model', 'unknown')}")
            print(f"   Answer length: {len(data.get('final_answer', ''))}")
            return True
        else:
            print(f"❌ Gemini response failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Gemini response error: {e}")
        return False

def main():
    """Run quick test and provide instructions"""
    success = test_interface_quick()
    
    print("\n" + "=" * 40)
    if success:
        print("🎉 ALL SYSTEMS WORKING!")
        print("\n📋 INSTRUCTIONS:")
        print("1. Open: http://localhost:5174")
        print("2. Select 'Gemini API' in model selector")
        print("3. Ask any question about ENIAD")
        print("4. You should get a helpful response!")
        
        print("\n💡 Try these questions:")
        print("• 'Quelles formations sont disponibles?'")
        print("• 'Comment s'inscrire?'")
        print("• 'Bonjour, que pouvez-vous me dire sur ENIAD?'")
        
        print("\n✅ Expected: No more error messages!")
        
    else:
        print("❌ ISSUES DETECTED")
        print("Check that both services are running:")
        print("• Interface: npm run dev (port 5174)")
        print("• SMA: python main.py (port 8001)")

if __name__ == "__main__":
    main()
