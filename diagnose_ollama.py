#!/usr/bin/env python3
"""
Diagnostic de l'état d'Ollama
"""

import requests
import time
import psutil

def check_ollama_service():
    """Vérifier le service Ollama"""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get('models', [])
            return True, models
        return False, f"HTTP {response.status_code}"
    except Exception as e:
        return False, str(e)

def check_system_resources():
    """Vérifier les ressources système"""
    try:
        # RAM
        memory = psutil.virtual_memory()
        ram_used = memory.percent
        ram_available = memory.available / (1024**3)  # GB
        
        # CPU
        cpu_percent = psutil.cpu_percent(interval=1)
        
        return {
            "ram_used_percent": ram_used,
            "ram_available_gb": ram_available,
            "cpu_percent": cpu_percent
        }
    except Exception as e:
        return {"error": str(e)}

def test_ollama_embedding():
    """Tester la génération d'embedding simple"""
    try:
        payload = {
            "model": "nomic-embed-text",
            "prompt": "test"
        }
        
        start_time = time.time()
        response = requests.post(
            "http://localhost:11434/api/embeddings",
            json=payload,
            timeout=60
        )
        end_time = time.time()
        
        if response.status_code == 200:
            duration = end_time - start_time
            result = response.json()
            embedding = result.get('embedding', [])
            return True, {
                "duration": duration,
                "embedding_size": len(embedding)
            }
        else:
            return False, f"HTTP {response.status_code}"
            
    except Exception as e:
        return False, str(e)

def main():
    """Diagnostic principal"""
    print("🔍 DIAGNOSTIC OLLAMA")
    print("=" * 30)
    
    # 1. Service Ollama
    print("1. Service Ollama...")
    ollama_ok, ollama_info = check_ollama_service()
    if ollama_ok:
        print(f"   ✅ Ollama accessible")
        print(f"   📦 Modèles: {len(ollama_info)}")
        for model in ollama_info[:3]:  # Afficher les 3 premiers
            name = model.get('name', 'Unknown')
            size = model.get('size', 0) / (1024**3)  # GB
            print(f"      - {name} ({size:.1f}GB)")
    else:
        print(f"   ❌ Ollama: {ollama_info}")
        print("   💡 Démarrez Ollama: ollama serve")
        return
    
    # 2. Ressources système
    print("\n2. Ressources système...")
    resources = check_system_resources()
    if "error" not in resources:
        print(f"   💾 RAM utilisée: {resources['ram_used_percent']:.1f}%")
        print(f"   💾 RAM disponible: {resources['ram_available_gb']:.1f}GB")
        print(f"   🖥️ CPU: {resources['cpu_percent']:.1f}%")
        
        # Alertes
        if resources['ram_used_percent'] > 80:
            print("   ⚠️ RAM critique (>80%)")
        if resources['ram_available_gb'] < 2:
            print("   ⚠️ RAM disponible faible (<2GB)")
        if resources['cpu_percent'] > 80:
            print("   ⚠️ CPU surchargé (>80%)")
    else:
        print(f"   ❌ Erreur: {resources['error']}")
    
    # 3. Test d'embedding
    print("\n3. Test d'embedding...")
    print("   ⏳ Génération d'un embedding de test...")
    
    embed_ok, embed_info = test_ollama_embedding()
    if embed_ok:
        duration = embed_info['duration']
        size = embed_info['embedding_size']
        print(f"   ✅ Embedding généré en {duration:.2f}s")
        print(f"   📊 Taille: {size} dimensions")
        
        # Analyse de performance
        if duration < 5:
            print("   🚀 Performance excellente")
        elif duration < 15:
            print("   ✅ Performance acceptable")
        elif duration < 30:
            print("   ⚠️ Performance lente")
        else:
            print("   ❌ Performance très lente")
            print("   💡 Considérez redémarrer Ollama")
    else:
        print(f"   ❌ Échec: {embed_info}")
    
    # 4. Recommandations
    print("\n💡 RECOMMANDATIONS:")
    
    if not ollama_ok:
        print("- Démarrez Ollama: ollama serve")
    elif not embed_ok:
        print("- Redémarrez Ollama")
        print("- Vérifiez les modèles installés")
    elif embed_ok and embed_info.get('duration', 0) > 30:
        print("- Ollama est très lent, redémarrage recommandé")
        print("- Fermez d'autres applications pour libérer la RAM")
    else:
        print("- Ollama fonctionne correctement")
        print("- Le problème vient probablement du volume de données à indexer")
        print("- Utilisez fix_indexation_ultra_light.py pour indexer progressivement")

if __name__ == "__main__":
    main()
