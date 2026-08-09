#!/usr/bin/env python3
"""
Script de démarrage pour le serveur RAG ENIAD
"""

import uvicorn
import os
import sys

if __name__ == "__main__":
    # S'assurer qu'on est dans le bon répertoire
    current_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(current_dir)
    
    print(f"🚀 Démarrage du serveur RAG ENIAD depuis: {current_dir}")
    print("📡 Serveur disponible sur: http://localhost:8001")
    print("📚 Documentation API: http://localhost:8001/docs")
    print("=" * 60)
    
    # Démarrer le serveur
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        reload_dirs=[current_dir]
    )
