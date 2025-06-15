"""
Gemini Service for SMA System
Handles AI-powered content analysis and processing
"""

import requests
import logging
import json
from typing import Dict, List, Any, Optional
from config.settings import settings

class GeminiService:
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.model = settings.gemini_model
        self.temperature = settings.gemini_temperature
        self.max_tokens = settings.gemini_max_tokens
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
        self.logger = logging.getLogger(__name__)
        
        if not self.api_key:
            raise ValueError("Gemini API key is required")
        
        self.logger.info(f"Initialized Gemini Service with model: {self.model}")

    def analyze_content(self, content: str, content_type: str = "general") -> Dict[str, Any]:
        """
        Analyze content using Gemini AI
        """
        try:
            prompt = self._build_analysis_prompt(content, content_type)
            response = self._generate_text(prompt)
            
            if response:
                return self._parse_analysis_response(response, content)
            else:
                return self._default_analysis(content)
                
        except Exception as e:
            self.logger.error(f"Error analyzing content: {e}")
            return self._default_analysis(content)

    def extract_keywords(self, content: str, max_keywords: int = 10) -> List[str]:
        """
        Extract keywords from content using Gemini
        """
        try:
            prompt = f"""
            Extrayez les {max_keywords} mots-clés les plus importants du texte suivant.
            Répondez uniquement avec une liste de mots-clés séparés par des virgules, sans numérotation.
            
            Texte: {content[:1000]}
            
            Mots-clés:
            """
            
            response = self._generate_text(prompt)
            
            if response:
                keywords = [kw.strip() for kw in response.split(',')]
                return keywords[:max_keywords]
            else:
                return []
                
        except Exception as e:
            self.logger.error(f"Error extracting keywords: {e}")
            return []

    def summarize_content(self, content: str, max_length: int = 200) -> str:
        """
        Summarize content using Gemini
        """
        try:
            prompt = f"""
            Résumez le texte suivant en maximum {max_length} caractères.
            Le résumé doit être informatif et capturer les points essentiels.
            
            Texte: {content[:2000]}
            
            Résumé:
            """
            
            response = self._generate_text(prompt)
            
            if response and len(response) <= max_length + 50:  # Allow some flexibility
                return response.strip()
            elif response:
                return response[:max_length].strip() + "..."
            else:
                return content[:max_length] + "..." if len(content) > max_length else content
                
        except Exception as e:
            self.logger.error(f"Error summarizing content: {e}")
            return content[:max_length] + "..." if len(content) > max_length else content

    def classify_content(self, content: str) -> Dict[str, Any]:
        """
        Classify content into categories using Gemini
        """
        try:
            categories = ["news", "documents", "announcements", "events", "research", "academic", "photos"]
            
            prompt = f"""
            Classifiez le contenu suivant dans l'une de ces catégories: {', '.join(categories)}
            Répondez avec le format JSON suivant:
            {{
                "category": "catégorie_principale",
                "confidence": 0.95,
                "subcategories": ["sous-catégorie1", "sous-catégorie2"]
            }}
            
            Contenu: {content[:1000]}
            
            Classification:
            """
            
            response = self._generate_text(prompt)
            
            if response:
                try:
                    # Try to parse JSON response
                    result = json.loads(response.strip())
                    return result
                except json.JSONDecodeError:
                    # Fallback to simple category extraction
                    for category in categories:
                        if category.lower() in response.lower():
                            return {
                                "category": category,
                                "confidence": 0.7,
                                "subcategories": []
                            }
            
            return {
                "category": "general",
                "confidence": 0.5,
                "subcategories": []
            }
            
        except Exception as e:
            self.logger.error(f"Error classifying content: {e}")
            return {
                "category": "general",
                "confidence": 0.5,
                "subcategories": []
            }

    def translate_content(self, content: str, target_language: str) -> str:
        """
        Translate content using Gemini
        """
        try:
            lang_map = {
                "fr": "français",
                "ar": "arabe",
                "en": "anglais"
            }
            
            target_lang = lang_map.get(target_language, target_language)
            
            prompt = f"""
            Traduisez le texte suivant en {target_lang}.
            Conservez le sens et le ton original.
            
            Texte: {content}
            
            Traduction:
            """
            
            response = self._generate_text(prompt)
            return response.strip() if response else content
            
        except Exception as e:
            self.logger.error(f"Error translating content: {e}")
            return content

    def _generate_text(self, prompt: str) -> Optional[str]:
        """
        Generate text using Gemini API
        """
        try:
            url = f"{self.base_url}/models/{self.model}:generateContent"
            headers = {"Content-Type": "application/json"}
            
            data = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": prompt}]
                    }
                ],
                "generationConfig": {
                    "temperature": self.temperature,
                    "maxOutputTokens": self.max_tokens,
                    "topP": 0.8,
                    "topK": 40
                },
                "safetySettings": [
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_HATE_SPEECH",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            }
            
            response = requests.post(
                url,
                headers=headers,
                params={"key": self.api_key},
                json=data,
                timeout=30
            )
            
            if response.status_code != 200:
                self.logger.error(f"Gemini API error: {response.status_code} - {response.text}")
                return None
            
            result = response.json()
            
            if "candidates" in result and len(result["candidates"]) > 0:
                candidate = result["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    return candidate["content"]["parts"][0].get("text", "")
            
            return None
            
        except Exception as e:
            self.logger.error(f"Error generating text with Gemini: {e}")
            return None

    def _build_analysis_prompt(self, content: str, content_type: str) -> str:
        """
        Build analysis prompt based on content type
        """
        base_prompt = f"""
        Analysez le contenu suivant et fournissez une analyse structurée.
        
        Contenu: {content[:1500]}
        
        Fournissez:
        1. Résumé (max 150 caractères)
        2. Mots-clés principaux (5 maximum)
        3. Catégorie (news, documents, announcements, events, research, academic)
        4. Importance (1-5)
        5. Langue détectée
        
        Réponse:
        """
        
        return base_prompt

    def _parse_analysis_response(self, response: str, original_content: str) -> Dict[str, Any]:
        """
        Parse Gemini analysis response
        """
        try:
            # Simple parsing - could be enhanced with more sophisticated NLP
            lines = response.strip().split('\n')
            
            analysis = {
                "summary": "",
                "keywords": [],
                "category": "general",
                "importance": 3,
                "language": "fr",
                "confidence": 0.8
            }
            
            for line in lines:
                line = line.strip()
                if "résumé" in line.lower() or "summary" in line.lower():
                    analysis["summary"] = line.split(":")[-1].strip()
                elif "mots-clés" in line.lower() or "keywords" in line.lower():
                    keywords_text = line.split(":")[-1].strip()
                    analysis["keywords"] = [kw.strip() for kw in keywords_text.split(",")]
                elif "catégorie" in line.lower() or "category" in line.lower():
                    analysis["category"] = line.split(":")[-1].strip().lower()
                elif "importance" in line.lower():
                    try:
                        analysis["importance"] = int(line.split(":")[-1].strip()[0])
                    except:
                        analysis["importance"] = 3
                elif "langue" in line.lower() or "language" in line.lower():
                    analysis["language"] = line.split(":")[-1].strip().lower()[:2]
            
            # Fallback summary if not found
            if not analysis["summary"]:
                analysis["summary"] = original_content[:150] + "..." if len(original_content) > 150 else original_content
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"Error parsing analysis response: {e}")
            return self._default_analysis(original_content)

    def _default_analysis(self, content: str) -> Dict[str, Any]:
        """
        Provide default analysis when AI fails
        """
        return {
            "summary": content[:150] + "..." if len(content) > 150 else content,
            "keywords": [],
            "category": "general",
            "importance": 3,
            "language": "fr",
            "confidence": 0.3
        }

    def test_connection(self) -> Dict[str, Any]:
        """
        Test Gemini API connection
        """
        try:
            response = self._generate_text("Bonjour, répondez avec 'Connexion réussie'")
            
            return {
                "success": bool(response),
                "message": response or "Pas de réponse",
                "model": self.model
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "model": self.model
            }

# Global instance
gemini_service = GeminiService()
