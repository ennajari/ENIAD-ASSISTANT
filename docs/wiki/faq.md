# FAQ - Questions Fréquemment Posées

## 🚀 Installation et Configuration

### Q: Quels sont les prérequis pour installer ENIAD-ASSISTANT ?
**R:** Vous avez besoin de :
- Python 3.10+
- Node.js 18+
- 8 GB de RAM minimum (16 GB recommandé)
- 10 GB d'espace disque libre
- Docker (optionnel mais recommandé)

### Q: L'installation Docker ne fonctionne pas, que faire ?
**R:** Vérifiez que :
1. Docker est installé et en cours d'exécution
2. Vous avez les permissions nécessaires
3. Les ports 3000 et 8501 ne sont pas utilisés
```bash
# Vérifier Docker
docker --version
docker-compose --version

# Vérifier les ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :8501
```

### Q: Comment configurer les clés API ?
**R:** Créez un fichier `.env` à la racine du projet :
```env
OPENAI_API_KEY=sk-votre-cle-openai
LLAMA_API_URL=https://votre-endpoint-llama.com
```

## 🤖 Utilisation du Chatbot

### Q: Comment poser une question au chatbot ?
**R:** Trois méthodes sont disponibles :
1. **Interface web** : Accédez à http://localhost:3000
2. **Console** : `cd RAG && python app.py`
3. **API** : Envoyez une requête POST à `/api/chat`

### Q: Le chatbot ne répond pas correctement, pourquoi ?
**R:** Vérifiez :
- La question est-elle claire et en français/anglais ?
- Les documents sources sont-ils indexés ?
- La connexion API fonctionne-t-elle ?
```bash
# Réindexer les documents
cd RAG/src
python create_index.py
```

### Q: Comment améliorer la précision des réponses ?
**R:** 
1. Ajoutez plus de documents dans `RAG/data/`
2. Améliorez la qualité des documents sources
3. Ajustez les paramètres dans `config.py`
4. Utilisez des questions plus spécifiques

### Q: Le chatbot supporte-t-il la voix ?
**R:** Oui, l'interface web inclut :
- Reconnaissance vocale (speech-to-text)
- Synthèse vocale (text-to-speech)
- Support multilingue (français/anglais)

## 📊 Performance et Monitoring

### Q: Comment vérifier les performances du système ?
**R:** Consultez :
- Les logs : `tail -f eniad_assistant.log`
- Les métriques : http://localhost:8501/metrics
- Le monitoring : Interface d'administration

### Q: Le système est lent, comment l'optimiser ?
**R:** 
1. Augmentez la RAM allouée
2. Utilisez un SSD pour le stockage
3. Optimisez la base vectorielle
4. Réduisez la taille des chunks de documents

### Q: Comment sauvegarder les données ?
**R:** 
```bash
# Sauvegarde complète
docker-compose exec mongodb mongodump --out /backup
docker cp container_id:/backup ./backup_$(date +%Y%m%d)

# Sauvegarde de l'index vectoriel
cp -r RAG/chroma_db ./backup_vector_$(date +%Y%m%d)
```

## 🔧 Développement et Personnalisation

### Q: Comment ajouter de nouveaux documents ?
**R:** 
1. Placez les fichiers dans `RAG/data/`
2. Formats supportés : PDF, TXT, DOCX, JSON
3. Réindexez : `cd RAG/src && python create_index.py`

### Q: Comment personnaliser l'interface utilisateur ?
**R:** 
1. Modifiez les composants dans `chatbot-ui/components/`
2. Ajustez les styles dans `chatbot-ui/styles/`
3. Configurez les couleurs dans `tailwind.config.js`

### Q: Comment ajouter une nouvelle langue ?
**R:** 
1. Ajoutez les traductions dans `chatbot-ui/locales/`
2. Configurez le modèle LLM pour la nouvelle langue
3. Ajoutez les documents dans la langue cible

