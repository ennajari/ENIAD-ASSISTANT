"""
Coordinator Agent
Master agent that orchestrates all other agents, manages task order, retries failed steps, and optimizes workflow
"""

from crewai import Agent, Task, Crew
from langchain.tools import Tool
from typing import List, Dict, Any, Optional
import logging
import asyncio
from datetime import datetime
import json

# Import all specialized agents
from agents.web_scraper_agent import WebScraperAgent
from agents.content_analyzer_agent import ContentAnalyzerAgent
from agents.pdf_reader_agent import PDFReaderAgent
from agents.image_ocr_agent import ImageOCRAgent
from agents.extractor_agent import ExtractorAgent
from agents.rag_agent import RAGAgent

logger = logging.getLogger(__name__)

class CoordinatorAgent:
    def __init__(self):
        # Initialize all specialized agents
        self.web_scraper = WebScraperAgent()
        self.content_analyzer = ContentAnalyzerAgent()
        self.pdf_reader = PDFReaderAgent()
        self.image_ocr = ImageOCRAgent()
        self.extractor = ExtractorAgent()
        self.rag_agent = RAGAgent()

        # Workflow configurations
        self.workflows = {
            'comprehensive_search': {
                'description': 'Complete search with web scraping, content analysis, and RAG',
                'agents': ['web_scraper', 'content_analyzer', 'extractor', 'rag_agent'],
                'parallel_tasks': ['web_scraper'],
                'sequential_tasks': ['content_analyzer', 'extractor', 'rag_agent']
            },
            'document_processing': {
                'description': 'Process documents (PDFs, images) and add to knowledge base',
                'agents': ['pdf_reader', 'image_ocr', 'extractor', 'rag_agent'],
                'parallel_tasks': ['pdf_reader', 'image_ocr'],
                'sequential_tasks': ['extractor', 'rag_agent']
            },
            'rag_query': {
                'description': 'Answer queries using RAG system',
                'agents': ['rag_agent'],
                'parallel_tasks': [],
                'sequential_tasks': ['rag_agent']
            },
            'content_extraction': {
                'description': 'Extract and organize content from various sources',
                'agents': ['web_scraper', 'pdf_reader', 'image_ocr', 'extractor'],
                'parallel_tasks': ['web_scraper', 'pdf_reader', 'image_ocr'],
                'sequential_tasks': ['extractor']
            }
        }

        # Task execution settings
        self.settings = {
            'max_retries': 3,
            'retry_delay': 2,  # seconds
            'timeout': 300,    # seconds
            'parallel_limit': 5
        }

        # Initialize the CrewAI agent
        self.agent = Agent(
            role='Master Coordinator',
            goal='Orchestrate all agents to execute complex multi-step tasks efficiently and handle failures gracefully',
            backstory="""You are the master coordinator of a sophisticated multi-agent system. You understand
            the capabilities of each specialized agent and can orchestrate complex workflows that combine
            web scraping, document processing, content analysis, and knowledge retrieval to provide
            comprehensive solutions to user queries.""",
            verbose=True,
            allow_delegation=True,
            tools=self._create_tools()
        )

    def _create_tools(self) -> List[Tool]:
        """Create tools for the coordinator agent"""
        return [
            Tool(
                name="execute_workflow",
                description="Execute a predefined workflow with multiple agents",
                func=self.execute_workflow
            ),
            Tool(
                name="coordinate_search_mission",
                description="Coordinate a comprehensive search mission",
                func=self.coordinate_search_mission
            ),
            Tool(
                name="coordinate_document_processing",
                description="Coordinate document processing workflow",
                func=self.coordinate_document_processing
            ),
            Tool(
                name="coordinate_rag_query",
                description="Coordinate RAG query workflow",
                func=self.coordinate_rag_query
            ),
            Tool(
                name="get_system_status",
                description="Get status of all agents in the system",
                func=self.get_system_status
            ),
            Tool(
                name="optimize_workflow",
                description="Optimize workflow execution based on task requirements",
                func=self.optimize_workflow
            )
        ]

    async def execute_workflow(self, workflow_name: str, task_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a predefined workflow"""
        try:
            logger.info(f"🎯 Executing workflow: {workflow_name}")

            if workflow_name not in self.workflows:
                return {
                    'status': 'error',
                    'error': f'Unknown workflow: {workflow_name}',
                    'available_workflows': list(self.workflows.keys())
                }

            workflow = self.workflows[workflow_name]
            start_time = datetime.now()

            # Initialize agents
            await self._initialize_agents(workflow['agents'])

            # Execute workflow based on type
            if workflow_name == 'comprehensive_search':
                result = await self.coordinate_search_mission(task_params)
            elif workflow_name == 'document_processing':
                result = await self.coordinate_document_processing(task_params)
            elif workflow_name == 'rag_query':
                result = await self.coordinate_rag_query(task_params)
            elif workflow_name == 'content_extraction':
                result = await self.coordinate_content_extraction(task_params)
            else:
                result = await self._execute_generic_workflow(workflow, task_params)

            # Add execution metadata
            execution_time = (datetime.now() - start_time).total_seconds()
            result['execution_metadata'] = {
                'workflow_name': workflow_name,
                'execution_time': execution_time,
                'agents_used': workflow['agents'],
                'start_time': start_time.isoformat(),
                'end_time': datetime.now().isoformat()
            }

            logger.info(f"✅ Workflow {workflow_name} completed in {execution_time:.2f}s")
            return result

        except Exception as e:
            logger.error(f"❌ Workflow execution failed: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'workflow_name': workflow_name
            }

    async def coordinate_search_mission(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Coordinate a comprehensive search mission"""
        try:
            logger.info(f"🔍 Coordinating search mission")

            query = params.get('query', '')
            language = params.get('language', 'fr')
            target_sites = params.get('target_sites', [])
            categories = params.get('categories', ['news', 'documents', 'announcements'])

            if not query:
                return {
                    'status': 'error',
                    'error': 'Query is required for search mission'
                }

            mission_results = {
                'status': 'success',
                'query': query,
                'language': language,
                'steps_completed': [],
                'final_answer': '',
                'sources': [],
                'metadata': {}
            }

            # Step 1: Web scraping (parallel for multiple sites)
            logger.info("📡 Step 1: Web scraping")
            scraping_tasks = []
            for site in target_sites:
                task = self._execute_with_retry(
                    self.web_scraper.scrape_website,
                    site['url']
                )
                scraping_tasks.append(task)

            if scraping_tasks:
                scraping_results = await asyncio.gather(*scraping_tasks, return_exceptions=True)
                scraped_content = [r for r in scraping_results if isinstance(r, dict) and r.get('status') == 'success']
                mission_results['steps_completed'].append('web_scraping')
                mission_results['metadata']['scraped_sites'] = len(scraped_content)
            else:
                scraped_content = []

            # Step 2: Content analysis
            logger.info("🧠 Step 2: Content analysis")
            analyzed_content = []
            for content in scraped_content:
                if content.get('content'):
                    analysis = await self._execute_with_retry(
                        self.content_analyzer.analyze_content,
                        content['content'],
                        {'source': content.get('url', 'unknown')}
                    )
                    if analysis and analysis.get('status') != 'error':
                        analyzed_content.append({
                            'content': content['content'],
                            'analysis': analysis,
                            'source': content.get('url', 'unknown')
                        })

            mission_results['steps_completed'].append('content_analysis')
            mission_results['metadata']['analyzed_items'] = len(analyzed_content)

            # Step 3: Content extraction and organization
            logger.info("✂️ Step 3: Content extraction")
            if analyzed_content:
                extraction_result = await self._execute_with_retry(
                    self.extractor.organize_by_content_type,
                    analyzed_content
                )
                if extraction_result and extraction_result.get('status') == 'success':
                    organized_content = extraction_result.get('organized_content', {})
                    mission_results['steps_completed'].append('content_extraction')
                    mission_results['metadata']['organized_categories'] = list(organized_content.keys())
                else:
                    organized_content = {'general': analyzed_content}
            else:
                organized_content = {}

            # Step 4: RAG query for final answer
            logger.info("🤖 Step 4: RAG query")
            rag_result = await self._execute_with_retry(
                self.rag_agent.rag_query,
                query,
                language,
                5,  # max_docs
                True  # include_sources
            )

            if rag_result and rag_result.get('status') == 'success':
                mission_results['final_answer'] = rag_result.get('answer', '')
                mission_results['sources'] = rag_result.get('sources', [])
                mission_results['steps_completed'].append('rag_query')
                mission_results['metadata']['rag_confidence'] = rag_result.get('confidence', 0)
            else:
                # Fallback: generate answer from scraped content
                if analyzed_content:
                    combined_content = '\n\n'.join([item['content'][:500] for item in analyzed_content[:3]])
                    fallback_answer = f"Basé sur le contenu trouvé: {combined_content[:800]}..."
                    mission_results['final_answer'] = fallback_answer
                    mission_results['steps_completed'].append('fallback_answer')
                else:
                    mission_results['final_answer'] = "Aucune information pertinente trouvée pour cette requête."

            logger.info(f"✅ Search mission completed: {len(mission_results['steps_completed'])} steps")
            return mission_results

        except Exception as e:
            logger.error(f"❌ Search mission coordination failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def coordinate_document_processing(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Coordinate document processing workflow"""
        try:
            logger.info("📄 Coordinating document processing")

            documents = params.get('documents', [])
            update_knowledge_base = params.get('update_knowledge_base', True)

            if not documents:
                return {
                    'status': 'error',
                    'error': 'No documents provided for processing'
                }

            processing_results = {
                'status': 'success',
                'processed_documents': [],
                'failed_documents': [],
                'knowledge_base_updated': False,
                'metadata': {
                    'total_documents': len(documents),
                    'processing_start': datetime.now().isoformat()
                }
            }

            # Separate documents by type
            pdf_docs = [doc for doc in documents if doc.get('type', '').lower() == 'pdf' or doc.get('url', '').lower().endswith('.pdf')]
            image_docs = [doc for doc in documents if doc.get('type', '').lower() in ['image', 'jpg', 'jpeg', 'png', 'bmp']]

            # Process PDFs in parallel
            if pdf_docs:
                logger.info(f"📄 Processing {len(pdf_docs)} PDF documents")
                pdf_tasks = []
                for doc in pdf_docs:
                    if doc.get('url'):
                        task = self._execute_with_retry(
                            self.pdf_reader.download_and_process_pdf,
                            doc['url']
                        )
                    else:
                        task = self._execute_with_retry(
                            self.pdf_reader.extract_pdf_text,
                            doc.get('path', '')
                        )
                    pdf_tasks.append(task)

                pdf_results = await asyncio.gather(*pdf_tasks, return_exceptions=True)

                for i, result in enumerate(pdf_results):
                    if isinstance(result, dict) and result.get('status') == 'success':
                        processing_results['processed_documents'].append({
                            'type': 'pdf',
                            'source': pdf_docs[i],
                            'extracted_text': result.get('text', ''),
                            'metadata': result.get('metadata', {})
                        })
                    else:
                        processing_results['failed_documents'].append({
                            'type': 'pdf',
                            'source': pdf_docs[i],
                            'error': str(result) if isinstance(result, Exception) else result.get('error', 'Unknown error')
                        })

            # Process images in parallel
            if image_docs:
                logger.info(f"🖼️ Processing {len(image_docs)} image documents")
                image_tasks = []
                for doc in image_docs:
                    if doc.get('url'):
                        task = self._execute_with_retry(
                            self.image_ocr.extract_from_url,
                            doc['url']
                        )
                    else:
                        task = self._execute_with_retry(
                            self.image_ocr.extract_text_from_image,
                            doc.get('path', '')
                        )
                    image_tasks.append(task)

                image_results = await asyncio.gather(*image_tasks, return_exceptions=True)

                for i, result in enumerate(image_results):
                    if isinstance(result, dict) and result.get('status') == 'success':
                        processing_results['processed_documents'].append({
                            'type': 'image',
                            'source': image_docs[i],
                            'extracted_text': result.get('text', ''),
                            'confidence': result.get('confidence', 0)
                        })
                    else:
                        processing_results['failed_documents'].append({
                            'type': 'image',
                            'source': image_docs[i],
                            'error': str(result) if isinstance(result, Exception) else result.get('error', 'Unknown error')
                        })

            # Extract and organize content
            if processing_results['processed_documents']:
                logger.info("✂️ Extracting and organizing content")
                content_items = []
                for doc in processing_results['processed_documents']:
                    if doc.get('extracted_text'):
                        content_items.append({
                            'content': doc['extracted_text'],
                            'source': doc['source'].get('url', doc['source'].get('path', 'unknown')),
                            'type': doc['type']
                        })

                if content_items:
                    extraction_result = await self._execute_with_retry(
                        self.extractor.extract_semantic_chunks,
                        '\n\n'.join([item['content'] for item in content_items]),
                        'documents'
                    )

                    if extraction_result and extraction_result.get('status') == 'success':
                        processing_results['semantic_chunks'] = extraction_result.get('chunks', [])

            # Update knowledge base if requested
            if update_knowledge_base and processing_results['processed_documents']:
                logger.info("📚 Updating knowledge base")
                kb_documents = []
                for doc in processing_results['processed_documents']:
                    if doc.get('extracted_text'):
                        kb_doc = {
                            'content': doc['extracted_text'],
                            'metadata': {
                                'source': doc['source'].get('url', doc['source'].get('path', 'unknown')),
                                'type': doc['type'],
                                'processed_timestamp': datetime.now().isoformat()
                            }
                        }
                        kb_documents.append(kb_doc)

                if kb_documents:
                    kb_result = await self._execute_with_retry(
                        self.rag_agent.update_knowledge_base,
                        kb_documents
                    )

                    if kb_result and kb_result.get('status') == 'success':
                        processing_results['knowledge_base_updated'] = True
                        processing_results['kb_documents_added'] = kb_result.get('documents_added', 0)

            processing_results['metadata']['processing_end'] = datetime.now().isoformat()
            processing_results['metadata']['successful_documents'] = len(processing_results['processed_documents'])
            processing_results['metadata']['failed_documents'] = len(processing_results['failed_documents'])

            logger.info(f"✅ Document processing completed: {len(processing_results['processed_documents'])} successful")
            return processing_results

        except Exception as e:
            logger.error(f"❌ Document processing coordination failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def coordinate_rag_query(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Coordinate RAG query workflow"""
        try:
            logger.info("🤖 Coordinating RAG query")

            query = params.get('query', '')
            language = params.get('language', 'fr')
            max_docs = params.get('max_docs', 5)
            include_sources = params.get('include_sources', True)

            if not query:
                return {
                    'status': 'error',
                    'error': 'Query is required for RAG workflow'
                }

            # Execute RAG query
            rag_result = await self._execute_with_retry(
                self.rag_agent.rag_query,
                query,
                language,
                max_docs,
                include_sources
            )

            if rag_result and rag_result.get('status') == 'success':
                return rag_result
            else:
                return {
                    'status': 'error',
                    'error': rag_result.get('error', 'RAG query failed') if rag_result else 'RAG query failed'
                }

        except Exception as e:
            logger.error(f"❌ RAG query coordination failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def coordinate_content_extraction(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Coordinate content extraction workflow"""
        try:
            logger.info("✂️ Coordinating content extraction")

            sources = params.get('sources', [])
            extraction_types = params.get('extraction_types', ['text', 'documents', 'images'])

            if not sources:
                return {
                    'status': 'error',
                    'error': 'No sources provided for extraction'
                }

            extraction_results = {
                'status': 'success',
                'extracted_content': [],
                'extraction_summary': {},
                'metadata': {
                    'total_sources': len(sources),
                    'extraction_types': extraction_types
                }
            }

            # Process each source
            for source in sources:
                source_type = source.get('type', 'web')
                source_url = source.get('url', '')

                if source_type == 'web' and 'text' in extraction_types:
                    # Web scraping
                    scrape_result = await self._execute_with_retry(
                        self.web_scraper.scrape_website,
                        source_url
                    )
                    if scrape_result and scrape_result.get('status') == 'success':
                        extraction_results['extracted_content'].append({
                            'type': 'web_text',
                            'source': source_url,
                            'content': scrape_result.get('content', ''),
                            'title': scrape_result.get('title', '')
                        })

                if 'documents' in extraction_types:
                    # Document extraction
                    doc_result = await self._execute_with_retry(
                        self.web_scraper.extract_documents,
                        source_url
                    )
                    if doc_result:
                        for doc in doc_result:
                            extraction_results['extracted_content'].append({
                                'type': 'document',
                                'source': source_url,
                                'document_url': doc.get('url', ''),
                                'title': doc.get('title', ''),
                                'document_type': doc.get('type', '')
                            })

                if 'images' in extraction_types:
                    # Image extraction
                    img_result = await self._execute_with_retry(
                        self.web_scraper.extract_images,
                        source_url
                    )
                    if img_result:
                        for img in img_result:
                            extraction_results['extracted_content'].append({
                                'type': 'image',
                                'source': source_url,
                                'image_url': img.get('url', ''),
                                'alt_text': img.get('alt', ''),
                                'title': img.get('title', '')
                            })

            # Organize extracted content
            if extraction_results['extracted_content']:
                organize_result = await self._execute_with_retry(
                    self.extractor.organize_by_content_type,
                    extraction_results['extracted_content']
                )

                if organize_result and organize_result.get('status') == 'success':
                    extraction_results['organized_content'] = organize_result.get('organized_content', {})
                    extraction_results['extraction_summary'] = organize_result.get('category_counts', {})

            logger.info(f"✅ Content extraction completed: {len(extraction_results['extracted_content'])} items")
            return extraction_results

        except Exception as e:
            logger.error(f"❌ Content extraction coordination failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def get_system_status(self) -> Dict[str, Any]:
        """Get status of all agents in the system"""
        try:
            logger.info("📊 Getting system status")

            agents_status = {}

            # Get status from each agent
            try:
                agents_status['web_scraper'] = await self.web_scraper.get_status()
            except Exception as e:
                agents_status['web_scraper'] = {'status': 'error', 'error': str(e)}

            try:
                agents_status['content_analyzer'] = await self.content_analyzer.get_status()
            except Exception as e:
                agents_status['content_analyzer'] = {'status': 'error', 'error': str(e)}

            try:
                agents_status['pdf_reader'] = await self.pdf_reader.get_status()
            except Exception as e:
                agents_status['pdf_reader'] = {'status': 'error', 'error': str(e)}

            try:
                agents_status['image_ocr'] = await self.image_ocr.get_status()
            except Exception as e:
                agents_status['image_ocr'] = {'status': 'error', 'error': str(e)}

            try:
                agents_status['extractor'] = await self.extractor.get_status()
            except Exception as e:
                agents_status['extractor'] = {'status': 'error', 'error': str(e)}

            try:
                agents_status['rag_agent'] = await self.rag_agent.get_status()
            except Exception as e:
                agents_status['rag_agent'] = {'status': 'error', 'error': str(e)}

            # Calculate overall system health
            active_agents = sum(1 for status in agents_status.values()
                              if status.get('status') == 'active')
            total_agents = len(agents_status)

            system_health = 'healthy' if active_agents == total_agents else 'degraded' if active_agents > 0 else 'critical'

            return {
                'status': 'success',
                'system_health': system_health,
                'active_agents': active_agents,
                'total_agents': total_agents,
                'agents_status': agents_status,
                'available_workflows': list(self.workflows.keys()),
                'coordinator_settings': self.settings,
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"❌ Error getting system status: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def optimize_workflow(self, workflow_name: str, task_params: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize workflow execution based on task requirements"""
        try:
            logger.info(f"⚡ Optimizing workflow: {workflow_name}")

            if workflow_name not in self.workflows:
                return {
                    'status': 'error',
                    'error': f'Unknown workflow: {workflow_name}'
                }

            workflow = self.workflows[workflow_name]
            optimizations = {
                'original_workflow': workflow.copy(),
                'optimized_workflow': workflow.copy(),
                'optimizations_applied': [],
                'estimated_time_savings': 0
            }

            # Analyze task parameters for optimization opportunities
            query_complexity = len(task_params.get('query', '').split()) if 'query' in task_params else 0
            target_sites_count = len(task_params.get('target_sites', []))
            documents_count = len(task_params.get('documents', []))

            # Optimization 1: Parallel execution for multiple sources
            if target_sites_count > 1 or documents_count > 1:
                if 'web_scraper' in workflow['sequential_tasks']:
                    optimizations['optimized_workflow']['sequential_tasks'].remove('web_scraper')
                    if 'web_scraper' not in optimizations['optimized_workflow']['parallel_tasks']:
                        optimizations['optimized_workflow']['parallel_tasks'].append('web_scraper')
                    optimizations['optimizations_applied'].append('parallel_web_scraping')
                    optimizations['estimated_time_savings'] += target_sites_count * 2

            # Optimization 2: Skip unnecessary steps for simple queries
            if query_complexity < 3:  # Simple query
                if 'extractor' in workflow['sequential_tasks'] and len(workflow['sequential_tasks']) > 2:
                    optimizations['optimizations_applied'].append('skip_complex_extraction')
                    optimizations['estimated_time_savings'] += 5

            # Optimization 3: Adjust timeout based on task complexity
            if documents_count > 5 or target_sites_count > 3:
                optimizations['recommended_timeout'] = self.settings['timeout'] * 2
                optimizations['optimizations_applied'].append('increased_timeout')
            elif query_complexity < 5:
                optimizations['recommended_timeout'] = self.settings['timeout'] // 2
                optimizations['optimizations_applied'].append('decreased_timeout')

            return {
                'status': 'success',
                'workflow_name': workflow_name,
                'optimizations': optimizations,
                'recommendation': 'Apply optimizations for better performance' if optimizations['optimizations_applied'] else 'No optimizations needed'
            }

        except Exception as e:
            logger.error(f"❌ Workflow optimization failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def _initialize_agents(self, agent_names: List[str]) -> None:
        """Initialize required agents"""
        try:
            for agent_name in agent_names:
                agent = getattr(self, agent_name, None)
                if agent and hasattr(agent, 'initialize_session'):
                    await agent.initialize_session()
        except Exception as e:
            logger.warning(f"⚠️ Agent initialization warning: {e}")

    async def _execute_with_retry(self, func, *args, **kwargs) -> Any:
        """Execute function with retry logic"""
        last_exception = None

        for attempt in range(self.settings['max_retries']):
            try:
                if asyncio.iscoroutinefunction(func):
                    result = await func(*args, **kwargs)
                else:
                    result = func(*args, **kwargs)

                # Check if result indicates success
                if isinstance(result, dict) and result.get('status') == 'error':
                    raise Exception(result.get('error', 'Unknown error'))

                return result

            except Exception as e:
                last_exception = e
                logger.warning(f"⚠️ Attempt {attempt + 1} failed: {e}")

                if attempt < self.settings['max_retries'] - 1:
                    await asyncio.sleep(self.settings['retry_delay'])
                else:
                    logger.error(f"❌ All {self.settings['max_retries']} attempts failed")

        # Return error result if all retries failed
        return {
            'status': 'error',
            'error': str(last_exception) if last_exception else 'All retry attempts failed'
        }

    async def _execute_generic_workflow(self, workflow: Dict[str, Any], task_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a generic workflow"""
        try:
            logger.info(f"🔄 Executing generic workflow with {len(workflow['agents'])} agents")

            results = {
                'status': 'success',
                'workflow_results': {},
                'execution_order': [],
                'metadata': {}
            }

            # Execute parallel tasks
            if workflow['parallel_tasks']:
                logger.info(f"⚡ Executing {len(workflow['parallel_tasks'])} parallel tasks")
                parallel_results = {}

                for agent_name in workflow['parallel_tasks']:
                    agent = getattr(self, agent_name, None)
                    if agent:
                        # Execute appropriate method based on agent type
                        if agent_name == 'web_scraper':
                            task = self._execute_with_retry(
                                agent.scrape_website,
                                task_params.get('url', '')
                            )
                        elif agent_name == 'pdf_reader':
                            task = self._execute_with_retry(
                                agent.extract_pdf_text,
                                task_params.get('pdf_source', '')
                            )
                        elif agent_name == 'image_ocr':
                            task = self._execute_with_retry(
                                agent.extract_text_from_image,
                                task_params.get('image_source', '')
                            )
                        else:
                            continue

                        parallel_results[agent_name] = await task

                results['workflow_results']['parallel'] = parallel_results
                results['execution_order'].extend(workflow['parallel_tasks'])

            # Execute sequential tasks
            if workflow['sequential_tasks']:
                logger.info(f"🔗 Executing {len(workflow['sequential_tasks'])} sequential tasks")
                sequential_results = {}

                for agent_name in workflow['sequential_tasks']:
                    agent = getattr(self, agent_name, None)
                    if agent:
                        # Execute appropriate method based on agent type
                        if agent_name == 'content_analyzer':
                            content = task_params.get('content', '')
                            result = await self._execute_with_retry(
                                agent.analyze_content,
                                content
                            )
                        elif agent_name == 'extractor':
                            content = task_params.get('content', '')
                            result = await self._execute_with_retry(
                                agent.clean_and_structure_content,
                                content
                            )
                        elif agent_name == 'rag_agent':
                            query = task_params.get('query', '')
                            result = await self._execute_with_retry(
                                agent.rag_query,
                                query
                            )
                        else:
                            continue

                        sequential_results[agent_name] = result
                        results['execution_order'].append(agent_name)

                results['workflow_results']['sequential'] = sequential_results

            logger.info(f"✅ Generic workflow completed")
            return results

        except Exception as e:
            logger.error(f"❌ Generic workflow execution failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def cleanup_agents(self) -> None:
        """Cleanup all agents"""
        try:
            logger.info("🧹 Cleaning up agents")

            agents = [
                self.web_scraper,
                self.pdf_reader,
                self.image_ocr
            ]

            for agent in agents:
                if hasattr(agent, 'close_session'):
                    try:
                        await agent.close_session()
                    except Exception as e:
                        logger.warning(f"⚠️ Error closing agent session: {e}")

            logger.info("✅ Agent cleanup completed")

        except Exception as e:
            logger.error(f"❌ Error during agent cleanup: {e}")

    async def get_status(self) -> Dict[str, Any]:
        """Get coordinator agent status"""
        try:
            system_status = await self.get_system_status()

            return {
                "agent_name": "CoordinatorAgent",
                "status": "active",
                "system_health": system_status.get('system_health', 'unknown'),
                "managed_agents": len(system_status.get('agents_status', {})),
                "available_workflows": list(self.workflows.keys()),
                "settings": self.settings,
                "tools_available": len(self.agent.tools) if hasattr(self.agent, 'tools') else 6
            }

        except Exception as e:
            logger.error(f"❌ Error getting coordinator status: {e}")
            return {
                "agent_name": "CoordinatorAgent",
                "status": "error",
                "error": str(e)
            }