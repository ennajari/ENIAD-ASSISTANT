from ..LLMInterface import LLMInterface
import requests
import logging

class GeminiProvider(LLMInterface):
    def __init__(self, api_key: str,
                       default_input_max_characters: int=1000,
                       default_generation_max_output_tokens: int=1000,
                       default_generation_temperature: float=0.1):
        self.api_key = api_key
        self.default_input_max_characters = default_input_max_characters
        self.default_generation_max_output_tokens = default_generation_max_output_tokens
        self.default_generation_temperature = default_generation_temperature
        self.generation_model_id = None
        self.embedding_model_id = None
        self.embedding_size = None
        self.logger = logging.getLogger(__name__)

    def set_generation_model(self, model_id: str):
        self.generation_model_id = model_id

    def set_embedding_model(self, model_id: str, embedding_size: int):
        self.embedding_model_id = model_id
        self.embedding_size = embedding_size

    def process_text(self, text: str):
        return text[:self.default_input_max_characters].strip()

    def generate_text(self, prompt: str, chat_history: list=[], max_output_tokens: int=None,
                            temperature: float = None):
        # Gemini API endpoint for text generation (to be adapted as needed)
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.generation_model_id}:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        data = {
            "contents": [{"parts": [{"text": self.process_text(prompt)}]}],
            "generationConfig": {
                "temperature": temperature if temperature is not None else self.default_generation_temperature,
                "maxOutputTokens": max_output_tokens if max_output_tokens else self.default_generation_max_output_tokens
            }
        }
        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            return result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", None)
        except Exception as e:
            self.logger.error(f"Error while generating text with Gemini: {e}")
            return None

    def embed_text(self, text: str, document_type: str = None):
        """Generate embeddings using Gemini API"""
        try:
            if not self.embedding_model_id:
                self.logger.error("Embedding model not configured")
                return None

            # Gemini embedding API endpoint
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.embedding_model_id}:embedContent"

            headers = {
                "Content-Type": "application/json"
            }

            data = {
                "model": f"models/{self.embedding_model_id}",
                "content": {
                    "parts": [{"text": self.process_text(text)}]
                }
            }

            params = {"key": self.api_key}

            response = requests.post(url, json=data, headers=headers, params=params, timeout=30)

            if response.status_code == 200:
                result = response.json()
                embedding = result.get("embedding", {}).get("values", [])
                if embedding:
                    self.logger.info(f"Generated embedding of size {len(embedding)}")
                    return embedding
                else:
                    self.logger.error("No embedding values in response")
                    return None
            else:
                self.logger.error(f"Gemini embedding API error: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            self.logger.error(f"Error while generating embedding with Gemini: {e}")
            return None

    def construct_prompt(self, prompt: str, role: str):
        return {
            "role": role,
            "text": self.process_text(prompt)
        }
