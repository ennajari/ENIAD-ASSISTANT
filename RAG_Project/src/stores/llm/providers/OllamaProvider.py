from ..LLMInterface import LLMInterface
import requests

class OllamaProvider(LLMInterface):
    def __init__(self, model_name="llama3", host="http://127.0.0.1:11434"):
        self.model_name = model_name
        self.host = host

    def set_generation_model(self, model_id: str):
        self.model_name = model_id

    def set_embedding_model(self, model_id: str, embedding_size: int):
        self.embedding_model = model_id
        self.embedding_size = embedding_size

    def process_text(self, text: str):
        return text.strip()

    def generate_text(self, prompt: str, chat_history: list = [], max_output_tokens: int = None, temperature: float = None):
        data = {
            "model": self.model_name,
            "prompt": self.process_text(prompt),
            "stream": False  # Désactiver le streaming pour avoir une réponse JSON simple
        }
        if max_output_tokens:
            data["num_predict"] = max_output_tokens
        if temperature:
            data["temperature"] = temperature
        try:
            response = requests.post(f"{self.host}/api/generate", json=data, timeout=60)
            response.raise_for_status()
            result = response.json()
            return result.get("response", None)
        except Exception as e:
            import traceback
            print("[OLLAMA ERROR] Exception while generating text:")
            traceback.print_exc()
            print(f"[OLLAMA ERROR] Data sent: {data}")
            print(f"[OLLAMA ERROR] Host: {self.host}")
            if hasattr(e, 'response') and e.response:
                print(f"[OLLAMA ERROR] Response status: {e.response.status_code}")
                print(f"[OLLAMA ERROR] Response text: {e.response.text[:500]}")
            return None

    def embed_text(self, text: str, document_type: str = None):
        """Generate embeddings using Ollama embedding model"""
        try:
            if not hasattr(self, 'embedding_model'):
                self.embedding_model = "nomic-embed-text"

            data = {
                "model": self.embedding_model,
                "prompt": self.process_text(text)
            }

            response = requests.post(f"{self.host}/api/embeddings", json=data, timeout=30)

            if response.status_code == 200:
                result = response.json()
                embedding = result.get("embedding", [])
                if embedding:
                    print(f"[OLLAMA] Generated embedding of size {len(embedding)}")
                    return embedding
                else:
                    print("[OLLAMA ERROR] No embedding in response")
                    return None
            else:
                print(f"[OLLAMA ERROR] Embedding failed: {response.status_code}")
                print(f"[OLLAMA ERROR] Response: {response.text}")
                return None

        except Exception as e:
            print(f"[OLLAMA ERROR] Exception during embedding: {e}")
            import traceback
            traceback.print_exc()
            return None

    def embed_texts_batch(self, texts: list, document_type: str = None, batch_size: int = 10):
        """Generate embeddings for multiple texts in batches"""
        try:
            if not hasattr(self, 'embedding_model'):
                self.embedding_model = "nomic-embed-text"

            all_embeddings = []
            total_texts = len(texts)

            print(f"[OLLAMA BATCH] Processing {total_texts} texts in batches of {batch_size}")

            for i in range(0, total_texts, batch_size):
                batch_texts = texts[i:i+batch_size]
                batch_embeddings = []

                print(f"[OLLAMA BATCH] Processing batch {i//batch_size + 1}/{(total_texts + batch_size - 1)//batch_size}")

                for text in batch_texts:
                    embedding = self.embed_text(text, document_type)
                    if embedding:
                        batch_embeddings.append(embedding)
                    else:
                        print(f"[OLLAMA BATCH] Failed to embed text: {text[:50]}...")
                        batch_embeddings.append(None)

                all_embeddings.extend(batch_embeddings)

                # Small delay between batches to avoid overwhelming Ollama
                import time
                time.sleep(0.1)

            print(f"[OLLAMA BATCH] Completed: {len([e for e in all_embeddings if e is not None])}/{total_texts} successful")
            return all_embeddings

        except Exception as e:
            print(f"[OLLAMA BATCH ERROR] Exception during batch embedding: {e}")
            return [None] * len(texts)

    def construct_prompt(self, prompt: str, role: str):
        return {
            "role": role,
            "text": self.process_text(prompt)
        }