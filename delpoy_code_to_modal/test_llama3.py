import requests

API_URL = "https://abdellah-ennajari-23--llama3-openai-compatible-serve.modal.run/v1/chat/completions"
API_KEY = "super-secret-key"  # Doit correspondre à celui dans serve_llama.py

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "model": "ahmed-ouka/llama3-8b-eniad-merged-32bit",
    "messages": [
        {"role": "user", "content": "Quelle est la capitale du Maroc ?"}
    ]
}

response = requests.post(API_URL, headers=headers, json=data)

print("Réponse du modèle :")
print(response.json())
