"""
Website Monitor Utility
Handles website monitoring and change detection
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class WebsiteMonitor:
    def __init__(self):
        self.last_scan_time = None
        self.scan_history = {}
        
    def get_last_scan_time(self) -> Optional[str]:
        """Get the last scan time"""
        return self.last_scan_time.isoformat() if self.last_scan_time else None
    
    async def record_scan(self, website_url: str, scan_data: Dict[str, Any]):
        """Record a website scan"""
        try:
            self.last_scan_time = datetime.now()
            self.scan_history[website_url] = {
                'timestamp': self.last_scan_time,
                'data': scan_data
            }
            logger.info(f"📊 Recorded scan for {website_url}")
        except Exception as e:
            logger.error(f"❌ Error recording scan: {e}")
    
    async def get_scan_history(self, website_url: str) -> Optional[Dict[str, Any]]:
        """Get scan history for a website"""
        return self.scan_history.get(website_url)
    
    async def detect_changes(self, website_url: str, current_data: Dict[str, Any]) -> bool:
        """Detect if website has changed since last scan"""
        try:
            previous_scan = await self.get_scan_history(website_url)
            if not previous_scan:
                return True  # First scan, consider as change
            
            # Simple change detection based on content hash
            previous_hash = previous_scan.get('data', {}).get('content_hash')
            current_hash = current_data.get('content_hash')
            
            return previous_hash != current_hash
        except Exception as e:
            logger.error(f"❌ Error detecting changes: {e}")
            return False
