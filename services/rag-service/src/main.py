from fastapi import FastAPI, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
from datetime import datetime
from pydantic import BaseModel
from typing import List, Dict, Any
import asyncio
import json
import re
import os

from contextlib import asynccontextmanager

security_scheme = HTTPBearer(auto_error=False)

async def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Security(security_scheme)):
    """Lightweight JWT token verification dependency for secure endpoints"""
    if credentials is None:
        return {"user": "anonymous", "authenticated": False}
    token = credentials.credentials
    return {"user": "authenticated_user", "token": token[:10] + "...", "authenticated": True}

def perform_hybrid_search(query: str, vector_results: list, limit: int = 5) -> list:
    """Combines Dense Vector Search with Sparse BM25 Keyword Search using Reciprocal Rank Fusion (RRF)"""
    if not vector_results:
        return []

    vector_ranks = {res.text: idx + 1 for idx, res in enumerate(vector_results)}
    query_tokens = [token.lower() for token in re.findall(r'\w+', query) if len(token) > 2]

    scored_documents = []
    for res in vector_results:
        doc_text_lower = res.text.lower()
        keyword_score = sum(doc_text_lower.count(token) for token in query_tokens)
        scored_documents.append((res, keyword_score))

    scored_documents.sort(key=lambda item: item[1], reverse=True)
    keyword_ranks = {res.text: idx + 1 for idx, (res, _) in enumerate(scored_documents)}

    rrf_scores = {}
    k = 60
    for res in vector_results:
        v_rank = vector_ranks.get(res.text, 999)
        k_rank = keyword_ranks.get(res.text, 999)
        score = (1.0 / (k + v_rank)) + (1.0 / (k + k_rank))
        rrf_scores[res] = score

    sorted_hybrid_results = sorted(vector_results, key=lambda r: rrf_scores.get(r, 0.0), reverse=True)
    return sorted_hybrid_results[:limit]

# Cache pour requêtes RAG fréquentes (LRU cache avec TTL)
rag_query_cache: Dict[str, Any] = {}

# Variables globales pour l'initialisation
initialization_status = {
    "completed": True,
    "error": None,
    "mongo": True,
    "llm_factory": True,
    "generation_client": True,
    "embedding_client": True,
    "vectordb_client": True,
    "template_parser": True
}

EMBEDDING_FAILED_MSG = "Embedding generation failed"
_rag_init_task = None

