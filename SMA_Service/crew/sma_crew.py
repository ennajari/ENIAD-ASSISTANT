"""
SMA Crew - Smart Multi-Agent Crew
Orchestrates multiple agents for comprehensive web intelligence
"""

from crewai import Crew, Task
from typing import List, Dict, Any, Optional
import asyncio
import logging
from datetime import datetime, timedelta

# Import agents
from agents.web_scraper_agent import WebScraperAgent
from agents.content_analyzer_agent import ContentAnalyzerAgent

logger = logging.getLogger(__name__)

class SMACrew:
    def __init__(self):
        self.web_scraper = None
        self.content_analyzer = None
        self.crew = None
        self.is_initialized = False

    async def initialize_agents(self):
        """Initialize all agents"""
        try:
            logger.info("🤖 Initializing SMA Crew agents...")
            
            # Initialize agents
            self.web_scraper = WebScraperAgent()
            self.content_analyzer = ContentAnalyzerAgent()
            
            # Initialize web scraper session
            await self.web_scraper.initialize_session()
            
            # Create CrewAI crew
            self.crew = Crew(
                agents=[
                    self.web_scraper.agent,
                    self.content_analyzer.agent
                ],
                verbose=True
            )
            
            self.is_initialized = True
            logger.info("✅ SMA Crew initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize SMA Crew: {e}")
            raise

    async def execute_search_mission(
        self,
        query: str,
        language: str = "fr",
        categories: List[str] = None,
        target_sites: List[Dict[str, Any]] = None,
        real_time: bool = True,
        max_results: int = 20
    ) -> Dict[str, Any]:
        """Execute a comprehensive search mission"""
        try:
            if not self.is_initialized:
                await self.initialize_agents()
            
            logger.info(f"🚀 Executing search mission: {query[:50]}...")
            
            categories = categories or ["news", "documents", "announcements"]
            target_sites = target_sites or []
            
            all_results = []
            search_metadata = {
                "query": query,
                "language": language,
                "categories": categories,
                "websites_scanned": 0,
                "total_items_found": 0,
                "search_time": 0,
                "agents_used": ["WebScraperAgent", "ContentAnalyzerAgent"]
            }
            
            start_time = datetime.now()
            
            # Process each target site
            for site in target_sites:
                try:
                    site_url = site.get("url")
                    site_name = site.get("name", "Unknown")
                    site_categories = site.get("categories", categories)
                    
                    logger.info(f"🔍 Scanning {site_name}: {site_url}")
                    
                    # Scrape main page
                    main_content = await self.web_scraper.scrape_website(site_url)
                    
                    if main_content.get("status") == "success":
                        # Analyze main content
                        analysis = await self.content_analyzer.analyze_content(
                            main_content.get("content", ""),
                            {"source": site_name, "url": site_url}
                        )
                        
                        # Check if content matches query and categories
                        if self._is_relevant_to_query(analysis, query, site_categories):
                            all_results.append({
                                "type": "main_page",
                                "source": site_name,
                                "url": site_url,
                                "title": main_content.get("title", ""),
                                "content": main_content.get("content", "")[:500],
                                "analysis": analysis,
                                "timestamp": main_content.get("timestamp")
                            })
                    
                    # Extract and process specific content types
                    for category in site_categories:
                        if category in categories:
                            category_results = await self._extract_category_content(
                                site_url, site_name, category, query
                            )
                            all_results.extend(category_results)
                    
                    search_metadata["websites_scanned"] += 1
                    
                    # Respect rate limiting
                    await asyncio.sleep(1)
                    
                except Exception as e:
                    logger.error(f"❌ Error processing site {site.get('name', 'Unknown')}: {e}")
                    continue
            
            # Sort results by relevance
            all_results.sort(key=lambda x: x.get("analysis", {}).get("relevance_score", 0), reverse=True)
            
            # Limit results
            limited_results = all_results[:max_results]
            
            # Calculate search time
            search_time = (datetime.now() - start_time).total_seconds()
            
            search_metadata.update({
                "total_items_found": len(limited_results),
                "search_time": search_time
            })
            
            logger.info(f"✅ Search mission completed: {len(limited_results)} results in {search_time:.2f}s")
            
            return {
                "results": limited_results,
                "metadata": search_metadata,
                "total_found": len(limited_results),
                "search_time": search_time
            }
            
        except Exception as e:
            logger.error(f"❌ Search mission failed: {e}")
            raise

    async def execute_extraction_mission(
        self,
        extraction_type: str,
        language: str = "fr",
        target_sites: List[Dict[str, Any]] = None,
        deep_scan: bool = True
    ) -> Dict[str, Any]:
        """Execute information extraction mission"""
        try:
            if not self.is_initialized:
                await self.initialize_agents()
            
            logger.info(f"🔬 Executing extraction mission: {extraction_type}")
            
            target_sites = target_sites or []
            extracted_items = []
            
            start_time = datetime.now()
            
            for site in target_sites:
                try:
                    site_url = site.get("url")
                    site_name = site.get("name", "Unknown")
                    
                    logger.info(f"📊 Extracting {extraction_type} from {site_name}")
                    
                    if extraction_type == "documents":
                        items = await self.web_scraper.extract_documents(site_url)
                    elif extraction_type == "images":
                        items = await self.web_scraper.extract_images(site_url)
                    elif extraction_type == "news":
                        items = await self.web_scraper.extract_news(site_url)
                    else:
                        # General content extraction
                        main_content = await self.web_scraper.scrape_website(site_url)
                        items = [main_content] if main_content.get("status") == "success" else []
                    
                    # Analyze extracted items
                    for item in items:
                        if "content" in item or "title" in item:
                            content_to_analyze = item.get("content", item.get("title", ""))
                            analysis = await self.content_analyzer.analyze_content(
                                content_to_analyze,
                                {"source": site_name, "extraction_type": extraction_type}
                            )
                            item["analysis"] = analysis
                    
                    extracted_items.extend(items)
                    
                except Exception as e:
                    logger.error(f"❌ Error extracting from {site.get('name', 'Unknown')}: {e}")
                    continue
            
            extraction_time = (datetime.now() - start_time).total_seconds()
            
            logger.info(f"✅ Extraction mission completed: {len(extracted_items)} items in {extraction_time:.2f}s")
            
            return {
                "items": extracted_items,
                "total_extracted": len(extracted_items),
                "extraction_time": extraction_time,
                "extraction_type": extraction_type,
                "deep_scan": deep_scan
            }
            
        except Exception as e:
            logger.error(f"❌ Extraction mission failed: {e}")
            raise

    async def execute_monitoring_mission(
        self,
        target_sites: List[Dict[str, Any]],
        categories: List[str] = None,
        notify_on_changes: bool = True
    ) -> Dict[str, Any]:
        """Execute monitoring mission for website changes"""
        try:
            if not self.is_initialized:
                await self.initialize_agents()
            
            logger.info("👁️ Executing monitoring mission")
            
            categories = categories or ["news", "documents", "announcements"]
            monitoring_results = []
            
            start_time = datetime.now()
            
            for site in target_sites:
                try:
                    site_url = site.get("url")
                    site_name = site.get("name", "Unknown")
                    
                    logger.info(f"🔍 Monitoring {site_name} for changes")
                    
                    # Check for updates
                    update_check = await self.web_scraper.check_updates(site_url)
                    
                    if update_check.get("has_updates"):
                        # Get latest content
                        latest_content = await self.web_scraper.scrape_website(site_url)
                        
                        if latest_content.get("status") == "success":
                            # Analyze content
                            analysis = await self.content_analyzer.analyze_content(
                                latest_content.get("content", ""),
                                {"source": site_name, "monitoring": True}
                            )
                            
                            monitoring_results.append({
                                "site": site_name,
                                "url": site_url,
                                "has_updates": True,
                                "content": latest_content,
                                "analysis": analysis,
                                "timestamp": datetime.now().isoformat()
                            })
                    else:
                        monitoring_results.append({
                            "site": site_name,
                            "url": site_url,
                            "has_updates": False,
                            "timestamp": datetime.now().isoformat()
                        })
                
                except Exception as e:
                    logger.error(f"❌ Error monitoring {site.get('name', 'Unknown')}: {e}")
                    continue
            
            monitoring_time = (datetime.now() - start_time).total_seconds()
            
            logger.info(f"✅ Monitoring mission completed in {monitoring_time:.2f}s")
            
            return {
                "monitoring_results": monitoring_results,
                "sites_monitored": len(target_sites),
                "updates_found": len([r for r in monitoring_results if r.get("has_updates")]),
                "monitoring_time": monitoring_time
            }
            
        except Exception as e:
            logger.error(f"❌ Monitoring mission failed: {e}")
            raise

    async def get_recent_updates(
        self,
        since_time: datetime,
        language: str = "fr",
        target_sites: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Get recent updates from monitored sites"""
        try:
            logger.info(f"📰 Getting updates since {since_time}")
            
            # For demo purposes, we'll simulate recent updates
            # In a real implementation, you'd store and compare previous content
            
            updates = []
            target_sites = target_sites or []
            
            for site in target_sites:
                try:
                    site_url = site.get("url")
                    site_name = site.get("name", "Unknown")
                    
                    # Get current content
                    current_content = await self.web_scraper.scrape_website(site_url)
                    
                    if current_content.get("status") == "success":
                        # Simulate update detection (in real implementation, compare with stored content)
                        updates.append({
                            "site": site_name,
                            "url": site_url,
                            "title": current_content.get("title", ""),
                            "content": current_content.get("content", "")[:300],
                            "update_time": datetime.now().isoformat(),
                            "type": "content_update"
                        })
                
                except Exception as e:
                    logger.error(f"❌ Error getting updates from {site.get('name', 'Unknown')}: {e}")
                    continue
            
            return {
                "updates": updates,
                "total_updates": len(updates),
                "since_time": since_time.isoformat(),
                "scan_time": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting recent updates: {e}")
            raise

    async def get_agents_status(self) -> List[Dict[str, Any]]:
        """Get status of all agents"""
        try:
            agents_status = []
            
            if self.web_scraper:
                status = await self.web_scraper.get_status()
                agents_status.append(status)
            
            if self.content_analyzer:
                status = await self.content_analyzer.get_status()
                agents_status.append(status)
            
            return agents_status
            
        except Exception as e:
            logger.error(f"❌ Error getting agents status: {e}")
            return []

    def _is_relevant_to_query(self, analysis: Dict[str, Any], query: str, categories: List[str]) -> bool:
        """Check if content is relevant to the query and categories"""
        try:
            # Check category match
            content_category = analysis.get("category", "general")
            if content_category in categories:
                return True
            
            # Check keyword match
            keywords = analysis.get("keywords", [])
            query_words = set(query.lower().split())
            keyword_match = any(keyword in query_words for keyword in keywords)
            
            # Check relevance score
            relevance_score = analysis.get("relevance_score", 0)
            
            return keyword_match or relevance_score > 0.6
            
        except Exception as e:
            logger.error(f"❌ Error checking relevance: {e}")
            return False

    async def _extract_category_content(
        self,
        site_url: str,
        site_name: str,
        category: str,
        query: str
    ) -> List[Dict[str, Any]]:
        """Extract content for a specific category"""
        try:
            results = []
            
            if category == "documents":
                items = await self.web_scraper.extract_documents(site_url)
                for item in items:
                    analysis = await self.content_analyzer.analyze_content(
                        item.get("title", ""),
                        {"source": site_name, "category": category}
                    )
                    results.append({
                        "type": "document",
                        "source": site_name,
                        "url": item.get("url", ""),
                        "title": item.get("title", ""),
                        "document_type": item.get("type", ""),
                        "analysis": analysis
                    })
            
            elif category == "news":
                items = await self.web_scraper.extract_news(site_url)
                for item in items:
                    analysis = await self.content_analyzer.analyze_content(
                        item.get("content", ""),
                        {"source": site_name, "category": category}
                    )
                    results.append({
                        "type": "news",
                        "source": site_name,
                        "url": item.get("url", ""),
                        "title": item.get("title", ""),
                        "content": item.get("content", "")[:300],
                        "date": item.get("date", ""),
                        "analysis": analysis
                    })
            
            elif category == "photos" or category == "images":
                items = await self.web_scraper.extract_images(site_url)
                for item in items:
                    analysis = await self.content_analyzer.analyze_content(
                        item.get("alt", "") + " " + item.get("title", ""),
                        {"source": site_name, "category": category}
                    )
                    results.append({
                        "type": "image",
                        "source": site_name,
                        "url": item.get("url", ""),
                        "alt": item.get("alt", ""),
                        "title": item.get("title", ""),
                        "analysis": analysis
                    })
            
            return results
            
        except Exception as e:
            logger.error(f"❌ Error extracting {category} content: {e}")
            return []

    async def cleanup(self):
        """Cleanup resources"""
        try:
            if self.web_scraper:
                await self.web_scraper.close_session()
            
            logger.info("✅ SMA Crew cleanup completed")
            
        except Exception as e:
            logger.error(f"❌ Error during cleanup: {e}")
