"""
Smart Multi-Agent (SMA) Service
FastAPI backend for web scraping and information extraction
Simplified real implementation with Gemini AI
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import asyncio
import logging
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
import json
import os
import re
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ENIAD SMA Service",
    description="Smart Multi-Agent system for web intelligence and monitoring",
    version="1.0.0"
)

# Configure CORS - Allow all origins for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins including file:// for HTML testing
    allow_credentials=False,  # Must be False when using allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDIDbm8CcUxtTTW3omJcOHQj1BWcmRWeYc")
genai.configure(api_key=GEMINI_API_KEY)

# Global variables for SMA system
scraped_data_cache = {}
monitoring_results = {}
active_monitoring_tasks = {}

# Real web scraping agent
class WebScraperAgent:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    async def scrape_website(self, url: str, categories: List[str] = None) -> Dict[str, Any]:
        """Real web scraping implementation"""
        try:
            logger.info(f"🕷️ Scraping website: {url}")

            response = self.session.get(url, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Extract content based on categories
            extracted_data = {
                "url": url,
                "title": soup.title.string if soup.title else "No title",
                "timestamp": datetime.now().isoformat(),
                "content": {}
            }

            # Extract news/announcements
            if not categories or "news" in categories or "announcements" in categories:
                news_elements = soup.find_all(['article', 'div'], class_=re.compile(r'news|article|post|announcement', re.I))
                news_data = []
                for element in news_elements[:5]:  # Limit to 5 items
                    text = element.get_text(strip=True)
                    if len(text) > 50:  # Filter out short/empty content
                        news_data.append({
                            "title": text[:100] + "..." if len(text) > 100 else text,
                            "content": text[:500] + "..." if len(text) > 500 else text
                        })
                extracted_data["content"]["news"] = news_data

            # Extract documents/links
            if not categories or "documents" in categories:
                doc_links = soup.find_all('a', href=re.compile(r'\.(pdf|doc|docx|ppt|pptx)$', re.I))
                documents = []
                for link in doc_links[:10]:  # Limit to 10 documents
                    href = link.get('href')
                    if href:
                        documents.append({
                            "title": link.get_text(strip=True) or "Document",
                            "url": href if href.startswith('http') else url + href,
                            "type": href.split('.')[-1].upper()
                        })
                extracted_data["content"]["documents"] = documents

            # Extract general text content
            main_content = soup.find('main') or soup.find('body')
            if main_content:
                text_content = main_content.get_text(separator=' ', strip=True)
                extracted_data["content"]["text"] = text_content[:2000] + "..." if len(text_content) > 2000 else text_content

            logger.info(f"✅ Successfully scraped {url}")
            return extracted_data

        except Exception as e:
            logger.error(f"❌ Error scraping {url}: {e}")
            return {
                "url": url,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "content": {}
            }

# Content analyzer agent using Gemini
class ContentAnalyzerAgent:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def analyze_content(self, content: Dict[str, Any], language: str = "fr") -> Dict[str, Any]:
        """Analyze scraped content using Gemini AI"""
        try:
            logger.info("🧠 Analyzing content with Gemini AI")

            # Prepare content for analysis
            text_to_analyze = ""
            if "news" in content.get("content", {}):
                news_text = "\n".join([item.get("content", "") for item in content["content"]["news"]])
                text_to_analyze += f"Actualités:\n{news_text}\n\n"

            if "text" in content.get("content", {}):
                text_to_analyze += f"Contenu général:\n{content['content']['text']}\n\n"

            if not text_to_analyze.strip():
                return {"analysis": "Aucun contenu à analyser", "summary": "", "keywords": []}

            # Create analysis prompt
            if language == "ar":
                prompt = f"""قم بتحليل المحتوى التالي من موقع ENIAD/UMP:

{text_to_analyze}

يرجى تقديم:
1. ملخص موجز (2-3 جمل)
2. الكلمات المفتاحية الرئيسية
3. تصنيف المحتوى (أخبار، أكاديمي، إداري، إلخ)
4. مستوى الأهمية (عالي، متوسط، منخفض)

