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
   * Activate SMA search for specific query
   * @param {Object} params - Search parameters
   * @param {string} params.query - User's search query
   * @param {string} params.language - Language preference (fr, en, ar)
   * @param {Array} params.categories - Categories to search ['news', 'documents', 'photos', 'events']
   * @param {boolean} params.realTime - Whether to perform real-time scraping
   * @returns {Promise<Object>} SMA search results
   */
  async activateSearch({
    query,
    language = 'fr',
    categories = ['news', 'documents', 'announcements'],
    realTime = true
  }) {
    try {
      const payload = {
        query: query.trim(),
        language,
        categories,
        target_sites: this.targetSites,
        real_time: realTime,
        max_results: 20,
        include_metadata: true,
        extract_images: true,
        extract_documents: true
      };

      console.log('🔍 Activating SMA search:', {
        query: query.substring(0, 50) + '...',
        language,
        categories,
        realTime
      });

      const response = await this.api.post('/sma/search', payload);
      
      return this.formatSearchResults(response.data, query);
    } catch (error) {
      console.error('❌ SMA search failed:', error);
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
   * Format search results for the interface
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
        websites_scanned: data.websites_scanned || this.targetSites.length
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
