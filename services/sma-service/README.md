# 🧠 ENIAD SMA Service - Smart Multi-Agent System

## 📋 Project Description

The **ENIAD SMA (Smart Multi-Agent) Service** is an advanced web intelligence system that employs multiple specialized AI agents to monitor, scrape, analyze, and extract information from academic websites in real-time. Built with FastAPI and powered by Google Gemini AI, it provides intelligent web monitoring and content analysis for the ENIAD academic environment.

## ✨ Main Features & Purpose

### 🤖 **Multi-Agent Architecture**
- **Web Scraper Agent** - Real-time website content extraction
- **Content Analyzer Agent** - AI-powered content analysis using Gemini
- **Coordinator Agent** - Agent orchestration and workflow management
- **Monitoring Agent** - Continuous website monitoring and change detection
- **RAG Integration Agent** - Knowledge base integration and retrieval

### 🕷️ **Advanced Web Scraping**
- **Real-time Content Extraction** - Live website monitoring
- **Multi-format Support** - HTML, PDF, images, documents
- **Intelligent Categorization** - News, announcements, documents, events
- **Rate Limiting Protection** - Respectful scraping with delays
- **Error Handling** - Robust failure recovery mechanisms

### 🧠 **AI-Powered Analysis**
- **Google Gemini Integration** - Advanced content understanding
- **Multilingual Analysis** - French and Arabic content processing
- **Semantic Understanding** - Context-aware content interpretation
- **Keyword Extraction** - Automatic tag generation
- **Content Summarization** - Intelligent content condensation

### 🔍 **Comprehensive Search**
- **Hybrid Search** - Vector and keyword-based retrieval
- **DuckDuckGo Integration** - External news and information
- **Vector Database** - ChromaDB for semantic search
- **OCR Capabilities** - Text extraction from images
- **Document Processing** - PDF and document analysis

### 📊 **Real-time Monitoring**
- **Continuous Monitoring** - 24/7 website surveillance
- **Change Detection** - Automatic update notifications
- **Background Tasks** - Async monitoring operations
- **Caching System** - Efficient data storage and retrieval
- **Performance Metrics** - Detailed monitoring statistics

## 🛠️ Technologies & Frameworks

### **Core Backend Framework**
- **FastAPI 0.115.12** - High-performance async web framework
- **Uvicorn 0.34.0** - ASGI server with hot reload
- **Python-multipart 0.0.20** - File upload handling
- **Pydantic 2.10.4** - Data validation and settings management

### **AI & Machine Learning**
- **Google Generative AI 0.8.3** - Gemini model integration
- **CrewAI 0.70.1** - Multi-agent framework and orchestration
- **LangChain 0.3.7** - LLM application development
- **LangChain Community 0.3.5** - Extended LangChain components
- **Sentence Transformers 3.3.1** - Text embeddings for semantic search

### **Web Scraping & Processing**
- **BeautifulSoup4 4.12.3** - HTML parsing and content extraction
- **Requests 2.32.3** - HTTP client for web requests
- **AIOHttp 3.9.1** - Async HTTP client
- **Selenium 4.27.1** - Dynamic web content scraping
- **LXML 5.3.0** - XML and HTML processing

### **Document & Image Processing**
- **PyPDF2 3.0.1** - PDF text extraction
- **PDFPlumber 0.11.4** - Advanced PDF processing
- **Pillow 10.4.0** - Image processing and manipulation
- **Pytesseract 0.3.13** - OCR for text extraction from images
- **OpenCV-Python 4.10.0.84** - Computer vision and image processing

### **Vector Database & Embeddings**
- **ChromaDB 0.5.23** - Vector database for embeddings
- **FAISS-CPU 1.9.0** - Efficient similarity search
- **NumPy 2.1.3** - Numerical computing
- **Pandas 2.2.3** - Data manipulation and analysis

