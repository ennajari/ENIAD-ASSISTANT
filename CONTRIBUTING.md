# 🤝 Guide de Contribution - ENIAD-ASSISTANT

Merci de votre intérêt pour contribuer à ENIAD-ASSISTANT ! Ce guide vous aidera à comprendre comment participer efficacement au développement du projet.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Types de contributions](#types-de-contributions)
- [Configuration de l'environnement de développement](#configuration-de-lenvironnement-de-développement)
- [Standards de code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Signalement de bugs](#signalement-de-bugs)
- [Suggestions d'améliorations](#suggestions-daméliorations)
- [Documentation](#documentation)
- [Tests](#tests)
- [Communauté](#communauté)

## 📜 Code de conduite

En participant à ce projet, vous acceptez de respecter notre [Code de Conduite](CODE_OF_CONDUCT.md). Nous nous engageons à maintenir un environnement accueillant et inclusif pour tous.

## 🚀 Comment contribuer

### Première contribution ?

1. **Forkez** le repository
2. **Clonez** votre fork localement
3. **Créez** une branche pour votre contribution
4. **Effectuez** vos modifications
5. **Testez** vos changements
6. **Soumettez** une Pull Request

```bash
# Fork et clone
git clone https://github.com/votre-username/ENIAD-ASSISTANT.git
cd ENIAD-ASSISTANT

# Créer une branche
git checkout -b feature/ma-nouvelle-fonctionnalite

# Après vos modifications
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"
git push origin feature/ma-nouvelle-fonctionnalite
```

## 🎯 Types de contributions

Nous accueillons plusieurs types de contributions :

### 🐛 Corrections de bugs
- Signalement de bugs avec reproduction détaillée
- Correction de bugs existants
- Amélioration de la gestion d'erreurs

### ✨ Nouvelles fonctionnalités
- Nouvelles capacités du chatbot
- Améliorations de l'interface utilisateur
- Intégrations avec des services externes
- Optimisations de performance

### 📚 Documentation
- Amélioration de la documentation existante
- Création de tutoriels
- Traductions
- Exemples d'utilisation

### 🧪 Tests
- Ajout de tests unitaires
- Tests d'intégration
- Tests de performance
- Amélioration de la couverture de tests

### 🎨 Design et UX
- Améliorations de l'interface utilisateur
- Optimisation de l'expérience utilisateur
- Accessibilité
- Design responsive

## 🛠️ Configuration de l'environnement de développement

### Prérequis
- Python 3.10+
- Node.js 18+
- Git
- Docker (optionnel)

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/ENIAD-ASSISTANT.git
cd ENIAD-ASSISTANT

# Configuration Python
python -m venv venv
source venv/bin/activate  # Linux/macOS
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt
pip install -r requirements-dev.txt

# Configuration Node.js
cd chatbot-ui
npm install
cd ..

# Configuration des variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations
```

### Outils de développement

```bash
# Installer les hooks pre-commit
pre-commit install

# Lancer les tests
python -m pytest
npm test

# Vérification du code
flake8 .
black .
eslint chatbot-ui/
```

## 📏 Standards de code

### Python

#### Style de code
- Suivre **PEP 8**
- Utiliser **Black** pour le formatage automatique
- Utiliser **flake8** pour la vérification
- Longueur de ligne : 88 caractères

```python
# Bon exemple
def process_user_query(query: str, context: Dict[str, Any]) -> str:
    """
    Traite une requête utilisateur et retourne une réponse.

    Args:
        query: La question de l'utilisateur
        context: Le contexte de la conversation

    Returns:
        La réponse générée
    """
    if not query.strip():
        raise ValueError("La requête ne peut pas être vide")

    # Traitement de la requête
    response = generate_response(query, context)
    return response
```

#### Documentation
- **Docstrings** pour toutes les fonctions publiques
- **Type hints** obligatoires
- **Commentaires** pour la logique complexe

#### Structure des modules
```python
"""
Module de traitement des requêtes utilisateur.

Ce module contient les fonctions principales pour traiter
et répondre aux questions des utilisateurs.
"""

import logging
from typing import Dict, List, Optional

from src.config import settings
from src.models import UserQuery, Response

logger = logging.getLogger(__name__)

# Constantes
MAX_QUERY_LENGTH = 1000
DEFAULT_LANGUAGE = "fr"
```

### JavaScript/TypeScript

#### Style de code
- Utiliser **TypeScript** pour tous les nouveaux fichiers
- Suivre **ESLint** et **Prettier**
- Utiliser **camelCase** pour les variables et fonctions
- Utiliser **PascalCase** pour les composants React

```typescript
// Bon exemple
interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  messages,
  onSendMessage
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  }, [inputValue, onSendMessage]);

  return (
    <div className="chat-container">
      {/* Composant de chat */}
    </div>
  );
};
```

### Commits

#### Convention des messages de commit
Utiliser la convention **Conventional Commits** :

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types autorisés :**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Changements de style (formatage, etc.)
- `refactor`: Refactoring du code
- `test`: Ajout ou modification de tests
- `chore`: Tâches de maintenance

**Exemples :**
```bash
feat(rag): ajouter support pour les documents PDF
fix(ui): corriger l'affichage des messages longs
docs(api): mettre à jour la documentation de l'API
test(chat): ajouter tests pour la validation des entrées
```

## 🔄 Processus de Pull Request

### Avant de soumettre

1. **Vérifiez** que votre code suit les standards
2. **Exécutez** tous les tests
3. **Mettez à jour** la documentation si nécessaire
4. **Testez** manuellement vos changements

```bash
# Vérifications avant PR
python -m pytest
npm test
flake8 .
black --check .
eslint chatbot-ui/
```

### Template de Pull Request

```markdown
## Description
Brève description des changements apportés.

## Type de changement
- [ ] Bug fix (changement non-breaking qui corrige un problème)
- [ ] Nouvelle fonctionnalité (changement non-breaking qui ajoute une fonctionnalité)
- [ ] Breaking change (correction ou fonctionnalité qui casserait la fonctionnalité existante)
- [ ] Mise à jour de documentation

## Tests
- [ ] J'ai ajouté des tests qui prouvent que ma correction est efficace ou que ma fonctionnalité fonctionne
- [ ] Les tests unitaires nouveaux et existants passent localement avec mes changements

## Checklist
- [ ] Mon code suit les guidelines de style de ce projet
- [ ] J'ai effectué une auto-review de mon propre code
- [ ] J'ai commenté mon code, particulièrement dans les zones difficiles à comprendre
- [ ] J'ai apporté les changements correspondants à la documentation
- [ ] Mes changements ne génèrent aucun nouveau warning
```

### Processus de review

1. **Soumission** : Créez votre PR avec une description claire
2. **Review automatique** : Les CI/CD checks doivent passer
3. **Review manuelle** : Au moins un mainteneur doit approuver
4. **Merge** : Après approbation et résolution des conflits

## 🐛 Signalement de bugs

### Avant de signaler

1. **Vérifiez** que le bug n'est pas déjà signalé
2. **Reproduisez** le bug de manière consistante
3. **Testez** avec la dernière version

### Template de bug report

```markdown
**Description du bug**
Description claire et concise du problème.

**Reproduction**
Étapes pour reproduire le comportement :
1. Aller à '...'
2. Cliquer sur '....'
3. Faire défiler jusqu'à '....'
4. Voir l'erreur

**Comportement attendu**
Description claire de ce qui devrait se passer.

**Screenshots**
Si applicable, ajoutez des screenshots pour expliquer le problème.

**Environnement:**
 - OS: [e.g. Ubuntu 20.04]
 - Python: [e.g. 3.10.5]
 - Node.js: [e.g. 18.16.0]
 - Version: [e.g. 1.2.0]

**Logs**
```
Coller les logs d'erreur pertinents ici
```

**Contexte additionnel**
Tout autre contexte sur le problème.
```

## 💡 Suggestions d'améliorations

### Template de feature request

```markdown
**La fonctionnalité est-elle liée à un problème ?**
Description claire du problème. Ex. Je suis toujours frustré quand [...]

**Décrivez la solution souhaitée**
Description claire de ce que vous voulez qu'il se passe.

**Décrivez les alternatives considérées**
Description des solutions alternatives que vous avez considérées.

**Contexte additionnel**
Tout autre contexte ou screenshots sur la demande de fonctionnalité.
```

## 📚 Documentation

### Types de documentation

1. **Code documentation** : Docstrings et commentaires
2. **API documentation** : Documentation des endpoints
3. **User documentation** : Guides utilisateur
4. **Developer documentation** : Guides de développement

### Standards de documentation

- **Clarté** : Langage simple et direct
- **Exemples** : Code examples pratiques
- **Structure** : Organisation logique
- **Mise à jour** : Synchronisation avec le code

```python
def process_document(file_path: str, chunk_size: int = 1000) -> List[str]:
    """
    Traite un document et le divise en chunks pour l'indexation.

    Cette fonction lit un document depuis le système de fichiers,
    le nettoie et le divise en chunks de taille appropriée pour
    l'indexation vectorielle.

    Args:
        file_path: Chemin vers le fichier à traiter
        chunk_size: Taille maximale de chaque chunk en caractères

    Returns:
        Liste des chunks de texte

    Raises:
        FileNotFoundError: Si le fichier n'existe pas
        ValueError: Si chunk_size est <= 0

    Example:
        >>> chunks = process_document("document.pdf", 500)
        >>> len(chunks)
        10
        >>> chunks[0][:50]
        "Introduction à l'École Nationale d'Informatique"
    """
```

## 🧪 Tests

### Types de tests requis

1. **Tests unitaires** : Fonctions individuelles
2. **Tests d'intégration** : Interaction entre composants
3. **Tests end-to-end** : Flux utilisateur complets
4. **Tests de performance** : Temps de réponse et charge

### Structure des tests

```
tests/
├── unit/
│   ├── test_rag_pipeline.py
│   ├── test_query_engine.py
│   └── test_document_loader.py
├── integration/
│   ├── test_api_endpoints.py
│   └── test_database_operations.py
├── e2e/
│   ├── test_chat_flow.py
│   └── test_admin_interface.py
└── performance/
    ├── test_response_time.py
    └── test_load_capacity.py
```

### Exemple de test

```python
import pytest
from unittest.mock import Mock, patch

from src.rag_pipeline import RAGPipeline
from src.exceptions import DocumentNotFoundError

class TestRAGPipeline:

    @pytest.fixture
    def rag_pipeline(self):
        return RAGPipeline(config={"chunk_size": 1000})

    def test_process_query_success(self, rag_pipeline):
        """Test du traitement réussi d'une requête."""
        query = "Quels sont les programmes d'études ?"

        with patch.object(rag_pipeline, '_search_documents') as mock_search:
            mock_search.return_value = ["Document 1", "Document 2"]

            result = rag_pipeline.process_query(query)

            assert result is not None
            assert len(result) > 0
            mock_search.assert_called_once_with(query)

    def test_process_empty_query(self, rag_pipeline):
        """Test du traitement d'une requête vide."""
        with pytest.raises(ValueError, match="La requête ne peut pas être vide"):
            rag_pipeline.process_query("")
```

## 👥 Communauté

### Canaux de communication

- **GitHub Issues** : Bugs et feature requests
- **GitHub Discussions** : Questions et discussions générales
- **Email** : support@eniad.ma pour les questions urgentes

### Événements communautaires

- **Réunions mensuelles** : Premier vendredi de chaque mois
- **Hackathons** : Événements trimestriels
- **Workshops** : Sessions de formation

### Reconnaissance des contributeurs

- **Contributors** : Listés dans le README
- **Hall of Fame** : Contributeurs exceptionnels
- **Badges** : Reconnaissance des différents types de contributions

## 🎉 Merci !

Votre contribution, quelle qu'elle soit, est précieuse pour la communauté ENIAD-ASSISTANT. Ensemble, nous construisons un outil qui aidera des milliers d'étudiants et d'enseignants.

### Ressources utiles

- [Documentation complète](https://github.com/votre-username/ENIAD-ASSISTANT/wiki)
- [Roadmap du projet](https://github.com/votre-username/ENIAD-ASSISTANT/projects)
- [Code de conduite](CODE_OF_CONDUCT.md)
- [Licence](LICENSE)

---

<div align="center">
  <strong>🤝 Ensemble, rendons l'éducation plus accessible !</strong>
</div>