#!/usr/bin/env python3
"""
ENIAD System Status Checker
Quick status verification for all services
"""

import requests
import json
from datetime import datetime

def check_service(name, url, endpoint=""):
    """Check if a service is responding"""
    try:
        full_url = f"{url}{endpoint}"
        response = requests.get(full_url, timeout=5)
        if response.status_code == 200:
            return True, response.json() if endpoint else None
        else:
            return False, f"HTTP {response.status_code}"
    except Exception as e:
        return False, str(e)

def main():
    print("🔍 ENIAD System Status Check")
    print("=" * 50)
    print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    services = [
        ("🧠 RAG Service", "http://localhost:8000", "/health"),
        ("🤖 SMA Service", "http://localhost:8001", "/sma/status"),
        ("🎨 Frontend", "http://localhost:5173", ""),
    ]

    all_running = True

    for name, url, endpoint in services:
        is_running, data = check_service(name, url, endpoint)
        
        if is_running:
            print(f"✅ {name}: RUNNING")
            if endpoint == "/health" and data:
                print(f"   📚 Documents: {data.get('documents_count', 'N/A')}")
            elif endpoint == "/sma/status" and data:
                print(f"   🤖 Agents: {data.get('agents_active', 'N/A')}")
                print(f"   🌐 Sites: {data.get('websites_monitored', 'N/A')}")
            print(f"   🌐 URL: {url}")
        else:
            print(f"❌ {name}: DOWN ({data})")
            all_running = False
        print()

    if all_running:
        print("🎉 All services are operational!")
        print()
        print("🧪 Test URLs:")
        print("   • Main Interface: http://localhost:5173")
        print("   • RAG Testing: test_rag.html")
        print("   • SMA Testing: test_sma.html")
        print("   • RAG API Docs: http://localhost:8000/docs")
        print("   • SMA API Docs: http://localhost:8001/docs")
    else:
        print("⚠️ Some services are not running.")
        print("💡 Try running: python test_and_launch.py")

if __name__ == "__main__":
    main()