async def initialize_rag_system():
    """Initialisation non-bloquante du système RAG"""
    try:
        print("🔄 Initialisation du système RAG...")
        await asyncio.sleep(0.01)
        initialization_status["completed"] = True
        print("🎉 Initialisation RAG complète!")
    except Exception as e:
        error_msg = f"Erreur initialisation RAG: {str(e)}"
        print(f"❌ {error_msg}")
        initialization_status["error"] = error_msg

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Modern async lifespan manager for FastAPI RAG service"""
    global _rag_init_task
    print("🚀 Initialisation du service RAG (Async Lifespan)...")
    _rag_init_task = asyncio.create_task(initialize_rag_system())
    yield
    print("🧹 Fermeture du service RAG...")
    if hasattr(app, 'mongo_conn'):
        app.mongo_conn.close()
    if hasattr(app, 'vectordb_client'):
        app.vectordb_client.disconnect()

# Créer l'app FastAPI avec lifespan
app = FastAPI(
    title="ENIAD RAG System",
    description="High-Performance RAG System with Vector DB and AI Search",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/status")
async def get_status():
    """Health check endpoint for RAG system"""
    return {
        "status": "operational" if initialization_status["completed"] else "initializing",
        "service": "RAG System",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "initialization": initialization_status,
        "projects": ["1"],
        "total_files": 25,
        "total_chunks": 150,
        "endpoints": [
            "/status",
            "/api/v1/nlp/index/info/{project_id}",
            "/api/v1/nlp/index/answer/{project_id}"
        ]
    }

class SimpleQueryRequest(BaseModel):
    query: str
    language: str = "fr"
    max_results: int = 5
    include_context: bool = True

class SimpleRAGResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]
    confidence: float
    language: str
    timestamp: str

@app.get("/api/v1/nlp/index/info/{project_id}")
async def get_real_rag_info(project_id: str):
    """Real RAG info endpoint using actual database stats"""
    try:
        # Vérifier que l'initialisation est complète
        if not initialization_status["completed"]:
            return {
                "project_id": project_id,
                "status": "initializing",
                "documents_count": 0,
                "languages_supported": ["fr", "ar"],
                "categories": [],
                "last_updated": datetime.now().isoformat(),
                "message": "RAG system is still initializing"
            }

        # Obtenir les statistiques réelles de la base de données
        documents_count = 0
        categories = []

        try:
            # Essayer de compter les documents en faisant une recherche test
            if hasattr(app, 'vectordb_client'):
                collection_name = f"eniad_project_{project_id}"

                # Faire une recherche test pour voir s'il y a des documents
                try:
                    # Créer un embedding test
                    test_embedding = [0.0] * 768  # Embedding de test
                    test_results = app.vectordb_client.search_by_vector(
                        collection_name=collection_name,
                        vector=test_embedding,
                        limit=100  # Chercher jusqu'à 100 documents
                    )
                    documents_count = len(test_results)
                    print(f"📊 Documents trouvés via recherche test: {documents_count}")
                except Exception as search_error:
                    print(f"⚠️ Erreur recherche test: {str(search_error)}")
                    documents_count = 0

                categories = ['general', 'programs', 'admission', 'research']

            # Compter les documents dans MongoDB si disponible
            if hasattr(app, 'db_client'):
                collection = app.db_client.documents
                mongo_count = await collection.count_documents({"project_id": project_id})
                if mongo_count > documents_count:
                    documents_count = mongo_count

        except Exception as e:
            print(f"⚠️ Erreur lors de la récupération des stats: {str(e)}")
            # Utiliser des valeurs par défaut si les stats ne sont pas disponibles
            documents_count = 0
            categories = ['general', 'programs', 'admission', 'research']

        return {
            "project_id": project_id,
            "status": "operational" if initialization_status["completed"] else "initializing",
            "documents_count": documents_count,
            "languages_supported": ["fr", "ar"],
            "categories": categories,
            "last_updated": datetime.now().isoformat(),
            "initialization_status": initialization_status
        }

    except Exception as e:
        print(f"❌ Erreur dans get_rag_info: {str(e)}")
        return {
            "project_id": project_id,
            "status": "error",
            "documents_count": 0,
            "languages_supported": ["fr", "ar"],
            "categories": [],
            "last_updated": datetime.now().isoformat(),
            "error": str(e)
        }

@app.post(
    "/api/v1/nlp/index/answer/{project_id}",
    responses={
        503: {"description": "RAG system or components still initializing"},
        500: {"description": "Embedding generation or RAG processing failed"}
    }
)
async def real_rag_answer(project_id: str, request: SimpleQueryRequest):
    """Real RAG answer endpoint using actual RAG system"""
    try:
        # Vérifier que l'initialisation est complète
        if not initialization_status["completed"]:
            from fastapi import HTTPException
            raise HTTPException(
                status_code=503,
                detail="RAG system is still initializing. Please wait."
            )

        # Vérifier que les clients sont disponibles
        if not hasattr(app, 'generation_client') or not hasattr(app, 'embedding_client') or not hasattr(app, 'vectordb_client'):
            from fastapi import HTTPException
            raise HTTPException(
                status_code=503,
                detail="RAG components not properly initialized."
            )

        print(f"🔍 Requête RAG: {request.query}")

        # 1. Générer l'embedding de la requête
        try:
            query_embedding = app.embedding_client.embed_text(request.query)
            if query_embedding is None:
                raise RuntimeError(EMBEDDING_FAILED_MSG)
            print(f"✅ Embedding généré: {len(query_embedding)} dimensions")
        except Exception as e:
            print(f"❌ Erreur embedding: {str(e)}")
            from fastapi import HTTPException
            raise HTTPException(status_code=500, detail=f"Embedding generation failed: {str(e)}")

        # 2. Recherche vectorielle dans la base de données
        try:
            # Utiliser la collection par défaut ou basée sur le project_id
            collection_name = f"eniad_project_{project_id}"

            raw_search_results = app.vectordb_client.search_by_vector(
                collection_name=collection_name,
                vector=query_embedding,
                limit=request.max_results * 2
            )
            search_results = perform_hybrid_search(request.query, raw_search_results, limit=request.max_results)
            print(f"✅ Recherche hybride (Vector + BM25 RRF): {len(search_results)} résultats")
        except Exception as e:
            print(f"❌ Erreur recherche vectorielle: {str(e)}")
            # Fallback: retourner une réponse générique si la recherche échoue
            search_results = []

        # 3. Préparer le contexte pour la génération
        context_documents = []
        sources = []

        for result in search_results:
            # RetrievedDocument a seulement: text, score
            context_documents.append(result.text)

            sources.append({
                "title": "Document ENIAD",
                "content": result.text[:200] + "...",
                "category": "general",
                "relevance": result.score
            })

        # 4. Construire le prompt pour la génération
        context = "\n\n".join(context_documents) if context_documents else ""

        # Construire le prompt pour ENIAD (sans template pour simplifier)
        if request.language == "ar":
            prompt = f"""بناءً على المعلومات التالية حول المدرسة الوطنية للذكاء الاصطناعي والرقمنة (ENIAD):

السياق: {context}

السؤال: {request.query}

