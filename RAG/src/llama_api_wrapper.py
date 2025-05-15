import requests
from src.config import LLAMA_API_KEY

def call_llama(prompt, model="togethercomputer/llama-2-70b-chat"):
    url = "https://api.together.xyz/v1/completions"
    headers = {
        "Authorization": f"Bearer {LLAMA_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "prompt": prompt,
        "max_tokens": 512,
        "temperature": 0.7
    }
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Vérifie si la requête a réussi
        return response.json()["output"]["choices"][0]["text"]
    except Exception as e:
        print(f"Erreur lors de l'appel à l'API Llama: {e}")
        return f"Erreur: Impossible de communiquer avec l'API. {str(e)}"