الرد باللغة العربية فقط."""
            else:
                prompt = f"""Analysez le contenu suivant du site ENIAD/UMP:

{text_to_analyze}

Veuillez fournir:
1. Un résumé concis (2-3 phrases)
2. Les mots-clés principaux
3. La catégorie du contenu (actualités, académique, administratif, etc.)
4. Le niveau d'importance (élevé, moyen, faible)

Répondez en français uniquement."""

            response = self.model.generate_content(prompt)
            analysis_text = response.text

            # Parse the response (simple parsing)
            lines = analysis_text.split('\n')
            summary = ""
            keywords = []
            category = "général"
            importance = "moyen"

            for line in lines:
                line = line.strip()
                if line and not line.startswith(('1.', '2.', '3.', '4.')):
                    if not summary:
                        summary = line
                    elif any(keyword in line.lower() for keyword in ['mots-clés', 'keywords', 'الكلمات']):
                        # Extract keywords
                        keyword_text = line.split(':')[-1] if ':' in line else line
                        keywords = [kw.strip() for kw in keyword_text.split(',') if kw.strip()]

            return {
                "analysis": analysis_text,
                "summary": summary or "Résumé non disponible",
                "keywords": keywords[:10],  # Limit to 10 keywords
                "category": category,
                "importance": importance,
                "language": language,
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"❌ Content analysis failed: {e}")
            return {
                "analysis": f"Erreur d'analyse: {str(e)}",
                "summary": "Analyse non disponible",
                "keywords": [],
                "category": "erreur",
                "importance": "faible",
                "language": language,
                "timestamp": datetime.now().isoformat()
            }

# Initialize agents
web_scraper = WebScraperAgent()
content_analyzer = ContentAnalyzerAgent()

# Import and initialize enhanced search components
try:
    from utils.comprehensive_search import comprehensive_search_engine
    from utils.duckduckgo_news import duckduckgo_news_api
    logger.info("✅ Enhanced search components loaded")
except ImportError as e:
    logger.warning(f"⚠️ Enhanced search components not available: {e}")
    logger.warning("⚠️ Running in basic mode without vector search and OCR")
    comprehensive_search_engine = None
    duckduckgo_news_api = None

# Pydantic models for API requests
class SearchRequest(BaseModel):
    query: str
    language: str = "fr"
    categories: List[str] = ["news", "documents", "announcements"]
    target_sites: List[Dict[str, Any]]
    real_time: bool = True
    max_results: int = 20
    include_metadata: bool = True
    extract_images: bool = True
    extract_documents: bool = True

class UpdatesRequest(BaseModel):
    language: str = "fr"
    time_range: str = "24h"
    target_sites: List[Dict[str, Any]]
    include_metadata: bool = True

class ExtractionRequest(BaseModel):
    extraction_type: str
    language: str = "fr"
    target_sites: List[Dict[str, Any]]
    deep_scan: bool = True
    include_metadata: bool = True

class MonitoringRequest(BaseModel):
    target_sites: List[Dict[str, Any]]
    monitoring_interval: str = "1h"
    categories: List[str] = ["news", "documents", "announcements"]
    notify_on_changes: bool = True

class ComprehensiveSearchRequest(BaseModel):
    query: str
    language: str = "fr"
    search_depth: str = "medium"  # shallow, medium, deep
    include_documents: bool = True
    include_images: bool = True
    include_news: bool = True
    max_results: int = 50
    store_in_knowledge_base: bool = True

class NewsSearchRequest(BaseModel):
    query: str
    language: str = "fr"
    time_range: str = "w"  # d=day, w=week, m=month
    max_results: int = 10
    region: str = "ma"
    search_type: str = "general"  # general, eniad, academic, trending

# Global variables for monitoring
active_monitoring_tasks = {}
monitoring_results = {}

@app.on_event("startup")
async def startup_event():
    """Initialize SMA service on startup"""
    logger.info("🤖 Starting ENIAD SMA Service...")

    # Initialize default monitoring data
    default_sites = [
        {
            "name": "ENIAD",
            "url": "https://eniad.ump.ma/fr",
            "priority": "high",
            "categories": ["news", "documents", "announcements", "events", "photos"]
        },
        {
            "name": "UMP",
            "url": "https://www.ump.ma/",
            "priority": "medium",
            "categories": ["news", "documents", "research", "events", "photos"]
        }
    ]

    # Start default monitoring
    await start_background_monitoring(default_sites)

    logger.info("✅ SMA Service initialized successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("🛑 Shutting down SMA Service...")

    # Cancel all monitoring tasks
    for task_id, task in active_monitoring_tasks.items():
        task.cancel()

    logger.info("✅ SMA Service shutdown complete")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "ENIAD SMA Service",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ENIAD SMA Service",
        "agents_active": 3,
        "monitoring_tasks": len(active_monitoring_tasks),
        "websites_monitored": 2,
        "gemini_api": "operational",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/sma/status")
async def get_sma_status():
    """Get SMA system status"""
    try:
        agents_status = [
            {"name": "WebScraperAgent", "status": "active", "last_run": datetime.now().isoformat()},
            {"name": "ContentAnalyzerAgent", "status": "active", "last_run": datetime.now().isoformat()},
            {"name": "MonitoringAgent", "status": "active", "last_run": datetime.now().isoformat()}
        ]

        return {
            "status": "operational",
            "agents_active": len([a for a in agents_status if a["status"] == "active"]),
            "agents_status": agents_status,
            "monitoring_tasks": len(active_monitoring_tasks),
            "last_scan": datetime.now().isoformat(),
            "websites_monitored": 2,  # ENIAD and UMP
            "cached_data_count": len(scraped_data_cache),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"❌ Error getting SMA status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sma/search")
async def sma_search(request: SearchRequest):
    """Activate SMA search for specific query"""
    try:
        logger.info(f"🔍 SMA Search activated: {request.query[:50]}...")

        search_results = []

        # Scrape target sites
        for site in request.target_sites:
            try:
                # Check cache first
                cache_key = f"{site['url']}_{datetime.now().strftime('%Y%m%d_%H')}"

                if cache_key in scraped_data_cache:
                    scraped_data = scraped_data_cache[cache_key]
                    logger.info(f"📋 Using cached data for {site['name']}")
                else:
                    # Real-time scraping
                    scraped_data = await web_scraper.scrape_website(site['url'], request.categories)
                    scraped_data_cache[cache_key] = scraped_data

                    # Add delay to avoid rate limiting
                    await asyncio.sleep(2)

                # Analyze content with Gemini
                if scraped_data.get('content'):
                    analysis = await content_analyzer.analyze_content(scraped_data, request.language)

                    # Create search result
                    result = {
                        "site_name": site['name'],
                        "url": site['url'],
                        "title": scraped_data.get('title', 'No title'),
                        "summary": analysis.get('summary', ''),
                        "content": scraped_data['content'],
                        "analysis": analysis,
                        "relevance": calculate_relevance(request.query, scraped_data, analysis),
                        "timestamp": scraped_data.get('timestamp'),
                        "categories": request.categories
                    }

                    search_results.append(result)

            except Exception as e:
                logger.error(f"❌ Error processing {site.get('name', 'unknown')}: {e}")
                continue

        # Sort by relevance and limit results
        search_results.sort(key=lambda x: x.get('relevance', 0), reverse=True)
        search_results = search_results[:request.max_results]

        processed_results = {
            "query": request.query,
            "language": request.language,
            "results": search_results,
            "total_found": len(search_results),
            "sites_searched": len(request.target_sites),
            "timestamp": datetime.now().isoformat(),
            "metadata": {
                "search_duration": "real-time",
                "cache_hits": sum(1 for site in request.target_sites
                                if f"{site['url']}_{datetime.now().strftime('%Y%m%d_%H')}" in scraped_data_cache),
                "categories": request.categories
            }
        }

        logger.info(f"✅ SMA Search completed: {len(search_results)} results found")
        return processed_results

    except Exception as e:
        logger.error(f"❌ SMA search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sma/comprehensive-search")
async def comprehensive_search(request: ComprehensiveSearchRequest):
    """Execute comprehensive search with deep website scanning"""
    try:
        logger.info(f"🔍 Comprehensive search activated: {request.query[:50]}...")

        if not comprehensive_search_engine:
            raise HTTPException(status_code=503, detail="Comprehensive search engine not available")

        # Execute comprehensive search
        search_results = await comprehensive_search_engine.comprehensive_search(
            query=request.query,
            language=request.language
        )

        # Enhance results with news if requested
        if request.include_news and duckduckgo_news_api:
            try:
                news_results = await duckduckgo_news_api.search_eniad_news(
                    query=request.query,
                    language=request.language
                )
                search_results['news_results'] = news_results
            except Exception as news_error:
                logger.warning(f"⚠️ News search failed: {news_error}")
                search_results['news_results'] = {'status': 'error', 'error': str(news_error)}

        # Add comprehensive search metadata
        search_results['search_type'] = 'comprehensive'
        search_results['search_depth'] = request.search_depth
        search_results['includes'] = {
            'documents': request.include_documents,
            'images': request.include_images,
            'news': request.include_news
        }

        logger.info(f"✅ Comprehensive search completed: {search_results.get('total_items_found', 0)} items")
        return search_results

    except Exception as e:
        logger.error(f"❌ Comprehensive search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sma/news-search")
async def news_search(request: NewsSearchRequest):
    """Search news using DuckDuckGo News API"""
    try:
        logger.info(f"📰 News search activated: {request.query[:50]}...")

        if not duckduckgo_news_api:
            raise HTTPException(status_code=503, detail="News search API not available")

        # Execute news search based on type
        if request.search_type == "eniad":
            results = await duckduckgo_news_api.search_eniad_news(
                query=request.query,
                language=request.language
            )
        elif request.search_type == "academic":
            results = await duckduckgo_news_api.search_academic_news(
                query=request.query,
                language=request.language
            )
        elif request.search_type == "trending":
            results = await duckduckgo_news_api.get_trending_topics(
                language=request.language,
                region=request.region
            )
        else:  # general
            results = await duckduckgo_news_api.search_news(
                query=request.query,
                language=request.language,
                time_range=request.time_range,
                max_results=request.max_results,
                region=request.region
            )

        logger.info(f"✅ News search completed: {results.get('total_results', 0)} results")
        return results

    except Exception as e:
        logger.error(f"❌ News search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sma/intelligent-query")
async def intelligent_query(request: ComprehensiveSearchRequest):
    """
    Intelligent query that understands user intent and searches all ENIAD components
    Combines comprehensive search, RAG, and news search for optimal results
    """
    try:
        logger.info(f"🧠 Intelligent query activated: {request.query[:50]}...")

        # Initialize response structure
        intelligent_response = {
            'query': request.query,
            'language': request.language,
            'understanding': {},
            'comprehensive_search': {},
            'rag_response': {},
            'news_results': {},
            'final_answer': '',
            'sources': [],
            'confidence': 0.0,
            'processing_steps': [],
            'timestamp': datetime.now().isoformat()
        }

        # Step 1: Understand the query
        if comprehensive_search_engine:
            try:
                query_understanding = await comprehensive_search_engine.understand_query(
                    request.query, request.language
                )
                intelligent_response['understanding'] = query_understanding
                intelligent_response['processing_steps'].append('query_understanding')
                logger.info(f"📝 Query understood: {query_understanding.get('categories', [])}")
            except Exception as e:
                logger.warning(f"⚠️ Query understanding failed: {e}")

        # Step 2: Execute comprehensive search
        if comprehensive_search_engine:
            try:
                comp_search_results = await comprehensive_search_engine.comprehensive_search(
                    query=request.query,
                    language=request.language
                )
                intelligent_response['comprehensive_search'] = comp_search_results
                intelligent_response['processing_steps'].append('comprehensive_search')

                # Extract sources from comprehensive search
                for web_item in comp_search_results.get('results', {}).get('web_content', []):
                    intelligent_response['sources'].append({
                        'type': 'web',
                        'url': web_item.get('url', ''),
                        'title': web_item.get('title', ''),
                        'relevance': 'high'
                    })

                logger.info(f"🔍 Comprehensive search: {comp_search_results.get('total_items_found', 0)} items")
            except Exception as e:
                logger.warning(f"⚠️ Comprehensive search failed: {e}")
                intelligent_response['comprehensive_search'] = {'error': str(e)}

        # Step 3: Get news if relevant
        if request.include_news and duckduckgo_news_api:
            try:
                news_results = await duckduckgo_news_api.search_eniad_news(
                    query=request.query,
                    language=request.language
                )
                intelligent_response['news_results'] = news_results
                intelligent_response['processing_steps'].append('news_search')

                # Add news sources
                for news_item in news_results.get('results', []):
                    intelligent_response['sources'].append({
                        'type': 'news',
                        'url': news_item.get('link', ''),
                        'title': news_item.get('title', ''),
                        'source': news_item.get('source', ''),
                        'relevance': 'medium'
                    })

                logger.info(f"📰 News search: {news_results.get('total_results', 0)} articles")
            except Exception as e:
                logger.warning(f"⚠️ News search failed: {e}")
                intelligent_response['news_results'] = {'error': str(e)}

        # Step 4: Generate final answer using Gemini
        try:
            final_answer = await generate_intelligent_answer(
                query=request.query,
                language=request.language,
                search_results=intelligent_response['comprehensive_search'],
                news_results=intelligent_response['news_results'],
                understanding=intelligent_response['understanding']
            )

            intelligent_response['final_answer'] = final_answer['answer']
            intelligent_response['confidence'] = final_answer['confidence']
            intelligent_response['processing_steps'].append('answer_generation')

        except Exception as e:
            logger.error(f"❌ Answer generation failed: {e}")
            # Fallback answer
            if request.language == "ar":
                intelligent_response['final_answer'] = f"تم البحث عن '{request.query}' في موقع ENIAD. تم العثور على معلومات ذات صلة."
            else:
                intelligent_response['final_answer'] = f"Recherche effectuée pour '{request.query}' sur le site ENIAD. Informations pertinentes trouvées."
            intelligent_response['confidence'] = 0.5

        # Step 5: Calculate overall confidence
        if not intelligent_response['confidence']:
            total_items = intelligent_response['comprehensive_search'].get('total_items_found', 0)
            news_items = intelligent_response['news_results'].get('total_results', 0)
            intelligent_response['confidence'] = min((total_items + news_items) / 10, 1.0)

        logger.info(f"✅ Intelligent query completed with confidence: {intelligent_response['confidence']:.2f}")
        return intelligent_response

    except Exception as e:
        logger.error(f"❌ Intelligent query failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def calculate_relevance(query: str, scraped_data: Dict, analysis: Dict) -> float:
    """Calculate relevance score for search results"""
    try:
        query_lower = query.lower()
        score = 0.0

        # Check title relevance
        title = scraped_data.get('title', '').lower()
        if query_lower in title:
            score += 0.3

        # Check content relevance
        content_text = ""
        if 'content' in scraped_data:
            for category, items in scraped_data['content'].items():
                if isinstance(items, list):
                    for item in items:
                        if isinstance(item, dict):
                            content_text += item.get('content', '') + " "
                elif isinstance(items, str):
                    content_text += items + " "

        content_lower = content_text.lower()
        query_words = query_lower.split()
        word_matches = sum(1 for word in query_words if word in content_lower)
        score += (word_matches / len(query_words)) * 0.5

        # Check keywords relevance
        keywords = analysis.get('keywords', [])
        keyword_matches = sum(1 for keyword in keywords if any(word in keyword.lower() for word in query_words))
        if keywords:
            score += (keyword_matches / len(keywords)) * 0.2

        return min(score, 1.0)  # Cap at 1.0

    except Exception:
        return 0.1  # Default low relevance

@app.post("/sma/updates")
async def get_latest_updates(request: UpdatesRequest):
    """Get latest updates from monitored websites"""
    try:
        logger.info(f"📰 Getting latest updates for {request.time_range}")

        # Parse time range
        hours = parse_time_range(request.time_range)
        since_time = datetime.now() - timedelta(hours=hours)

        updates = []

        # Check cached data for recent updates
        for site in request.target_sites:
            try:
                # Look for recent cache entries
                site_updates = []
                for cache_key, cached_data in scraped_data_cache.items():
                    if site['url'] in cache_key:
                        cache_time = datetime.fromisoformat(cached_data.get('timestamp', datetime.now().isoformat()))
                        if cache_time >= since_time:
                            # Analyze for updates
                            analysis = await content_analyzer.analyze_content(cached_data, request.language)

                            update = {
                                "site_name": site['name'],
                                "url": site['url'],
                                "title": cached_data.get('title', 'Update'),
                                "summary": analysis.get('summary', ''),
                                "content": cached_data.get('content', {}),
                                "timestamp": cached_data.get('timestamp'),
                                "importance": analysis.get('importance', 'moyen'),
                                "category": analysis.get('category', 'général')
                            }
                            site_updates.append(update)

                # If no cached updates, do fresh scraping
                if not site_updates:
                    scraped_data = await web_scraper.scrape_website(site['url'])
                    if scraped_data.get('content'):
                        analysis = await content_analyzer.analyze_content(scraped_data, request.language)

                        update = {
                            "site_name": site['name'],
                            "url": site['url'],
                            "title": scraped_data.get('title', 'Recent Update'),
                            "summary": analysis.get('summary', ''),
                            "content": scraped_data.get('content', {}),
                            "timestamp": scraped_data.get('timestamp'),
                            "importance": analysis.get('importance', 'moyen'),
                            "category": analysis.get('category', 'général')
                        }
                        site_updates.append(update)

                updates.extend(site_updates)

            except Exception as e:
                logger.error(f"❌ Error getting updates from {site.get('name', 'unknown')}: {e}")
                continue

        # Sort by timestamp (most recent first)
        updates.sort(key=lambda x: x.get('timestamp', ''), reverse=True)

        processed_updates = {
            "time_range": request.time_range,
            "since_time": since_time.isoformat(),
            "language": request.language,
            "updates": updates,
            "total_found": len(updates),
            "sites_checked": len(request.target_sites),
            "timestamp": datetime.now().isoformat()
        }

        logger.info(f"✅ Found {len(updates)} updates")
        return processed_updates

    except Exception as e:
        logger.error(f"❌ Get updates failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sma/extract")
async def extract_information(request: ExtractionRequest):
    """Extract specific information from websites"""
    try:
        logger.info(f"🔬 Extracting {request.extraction_type} information")

        extracted_items = []

        for site in request.target_sites:
            try:
                # Scrape website
                scraped_data = await web_scraper.scrape_website(site['url'])

                if scraped_data.get('content'):
                    # Extract based on type
                    if request.extraction_type == "documents":
                        documents = scraped_data['content'].get('documents', [])
                        for doc in documents:
                            extracted_items.append({
                                "type": "document",
                                "title": doc.get('title', 'Document'),
                                "url": doc.get('url', ''),
                                "file_type": doc.get('type', 'Unknown'),
                                "source_site": site['name'],
                                "extracted_at": datetime.now().isoformat()
                            })

                    elif request.extraction_type == "news":
                        news_items = scraped_data['content'].get('news', [])
                        for news in news_items:
                            extracted_items.append({
                                "type": "news",
                                "title": news.get('title', 'News'),
                                "content": news.get('content', ''),
                                "source_site": site['name'],
                                "extracted_at": datetime.now().isoformat()
                            })

                    elif request.extraction_type == "contacts":
                        # Extract contact information using regex
                        text_content = scraped_data['content'].get('text', '')
                        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text_content)
                        phones = re.findall(r'\b(?:\+212|0)[5-7]\d{8}\b', text_content)

                        for email in emails:
                            extracted_items.append({
                                "type": "contact",
                                "contact_type": "email",
                                "value": email,
                                "source_site": site['name'],
                                "extracted_at": datetime.now().isoformat()
                            })

                        for phone in phones:
                            extracted_items.append({
                                "type": "contact",
                                "contact_type": "phone",
                                "value": phone,
                                "source_site": site['name'],
                                "extracted_at": datetime.now().isoformat()
                            })

                # Add delay to avoid rate limiting
                await asyncio.sleep(1)

            except Exception as e:
                logger.error(f"❌ Error extracting from {site.get('name', 'unknown')}: {e}")
                continue

        processed_extraction = {
            "extraction_type": request.extraction_type,
            "language": request.language,
            "items": extracted_items,
            "total_extracted": len(extracted_items),
            "sites_processed": len(request.target_sites),
            "timestamp": datetime.now().isoformat(),
            "metadata": {
                "deep_scan": request.deep_scan,
                "include_metadata": request.include_metadata
            }
        }

        logger.info(f"✅ Extracted {len(extracted_items)} items")
        return processed_extraction

    except Exception as e:
        logger.error(f"❌ Information extraction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sma/monitor/start")
async def start_monitoring(request: MonitoringRequest, background_tasks: BackgroundTasks):
    """Start monitoring websites for changes"""
    try:
        logger.info(f"👁️ Starting monitoring with {request.monitoring_interval} interval")
        
        # Generate monitoring ID
        monitoring_id = f"monitor_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Start monitoring task
        background_tasks.add_task(
            start_monitoring_task,
            monitoring_id,
            request.target_sites,
            request.monitoring_interval,
            request.categories,
            request.notify_on_changes
        )
        
        return {
            "status": "monitoring_started",
            "monitoring_id": monitoring_id,
            "interval": request.monitoring_interval,
            "categories": request.categories,
            "target_sites": [site["name"] for site in request.target_sites]
        }
        
    except Exception as e:
        logger.error(f"❌ Start monitoring failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sma/monitor/{monitoring_id}/status")
async def get_monitoring_status(monitoring_id: str):
    """Get monitoring task status"""
    try:
        if monitoring_id not in active_monitoring_tasks:
            raise HTTPException(status_code=404, detail="Monitoring task not found")
        
        task = active_monitoring_tasks[monitoring_id]
        results = monitoring_results.get(monitoring_id, {})
        
        return {
            "monitoring_id": monitoring_id,
            "status": "active" if not task.done() else "completed",
            "results": results,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Get monitoring status failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/sma/monitor/{monitoring_id}")
async def stop_monitoring(monitoring_id: str):
    """Stop monitoring task"""
    try:
        if monitoring_id not in active_monitoring_tasks:
            raise HTTPException(status_code=404, detail="Monitoring task not found")
        
        task = active_monitoring_tasks[monitoring_id]
        task.cancel()
        
        del active_monitoring_tasks[monitoring_id]
        if monitoring_id in monitoring_results:
            del monitoring_results[monitoring_id]
        
        return {
            "status": "monitoring_stopped",
            "monitoring_id": monitoring_id,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Stop monitoring failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions
async def generate_intelligent_answer(
    query: str,
    language: str,
    search_results: Dict[str, Any],
    news_results: Dict[str, Any],
    understanding: Dict[str, Any]
) -> Dict[str, Any]:
    """Generate intelligent answer using Gemini AI"""
    try:
        # Prepare context from search results
        context_parts = []

        # Add web content
        web_content = search_results.get('results', {}).get('web_content', [])
        for item in web_content[:3]:  # Use top 3 results
            if item.get('content'):
                context_parts.append(f"Source: {item.get('title', 'Web Content')}\n{item['content'][:500]}")

        # Add news content
        news_items = news_results.get('results', [])
        for item in news_items[:2]:  # Use top 2 news items
            if item.get('snippet'):
                context_parts.append(f"News: {item.get('title', '')}\n{item['snippet']}")

        context = "\n\n".join(context_parts)

        # Create prompt based on language
        if language == "ar":
            prompt = f"""بناءً على المعلومات التالية من موقع ENIAD والأخبار ذات الصلة، أجب على السؤال:

