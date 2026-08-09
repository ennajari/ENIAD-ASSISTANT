from .LLMEnums import LLMEnums
from .providers.OpenAIProvider import OpenAIProvider
from .providers.CoHereProvider import CoHereProvider
from .providers.GeminiProvider import GeminiProvider
from .providers.LocalEmbeddingProvider import LocalEmbeddingProvider
from .providers.OllamaProvider import OllamaProvider


class LLMProviderFactory:
    def __init__(self, config: dict):
        self.config = config

    def create(self, provider: str):
        if provider == LLMEnums.OPENAI.value:
            return OpenAIProvider(
                api_key = self.config.OPENAI_API_KEY,
                api_url = self.config.OPENAI_BASE_URL,
                default_input_max_characters=self.config.INPUT_DEFAULT_MAX_CHARACTERS,
                default_generation_max_output_tokens=self.config.GENERATION_DEFAULT_MAX_TOKENS,
                default_generation_temperature=self.config.GENERATION_DEFAULT_TEMPERATURE
            )

        if provider == LLMEnums.COHERE.value:
            return CoHereProvider(
                api_key = self.config.COHERE_API_KEY,
                default_input_max_characters=self.config.INPUT_DEFAULT_MAX_CHARACTERS,
                default_generation_max_output_tokens=self.config.GENERATION_DEFAULT_MAX_TOKENS,
                default_generation_temperature=self.config.GENERATION_DEFAULT_TEMPERATURE
            )

        if provider == LLMEnums.GEMINI.value:
            return GeminiProvider(
                api_key = self.config.GEMINI_API_KEY,
                default_input_max_characters=self.config.INPUT_DEFAULT_MAX_CHARACTERS,
                default_generation_max_output_tokens=self.config.GENERATION_DEFAULT_MAX_TOKENS,
                default_generation_temperature=self.config.GENERATION_DEFAULT_TEMPERATURE
            )
        if provider == "LOCAL":
            # return LocalEmbeddingProvider()
            return None

        if provider == LLMEnums.OLLAMA.value:
            return OllamaProvider(
                host=self.config.OLLAMA_BASE_URL if hasattr(self.config, 'OLLAMA_BASE_URL') else "http://localhost:11434"
            )

        return None
