#!/usr/bin/env python3
"""
Working SMA Service for ENIAD
Simplified Smart Multi-Agent system for web scraping and information extraction
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import asyncio
import aiohttp
import logging
from datetime import datetime
from bs4 import BeautifulSoup
import re
import time
from urllib.parse import urljoin, urlparse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="ENIAD Working SMA Service",
    description="Working Smart Multi-Agent system for ENIAD web intelligence",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class SearchRequest(BaseModel):
    query: str
    language: str = "fr"
    sources: List[str] = ["eniad.ump.ma", "ump.ma"]
    max_results: int = 5

class WebScrapingService:
    def __init__(self):
        self.session = None
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8,ar;q=0.7',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
    
    async def initialize_session(self):
        """Initialize aiohttp session"""
        if not self.session:
            connector = aiohttp.TCPConnector(limit=10, limit_per_host=5)
            timeout = aiohttp.ClientTimeout(total=30)
            self.session = aiohttp.ClientSession(
                connector=connector,
                timeout=timeout,
                headers=self.headers
            )
    
    async def close_session(self):
        """Close aiohttp session"""
        if self.session:
            await self.session.close()
            self.session = None
    
    async def scrape_website(self, url: str) -> Dict[str, Any]:
        """Scrape a website and extract content"""
        try:
            await self.initialize_session()
            logger.info(f"🕷️ Scraping: {url}")
            
            async with self.session.get(url) as response:
                if response.status == 200:
                    html_content = await response.text()
                    soup = BeautifulSoup(html_content, 'html.parser')
                    
                    # Extract title
                    title = soup.find('title')
                    title_text = title.get_text().strip() if title else "No title"
                    
                    # Extract main content
                    content_selectors = [
                        'main', 'article', '.content', '#content', 
                        '.main-content', '.post-content', '.entry-content',
                        '.page-content', '.site-content'
                    ]
                    
                    main_content = ""
                    for selector in content_selectors:
                        content_elem = soup.select_one(selector)
                        if content_elem:
                            main_content = content_elem.get_text(strip=True)
                            break
                    
                    if not main_content:
                        # Fallback to body content
                        body = soup.find('body')
                        if body:
                            main_content = body.get_text(strip=True)
                    
                    # Extract links
                    links = []
                    for link in soup.find_all('a', href=True):
                        href = link['href']
                        text = link.get_text(strip=True)
                        if text and len(text) > 3:
                            absolute_url = urljoin(url, href)
                            links.append({
                                'url': absolute_url,
                                'text': text
                            })
                    
                    return {
                        'url': url,
                        'title': title_text,
                        'content': main_content[:3000],  # Limit content length
                        'links': links[:20],  # Limit links
                        'status': 'success',
                        'timestamp': datetime.now().isoformat()
                    }
                else:
                    logger.warning(f"⚠️ Failed to scrape {url}: HTTP {response.status}")
                    return {
                        'url': url,
                        'status': 'error',
                        'error': f'HTTP {response.status}',
                        'timestamp': datetime.now().isoformat()
                    }
                    
        except Exception as e:
            logger.error(f"❌ Error scraping {url}: {e}")
            return {
                'url': url,
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    async def extract_ai_modules(self, url: str) -> List[Dict[str, Any]]:
        """Extract AI modules/courses information"""
        try:
            content = await self.scrape_website(url)
            if content['status'] != 'success':
                return []
            
            modules = []
            text = content['content'].lower()
            
            # Look for AI-related modules/courses
            ai_keywords = [
                'intelligence artificielle', 'machine learning', 'deep learning',
                'data science', 'algorithme', 'programmation', 'informatique',
                'réseaux de neurones', 'apprentissage automatique', 'big data',
                'python', 'java', 'c++', 'base de données', 'cybersécurité'
            ]
            
            # Extract sections that mention AI modules
            sentences = content['content'].split('.')
            for sentence in sentences:
                sentence_lower = sentence.lower()
                if any(keyword in sentence_lower for keyword in ai_keywords):
                    if any(word in sentence_lower for word in ['module', 'cours', 'matière', 'enseignement']):
                        modules.append({
                            'title': sentence.strip()[:100],
                            'content': sentence.strip(),
                            'source': url,
                            'type': 'ai_module'
                        })
            
            # Also check links for course/module pages
            for link in content.get('links', []):
                link_text = link['text'].lower()
                if any(keyword in link_text for keyword in ai_keywords):
                    modules.append({
                        'title': link['text'],
                        'url': link['url'],
                        'source': url,
                        'type': 'ai_module_link'
                    })
            
            logger.info(f"🎓 Found {len(modules)} AI modules from {url}")
            return modules
            
        except Exception as e:
            logger.error(f"❌ Error extracting AI modules from {url}: {e}")
            return []

# Initialize scraping service
scraper = WebScrapingService()

@app.on_event("startup")
async def startup_event():
    """Initialize SMA service on startup"""
    logger.info("🤖 Starting Working SMA Service...")
    await scraper.initialize_session()
    logger.info("✅ Working SMA Service initialized successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("🛑 Shutting down Working SMA Service...")
    await scraper.close_session()
    logger.info("✅ Working SMA Service shutdown complete")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "ENIAD Working SMA Service",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Working SMA Service",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/search")
async def search_websites(request: SearchRequest):
    """Search websites for information"""
    try:
        logger.info(f"🔍 SMA Search: {request.query}")
        
        results = []
        search_urls = []
        
        # Build search URLs
        for source in request.sources:
            if source == "eniad.ump.ma":
                search_urls.extend([
                    "https://eniad.ump.ma/fr",
                    "https://eniad.ump.ma/fr/formation",
                    "https://eniad.ump.ma/fr/actualites"
                ])
            elif source == "ump.ma":
                search_urls.extend([
                    "https://www.ump.ma/",
                    "https://www.ump.ma/actualites"
                ])
        
        # Search each URL
        for url in search_urls[:5]:  # Limit to 5 URLs
            try:
                if "ai" in request.query.lower() or "module" in request.query.lower():
                    # Special handling for AI modules
                    ai_modules = await scraper.extract_ai_modules(url)
                    for module in ai_modules:
                        results.append({
                            'title': module['title'],
                            'content': module.get('content', ''),
                            'url': module.get('url', url),
                            'source': url,
                            'type': 'ai_module',
                            'relevance': 0.9
                        })
                else:
                    # General content search
                    content = await scraper.scrape_website(url)
                    if content['status'] == 'success':
                        # Check if content matches query
                        query_words = request.query.lower().split()
                        content_text = content['content'].lower()
                        
                        relevance = sum(1 for word in query_words if word in content_text) / len(query_words)
                        
                        if relevance > 0.1:  # At least 10% word match
                            results.append({
                                'title': content['title'],
                                'content': content['content'][:500],
                                'url': content['url'],
                                'source': url,
                                'type': 'webpage',
                                'relevance': relevance
                            })
                
                # Rate limiting
                await asyncio.sleep(1)
                
            except Exception as e:
                logger.error(f"❌ Error searching {url}: {e}")
                continue
        
        # Sort by relevance
        results.sort(key=lambda x: x.get('relevance', 0), reverse=True)
        
        # Limit results
        limited_results = results[:request.max_results]
        
        logger.info(f"✅ SMA Search completed: {len(limited_results)} results")
        
        return {
            "success": True,
            "results": limited_results,
            "total_found": len(limited_results),
            "query": request.query,
            "sources_searched": len(search_urls),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ SMA search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status")
async def get_status():
    """Get SMA system status"""
    return {
        "status": "operational",
        "agents_active": 1,
        "websites_monitored": 2,
        "last_scan": datetime.now().isoformat(),
        "service": "Working SMA Service"
    }

if __name__ == "__main__":
    print("🚀 Starting Working SMA Service...")
    print("🔍 This service can extract AI modules and search ENIAD/UMP websites")
    print("📡 API will be available at http://localhost:8001")
    print("📖 Docs available at http://localhost:8001/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8001)
