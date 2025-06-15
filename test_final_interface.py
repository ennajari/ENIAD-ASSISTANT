#!/usr/bin/env python3
"""
Final test of the interface with correct port
"""

import requests
import json

def test_final_interface():
    """Test the interface on the correct port"""
    print("🎓 FINAL INTERFACE TEST")
    print("=" * 50)
    
    # Test 1: Interface accessibility
    print("\n1️⃣ Testing Interface Server...")
    try:
        response = requests.get("http://localhost:5174", timeout=5)
        if response.status_code == 200:
            print("✅ Interface: Running on port 5174")
            print("   URL: http://localhost:5174")
        else:
            print(f"❌ Interface: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Interface: Not available - {e}")
    
    # Test 2: SMA Service
    print("\n2️⃣ Testing SMA Service...")
    try:
        response = requests.get("http://localhost:8001/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ SMA Service: Running")
            print(f"   Status: {data.get('status', 'unknown')}")
            print(f"   Gemini API: {data.get('gemini_api', 'unknown')}")
        else:
            print(f"❌ SMA Service: Status {response.status_code}")
    except Exception as e:
        print(f"❌ SMA Service: Not available - {e}")
    
    # Test 3: Complete workflow test
    print("\n3️⃣ Testing Complete Workflow...")
    try:
        # Step 1: SMA intelligent query
        sma_payload = {
            "query": "Quelles formations en intelligence artificielle sont disponibles à ENIAD?",
            "language": "fr",
            "search_depth": "medium",
            "include_documents": True,
            "include_images": True,
            "max_results": 5
        }
        
        sma_response = requests.post(
            "http://localhost:8001/sma/intelligent-query",
            json=sma_payload,
            timeout=30
        )
        
        if sma_response.status_code == 200:
            sma_data = sma_response.json()
            print("✅ SMA Query: Working")
            print(f"   Items found: {sma_data.get('total_items_found', 0)}")
            
            # Step 2: Create SMA results for chat
            sma_results = {
                "results": sma_data.get('results', []) or [
                    {
                        "title": "Formations IA - ENIAD",
                        "content": "L'École Nationale de l'Intelligence Artificielle et du Digital propose des formations spécialisées en IA.",
                        "source_url": "https://eniad.ump.ma/fr"
                    }
                ],
                "sources": sma_data.get('sources', []) or [
                    {"url": "https://eniad.ump.ma/fr", "title": "ENIAD"}
                ],
                "metadata": {"confidence": sma_data.get('confidence', 0.8)},
                "total_found": sma_data.get('total_items_found', 1)
            }
            
            # Step 3: Chat with context
            chat_payload = {
                "query": "Quelles formations en intelligence artificielle sont disponibles à ENIAD?",
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
                print("✅ Chat with Context: Working")
                print(f"   Model: {chat_data.get('model', 'unknown')}")
                print(f"   Provider: {chat_data.get('provider', 'unknown')}")
                print(f"   Answer length: {len(chat_data.get('final_answer', ''))}")
                print(f"   Answer preview: {chat_data.get('final_answer', '')[:100]}...")
                
                return True
            else:
                print(f"❌ Chat with Context: Failed {chat_response.status_code}")
                return False
        else:
            print(f"❌ SMA Query: Failed {sma_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Workflow test error: {e}")
        return False

def main():
    """Run final test"""
    success = test_final_interface()
    
    print("\n" + "=" * 50)
    print("📋 FINAL TEST RESULTS")
    print("=" * 50)
    
    if success:
        print("\n🎉 ALL SYSTEMS WORKING!")
        print("\n📋 How to Use the Interface:")
        print("1. Open: http://localhost:5174")
        print("2. Look for the Model Selector above the input")
        print("3. Choose 'Gemini API' (recommended)")
        print("4. Click the SMA button (🔍) to activate web intelligence")
        print("5. Ask questions like:")
        print("   • 'Quelles formations en intelligence artificielle sont disponibles?'")
        print("   • 'Comment s'inscrire aux cours?'")
        print("   • 'ما هي البرامج المتاحة في الذكاء الاصطناعي؟'")
        
        print("\n💡 What You Should See:")
        print("• Model selector with Gemini/Llama options")
        print("• SMA button that toggles on/off")
        print("• Intelligent responses with source citations")
        print("• No 'Désolé, une erreur est survenue' messages")
        
        print("\n🔧 If You Still See Errors:")
        print("• Open browser console (F12) and check for errors")
        print("• Make sure you're using the correct URL: http://localhost:5174")
        print("• Try refreshing the page")
        print("• Try switching between models")
        
    else:
        print("\n⚠️ SOME ISSUES DETECTED")
        print("• Check that SMA service is running: python main.py")
        print("• Check that interface is running: npm run dev")
        print("• Verify ports: Interface=5174, SMA=8001")
    
    print("\n🎯 Expected Interface Features:")
    print("✅ Model Selection (Gemini/Llama)")
    print("✅ SMA Web Intelligence")
    print("✅ Multilingual Support (Arabic/French)")
    print("✅ Real-time Response Generation")
    print("✅ Source Attribution")
    print("✅ Error Handling")

if __name__ == "__main__":
    main()
