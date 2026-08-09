"""
DuckDuckGo News API Integration
For enhanced news search and real-time information retrieval
"""

import aiohttp
import asyncio
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import re

logger = logging.getLogger(__name__)

class DuckDuckGoNewsAPI:
    def __init__(self):
        self.base_url = "https://serpapi.com/search"
        self.api_key = None  # Will be set from environment or config
        self.session = None
        
        # Default search parameters
        self.default_params = {
            'engine': 'duckduckgo_news',
            'kl': 'fr-fr',  # French locale
            'safe': 'moderate',
            'df': 'w'  # Past week
        }

    async def initialize_session(self):
        """Initialize aiohttp session"""
        if not self.session:
            connector = aiohttp.TCPConnector(limit=5, limit_per_host=2)
            timeout = aiohttp.ClientTimeout(total=30)
            self.session = aiohttp.ClientSession(
                connector=connector,
                timeout=timeout
            )

    async def close_session(self):
        """Close aiohttp session"""
        if self.session:
            await self.session.close()
            self.session = None

    async def search_news(
        self,
        query: str,
        language: str = "fr",
        time_range: str = "w",
        max_results: int = 10,
        region: str = "ma"  # Morocco
    ) -> Dict[str, Any]:
        """
        Search news using DuckDuckGo News API
        
        Args:
            query: Search query
            language: Language code (fr, ar, en)
            time_range: Time range (d=day, w=week, m=month, y=year)
            max_results: Maximum number of results
            region: Region code (ma=Morocco, fr=France)
        """
        try:
            logger.info(f"🔍 Searching DuckDuckGo News: {query[:50]}...")
            
            await self.initialize_session()
            
            # Prepare search parameters
            params = {
                **self.default_params,
                'q': query,
                'df': time_range,
                'kl': f"{language}-{region}",
                'num': min(max_results, 20)  # Limit to 20 max
            }
            
            # Add API key if available
            if self.api_key:
                params['api_key'] = self.api_key
            
            # Make request
            async with self.session.get(self.base_url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._process_news_results(data, query)
                else:
                    logger.error(f"❌ DuckDuckGo API error: {response.status}")
                    return self._create_fallback_results(query, language)
                    
        except Exception as e:
            logger.error(f"❌ DuckDuckGo News search failed: {e}")
            return self._create_fallback_results(query, language)

    def _process_news_results(self, data: Dict[str, Any], query: str) -> Dict[str, Any]:
        """Process DuckDuckGo API response"""
        try:
            news_results = data.get('news_results', [])
            
            processed_results = []
            for item in news_results:
                processed_item = {
                    'title': item.get('title', ''),
                    'snippet': item.get('snippet', ''),
                    'link': item.get('link', ''),
                    'source': item.get('source', ''),
                    'date': item.get('date', ''),
                    'thumbnail': item.get('thumbnail', ''),
                    'relevance_score': self._calculate_relevance(query, item),
                    'processed_timestamp': datetime.now().isoformat()
                }
                processed_results.append(processed_item)
            
            # Sort by relevance
            processed_results.sort(key=lambda x: x['relevance_score'], reverse=True)
            
            return {
                'status': 'success',
                'query': query,
                'total_results': len(processed_results),
                'results': processed_results,
                'search_timestamp': datetime.now().isoformat(),
                'source': 'duckduckgo_news'
            }
            
        except Exception as e:
            logger.error(f"❌ Error processing news results: {e}")
            return self._create_fallback_results(query, "fr")

    def _calculate_relevance(self, query: str, news_item: Dict[str, Any]) -> float:
        """Calculate relevance score for news item"""
        try:
            score = 0.0
            query_words = query.lower().split()
            
            # Check title relevance
            title = news_item.get('title', '').lower()
            title_matches = sum(1 for word in query_words if word in title)
            score += (title_matches / len(query_words)) * 0.5
            
            # Check snippet relevance
            snippet = news_item.get('snippet', '').lower()
            snippet_matches = sum(1 for word in query_words if word in snippet)
            score += (snippet_matches / len(query_words)) * 0.3
            
            # Check source relevance (boost for ENIAD/UMP related sources)
            source = news_item.get('source', '').lower()
            if any(term in source for term in ['eniad', 'ump', 'université', 'university']):
                score += 0.2
            
            return min(score, 1.0)
            
        except Exception:
            return 0.1

    def _create_fallback_results(self, query: str, language: str) -> Dict[str, Any]:
        """Create fallback results when API fails"""
        if language == "ar":
            fallback_message = f"لم يتم العثور على أخبار حديثة حول '{query}'. يرجى المحاولة لاحقاً."
        else:
            fallback_message = f"Aucune actualité récente trouvée pour '{query}'. Veuillez réessayer plus tard."
        
        return {
            'status': 'fallback',
            'query': query,
            'total_results': 0,
            'results': [],
            'message': fallback_message,
            'search_timestamp': datetime.now().isoformat(),
            'source': 'fallback'
        }

    async def search_eniad_news(self, query: str, language: str = "fr") -> Dict[str, Any]:
        """Search specifically for ENIAD-related news"""
        try:
            # Enhance query with ENIAD-specific terms
            enhanced_query = f"{query} ENIAD école ingénieur Oujda UMP"
            
            results = await self.search_news(
                query=enhanced_query,
                language=language,
                time_range="m",  # Past month
                max_results=15,
                region="ma"
            )
            
            # Filter results for ENIAD relevance
            if results.get('status') == 'success':
                filtered_results = []
                for item in results['results']:
                    # Check if result is relevant to ENIAD
                    content = f"{item['title']} {item['snippet']}".lower()
                    if any(term in content for term in ['eniad', 'ump', 'oujda', 'ingénieur', 'école']):
                        filtered_results.append(item)
                
                results['results'] = filtered_results
                results['total_results'] = len(filtered_results)
                results['filtered_for_eniad'] = True
            
            return results
            
        except Exception as e:
            logger.error(f"❌ ENIAD news search failed: {e}")
            return self._create_fallback_results(query, language)

    async def get_trending_topics(self, language: str = "fr", region: str = "ma") -> Dict[str, Any]:
        """Get trending topics related to education and technology"""
        try:
            trending_queries = [
                "intelligence artificielle Maroc",
                "formation ingénieur Maroc",
                "université technologie Maroc",
                "ENIAD actualités",
                "UMP Oujda nouvelles"
            ]
            
            all_results = []
            
            for trending_query in trending_queries:
                try:
                    results = await self.search_news(
                        query=trending_query,
                        language=language,
                        time_range="d",  # Past day
                        max_results=3,
                        region=region
                    )
                    
                    if results.get('status') == 'success':
                        for item in results['results']:
                            item['trending_topic'] = trending_query
                            all_results.append(item)
                    
                    # Add delay between requests
                    await asyncio.sleep(1)
                    
                except Exception as e:
                    logger.error(f"❌ Error getting trending topic {trending_query}: {e}")
                    continue
            
            # Sort by relevance and date
            all_results.sort(key=lambda x: (x['relevance_score'], x.get('date', '')), reverse=True)
            
            return {
                'status': 'success',
                'trending_topics': trending_queries,
                'total_results': len(all_results),
                'results': all_results[:20],  # Limit to 20 results
                'search_timestamp': datetime.now().isoformat(),
                'source': 'duckduckgo_trending'
            }
            
        except Exception as e:
            logger.error(f"❌ Trending topics search failed: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'results': [],
                'search_timestamp': datetime.now().isoformat()
            }

    async def search_academic_news(self, query: str, language: str = "fr") -> Dict[str, Any]:
        """Search for academic and research news"""
        try:
            # Academic-focused query enhancement
            academic_terms = [
                "recherche", "publication", "étude", "université", "académique",
                "science", "technologie", "innovation", "développement"
            ]
            
            enhanced_query = f"{query} " + " ".join(academic_terms[:3])
            
            results = await self.search_news(
                query=enhanced_query,
                language=language,
                time_range="m",  # Past month
                max_results=12,
                region="ma"
            )
            
            # Filter for academic relevance
            if results.get('status') == 'success':
                academic_results = []
                for item in results['results']:
                    content = f"{item['title']} {item['snippet']}".lower()
                    academic_score = sum(1 for term in academic_terms if term in content)
                    
                    if academic_score >= 1:  # At least one academic term
                        item['academic_relevance'] = academic_score
                        academic_results.append(item)
                
                # Sort by academic relevance
                academic_results.sort(key=lambda x: x.get('academic_relevance', 0), reverse=True)
                
                results['results'] = academic_results
                results['total_results'] = len(academic_results)
                results['academic_filtered'] = True
            
            return results
            
        except Exception as e:
            logger.error(f"❌ Academic news search failed: {e}")
            return self._create_fallback_results(query, language)

    async def batch_search(self, queries: List[str], language: str = "fr") -> Dict[str, Any]:
        """Search multiple queries in batch"""
        try:
            logger.info(f"📰 Batch searching {len(queries)} queries")
            
            batch_results = []
            
            for query in queries:
                try:
                    result = await self.search_news(
                        query=query,
                        language=language,
                        max_results=5
                    )
                    
                    batch_results.append({
                        'query': query,
                        'result': result
                    })
                    
                    # Add delay between requests
                    await asyncio.sleep(2)
                    
                except Exception as e:
                    logger.error(f"❌ Error in batch search for {query}: {e}")
                    batch_results.append({
                        'query': query,
                        'result': self._create_fallback_results(query, language)
                    })
            
            return {
                'status': 'success',
                'batch_results': batch_results,
                'total_queries': len(queries),
                'search_timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Batch search failed: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'batch_results': [],
                'search_timestamp': datetime.now().isoformat()
            }

    def set_api_key(self, api_key: str):
        """Set SerpAPI key for DuckDuckGo News"""
        self.api_key = api_key

    async def get_status(self) -> Dict[str, Any]:
        """Get API status"""
        return {
            'service': 'DuckDuckGoNewsAPI',
            'status': 'active',
            'api_key_configured': bool(self.api_key),
            'session_active': self.session is not None,
            'supported_languages': ['fr', 'ar', 'en'],
            'supported_regions': ['ma', 'fr', 'us']
        }

# Global instance
duckduckgo_news_api = DuckDuckGoNewsAPI()
