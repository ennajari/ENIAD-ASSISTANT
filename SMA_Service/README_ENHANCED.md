# 🧠 ENIAD Enhanced Multi-Agent System (SMA)

A sophisticated Multi-Agent System designed for intelligent web scraping, document processing, and knowledge retrieval using advanced AI technologies.

## 🌟 Features

### 🤖 **7 Specialized Agents**
- **🕷️ Web Scraper Agent**: Advanced web content extraction with respect for robots.txt
- **📄 PDF Reader Agent**: Comprehensive PDF text extraction using multiple engines
- **🖼️ Image OCR Agent**: Multi-language OCR with image preprocessing
- **🧠 Content Analyzer Agent**: AI-powered content analysis and categorization
- **✂️ Extractor Agent**: Semantic content chunking and organization
- **🤖 RAG Agent**: Retrieval-Augmented Generation with vector search
- **🎯 Coordinator Agent**: Master orchestrator for complex workflows

### 🚀 **Advanced Capabilities**
- **Multi-language Support**: French, Arabic, English
- **Real-time Processing**: Live web scraping and content analysis
- **Vector Search**: ChromaDB-powered semantic search
- **OCR Processing**: Extract text from images with high accuracy
- **PDF Processing**: Handle complex PDF structures and metadata
- **Workflow Optimization**: Intelligent task coordination and error recovery
- **Knowledge Base Management**: Persistent vector storage for RAG

### 🔧 **Workflow Types**
1. **Comprehensive Search**: Web scraping + Content analysis + RAG
2. **Document Processing**: PDF/Image processing + Knowledge base updates
3. **RAG Queries**: Intelligent question answering with sources
4. **Content Extraction**: Multi-source content organization
5. **Batch Processing**: Handle multiple content types simultaneously
6. **Intelligent Search**: Combine web search and RAG for optimal answers

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Windows/Linux/Mac
- 4GB+ RAM recommended
- Internet connection

### Installation & Launch

#### Windows
```bash
# Clone and navigate to SMA_Service
cd SMA_Service

# Run the enhanced startup script
start_sma.bat
```

#### Linux/Mac
```bash
# Clone and navigate to SMA_Service
cd SMA_Service

# Make executable and run
chmod +x start_sma.sh
./start_sma.sh
```

The service will automatically:
- ✅ Create Python virtual environment
- ✅ Install all dependencies
- ✅ Set up configuration files
- ✅ Initialize vector database
- ✅ Start all 7 agents
- ✅ Launch FastAPI server

## 🌐 Access Points

Once started, access the system via:

- **🏠 Main API**: http://localhost:8001
- **📊 Health Check**: http://localhost:8001/health
- **🤖 SMA Status**: http://localhost:8001/sma/status
- **📚 API Docs**: http://localhost:8001/docs
- **🧪 SMA Test Interface**: `file:///path/to/SMA_Service/test_sma.html`
- **🧠 RAG Test Interface**: `file:///path/to/SMA_Service/test_rag.html`

## 📡 API Endpoints

### Core System
- `GET /health` - System health and agent status
- `GET /sma/status` - Detailed SMA system information
- `GET /` - Service information

### Search & Intelligence
- `POST /sma/search` - Execute comprehensive search mission
- `POST /sma/updates` - Get latest updates from monitored sites
- `POST /sma/extract` - Extract and organize content

### Document Processing
- `POST /sma/process-documents` - Process PDFs and images
- `POST /sma/batch-process` - Handle multiple content types

### RAG System
- `POST /rag/query` - Ask questions using RAG
- `POST /rag/search-summarize` - Search and summarize documents
- `POST /rag/update-kb` - Update knowledge base
- `GET /rag/stats` - Knowledge base statistics

### Monitoring
- `POST /sma/monitor/start` - Start website monitoring
- `GET /sma/monitor/{id}/status` - Check monitoring status
- `DELETE /sma/monitor/{id}` - Stop monitoring

## 🔧 Configuration

### Environment Variables (.env)
```env
# Application Settings
APP_NAME=ENIAD Enhanced SMA Service
APP_VERSION=1.0.0
DEBUG=true

# Server Settings
HOST=0.0.0.0
PORT=8001
RELOAD=true

# Scraping Settings
SCRAPING_DELAY=2.0
MAX_CONCURRENT_REQUESTS=5
REQUEST_TIMEOUT=30
MAX_RETRIES=3

# Content Processing
MAX_CONTENT_LENGTH=10000
MAX_KEYWORDS=10
SUMMARY_MAX_LENGTH=200

# Vector Database
VECTOR_DB_PATH=./chroma_db
EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2

# AI Service Keys (Optional)
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
```

