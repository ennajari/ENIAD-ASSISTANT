"""
PDF Reader Agent
Specialized agent for extracting and processing text from PDF documents
Supports both local and remote PDF files
"""

from crewai import Agent
from langchain.tools import Tool
import PyPDF2
import pdfplumber
import requests
import io
import asyncio
import aiohttp
from typing import List, Dict, Any, Optional
import logging
from urllib.parse import urljoin, urlparse
import tempfile
import os

logger = logging.getLogger(__name__)

class PDFReaderAgent:
    def __init__(self):
        self.session = None
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/pdf,application/octet-stream,*/*'
        }
        
        # Initialize the CrewAI agent
        self.agent = Agent(
            role='PDF Document Specialist',
            goal='Extract comprehensive text content from PDF documents including academic papers, reports, and administrative documents',
            backstory="""You are an expert PDF processing specialist with deep knowledge of document structures. 
            You can extract text from various PDF formats, handle complex layouts, and preserve document structure 
            while making content searchable and analyzable.""",
            verbose=True,
            allow_delegation=False,
            tools=self._create_tools()
        )

    def _create_tools(self) -> List[Tool]:
        """Create tools for the PDF reader agent"""
        return [
            Tool(
                name="extract_pdf_text",
                description="Extract text content from PDF files",
                func=self.extract_pdf_text
            ),
            Tool(
                name="extract_pdf_metadata",
                description="Extract metadata from PDF documents",
                func=self.extract_pdf_metadata
            ),
            Tool(
                name="extract_pdf_structure",
                description="Extract structural information from PDFs",
                func=self.extract_pdf_structure
            ),
            Tool(
                name="download_and_process_pdf",
                description="Download and process remote PDF files",
                func=self.download_and_process_pdf
            ),
            Tool(
                name="batch_process_pdfs",
                description="Process multiple PDF files in batch",
                func=self.batch_process_pdfs
            )
        ]

    async def initialize_session(self):
        """Initialize aiohttp session for downloading PDFs"""
        if not self.session:
            connector = aiohttp.TCPConnector(limit=10, limit_per_host=5)
            timeout = aiohttp.ClientTimeout(total=60)  # Longer timeout for PDFs
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

    async def extract_pdf_text(self, pdf_source: str, method: str = "auto") -> Dict[str, Any]:
        """
        Extract text from PDF file
        pdf_source: file path or URL
        method: 'pypdf2', 'pdfplumber', or 'auto'
        """
        try:
            logger.info(f"📄 Extracting text from PDF: {pdf_source[:100]}...")
            
            # Determine if source is URL or file path
            if pdf_source.startswith(('http://', 'https://')):
                # Download PDF first
                pdf_data = await self._download_pdf(pdf_source)
                if not pdf_data:
                    return {
                        'status': 'error',
                        'error': 'Failed to download PDF',
                        'source': pdf_source
                    }
            else:
                # Read local file
                try:
                    with open(pdf_source, 'rb') as file:
                        pdf_data = file.read()
                except FileNotFoundError:
                    return {
                        'status': 'error',
                        'error': 'PDF file not found',
                        'source': pdf_source
                    }

            # Extract text using specified method
            if method == "auto":
                # Try pdfplumber first, fallback to PyPDF2
                text_content = await self._extract_with_pdfplumber(pdf_data)
                if not text_content or len(text_content.strip()) < 50:
                    text_content = await self._extract_with_pypdf2(pdf_data)
            elif method == "pdfplumber":
                text_content = await self._extract_with_pdfplumber(pdf_data)
            elif method == "pypdf2":
                text_content = await self._extract_with_pypdf2(pdf_data)
            else:
                return {
                    'status': 'error',
                    'error': f'Unknown extraction method: {method}',
                    'source': pdf_source
                }

            # Process and clean text
            cleaned_text = self._clean_extracted_text(text_content)
            
            result = {
                'status': 'success',
                'source': pdf_source,
                'text': cleaned_text,
                'text_length': len(cleaned_text),
                'word_count': len(cleaned_text.split()),
                'extraction_method': method,
                'timestamp': asyncio.get_event_loop().time()
            }
            
            logger.info(f"✅ PDF text extracted: {len(cleaned_text)} characters")
            return result

        except Exception as e:
            logger.error(f"❌ Error extracting PDF text: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'source': pdf_source
            }

    async def extract_pdf_metadata(self, pdf_source: str) -> Dict[str, Any]:
        """Extract metadata from PDF document"""
        try:
            logger.info(f"📋 Extracting PDF metadata: {pdf_source[:100]}...")
            
            # Get PDF data
            if pdf_source.startswith(('http://', 'https://')):
                pdf_data = await self._download_pdf(pdf_source)
            else:
                with open(pdf_source, 'rb') as file:
                    pdf_data = file.read()

            if not pdf_data:
                return {'status': 'error', 'error': 'Could not read PDF data'}

            # Extract metadata using PyPDF2
            pdf_stream = io.BytesIO(pdf_data)
            pdf_reader = PyPDF2.PdfReader(pdf_stream)
            
            metadata = {
                'status': 'success',
                'source': pdf_source,
                'page_count': len(pdf_reader.pages),
                'title': '',
                'author': '',
                'subject': '',
                'creator': '',
                'producer': '',
                'creation_date': '',
                'modification_date': '',
                'encrypted': pdf_reader.is_encrypted
            }
            
            # Extract document info if available
            if pdf_reader.metadata:
                info = pdf_reader.metadata
                metadata.update({
                    'title': str(info.get('/Title', '')),
                    'author': str(info.get('/Author', '')),
                    'subject': str(info.get('/Subject', '')),
                    'creator': str(info.get('/Creator', '')),
                    'producer': str(info.get('/Producer', '')),
                    'creation_date': str(info.get('/CreationDate', '')),
                    'modification_date': str(info.get('/ModDate', ''))
                })
            
            logger.info(f"✅ PDF metadata extracted: {metadata['page_count']} pages")
            return metadata

        except Exception as e:
            logger.error(f"❌ Error extracting PDF metadata: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'source': pdf_source
            }

    async def extract_pdf_structure(self, pdf_source: str) -> Dict[str, Any]:
        """Extract structural information from PDF"""
        try:
            logger.info(f"🏗️ Extracting PDF structure: {pdf_source[:100]}...")
            
            # Get PDF data
            if pdf_source.startswith(('http://', 'https://')):
                pdf_data = await self._download_pdf(pdf_source)
            else:
                with open(pdf_source, 'rb') as file:
                    pdf_data = file.read()

            if not pdf_data:
                return {'status': 'error', 'error': 'Could not read PDF data'}

            structure = {
                'status': 'success',
                'source': pdf_source,
                'pages': [],
                'total_pages': 0,
                'has_images': False,
                'has_tables': False,
                'text_blocks': []
            }

            # Use pdfplumber for detailed structure analysis
            with pdfplumber.open(io.BytesIO(pdf_data)) as pdf:
                structure['total_pages'] = len(pdf.pages)
                
                for page_num, page in enumerate(pdf.pages[:5]):  # Analyze first 5 pages
                    page_info = {
                        'page_number': page_num + 1,
                        'width': page.width,
                        'height': page.height,
                        'text_length': len(page.extract_text() or ''),
                        'images': len(page.images),
                        'tables': len(page.find_tables()),
                        'chars': len(page.chars)
                    }
                    
                    structure['pages'].append(page_info)
                    
                    if page_info['images'] > 0:
                        structure['has_images'] = True
                    if page_info['tables'] > 0:
                        structure['has_tables'] = True

            logger.info(f"✅ PDF structure extracted: {structure['total_pages']} pages")
            return structure

        except Exception as e:
            logger.error(f"❌ Error extracting PDF structure: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'source': pdf_source
            }

    async def download_and_process_pdf(self, pdf_url: str) -> Dict[str, Any]:
        """Download and process a remote PDF file"""
        try:
            logger.info(f"⬇️ Downloading and processing PDF: {pdf_url}")
            
            # Download PDF
            pdf_data = await self._download_pdf(pdf_url)
            if not pdf_data:
                return {
                    'status': 'error',
                    'error': 'Failed to download PDF',
                    'url': pdf_url
                }

            # Save to temporary file for processing
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                temp_file.write(pdf_data)
                temp_path = temp_file.name

            try:
                # Extract text and metadata
                text_result = await self.extract_pdf_text(temp_path)
                metadata_result = await self.extract_pdf_metadata(temp_path)
                structure_result = await self.extract_pdf_structure(temp_path)
                
                # Combine results
                result = {
                    'status': 'success',
                    'url': pdf_url,
                    'text': text_result.get('text', ''),
                    'metadata': metadata_result,
                    'structure': structure_result,
                    'file_size': len(pdf_data),
                    'processing_timestamp': asyncio.get_event_loop().time()
                }
                
                logger.info(f"✅ PDF downloaded and processed: {len(result['text'])} characters")
                return result

            finally:
                # Clean up temporary file
                if os.path.exists(temp_path):
                    os.unlink(temp_path)

        except Exception as e:
            logger.error(f"❌ Error downloading and processing PDF: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'url': pdf_url
            }

    async def batch_process_pdfs(self, pdf_sources: List[str]) -> List[Dict[str, Any]]:
        """Process multiple PDF files in batch"""
        try:
            logger.info(f"📚 Batch processing {len(pdf_sources)} PDFs")
            
            results = []
            for pdf_source in pdf_sources:
                try:
                    if pdf_source.startswith(('http://', 'https://')):
                        result = await self.download_and_process_pdf(pdf_source)
                    else:
                        text_result = await self.extract_pdf_text(pdf_source)
                        metadata_result = await self.extract_pdf_metadata(pdf_source)
                        
                        result = {
                            'status': 'success',
                            'source': pdf_source,
                            'text': text_result.get('text', ''),
                            'metadata': metadata_result
                        }
                    
                    results.append(result)
                    
                    # Add delay between processing
                    await asyncio.sleep(1)
                    
                except Exception as e:
                    logger.error(f"❌ Error processing PDF {pdf_source}: {e}")
                    results.append({
                        'status': 'error',
                        'source': pdf_source,
                        'error': str(e)
                    })

            logger.info(f"✅ Batch processing completed: {len(results)} PDFs processed")
            return results

        except Exception as e:
            logger.error(f"❌ Error in batch PDF processing: {e}")
            return []

    async def _download_pdf(self, url: str) -> Optional[bytes]:
        """Download PDF from URL"""
        try:
            await self.initialize_session()
            
            async with self.session.get(url) as response:
                if response.status == 200:
                    content_type = response.headers.get('content-type', '').lower()
                    if 'pdf' in content_type or url.lower().endswith('.pdf'):
                        return await response.read()
                    else:
                        logger.warning(f"⚠️ URL does not appear to be a PDF: {content_type}")
                        return None
                else:
                    logger.error(f"❌ Failed to download PDF: HTTP {response.status}")
                    return None

        except Exception as e:
            logger.error(f"❌ Error downloading PDF: {e}")
            return None

    async def _extract_with_pdfplumber(self, pdf_data: bytes) -> str:
        """Extract text using pdfplumber"""
        try:
            with pdfplumber.open(io.BytesIO(pdf_data)) as pdf:
                text_parts = []
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
                return '\n\n'.join(text_parts)
        except Exception as e:
            logger.error(f"❌ pdfplumber extraction failed: {e}")
            return ""

    async def _extract_with_pypdf2(self, pdf_data: bytes) -> str:
        """Extract text using PyPDF2"""
        try:
            pdf_stream = io.BytesIO(pdf_data)
            pdf_reader = PyPDF2.PdfReader(pdf_stream)
            
            text_parts = []
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
            
            return '\n\n'.join(text_parts)
        except Exception as e:
            logger.error(f"❌ PyPDF2 extraction failed: {e}")
            return ""

    def _clean_extracted_text(self, text: str) -> str:
        """Clean and normalize extracted text"""
        if not text:
            return ""
        
        # Remove excessive whitespace
        import re
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        # Remove common PDF artifacts
        text = text.replace('\x00', '')  # Null characters
        text = text.replace('\uf0b7', '•')  # Bullet points
        
        return text.strip()

    async def get_status(self) -> Dict[str, Any]:
        """Get agent status"""
        return {
            "agent_name": "PDFReaderAgent",
            "status": "active",
            "session_active": self.session is not None,
            "supported_methods": ["pypdf2", "pdfplumber", "auto"],
            "tools_available": len(self.agent.tools) if hasattr(self.agent, 'tools') else 5
        }
