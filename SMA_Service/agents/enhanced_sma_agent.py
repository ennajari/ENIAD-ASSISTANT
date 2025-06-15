#!/usr/bin/env python3
"""
Enhanced SMA Agent for ENIAD
Combines high-quality web scraping with Gemini AI analysis
"""

import sys
import os
import requests
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import asyncio

# Add the enhanced web scraper to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from enhanced_web_scraper import EnhancedWebScraper

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnhancedSMAAgent:
    def __init__(self):
        self.gemini_api_key = "AIzaSyDIDbm8CcUxtTTW3omJcOHQj1BWcmRWeYc"
        self.gemini_model = "gemini-1.5-flash"
        self.web_scraper = EnhancedWebScraper()
        
        # DuckDuckGo News API configuration (optional)
        self.duckduckgo_api_url = "https://serpapi.com/search"
        self.serpapi_key = None  # Set if available
        
        # Agent specializations
        self.agents = {
            "web_scraper": self.web_scraper_agent,
            "content_analyzer": self.content_analyzer_agent,
            "news_monitor": self.news_monitor_agent,
            "document_extractor": self.document_extractor_agent,
            "update_detector": self.update_detector_agent
        }
        
        logger.info("Enhanced SMA Agent initialized with Gemini AI integration")
    
    async def web_scraper_agent(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """Web scraper agent - extracts content from ENIAD sites"""
        logger.info(f"🕷️ Web Scraper Agent: Processing query '{query}'")
        
        try:
            # Use enhanced web scraper for targeted content extraction
            scraped_results = self.web_scraper.search_specific_content(query, max_results)
            
            # Process and enhance results
            enhanced_results = []
            for result in scraped_results:
                enhanced_result = {
                    "agent": "web_scraper",
                    "title": result["title"],
                    "content": result["content"][:1000],  # Limit content
                    "url": result["url"],
                    "page_type": result["metadata"]["page_type"],
                    "language": result["metadata"]["language"],
                    "relevance_score": result.get("relevance_score", 0),
                    "extraction_date": result["extraction_date"],
                    "links_count": result["metadata"]["links_count"],
                    "documents_count": result["metadata"]["documents_count"],
                    "category": "web_content"
                }
                enhanced_results.append(enhanced_result)
            
            logger.info(f"✅ Web Scraper Agent: Found {len(enhanced_results)} results")
            return enhanced_results
            
        except Exception as e:
            logger.error(f"❌ Web Scraper Agent error: {str(e)}")
            return []
    
    async def content_analyzer_agent(self, content_list: List[Dict[str, Any]], query: str) -> List[Dict[str, Any]]:
        """Content analyzer agent - uses Gemini AI to analyze scraped content"""
        logger.info(f"🧠 Content Analyzer Agent: Analyzing {len(content_list)} items")
        
        analyzed_results = []
        
        for content in content_list:
            try:
                # Prepare content for Gemini analysis
                analysis_prompt = f"""
Analysez le contenu suivant d'ENIAD par rapport à la requête "{query}":

Titre: {content.get('title', '')}
Contenu: {content.get('content', '')[:800]}
URL: {content.get('url', '')}
Type de page: {content.get('page_type', '')}

Fournissez une analyse JSON avec:
1. relevance (score 0-1 par rapport à la requête)
2. summary (résumé en français, 100 mots max)
3. keywords (5 mots-clés principaux)
4. importance (1-5, importance pour un étudiant ENIAD)
5. category (actualités, formation, administratif, recherche, etc.)
6. actionable_info (informations pratiques pour les étudiants)

Réponse JSON uniquement:
"""

                # Call Gemini API
                gemini_analysis = await self.call_gemini_api(analysis_prompt)
                
                # Parse Gemini response
                analysis_data = self.parse_gemini_response(gemini_analysis)
                
                # Enhance content with Gemini analysis
                enhanced_content = {
                    **content,
                    "agent": "content_analyzer",
                    "gemini_analysis": analysis_data,
                    "ai_relevance": analysis_data.get("relevance", 0.5),
                    "ai_summary": analysis_data.get("summary", ""),
                    "ai_keywords": analysis_data.get("keywords", []),
                    "ai_importance": analysis_data.get("importance", 3),
                    "ai_category": analysis_data.get("category", "general"),
                    "actionable_info": analysis_data.get("actionable_info", ""),
                    "analysis_date": datetime.now().isoformat()
                }
                
                analyzed_results.append(enhanced_content)
                
            except Exception as e:
                logger.error(f"❌ Content analysis error for {content.get('url', 'unknown')}: {str(e)}")
                # Add content without AI analysis
                analyzed_results.append({
                    **content,
                    "agent": "content_analyzer",
                    "ai_relevance": 0.5,
                    "ai_summary": content.get('content', '')[:200] + "...",
                    "analysis_error": str(e)
                })
        
        # Sort by AI relevance
        analyzed_results.sort(key=lambda x: x.get("ai_relevance", 0), reverse=True)
        
        logger.info(f"✅ Content Analyzer Agent: Analyzed {len(analyzed_results)} items")
        return analyzed_results
    
    async def news_monitor_agent(self, query: str = "ENIAD actualités") -> List[Dict[str, Any]]:
        """News monitor agent - tracks latest news and updates"""
        logger.info(f"📰 News Monitor Agent: Searching for '{query}'")
        
        try:
            # Use DuckDuckGo News API if available
            if self.serpapi_key:
                news_results = await self.search_duckduckgo_news(query)
            else:
                # Fallback to web scraping news sections
                news_results = await self.scrape_news_sections()
            
            # Enhance news with Gemini analysis
            enhanced_news = []
            for news_item in news_results:
                try:
                    # Analyze news relevance and importance
                    news_analysis_prompt = f"""
Analysez cette actualité ENIAD:

Titre: {news_item.get('title', '')}
Contenu: {news_item.get('content', '')[:500]}
Date: {news_item.get('date', '')}

Évaluez:
1. relevance (0-1, pertinence pour les étudiants ENIAD)
2. urgency (1-5, urgence de l'information)
3. category (admission, formation, événement, administratif, etc.)
4. target_audience (étudiants, candidats, personnel, etc.)
5. summary (résumé en 50 mots)

JSON uniquement:
"""
                    
                    analysis = await self.call_gemini_api(news_analysis_prompt)
                    analysis_data = self.parse_gemini_response(analysis)
                    
                    enhanced_news.append({
                        **news_item,
                        "agent": "news_monitor",
                        "ai_analysis": analysis_data,
                        "category": "news"
                    })
                    
                except Exception as e:
                    logger.error(f"❌ News analysis error: {str(e)}")
                    enhanced_news.append({
                        **news_item,
                        "agent": "news_monitor",
                        "category": "news"
                    })
            
            logger.info(f"✅ News Monitor Agent: Found {len(enhanced_news)} news items")
            return enhanced_news
            
        except Exception as e:
            logger.error(f"❌ News Monitor Agent error: {str(e)}")
            return []
    
    async def document_extractor_agent(self, urls: List[str]) -> List[Dict[str, Any]]:
        """Document extractor agent - finds and catalogs documents"""
        logger.info(f"📄 Document Extractor Agent: Processing {len(urls)} URLs")
        
        documents = []
        
        for url in urls:
            try:
                # Extract documents from each URL
                page_data = self.web_scraper.get_page_content(url)
                if page_data:
                    extracted_data = self.web_scraper.extract_page_data(page_data, url)
                    
                    # Process found documents
                    for doc in extracted_data.get("documents", []):
                        # Analyze document with Gemini
                        doc_analysis_prompt = f"""
Analysez ce document ENIAD:

Nom: {doc.get('text', '')}
URL: {doc.get('url', '')}
Type: {doc.get('type', '')}

Déterminez:
1. category (règlement, formation, admission, recherche, etc.)
2. importance (1-5 pour les étudiants)
3. target_audience (étudiants, candidats, personnel)
4. description (description en français, 30 mots)

JSON uniquement:
"""
                        
                        try:
                            analysis = await self.call_gemini_api(doc_analysis_prompt)
                            analysis_data = self.parse_gemini_response(analysis)
                            
                            documents.append({
                                **doc,
                                "agent": "document_extractor",
                                "source_url": url,
                                "ai_analysis": analysis_data,
                                "category": "document",
                                "extraction_date": datetime.now().isoformat()
                            })
                        except Exception as e:
                            logger.error(f"❌ Document analysis error: {str(e)}")
                            documents.append({
                                **doc,
                                "agent": "document_extractor",
                                "source_url": url,
                                "category": "document"
                            })
                            
            except Exception as e:
                logger.error(f"❌ Document extraction error for {url}: {str(e)}")
        
        logger.info(f"✅ Document Extractor Agent: Found {len(documents)} documents")
        return documents
    
    async def update_detector_agent(self, urls: List[str]) -> List[Dict[str, Any]]:
        """Update detector agent - monitors changes on websites"""
        logger.info(f"🔄 Update Detector Agent: Monitoring {len(urls)} URLs")
        
        updates = []
        
        for url in urls:
            try:
                # Get current page content
                page_data = self.web_scraper.get_page_content(url)
                if page_data:
                    extracted_data = self.web_scraper.extract_page_data(page_data, url)
                    
                    # Analyze for recent updates (simplified)
                    update_analysis_prompt = f"""
Analysez ce contenu ENIAD pour détecter des informations récentes:

Titre: {extracted_data.get('title', '')}
Contenu: {extracted_data.get('content', '')[:800]}

Recherchez:
1. has_recent_info (true/false, contient des infos récentes)
2. update_type (nouveau, modifié, urgent, etc.)
3. relevance (0-1, pertinence pour les étudiants)
4. summary (résumé des nouveautés, 50 mots)

JSON uniquement:
"""
                    
                    analysis = await self.call_gemini_api(update_analysis_prompt)
                    analysis_data = self.parse_gemini_response(analysis)
                    
                    if analysis_data.get("has_recent_info", False):
                        updates.append({
                            "url": url,
                            "title": extracted_data.get("title", ""),
                            "agent": "update_detector",
                            "ai_analysis": analysis_data,
                            "category": "update",
                            "detection_date": datetime.now().isoformat()
                        })
                        
            except Exception as e:
                logger.error(f"❌ Update detection error for {url}: {str(e)}")
        
        logger.info(f"✅ Update Detector Agent: Found {len(updates)} updates")
        return updates
    
    async def call_gemini_api(self, prompt: str) -> str:
        """Call Gemini API for content analysis"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.gemini_model}:generateContent"
            params = {"key": self.gemini_api_key}
            
            data = {
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 300,
                    "topP": 0.8,
                    "topK": 40
                }
            }
            
            response = requests.post(url, json=data, params=params, timeout=15)
            response.raise_for_status()
            
            result = response.json()
            return result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            
        except Exception as e:
            logger.error(f"❌ Gemini API error: {str(e)}")
            return ""
    
    def parse_gemini_response(self, response_text: str) -> Dict[str, Any]:
        """Parse Gemini JSON response with fallback"""
        try:
            # Try to extract JSON from response
            json_match = response_text.find('{')
            if json_match != -1:
                json_end = response_text.rfind('}') + 1
                json_str = response_text[json_match:json_end]
                return json.loads(json_str)
        except:
            pass
        
        # Fallback to default values
        return {
            "relevance": 0.5,
            "summary": response_text[:100] if response_text else "Analyse non disponible",
            "keywords": [],
            "importance": 3,
            "category": "general"
        }

    async def search_duckduckgo_news(self, query: str) -> List[Dict[str, Any]]:
        """Search DuckDuckGo News API"""
        try:
            if not self.serpapi_key:
                return await self.scrape_news_sections()

            params = {
                "engine": "duckduckgo_news",
                "q": f"{query} ENIAD UMP Maroc",
                "api_key": self.serpapi_key
            }

            response = requests.get(self.duckduckgo_api_url, params=params, timeout=10)
            response.raise_for_status()

            data = response.json()
            news_results = []

            for item in data.get("news_results", []):
                news_results.append({
                    "title": item.get("title", ""),
                    "content": item.get("snippet", ""),
                    "url": item.get("link", ""),
                    "date": item.get("date", ""),
                    "source": "duckduckgo_news"
                })

            return news_results

        except Exception as e:
            logger.error(f"❌ DuckDuckGo News API error: {str(e)}")
            return await self.scrape_news_sections()

    async def scrape_news_sections(self) -> List[Dict[str, Any]]:
        """Fallback: scrape news sections from ENIAD sites"""
        try:
            news_urls = [
                "https://eniad.ump.ma/fr/actualite",
                "https://www.ump.ma/actualites"
            ]

            news_results = []

            for url in news_urls:
                page_data = self.web_scraper.get_page_content(url)
                if page_data:
                    extracted_data = self.web_scraper.extract_page_data(page_data, url)

                    # Extract news-like content
                    news_results.append({
                        "title": extracted_data.get("title", ""),
                        "content": extracted_data.get("content", "")[:500],
                        "url": url,
                        "date": datetime.now().isoformat(),
                        "source": "web_scraping"
                    })

            return news_results

        except Exception as e:
            logger.error(f"❌ News scraping error: {str(e)}")
            return []

    async def execute_sma_workflow(self, query: str, agents_to_use: List[str] = None) -> Dict[str, Any]:
        """Execute complete SMA workflow with multiple agents"""
        if agents_to_use is None:
            agents_to_use = ["web_scraper", "content_analyzer", "news_monitor"]

        logger.info(f"🚀 Executing SMA workflow for query: '{query}'")
        logger.info(f"🤖 Using agents: {', '.join(agents_to_use)}")

        workflow_results = {
            "query": query,
            "execution_date": datetime.now().isoformat(),
            "agents_used": agents_to_use,
            "results": {},
            "summary": {},
            "total_items": 0
        }

        try:
            # Step 1: Web Scraper Agent
            if "web_scraper" in agents_to_use:
                web_results = await self.web_scraper_agent(query, max_results=10)
                workflow_results["results"]["web_scraper"] = web_results
                workflow_results["total_items"] += len(web_results)

            # Step 2: Content Analyzer Agent
            if "content_analyzer" in agents_to_use and "web_scraper" in workflow_results["results"]:
                analyzed_results = await self.content_analyzer_agent(
                    workflow_results["results"]["web_scraper"],
                    query
                )
                workflow_results["results"]["content_analyzer"] = analyzed_results

            # Step 3: News Monitor Agent
            if "news_monitor" in agents_to_use:
                news_results = await self.news_monitor_agent(f"{query} actualités")
                workflow_results["results"]["news_monitor"] = news_results
                workflow_results["total_items"] += len(news_results)

            # Step 4: Document Extractor Agent
            if "document_extractor" in agents_to_use:
                urls_to_check = []
                if "web_scraper" in workflow_results["results"]:
                    urls_to_check = [item["url"] for item in workflow_results["results"]["web_scraper"][:5]]

                if urls_to_check:
                    doc_results = await self.document_extractor_agent(urls_to_check)
                    workflow_results["results"]["document_extractor"] = doc_results
                    workflow_results["total_items"] += len(doc_results)

            # Step 5: Update Detector Agent
            if "update_detector" in agents_to_use:
                urls_to_monitor = self.web_scraper.eniad_urls[:5]  # Monitor top 5 URLs
                update_results = await self.update_detector_agent(urls_to_monitor)
                workflow_results["results"]["update_detector"] = update_results
                workflow_results["total_items"] += len(update_results)

            # Generate workflow summary with Gemini
            workflow_results["summary"] = await self.generate_workflow_summary(workflow_results, query)

            logger.info(f"✅ SMA workflow completed: {workflow_results['total_items']} items found")
            return workflow_results

        except Exception as e:
            logger.error(f"❌ SMA workflow error: {str(e)}")
            workflow_results["error"] = str(e)
            return workflow_results

    async def generate_workflow_summary(self, workflow_results: Dict[str, Any], query: str) -> Dict[str, Any]:
        """Generate a comprehensive summary of the SMA workflow results"""
        try:
            # Prepare summary data
            total_items = workflow_results["total_items"]
            agents_used = workflow_results["agents_used"]

            # Count items by category
            categories = {}
            for agent_name, results in workflow_results["results"].items():
                for item in results:
                    category = item.get("category", "unknown")
                    categories[category] = categories.get(category, 0) + 1

            # Create summary prompt for Gemini
            summary_prompt = f"""
Créez un résumé exécutif de cette recherche SMA ENIAD:

Requête: "{query}"
Agents utilisés: {', '.join(agents_used)}
Total d'éléments trouvés: {total_items}
Catégories: {categories}

Analysez les résultats et fournissez:
1. main_findings (3 découvertes principales)
2. relevance_score (0-1, pertinence globale)
3. actionable_items (actions recommandées pour les étudiants)
4. data_quality (1-5, qualité des données trouvées)
5. coverage (domaines couverts: formation, actualités, etc.)

JSON uniquement:
"""

            summary_analysis = await self.call_gemini_api(summary_prompt)
            summary_data = self.parse_gemini_response(summary_analysis)

            return {
                "ai_summary": summary_data,
                "statistics": {
                    "total_items": total_items,
                    "agents_used": len(agents_used),
                    "categories": categories,
                    "execution_time": datetime.now().isoformat()
                },
                "recommendations": summary_data.get("actionable_items", []),
                "quality_score": summary_data.get("data_quality", 3)
            }

        except Exception as e:
            logger.error(f"❌ Summary generation error: {str(e)}")
            return {
                "statistics": {
                    "total_items": workflow_results["total_items"],
                    "agents_used": len(workflow_results["agents_used"])
                },
                "error": str(e)
            }

    async def get_agent_status(self) -> Dict[str, Any]:
        """Get status of all SMA agents"""
        return {
            "service": "Enhanced SMA Agent",
            "status": "active",
            "available_agents": list(self.agents.keys()),
            "gemini_integration": True,
            "web_scraper_ready": True,
            "target_sites": len(self.web_scraper.eniad_urls),
            "last_update": datetime.now().isoformat()
        }

# Example usage
if __name__ == "__main__":
    async def test_sma():
        sma = EnhancedSMAAgent()

        # Test complete workflow
        results = await sma.execute_sma_workflow(
            "formations intelligence artificielle ENIAD",
            agents_to_use=["web_scraper", "content_analyzer", "news_monitor"]
        )

        print(f"SMA Workflow Results:")
        print(f"Total items: {results['total_items']}")
        print(f"Agents used: {', '.join(results['agents_used'])}")

        for agent_name, agent_results in results["results"].items():
            print(f"\n{agent_name}: {len(agent_results)} items")
            for item in agent_results[:2]:  # Show first 2 items
                print(f"  - {item.get('title', 'No title')}")

    # Run test
    asyncio.run(test_sma())