### Target Websites
Default monitored sites:
- **ENIAD**: https://eniad.ump.ma/fr
- **UMP**: https://www.ump.ma/

## 🧪 Testing

### Using Test Interfaces

1. **SMA Test Interface** (`test_sma.html`):
   - System health monitoring
   - Comprehensive search missions
   - Document processing
   - Content extraction
   - Agent status overview

2. **RAG Test Interface** (`test_rag.html`):
   - Knowledge base statistics
   - Interactive RAG chat
   - Advanced query testing
   - Knowledge base management

### Example API Calls

#### Comprehensive Search
```bash
curl -X POST "http://localhost:8001/sma/search" \
-H "Content-Type: application/json" \
-d '{
  "query": "formations intelligence artificielle ENIAD",
  "language": "fr",
  "target_sites": [
    {"name": "ENIAD", "url": "https://eniad.ump.ma/fr"}
  ],
  "categories": ["news", "documents", "announcements"],
  "max_results": 10
}'
```

#### RAG Query
```bash
curl -X POST "http://localhost:8001/rag/query" \
-H "Content-Type: application/json" \
-d '{
  "query": "Quelles sont les formations disponibles à ENIAD?",
  "language": "fr",
  "max_docs": 5,
  "include_sources": true
}'
```

#### Document Processing
```bash
curl -X POST "http://localhost:8001/sma/process-documents" \
-H "Content-Type: application/json" \
-d '{
  "documents": [
    {"url": "https://example.com/document.pdf", "type": "pdf"}
  ],
  "update_knowledge_base": true
}'
```

## 📦 Dependencies

### Core Framework
- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

### Multi-Agent Framework
- **CrewAI**: Agent orchestration
- **LangChain**: AI workflow management

### Web Scraping
- **BeautifulSoup4**: HTML parsing
- **Requests**: HTTP client
- **aiohttp**: Async HTTP

### Document Processing
- **PyPDF2**: PDF text extraction
- **pdfplumber**: Advanced PDF processing
- **Pillow**: Image processing
- **pytesseract**: OCR engine
- **opencv-python**: Image preprocessing

### AI & Vector Search
- **Google Generative AI**: Gemini integration
- **ChromaDB**: Vector database
- **sentence-transformers**: Text embeddings
- **faiss-cpu**: Vector similarity search

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ENIAD Enhanced SMA System                │
├─────────────────────────────────────────────────────────────┤
│  🎯 Coordinator Agent (Master Orchestrator)                │
├─────────────────────────────────────────────────────────────┤
│  🕷️ Web Scraper  │  📄 PDF Reader  │  🖼️ Image OCR      │
│  🧠 Analyzer     │  ✂️ Extractor   │  🤖 RAG Agent      │
├─────────────────────────────────────────────────────────────┤
│  📊 Vector Store (ChromaDB) │  🔍 Gemini AI Integration   │
├─────────────────────────────────────────────────────────────┤
│  🌐 FastAPI Server │  📡 REST API  │  🧪 Test Interfaces │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Monitoring & Debugging

### Logs
- Application logs: `logs/sma_service.log`
- Agent logs: Individual agent logging
- Error tracking: Comprehensive error handling

### Health Checks
- System health: `/health`
- Agent status: `/sma/status`
- Vector store: `/rag/health`

### Performance Metrics
- Response times
- Success rates
- Agent utilization
- Knowledge base statistics

## 🚨 Troubleshooting

### Common Issues

1. **Dependencies not installing**:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt --force-reinstall
   ```

2. **OCR not working**:
   - Install Tesseract: https://github.com/tesseract-ocr/tesseract
   - Add to PATH environment variable

3. **Vector database issues**:
   ```bash
   # Clear and reinitialize
   rm -rf chroma_db/
   # Restart service
   ```

4. **Memory issues**:
   - Reduce `MAX_CONCURRENT_REQUESTS`
   - Increase system RAM
   - Use smaller embedding models

### Support
- Check logs in `logs/` directory
- Use test interfaces for debugging
- Monitor agent status via API

## 📄 License

MIT License - See LICENSE file for details

---

**🧠 Powered by Advanced AI • 🤖 Multi-Agent Architecture • 🚀 Real-time Processing**
