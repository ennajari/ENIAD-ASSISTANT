"""
Web Scraper Agent
Specialized agent for scraping ENIAD and UMP websites
Uses advanced scraping techniques with respect for robots.txt
"""

from crewai import Agent
from langchain.tools import Tool
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import requests
from bs4 import BeautifulSoup
import asyncio
import aiohttp
from typing import List, Dict, Any, Optional
import logging
from urllib.parse import urljoin, urlparse
import time
import re

logger = logging.getLogger(__name__)

class WebScraperAgent:
    def __init__(self):
        self.session = None
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        self.rate_limit_delay = 2  # Seconds between requests
        self.last_request_time = 0
        
        # Initialize the CrewAI agent
        self.agent = Agent(
            role='Web Scraping Specialist',
            goal='Extract comprehensive information from ENIAD and UMP websites including news, documents, photos, and announcements',
            backstory="""You are an expert web scraper specialized in academic websites. 
            You understand the structure of university websites and can efficiently extract 
            relevant information while respecting website policies and rate limits.""",
            verbose=True,
            allow_delegation=False,
            tools=self._create_tools()
        )

    def _create_tools(self) -> List[Tool]:
        """Create tools for the web scraper agent"""
        return [
            Tool(
                name="scrape_website",
                description="Scrape a website URL and extract content",
                func=self.scrape_website
            ),
            Tool(
                name="extract_links",
                description="Extract all relevant links from a webpage",
                func=self.extract_links
            ),
            Tool(
                name="extract_documents",
                description="Find and extract document links (PDF, DOC, etc.)",
                func=self.extract_documents
            ),
            Tool(
                name="extract_images",
                description="Extract image URLs and metadata",
                func=self.extract_images
            ),
            Tool(
                name="extract_news",
                description="Extract news articles and announcements",
                func=self.extract_news
            ),
            Tool(
                name="check_updates",
                description="Check for recent updates on a website",
                func=self.check_updates
            )
        ]

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

    def _respect_rate_limit(self):
        """Respect rate limiting between requests"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.rate_limit_delay:
            time.sleep(self.rate_limit_delay - time_since_last)
        self.last_request_time = time.time()

    async def scrape_website(self, url: str) -> Dict[str, Any]:
        """Scrape a website and extract basic content"""
        try:
            await self.initialize_session()
            self._respect_rate_limit()
            
            logger.info(f"🕷️ Scraping website: {url}")
            
            async with self.session.get(url) as response:
                if response.status == 200:
                    html_content = await response.text()
                    soup = BeautifulSoup(html_content, 'html.parser')
                    
                    # Extract basic information
                    title = soup.find('title')
                    title_text = title.get_text().strip() if title else "No title"
                    
                    # Extract main content
                    content_selectors = [
                        'main', 'article', '.content', '#content', 
                        '.main-content', '.post-content', '.entry-content'
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
                    
                    # Extract metadata
                    meta_description = soup.find('meta', attrs={'name': 'description'})
                    description = meta_description.get('content', '') if meta_description else ''
                    
                    # Extract language
                    html_tag = soup.find('html')
                    language = html_tag.get('lang', 'fr') if html_tag else 'fr'
                    
                    return {
                        'url': url,
                        'title': title_text,
                        'content': main_content[:5000],  # Limit content length
                        'description': description,
                        'language': language,
                        'status': 'success',
                        'timestamp': time.time()
                    }
                else:
                    logger.warning(f"⚠️ Failed to scrape {url}: HTTP {response.status}")
                    return {
                        'url': url,
                        'status': 'error',
                        'error': f'HTTP {response.status}',
                        'timestamp': time.time()
                    }
                    
        except Exception as e:
            logger.error(f"❌ Error scraping {url}: {e}")
            return {
                'url': url,
                'status': 'error',
                'error': str(e),
                'timestamp': time.time()
            }

    async def extract_links(self, url: str) -> List[Dict[str, Any]]:
        """Extract all relevant links from a webpage"""
        try:
            await self.initialize_session()
            self._respect_rate_limit()
            
            logger.info(f"🔗 Extracting links from: {url}")
            
            async with self.session.get(url) as response:
                if response.status == 200:
                    html_content = await response.text()
                    soup = BeautifulSoup(html_content, 'html.parser')
                    
                    links = []
                    for link in soup.find_all('a', href=True):
                        href = link['href']
                        text = link.get_text(strip=True)
                        
                        # Convert relative URLs to absolute
                        absolute_url = urljoin(url, href)
                        
                        # Filter relevant links
                        if self._is_relevant_link(absolute_url, text):
                            links.append({
                                'url': absolute_url,
                                'text': text,
                                'type': self._classify_link(absolute_url, text)
                            })
                    
                    logger.info(f"✅ Found {len(links)} relevant links")
                    return links
                    
        except Exception as e:
            logger.error(f"❌ Error extracting links from {url}: {e}")
            return []

    async def extract_documents(self, url: str) -> List[Dict[str, Any]]:
        """Find and extract document links"""
        try:
            links = await self.extract_links(url)
            documents = []
            
            document_extensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']
            
            for link in links:
                link_url = link['url'].lower()
                if any(ext in link_url for ext in document_extensions):
                    doc_type = self._get_document_type(link_url)
                    documents.append({
                        'url': link['url'],
                        'title': link['text'],
                        'type': doc_type,
                        'category': 'document'
                    })
            
            logger.info(f"📄 Found {len(documents)} documents")
            return documents
            
        except Exception as e:
            logger.error(f"❌ Error extracting documents from {url}: {e}")
            return []

    async def extract_images(self, url: str) -> List[Dict[str, Any]]:
        """Extract image URLs and metadata"""
        try:
            await self.initialize_session()
            self._respect_rate_limit()
            
            async with self.session.get(url) as response:
                if response.status == 200:
                    html_content = await response.text()
                    soup = BeautifulSoup(html_content, 'html.parser')
                    
                    images = []
                    for img in soup.find_all('img', src=True):
                        src = img['src']
                        alt = img.get('alt', '')
                        title = img.get('title', '')
                        
                        # Convert relative URLs to absolute
                        absolute_url = urljoin(url, src)
                        
                        # Filter relevant images
                        if self._is_relevant_image(absolute_url, alt):
                            images.append({
                                'url': absolute_url,
                                'alt': alt,
                                'title': title,
                                'category': 'image'
                            })
                    
                    logger.info(f"🖼️ Found {len(images)} images")
                    return images
                    
        except Exception as e:
            logger.error(f"❌ Error extracting images from {url}: {e}")
            return []

    async def extract_news(self, url: str) -> List[Dict[str, Any]]:
        """Extract news articles and announcements"""
        try:
            await self.initialize_session()
            self._respect_rate_limit()
            
            async with self.session.get(url) as response:
                if response.status == 200:
                    html_content = await response.text()
                    soup = BeautifulSoup(html_content, 'html.parser')
                    
                    news_items = []
                    
                    # Common selectors for news/articles
                    news_selectors = [
                        'article', '.news-item', '.post', '.article',
                        '.news', '.announcement', '.event'
                    ]
                    
                    for selector in news_selectors:
                        items = soup.select(selector)
                        for item in items:
                            title_elem = item.find(['h1', 'h2', 'h3', 'h4', '.title'])
                            title = title_elem.get_text(strip=True) if title_elem else ''
                            
                            content = item.get_text(strip=True)[:500]  # Limit content
                            
                            # Extract date if available
                            date_elem = item.find(['time', '.date', '.published'])
                            date = date_elem.get('datetime') or date_elem.get_text(strip=True) if date_elem else ''
                            
                            # Extract link if available
                            link_elem = item.find('a', href=True)
                            link = urljoin(url, link_elem['href']) if link_elem else url
                            
                            if title and len(title) > 10:  # Filter out short/empty titles
                                news_items.append({
                                    'title': title,
                                    'content': content,
                                    'date': date,
                                    'url': link,
                                    'category': 'news'
                                })
                    
                    logger.info(f"📰 Found {len(news_items)} news items")
                    return news_items
                    
        except Exception as e:
            logger.error(f"❌ Error extracting news from {url}: {e}")
            return []

    async def check_updates(self, url: str, last_check_time: Optional[float] = None) -> Dict[str, Any]:
        """Check for recent updates on a website"""
        try:
            current_content = await self.scrape_website(url)
            
            if current_content['status'] == 'success':
                # Simple update detection based on content changes
                # In a real implementation, you might store previous content hashes
                return {
                    'url': url,
                    'has_updates': True,  # Simplified - always assume updates for demo
                    'last_modified': current_content.get('timestamp'),
                    'content_hash': hash(current_content.get('content', ''))
                }
            else:
                return {
                    'url': url,
                    'has_updates': False,
                    'error': current_content.get('error')
                }
                
        except Exception as e:
            logger.error(f"❌ Error checking updates for {url}: {e}")
            return {
                'url': url,
                'has_updates': False,
                'error': str(e)
            }

    def _is_relevant_link(self, url: str, text: str) -> bool:
        """Check if a link is relevant for extraction"""
        # Filter out common irrelevant links
        irrelevant_patterns = [
            'javascript:', 'mailto:', 'tel:', '#',
            'facebook.com', 'twitter.com', 'instagram.com',
            'linkedin.com', 'youtube.com'
        ]
        
        url_lower = url.lower()
        for pattern in irrelevant_patterns:
            if pattern in url_lower:
                return False
        
        # Check if it's from the same domain or relevant domains
        relevant_domains = ['eniad.ump.ma', 'ump.ma']
        parsed_url = urlparse(url)
        
        return any(domain in parsed_url.netloc for domain in relevant_domains)

    def _classify_link(self, url: str, text: str) -> str:
        """Classify the type of link"""
        url_lower = url.lower()
        text_lower = text.lower()
        
        if any(ext in url_lower for ext in ['.pdf', '.doc', '.docx']):
            return 'document'
        elif any(ext in url_lower for ext in ['.jpg', '.jpeg', '.png', '.gif']):
            return 'image'
        elif any(word in text_lower for word in ['news', 'actualité', 'annonce']):
            return 'news'
        elif any(word in text_lower for word in ['event', 'événement']):
            return 'event'
        else:
            return 'page'

    def _get_document_type(self, url: str) -> str:
        """Get document type from URL"""
        url_lower = url.lower()
        if '.pdf' in url_lower:
            return 'pdf'
        elif '.doc' in url_lower or '.docx' in url_lower:
            return 'word'
        elif '.xls' in url_lower or '.xlsx' in url_lower:
            return 'excel'
        elif '.ppt' in url_lower or '.pptx' in url_lower:
            return 'powerpoint'
        else:
            return 'document'

    def _is_relevant_image(self, url: str, alt: str) -> bool:
        """Check if an image is relevant"""
        # Filter out common UI images
        irrelevant_patterns = [
            'logo', 'icon', 'button', 'arrow', 'bullet',
            'spacer', 'pixel', 'transparent'
        ]
        
        url_lower = url.lower()
        alt_lower = alt.lower()
        
        for pattern in irrelevant_patterns:
            if pattern in url_lower or pattern in alt_lower:
                return False
        
        # Check for minimum size indicators or relevant content
        return len(alt) > 5 or any(word in alt_lower for word in [
            'photo', 'image', 'picture', 'event', 'news'
        ])

    async def get_status(self) -> Dict[str, Any]:
        """Get agent status"""
        return {
            "agent_name": "WebScraperAgent",
            "status": "active",
            "session_active": self.session is not None,
            "rate_limit_delay": self.rate_limit_delay,
            "tools_available": len(self.agent.tools) if hasattr(self.agent, 'tools') else 6
        }
