/**
 * Smart Multi-Agent (SMA) Service
 * Orchestrates web scraping and information extraction using CrewAI and LangChain
 * Monitors ENIAD and UMP websites for updates, documents, news, and photos
 */

import axios from 'axios';

class SMAService {
  constructor() {
    // SMA API Configuration
    this.baseURL = import.meta.env.VITE_SMA_API_BASE_URL || 'http://localhost:8001';
    this.apiKey = import.meta.env.VITE_SMA_API_KEY;
    this.timeout = 60000; // 60 seconds for web scraping
    
    // Target websites
    this.targetSites = [
      {
        name: 'ENIAD',
        url: 'https://eniad.ump.ma/fr',
        priority: 'high',
        categories: ['news', 'documents', 'announcements', 'events', 'photos']
      },
      {
        name: 'UMP',
        url: 'https://www.ump.ma/',
        priority: 'medium',
        categories: ['news', 'documents', 'research', 'events', 'photos']
      }
    ];

    // Initialize axios instance
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      }
    });

    // Setup request/response interceptors
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log('🤖 SMA Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          timestamp: new Date().toISOString()
        });
        return config;
      },
      (error) => {
        console.error('❌ SMA Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ SMA Response:', {
          status: response.status,
          url: response.config.url,
          dataSize: JSON.stringify(response.data).length
        });
        return response;
      },
      (error) => {
        console.error('❌ SMA Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Activate enhanced SMA search for specific query
   * @param {Object} params - Search parameters
   * @param {string} params.query - User's search query
   * @param {string} params.language - Language preference (fr, en, ar)
   * @param {Array} params.categories - Categories to search ['news', 'documents', 'photos', 'events']
   * @param {boolean} params.realTime - Whether to perform real-time scraping
   * @param {number} params.maxResults - Maximum number of results
   * @returns {Promise<Object>} Enhanced SMA search results
   */
  async activateSearch({
    query,
    language = 'fr',
    categories = ['news', 'documents', 'announcements'],
    realTime = true,
    maxResults = 20
  }) {
    try {
      // First try the enhanced intelligent query endpoint
      try {
        console.log('🧠 Activating enhanced SMA intelligent query:', {
          query: query.substring(0, 50) + '...',
          language,
          categories,
          realTime
        });

        const enhancedPayload = {
          query: query.trim(),
          language,
          search_depth: realTime ? 'deep' : 'medium',
          include_documents: categories.includes('documents'),
          include_images: categories.includes('photos') || categories.includes('images'),
          include_news: categories.includes('news') || categories.includes('announcements'),
          max_results: maxResults,
          store_in_knowledge_base: true
        };

        const enhancedResponse = await this.api.post('/sma/intelligent-query', enhancedPayload);

        if (enhancedResponse.data) {
          console.log('✅ Enhanced SMA query successful');
          return this.formatEnhancedSearchResults(enhancedResponse.data, query);
        }
      } catch (enhancedError) {
        console.warn('⚠️ Enhanced SMA failed, trying comprehensive search:', enhancedError.message);

        // Fallback to comprehensive search
        try {
          const comprehensivePayload = {
            query: query.trim(),
            language,
            search_depth: 'medium',
            include_documents: categories.includes('documents'),
            include_images: categories.includes('photos') || categories.includes('images'),
            include_news: categories.includes('news'),
            max_results: maxResults
          };

          const comprehensiveResponse = await this.api.post('/sma/comprehensive-search', comprehensivePayload);

          if (comprehensiveResponse.data) {
            console.log('✅ Comprehensive SMA search successful');
            return this.formatComprehensiveSearchResults(comprehensiveResponse.data, query);
          }
        } catch (comprehensiveError) {
          console.warn('⚠️ Comprehensive search failed, trying basic search:', comprehensiveError.message);
        }
      }

      // Final fallback to basic search
      const basicPayload = {
        query: query.trim(),
        language,
        categories,
        target_sites: this.targetSites,
        real_time: realTime,
        max_results: maxResults,
        include_metadata: true,
        extract_images: true,
        extract_documents: true
      };

      console.log('🔍 Using basic SMA search as fallback');
      const response = await this.api.post('/sma/search', basicPayload);

      return this.formatSearchResults(response.data, query);

    } catch (error) {
      console.error('❌ All SMA search methods failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get latest updates from monitored websites
   * @param {Object} params - Update parameters
   * @param {string} params.language - Language preference
   * @param {number} params.hours - Hours to look back for updates
   * @returns {Promise<Object>} Latest updates
   */
  async getLatestUpdates({
    language = 'fr',
    hours = 24
  }) {
    try {
      const payload = {
        language,
        time_range: `${hours}h`,
        target_sites: this.targetSites,
        include_metadata: true
      };

      console.log('📰 Getting latest updates:', { language, hours });

      const response = await this.api.post('/sma/updates', payload);
      
      return this.formatUpdateResults(response.data);
    } catch (error) {
      console.error('❌ Get updates failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Extract specific information from websites
   * @param {Object} params - Extraction parameters
   * @param {string} params.extractionType - Type of extraction ('documents', 'photos', 'news', 'events')
   * @param {string} params.language - Language preference
   * @returns {Promise<Object>} Extracted information
   */
  async extractInformation({
    extractionType = 'documents',
    language = 'fr'
  }) {
    try {
      const payload = {
        extraction_type: extractionType,
        language,
        target_sites: this.targetSites,
        deep_scan: true,
        include_metadata: true
      };

      console.log('🔬 Extracting information:', { extractionType, language });

      const response = await this.api.post('/sma/extract', payload);
      
      return this.formatExtractionResults(response.data, extractionType);
    } catch (error) {
      console.error('❌ Information extraction failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Monitor websites for changes
   * @param {Object} params - Monitoring parameters
   * @returns {Promise<Object>} Monitoring status
   */
  async startMonitoring({
    interval = '1h',
    categories = ['news', 'documents', 'announcements']
  }) {
    try {
      const payload = {
        target_sites: this.targetSites,
        monitoring_interval: interval,
        categories,
        notify_on_changes: true
      };

      console.log('👁️ Starting website monitoring:', { interval, categories });

      const response = await this.api.post('/sma/monitor/start', payload);
      
      return {
        status: 'monitoring_started',
        monitoring_id: response.data.monitoring_id,
        interval,
        categories,
        target_sites: this.targetSites.map(site => site.name)
      };
    } catch (error) {
      console.error('❌ Start monitoring failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get SMA system status
   * @returns {Promise<Object>} System status
   */
  async getSystemStatus() {
    try {
      const response = await this.api.get('/sma/status');
      
      return {
        status: 'operational',
        agents_active: response.data.agents_active || 0,
        last_scan: response.data.last_scan,
        websites_monitored: this.targetSites.length,
        ...response.data
      };
    } catch (error) {
      console.error('❌ Get system status failed:', error);
      return {
        status: 'error',
        error: error.message,
        websites_monitored: this.targetSites.length
      };
    }
  }

  /**
   * Format enhanced search results from intelligent query
   * @param {Object} data - Enhanced search results
   * @param {string} query - Original query
   * @returns {Object} Formatted results
   */
  formatEnhancedSearchResults(data, query) {
    const results = [];

    // Process web content
    const webContent = data.comprehensive_search?.results?.web_content || [];
    webContent.forEach((item, index) => {
      results.push({
        id: `enhanced_web_${index}`,
        title: item.title || 'Contenu Web ENIAD',
        content: item.content || '',
        summary: item.content?.substring(0, 200) + '...' || '',
        source_url: item.url || '',
        category: 'web',
        relevance: item.relevance || 1,
        timestamp: item.timestamp || new Date().toISOString(),
        type: 'enhanced_web'
      });
    });

    // Process documents
    const documents = data.comprehensive_search?.results?.documents || [];
    documents.forEach((item, index) => {
      results.push({
        id: `enhanced_doc_${index}`,
        title: item.title || 'Document ENIAD',
        content: item.text || '',
        summary: item.text?.substring(0, 200) + '...' || '',
        source_url: item.url || '',
        category: 'documents',
        relevance: 5, // High relevance for documents
        timestamp: item.processed_timestamp || new Date().toISOString(),
        type: 'enhanced_document'
      });
    });

    // Process images
    const images = data.comprehensive_search?.results?.images || [];
    images.forEach((item, index) => {
      results.push({
        id: `enhanced_img_${index}`,
        title: item.alt_text || 'Image ENIAD',
        content: item.text || item.alt_text || '',
        summary: `Image: ${item.text || item.alt_text || 'Contenu visuel'}`,
        source_url: item.url || '',
        category: 'images',
        relevance: item.confidence || 0.6,
        timestamp: item.processed_timestamp || new Date().toISOString(),
        type: 'enhanced_image'
      });
    });

    // Process news
    const news = data.news_results?.results || [];
    news.forEach((item, index) => {
      results.push({
        id: `enhanced_news_${index}`,
        title: item.title || 'Actualité',
        content: item.snippet || '',
        summary: item.snippet?.substring(0, 200) + '...' || '',
        source_url: item.link || '',
        category: 'news',
        relevance: item.relevance_score || 0.7,
        timestamp: item.date || new Date().toISOString(),
        type: 'enhanced_news'
      });
    });

    return {
      id: Date.now().toString(),
      query,
      results,
      total_found: results.length,
      sources: this.extractEnhancedSources(data),
      categories: this.categorizeResults(results),
      metadata: {
        search_time: 0,
        agents_used: ['enhanced_sma', 'web_scraper', 'document_processor', 'image_ocr'],
        timestamp: data.timestamp || new Date().toISOString(),
        websites_scanned: 13, // Updated count with news pages
        confidence: data.confidence || 0.8,
        processing_steps: data.processing_steps || [],
        enhanced: true
      },
      enhancedData: {
        finalAnswer: data.final_answer,
        understanding: data.understanding,
        confidence: data.confidence
      }
    };
  }

  /**
   * Format comprehensive search results
   * @param {Object} data - Comprehensive search results
   * @param {string} query - Original query
   * @returns {Object} Formatted results
   */
  formatComprehensiveSearchResults(data, query) {
    const results = [];

    // Process web content
    const webContent = data.results?.web_content || [];
    webContent.forEach((item, index) => {
      results.push({
        id: `comp_web_${index}`,
        title: item.title || 'Contenu Web',
        content: item.content || '',
        summary: item.content?.substring(0, 200) + '...' || '',
        source_url: item.url || '',
        category: 'web',
        relevance: item.relevance || 1,
        timestamp: item.timestamp || new Date().toISOString(),
        type: 'comprehensive_web'
      });
    });

    return {
      id: Date.now().toString(),
      query,
      results,
      total_found: data.total_items_found || results.length,
      sources: this.extractSources(results),
      categories: this.categorizeResults(results),
      metadata: {
        search_time: 0,
        agents_used: ['comprehensive_sma', 'web_scraper'],
        timestamp: data.timestamp || new Date().toISOString(),
        websites_scanned: 13,
        search_depth: data.search_depth || 'medium',
        comprehensive: true
      }
    };
  }

  /**
   * Format basic search results for the interface
   * @param {Object} data - Raw search results
   * @param {string} query - Original query
   * @returns {Object} Formatted results
   */
  formatSearchResults(data, query) {
    return {
      id: Date.now().toString(),
      query,
      results: data.results || [],
      total_found: data.total_found || 0,
      sources: this.extractSources(data.results),
      categories: this.categorizeResults(data.results),
      metadata: {
        search_time: data.search_time || 0,
        agents_used: data.agents_used || [],
        timestamp: new Date().toISOString(),
        websites_scanned: data.websites_scanned || this.targetSites.length,
        basic: true
      }
    };
  }

  /**
   * Format update results
   * @param {Object} data - Raw update data
   * @returns {Object} Formatted updates
   */
  formatUpdateResults(data) {
    return {
      updates: data.updates || [],
      total_updates: data.total_updates || 0,
      by_website: this.groupByWebsite(data.updates),
      by_category: this.groupByCategory(data.updates),
      metadata: {
        scan_time: data.scan_time || 0,
        last_update: data.last_update,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Format extraction results
   * @param {Object} data - Raw extraction data
   * @param {string} type - Extraction type
   * @returns {Object} Formatted extraction
   */
  formatExtractionResults(data, type) {
    return {
      extraction_type: type,
      items: data.items || [],
      total_extracted: data.total_extracted || 0,
      by_website: this.groupByWebsite(data.items),
      metadata: {
        extraction_time: data.extraction_time || 0,
        deep_scan: data.deep_scan || false,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Extract sources from enhanced results
   * @param {Object} data - Enhanced search data
   * @returns {Array} Sources
   */
  extractEnhancedSources(data) {
    const sources = [];

    // Add sources from the enhanced data
    if (data.sources && Array.isArray(data.sources)) {
      data.sources.forEach(source => {
        sources.push({
          url: source.url || '',
          title: source.title || '',
          website: this.getWebsiteName(source.url || ''),
          type: source.type || 'web',
          relevance: source.relevance || 'medium'
        });
      });
    }

    // Add sources from comprehensive search results
    const webContent = data.comprehensive_search?.results?.web_content || [];
    webContent.forEach(item => {
      if (item.url) {
        sources.push({
          url: item.url,
          title: item.title || '',
          website: this.getWebsiteName(item.url),
          type: 'web_content',
          relevance: 'high'
        });
      }
    });

    // Add document sources
    const documents = data.comprehensive_search?.results?.documents || [];
    documents.forEach(item => {
      if (item.url) {
        sources.push({
          url: item.url,
          title: item.title || 'Document',
          website: this.getWebsiteName(item.url),
          type: 'document',
          relevance: 'high'
        });
      }
    });

    // Remove duplicates
    const uniqueSources = sources.filter((source, index, self) =>
      index === self.findIndex(s => s.url === source.url)
    );

    return uniqueSources;
  }

  /**
   * Extract sources from results
   * @param {Array} results - Search results
   * @returns {Array} Sources
   */
  extractSources(results = []) {
    const sources = new Set();
    results.forEach(result => {
      if (result.source_url) {
        sources.add(result.source_url);
      }
    });
    return Array.from(sources).map(url => ({
      url,
      website: this.getWebsiteName(url),
      type: 'web_scraping'
    }));
  }

  /**
   * Categorize results
   * @param {Array} results - Search results
   * @returns {Object} Categorized results
   */
  categorizeResults(results = []) {
    const categories = {};
    results.forEach(result => {
      const category = result.category || 'general';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(result);
    });
    return categories;
  }

  /**
   * Group items by website
   * @param {Array} items - Items to group
   * @returns {Object} Grouped items
   */
  groupByWebsite(items = []) {
    const grouped = {};
    items.forEach(item => {
      const website = this.getWebsiteName(item.source_url || item.url);
      if (!grouped[website]) {
        grouped[website] = [];
      }
      grouped[website].push(item);
    });
    return grouped;
  }

  /**
   * Group items by category
   * @param {Array} items - Items to group
   * @returns {Object} Grouped items
   */
  groupByCategory(items = []) {
    const grouped = {};
    items.forEach(item => {
      const category = item.category || 'general';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  }

  /**
   * Get website name from URL
   * @param {string} url - URL to analyze
   * @returns {string} Website name
   */
  getWebsiteName(url) {
    if (!url) return 'unknown';
    if (url.includes('eniad.ump.ma')) return 'ENIAD';
    if (url.includes('ump.ma')) return 'UMP';
    return 'other';
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return new Error(`SMA API Error: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('SMA API Error: No response from server. Please check if SMA service is running.');
    } else {
      // Something else happened
      return new Error(`SMA Error: ${error.message}`);
    }
  }
}

// Create and export singleton instance
const smaService = new SMAService();
export default smaService;
