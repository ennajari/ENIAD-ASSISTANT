/**
 * RAG API Service - Integration with ENIAD RAG Project
 * Handles communication with your custom RAG system
 * API Structure: /api/v1/nlp/index/answer/{project_id}
 */

import axios from 'axios';

class RAGApiService {
  constructor() {
    // API Configuration - matches your RAG_Project structure
    this.baseURL = import.meta.env.VITE_RAG_API_BASE_URL || 'http://localhost:8000';
    this.apiKey = import.meta.env.VITE_RAG_API_KEY;
    this.projectId = import.meta.env.VITE_RAG_PROJECT_ID || 'eniad-assistant';
    this.timeout = 30000; // 30 seconds timeout

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

    // Request interceptor for logging and auth
    this.api.interceptors.request.use(
      (config) => {
        console.log('🚀 RAG API Request:', {
          url: config.url,
          method: config.method,
          hasAuth: !!config.headers.Authorization
        });
        return config;
      },
      (error) => {
        console.error('❌ RAG API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ RAG API Response:', {
          status: response.status,
          url: response.config.url
        });
        return response;
      },
      (error) => {
        console.error('❌ RAG API Response Error:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: error.config?.url
        });
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  /**
   * Send a query to your RAG system
   * Uses your endpoint: /api/v1/nlp/index/answer/{project_id}
   * @param {Object} params - Query parameters
   * @param {string} params.query - User's question
   * @param {string} params.language - Language code (fr, en, ar)
   * @param {string} params.userId - User ID for personalization
   * @param {Array} params.context - Previous conversation context
   * @param {Object} params.options - Additional options
   * @returns {Promise<Object>} RAG response
   */
  async query({
    query,
    language = 'fr',
    userId = null,
    context = [],
    options = {}
  }) {
    try {
      const {
        limit = 5,
        projectId = this.projectId
      } = options;

      // Prepare payload according to your SearchRequest schema
      const payload = {
        text: query.trim(),
        limit: limit
      };

      console.log('📝 Sending RAG query to your system:', {
        endpoint: `/api/v1/nlp/index/answer/${projectId}`,
        query: query.substring(0, 100) + '...',
        language,
        limit
      });

      // Call your RAG answer endpoint
      const response = await this.api.post(`/api/v1/nlp/index/answer/${projectId}`, payload);

      return this.formatYourRagResponse(response.data, query, language);
    } catch (error) {
      console.error('❌ RAG query failed:', error);
      throw error;
    }
  }

  /**
   * Search documents using your RAG system
   * Uses your endpoint: /api/v1/nlp/index/search/{project_id}
   * @param {string} query - Search query
   * @param {string} language - Language code
   * @param {number} limit - Number of results
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} Search results
   */
  async searchDocuments(query, language = 'fr', limit = 5, projectId = null) {
    try {
      const pid = projectId || this.projectId;

      const payload = {
        text: query.trim(),
        limit: limit
      };

      console.log('🔍 Searching documents in your RAG system:', {
        endpoint: `/api/v1/nlp/index/search/${pid}`,
        query: query.substring(0, 50) + '...',
        limit
      });

      const response = await this.api.post(`/api/v1/nlp/index/search/${pid}`, payload);

      if (response.data.signal === 'VECTORDB_SEARCH_SUCCESS') {
        return response.data.results || [];
      } else {
        console.warn('⚠️ Search returned non-success signal:', response.data.signal);
        return [];
      }
    } catch (error) {
      console.error('❌ Document search failed:', error);
      return [];
    }
  }

  /**
   * Get project index information
   * Uses your endpoint: /api/v1/nlp/index/info/{project_id}
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Index information
   */
  async getProjectInfo(projectId = null) {
    try {
      const pid = projectId || this.projectId;

      console.log('📊 Getting project info from your RAG system:', {
        endpoint: `/api/v1/nlp/index/info/${pid}`
      });

      const response = await this.api.get(`/api/v1/nlp/index/info/${pid}`);

      if (response.data.signal === 'VECTORDB_COLLECTION_RETRIEVED') {
        return {
          status: 'success',
          info: response.data.collection_info,
          projectId: pid
        };
      } else {
        console.warn('⚠️ Project info returned non-success signal:', response.data.signal);
        return {
          status: 'error',
          message: 'Failed to retrieve project info'
        };
      }
    } catch (error) {
      console.error('❌ Get project info failed:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Get system health status by checking project info
   * @returns {Promise<Object>} Health status
   */
  async getHealthStatus() {
    try {
      const projectInfo = await this.getProjectInfo();
      return {
        status: projectInfo.status === 'success' ? 'healthy' : 'unhealthy',
        projectId: this.projectId,
        baseURL: this.baseURL,
        ...projectInfo
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        projectId: this.projectId,
        baseURL: this.baseURL
      };
    }
  }

  /**
   * Format your RAG API response
   * @param {Object} data - Raw API response from your system
   * @param {string} originalQuery - Original user query
   * @param {string} language - Language code
   * @returns {Object} Formatted response
   */
  formatYourRagResponse(data, originalQuery, language) {
    // Check if the response is successful
    if (data.signal !== 'RAG_ANSWER_SUCCESS') {
      throw new Error(`RAG API returned error signal: ${data.signal}`);
    }

    return {
      id: Date.now().toString(),
      content: data.answer || '',
      sources: this.extractSourcesFromPrompt(data.full_prompt),
      confidence: 0.85, // Your system doesn't return confidence, so we set a default
      language: language,
      tokens_used: 0, // Your system doesn't return token count
      processing_time: 0, // Your system doesn't return processing time
      metadata: {
        model: 'eniad-rag-project',
        timestamp: new Date().toISOString(),
        signal: data.signal,
        full_prompt: data.full_prompt,
        chat_history: data.chat_history,
        original_query: originalQuery
      }
    };
  }

  /**
   * Extract sources from the full prompt (if available)
   * @param {string} fullPrompt - Full prompt from your RAG system
   * @returns {Array} Extracted sources
   */
  extractSourcesFromPrompt(fullPrompt) {
    // This is a simple implementation - you can enhance it based on your prompt structure
    if (!fullPrompt) return [];

    try {
      // Look for patterns that might indicate sources in the prompt
      const sourcePatterns = [
        /Source:\s*(.+?)(?:\n|$)/gi,
        /Reference:\s*(.+?)(?:\n|$)/gi,
        /Document:\s*(.+?)(?:\n|$)/gi
      ];

      const sources = [];
      sourcePatterns.forEach(pattern => {
        const matches = fullPrompt.matchAll(pattern);
        for (const match of matches) {
          sources.push({
            title: match[1].trim(),
            type: 'document',
            relevance: 0.8
          });
        }
      });

      return sources.slice(0, 5); // Limit to 5 sources
    } catch (error) {
      console.warn('⚠️ Failed to extract sources from prompt:', error);
      return [];
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Axios error
   * @returns {Error} Formatted error
   */
  handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || 'API Error';
      
      switch (status) {
        case 401:
          return new Error('Authentication failed. Please check your API key.');
        case 403:
          return new Error('Access denied. Insufficient permissions.');
        case 429:
          return new Error('Rate limit exceeded. Please try again later.');
        case 500:
          return new Error('Internal server error. Please try again.');
        case 503:
          return new Error('Service temporarily unavailable. Please try again later.');
        default:
          return new Error(`API Error (${status}): ${message}`);
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection and try again.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }

  /**
   * Test API connection
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      await this.getHealthStatus();
      return true;
    } catch (error) {
      console.error('❌ RAG API connection test failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const ragApiService = new RAGApiService();

export default ragApiService;
