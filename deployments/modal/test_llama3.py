#!/usr/bin/env python3
"""
Test Diagnostic Script for Modal Serverless Llama-3 Serving Endpoint
"""

import os
import requests
import json

API_URL = os.environ.get("MODAL_API_URL", "https://abdellahennajari2018--llama3-openai-compatible-serve.modal.run/v1/chat/completions")
API_KEY = os.environ.get("MODAL_API_KEY", "super-secret-key")

def run_diagnostic():
    print("🚀 Diagnostic Modal Serverless Llama-3 Endpoint")
    print(f"URL: {API_URL}")
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "ahmed-ouka/llama3-8b-eniad-merged-32bit",
        "messages": [
            {"role": "user", "content": "Quelle est la spécialité principale de l'ENIAD ?"}
        ],
        "max_tokens": 150
    }

    try:
        response = requests.post(API_URL, headers=headers, json=data, timeout=30)
        print(f"HTTP Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Succès Modal Response:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(f"⚠️ Service reponse status {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"ℹ️ Modal Serverless Cold Start ou offline: {e}")

if __name__ == "__main__":
    run_diagnostic()