### **Text Processing & NLP**
- **NLTK 3.8.1** - Natural language processing toolkit
- **TextBlob** - Simple text processing
- **Python-dateutil 2.9.0** - Date and time parsing

### **Utilities & Configuration**
- **Python-dotenv 1.1.0** - Environment variable management
- **AIOFiles 24.1.0** - Async file operations
- **Loguru 0.7.2** - Advanced logging
- **Schedule 1.2.2** - Task scheduling

## 📁 Project Structure

```
SMA_Service/
├── 📁 agents/                          # Specialized AI Agents
│   ├── 📄 web_scraper_agent.py         # Web content extraction
│   ├── 📄 content_analyzer_agent.py    # AI content analysis
│   ├── 📄 coordinator_agent.py         # Agent orchestration
│   ├── 📄 monitoring_agent.py          # Website monitoring
│   ├── 📄 rag_agent.py                 # RAG integration
│   ├── 📄 enhanced_sma_agent.py        # Enhanced SMA capabilities
│   ├── 📄 extractor_agent.py           # Data extraction
│   ├── 📄 image_ocr_agent.py           # OCR processing
│   ├── 📄 pdf_reader_agent.py          # PDF processing
│   └── 📄 information_extractor_agent.py # Information extraction
├── 📁 crew/                            # CrewAI Framework
│   ├── 📄 __init__.py                  # Package initialization
│   └── 📄 sma_crew.py                  # Multi-agent crew configuration
├── 📁 utils/                           # Utility Functions
│   ├── 📄 comprehensive_search.py      # Advanced search engine
│   ├── 📄 content_processor.py         # Content processing utilities
│   ├── 📄 duckduckgo_news.py          # External news integration
│   ├── 📄 gemini_service.py           # Gemini AI service wrapper
│   ├── 📄 vector_store.py             # Vector database operations
│   └── 📄 website_monitor.py          # Website monitoring utilities
├── 📁 config/                          # Configuration
│   ├── 📄 __init__.py                  # Package initialization
│   └── 📄 settings.py                  # Application settings
├── 📁 chroma_db/                       # Vector Database Storage
│   └── 📄 chroma.sqlite3               # ChromaDB database file
├── 📄 main.py                          # FastAPI Application Entry Point
├── 📄 requirements.txt                 # Python Dependencies
└── 📄 show_real_results.py             # Results demonstration script
```

## 🚀 Installation & Setup

### **Prerequisites**
- **Python 3.8+** (Recommended: Python 3.11)
- **Google Gemini API Key** - For AI content analysis
- **Git** - For cloning the repository

### **Quick Start**

1. **Clone the repository**
```bash
git clone https://github.com/ennajari/ENIAD-ASSISTANT.git
cd ENIAD-ASSISTANT/SMA_Service
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
# Create .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
```

5. **Start the SMA service**
```bash
python main.py
```

6. **Access the service**
- **API Documentation**: http://localhost:8001/docs
- **Health Check**: http://localhost:8001/health
- **SMA Status**: http://localhost:8001/sma/status

### **Alternative Installation**
```bash
# Install core dependencies only
pip install fastapi uvicorn beautifulsoup4 requests google-generativeai

# Start with basic functionality
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

## 🔌 API Endpoints & Usage

### **Core SMA Operations**

#### **1. Health Check**
Check service status and agent availability.

```bash
curl http://localhost:8001/health
```

#### **2. SMA Status**
Get detailed status of all agents and monitoring tasks.

```bash
curl http://localhost:8001/sma/status
```

#### **3. Intelligent Search**
Perform comprehensive search with AI analysis.

```bash
curl -X POST "http://localhost:8001/sma/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "ENIAD admission requirements",
    "language": "fr",
    "categories": ["news", "documents", "announcements"],
    "target_sites": [
      {
        "name": "ENIAD",
        "url": "https://eniad.ump.ma/fr",
        "priority": "high"
      }
    ],
    "max_results": 10
  }'
