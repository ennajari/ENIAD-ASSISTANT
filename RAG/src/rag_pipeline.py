from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Document
from src.llama_api_wrapper import call_llama

def run_rag_pipeline(query, documents, top_k=3):
    """
    Exécute le pipeline RAG:
    1. Encode la requête
    2. Récupère les documents pertinents
    3. Génère une réponse basée sur les documents récupérés
    
    Args:
        query (str): La question de l'utilisateur
        documents (list): Liste des documents disponibles
        top_k (int): Nombre de documents à récupérer
        
    Returns:
        str: La réponse générée
    """
    try:
        # Initialiser le modèle d'embedding
        embedding_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
        
        # Encoder la requête
        query_embedding = embedding_model.get_text_embedding(query)
        
        # Encoder tous les documents
        doc_embeddings = []
        for doc in documents:
            doc_embedding = embedding_model.get_text_embedding(doc.text)
            doc_embeddings.append((doc, doc_embedding))
        
        # Calculer les similarités et récupérer les documents les plus pertinents
        similarities = []
        for doc, doc_embedding in doc_embeddings:
            # Calcul de similarité cosinus simplifié
            similarity = sum(q * d for q, d in zip(query_embedding, doc_embedding))
            similarities.append((doc, similarity))
        
        # Trier par similarité décroissante et prendre les top_k
        similarities.sort(key=lambda x: x[1], reverse=True)
        retrieved_docs = [doc for doc, _ in similarities[:top_k]]
        
        # Construire le contexte pour le LLM
        context = "\n\n---\n\n".join([doc.text for doc in retrieved_docs])
        
        # Construire le prompt
        prompt = f"""Tu es un assistant spécialisé pour l'ENIAD (École Nationale d'Intelligence Artificielle de Dijon).
Réponds à la question en te basant uniquement sur les informations fournies dans les documents ci-dessous.
Si tu ne trouves pas l'information dans les documents, indique-le clairement.

Documents:
{context}

Question: {query}

Réponse:"""
        
        # Appeler le LLM pour générer une réponse
        return call_llama(prompt)
        
    except Exception as e:
        print(f"Erreur dans le pipeline RAG : {e}")
        return f"Désolé, une erreur s'est produite lors du traitement de votre question: {str(e)}"