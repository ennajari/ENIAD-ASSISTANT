# 🤖 Configuration Gemini pour ENIAD Assistant

## 📋 Vue d'ensemble

Ce guide explique comment utiliser **Gemini 1.5 Flash** comme solution temporaire pour tester l'interface ENIAD Assistant pendant que l'API Modal est indisponible pour cause de paiement.

## 🚀 Démarrage Rapide

### Option 1: Script Automatique (Recommandé)

**Windows:**
```bash
start-with-gemini.bat
```

**Linux/Mac:**
```bash
chmod +x start-with-gemini.sh
./start-with-gemini.sh
```

### Option 2: Configuration Manuelle

1. **Vérifier le fichier .env:**
```env
# 🤖 Gemini API Configuration (Test Mode)
VITE_GEMINI_API_KEY=AIzaSyAczCyyNGdK7xsBSu2itvilLGMtn6d0QiY
VITE_MODEL_NAME=gemini/gemini-1.5-flash
VITE_USE_GEMINI_FALLBACK=true
```

2. **Démarrer l'interface:**
```bash
npm run dev
```

## 🔧 Configuration Détaillée

### Variables d'Environnement

| Variable | Valeur | Description |
|----------|--------|-------------|
| `VITE_GEMINI_API_KEY` | `AIzaSyAczCyyNGdK7xsBSu2itvilLGMtn6d0QiY` | Clé API Gemini pour les tests |
| `VITE_MODEL_NAME` | `gemini/gemini-1.5-flash` | Modèle Gemini à utiliser |
| `VITE_USE_GEMINI_FALLBACK` | `true` | Active le fallback Gemini |
| `VITE_BUDGET_MODE` | `true` | Mode économique activé |
| `VITE_MAX_TOKENS` | `400` | Limite de tokens pour économiser |
| `VITE_TEMPERATURE` | `0.7` | Créativité du modèle |

### Fonctionnalités Disponibles

✅ **Chat Interface Complète**
- Conversation en français et arabe
- Historique des conversations
- Sauvegarde Firebase
- Interface responsive

✅ **Système SMA (Demo)**
- Démonstration des agents intelligents
- Simulation de web scraping
- Interface de monitoring

✅ **Système RAG (Demo)**
- Architecture de recherche sémantique
- Base de connaissances simulée
- Métriques de performance

## 🧪 Tests et Validation

### 1. Test de Connexion Gemini
Accédez à: `http://localhost:3174/gemini`

Cette page permet de:
- ✅ Vérifier la connexion API
- ✅ Tester la génération de réponses
- ✅ Voir les métriques d'utilisation
- ✅ Valider la configuration

### 2. Test de l'Interface Chat
Accédez à: `http://localhost:3174`

Fonctionnalités testables:
- ✅ Envoi de messages
- ✅ Réponses du modèle Gemini
- ✅ Changement de langue
- ✅ Sauvegarde des conversations

### 3. Démonstrations SMA et RAG
- **SMA Demo**: `http://localhost:3174/sma-demo.html`
- **RAG Demo**: `http://localhost:3174/rag-demo.html`

## 🔄 Intégration avec les Systèmes

### SMA (Smart Multi-Agent)
```javascript
// Le système SMA est intégré avec Gemini
// Les résultats SMA enrichissent les réponses Gemini
if (smaResults && smaResults.results) {
  // Contexte SMA ajouté à la requête Gemini
  const smaContext = smaResults.results.map(result => 
    `${result.title}: ${result.content}`
  ).join('\n');
}
```

### RAG (Retrieval-Augmented Generation)
```javascript
// Le système RAG peut utiliser Gemini comme modèle de génération
// Fallback automatique vers Gemini si l'API principale échoue
const response = await geminiService.generateChatCompletion(
  messagesWithRAGContext,
  { maxTokens: 400, temperature: 0.7 }
);
```

## 📊 Monitoring et Métriques

### Utilisation des Tokens
- **Limite par requête**: 400 tokens
- **Optimisation**: Contexte limité aux 3 derniers messages
- **Économie**: Troncature automatique des messages longs

### Performance
- **Latence moyenne**: ~2-3 secondes
- **Taux de succès**: >95%
- **Langues supportées**: Français, Arabe, Anglais

## 🚨 Limitations Temporaires

### Pendant l'utilisation de Gemini:
- ❌ Pas d'accès au modèle Llama3 personnalisé
- ❌ RAG limité aux démonstrations
- ❌ SMA en mode simulation
- ✅ Interface complètement fonctionnelle
- ✅ Sauvegarde Firebase active
- ✅ Toutes les fonctionnalités UI disponibles

## 🔄 Retour au Modèle Principal

Quand l'API Modal sera à nouveau disponible:

1. **Désactiver Gemini:**
```env
VITE_USE_GEMINI_FALLBACK=false
```

2. **Réactiver l'API Modal:**
```env
VITE_RAG_API_BASE_URL=https://your-modal-endpoint.com
```

3. **Redémarrer l'interface:**
```bash
npm run dev
```

## 🎯 Utilisation pour les Démonstrations

### Pour les Professeurs:
1. **Démarrer avec**: `start-with-gemini.bat`
2. **Montrer l'interface**: `http://localhost:3174`
3. **Démonstrations**:
   - SMA: `http://localhost:3174/sma-demo.html`
   - RAG: `http://localhost:3174/rag-demo.html`
4. **Test technique**: `http://localhost:3174/gemini`

### Scénarios de Démonstration:
- ✅ Chat multilingue fonctionnel
- ✅ Architecture SMA expliquée
- ✅ Système RAG détaillé
- ✅ Interface professionnelle
- ✅ Sauvegarde des conversations

## 📞 Support

En cas de problème:
1. Vérifier la console du navigateur (F12)
2. Vérifier les logs du terminal
3. Tester la connexion: `/gemini`
4. Redémarrer avec le script: `start-with-gemini.bat`

---

**Note**: Cette configuration Gemini est temporaire et permet de continuer le développement et les démonstrations pendant que l'API Modal principale est indisponible.