```

#### **4. Real-time Updates**
Get latest updates from monitored websites.

```bash
curl -X POST "http://localhost:8001/sma/updates" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "fr",
    "time_range": "24h",
    "target_sites": [
      {
        "name": "ENIAD",
        "url": "https://eniad.ump.ma/fr"
      }
    ]
  }'
```

#### **5. Content Extraction**
Extract specific content types from websites.

```bash
curl -X POST "http://localhost:8001/sma/extract" \
  -H "Content-Type: application/json" \
  -d '{
    "extraction_type": "documents",
    "language": "fr",
    "target_sites": [
      {
        "name": "ENIAD",
        "url": "https://eniad.ump.ma/fr"
      }
    ],
    "deep_scan": true
  }'
```

### **Advanced Features**

#### **6. Comprehensive Search**
Advanced search with vector embeddings and OCR.

```bash
curl -X POST "http://localhost:8001/sma/comprehensive-search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "intelligence artificielle ENIAD",
    "language": "fr",
    "search_depth": "deep",
    "include_documents": true,
    "include_images": true,
    "max_results": 50
  }'
```

#### **7. News Search**
Search for news and announcements.

```bash
curl -X POST "http://localhost:8001/sma/news-search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "ENIAD actualités",
    "language": "fr",
    "time_range": "w",
    "max_results": 10,
    "search_type": "academic"
  }'
```

## 🏗️ Multi-Agent Architecture

### **Agent Specializations**
- **WebScraperAgent** - Handles all web scraping operations
- **ContentAnalyzerAgent** - Processes content with Gemini AI
- **CoordinatorAgent** - Manages agent workflows and tasks
- **MonitoringAgent** - Continuous website surveillance
- **RAGAgent** - Integrates with knowledge base systems

### **Workflow Orchestration**
1. **Query Reception** → Initial request processing
2. **Agent Coordination** → Task distribution to specialized agents
3. **Parallel Processing** → Concurrent agent execution
4. **Content Analysis** → AI-powered content understanding
5. **Result Aggregation** → Combining agent outputs
6. **Response Formatting** → Structured result delivery

### **CrewAI Integration**
The system uses CrewAI for advanced multi-agent coordination:
- **Task Definition** - Structured agent tasks
- **Agent Collaboration** - Inter-agent communication
- **Workflow Management** - Complex task orchestration
- **Result Synthesis** - Intelligent output combination

## 🔧 Configuration & Environment

### **Environment Variables**
```bash
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=optional_openai_key
COHERE_API_KEY=optional_cohere_key

# Service Configuration
SMA_SERVER_HOST=0.0.0.0
SMA_SERVER_PORT=8001
DEBUG_MODE=true

# Scraping Configuration
MAX_CONCURRENT_REQUESTS=5
REQUEST_DELAY_SECONDS=2
CACHE_DURATION_HOURS=1
USER_AGENT=ENIAD-SMA-Bot/1.0

# Monitoring Configuration
MONITORING_INTERVAL_MINUTES=60
MAX_MONITORING_SITES=20
NOTIFICATION_ENABLED=true

# Vector Database
CHROMA_DB_PATH=./chroma_db
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

### **Monitored Websites**
The SMA service automatically monitors key ENIAD and UMP websites:

- **ENIAD Main** - https://eniad.ump.ma/fr
- **ENIAD News** - https://eniad.ump.ma/fr/actualite
- **ENIAD Programs** - Various engineering programs
- **UMP Main** - https://www.ump.ma/
- **Academic Services** - Health, scholarships, recruitment

## 🧪 Testing & Development

### **Service Testing**
```bash
# Test basic functionality
curl http://localhost:8001/health

# Test agent status
curl http://localhost:8001/sma/status

# Test search functionality
python show_real_results.py
```

