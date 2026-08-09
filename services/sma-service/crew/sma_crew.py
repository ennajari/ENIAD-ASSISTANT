"""
SMA Crew - Enhanced Smart Multi-Agent Crew
Orchestrates multiple specialized agents for comprehensive web intelligence and document processing
"""

from crewai import Crew, Task
from typing import List, Dict, Any, Optional
import asyncio
import logging
from datetime import datetime, timedelta

# Import all specialized agents
from agents.web_scraper_agent import WebScraperAgent
from agents.content_analyzer_agent import ContentAnalyzerAgent
from agents.pdf_reader_agent import PDFReaderAgent
from agents.image_ocr_agent import ImageOCRAgent
from agents.extractor_agent import ExtractorAgent
from agents.rag_agent import RAGAgent
from agents.coordinator_agent import CoordinatorAgent

logger = logging.getLogger(__name__)

class SMACrew:
    def __init__(self):
        # Initialize all specialized agents
        self.web_scraper = None
        self.content_analyzer = None
        self.pdf_reader = None
        self.image_ocr = None
        self.extractor = None
        self.rag_agent = None
        self.coordinator = None
        self.crew = None
        self.is_initialized = False

    async def initialize_agents(self):
        """Initialize all agents"""
        try:
            logger.info("🤖 Initializing Enhanced SMA Crew agents...")

            # Initialize all specialized agents
            self.web_scraper = WebScraperAgent()
            self.content_analyzer = ContentAnalyzerAgent()
            self.pdf_reader = PDFReaderAgent()
            self.image_ocr = ImageOCRAgent()
            self.extractor = ExtractorAgent()
            self.rag_agent = RAGAgent()
            self.coordinator = CoordinatorAgent()

            # Initialize sessions for agents that need them
            await self.web_scraper.initialize_session()
            await self.pdf_reader.initialize_session()
            await self.image_ocr.initialize_session()

            # Create CrewAI crew with all agents
            self.crew = Crew(
                agents=[
                    self.coordinator.agent,  # Master coordinator
                    self.web_scraper.agent,
                    self.content_analyzer.agent,
                    self.pdf_reader.agent,
                    self.image_ocr.agent,
                    self.extractor.agent,
                    self.rag_agent.agent
                ],
                verbose=True
            )

            self.is_initialized = True
            logger.info("✅ Enhanced SMA Crew initialized successfully with 7 agents")

        except Exception as e:
            logger.error(f"❌ Failed to initialize Enhanced SMA Crew: {e}")
            raise

    async def execute_comprehensive_search(
        self,
        query: str,
        language: str = "fr",
        target_sites: List[Dict[str, Any]] = None,
        categories: List[str] = None,
        max_results: int = 20
    ) -> Dict[str, Any]:
        """Execute comprehensive search using coordinator"""
        try:
            if not self.is_initialized:
                await self.initialize_agents()

            logger.info(f"🚀 Executing comprehensive search: {query[:50]}...")

            # Use coordinator to execute search mission
            task_params = {
                'query': query,
                'language': language,
                'target_sites': target_sites or [
                    {"name": "ENIAD", "url": "https://eniad.ump.ma/fr", "categories": ["news", "documents", "announcements"]},
                    {"name": "UMP", "url": "https://www.ump.ma/", "categories": ["news", "research", "events"]}
                ],
                'categories': categories or ["news", "documents", "announcements", "events"],
                'max_results': max_results
            }

            result = await self.coordinator.execute_workflow('comprehensive_search', task_params)

            logger.info(f"✅ Comprehensive search completed")
            return result

        except Exception as e:
            logger.error(f"❌ Comprehensive search failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def process_documents(
        self,
        documents: List[Dict[str, Any]],
        update_knowledge_base: bool = True
    ) -> Dict[str, Any]:
        """Process documents using coordinator"""
        try:
            if not self.is_initialized:
                await self.initialize_agents()

            logger.info(f"📄 Processing {len(documents)} documents")

            task_params = {
                'documents': documents,
                'update_knowledge_base': update_knowledge_base
            }

            result = await self.coordinator.execute_workflow('document_processing', task_params)

            logger.info(f"✅ Document processing completed")
            return result

        except Exception as e:
            logger.error(f"❌ Document processing failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def answer_with_rag(
        self,
        query: str,
        language: str = "fr",
        max_docs: int = 5,
        include_sources: bool = True
    ) -> Dict[str, Any]:
        """Answer query using RAG system via coordinator"""
        try:
            if not self.is_initialized:
                await self.initialize_agents()

            logger.info(f"🤖 Answering with RAG: {query[:50]}...")

            task_params = {
                'query': query,
                'language': language,
                'max_docs': max_docs,
                'include_sources': include_sources
            }

            result = await self.coordinator.execute_workflow('rag_query', task_params)

            logger.info(f"✅ RAG query completed")
            return result

        except Exception as e:
            logger.error(f"❌ RAG query failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def extract_content_from_sources(
        self,
        sources: List[Dict[str, Any]],
        extraction_types: List[str] = None
    ) -> Dict[str, Any]:
        """Extract content from various sources using coordinator"""
        try:
            if not self.is_initialized:
                await self.initialize_agents()

            logger.info(f"✂️ Extracting content from {len(sources)} sources")

            task_params = {
                'sources': sources,
                'extraction_types': extraction_types or ['text', 'documents', 'images']
            }

            result = await self.coordinator.execute_workflow('content_extraction', task_params)

            logger.info(f"✅ Content extraction completed")
            return result

        except Exception as e:
            logger.error(f"❌ Content extraction failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def get_system_health(self) -> Dict[str, Any]:
        """Get comprehensive system health status"""
        try:
            if not self.is_initialized:
                await self.initialize_agents()

            # Get system status from coordinator
            system_status = await self.coordinator.get_system_status()

            # Add crew-specific information
            crew_info = {
                'crew_initialized': self.is_initialized,
                'total_agents': 7,
                'crew_type': 'Enhanced Multi-Agent System',
                'capabilities': [
                    'Web Scraping',
                    'PDF Processing',
                    'Image OCR',
                    'Content Analysis',
                    'Content Extraction',
                    'RAG Queries',
                    'Workflow Coordination'
                ]
            }

            if system_status.get('status') == 'success':
                system_status['crew_info'] = crew_info

            return system_status

        except Exception as e:
            logger.error(f"❌ Error getting system health: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'crew_initialized': self.is_initialized
            }

    async def optimize_and_execute_workflow(
        self,
        workflow_name: str,
        task_params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Optimize and execute workflow using coordinator"""
        try:
            if not self.is_initialized:
                await self.initialize_agents()

            logger.info(f"⚡ Optimizing and executing workflow: {workflow_name}")

            # First optimize the workflow
            optimization_result = await self.coordinator.optimize_workflow(workflow_name, task_params)

            if optimization_result.get('status') == 'success':
                logger.info(f"🔧 Applied optimizations: {optimization_result['optimizations']['optimizations_applied']}")

            # Execute the workflow
            execution_result = await self.coordinator.execute_workflow(workflow_name, task_params)

            # Combine optimization and execution results
            if execution_result.get('status') == 'success':
                execution_result['optimization_info'] = optimization_result.get('optimizations', {})

            return execution_result

        except Exception as e:
            logger.error(f"❌ Optimized workflow execution failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def batch_process_mixed_content(
        self,
        content_items: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Process mixed content types (web pages, PDFs, images) in batch"""
        try:
            if not self.is_initialized:
                await self.initialize_agents()

            logger.info(f"📦 Batch processing {len(content_items)} mixed content items")

            # Separate content by type
            web_sources = []
            pdf_documents = []
            image_documents = []

            for item in content_items:
                content_type = item.get('type', '').lower()
                if content_type in ['web', 'url', 'website']:
                    web_sources.append(item)
                elif content_type in ['pdf', 'document']:
                    pdf_documents.append(item)
                elif content_type in ['image', 'img', 'photo']:
                    image_documents.append(item)

            results = {
                'status': 'success',
                'processed_items': [],
                'failed_items': [],
                'summary': {
                    'total_items': len(content_items),
                    'web_sources': len(web_sources),
                    'pdf_documents': len(pdf_documents),
                    'image_documents': len(image_documents)
                }
            }

            # Process web sources
            if web_sources:
                web_task_params = {
                    'sources': web_sources,
                    'extraction_types': ['text', 'documents', 'images']
                }
                web_result = await self.coordinator.coordinate_content_extraction(web_task_params)
                if web_result.get('status') == 'success':
                    results['processed_items'].extend(web_result.get('extracted_content', []))

            # Process documents
            if pdf_documents or image_documents:
                doc_task_params = {
                    'documents': pdf_documents + image_documents,
                    'update_knowledge_base': True
                }
                doc_result = await self.coordinator.coordinate_document_processing(doc_task_params)
                if doc_result.get('status') == 'success':
                    results['processed_items'].extend(doc_result.get('processed_documents', []))
                    results['failed_items'].extend(doc_result.get('failed_documents', []))

            logger.info(f"✅ Batch processing completed: {len(results['processed_items'])} successful")
            return results

        except Exception as e:
            logger.error(f"❌ Batch processing failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def intelligent_search_and_answer(
        self,
        query: str,
        language: str = "fr",
        search_web: bool = True,
        use_rag: bool = True,
        max_sources: int = 5
    ) -> Dict[str, Any]:
        """Intelligent search that combines web search and RAG for comprehensive answers"""
        try:
            if not self.is_initialized:
                await self.initialize_agents()

            logger.info(f"🧠 Intelligent search and answer: {query[:50]}...")

            final_result = {
                'status': 'success',
                'query': query,
                'language': language,
                'answer': '',
                'sources': [],
                'search_results': {},
                'rag_results': {},
                'confidence': 0.0
            }

            # Step 1: RAG query first (fastest)
            if use_rag:
                rag_task_params = {
                    'query': query,
                    'language': language,
                    'max_docs': max_sources,
                    'include_sources': True
                }
                rag_result = await self.coordinator.coordinate_rag_query(rag_task_params)

                if rag_result.get('status') == 'success':
                    final_result['rag_results'] = rag_result
                    final_result['answer'] = rag_result.get('answer', '')
                    final_result['sources'].extend(rag_result.get('sources', []))
                    final_result['confidence'] = rag_result.get('confidence', 0.0)

            # Step 2: Web search if RAG confidence is low or web search is explicitly requested
            if search_web and (final_result['confidence'] < 0.7 or not use_rag):
                search_task_params = {
                    'query': query,
                    'language': language,
                    'target_sites': [
                        {"name": "ENIAD", "url": "https://eniad.ump.ma/fr", "categories": ["news", "documents", "announcements"]},
                        {"name": "UMP", "url": "https://www.ump.ma/", "categories": ["news", "research", "events"]}
                    ],
                    'categories': ["news", "documents", "announcements", "events"],
                    'max_results': max_sources
                }
                search_result = await self.coordinator.coordinate_search_mission(search_task_params)

                if search_result.get('status') == 'success':
                    final_result['search_results'] = search_result

                    # If RAG didn't provide a good answer, use search results
                    if final_result['confidence'] < 0.7:
                        final_result['answer'] = search_result.get('final_answer', final_result['answer'])
                        # Add search sources
                        for source in search_result.get('sources', []):
                            final_result['sources'].append(source)

                        # Update confidence based on search results
                        if search_result.get('final_answer'):
                            final_result['confidence'] = max(final_result['confidence'], 0.8)

            # Step 3: Fallback if no good answer found
            if not final_result['answer'] or final_result['confidence'] < 0.3:
                final_result['answer'] = f"Je n'ai pas trouvé d'information suffisante pour répondre à votre question: '{query}'. Veuillez reformuler votre question ou être plus spécifique."
                final_result['confidence'] = 0.1

            logger.info(f"✅ Intelligent search completed with confidence: {final_result['confidence']:.2f}")
            return final_result

        except Exception as e:
            logger.error(f"❌ Intelligent search failed: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'query': query
            }

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
        """Cleanup resources for all agents"""
        try:
            logger.info("🧹 Starting Enhanced SMA Crew cleanup...")

            # Cleanup agents with sessions
            if self.web_scraper:
                await self.web_scraper.close_session()

            if self.pdf_reader:
                await self.pdf_reader.close_session()

            if self.image_ocr:
                await self.image_ocr.close_session()

            # Cleanup coordinator (which will cleanup all managed agents)
            if self.coordinator:
                await self.coordinator.cleanup_agents()

            # Reset initialization flag
            self.is_initialized = False

            logger.info("✅ Enhanced SMA Crew cleanup completed")

        except Exception as e:
            logger.error(f"❌ Error during Enhanced SMA Crew cleanup: {e}")

    async def get_crew_capabilities(self) -> Dict[str, Any]:
        """Get detailed information about crew capabilities"""
        try:
            capabilities = {
                'status': 'success',
                'crew_type': 'Enhanced Multi-Agent System',
                'total_agents': 7,
                'agents': {
                    'coordinator': {
                        'name': 'CoordinatorAgent',
                        'role': 'Master orchestrator',
                        'capabilities': ['Workflow management', 'Task coordination', 'Error handling', 'Optimization']
                    },
                    'web_scraper': {
                        'name': 'WebScraperAgent',
                        'role': 'Web content extraction',
                        'capabilities': ['HTML parsing', 'Link extraction', 'Document discovery', 'Image detection']
                    },
                    'content_analyzer': {
                        'name': 'ContentAnalyzerAgent',
                        'role': 'Content analysis and categorization',
                        'capabilities': ['Text analysis', 'Language detection', 'Keyword extraction', 'Content classification']
                    },
                    'pdf_reader': {
                        'name': 'PDFReaderAgent',
                        'role': 'PDF document processing',
                        'capabilities': ['Text extraction', 'Metadata extraction', 'Structure analysis', 'Remote PDF processing']
                    },
                    'image_ocr': {
                        'name': 'ImageOCRAgent',
                        'role': 'Image text extraction',
                        'capabilities': ['OCR processing', 'Image preprocessing', 'Multi-language support', 'Text region detection']
                    },
                    'extractor': {
                        'name': 'ExtractorAgent',
                        'role': 'Content organization and structuring',
                        'capabilities': ['Semantic chunking', 'Content cleaning', 'Entity extraction', 'Content merging']
                    },
                    'rag_agent': {
                        'name': 'RAGAgent',
                        'role': 'Retrieval-Augmented Generation',
                        'capabilities': ['Vector search', 'Context generation', 'Knowledge base management', 'Answer synthesis']
                    }
                },
                'workflows': {
                    'comprehensive_search': 'Complete search with web scraping, analysis, and RAG',
                    'document_processing': 'Process PDFs and images, extract content, update knowledge base',
                    'rag_query': 'Answer questions using retrieval-augmented generation',
                    'content_extraction': 'Extract and organize content from various sources',
                    'intelligent_search': 'Combine web search and RAG for optimal answers',
                    'batch_processing': 'Process multiple content types simultaneously'
                },
                'supported_formats': {
                    'documents': ['PDF', 'DOC', 'DOCX', 'TXT'],
                    'images': ['JPG', 'JPEG', 'PNG', 'BMP', 'TIFF', 'GIF'],
                    'web_content': ['HTML', 'XML', 'JSON'],
                    'languages': ['French', 'Arabic', 'English']
                },
                'features': [
                    'Multi-language support',
                    'Real-time web scraping',
                    'OCR text extraction',
                    'Vector-based search',
                    'Workflow optimization',
                    'Error recovery',
                    'Batch processing',
                    'Knowledge base management'
                ]
            }

            # Add runtime status if initialized
            if self.is_initialized:
                system_health = await self.get_system_health()
                capabilities['runtime_status'] = system_health

            return capabilities

        except Exception as e:
            logger.error(f"❌ Error getting crew capabilities: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }
