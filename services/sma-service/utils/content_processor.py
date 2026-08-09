"""
Content Processor Utility
Handles processing and formatting of scraped content
"""

import logging
from typing import Dict, Any, List
from datetime import datetime

logger = logging.getLogger(__name__)

class ContentProcessor:
    def __init__(self):
        pass
    
    async def process_search_results(
        self,
        search_results: Dict[str, Any],
        include_metadata: bool = True,
        extract_images: bool = True,
        extract_documents: bool = True
    ) -> Dict[str, Any]:
        """Process and format search results"""
        try:
            processed = {
                'results': search_results.get('results', []),
                'total_found': len(search_results.get('results', [])),
                'search_time': search_results.get('search_time', 0),
                'timestamp': datetime.now().isoformat()
            }
            
            if include_metadata:
                processed['metadata'] = search_results.get('metadata', {})
            
            # Filter results based on extraction preferences
            if not extract_images:
                processed['results'] = [r for r in processed['results'] if r.get('type') != 'image']
            
            if not extract_documents:
                processed['results'] = [r for r in processed['results'] if r.get('type') != 'document']
            
            logger.info(f"✅ Processed {len(processed['results'])} search results")
            return processed
            
        except Exception as e:
            logger.error(f"❌ Error processing search results: {e}")
            return {
                'results': [],
                'total_found': 0,
                'search_time': 0,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    async def process_updates(
        self,
        updates: Dict[str, Any],
        include_metadata: bool = True
    ) -> Dict[str, Any]:
        """Process and format update results"""
        try:
            processed = {
                'updates': updates.get('updates', []),
                'total_updates': len(updates.get('updates', [])),
                'timestamp': datetime.now().isoformat()
            }
            
            if include_metadata:
                processed['metadata'] = updates.get('metadata', {})
            
            logger.info(f"✅ Processed {len(processed['updates'])} updates")
            return processed
            
        except Exception as e:
            logger.error(f"❌ Error processing updates: {e}")
            return {
                'updates': [],
                'total_updates': 0,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    async def process_extraction_results(
        self,
        extraction_results: Dict[str, Any],
        extraction_type: str,
        include_metadata: bool = True
    ) -> Dict[str, Any]:
        """Process and format extraction results"""
        try:
            processed = {
                'items': extraction_results.get('items', []),
                'total_extracted': len(extraction_results.get('items', [])),
                'extraction_type': extraction_type,
                'timestamp': datetime.now().isoformat()
            }
            
            if include_metadata:
                processed['metadata'] = extraction_results.get('metadata', {})
            
            logger.info(f"✅ Processed {len(processed['items'])} extracted items")
            return processed
            
        except Exception as e:
            logger.error(f"❌ Error processing extraction results: {e}")
            return {
                'items': [],
                'total_extracted': 0,
                'extraction_type': extraction_type,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
