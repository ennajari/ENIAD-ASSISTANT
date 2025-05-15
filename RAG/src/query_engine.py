from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.response_synthesizers import ResponseMode
from llama_index.llms.together import TogetherLLM
from src.config import LLAMA_API_KEY

def get_query_engine(index):
    """
    Crée et configure un moteur de requête pour l'index donné.
    """
    try:
        # Configurer le LLM
        llm = TogetherLLM(
            model="togethercomputer/llama-2-70b-chat",
            api_key=LLAMA_API_KEY,
            temperature=0.7,
            max_tokens=512
        )
        
        # Obtenir le récupérateur de l'index
        retriever = index.as_retriever(
            similarity_top_k=3
        )
        
        # Créer le moteur de requête
        query_engine = RetrieverQueryEngine.from_args(
            retriever=retriever,
            llm=llm,
            response_mode=ResponseMode.COMPACT
        )
        
        return query_engine
    except Exception as e:
        print(f"Erreur lors de la création du moteur de requête : {e}")
        return None