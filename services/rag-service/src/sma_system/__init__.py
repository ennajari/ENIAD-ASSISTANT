# Smart Multi-Agent System for ENIAD Academic Assistant
# This module provides intelligent web scanning and information extraction
# for ENIAD and UMP websites using CrewAI and LangChain

__version__ = "1.0.0"
__author__ = "ENIAD Academic Assistant Team"

from .web_scanner_crew import WebScannerCrew
from .agents import *
from .tasks import *
from .tools import *

__all__ = [
    'WebScannerCrew',
    'WebScraperAgent',
    'ContentAnalyzerAgent', 
    'UpdateDetectorAgent',
    'DocumentExtractorAgent',
    'ScanWebsiteTask',
    'AnalyzeContentTask',
    'DetectUpdatesTask',
    'ExtractDocumentsTask',
    'WebScrapingTool',
    'ContentAnalysisTool',
    'DocumentExtractionTool',
    'UpdateDetectionTool'
]
