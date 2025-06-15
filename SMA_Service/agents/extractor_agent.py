"""
Extractor Agent
Specialized agent for cleaning, organizing, and structuring extracted content
Processes raw text from various sources into semantic chunks
"""

from crewai import Agent
from langchain.tools import Tool
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
import re
import json
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime
import hashlib
from collections import Counter
from utils.gemini_service import gemini_service

logger = logging.getLogger(__name__)

class ExtractorAgent:
    def __init__(self):
        # Text splitters for different content types
        self.text_splitters = {
            'default': RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len
            ),
            'academic': RecursiveCharacterTextSplitter(
                chunk_size=1500,
                chunk_overlap=300,
                length_function=len,
                separators=["\n\n", "\n", ". ", " ", ""]
            ),
            'news': RecursiveCharacterTextSplitter(
                chunk_size=800,
                chunk_overlap=150,
                length_function=len,
                separators=["\n\n", "\n", ". ", " ", ""]
            ),
            'documents': RecursiveCharacterTextSplitter(
                chunk_size=2000,
                chunk_overlap=400,
                length_function=len
            )
        }
        
        # Content patterns for extraction
        self.patterns = {
            'emails': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'phones': r'\b(?:\+212|0)[5-7]\d{8}\b',
            'dates': r'\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b',
            'urls': r'https?://[^\s<>"{}|\\^`[\]]+',
            'academic_years': r'\b20\d{2}[-/]20\d{2}\b',
            'course_codes': r'\b[A-Z]{2,4}\d{3,4}\b',
            'grades': r'\b[A-F][+-]?\b|\b\d{1,2}[.,]\d{1,2}/20\b'
        }
        
        # Initialize the CrewAI agent
        self.agent = Agent(
            role='Content Extraction Specialist',
            goal='Clean, organize, and structure raw content into semantic chunks for analysis and retrieval',
            backstory="""You are an expert content processor with deep knowledge of text analysis and information extraction. 
            You can identify different content types, extract structured information, and organize content into 
            meaningful chunks while preserving context and relationships.""",
            verbose=True,
            allow_delegation=False,
            tools=self._create_tools()
        )

    def _create_tools(self) -> List[Tool]:
        """Create tools for the extractor agent"""
        return [
            Tool(
                name="clean_and_structure_content",
                description="Clean and structure raw content into organized format",
                func=self.clean_and_structure_content
            ),
            Tool(
                name="extract_semantic_chunks",
                description="Split content into semantic chunks for processing",
                func=self.extract_semantic_chunks
            ),
            Tool(
                name="extract_structured_data",
                description="Extract structured data like emails, phones, dates",
                func=self.extract_structured_data
            ),
            Tool(
                name="organize_by_content_type",
                description="Organize content by type and category",
                func=self.organize_by_content_type
            ),
            Tool(
                name="merge_related_content",
                description="Merge related content pieces",
                func=self.merge_related_content
            ),
            Tool(
                name="extract_key_entities",
                description="Extract key entities and concepts",
                func=self.extract_key_entities
            )
        ]

    async def clean_and_structure_content(self, raw_content: str, content_type: str = "general", metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Clean and structure raw content"""
        try:
            logger.info(f"🧹 Cleaning and structuring content ({len(raw_content)} chars, type: {content_type})")
            
            if not raw_content or len(raw_content.strip()) < 10:
                return {
                    'status': 'error',
                    'error': 'Content too short or empty'
                }

            # Clean the content
            cleaned_content = self._clean_text(raw_content)
            
            # Structure based on content type
            if content_type == "academic":
                structured = await self._structure_academic_content(cleaned_content)
            elif content_type == "news":
                structured = await self._structure_news_content(cleaned_content)
            elif content_type == "document":
                structured = await self._structure_document_content(cleaned_content)
            else:
                structured = await self._structure_general_content(cleaned_content)

            # Add metadata
            result = {
                'status': 'success',
                'original_length': len(raw_content),
                'cleaned_length': len(cleaned_content),
                'content_type': content_type,
                'structured_content': structured,
                'processing_timestamp': datetime.now().isoformat(),
                'content_hash': hashlib.md5(cleaned_content.encode()).hexdigest()
            }
            
            if metadata:
                result['metadata'] = metadata

            logger.info(f"✅ Content cleaned and structured: {len(structured.get('sections', []))} sections")
            return result

        except Exception as e:
            logger.error(f"❌ Error cleaning and structuring content: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def extract_semantic_chunks(self, content: str, content_type: str = "default", max_chunks: int = 50) -> Dict[str, Any]:
        """Extract semantic chunks from content"""
        try:
            logger.info(f"✂️ Extracting semantic chunks from content ({len(content)} chars)")
            
            # Select appropriate text splitter
            splitter = self.text_splitters.get(content_type, self.text_splitters['default'])
            
            # Create document
            doc = Document(page_content=content)
            
            # Split into chunks
            chunks = splitter.split_documents([doc])
            
            # Limit number of chunks
            if len(chunks) > max_chunks:
                chunks = chunks[:max_chunks]
                logger.warning(f"⚠️ Limited to {max_chunks} chunks (was {len(chunks)})")

            # Process chunks
            processed_chunks = []
            for i, chunk in enumerate(chunks):
                chunk_text = chunk.page_content.strip()
                if len(chunk_text) > 20:  # Filter out very short chunks
                    processed_chunk = {
                        'chunk_id': i + 1,
                        'content': chunk_text,
                        'length': len(chunk_text),
                        'word_count': len(chunk_text.split()),
                        'start_preview': chunk_text[:100] + "..." if len(chunk_text) > 100 else chunk_text
                    }
                    
                    # Add semantic analysis using Gemini
                    try:
                        analysis = gemini_service.analyze_content(chunk_text, content_type)
                        processed_chunk['analysis'] = analysis
                    except Exception as analysis_error:
                        logger.warning(f"⚠️ Chunk analysis failed: {analysis_error}")
                        processed_chunk['analysis'] = {'category': 'general', 'keywords': []}
                    
                    processed_chunks.append(processed_chunk)

            result = {
                'status': 'success',
                'content_type': content_type,
                'total_chunks': len(processed_chunks),
                'chunks': processed_chunks,
                'splitter_config': {
                    'chunk_size': splitter.chunk_size,
                    'chunk_overlap': splitter.chunk_overlap
                }
            }

            logger.info(f"✅ Extracted {len(processed_chunks)} semantic chunks")
            return result

        except Exception as e:
            logger.error(f"❌ Error extracting semantic chunks: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def extract_structured_data(self, content: str) -> Dict[str, Any]:
        """Extract structured data from content"""
        try:
            logger.info(f"🔍 Extracting structured data from content")
            
            extracted_data = {}
            
            # Extract using patterns
            for data_type, pattern in self.patterns.items():
                matches = re.findall(pattern, content, re.IGNORECASE)
                if matches:
                    # Remove duplicates and clean
                    unique_matches = list(set(matches))
                    extracted_data[data_type] = unique_matches[:10]  # Limit to 10 items

            # Extract additional structured information
            # Academic information
            academic_info = self._extract_academic_info(content)
            if academic_info:
                extracted_data['academic'] = academic_info

            # Contact information
            contact_info = self._extract_contact_info(content)
            if contact_info:
                extracted_data['contacts'] = contact_info

            # Event information
            event_info = self._extract_event_info(content)
            if event_info:
                extracted_data['events'] = event_info

            result = {
                'status': 'success',
                'extracted_data': extracted_data,
                'data_types_found': list(extracted_data.keys()),
                'total_items': sum(len(v) if isinstance(v, list) else 1 for v in extracted_data.values())
            }

            logger.info(f"✅ Extracted structured data: {result['total_items']} items in {len(result['data_types_found'])} categories")
            return result

        except Exception as e:
            logger.error(f"❌ Error extracting structured data: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def organize_by_content_type(self, content_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Organize content by type and category"""
        try:
            logger.info(f"📂 Organizing {len(content_items)} content items by type")
            
            organized = {
                'news': [],
                'documents': [],
                'academic': [],
                'events': [],
                'announcements': [],
                'research': [],
                'general': []
            }
            
            for item in content_items:
                content = item.get('content', '')
                category = item.get('category', 'general')
                
                # Determine category if not provided
                if category == 'general' and content:
                    category = await self._classify_content_type(content)
                
                # Add to appropriate category
                if category in organized:
                    organized[category].append(item)
                else:
                    organized['general'].append(item)

            # Remove empty categories
            organized = {k: v for k, v in organized.items() if v}
            
            # Sort items within each category by relevance or date
            for category, items in organized.items():
                organized[category] = sorted(items, key=lambda x: x.get('timestamp', ''), reverse=True)

            result = {
                'status': 'success',
                'organized_content': organized,
                'categories_found': list(organized.keys()),
                'total_items': sum(len(items) for items in organized.values()),
                'category_counts': {k: len(v) for k, v in organized.items()}
            }

            logger.info(f"✅ Content organized into {len(organized)} categories")
            return result

        except Exception as e:
            logger.error(f"❌ Error organizing content: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def merge_related_content(self, content_items: List[Dict[str, Any]], similarity_threshold: float = 0.7) -> Dict[str, Any]:
        """Merge related content pieces"""
        try:
            logger.info(f"🔗 Merging related content from {len(content_items)} items")
            
            merged_groups = []
            processed_indices = set()
            
            for i, item1 in enumerate(content_items):
                if i in processed_indices:
                    continue
                
                # Start a new group with this item
                group = [item1]
                processed_indices.add(i)
                
                # Find similar items
                for j, item2 in enumerate(content_items[i+1:], i+1):
                    if j in processed_indices:
                        continue
                    
                    # Calculate similarity
                    similarity = self._calculate_content_similarity(item1, item2)
                    
                    if similarity >= similarity_threshold:
                        group.append(item2)
                        processed_indices.add(j)
                
                # Create merged content for the group
                if len(group) > 1:
                    merged_content = self._merge_content_group(group)
                    merged_groups.append(merged_content)
                else:
                    merged_groups.append(item1)

            result = {
                'status': 'success',
                'original_count': len(content_items),
                'merged_count': len(merged_groups),
                'reduction_ratio': (len(content_items) - len(merged_groups)) / len(content_items) if content_items else 0,
                'merged_content': merged_groups
            }

            logger.info(f"✅ Content merged: {len(content_items)} → {len(merged_groups)} items")
            return result

        except Exception as e:
            logger.error(f"❌ Error merging content: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def extract_key_entities(self, content: str) -> Dict[str, Any]:
        """Extract key entities and concepts"""
        try:
            logger.info(f"🎯 Extracting key entities from content")
            
            entities = {
                'organizations': [],
                'locations': [],
                'dates': [],
                'people': [],
                'concepts': [],
                'technologies': []
            }
            
            # Use Gemini for entity extraction
            try:
                gemini_entities = gemini_service.extract_keywords(content, 20)
                if gemini_entities:
                    # Classify entities (simplified)
                    for entity in gemini_entities:
                        entity_lower = entity.lower()
                        if any(word in entity_lower for word in ['université', 'école', 'institut', 'eniad', 'ump']):
                            entities['organizations'].append(entity)
                        elif any(word in entity_lower for word in ['maroc', 'oujda', 'rabat', 'casablanca']):
                            entities['locations'].append(entity)
                        elif any(word in entity_lower for word in ['intelligence', 'artificielle', 'machine', 'learning']):
                            entities['technologies'].append(entity)
                        else:
                            entities['concepts'].append(entity)
            except Exception as gemini_error:
                logger.warning(f"⚠️ Gemini entity extraction failed: {gemini_error}")

            # Fallback: pattern-based extraction
            # Extract dates
            date_matches = re.findall(self.patterns['dates'], content)
            entities['dates'].extend(date_matches)
            
            # Extract organizations (simple pattern)
            org_pattern = r'\b(?:Université|École|Institut|ENIAD|UMP|Faculté)[^.]*\b'
            org_matches = re.findall(org_pattern, content, re.IGNORECASE)
            entities['organizations'].extend(org_matches)

            # Remove duplicates and empty entries
            for key in entities:
                entities[key] = list(set([e.strip() for e in entities[key] if e.strip()]))[:10]

            result = {
                'status': 'success',
                'entities': entities,
                'total_entities': sum(len(v) for v in entities.values()),
                'entity_types': [k for k, v in entities.items() if v]
            }

            logger.info(f"✅ Extracted {result['total_entities']} entities in {len(result['entity_types'])} categories")
            return result

        except Exception as e:
            logger.error(f"❌ Error extracting entities: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    def _clean_text(self, text: str) -> str:
        """Clean raw text"""
        if not text:
            return ""
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        # Remove common artifacts
        text = text.replace('\x00', '')  # Null characters
        text = text.replace('\uf0b7', '•')  # Bullet points
        text = text.replace('\u2022', '•')  # Another bullet point
        
        # Fix common encoding issues
        text = text.replace('â€™', "'")
        text = text.replace('â€œ', '"')
        text = text.replace('â€', '"')
        
        return text.strip()

    async def _structure_academic_content(self, content: str) -> Dict[str, Any]:
        """Structure academic content"""
        sections = {
            'title': '',
            'abstract': '',
            'introduction': '',
            'methodology': '',
            'results': '',
            'conclusion': '',
            'references': '',
            'other_sections': []
        }
        
        # Simple section detection based on headers
        lines = content.split('\n')
        current_section = 'other_sections'
        current_content = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Check for section headers
            line_lower = line.lower()
            if any(word in line_lower for word in ['résumé', 'abstract']):
                current_section = 'abstract'
            elif any(word in line_lower for word in ['introduction']):
                current_section = 'introduction'
            elif any(word in line_lower for word in ['méthodologie', 'methodology']):
                current_section = 'methodology'
            elif any(word in line_lower for word in ['résultats', 'results']):
                current_section = 'results'
            elif any(word in line_lower for word in ['conclusion']):
                current_section = 'conclusion'
            elif any(word in line_lower for word in ['références', 'references', 'bibliographie']):
                current_section = 'references'
            else:
                current_content.append(line)
                continue
            
            # Save previous section
            if current_content and current_section in sections:
                if current_section == 'other_sections':
                    sections[current_section].append('\n'.join(current_content))
                else:
                    sections[current_section] = '\n'.join(current_content)
            
            current_content = []
        
        # Save last section
        if current_content:
            if current_section == 'other_sections':
                sections[current_section].append('\n'.join(current_content))
            else:
                sections[current_section] = '\n'.join(current_content)
        
        return sections

    async def _structure_news_content(self, content: str) -> Dict[str, Any]:
        """Structure news content"""
        lines = content.split('\n')
        
        return {
            'headline': lines[0] if lines else '',
            'lead': lines[1] if len(lines) > 1 else '',
            'body': '\n'.join(lines[2:]) if len(lines) > 2 else '',
            'word_count': len(content.split())
        }

    async def _structure_document_content(self, content: str) -> Dict[str, Any]:
        """Structure document content"""
        return {
            'content': content,
            'sections': content.split('\n\n'),
            'word_count': len(content.split()),
            'paragraph_count': len(content.split('\n\n'))
        }

    async def _structure_general_content(self, content: str) -> Dict[str, Any]:
        """Structure general content"""
        return {
            'content': content,
            'paragraphs': [p.strip() for p in content.split('\n\n') if p.strip()],
            'word_count': len(content.split())
        }

    def _extract_academic_info(self, content: str) -> Dict[str, Any]:
        """Extract academic-specific information"""
        academic_info = {}
        
        # Extract course codes
        course_codes = re.findall(self.patterns['course_codes'], content)
        if course_codes:
            academic_info['course_codes'] = list(set(course_codes))
        
        # Extract academic years
        academic_years = re.findall(self.patterns['academic_years'], content)
        if academic_years:
            academic_info['academic_years'] = list(set(academic_years))
        
        # Extract grades
        grades = re.findall(self.patterns['grades'], content)
        if grades:
            academic_info['grades'] = list(set(grades))
        
        return academic_info

    def _extract_contact_info(self, content: str) -> Dict[str, Any]:
        """Extract contact information"""
        contact_info = {}
        
        # Extract emails
        emails = re.findall(self.patterns['emails'], content)
        if emails:
            contact_info['emails'] = list(set(emails))
        
        # Extract phone numbers
        phones = re.findall(self.patterns['phones'], content)
        if phones:
            contact_info['phones'] = list(set(phones))
        
        return contact_info

    def _extract_event_info(self, content: str) -> Dict[str, Any]:
        """Extract event information"""
        event_info = {}
        
        # Extract dates
        dates = re.findall(self.patterns['dates'], content)
        if dates:
            event_info['dates'] = list(set(dates))
        
        # Extract event keywords
        event_keywords = ['conférence', 'séminaire', 'colloque', 'symposium', 'workshop', 'formation']
        found_keywords = [kw for kw in event_keywords if kw.lower() in content.lower()]
        if found_keywords:
            event_info['event_types'] = found_keywords
        
        return event_info

    async def _classify_content_type(self, content: str) -> str:
        """Classify content type"""
        try:
            result = gemini_service.classify_content(content)
            return result.get('category', 'general')
        except:
            # Fallback classification
            content_lower = content.lower()
            if any(word in content_lower for word in ['actualité', 'news', 'annonce']):
                return 'news'
            elif any(word in content_lower for word in ['recherche', 'étude', 'publication']):
                return 'research'
            elif any(word in content_lower for word in ['événement', 'conférence', 'séminaire']):
                return 'events'
            else:
                return 'general'

    def _calculate_content_similarity(self, item1: Dict[str, Any], item2: Dict[str, Any]) -> float:
        """Calculate similarity between two content items"""
        try:
            content1 = item1.get('content', '').lower()
            content2 = item2.get('content', '').lower()
            
            # Simple word-based similarity
            words1 = set(content1.split())
            words2 = set(content2.split())
            
            if not words1 or not words2:
                return 0.0
            
            intersection = words1.intersection(words2)
            union = words1.union(words2)
            
            return len(intersection) / len(union) if union else 0.0
            
        except Exception:
            return 0.0

    def _merge_content_group(self, group: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Merge a group of related content items"""
        if not group:
            return {}
        
        if len(group) == 1:
            return group[0]
        
        # Merge content
        merged_content = '\n\n'.join([item.get('content', '') for item in group])
        
        # Combine metadata
        merged_item = {
            'content': merged_content,
            'merged_from': len(group),
            'sources': [item.get('source', '') for item in group],
            'categories': list(set([item.get('category', '') for item in group])),
            'merged_timestamp': datetime.now().isoformat()
        }
        
        return merged_item

    async def get_status(self) -> Dict[str, Any]:
        """Get agent status"""
        return {
            "agent_name": "ExtractorAgent",
            "status": "active",
            "text_splitters": list(self.text_splitters.keys()),
            "extraction_patterns": list(self.patterns.keys()),
            "tools_available": len(self.agent.tools) if hasattr(self.agent, 'tools') else 6
        }
