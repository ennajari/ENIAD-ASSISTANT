"""
Templates français optimisés pour ENIAD RAG System
Prompts spécialement conçus pour que Llama réponde uniquement basé sur la base de connaissances ENIAD
"""

from string import Template

# Template principal pour les réponses RAG ENIAD
rag_answer_template = Template("""Tu es un assistant expert de l'École Nationale de l'Intelligence Artificielle et du Digital (ENIAD) de Berkane.

MISSION : Fournir des informations précises et utiles sur l'ENIAD en te basant sur le contexte fourni.

INSTRUCTIONS :
1. Utilise PRIORITAIREMENT le contexte ENIAD fourni ci-dessous pour répondre
2. Donne des réponses complètes, détaillées et structurées
3. Si le contexte contient des informations pertinentes, développe-les de manière claire
4. Organise ta réponse avec des puces, listes ou sections si approprié
5. Sois informatif et constructif dans tes réponses
6. Si certaines informations manquent, indique ce qui est disponible et suggère où trouver le reste
7. Réponds en français de manière professionnelle et accessible

CONTEXTE ENIAD (Documents officiels) :
$context

QUESTION DE L'UTILISATEUR :
$query

RÉPONSE DÉTAILLÉE (basée sur le contexte ENIAD) :""")

# Template pour les recherches sans contexte
no_context_template = Template("""Concernant votre question "$query", je n'ai pas trouvé d'informations spécifiques dans ma base de connaissances ENIAD actuelle.

Cependant, voici ce que je peux vous dire sur l'ENIAD :

🏛️ **L'ENIAD (École Nationale de l'Intelligence Artificielle et du Digital)** est une école d'ingénieurs située à Berkane, rattachée à l'Université Mohammed Premier.

📚 **Domaines d'expertise :**
- Intelligence Artificielle
- Digital et Technologies Numériques
- Ingénierie des Réseaux et Sécurité Informatique
- Robotique et Objets Connectés
- Génie Informatique

💡 **Pour des informations plus précises :**
- Reformulez votre question avec des termes plus spécifiques (ex: "formations ingénieur ENIAD", "admission ENIAD")
- Consultez le site officiel : https://eniad.ump.ma
- Contactez directement l'administration ENIAD""")

# Template pour les réponses partielles
partial_context_template = Template("""Basé sur ma base de connaissances ENIAD, voici les informations disponibles concernant votre question : "$query"

$context

⚠️ Note : Ces informations proviennent de ma base de connaissances ENIAD. Pour des informations plus complètes ou récentes, je recommande de consulter le site officiel de l'ENIAD ou de contacter directement l'établissement.""")

# Template pour validation des sources
source_validation_template = Template("""SOURCES ENIAD UTILISÉES :
$sources

Cette réponse est basée exclusivement sur les documents officiels ENIAD de ma base de connaissances.""")

# Template pour les questions hors sujet
off_topic_template = Template("""Je suis un assistant spécialisé pour l'École Nationale de l'Intelligence Artificielle et du Digital (ENIAD) de Berkane.

Votre question "$query" semble être en dehors de mon domaine d'expertise ENIAD.

Je peux vous aider avec des questions concernant :
✅ Les formations et programmes ENIAD
✅ Les procédures d'admission
✅ Les modules et cursus
✅ L'organisation de l'école
✅ Les activités de recherche
✅ Les règlements étudiants

Pourriez-vous reformuler votre question en relation avec l'ENIAD ?""")

# Template pour les réponses avec confiance élevée
high_confidence_template = Template("""Basé sur ma base de connaissances officielle ENIAD :

$context

$answer

✅ Cette information provient directement des documents officiels ENIAD dans ma base de connaissances.""")

# Template pour les réponses avec confiance faible
low_confidence_template = Template("""D'après les informations partielles disponibles dans ma base de connaissances ENIAD :

$context

⚠️ Attention : Cette information est incomplète. Pour des détails précis et à jour, je recommande de :
- Consulter le site officiel ENIAD : https://eniad.ump.ma
- Contacter directement l'administration ENIAD
- Vérifier auprès des services concernés""")

# Template pour les questions sur les formations
formation_template = Template("""🎓 **FORMATIONS DISPONIBLES À L'ENIAD**

Basé sur ma base de connaissances officielle, voici les informations sur les formations ENIAD :

$context

📋 **Informations complémentaires :**
L'ENIAD propose des formations d'ingénieur dans les domaines de pointe du numérique et de l'intelligence artificielle.

🔗 **Pour plus de détails :**
- Site officiel : https://eniad.ump.ma
- Contact direct avec l'administration pour les modalités d'inscription
- Consultez les brochures officielles pour les programmes détaillés

✅ Ces informations proviennent des documents officiels ENIAD de ma base de connaissances.""")

# Template pour les questions sur l'admission
admission_template = Template("""ADMISSION ENIAD - Procédures officielles :

$context

📋 Important : Les procédures d'admission peuvent évoluer. Vérifiez toujours les informations les plus récentes sur le site officiel ENIAD ou auprès du service des admissions.""")

# Template pour les questions sur les modules
modules_template = Template("""MODULES ET CURSUS ENIAD :

$context

📖 Ces modules sont extraits de ma base de connaissances ENIAD. Les contenus peuvent être mis à jour selon l'évolution pédagogique.""")

# Template pour les questions générales sur l'école
general_info_template = Template("""INFORMATIONS GÉNÉRALES ENIAD :

$context

🏛️ L'ENIAD (École Nationale de l'Intelligence Artificielle et du Digital) fait partie de l'Université Mohammed Premier (UMP) et est située à Berkane.""")

# Template pour les erreurs système
system_error_template = Template("""Je rencontre actuellement une difficulté technique pour accéder à ma base de connaissances ENIAD.

Pour votre question : "$query"

Veuillez :
- Réessayer dans quelques instants
- Consulter directement le site ENIAD : https://eniad.ump.ma
- Contacter l'administration ENIAD

Je m'excuse pour ce désagrément temporaire.""")

# Template pour les questions multilingues
multilingual_template = Template("""Je détecte que votre question pourrait être dans une autre langue. Je réponds principalement en français pour les questions concernant l'ENIAD.

Question détectée : "$query"

Pourriez-vous reformuler votre question en français concernant :
- Les formations ENIAD
- L'admission
- Les modules d'enseignement
- L'organisation de l'école

Merci de votre compréhension.""")
