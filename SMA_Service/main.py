"""
Smart Multi-Agent (SMA) Service
FastAPI backend for web scraping and information extraction
Uses CrewAI and LangChain for intelligent web monitoring
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import asyncio
import logging
from datetime import datetime, timedelta

# Import our SMA components
from agents.web_scraper_agent import WebScraperAgent
from agents.content_analyzer_agent import ContentAnalyzerAgent
from agents.information_extractor_agent import InformationExtractorAgent
from agents.monitoring_agent import MonitoringAgent
from crew.sma_crew import SMACrew
from utils.website_monitor import WebsiteMonitor
from utils.content_processor import ContentProcessor
from config.settings import Settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ENIAD SMA Service",
    description="Smart Multi-Agent system for web intelligence and monitoring",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5175", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize settings and components
settings = Settings()
website_monitor = WebsiteMonitor()
content_processor = ContentProcessor()
sma_crew = SMACrew()

# Pydantic models for API requests
class SearchRequest(BaseModel):
    query: str
    language: str = "fr"
    categories: List[str] = ["news", "documents", "announcements"]
    target_sites: List[Dict[str, Any]]
    real_time: bool = True
    max_results: int = 20
    include_metadata: bool = True
    extract_images: bool = True
    extract_documents: bool = True

class UpdatesRequest(BaseModel):
    language: str = "fr"
    time_range: str = "24h"
    target_sites: List[Dict[str, Any]]
    include_metadata: bool = True

class ExtractionRequest(BaseModel):
    extraction_type: str
    language: str = "fr"
    target_sites: List[Dict[str, Any]]
    deep_scan: bool = True
    include_metadata: bool = True

class MonitoringRequest(BaseModel):
    target_sites: List[Dict[str, Any]]
    monitoring_interval: str = "1h"
    categories: List[str] = ["news", "documents", "announcements"]
    notify_on_changes: bool = True

# Global variables for monitoring
active_monitoring_tasks = {}
monitoring_results = {}

@app.on_event("startup")
async def startup_event():
    """Initialize SMA service on startup"""
    logger.info("🤖 Starting ENIAD SMA Service...")
    
    # Initialize agents
    await sma_crew.initialize_agents()
    
    # Start background monitoring for default sites
    default_sites = [
        {
            "name": "ENIAD",
            "url": "https://eniad.ump.ma/fr",
            "priority": "high",
            "categories": ["news", "documents", "announcements", "events", "photos"]
        },
        {
            "name": "UMP",
            "url": "https://www.ump.ma/",
            "priority": "medium",
            "categories": ["news", "documents", "research", "events", "photos"]
        }
    ]
    
    # Start default monitoring
    await start_background_monitoring(default_sites)
    
    logger.info("✅ SMA Service initialized successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("🛑 Shutting down SMA Service...")
    
    # Cancel all monitoring tasks
    for task_id, task in active_monitoring_tasks.items():
        task.cancel()
    
    logger.info("✅ SMA Service shutdown complete")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "ENIAD SMA Service",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/sma/status")
async def get_sma_status():
    """Get SMA system status"""
    try:
        agents_status = await sma_crew.get_agents_status()
        
        return {
            "status": "operational",
            "agents_active": len([a for a in agents_status if a["status"] == "active"]),
            "agents_status": agents_status,
            "monitoring_tasks": len(active_monitoring_tasks),
            "last_scan": website_monitor.get_last_scan_time(),
            "websites_monitored": 2,  # ENIAD and UMP
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"❌ Error getting SMA status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sma/search")
async def sma_search(request: SearchRequest):
    """Activate SMA search for specific query"""
    try:
        logger.info(f"🔍 SMA Search activated: {request.query[:50]}...")
        
        # Start the search crew
        search_results = await sma_crew.execute_search_mission(
            query=request.query,
            language=request.language,
            categories=request.categories,
            target_sites=request.target_sites,
            real_time=request.real_time,
            max_results=request.max_results
        )
        
        # Process and format results
        processed_results = await content_processor.process_search_results(
            search_results,
            include_metadata=request.include_metadata,
            extract_images=request.extract_images,
            extract_documents=request.extract_documents
        )
        
        logger.info(f"✅ SMA Search completed: {len(processed_results.get('results', []))} results found")
        
        return processed_results
        
    except Exception as e:
        logger.error(f"❌ SMA search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sma/updates")
async def get_latest_updates(request: UpdatesRequest):
    """Get latest updates from monitored websites"""
    try:
        logger.info(f"📰 Getting latest updates for {request.time_range}")
        
        # Parse time range
        hours = parse_time_range(request.time_range)
        since_time = datetime.now() - timedelta(hours=hours)
        
        # Get updates from monitoring agent
        updates = await sma_crew.get_recent_updates(
            since_time=since_time,
            language=request.language,
            target_sites=request.target_sites
        )
        
        # Process updates
        processed_updates = await content_processor.process_updates(
            updates,
            include_metadata=request.include_metadata
        )
        
        logger.info(f"✅ Found {len(processed_updates.get('updates', []))} updates")
        
        return processed_updates
        
    except Exception as e:
        logger.error(f"❌ Get updates failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sma/extract")
async def extract_information(request: ExtractionRequest):
    """Extract specific information from websites"""
    try:
        logger.info(f"🔬 Extracting {request.extraction_type} information")
        
        # Execute extraction mission
        extraction_results = await sma_crew.execute_extraction_mission(
            extraction_type=request.extraction_type,
            language=request.language,
            target_sites=request.target_sites,
            deep_scan=request.deep_scan
        )
        
        # Process extraction results
        processed_extraction = await content_processor.process_extraction_results(
            extraction_results,
            extraction_type=request.extraction_type,
            include_metadata=request.include_metadata
        )
        
        logger.info(f"✅ Extracted {len(processed_extraction.get('items', []))} items")
        
        return processed_extraction
        
    except Exception as e:
        logger.error(f"❌ Information extraction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sma/monitor/start")
async def start_monitoring(request: MonitoringRequest, background_tasks: BackgroundTasks):
    """Start monitoring websites for changes"""
    try:
        logger.info(f"👁️ Starting monitoring with {request.monitoring_interval} interval")
        
        # Generate monitoring ID
        monitoring_id = f"monitor_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Start monitoring task
        background_tasks.add_task(
            start_monitoring_task,
            monitoring_id,
            request.target_sites,
            request.monitoring_interval,
            request.categories,
            request.notify_on_changes
        )
        
        return {
            "status": "monitoring_started",
            "monitoring_id": monitoring_id,
            "interval": request.monitoring_interval,
            "categories": request.categories,
            "target_sites": [site["name"] for site in request.target_sites]
        }
        
    except Exception as e:
        logger.error(f"❌ Start monitoring failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sma/monitor/{monitoring_id}/status")
async def get_monitoring_status(monitoring_id: str):
    """Get monitoring task status"""
    try:
        if monitoring_id not in active_monitoring_tasks:
            raise HTTPException(status_code=404, detail="Monitoring task not found")
        
        task = active_monitoring_tasks[monitoring_id]
        results = monitoring_results.get(monitoring_id, {})
        
        return {
            "monitoring_id": monitoring_id,
            "status": "active" if not task.done() else "completed",
            "results": results,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Get monitoring status failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/sma/monitor/{monitoring_id}")
async def stop_monitoring(monitoring_id: str):
    """Stop monitoring task"""
    try:
        if monitoring_id not in active_monitoring_tasks:
            raise HTTPException(status_code=404, detail="Monitoring task not found")
        
        task = active_monitoring_tasks[monitoring_id]
        task.cancel()
        
        del active_monitoring_tasks[monitoring_id]
        if monitoring_id in monitoring_results:
            del monitoring_results[monitoring_id]
        
        return {
            "status": "monitoring_stopped",
            "monitoring_id": monitoring_id,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Stop monitoring failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions
def parse_time_range(time_range: str) -> int:
    """Parse time range string to hours"""
    if time_range.endswith('h'):
        return int(time_range[:-1])
    elif time_range.endswith('d'):
        return int(time_range[:-1]) * 24
    else:
        return 24  # Default to 24 hours

async def start_monitoring_task(
    monitoring_id: str,
    target_sites: List[Dict[str, Any]],
    interval: str,
    categories: List[str],
    notify_on_changes: bool
):
    """Background monitoring task"""
    try:
        interval_seconds = parse_time_range(interval) * 3600  # Convert to seconds
        
        while True:
            logger.info(f"🔄 Running monitoring task {monitoring_id}")
            
            # Execute monitoring mission
            monitoring_results[monitoring_id] = await sma_crew.execute_monitoring_mission(
                target_sites=target_sites,
                categories=categories,
                notify_on_changes=notify_on_changes
            )
            
            # Wait for next interval
            await asyncio.sleep(interval_seconds)
            
    except asyncio.CancelledError:
        logger.info(f"🛑 Monitoring task {monitoring_id} cancelled")
    except Exception as e:
        logger.error(f"❌ Monitoring task {monitoring_id} failed: {e}")

async def start_background_monitoring(default_sites: List[Dict[str, Any]]):
    """Start default background monitoring"""
    try:
        monitoring_id = "default_monitoring"
        
        # Create monitoring task
        task = asyncio.create_task(
            start_monitoring_task(
                monitoring_id=monitoring_id,
                target_sites=default_sites,
                interval="1h",
                categories=["news", "documents", "announcements"],
                notify_on_changes=True
            )
        )
        
        active_monitoring_tasks[monitoring_id] = task
        logger.info("✅ Default background monitoring started")
        
    except Exception as e:
        logger.error(f"❌ Failed to start background monitoring: {e}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
