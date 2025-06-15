#!/usr/bin/env python3
"""
Real test script that shows actual results from the SMA service
This will test the actual functionality and show you real outputs
"""

import requests
import json
import time
import sys

def test_real_functionality():
    """Test the actual SMA service and show real results"""
    
    print("🔍 REAL TEST - ENIAD SMA Service")
    print("=" * 60)
    
    base_url = "http://localhost:8001"
    
    # Test 1: Check if service is running
    print("\n1. 🏥 Testing if service is running...")
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            result = response.json()
            print("✅ Service is running!")
            print(f"📊 REAL RESULT:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"❌ Service returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to service. Is it running on port 8001?")
        print("💡 Start the service first with: python main.py")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    # Test 2: Real SMA Status
    print("\n2. 🤖 Testing SMA status...")
    try:
        response = requests.get(f"{base_url}/sma/status", timeout=10)
        if response.status_code == 200:
            result = response.json()
            print("✅ SMA status retrieved!")
            print(f"📊 REAL RESULT:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"❌ SMA status failed: {response.status_code}")
    except Exception as e:
        print(f"❌ SMA status error: {e}")
    
    # Test 3: Real Basic Search
    print("\n3. 🔍 Testing REAL basic search...")
    search_data = {
        "query": "formations intelligence artificielle ENIAD",
        "language": "fr",
        "max_results": 3
    }
    
    try:
        print(f"🔄 Searching for: '{search_data['query']}'")
        response = requests.post(
            f"{base_url}/sma/search",
            json=search_data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Basic search completed!")
            print(f"📊 REAL SEARCH RESULTS:")
            print(f"Query: {result.get('query')}")
            print(f"Total Results: {result.get('total_results', 0)}")
            print(f"Language: {result.get('language')}")
            
            for i, item in enumerate(result.get('results', []), 1):
                print(f"\n📄 Result {i}:")
                print(f"   Title: {item.get('title', 'No title')}")
                print(f"   URL: {item.get('url', 'No URL')}")
                print(f"   Site: {item.get('site_name', 'Unknown')}")
                print(f"   Relevance: {item.get('relevance', 0)}")
                print(f"   Content Preview: {item.get('content', '')[:150]}...")
                print(f"   Status: {item.get('status', 'unknown')}")
        else:
            print(f"❌ Basic search failed: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Basic search error: {e}")
    
    # Test 4: Real Comprehensive Search
    print("\n4. 🔍 Testing REAL comprehensive search...")
    comp_data = {
        "query": "cycle ingénieur robotique",
        "language": "fr",
        "search_depth": "medium",
        "include_documents": True,
        "include_images": False,
        "include_news": False,
        "max_results": 5
    }
    
    try:
        print(f"🔄 Comprehensive search for: '{comp_data['query']}'")
        print("⏳ This may take 10-30 seconds as it scans all ENIAD URLs...")
        
        response = requests.post(
            f"{base_url}/sma/comprehensive-search",
            json=comp_data,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Comprehensive search completed!")
            print(f"📊 REAL COMPREHENSIVE RESULTS:")
            print(f"Query: {result.get('query')}")
            print(f"Search Depth: {result.get('search_depth')}")
            print(f"Total Items Found: {result.get('total_items_found', 0)}")
            print(f"Summary: {result.get('summary', 'No summary')}")
            
            web_content = result.get('results', {}).get('web_content', [])
            print(f"\n🌐 Web Content Found: {len(web_content)} items")
            
            for i, item in enumerate(web_content[:3], 1):
                print(f"\n📄 Web Result {i}:")
                print(f"   Title: {item.get('title', 'No title')}")
                print(f"   URL: {item.get('url', 'No URL')}")
                print(f"   Relevance: {item.get('relevance', 0)}")
                print(f"   Content Preview: {item.get('content', '')[:200]}...")
                print(f"   Timestamp: {item.get('timestamp', 'No timestamp')}")
        else:
            print(f"❌ Comprehensive search failed: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Comprehensive search error: {e}")
    
    # Test 5: Real Intelligent Query
    print("\n5. 🧠 Testing REAL intelligent query...")
    intel_data = {
        "query": "Comment s'inscrire aux formations d'ingénieur à ENIAD?",
        "language": "fr",
        "search_depth": "medium",
        "include_documents": True,
        "include_images": False,
        "include_news": False,
        "max_results": 5
    }
    
    try:
        print(f"🔄 Intelligent query: '{intel_data['query']}'")
        print("⏳ Processing with AI understanding...")
        
        response = requests.post(
            f"{base_url}/sma/intelligent-query",
            json=intel_data,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Intelligent query completed!")
            print(f"📊 REAL INTELLIGENT RESULTS:")
            print(f"Query: {result.get('query')}")
            print(f"Language: {result.get('language')}")
            print(f"Confidence: {result.get('confidence', 0) * 100:.1f}%")
            
            print(f"\n🧠 Understanding:")
            understanding = result.get('understanding', {})
            print(f"   Categories: {understanding.get('categories', [])}")
            print(f"   Intent: {understanding.get('intent', 'unknown')}")
            
            print(f"\n💬 Final Answer:")
            print(f"   {result.get('final_answer', 'No answer generated')}")
            
            sources = result.get('sources', [])
            print(f"\n📚 Sources ({len(sources)}):")
            for i, source in enumerate(sources[:3], 1):
                print(f"   {i}. [{source.get('type', 'unknown').upper()}] {source.get('title', 'No title')}")
                print(f"      URL: {source.get('url', 'No URL')}")
                print(f"      Relevance: {source.get('relevance', 'unknown')}")
            
            print(f"\n🔄 Processing Steps: {' → '.join(result.get('processing_steps', []))}")
        else:
            print(f"❌ Intelligent query failed: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Intelligent query error: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 REAL TEST COMPLETED!")
    print("📊 These are the actual results from your running SMA service.")
    print("🌐 Service URL: http://localhost:8001")
    print("📚 API Docs: http://localhost:8001/docs")
    
    return True

if __name__ == "__main__":
    print("🚀 REAL FUNCTIONALITY TEST")
    print("This will show you actual results from the SMA service")
    print("Make sure the service is running with: python main.py")
    print()
    
    # Check if user wants to proceed
    proceed = input("Press Enter to start real testing (or Ctrl+C to cancel)...")
    
    success = test_real_functionality()
    
    if success:
        print("\n✅ All tests completed successfully!")
        print("🎯 The SMA service is working and returning real results.")
    else:
        print("\n❌ Tests failed. Please check if the service is running.")
        print("💡 Start with: python main.py")