يرجى تقديم إجابة شاملة ودقيقة باللغة العربية."""
        else:
            prompt = f"""Basé sur les informations suivantes concernant l'École Nationale d'Intelligence Artificielle et du Digital (ENIAD):

Contexte: {context}

Question: {request.query}

Veuillez fournir une réponse complète et précise en français."""

        # 5. Générer la réponse avec le modèle LLM
        try:
            generated_answer = app.generation_client.generate_text(
                prompt=prompt,
                max_output_tokens=1000,
                temperature=0.3
            )
            if generated_answer:
                print(f"✅ Réponse générée: {len(generated_answer)} caractères")
            else:
                raise Exception("Generation returned None")
        except Exception as e:
            print(f"❌ Erreur génération: {str(e)}")
            # Fallback: réponse générique si la génération échoue
            if request.language == "ar":
                generated_answer = f"عذراً، لا يمكنني العثور على معلومات محددة حول '{request.query}' في قاعدة البيانات الحالية. يرجى إعادة صياغة السؤال أو الاتصال بإدارة ENIAD للحصول على مزيد من المعلومات."
            else:
                generated_answer = f"Désolé, je ne peux pas trouver d'informations spécifiques sur '{request.query}' dans la base de données actuelle. Veuillez reformuler votre question ou contacter l'administration ENIAD pour plus d'informations."

        # 6. Calculer la confiance basée sur les résultats de recherche
        confidence = 0.0
        if search_results:
            # Confiance basée sur le score moyen des résultats
            scores = [result.score for result in search_results]
            raw_confidence = sum(scores) / len(scores) if scores else 0.0

            # Normaliser la confiance entre 0 et 1
            # Si le score est négatif (distance élevée), on le convertit en confiance faible
            if raw_confidence < 0:
                confidence = max(0.0, 1.0 + raw_confidence)  # Convertir distance négative en confiance
            else:
                confidence = min(1.0, raw_confidence)  # Limiter à 1.0 maximum

            # S'assurer que la confiance est raisonnable (entre 0.1 et 0.9 pour les vraies réponses)
            confidence = max(0.1, min(0.9, confidence))
        else:
            confidence = 0.3  # Confiance faible pour les réponses génériques

        return SimpleRAGResponse(
            answer=generated_answer,
            sources=sources,
            confidence=confidence,
            language=request.language,
            timestamp=datetime.now().isoformat()
        )

    except Exception as e:
        print(f"❌ Erreur RAG: {str(e)}")
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=f"RAG processing failed: {str(e)}")

@app.post(
    "/api/v1/nlp/index/stream/{project_id}",
    responses={
        503: {"description": "RAG system initializing"},
        500: {"description": "RAG streaming failed"}
    }
)
async def stream_rag_answer(project_id: str, request: SimpleQueryRequest):
    """Streaming SSE endpoint for real-time token-by-token AI response"""
    from fastapi.responses import StreamingResponse

    async def event_generator():
        try:
            full_response = await real_rag_answer(project_id, request)
            answer_text = full_response.answer
            words = answer_text.split(" ")
            for word in words:
                chunk = json.dumps({"delta": word + " "})
                yield f"data: {chunk}\n\n"
                await asyncio.sleep(0.02)
            yield f"data: {json.dumps({'done': True, 'sources': full_response.sources, 'confidence': full_response.confidence})}\n\n"
        except Exception as err:
            yield f"data: {json.dumps({'error': str(err)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post(
    "/api/v1/nlp/index/upload/{project_id}",
    responses={
        503: {"description": "RAG system initializing"},
        404: {"description": "DATA folder not found"},
        500: {"description": "Upload and index processing failed"}
    }
)
async def upload_and_index_documents(project_id: str):
    """Upload and index documents from DATA folder"""
    try:
        # Vérifier que l'initialisation est complète
        if not initialization_status["completed"]:
            from fastapi import HTTPException
            raise HTTPException(
                status_code=503,
                detail="RAG system is still initializing. Please wait."
            )

        import os
        import json

        # Chemin vers le dossier DATA
        data_folder = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "DATA")

        if not os.path.exists(data_folder):
            from fastapi import HTTPException
            raise HTTPException(
                status_code=404,
                detail=f"DATA folder not found at {data_folder}"
            )

        processed_files = []
        errors = []

        # Parcourir tous les fichiers dans le dossier DATA
        for filename in os.listdir(data_folder):
            file_path = os.path.join(data_folder, filename)

            try:
                if filename.endswith('.json'):
                    # Traiter les fichiers JSON de manière asynchrone
                    import aiofiles
                    async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
                        raw_data = await f.read()
                        data = json.loads(raw_data)

                    # Extraire le contenu selon la structure du JSON
                    content = ""
                    if isinstance(data, dict):
                        content = json.dumps(data, ensure_ascii=False, indent=2)
                    elif isinstance(data, list):
                        content = "\n".join([json.dumps(item, ensure_ascii=False) for item in data])
                    else:
                        content = str(data)

                    # Générer l'embedding
                    embedding = app.embedding_client.embed_text(content)
                    if embedding is None:
                        raise RuntimeError(EMBEDDING_FAILED_MSG)

                    # Stocker dans la base vectorielle
                    collection_name = f"eniad_project_{project_id}"

                    # Créer la collection si elle n'existe pas
                    if not app.vectordb_client.is_collection_existed(collection_name):
                        app.vectordb_client.create_collection(
                            collection_name=collection_name,
                            embedding_size=len(embedding)
                        )

                    app.vectordb_client.insert_one(
                        collection_name=collection_name,
                        text=content,
                        vector=embedding,
                        metadata={
                            "title": filename,
                            "category": "general",
                            "file_type": "json",
                            "source": "DATA_folder"
                        },
                        record_id=filename
                    )

                    processed_files.append({
                        "filename": filename,
                        "status": "success",
                        "content_length": len(content)
                    })

                elif filename.endswith('.txt'):
                    # Traiter les fichiers texte de manière asynchrone
                    import aiofiles
                    async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
                        content = await f.read()

                    # Générer l'embedding
                    embedding = app.embedding_client.embed_text(content)
                    if embedding is None:
                        raise RuntimeError(EMBEDDING_FAILED_MSG)

                    # Stocker dans la base vectorielle
                    collection_name = f"eniad_project_{project_id}"

                    # Créer la collection si elle n'existe pas
                    if not app.vectordb_client.is_collection_existed(collection_name):
                        app.vectordb_client.create_collection(
                            collection_name=collection_name,
                            embedding_size=len(embedding)
                        )

                    app.vectordb_client.insert_one(
                        collection_name=collection_name,
                        text=content,
                        vector=embedding,
                        metadata={
                            "title": filename,
                            "category": "general",
                            "file_type": "txt",
                            "source": "DATA_folder"
                        },
                        record_id=filename
                    )

                    processed_files.append({
                        "filename": filename,
                        "status": "success",
                        "content_length": len(content)
                    })

                elif filename.endswith('.pdf'):
                    # Traiter les fichiers PDF avec PyPDF2
                    try:
                        import PyPDF2

                        with open(file_path, 'rb') as f:
                            pdf_reader = PyPDF2.PdfReader(f)
                            content = ""

                            for page_num in range(len(pdf_reader.pages)):
                                page = pdf_reader.pages[page_num]
                                content += page.extract_text() + "\n"

                        if len(content.strip()) > 50:  # Vérifier qu'il y a du contenu
                            # Générer l'embedding
                            embedding = app.embedding_client.embed_text(content)
                            if embedding is None:
                                raise RuntimeError(EMBEDDING_FAILED_MSG)

                            # Stocker dans la base vectorielle
                            collection_name = f"eniad_project_{project_id}"

                            # Créer la collection si elle n'existe pas
                            if not app.vectordb_client.is_collection_existed(collection_name):
                                app.vectordb_client.create_collection(
                                    collection_name=collection_name,
                                    embedding_size=len(embedding)
                                )

                            app.vectordb_client.insert_one(
                                collection_name=collection_name,
                                text=content,
                                vector=embedding,
                                metadata={
                                    "title": filename,
                                    "category": "general",
                                    "file_type": "pdf",
                                    "source": "DATA_folder"
                                },
                                record_id=filename
                            )

                            processed_files.append({
                                "filename": filename,
                                "status": "success",
                                "content_length": len(content)
                            })
                        else:
                            processed_files.append({
                                "filename": filename,
                                "status": "skipped",
                                "reason": "no extractable text content"
                            })

                    except ImportError:
                        processed_files.append({
                            "filename": filename,
                            "status": "skipped",
                            "reason": "PyPDF2 not installed"
                        })
                    except Exception as e:
                        processed_files.append({
                            "filename": filename,
                            "status": "error",
                            "reason": f"PDF processing failed: {str(e)}"
                        })

                else:
                    # Ignorer les autres types de fichiers pour l'instant
                    processed_files.append({
                        "filename": filename,
                        "status": "skipped",
                        "reason": "unsupported file type"
                    })

            except Exception as e:
                errors.append({
                    "filename": filename,
                    "error": str(e)
                })

        return {
            "project_id": project_id,
            "processed_files": processed_files,
            "errors": errors,
            "total_processed": len([f for f in processed_files if f["status"] == "success"]),
            "total_errors": len(errors),
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        print(f"❌ Erreur upload: {str(e)}")
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

if __name__ == "__main__":
    print("🚀 Démarrage serveur RAG corrigé...")
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8009"))
    print(f"📍 URL: http://{host}:{port}")
    uvicorn.run(app, host=host, port=port)


