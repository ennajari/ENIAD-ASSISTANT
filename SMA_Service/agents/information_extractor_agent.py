"""
Information Extractor Agent
Specialized agent for extracting specific types of information
"""

from crewai import Agent
from langchain.tools import Tool
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class InformationExtractorAgent:
    def __init__(self):
        # Initialize the CrewAI agent
        self.agent = Agent(
            role='Information Extraction Specialist',
            goal='Extract and categorize specific types of information from web content',
            backstory="""You are an expert information extraction specialist. 
            You can identify and extract specific types of content like documents, 
            images, news articles, and events from web pages with high accuracy.""",
            verbose=True,
            allow_delegation=False,
            tools=self._create_tools()
        )

    def _create_tools(self) -> List[Tool]:
        """Create tools for the information extractor agent"""
        return [
            Tool(
                name="extract_documents",
                description="Extract document links and metadata",
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
                name="extract_events",
                description="Extract event information",
                func=self.extract_events
            ),
            Tool(
                name="categorize_content",
                description="Categorize extracted content",
                func=self.categorize_content
            )
        ]

    async def extract_documents(self, content: str, url: str) -> List[Dict[str, Any]]:
        """Extract document information from content"""
        try:
            # Placeholder implementation
            documents = []
            
            # In a real implementation, this would parse the content
            # and extract document links, titles, and metadata
            
            logger.info(f"📄 Extracted {len(documents)} documents from {url}")
            return documents
            
        except Exception as e:
            logger.error(f"❌ Error extracting documents: {e}")
            return []

    async def extract_images(self, content: str, url: str) -> List[Dict[str, Any]]:
        """Extract image information from content"""
        try:
            # Placeholder implementation
            images = []
            
            # In a real implementation, this would parse the content
            # and extract image URLs, alt text, and metadata
            
            logger.info(f"🖼️ Extracted {len(images)} images from {url}")
            return images
            
        except Exception as e:
            logger.error(f"❌ Error extracting images: {e}")
            return []

    async def extract_news(self, content: str, url: str) -> List[Dict[str, Any]]:
        """Extract news articles from content"""
        try:
            # Placeholder implementation
            news_items = []
            
            # In a real implementation, this would parse the content
            # and extract news articles, titles, dates, and summaries
            
            logger.info(f"📰 Extracted {len(news_items)} news items from {url}")
            return news_items
            
        except Exception as e:
            logger.error(f"❌ Error extracting news: {e}")
            return []

    async def extract_events(self, content: str, url: str) -> List[Dict[str, Any]]:
        """Extract event information from content"""
        try:
            # Placeholder implementation
            events = []
            
            # In a real implementation, this would parse the content
            # and extract event information, dates, locations, and descriptions
            
            logger.info(f"📅 Extracted {len(events)} events from {url}")
            return events
            
        except Exception as e:
            logger.error(f"❌ Error extracting events: {e}")
            return []

    async def categorize_content(self, content: str) -> str:
        """Categorize content type"""
        try:
            # Simple categorization logic
            content_lower = content.lower()
            
            if any(word in content_lower for word in ['news', 'actualité', 'annonce']):
                return 'news'
            elif any(word in content_lower for word in ['event', 'événement']):
                return 'event'
            elif any(word in content_lower for word in ['document', 'pdf', 'rapport']):
                return 'document'
            else:
                return 'general'
                
        except Exception as e:
            logger.error(f"❌ Error categorizing content: {e}")
            return 'unknown'

    async def get_status(self) -> Dict[str, Any]:
        """Get agent status"""
        return {
            "agent_name": "InformationExtractorAgent",
            "status": "active",
            "tools_available": len(self.agent.tools) if hasattr(self.agent, 'tools') else 5
        }