### **Development Features**
- **Hot Reload** - Automatic server restart on code changes
- **Comprehensive Logging** - Detailed operation tracking with Loguru
- **Error Handling** - Graceful failure recovery
- **Performance Monitoring** - Request timing and agent metrics
- **Debug Endpoints** - Development testing interfaces

### **Agent Testing**
Each agent can be tested individually:
```python
# Test web scraper
from agents.web_scraper_agent import WebScraperAgent
scraper = WebScraperAgent()
result = await scraper.scrape_website("https://eniad.ump.ma/fr")

# Test content analyzer
from agents.content_analyzer_agent import ContentAnalyzerAgent
analyzer = ContentAnalyzerAgent()
analysis = await analyzer.analyze_content(result, "fr")
```

## 📊 Performance & Monitoring

### **System Capabilities**
- **Concurrent Scraping** - Up to 5 simultaneous requests
- **Response Time** - <3 seconds average for search operations
- **Cache Efficiency** - 1-hour content caching for performance
- **Monitoring Coverage** - 13+ ENIAD/UMP websites
- **Language Support** - French and Arabic content processing

### **Monitoring Metrics**
- **Active Agents** - Real-time agent status tracking
- **Scraping Success Rate** - Website accessibility monitoring
- **Content Analysis Quality** - AI processing effectiveness
- **Cache Hit Ratio** - Performance optimization metrics
- **Error Rates** - System reliability indicators

### **Performance Optimization**
- **Async Operations** - Non-blocking I/O for all web requests
- **Connection Pooling** - Efficient HTTP connection management
- **Intelligent Caching** - Smart content caching strategies
- **Rate Limiting** - Respectful website interaction
- **Memory Management** - Efficient resource utilization

## 🚀 Deployment & Production

### **Docker Deployment**
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8001

CMD ["python", "main.py"]
```

### **Production Configuration**
```bash
# Production environment variables
ENVIRONMENT=production
LOG_LEVEL=INFO
MAX_WORKERS=4
ENABLE_CORS=true
RATE_LIMIT_ENABLED=true
```

### **Scaling Considerations**
- **Horizontal Scaling** - Multiple SMA service instances
- **Load Balancing** - Distribute requests across instances
- **Database Scaling** - ChromaDB clustering for large datasets
- **Monitoring Integration** - Prometheus/Grafana metrics
- **Error Tracking** - Sentry integration for production monitoring

## 🔗 Integration with ENIAD System

### **RAG System Integration**
The SMA service seamlessly integrates with the RAG system:
- **Knowledge Base Updates** - Automatic content indexing
- **Vector Embeddings** - Shared embedding models
- **Query Enhancement** - Real-time content for RAG responses
- **Source Attribution** - Transparent information sourcing

### **Frontend Integration**
Integration with the React frontend through:
- **API Endpoints** - RESTful service communication
- **Real-time Updates** - WebSocket connections for live data
- **Status Indicators** - Visual feedback for SMA operations
- **Error Handling** - Graceful degradation on service unavailability

### **Authentication & Security**
- **API Key Management** - Secure external service access
- **Rate Limiting** - Protection against abuse
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Comprehensive request sanitization

## 🛠️ Development & Contributing

### **Development Setup**
```bash
# Install development dependencies
pip install -r requirements.txt
pip install pytest pytest-asyncio black flake8

# Run tests
pytest tests/

# Code formatting
black .
flake8 .
```

### **Adding New Agents**
1. Create agent class in `agents/` directory
2. Implement required methods (`execute`, `analyze`, etc.)
3. Register agent in `crew/sma_crew.py`
4. Add agent tests in `tests/` directory
5. Update documentation

### **Contributing Guidelines**
- Follow PEP 8 style guidelines
- Write comprehensive tests for new features
- Update documentation for API changes
- Use type hints for all functions
- Add logging for debugging purposes

---

**Made with ❤️ for Academic Intelligence**

*Empowering education through intelligent web monitoring*
