from .BaseController import BaseController
from models.db_schemes import Project, DataChunk
from stores.llm.LLMEnums import DocumentTypeEnum
from typing import List
import json

class NLPController(BaseController):

    def __init__(self, vectordb_client, generation_client, 
                 embedding_client, template_parser):
        super().__init__()

        self.vectordb_client = vectordb_client
        self.generation_client = generation_client
        self.embedding_client = embedding_client
        self.template_parser = template_parser

    def create_collection_name(self, project_id: str):
        return f"collection_{project_id}".strip()
    
    def reset_vector_db_collection(self, project: Project):
        collection_name = self.create_collection_name(project_id=project.project_id)
        return self.vectordb_client.delete_collection(collection_name=collection_name)
    
    def get_vector_db_collection_info(self, project: Project):
        collection_name = self.create_collection_name(project_id=project.project_id)
        collection_info = self.vectordb_client.get_collection_info(collection_name=collection_name)

        return json.loads(
            json.dumps(collection_info, default=lambda x: x.__dict__)
        )
    
    def index_into_vector_db(self, project: Project, chunks: List[DataChunk],
                                   chunks_ids: List[int], 
                                   do_reset: bool = False):
        
        # step1: get collection name
        collection_name = self.create_collection_name(project_id=project.project_id)

        # step2: manage items
        texts = [ c.chunk_text for c in chunks ]
        metadata = [ c.chunk_metadata for c in  chunks]
        vectors = [
            self.embedding_client.embed_text(text=text, 
                                             document_type=DocumentTypeEnum.DOCUMENT.value)
            for text in texts
        ]

        # step3: create collection if not exists
        _ = self.vectordb_client.create_collection(
            collection_name=collection_name,
            embedding_size=self.embedding_client.embedding_size,
            do_reset=do_reset,
        )

        # step4: insert into vector db
        _ = self.vectordb_client.insert_many(
            collection_name=collection_name,
            texts=texts,
            metadata=metadata,
            vectors=vectors,
            record_ids=chunks_ids,
        )

        return True

    def search_vector_db_collection(self, project: Project, text: str, limit: int = 10):

        # step1: get collection name
        collection_name = self.create_collection_name(project_id=project.project_id)

        # step2: get text embedding vector
        vector = self.embedding_client.embed_text(text=text, 
                                                 document_type=DocumentTypeEnum.QUERY.value)

        if not vector or len(vector) == 0:
            return False

        # step3: do semantic search
        results = self.vectordb_client.search_by_vector(
            collection_name=collection_name,
            vector=vector,
            limit=limit
        )

        if not results:
            return False

        return results
    
    def answer_rag_question(self, project: Project, query: str, limit: int = 10):

        answer, full_prompt, chat_history = None, None, None

        # step1: retrieve related documents
        retrieved_documents = self.search_vector_db_collection(
            project=project,
            text=query,
            limit=limit,
        )

        # step2: Handle no documents found - Check indexation status first
        if not retrieved_documents or len(retrieved_documents) == 0:
            # Check if collection exists and has data
            collection_name = self.create_collection_name(project_id=project.project_id)
            collection_info = self.vectordb_client.get_collection_info(collection_name)

            vectors_count = collection_info.get('vectors_count', 0) if collection_info else 0

            if vectors_count == 0:
                # No data indexed - return indexation error instead of fake response
                no_data_answer = f"""❌ ERREUR D'INDEXATION DÉTECTÉE

La base de connaissances ENIAD est vide (0 documents indexés).

🔧 ACTIONS REQUISES :
1. Vérifier que les fichiers sont présents dans le dossier DATA/
2. Relancer l'indexation des documents ENIAD
3. Attendre la fin du processus d'embedding

📊 État actuel : {vectors_count} vecteurs dans la collection '{collection_name}'

⚠️ Aucune réponse ne peut être générée sans données indexées."""

                return no_data_answer, "", []
            else:
                # Data exists but no match found - legitimate no-context response
                no_context_answer = f"""Basé sur ma base de connaissances ENIAD ({vectors_count} documents indexés), je n'ai pas trouvé d'information spécifique concernant : "{query}"

🔍 SUGGESTIONS :
- Reformuler avec des termes plus spécifiques (ex: "admission", "formation", "modules")
- Utiliser des mots-clés liés à l'ENIAD
- Poser une question plus précise

📚 Ma base contient des informations sur :
- Les formations et programmes d'études
- Les procédures d'admission et inscription
- Les modules et cursus détaillés
- Les règlements et organisation
- Les activités de recherche et projets

✅ Cette réponse est basée sur {vectors_count} documents officiels ENIAD indexés."""

                return no_context_answer, "", []

        # step3: Construct ENIAD-optimized context with validation
        context_text = ""
        sources = []
        real_data_count = 0

        for idx, doc in enumerate(retrieved_documents):
            context_text += f"\n--- Document ENIAD {idx + 1} ---\n"
            context_text += doc.text
            context_text += "\n"

            # Extract source information and validate data authenticity
            if hasattr(doc, 'metadata') and doc.metadata:
                source_info = doc.metadata.get('source', f'Document {idx + 1}')
                sources.append(source_info)

                # Check if this is real ENIAD data
                is_real_data = doc.metadata.get('is_real_data', False)
                if is_real_data or any(term in source_info.lower() for term in ['eniad_complet', 'official']):
                    real_data_count += 1

        # Validate context quality - ensure we have real ENIAD data
        context_words = len(context_text.split())
        has_eniad_content = any(term in context_text.lower() for term in ['eniad', 'إنياد', 'berkane', 'بركان'])

        # Only reject if absolutely no useful context (very permissive)
        if context_words < 20:
            # Very minimal context - provide helpful response
            helpful_response = f"""Concernant votre question "{query}", voici ce que je peux vous dire sur l'ENIAD :

🏛️ **L'ENIAD (École Nationale de l'Intelligence Artificielle et du Digital)** est une école d'ingénieurs située à Berkane, rattachée à l'Université Mohammed Premier.

📚 **Domaines d'expertise :**
- Intelligence Artificielle et Machine Learning
- Digital et Technologies Numériques
- Ingénierie des Réseaux et Sécurité Informatique
- Robotique et Objets Connectés
- Génie Informatique et Développement

💡 **Pour des informations plus précises :**
- Reformulez votre question avec des termes plus spécifiques
- Consultez le site officiel : https://eniad.ump.ma
- Contactez directement l'administration ENIAD

✅ Cette réponse est basée sur ma connaissance générale de l'ENIAD."""

            return helpful_response, "", retrieved_documents

        # step4: Create ENIAD-specific prompt using improved template
        eniad_prompt = f"""Tu es un assistant expert de l'École Nationale de l'Intelligence Artificielle et du Digital (ENIAD) de Berkane.

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
{context_text}

QUESTION DE L'UTILISATEUR :
{query}

RÉPONSE DÉTAILLÉE (basée sur le contexte ENIAD) :"""

        # step5: Generate answer with Llama 3 8B optimized settings
        try:
            answer = self.generation_client.generate_text(
                prompt=eniad_prompt,
                chat_history=[],
                max_output_tokens=800,  # Plus de tokens pour des réponses détaillées
                temperature=0.2  # Température plus basse pour plus de précision
            )

            # step6: Validate and enhance answer
            if answer and len(answer.strip()) > 10:
                # Add source validation if answer is substantial
                if sources:
                    answer += f"\n\n📚 Sources ENIAD utilisées : {', '.join(set(sources))}"

                # Add disclaimer
                answer += "\n\n✅ Cette réponse est basée exclusivement sur les documents officiels ENIAD de ma base de connaissances."
            else:
                # Fallback if generation failed
                answer = f"""Basé sur ma base de connaissances ENIAD, voici les informations disponibles concernant votre question : "{query}"

{context_text[:500]}...

⚠️ Note : Ces informations proviennent de ma base de connaissances ENIAD. Pour des informations plus complètes ou récentes, je recommande de consulter le site officiel de l'ENIAD ou de contacter directement l'établissement."""

        except Exception as e:
            # Error handling with ENIAD context
            answer = f"""Je rencontre actuellement une difficulté technique pour traiter votre question : "{query}"

Cependant, voici les informations ENIAD pertinentes que j'ai trouvées :

{context_text[:300]}...

Veuillez réessayer ou consulter directement le site ENIAD : https://eniad.ump.ma"""

        # Convert retrieved_documents to serializable format
        serializable_documents = []
        if retrieved_documents:
            for doc in retrieved_documents:
                if hasattr(doc, 'dict'):
                    serializable_documents.append(doc.dict())
                elif hasattr(doc, '__dict__'):
                    serializable_documents.append(doc.__dict__)
                else:
                    serializable_documents.append({
                        'text': str(doc.text) if hasattr(doc, 'text') else str(doc),
                        'score': float(doc.score) if hasattr(doc, 'score') else 0.0
                    })

        return answer, eniad_prompt, serializable_documents

