# 🧠 ENIAD Smart Multi-Agent (SMA) Service

## 📋 **Overview**

The ENIAD Smart Multi-Agent (SMA) Service is an intelligent web monitoring and information extraction system designed to scan and analyze the ENIAD and UMP websites for real-time updates, documents, news, photos, and announcements.

### **🎯 Key Features**

- **🕷️ Intelligent Web Scraping** - Advanced scraping with respect for robots.txt
- **🤖 Multi-Agent Architecture** - CrewAI-powered agent coordination
- **🔍 Real-time Search** - Live website scanning and information extraction
- **📊 Content Analysis** - NLP-powered content categorization and analysis
- **🌍 Multilingual Support** - French, English, and Arabic content processing
- **⚡ Fast API Integration** - RESTful API for seamless integration

---

## 🏗️ **Architecture**

### **Agent System**
- **WebScraperAgent** - Specialized web scraping and content extraction
- **ContentAnalyzerAgent** - NLP analysis and content categorization
- **InformationExtractorAgent** - Document and media extraction
- **MonitoringAgent** - Continuous website monitoring

### **Target Websites**
- **ENIAD**: https://eniad.ump.ma/fr
- **UMP**: https://www.ump.ma/

### **Content Categories**
- 📰 News and Announcements
- 📄 Documents (PDF, DOC, etc.)
- 🖼️ Photos and Images
- 📅 Events and Calendar
- 🔬 Research Publications
- 📚 Academic Information

---

## 🚀 **Quick Start**

### **Prerequisites**
- Python 3.8+
- pip package manager
- Internet connection for web scraping

### **Installation**

#### **Linux/macOS**
```bash
cd SMA_Service
chmod +x start_sma.sh
./start_sma.sh
```

#### **Windows**
```cmd
cd SMA_Service
start_sma.bat
```

#### **Manual Installation**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the service
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### **Access Points**
- **API Service**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs
- **Health Check**: http://localhost:8001/sma/status

---

## 🔌 **API Endpoints**

### **🔍 Search Operations**

#### **Activate SMA Search**
```http
POST /sma/search
```
**Request Body:**
```json
{
  "query": "nouvelles formations ENIAD",
  "language": "fr",
  "categories": ["news", "documents", "announcements"],
  "target_sites": [
    {
      "name": "ENIAD",
      "url": "https://eniad.ump.ma/fr",
      "priority": "high",
      "categories": ["news", "documents", "announcements", "events", "photos"]
    }
  ],
  "real_time": true,
  "max_results": 20
}
```

#### **Get Latest Updates**
```http
POST /sma/updates
```
**Request Body:**
```json
{
  "language": "fr",
  "time_range": "24h",
  "target_sites": [...],
  "include_metadata": true
}
```

### **🔬 Extraction Operations**

#### **Extract Information**
```http
POST /sma/extract
```
**Request Body:**
```json
{
  "extraction_type": "documents",
  "language": "fr",
  "target_sites": [...],
  "deep_scan": true
}
```

### **👁️ Monitoring Operations**

#### **Start Monitoring**
```http
POST /sma/monitor/start
```

#### **Get Monitoring Status**
```http
GET /sma/monitor/{monitoring_id}/status
```

#### **Stop Monitoring**
```http
DELETE /sma/monitor/{monitoring_id}
```

### **📊 System Operations**

#### **Get System Status**
```http
GET /sma/status
```

---

## ⚙️ **Configuration**

### **Environment Variables**
Create a `.env` file in the SMA_Service directory:

```env
# Application Settings
APP_NAME=ENIAD SMA Service
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

# Monitoring
DEFAULT_MONITORING_INTERVAL=1h
MAX_MONITORING_TASKS=10

# Language Settings
DEFAULT_LANGUAGE=fr
SUPPORTED_LANGUAGES=fr,en,ar

# Logging
LOG_LEVEL=INFO

# Optional AI Service Keys
# OPENAI_API_KEY=your_openai_key_here
# ANTHROPIC_API_KEY=your_anthropic_key_here
# COHERE_API_KEY=your_cohere_key_here
```

---

## 🔗 **Integration with ENIAD Interface**

### **Frontend Integration**
The SMA service is automatically integrated with the ENIAD chatbot interface:

1. **SMA Toggle Button** - Brain icon in chat input
2. **Real-time Search** - Activated when SMA is enabled
3. **Enhanced Responses** - RAG responses enriched with SMA data
4. **Source Attribution** - Combined sources from RAG and SMA

### **Usage in Chat**
1. Click the brain icon (🧠) to activate SMA
2. Ask questions about ENIAD or UMP
3. SMA will scan websites in real-time
4. Results are integrated into the AI response

---

## 📊 **Monitoring & Analytics**

### **System Health**
- **Agent Status** - Monitor individual agent performance
- **Website Availability** - Track target website accessibility
- **Response Times** - Monitor scraping and analysis performance
- **Error Rates** - Track and log system errors

### **Content Analytics**
- **Content Categories** - Distribution of extracted content types
- **Language Detection** - Automatic language identification
- **Relevance Scoring** - Content relevance to user queries
- **Update Frequency** - Website change detection

---

## 🛡️ **Security & Ethics**

### **Responsible Scraping**
- **Rate Limiting** - Configurable delays between requests
- **Robots.txt Compliance** - Respect website scraping policies
- **User-Agent Headers** - Proper identification in requests
- **Error Handling** - Graceful handling of blocked requests

### **Data Privacy**
- **No Personal Data** - Only public information extraction
- **Temporary Storage** - No permanent data storage
- **Secure Transmission** - HTTPS for all external requests

---

## 🔧 **Development**

### **Adding New Agents**
1. Create agent class in `agents/` directory
2. Implement required methods and tools
3. Register agent in `crew/sma_crew.py`
4. Update API endpoints as needed

### **Adding New Websites**
1. Update `target_websites` in settings
2. Add website-specific scraping logic
3. Test scraping compliance and performance

### **Testing**
```bash
# Run tests
pytest tests/

# Run with coverage
pytest --cov=. tests/
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Service Won't Start**
- Check Python version (3.8+ required)
- Verify all dependencies are installed
- Check port 8001 is available

#### **Scraping Errors**
- Verify internet connection
- Check if target websites are accessible
- Review rate limiting settings

#### **Performance Issues**
- Adjust `SCRAPING_DELAY` for slower scraping
- Reduce `MAX_CONCURRENT_REQUESTS`
- Increase `REQUEST_TIMEOUT` for slow websites

### **Logs**
Check logs in the `logs/` directory for detailed error information.

---

## 📈 **Performance Optimization**

### **Scraping Performance**
- **Concurrent Requests** - Configurable parallel processing
- **Caching** - Intelligent content caching
- **Rate Limiting** - Respectful request timing

### **Analysis Performance**
- **Batch Processing** - Efficient content analysis
- **Keyword Extraction** - Optimized NLP processing
- **Memory Management** - Efficient resource usage

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests for new functionality
5. Submit a pull request

---

## 📄 **License**

This project is part of the ENIAD Academic Assistant and follows the same MIT License.

---

## 🆘 **Support**

For issues and questions:
- Check the [troubleshooting section](#-troubleshooting)
- Review API documentation at http://localhost:8001/docs
- Contact the development team

---

**🧠 Intelligent Web Monitoring for Academic Excellence**