### Q: Comment créer une API personnalisée ?
**R:** 
```python
# app/api/custom/route.py
from fastapi import APIRouter

router = APIRouter()

@router.post("/custom-endpoint")
async def custom_function(data: dict):
    # Votre logique personnalisée
    return {"result": "success"}
```

## 🔐 Sécurité et Administration

### Q: Comment sécuriser l'installation ?
**R:** 
1. Changez les mots de passe par défaut
2. Configurez HTTPS en production
3. Limitez l'accès réseau
4. Activez l'authentification
5. Mettez à jour régulièrement

### Q: Comment gérer les utilisateurs ?
**R:** 
- Interface admin : http://localhost:8501/admin
- Commandes CLI : `python manage.py create_user`
- Base de données : Collection `users` dans MongoDB

### Q: Comment activer l'authentification ?
**R:** 
```env
# .env
ENABLE_AUTH=true
JWT_SECRET=votre-secret-jwt
GOOGLE_CLIENT_ID=votre-client-id
```

## 🚀 Déploiement et Production

### Q: Comment déployer en production ?
**R:** 
1. Utilisez `docker-compose.prod.yml`
2. Configurez un reverse proxy (Nginx)
3. Activez HTTPS avec Let's Encrypt
4. Configurez la sauvegarde automatique

### Q: Comment scaler l'application ?
**R:** 
```bash
# Scaler horizontalement
docker-compose up -d --scale web=3 --scale worker=2

# Utiliser un load balancer
# Configurer Redis pour les sessions partagées
```

### Q: Comment migrer vers un nouveau serveur ?
**R:** 
1. Sauvegardez les données et configurations
2. Installez ENIAD-ASSISTANT sur le nouveau serveur
3. Restaurez les sauvegardes
4. Testez le fonctionnement
5. Redirigez le trafic

## 🐛 Dépannage

### Q: "ModuleNotFoundError" lors du démarrage
**R:** 
```bash
# Réinstaller les dépendances
pip install -r requirements.txt --force-reinstall

# Vérifier l'environnement virtuel
which python
pip list
```

### Q: "Port already in use" avec Docker
**R:** 
```bash
# Trouver le processus utilisant le port
lsof -i :3000
lsof -i :8501

# Arrêter le processus ou changer le port
docker-compose down
# Modifier docker-compose.yml si nécessaire
```

### Q: La base vectorielle ne se charge pas
**R:** 
```bash
# Supprimer et recréer l'index
rm -rf RAG/chroma_db
cd RAG/src
python create_index.py
```

### Q: Erreur de mémoire lors de l'indexation
**R:** 
1. Réduisez la taille des chunks dans `config.py`
2. Traitez les documents par petits lots
3. Augmentez la mémoire virtuelle
4. Utilisez un serveur plus puissant

## 📞 Support et Communauté

### Q: Où obtenir de l'aide ?
**R:** 
- **Documentation** : Cette wiki
- **Issues GitHub** : [Signaler un problème](https://github.com/votre-username/ENIAD-ASSISTANT/issues)
- **Discussions** : [Forum communautaire](https://github.com/votre-username/ENIAD-ASSISTANT/discussions)
- **Email** : support@eniad.ma

### Q: Comment contribuer au projet ?
**R:** 
1. Forkez le repository
2. Créez une branche feature
3. Suivez les [standards de code](Standards-Code)
4. Soumettez une Pull Request

### Q: Comment signaler un bug ?
**R:** 
1. Vérifiez que le bug n'est pas déjà signalé
2. Créez une issue avec :
   - Description détaillée
   - Étapes de reproduction
   - Logs d'erreur
   - Configuration système

---

💡 **Votre question n'est pas listée ?** 
- Consultez la [documentation complète](Home)
- Posez votre question sur [GitHub Discussions](https://github.com/votre-username/ENIAD-ASSISTANT/discussions)
- Contactez le [support technique](Contact-Support)
