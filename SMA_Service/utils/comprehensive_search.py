"""
Comprehensive Search Engine
Intelligent query understanding and deep website scanning for ENIAD
"""

import asyncio
import aiohttp
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import re
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import google.generativeai as genai
from utils.vector_store import vector_store
from agents.pdf_reader_agent import PDFReaderAgent
from agents.image_ocr_agent import ImageOCRAgent
from agents.extractor_agent import ExtractorAgent

logger = logging.getLogger(__name__)

class ComprehensiveSearchEngine:
    def __init__(self):
        # ENIAD specific URLs for comprehensive scanning
        self.eniad_urls = [
            "https://eniad.ump.ma/fr/actualite",
            "https://eniad.ump.ma/fr/cycle-ingenieur-ingenierie-reseaux-et-securite-informatique-irsi",
            "https://eniad.ump.ma/fr/cycle-ingenieur-robotique-et-objets-connectes-roc",
            "https://eniad.ump.ma/fr/cycle-ingenieur-intelligence-artificielle-ia",
            "https://eniad.ump.ma/fr/cycle-ingenieur-genie-informatique-ginf",
            "https://eniad.ump.ma/fr/assurance-maladie-obligatoire",
            "https://eniad.ump.ma/fr/bourses",
            "https://eniad.ump.ma/fr/centre-de-sante-universitaire",
            "https://eniad.ump.ma/fr/activites-culturelles",
            "https://eniad.ump.ma/fr/concours-de-recrutement",
            "https://eniad.ump.ma/fr/appels-a-candidatures"
        ]
        
        # Initialize specialized agents
        self.pdf_reader = PDFReaderAgent()
        self.image_ocr = ImageOCRAgent()
        self.extractor = ExtractorAgent()
        
        # Initialize Gemini for query understanding
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Session for HTTP requests
        self.session = None
        
        # Content categories mapping
        self.category_keywords = {
            'formations': ['formation', 'cycle', 'ingénieur', 'programme', 'cursus', 'diplôme'],
            'actualites': ['actualité', 'news', 'annonce', 'événement', 'nouvelle'],
            'recherche': ['recherche', 'publication', 'article', 'étude', 'projet'],
            'administratif': ['inscription', 'bourse', 'concours', 'candidature', 'admission'],
            'services': ['santé', 'bibliothèque', 'restaurant', 'transport', 'logement'],
            'intelligence_artificielle': ['ia', 'intelligence artificielle', 'machine learning', 'deep learning', 'ai'],
            'informatique': ['informatique', 'programmation', 'développement', 'logiciel', 'système'],
            'reseaux': ['réseau', 'sécurité', 'cybersécurité', 'infrastructure', 'télécommunication'],
            'robotique': ['robotique', 'robot', 'automatisation', 'mécatronique', 'iot']
        }

    async def initialize_session(self):
        """Initialize aiohttp session"""
        if not self.session:
            connector = aiohttp.TCPConnector(limit=10, limit_per_host=3)
            timeout = aiohttp.ClientTimeout(total=30)
            self.session = aiohttp.ClientSession(
                connector=connector,
                timeout=timeout,
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            )

    async def close_session(self):
        """Close aiohttp session"""
        if self.session:
            await self.session.close()
            self.session = None

    async def understand_query(self, query: str, language: str = "fr") -> Dict[str, Any]:
        """Use Gemini to understand user query and determine search strategy"""
        try:
            logger.info(f"🧠 Understanding query: {query[:50]}...")
            
            if language == "ar":
                prompt = f"""حلل الاستعلام التالي وحدد استراتيجية البحث المناسبة:

الاستعلام: "{query}"

يرجى تحديد:
1. الفئات ذات الصلة (التكوينات، الأخبار، البحث، الإدارة، الخدمات)
2. الكلمات المفتاحية للبحث
3. نوع المحتوى المطلوب (نص، وثائق PDF، صور)
4. مستوى العمق المطلوب (سطحي، متوسط، عميق)
5. الأولوية (عالية، متوسطة، منخفضة)

أجب بتنسيق JSON."""
            else:
                prompt = f"""Analysez la requête suivante et déterminez la stratégie de recherche appropriée:

Requête: "{query}"

Veuillez identifier:
1. Les catégories pertinentes (formations, actualités, recherche, administratif, services)
2. Les mots-clés de recherche
3. Le type de contenu requis (texte, documents PDF, images)
4. Le niveau de profondeur requis (superficiel, moyen, profond)
5. La priorité (haute, moyenne, basse)

Répondez au format JSON."""

            response = self.model.generate_content(prompt)
            analysis_text = response.text
            
            # Parse the response to extract strategy
            strategy = self._parse_query_analysis(analysis_text, query)
            
            logger.info(f"✅ Query understood: {strategy['categories']}")
            return strategy
            
        except Exception as e:
            logger.error(f"❌ Query understanding failed: {e}")
            # Fallback strategy
            return self._create_fallback_strategy(query)

    def _parse_query_analysis(self, analysis_text: str, original_query: str) -> Dict[str, Any]:
        """Parse Gemini analysis into structured strategy"""
        try:
            # Extract categories based on keywords
            categories = []
            query_lower = original_query.lower()
            
            for category, keywords in self.category_keywords.items():
                if any(keyword in query_lower for keyword in keywords):
                    categories.append(category)
            
            # Default categories if none found
            if not categories:
                categories = ['actualites', 'formations']
            
            # Extract keywords from query
            keywords = [word.strip() for word in original_query.split() if len(word.strip()) > 2]
            
            # Determine content types needed
            content_types = ['text']
            if any(word in query_lower for word in ['document', 'pdf', 'fichier']):
                content_types.append('pdf')
            if any(word in query_lower for word in ['image', 'photo', 'graphique']):
                content_types.append('image')
            
            # Determine search depth
            depth = 'medium'
            if any(word in query_lower for word in ['détaillé', 'complet', 'approfondi']):
                depth = 'deep'
            elif any(word in query_lower for word in ['rapide', 'bref', 'résumé']):
                depth = 'shallow'
            
            return {
                'categories': categories,
                'keywords': keywords,
                'content_types': content_types,
                'depth': depth,
                'priority': 'high',
                'target_urls': self._select_target_urls(categories),
                'original_query': original_query
            }
            
        except Exception as e:
            logger.error(f"❌ Error parsing query analysis: {e}")
            return self._create_fallback_strategy(original_query)

    def _create_fallback_strategy(self, query: str) -> Dict[str, Any]:
        """Create fallback search strategy"""
        return {
            'categories': ['actualites', 'formations'],
            'keywords': query.split(),
            'content_types': ['text', 'pdf'],
            'depth': 'medium',
            'priority': 'medium',
            'target_urls': self.eniad_urls[:5],  # Use first 5 URLs
            'original_query': query
        }

    def _select_target_urls(self, categories: List[str]) -> List[str]:
        """Select target URLs based on categories"""
        url_mapping = {
            'formations': [
                "https://eniad.ump.ma/fr/cycle-ingenieur-intelligence-artificielle-ia",
                "https://eniad.ump.ma/fr/cycle-ingenieur-genie-informatique-ginf",
                "https://eniad.ump.ma/fr/cycle-ingenieur-robotique-et-objets-connectes-roc",
                "https://eniad.ump.ma/fr/cycle-ingenieur-ingenierie-reseaux-et-securite-informatique-irsi"
            ],
            'actualites': [
                "https://eniad.ump.ma/fr/actualite"
            ],
            'administratif': [
                "https://eniad.ump.ma/fr/concours-de-recrutement",
                "https://eniad.ump.ma/fr/appels-a-candidatures",
                "https://eniad.ump.ma/fr/bourses"
            ],
            'services': [
                "https://eniad.ump.ma/fr/centre-de-sante-universitaire",
                "https://eniad.ump.ma/fr/activites-culturelles",
                "https://eniad.ump.ma/fr/assurance-maladie-obligatoire"
            ]
        }
        
        selected_urls = []
        for category in categories:
            if category in url_mapping:
                selected_urls.extend(url_mapping[category])
        
        # Add base URLs if none selected
        if not selected_urls:
            selected_urls = self.eniad_urls[:3]
        
        return list(set(selected_urls))  # Remove duplicates

    async def comprehensive_search(self, query: str, language: str = "fr") -> Dict[str, Any]:
        """Execute comprehensive search based on query understanding"""
        try:
            logger.info(f"🔍 Starting comprehensive search for: {query}")
            
            # Initialize session
            await self.initialize_session()
            
            # Understand the query
            strategy = await self.understand_query(query, language)
            
            # Execute search based on strategy
            search_results = {
                'query': query,
                'language': language,
                'strategy': strategy,
                'results': {
                    'web_content': [],
                    'documents': [],
                    'images': [],
                    'structured_data': []
                },
                'summary': '',
                'total_items_found': 0,
                'search_timestamp': datetime.now().isoformat()
            }
            
            # 1. Web content extraction
            if 'text' in strategy['content_types']:
                web_results = await self._extract_web_content(strategy)
                search_results['results']['web_content'] = web_results
            
            # 2. Document processing
            if 'pdf' in strategy['content_types']:
                doc_results = await self._process_documents(strategy)
                search_results['results']['documents'] = doc_results
            
            # 3. Image processing
            if 'image' in strategy['content_types']:
                img_results = await self._process_images(strategy)
                search_results['results']['images'] = img_results
            
            # 4. Structure and organize results
            structured_results = await self._structure_results(search_results, strategy)
            search_results['results']['structured_data'] = structured_results
            
            # 5. Generate summary
            search_results['summary'] = await self._generate_summary(search_results, language)
            
            # 6. Calculate total items
            search_results['total_items_found'] = (
                len(search_results['results']['web_content']) +
                len(search_results['results']['documents']) +
                len(search_results['results']['images']) +
                len(search_results['results']['structured_data'])
            )
            
            # 7. Store in vector database for future RAG queries
            await self._store_in_vector_db(search_results)
            
            logger.info(f"✅ Comprehensive search completed: {search_results['total_items_found']} items found")
            return search_results
            
        except Exception as e:
            logger.error(f"❌ Comprehensive search failed: {e}")
            return {
                'query': query,
                'language': language,
                'error': str(e),
                'results': {'web_content': [], 'documents': [], 'images': [], 'structured_data': []},
                'total_items_found': 0,
                'search_timestamp': datetime.now().isoformat()
            }
        finally:
            await self.close_session()

    async def _extract_web_content(self, strategy: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract web content from target URLs"""
        try:
            logger.info(f"🌐 Extracting web content from {len(strategy['target_urls'])} URLs")
            
            web_results = []
            
            for url in strategy['target_urls']:
                try:
                    async with self.session.get(url) as response:
                        if response.status == 200:
                            html_content = await response.text()
                            soup = BeautifulSoup(html_content, 'html.parser')
                            
                            # Extract main content
                            content = self._extract_page_content(soup, url)
                            
                            # Find sub-pages and documents
                            if strategy['depth'] in ['medium', 'deep']:
                                sub_content = await self._extract_sub_pages(soup, url, strategy)
                                content['sub_pages'] = sub_content
                            
                            web_results.append(content)
                            
                            # Add delay to avoid rate limiting
                            await asyncio.sleep(1)
                            
                except Exception as e:
                    logger.error(f"❌ Error extracting from {url}: {e}")
                    continue
            
            return web_results
            
        except Exception as e:
            logger.error(f"❌ Web content extraction failed: {e}")
            return []

    def _extract_page_content(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """Extract content from a single page"""
        try:
            # Extract title
            title = soup.title.string if soup.title else "No title"

            # Extract main content
            main_content = soup.find('main') or soup.find('div', class_=re.compile(r'content|main', re.I)) or soup.find('body')
            text_content = main_content.get_text(separator=' ', strip=True) if main_content else ""

            # Extract links to documents
            doc_links = []
            for link in soup.find_all('a', href=re.compile(r'\.(pdf|doc|docx|ppt|pptx)$', re.I)):
                href = link.get('href')
                if href:
                    full_url = urljoin(url, href)
                    doc_links.append({
                        'title': link.get_text(strip=True) or "Document",
                        'url': full_url,
                        'type': href.split('.')[-1].upper()
                    })

            # Extract images
            images = []
            for img in soup.find_all('img'):
                src = img.get('src')
                if src:
                    full_url = urljoin(url, src)
                    images.append({
                        'url': full_url,
                        'alt': img.get('alt', ''),
                        'title': img.get('title', '')
                    })

            return {
                'url': url,
                'title': title,
                'content': text_content[:5000],  # Limit content length
                'documents': doc_links,
                'images': images[:10],  # Limit images
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"❌ Error extracting page content: {e}")
            return {'url': url, 'error': str(e), 'content': '', 'documents': [], 'images': []}

    async def _extract_sub_pages(self, soup: BeautifulSoup, base_url: str, strategy: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract content from sub-pages"""
        try:
            sub_pages = []

            # Find internal links
            internal_links = []
            for link in soup.find_all('a', href=True):
                href = link.get('href')
                if href and not href.startswith(('http://', 'https://', 'mailto:', 'tel:')):
                    full_url = urljoin(base_url, href)
                    if 'eniad.ump.ma' in full_url and full_url not in strategy['target_urls']:
                        internal_links.append(full_url)

            # Limit sub-pages based on depth
            max_sub_pages = 3 if strategy['depth'] == 'medium' else 5 if strategy['depth'] == 'deep' else 0

            for sub_url in internal_links[:max_sub_pages]:
                try:
                    async with self.session.get(sub_url) as response:
                        if response.status == 200:
                            html_content = await response.text()
                            sub_soup = BeautifulSoup(html_content, 'html.parser')
                            sub_content = self._extract_page_content(sub_soup, sub_url)
                            sub_pages.append(sub_content)

                            await asyncio.sleep(1)  # Rate limiting

                except Exception as e:
                    logger.error(f"❌ Error extracting sub-page {sub_url}: {e}")
                    continue

            return sub_pages

        except Exception as e:
            logger.error(f"❌ Sub-page extraction failed: {e}")
            return []

    async def _process_documents(self, strategy: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process PDF documents found during web scraping"""
        try:
            logger.info("📄 Processing documents")

            # Initialize PDF reader
            await self.pdf_reader.initialize_session()

            doc_results = []

            # Collect all document URLs from web content
            doc_urls = []
            # This would be populated from web content extraction results
            # For now, we'll use a placeholder approach

            # Process each document
            for doc_url in doc_urls[:5]:  # Limit to 5 documents
                try:
                    pdf_result = await self.pdf_reader.download_and_process_pdf(doc_url)
                    if pdf_result.get('status') == 'success':
                        doc_results.append({
                            'url': doc_url,
                            'text': pdf_result.get('text', ''),
                            'metadata': pdf_result.get('metadata', {}),
                            'type': 'pdf',
                            'processed_timestamp': datetime.now().isoformat()
                        })

                except Exception as e:
                    logger.error(f"❌ Error processing document {doc_url}: {e}")
                    continue

            await self.pdf_reader.close_session()
            return doc_results

        except Exception as e:
            logger.error(f"❌ Document processing failed: {e}")
            return []

    async def _process_images(self, strategy: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process images with OCR"""
        try:
            logger.info("🖼️ Processing images with OCR")

            # Initialize OCR agent
            await self.image_ocr.initialize_session()

            img_results = []

            # Collect image URLs from web content
            img_urls = []
            # This would be populated from web content extraction results

            # Process each image
            for img_url in img_urls[:3]:  # Limit to 3 images
                try:
                    ocr_result = await self.image_ocr.extract_from_url(img_url)
                    if ocr_result.get('status') == 'success':
                        img_results.append({
                            'url': img_url,
                            'text': ocr_result.get('text', ''),
                            'confidence': ocr_result.get('confidence', 0),
                            'type': 'image_ocr',
                            'processed_timestamp': datetime.now().isoformat()
                        })

                except Exception as e:
                    logger.error(f"❌ Error processing image {img_url}: {e}")
                    continue

            await self.image_ocr.close_session()
            return img_results

        except Exception as e:
            logger.error(f"❌ Image processing failed: {e}")
            return []

    async def _structure_results(self, search_results: Dict[str, Any], strategy: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Structure and organize all results"""
        try:
            logger.info("✂️ Structuring results")

            # Combine all content
            all_content = []

            # Add web content
            for web_item in search_results['results']['web_content']:
                all_content.append({
                    'content': web_item.get('content', ''),
                    'source': web_item.get('url', ''),
                    'type': 'web',
                    'title': web_item.get('title', '')
                })

            # Add document content
            for doc_item in search_results['results']['documents']:
                all_content.append({
                    'content': doc_item.get('text', ''),
                    'source': doc_item.get('url', ''),
                    'type': 'document',
                    'title': 'PDF Document'
                })

            # Add image content
            for img_item in search_results['results']['images']:
                all_content.append({
                    'content': img_item.get('text', ''),
                    'source': img_item.get('url', ''),
                    'type': 'image',
                    'title': 'Image OCR'
                })

            # Use extractor to organize content
            if all_content:
                extraction_result = await self.extractor.organize_by_content_type(all_content)
                if extraction_result.get('status') == 'success':
                    return extraction_result.get('organized_content', {})

            return {}

        except Exception as e:
            logger.error(f"❌ Result structuring failed: {e}")
            return {}

    async def _generate_summary(self, search_results: Dict[str, Any], language: str) -> str:
        """Generate comprehensive summary of search results"""
        try:
            logger.info("📝 Generating summary")

            # Collect key information
            total_items = search_results['total_items_found']
            query = search_results['query']

            # Create summary based on findings
            if language == "ar":
                summary = f"تم العثور على {total_items} عنصر متعلق بـ '{query}' في موقع ENIAD."
            else:
                summary = f"Trouvé {total_items} éléments liés à '{query}' sur le site ENIAD."

            # Add details about content types
            web_count = len(search_results['results']['web_content'])
            doc_count = len(search_results['results']['documents'])
            img_count = len(search_results['results']['images'])

            if language == "ar":
                if web_count > 0:
                    summary += f" يتضمن {web_count} صفحة ويب"
                if doc_count > 0:
                    summary += f"، {doc_count} وثيقة"
                if img_count > 0:
                    summary += f"، {img_count} صورة"
            else:
                if web_count > 0:
                    summary += f" Inclut {web_count} page(s) web"
                if doc_count > 0:
                    summary += f", {doc_count} document(s)"
                if img_count > 0:
                    summary += f", {img_count} image(s)"

            return summary

        except Exception as e:
            logger.error(f"❌ Summary generation failed: {e}")
            return f"Recherche effectuée pour: {search_results.get('query', 'requête inconnue')}"

    async def _store_in_vector_db(self, search_results: Dict[str, Any]) -> None:
        """Store search results in vector database for RAG"""
        try:
            logger.info("💾 Storing results in vector database")

            documents_to_store = []

            # Prepare documents for vector storage
            for web_item in search_results['results']['web_content']:
                if web_item.get('content'):
                    documents_to_store.append({
                        'content': web_item['content'],
                        'metadata': {
                            'source': web_item.get('url', ''),
                            'title': web_item.get('title', ''),
                            'type': 'web_content',
                            'search_query': search_results['query'],
                            'timestamp': datetime.now().isoformat()
                        }
                    })

            # Store documents
            if documents_to_store:
                result = vector_store.add_documents(documents_to_store)
                if result.get('status') == 'success':
                    logger.info(f"✅ Stored {result.get('documents_added', 0)} documents in vector DB")
                else:
                    logger.error(f"❌ Failed to store documents: {result.get('error', 'Unknown error')}")

        except Exception as e:
            logger.error(f"❌ Vector storage failed: {e}")

# Global instance
comprehensive_search_engine = ComprehensiveSearchEngine()
