#!/usr/bin/env python3
"""
Enhanced ENIAD SMA System Demo
Demonstrates the comprehensive search and intelligent query capabilities
"""

import asyncio
import aiohttp
import json
from datetime import datetime

class ENIADSMADemo:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.session = None

    async def initialize(self):
        """Initialize HTTP session"""
        self.session = aiohttp.ClientSession()

    async def close(self):
        """Close HTTP session"""
        if self.session:
            await self.session.close()

    async def make_request(self, endpoint, method='GET', data=None):
        """Make HTTP request"""
        try:
            url = f"{self.base_url}{endpoint}"
            
            if method == 'GET':
                async with self.session.get(url) as response:
                    return await response.json()
            elif method == 'POST':
                async with self.session.post(url, json=data) as response:
                    return await response.json()
                    
        except Exception as e:
            return {'error': str(e)}

    async def demo_intelligent_query(self):
        """Demonstrate intelligent query system"""
        print("\n" + "="*60)
        print("🧠 INTELLIGENT QUERY DEMONSTRATION")
        print("="*60)
        
        # Example queries that showcase the system's understanding
        demo_queries = [
            {
                'query': "Quelles sont les formations en intelligence artificielle disponibles à ENIAD?",
                'language': 'fr',
                'description': "Question about AI programs at ENIAD"
            },
            {
                'query': "Comment s'inscrire aux concours de recrutement?",
                'language': 'fr',
                'description': "Question about recruitment process"
            },
            {
                'query': "ما هي آخر أخبار المدرسة؟",
                'language': 'ar',
                'description': "Question about latest school news in Arabic"
            }
        ]
        
        for i, demo in enumerate(demo_queries, 1):
            print(f"\n📝 Demo Query {i}: {demo['description']}")
            print(f"Query: {demo['query']}")
            print(f"Language: {demo['language']}")
            
            data = {
                'query': demo['query'],
                'language': demo['language'],
                'search_depth': 'medium',
                'include_documents': True,
                'include_images': True,
                'include_news': True,
                'max_results': 20,
                'store_in_knowledge_base': True
            }
            
            print("🔄 Processing...")
            result = await self.make_request('/sma/intelligent-query', 'POST', data)
            
            if 'error' not in result:
                print(f"✅ Success!")
                print(f"   Confidence: {result.get('confidence', 0) * 100:.1f}%")
                print(f"   Sources found: {len(result.get('sources', []))}")
                print(f"   Processing steps: {' → '.join(result.get('processing_steps', []))}")
                print(f"   Answer preview: {result.get('final_answer', '')[:100]}...")
            else:
                print(f"❌ Error: {result['error']}")
            
            await asyncio.sleep(2)  # Rate limiting

    async def demo_comprehensive_search(self):
        """Demonstrate comprehensive search"""
        print("\n" + "="*60)
        print("🔍 COMPREHENSIVE SEARCH DEMONSTRATION")
        print("="*60)
        
        search_query = "robotique et objets connectés ENIAD"
        print(f"🔍 Searching for: {search_query}")
        print("📊 This will scan all ENIAD website components, PDFs, and images...")
        
        data = {
            'query': search_query,
            'language': 'fr',
            'search_depth': 'deep',
            'include_documents': True,
            'include_images': True,
            'include_news': True,
            'max_results': 50,
            'store_in_knowledge_base': True
        }
        
        print("🔄 Processing comprehensive search...")
        result = await self.make_request('/sma/comprehensive-search', 'POST', data)
        
        if 'error' not in result:
            print(f"✅ Comprehensive search completed!")
            print(f"   Total items found: {result.get('total_items_found', 0)}")
            print(f"   Web content: {len(result.get('results', {}).get('web_content', []))}")
            print(f"   Documents: {len(result.get('results', {}).get('documents', []))}")
            print(f"   Images: {len(result.get('results', {}).get('images', []))}")
            print(f"   Summary: {result.get('summary', '')}")
        else:
            print(f"❌ Error: {result['error']}")

    async def demo_news_search(self):
        """Demonstrate news search"""
        print("\n" + "="*60)
        print("📰 NEWS SEARCH DEMONSTRATION")
        print("="*60)
        
        news_queries = [
            "ENIAD actualités",
            "intelligence artificielle Maroc",
            "université technologie Oujda"
        ]
        
        for query in news_queries:
            print(f"\n📰 Searching news for: {query}")
            
            data = {
                'query': query,
                'language': 'fr',
                'time_range': 'w',
                'max_results': 5,
                'region': 'ma',
                'search_type': 'eniad'
            }
            
            print("🔄 Processing...")
            result = await self.make_request('/sma/news-search', 'POST', data)
            
            if 'error' not in result:
                print(f"✅ Found {result.get('total_results', 0)} news articles")
                
                for i, article in enumerate(result.get('results', [])[:3], 1):
                    print(f"   {i}. {article.get('title', 'No title')}")
                    print(f"      Source: {article.get('source', 'Unknown')}")
                    print(f"      Relevance: {article.get('relevance_score', 0) * 100:.1f}%")
            else:
                print(f"❌ Error: {result['error']}")
            
            await asyncio.sleep(1)

    async def demo_system_capabilities(self):
        """Demonstrate system capabilities"""
        print("\n" + "="*60)
        print("🤖 SYSTEM CAPABILITIES DEMONSTRATION")
        print("="*60)
        
        # Check system health
        print("🏥 Checking system health...")
        health = await self.make_request('/health')
        print(f"   System Status: {health.get('status', 'unknown')}")
        
        # Check SMA status
        print("🤖 Checking SMA status...")
        sma_status = await self.make_request('/sma/status')
        print(f"   SMA Status: {sma_status.get('status', 'unknown')}")
        
        # Check RAG capabilities
        print("🧠 Checking RAG capabilities...")
        rag_stats = await self.make_request('/rag/stats')
        if 'stats' in rag_stats:
            stats = rag_stats['stats']
            print(f"   Knowledge Base: {stats.get('total_documents', 0)} documents")
            print(f"   Categories: {len(stats.get('categories', {}))}")
            print(f"   Languages: {len(stats.get('languages', {}))}")

    async def run_full_demo(self):
        """Run complete demonstration"""
        print("🚀 ENIAD Enhanced Multi-Agent System Demo")
        print("=" * 60)
        print("This demo showcases the comprehensive search and intelligent query capabilities")
        print("of the enhanced ENIAD SMA system.")
        print("\nFeatures demonstrated:")
        print("• 🧠 Intelligent query understanding")
        print("• 🔍 Comprehensive website scanning")
        print("• 📄 PDF document processing")
        print("• 🖼️ Image OCR processing")
        print("• 📰 Real-time news search")
        print("• 🤖 RAG-powered question answering")
        print("• 💾 Knowledge base management")
        
        await self.initialize()
        
        try:
            # Demo 1: System Capabilities
            await self.demo_system_capabilities()
            
            # Demo 2: Intelligent Queries
            await self.demo_intelligent_query()
            
            # Demo 3: Comprehensive Search
            await self.demo_comprehensive_search()
            
            # Demo 4: News Search
            await self.demo_news_search()
            
            print("\n" + "="*60)
            print("🎉 DEMO COMPLETED SUCCESSFULLY!")
            print("="*60)
            print("The enhanced ENIAD SMA system has demonstrated:")
            print("✅ Intelligent query understanding in multiple languages")
            print("✅ Comprehensive website content extraction")
            print("✅ Document and image processing capabilities")
            print("✅ Real-time news search integration")
            print("✅ Knowledge base storage and retrieval")
            print("\n🌐 Access the test interfaces:")
            print("   • SMA Test: file:///path/to/SMA_Service/test_sma.html")
            print("   • RAG Test: file:///path/to/SMA_Service/test_rag.html")
            print("\n📚 API Documentation: http://localhost:8001/docs")
            
        except Exception as e:
            print(f"\n❌ Demo failed: {e}")
        
        finally:
            await self.close()

async def main():
    """Main demo function"""
    demo = ENIADSMADemo()
    await demo.run_full_demo()

if __name__ == "__main__":
    print("Starting ENIAD Enhanced SMA System Demo...")
    print("Make sure the SMA service is running on http://localhost:8001")
    print("Press Ctrl+C to stop the demo at any time.\n")
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n👋 Demo stopped by user. Thank you!")
    except Exception as e:
        print(f"\n❌ Demo error: {e}")
        print("Please ensure the SMA service is running and try again.")
