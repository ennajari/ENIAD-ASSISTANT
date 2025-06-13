"""
Monitoring Agent
Specialized agent for continuous website monitoring
"""

from crewai import Agent
from langchain.tools import Tool
from typing import List, Dict, Any
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class MonitoringAgent:
    def __init__(self):
        # Initialize the CrewAI agent
        self.agent = Agent(
            role='Website Monitoring Specialist',
            goal='Continuously monitor websites for changes and updates',
            backstory="""You are an expert website monitoring specialist. 
            You can detect changes in websites, track updates, and alert 
            when new content is available.""",
            verbose=True,
            allow_delegation=False,
            tools=self._create_tools()
        )
        
        self.monitoring_data = {}

    def _create_tools(self) -> List[Tool]:
        """Create tools for the monitoring agent"""
        return [
            Tool(
                name="monitor_website",
                description="Monitor a website for changes",
                func=self.monitor_website
            ),
            Tool(
                name="detect_changes",
                description="Detect changes in website content",
                func=self.detect_changes
            ),
            Tool(
                name="track_updates",
                description="Track website updates over time",
                func=self.track_updates
            ),
            Tool(
                name="generate_alerts",
                description="Generate alerts for significant changes",
                func=self.generate_alerts
            )
        ]

    async def monitor_website(self, url: str, categories: List[str]) -> Dict[str, Any]:
        """Monitor a website for changes"""
        try:
            logger.info(f"👁️ Monitoring website: {url}")
            
            # Placeholder implementation
            monitoring_result = {
                'url': url,
                'status': 'monitored',
                'categories': categories,
                'last_check': datetime.now().isoformat(),
                'changes_detected': False,
                'content_hash': 'placeholder_hash'
            }
            
            # Store monitoring data
            self.monitoring_data[url] = monitoring_result
            
            logger.info(f"✅ Website monitoring setup for {url}")
            return monitoring_result
            
        except Exception as e:
            logger.error(f"❌ Error monitoring website {url}: {e}")
            return {
                'url': url,
                'status': 'error',
                'error': str(e),
                'last_check': datetime.now().isoformat()
            }

    async def detect_changes(self, url: str, current_content: str) -> bool:
        """Detect changes in website content"""
        try:
            previous_data = self.monitoring_data.get(url)
            
            if not previous_data:
                # First time monitoring, consider as change
                return True
            
            # Simple change detection (in real implementation, use more sophisticated methods)
            current_hash = hash(current_content)
            previous_hash = previous_data.get('content_hash')
            
            has_changes = current_hash != previous_hash
            
            if has_changes:
                logger.info(f"🔄 Changes detected in {url}")
                # Update monitoring data
                self.monitoring_data[url]['content_hash'] = current_hash
                self.monitoring_data[url]['changes_detected'] = True
                self.monitoring_data[url]['last_change'] = datetime.now().isoformat()
            
            return has_changes
            
        except Exception as e:
            logger.error(f"❌ Error detecting changes for {url}: {e}")
            return False

    async def track_updates(self, url: str) -> List[Dict[str, Any]]:
        """Track website updates over time"""
        try:
            monitoring_data = self.monitoring_data.get(url, {})
            
            # Placeholder implementation
            updates = []
            
            if monitoring_data.get('changes_detected'):
                updates.append({
                    'timestamp': monitoring_data.get('last_change'),
                    'type': 'content_change',
                    'description': 'Website content has been updated',
                    'url': url
                })
            
            logger.info(f"📊 Tracked {len(updates)} updates for {url}")
            return updates
            
        except Exception as e:
            logger.error(f"❌ Error tracking updates for {url}: {e}")
            return []

    async def generate_alerts(self, url: str, changes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate alerts for significant changes"""
        try:
            alerts = []
            
            for change in changes:
                if change.get('type') == 'content_change':
                    alerts.append({
                        'level': 'info',
                        'message': f'Content updated on {url}',
                        'timestamp': change.get('timestamp'),
                        'url': url,
                        'type': 'content_update'
                    })
            
            logger.info(f"🚨 Generated {len(alerts)} alerts for {url}")
            return alerts
            
        except Exception as e:
            logger.error(f"❌ Error generating alerts for {url}: {e}")
            return []

    async def get_monitoring_summary(self) -> Dict[str, Any]:
        """Get summary of all monitoring activities"""
        try:
            total_sites = len(self.monitoring_data)
            sites_with_changes = len([
                site for site in self.monitoring_data.values() 
                if site.get('changes_detected', False)
            ])
            
            return {
                'total_sites_monitored': total_sites,
                'sites_with_changes': sites_with_changes,
                'monitoring_data': self.monitoring_data,
                'last_update': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting monitoring summary: {e}")
            return {
                'total_sites_monitored': 0,
                'sites_with_changes': 0,
                'error': str(e)
            }

    async def get_status(self) -> Dict[str, Any]:
        """Get agent status"""
        return {
            "agent_name": "MonitoringAgent",
            "status": "active",
            "sites_monitored": len(self.monitoring_data),
            "tools_available": len(self.agent.tools) if hasattr(self.agent, 'tools') else 4
        }
