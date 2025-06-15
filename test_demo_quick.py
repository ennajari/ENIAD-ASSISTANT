#!/usr/bin/env python3
"""
Quick test script to verify the demo setup works
"""

import requests
import json
import time

def test_sma_service():
    """Test if SMA service is running and working"""
    print("🧪 Testing SMA Service for Demo...")
    
    try:
        # Test health
        health_response = requests.get("http://localhost:8001/health", timeout=5)
        if health_response.status_code == 200:
            print("✅ SMA Service is running")
            health_data = health_response.json()
            print(f"   Status: {health_data.get('status')}")
        else:
            print("❌ SMA Service not healthy")
            return False
            
        # Test intelligent query
        print("\n🧠 Testing intelligent query...")
        query_data = {
            "query": "formations intelligence artificielle ENIAD",
            "language": "fr",
            "search_depth": "medium",
            "include_documents": True,
            "include_images": True,
            "include_news": True,
            "max_results": 5
        }
        
        query_response = requests.post(
            "http://localhost:8001/sma/intelligent-query",
            json=query_data,
            timeout=30
        )
        
        if query_response.status_code == 200:
            data = query_response.json()
            print("✅ Intelligent query working")
            print(f"   Query: {data.get('query')}")
            print(f"   Confidence: {data.get('confidence', 0) * 100:.1f}%")
            print(f"   Sources: {len(data.get('sources', []))}")
            
            # Show some results
            if data.get('comprehensive_search', {}).get('results'):
                results = data['comprehensive_search']['results']
                web_content = results.get('web_content', [])
                documents = results.get('documents', [])
                images = results.get('images', [])
                
                print(f"   Web pages found: {len(web_content)}")
                print(f"   Documents found: {len(documents)}")
                print(f"   Images processed: {len(images)}")
                
                if web_content:
                    print(f"   Sample result: {web_content[0].get('title', 'No title')}")
            
            return True
        else:
            print(f"❌ Intelligent query failed: {query_response.status_code}")
            print(f"Response: {query_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ SMA Service test failed: {e}")
        return False

def test_interface_connection():
    """Test if interface is accessible"""
    print("\n🌐 Testing Interface Connection...")
    
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Interface is accessible")
            return True
        else:
            print(f"❌ Interface returned status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Interface not accessible: {e}")
        print("💡 Make sure to run: npm run dev")
        return False

def main():
    print("🎓 DEMO READINESS TEST")
    print("=" * 40)
    
    # Test SMA service
    sma_ok = test_sma_service()
    
    # Test interface
    interface_ok = test_interface_connection()
    
    print("\n" + "=" * 40)
    print("📊 DEMO READINESS RESULTS:")
    print(f"✅ SMA Service: {'Ready' if sma_ok else 'Not Ready'}")
    print(f"✅ Interface: {'Ready' if interface_ok else 'Not Ready'}")
    
    if sma_ok and interface_ok:
        print("\n🎉 DEMO IS READY!")
        print("\n📋 Demo Instructions:")
        print("1. Open http://localhost:3000")
        print("2. Click the SMA button (🔍)")
        print("3. Ask: 'Quelles formations en IA sont disponibles à ENIAD?'")
        print("4. Show professor the real ENIAD results!")
        
        print("\n🎯 Expected Results:")
        print("• Real content from ENIAD website")
        print("• Source citations with ENIAD URLs")
        print("• Processing steps shown")
        print("• Confidence scores displayed")
        print("• No external API errors")
        
    else:
        print("\n⚠️ DEMO NOT READY")
        if not sma_ok:
            print("• Start SMA service: cd SMA_Service && python main.py")
        if not interface_ok:
            print("• Start interface: cd chatbot-ui/chatbot-academique && npm run dev")
    
    print("\n💡 For troubleshooting, see: demo_for_professor.md")

if __name__ == "__main__":
    main()
