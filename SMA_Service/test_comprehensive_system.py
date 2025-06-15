#!/usr/bin/env python3
"""
Comprehensive System Test for Enhanced ENIAD SMA Service
Tests all new features including intelligent query understanding and comprehensive search
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ComprehensiveSystemTester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.session = None
        
        # Test queries in different languages
        self.test_queries = {
            'fr': [
                "Quelles sont les formations en intelligence artificielle disponibles à ENIAD?",
                "Comment s'inscrire aux concours de recrutement?",
                "Quelles sont les dernières actualités de l'école?",
                "Informations sur les bourses d'études",
                "Programmes de robotique et objets connectés"
            ],
            'ar': [
                "ما هي التكوينات المتاحة في الذكاء الاصطناعي في ENIAD؟",
                "كيفية التسجيل في مسابقات التوظيف؟",
                "ما هي آخر أخبار المدرسة؟"
            ],
            'en': [
                "What AI programs are available at ENIAD?",
                "How to apply for engineering programs?",
                "Latest news and announcements"
            ]
        }

    async def initialize_session(self):
        """Initialize HTTP session"""
        connector = aiohttp.TCPConnector(limit=10)
        timeout = aiohttp.ClientTimeout(total=60)
        self.session = aiohttp.ClientSession(
            connector=connector,
            timeout=timeout
        )

    async def close_session(self):
        """Close HTTP session"""
        if self.session:
            await self.session.close()

    async def make_request(self, endpoint, method='GET', data=None):
        """Make HTTP request to SMA service"""
        try:
            url = f"{self.base_url}{endpoint}"
            
            if method == 'GET':
                async with self.session.get(url) as response:
                    return await response.json()
            elif method == 'POST':
                async with self.session.post(url, json=data) as response:
                    return await response.json()
                    
        except Exception as e:
            logger.error(f"❌ Request failed for {endpoint}: {e}")
            return {'error': str(e)}

    async def test_system_health(self):
        """Test system health and agent status"""
        logger.info("🏥 Testing system health...")
        
        # Test health endpoint
        health_result = await self.make_request('/health')
        logger.info(f"Health Status: {health_result.get('status', 'unknown')}")
        
        # Test SMA status
        sma_status = await self.make_request('/sma/status')
        logger.info(f"SMA Status: {sma_status.get('status', 'unknown')}")
        
        return {
            'health': health_result,
            'sma_status': sma_status
        }

    async def test_intelligent_query(self, query, language='fr'):
        """Test intelligent query system"""
        logger.info(f"🧠 Testing intelligent query: {query[:50]}...")
        
        data = {
            'query': query,
            'language': language,
            'search_depth': 'medium',
            'include_documents': True,
            'include_images': True,
            'include_news': True,
            'max_results': 20,
            'store_in_knowledge_base': True
        }
        
        start_time = time.time()
        result = await self.make_request('/sma/intelligent-query', 'POST', data)
        end_time = time.time()
        
        processing_time = end_time - start_time
        
        logger.info(f"✅ Intelligent query completed in {processing_time:.2f}s")
        logger.info(f"   Confidence: {result.get('confidence', 0) * 100:.1f}%")
        logger.info(f"   Sources found: {len(result.get('sources', []))}")
        logger.info(f"   Processing steps: {result.get('processing_steps', [])}")
        
        return {
            'query': query,
            'language': language,
            'result': result,
            'processing_time': processing_time
        }

    async def test_comprehensive_search(self, query, language='fr'):
        """Test comprehensive search functionality"""
        logger.info(f"🔍 Testing comprehensive search: {query[:50]}...")
        
        data = {
            'query': query,
            'language': language,
            'search_depth': 'deep',
            'include_documents': True,
            'include_images': True,
            'include_news': True,
            'max_results': 50,
            'store_in_knowledge_base': True
        }
        
        start_time = time.time()
        result = await self.make_request('/sma/comprehensive-search', 'POST', data)
        end_time = time.time()
        
        processing_time = end_time - start_time
        
        logger.info(f"✅ Comprehensive search completed in {processing_time:.2f}s")
        logger.info(f"   Total items found: {result.get('total_items_found', 0)}")
        logger.info(f"   Web content: {len(result.get('results', {}).get('web_content', []))}")
        logger.info(f"   Documents: {len(result.get('results', {}).get('documents', []))}")
        logger.info(f"   Images: {len(result.get('results', {}).get('images', []))}")
        
        return {
            'query': query,
            'language': language,
            'result': result,
            'processing_time': processing_time
        }

    async def test_news_search(self, query, language='fr'):
        """Test news search functionality"""
        logger.info(f"📰 Testing news search: {query[:50]}...")
        
        data = {
            'query': query,
            'language': language,
            'time_range': 'w',
            'max_results': 10,
            'region': 'ma',
            'search_type': 'eniad'
        }
        
        start_time = time.time()
        result = await self.make_request('/sma/news-search', 'POST', data)
        end_time = time.time()
        
        processing_time = end_time - start_time
        
        logger.info(f"✅ News search completed in {processing_time:.2f}s")
        logger.info(f"   News articles found: {result.get('total_results', 0)}")
        
        return {
            'query': query,
            'language': language,
            'result': result,
            'processing_time': processing_time
        }

    async def test_rag_integration(self):
        """Test RAG system integration"""
        logger.info("🤖 Testing RAG integration...")
        
        # Test RAG stats
        rag_stats = await self.make_request('/rag/stats')
        logger.info(f"RAG Knowledge Base: {rag_stats.get('stats', {}).get('total_documents', 0)} documents")
        
        # Test RAG query
        data = {
            'query': 'formations intelligence artificielle ENIAD',
            'language': 'fr',
            'max_docs': 5,
            'include_sources': True
        }
        
        rag_result = await self.make_request('/rag/query', 'POST', data)
        logger.info(f"RAG Query Status: {rag_result.get('status', 'unknown')}")
        
        return {
            'stats': rag_stats,
            'query_result': rag_result
        }

    async def run_comprehensive_test(self):
        """Run comprehensive test suite"""
        logger.info("🚀 Starting comprehensive system test...")
        
        await self.initialize_session()
        
        try:
            test_results = {
                'timestamp': datetime.now().isoformat(),
                'system_health': {},
                'intelligent_queries': [],
                'comprehensive_searches': [],
                'news_searches': [],
                'rag_integration': {},
                'summary': {}
            }
            
            # Test 1: System Health
            logger.info("\n" + "="*50)
            logger.info("TEST 1: SYSTEM HEALTH")
            logger.info("="*50)
            test_results['system_health'] = await self.test_system_health()
            
            # Test 2: Intelligent Queries
            logger.info("\n" + "="*50)
            logger.info("TEST 2: INTELLIGENT QUERIES")
            logger.info("="*50)
            
            for language, queries in self.test_queries.items():
                for query in queries[:2]:  # Test first 2 queries per language
                    result = await self.test_intelligent_query(query, language)
                    test_results['intelligent_queries'].append(result)
                    await asyncio.sleep(2)  # Rate limiting
            
            # Test 3: Comprehensive Searches
            logger.info("\n" + "="*50)
            logger.info("TEST 3: COMPREHENSIVE SEARCHES")
            logger.info("="*50)
            
            for query in self.test_queries['fr'][:2]:  # Test 2 comprehensive searches
                result = await self.test_comprehensive_search(query, 'fr')
                test_results['comprehensive_searches'].append(result)
                await asyncio.sleep(3)  # Rate limiting
            
            # Test 4: News Searches
            logger.info("\n" + "="*50)
            logger.info("TEST 4: NEWS SEARCHES")
            logger.info("="*50)
            
            for query in ['ENIAD actualités', 'intelligence artificielle Maroc']:
                result = await self.test_news_search(query, 'fr')
                test_results['news_searches'].append(result)
                await asyncio.sleep(2)  # Rate limiting
            
            # Test 5: RAG Integration
            logger.info("\n" + "="*50)
            logger.info("TEST 5: RAG INTEGRATION")
            logger.info("="*50)
            test_results['rag_integration'] = await self.test_rag_integration()
            
            # Generate Summary
            logger.info("\n" + "="*50)
            logger.info("TEST SUMMARY")
            logger.info("="*50)
            
            summary = self.generate_test_summary(test_results)
            test_results['summary'] = summary
            
            # Save results
            with open(f'test_results_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json', 'w') as f:
                json.dump(test_results, f, indent=2, ensure_ascii=False)
            
            logger.info("✅ Comprehensive test completed successfully!")
            return test_results
            
        except Exception as e:
            logger.error(f"❌ Comprehensive test failed: {e}")
            return {'error': str(e)}
        
        finally:
            await self.close_session()

    def generate_test_summary(self, test_results):
        """Generate test summary"""
        summary = {
            'total_tests': 0,
            'successful_tests': 0,
            'failed_tests': 0,
            'average_response_time': 0,
            'system_status': 'unknown',
            'recommendations': []
        }
        
        # Count tests
        summary['total_tests'] = (
            len(test_results['intelligent_queries']) +
            len(test_results['comprehensive_searches']) +
            len(test_results['news_searches']) + 2  # health + rag
        )
        
        # Calculate success rate
        successful = 0
        total_time = 0
        test_count = 0
        
        for test_group in ['intelligent_queries', 'comprehensive_searches', 'news_searches']:
            for test in test_results[test_group]:
                if test['result'].get('status') != 'error':
                    successful += 1
                total_time += test.get('processing_time', 0)
                test_count += 1
        
        summary['successful_tests'] = successful
        summary['failed_tests'] = summary['total_tests'] - successful
        summary['average_response_time'] = total_time / test_count if test_count > 0 else 0
        
        # System status
        health_status = test_results['system_health'].get('health', {}).get('status')
        sma_status = test_results['system_health'].get('sma_status', {}).get('status')
        
        if health_status == 'healthy' and sma_status == 'success':
            summary['system_status'] = 'healthy'
        else:
            summary['system_status'] = 'degraded'
        
        # Recommendations
        if summary['failed_tests'] > 0:
            summary['recommendations'].append('Some tests failed - check logs for details')
        
        if summary['average_response_time'] > 10:
            summary['recommendations'].append('Response times are high - consider optimization')
        
        if summary['system_status'] != 'healthy':
            summary['recommendations'].append('System health issues detected - check agent status')
        
        logger.info(f"📊 Test Summary:")
        logger.info(f"   Total Tests: {summary['total_tests']}")
        logger.info(f"   Successful: {summary['successful_tests']}")
        logger.info(f"   Failed: {summary['failed_tests']}")
        logger.info(f"   Success Rate: {(summary['successful_tests']/summary['total_tests']*100):.1f}%")
        logger.info(f"   Avg Response Time: {summary['average_response_time']:.2f}s")
        logger.info(f"   System Status: {summary['system_status']}")
        
        return summary

async def main():
    """Main test function"""
    tester = ComprehensiveSystemTester()
    results = await tester.run_comprehensive_test()
    
    if 'error' not in results:
        print("\n🎉 All tests completed! Check the generated JSON file for detailed results.")
    else:
        print(f"\n❌ Test suite failed: {results['error']}")

if __name__ == "__main__":
    asyncio.run(main())