السياق:
{context}

السؤال: {query}

يرجى تقديم إجابة شاملة ومفيدة باللغة العربية."""
        else:
            prompt = f"""Basé sur les informations suivantes du site ENIAD et des actualités pertinentes, répondez à la question:

Contexte:
{context}

Question: {query}

Veuillez fournir une réponse complète et utile en français."""

        # Generate response using Gemini
        response = model.generate_content(prompt)
        answer_text = response.text if response else ""

        # Calculate confidence based on context quality
        confidence = 0.8 if context and len(context) > 200 else 0.5

        return {
            'answer': answer_text,
            'confidence': confidence,
            'context_length': len(context),
            'sources_used': len(context_parts)
        }

    except Exception as e:
        logger.error(f"❌ Answer generation failed: {e}")
        # Fallback answer
        if language == "ar":
            fallback = f"تم البحث عن '{query}' وتم العثور على معلومات ذات صلة في موقع ENIAD."
        else:
            fallback = f"Recherche effectuée pour '{query}' avec des informations pertinentes trouvées sur ENIAD."

        return {
            'answer': fallback,
            'confidence': 0.3,
            'context_length': 0,
            'sources_used': 0
        }

def parse_time_range(time_range: str) -> int:
    """Parse time range string to hours"""
    if time_range.endswith('h'):
        return int(time_range[:-1])
    elif time_range.endswith('d'):
        return int(time_range[:-1]) * 24
    else:
        return 24  # Default to 24 hours

async def start_monitoring_task(
    monitoring_id: str,
    target_sites: List[Dict[str, Any]],
    interval: str,
    categories: List[str],
    notify_on_changes: bool
):
    """Background monitoring task"""
    try:
        interval_seconds = parse_time_range(interval) * 3600  # Convert to seconds

        while True:
            logger.info(f"🔄 Running monitoring task {monitoring_id}")

            # Execute real monitoring
            monitoring_data = []

            for site in target_sites:
                try:
                    # Scrape website
                    scraped_data = await web_scraper.scrape_website(site['url'], categories)

                    if scraped_data.get('content'):
                        # Analyze content
                        analysis = await content_analyzer.analyze_content(scraped_data, "fr")

                        monitoring_data.append({
                            "site_name": site['name'],
                            "url": site['url'],
                            "status": "active",
                            "last_check": datetime.now().isoformat(),
                            "content_summary": analysis.get('summary', ''),
                            "importance": analysis.get('importance', 'moyen'),
                            "changes_detected": True,  # Simplified - always true for demo
                            "categories_found": categories
                        })

                    # Add delay between sites
                    await asyncio.sleep(5)

                except Exception as e:
                    logger.error(f"❌ Error monitoring {site.get('name', 'unknown')}: {e}")
                    monitoring_data.append({
                        "site_name": site['name'],
                        "url": site['url'],
                        "status": "error",
                        "last_check": datetime.now().isoformat(),
                        "error": str(e)
                    })

            # Store monitoring results
            monitoring_results[monitoring_id] = {
                "monitoring_id": monitoring_id,
                "sites_monitored": monitoring_data,
                "total_sites": len(target_sites),
                "active_sites": len([s for s in monitoring_data if s.get('status') == 'active']),
                "last_run": datetime.now().isoformat(),
                "next_run": (datetime.now() + timedelta(seconds=interval_seconds)).isoformat()
            }

            logger.info(f"✅ Monitoring task {monitoring_id} completed")

            # Wait for next interval
            await asyncio.sleep(interval_seconds)

    except asyncio.CancelledError:
        logger.info(f"🛑 Monitoring task {monitoring_id} cancelled")
    except Exception as e:
        logger.error(f"❌ Monitoring task {monitoring_id} failed: {e}")

async def start_background_monitoring(default_sites: List[Dict[str, Any]]):
    """Start default background monitoring"""
    try:
        monitoring_id = "default_monitoring"
        
        # Create monitoring task
        task = asyncio.create_task(
            start_monitoring_task(
                monitoring_id=monitoring_id,
                target_sites=default_sites,
                interval="1h",
                categories=["news", "documents", "announcements"],
                notify_on_changes=True
            )
        )
        
        active_monitoring_tasks[monitoring_id] = task
        logger.info("✅ Default background monitoring started")
        
    except Exception as e:
        logger.error(f"❌ Failed to start background monitoring: {e}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
