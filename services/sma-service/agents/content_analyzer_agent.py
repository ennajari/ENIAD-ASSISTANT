"""
Content Analyzer Agent
Specialized agent for analyzing and categorizing scraped content
Uses NLP techniques to understand and classify information
"""

from crewai import Agent
from langchain.tools import Tool
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
import re
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime
import hashlib
from collections import Counter
from utils.gemini_service import gemini_service

logger = logging.getLogger(__name__)

class ContentAnalyzerAgent:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        
        # Keywords for different categories (French and English)
        self.category_keywords = {
            'news': [
                'actualité', 'actualités', 'news', 'nouvelle', 'nouvelles',
                'annonce', 'announcement', 'communiqué', 'press release'
            ],
            'events': [
                'événement', 'événements', 'event', 'events', 'conférence',
                'conference', 'séminaire', 'seminar', 'colloque', 'symposium'
            ],
            'documents': [
                'document', 'documents', 'rapport', 'report', 'guide',
                'manuel', 'manual', 'procédure', 'procedure', 'règlement'
            ],
            'research': [
                'recherche', 'research', 'étude', 'study', 'publication',
                'article', 'thèse', 'thesis', 'mémoire', 'dissertation'
            ],
            'academic': [
                'académique', 'academic', 'université', 'university',
                'formation', 'education', 'cours', 'course', 'programme'
            ],
            'administrative': [
                'administratif', 'administrative', 'inscription', 'registration',
                'admission', 'candidature', 'application', 'procédure'
            ]
        }
        
        # Initialize the CrewAI agent
        self.agent = Agent(
            role='Content Analysis Specialist',
            goal='Analyze and categorize scraped content to extract meaningful insights and classify information types',
            backstory="""You are an expert content analyst specialized in academic and institutional content. 
            You can identify different types of information, extract key insights, and categorize content 
            based on its nature and importance.""",
            verbose=True,
            allow_delegation=False,
            tools=self._create_tools()
        )

    def _create_tools(self) -> List[Tool]:
        """Create tools for the content analyzer agent"""
        return [
            Tool(
                name="analyze_content",
                description="Analyze content and extract key information",
                func=self.analyze_content
            ),
            Tool(
                name="categorize_content",
                description="Categorize content into predefined categories",
                func=self.categorize_content
            ),
            Tool(
                name="extract_keywords",
                description="Extract important keywords from content",
                func=self.extract_keywords
            ),
            Tool(
                name="detect_language",
                description="Detect the language of the content",
                func=self.detect_language
            ),
            Tool(
                name="extract_dates",
                description="Extract dates and temporal information",
                func=self.extract_dates
            ),
            Tool(
                name="calculate_relevance",
                description="Calculate relevance score for content",
                func=self.calculate_relevance
            ),
            Tool(
                name="summarize_content",
                description="Create a summary of the content",
                func=self.summarize_content
            )
        ]

    async def analyze_content(self, content: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Analyze content and extract key information"""
        try:
            logger.info(f"🔍 Analyzing content ({len(content)} characters)")
            
            if not content or len(content.strip()) < 10:
                return {
                    'status': 'error',
                    'error': 'Content too short or empty'
                }
            
            # Basic analysis
            analysis = {
                'content_length': len(content),
                'word_count': len(content.split()),
                'language': await self.detect_language(content),
                'category': await self.categorize_content(content),
                'keywords': await self.extract_keywords(content),
                'dates': await self.extract_dates(content),
                'relevance_score': await self.calculate_relevance(content),
                'summary': await self.summarize_content(content),
                'content_hash': hashlib.md5(content.encode()).hexdigest(),
                'analysis_timestamp': datetime.now().isoformat()
            }
            
            # Add metadata if provided
            if metadata:
                analysis['metadata'] = metadata
            
            logger.info(f"✅ Content analysis completed: {analysis['category']} ({analysis['relevance_score']:.2f})")
            return analysis
            
        except Exception as e:
            logger.error(f"❌ Error analyzing content: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def categorize_content(self, content: str) -> str:
        """Categorize content into predefined categories using Gemini AI"""
        try:
            # Try Gemini AI classification first
            try:
                gemini_result = gemini_service.classify_content(content)
                if gemini_result and gemini_result.get('category'):
                    logger.info(f"🤖 Gemini classified content as: {gemini_result['category']}")
                    return gemini_result['category']
            except Exception as gemini_error:
                logger.warning(f"⚠️ Gemini classification failed, using fallback: {gemini_error}")

            # Fallback to keyword-based classification
            content_lower = content.lower()
            category_scores = {}

            # Calculate scores for each category
            for category, keywords in self.category_keywords.items():
                score = 0
                for keyword in keywords:
                    # Count occurrences of each keyword
                    count = content_lower.count(keyword.lower())
                    score += count

                category_scores[category] = score

            # Find the category with the highest score
            if category_scores:
                best_category = max(category_scores, key=category_scores.get)
                if category_scores[best_category] > 0:
                    return best_category

            # Default category if no keywords found
            return 'general'

        except Exception as e:
            logger.error(f"❌ Error categorizing content: {e}")
            return 'unknown'

    async def extract_keywords(self, content: str, max_keywords: int = 10) -> List[str]:
        """Extract important keywords from content using Gemini AI"""
        try:
            # Try Gemini AI keyword extraction first
            try:
                gemini_keywords = gemini_service.extract_keywords(content, max_keywords)
                if gemini_keywords:
                    logger.info(f"🤖 Gemini extracted {len(gemini_keywords)} keywords")
                    return gemini_keywords[:max_keywords]
            except Exception as gemini_error:
                logger.warning(f"⚠️ Gemini keyword extraction failed, using fallback: {gemini_error}")

            # Fallback to frequency-based extraction
            # Remove common stop words
            stop_words = {
                'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou',
                'mais', 'donc', 'car', 'ni', 'or', 'ce', 'se', 'que', 'qui',
                'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
                'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be',
                'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did'
            }

            # Clean and split content
            words = re.findall(r'\b[a-zA-ZÀ-ÿ]{3,}\b', content.lower())

            # Filter out stop words
            filtered_words = [word for word in words if word not in stop_words]

            # Count word frequency
            word_counts = Counter(filtered_words)

            # Get most common words
            keywords = [word for word, _ in word_counts.most_common(max_keywords)]

            return keywords

        except Exception as e:
            logger.error(f"❌ Error extracting keywords: {e}")
            return []

    async def detect_language(self, content: str) -> str:
        """Detect the language of the content"""
        try:
            # Simple language detection based on common words
            french_indicators = ['le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou', 'que', 'qui', 'avec', 'pour', 'dans', 'sur']
            english_indicators = ['the', 'and', 'or', 'but', 'with', 'for', 'in', 'on', 'at', 'to', 'from', 'by']
            arabic_indicators = ['في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'التي', 'الذي']
            
            content_lower = content.lower()
            
            french_score = sum(1 for word in french_indicators if word in content_lower)
            english_score = sum(1 for word in english_indicators if word in content_lower)
            arabic_score = sum(1 for word in arabic_indicators if word in content_lower)
            
            scores = {'fr': french_score, 'en': english_score, 'ar': arabic_score}
            detected_language = max(scores, key=scores.get)
            
            # If no clear winner, default to French (ENIAD context)
            if scores[detected_language] == 0:
                return 'fr'
            
            return detected_language
            
        except Exception as e:
            logger.error(f"❌ Error detecting language: {e}")
            return 'fr'  # Default to French

    async def extract_dates(self, content: str) -> List[str]:
        """Extract dates and temporal information"""
        try:
            # Date patterns for French and English
            date_patterns = [
                r'\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b',  # DD/MM/YYYY or DD-MM-YYYY
                r'\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b',  # YYYY/MM/DD or YYYY-MM-DD
                r'\b\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4}\b',  # French months
                r'\b\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\b',  # English months
                r'\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4}\b'  # French full dates
            ]
            
            dates = []
            for pattern in date_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                dates.extend(matches)
            
            # Remove duplicates and return
            return list(set(dates))
            
        except Exception as e:
            logger.error(f"❌ Error extracting dates: {e}")
            return []

    async def calculate_relevance(self, content: str, query: str = None) -> float:
        """Calculate relevance score for content"""
        try:
            # Base relevance factors
            relevance_score = 0.0
            
            # Length factor (longer content might be more informative)
            length_factor = min(len(content) / 1000, 1.0)  # Normalize to 0-1
            relevance_score += length_factor * 0.2
            
            # Category factor (academic content is more relevant)
            category = await self.categorize_content(content)
            category_weights = {
                'academic': 1.0,
                'research': 0.9,
                'news': 0.8,
                'events': 0.7,
                'documents': 0.8,
                'administrative': 0.6,
                'general': 0.4
            }
            relevance_score += category_weights.get(category, 0.4) * 0.3
            
            # Keyword density factor
            keywords = await self.extract_keywords(content, 5)
            if keywords:
                keyword_density = len(keywords) / max(len(content.split()), 1)
                relevance_score += min(keyword_density * 100, 1.0) * 0.2
            
            # Date factor (recent content is more relevant)
            dates = await self.extract_dates(content)
            if dates:
                relevance_score += 0.1
            
            # Query matching factor (if query provided)
            if query:
                query_words = set(query.lower().split())
                content_words = set(content.lower().split())
                match_ratio = len(query_words.intersection(content_words)) / len(query_words)
                relevance_score += match_ratio * 0.2
            
            # Normalize to 0-1 range
            return min(relevance_score, 1.0)
            
        except Exception as e:
            logger.error(f"❌ Error calculating relevance: {e}")
            return 0.5  # Default relevance

    async def summarize_content(self, content: str, max_length: int = 200) -> str:
        """Create a summary of the content using Gemini AI"""
        try:
            if len(content) <= max_length:
                return content.strip()

            # Try Gemini AI summarization first
            try:
                gemini_summary = gemini_service.summarize_content(content, max_length)
                if gemini_summary and len(gemini_summary) <= max_length + 50:  # Allow some flexibility
                    logger.info(f"🤖 Gemini generated summary: {len(gemini_summary)} chars")
                    return gemini_summary
            except Exception as gemini_error:
                logger.warning(f"⚠️ Gemini summarization failed, using fallback: {gemini_error}")

            # Fallback to extractive summarization
            sentences = re.split(r'[.!?]+', content)

            # Filter out very short sentences
            sentences = [s.strip() for s in sentences if len(s.strip()) > 20]

            if not sentences:
                return content[:max_length] + "..."

            # Take first few sentences that fit within max_length
            summary = ""
            for sentence in sentences:
                if len(summary + sentence) <= max_length:
                    summary += sentence + ". "
                else:
                    break

            return summary.strip() or content[:max_length] + "..."

        except Exception as e:
            logger.error(f"❌ Error summarizing content: {e}")
            return content[:max_length] + "..."

    async def batch_analyze(self, content_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Analyze multiple content items in batch"""
        try:
            logger.info(f"📊 Batch analyzing {len(content_list)} items")
            
            analyzed_items = []
            for item in content_list:
                content = item.get('content', '')
                metadata = {k: v for k, v in item.items() if k != 'content'}
                
                analysis = await self.analyze_content(content, metadata)
                
                # Merge original item with analysis
                analyzed_item = {**item, 'analysis': analysis}
                analyzed_items.append(analyzed_item)
            
            logger.info(f"✅ Batch analysis completed for {len(analyzed_items)} items")
            return analyzed_items
            
        except Exception as e:
            logger.error(f"❌ Error in batch analysis: {e}")
            return content_list  # Return original list on error

    async def get_status(self) -> Dict[str, Any]:
        """Get agent status"""
        return {
            "agent_name": "ContentAnalyzerAgent",
            "status": "active",
            "categories_supported": list(self.category_keywords.keys()),
            "tools_available": len(self.agent.tools) if hasattr(self.agent, 'tools') else 7
        }
