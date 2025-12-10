from ..LLMInterface import LLMInterface
from sentence_transformers import SentenceTransformer

class LocalEmbeddingProvider(LLMInterface):
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.embedding_size = self.model.get_sentence_embedding_dimension()

    def embed_text(self, text: str, document_type: str = None):
        return self.model.encode(text).tolist()

    def set_generation_model(self, model_id: str):
        pass

    def set_embedding_model(self, model_id: str, embedding_size: int):
        pass

    def generate_text(self, prompt: str, chat_history: list = [], max_output_tokens: int = None, temperature: float = None):
        # L'embedding provider local ne gère pas la génération
        return None

    def construct_prompt(self, prompt: str, role: str):
        # L'embedding provider local ne gère pas la génération
        return None