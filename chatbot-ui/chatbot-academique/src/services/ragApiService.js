/**
 * RAG API Service - Integration with ENIAD Custom Llama3 Model
 * Handles communication with your custom Llama3 model API
 * API Structure: /api/chat (Next.js API route)
 */

import axios from 'axios';

class RAGApiService {
  constructor() {
    // Enhanced API Server Configuration (Custom Model + RAG + SMA)
    this.baseURL = import.meta.env.VITE_RAG_API_BASE_URL || '';
    this.apiKey = import.meta.env.VITE_RAG_API_KEY;
    this.projectId = import.meta.env.VITE_RAG_PROJECT_ID || 'eniad-assistant';
    this.timeout = 60000; // 60 seconds timeout for model inference

    // RAG System Configuration (for direct monitoring)
    this.ragSystemURL = import.meta.env.VITE_RAG_SYSTEM_BASE_URL || 'http://localhost:8000';

    // Debug configuration
    console.log('🔧 RAG API Service Configuration:', {
      baseURL: this.baseURL,
      ragSystemURL: this.ragSystemURL,
      hasApiKey: !!this.apiKey,
      projectId: this.projectId,
      timeout: this.timeout
    });

    // Initialize axios instance for Enhanced API Server
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      }
    });

    // Initialize axios instance for RAG System monitoring
    this.ragApi = axios.create({
      baseURL: this.ragSystemURL,
      timeout: 10000, // 10 seconds timeout for health checks
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
   * Send a query to your custom Llama3 model
   * Uses your endpoint: /api/chat (Next.js API route)
   * @param {Object} params - Query parameters
   * @param {string} params.query - User's question
   * @param {string} params.language - Language code (fr, en, ar)
   * @param {string} params.userId - User ID for personalization
   * @param {Array} params.context - Previous conversation context
   * @param {Object} params.options - Additional options
   * @returns {Promise<Object>} Model response
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
        chatId = this.generateChatId(),
        smaResults = null
      } = options;

      // Enhance query with SMA results if available
      let enhancedQuery = query.trim();
      if (smaResults && smaResults.results && smaResults.results.length > 0) {
        console.log('🧠 Enhancing query with SMA results');
        const smaContext = smaResults.results.slice(0, 3).map(result =>
          `${result.title}: ${result.content || result.summary || ''}`
        ).join('\n');

        enhancedQuery = `${query}\n\nRecent information from ENIAD/UMP websites:\n${smaContext}`;
      }

      // Prepare payload for your custom model API
      const payload = {
        chatId: chatId,
        prompt: query, // Use original query, let server handle enhancement
        enableSMA: !!smaResults, // Enable SMA if we have results
        enableRAG: true, // Always enable RAG
        language: language
      };

      console.log('📝 Sending query to custom Llama3 model:', {
        endpoint: '/api/chat',
        query: query.substring(0, 100) + '...',
        language,
        chatId,
        hasSMAResults: !!smaResults
      });

      // Call your custom model API endpoint
      const response = await this.api.post('/api/chat', payload);

      return this.formatCustomModelResponse(response.data, query, language, smaResults);
    } catch (error) {
      console.error('❌ Custom model query failed:', error);
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
   * Get project index information from RAG system
   * Uses RAG system endpoint: /api/v1/nlp/index/info/{project_id}
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Index information
   */
  async getProjectInfo(projectId = null) {
    try {
      const pid = projectId || this.projectId;

      console.log('📊 Getting project info from RAG system:', {
        endpoint: `/api/v1/nlp/index/info/${pid}`,
        ragSystemURL: this.ragSystemURL
      });

      const response = await this.ragApi.get(`/api/v1/nlp/index/info/${pid}`);

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
   * Get RAG system health status by checking the RAG system directly
   * @returns {Promise<Object>} Health status
   */
  async getHealthStatus() {
    try {
      console.log('🔍 Checking RAG system health at:', this.ragSystemURL);

      // Try to check RAG system health
      const response = await this.ragApi.get('/health');

      if (response.status === 200) {
        // Also try to get collection info
        try {
          const infoResponse = await this.ragApi.get(`/api/v1/nlp/index/info/${this.projectId}`);
          return {
            status: 'healthy',
            projectId: this.projectId,
            baseURL: this.ragSystemURL,
            info: infoResponse.data,
            message: 'RAG system is operational'
          };
        } catch (infoError) {
          return {
            status: 'healthy',
            projectId: this.projectId,
            baseURL: this.ragSystemURL,
            message: 'RAG system is running but collection info unavailable',
            warning: infoError.message
          };
        }
      } else {
        return {
          status: 'unhealthy',
          projectId: this.projectId,
          baseURL: this.ragSystemURL,
          error: `RAG system returned status ${response.status}`
        };
      }
    } catch (error) {
      console.warn('⚠️ RAG system health check failed:', error.message);
      return {
        status: 'error',
        error: error.message,
        projectId: this.projectId,
        baseURL: this.ragSystemURL,
        message: 'Cannot connect to RAG system. Make sure the RAG service is running on port 8000.'
      };
    }
  }

  /**
   * Format your custom model API response
   * @param {Object} data - Raw API response from your custom model
   * @param {string} originalQuery - Original user query
   * @param {string} language - Language code
   * @param {Object} smaResults - SMA results if available
   * @returns {Object} Formatted response
   */
  formatCustomModelResponse(data, originalQuery, language, smaResults = null) {
    // Check if the response is successful
    if (!data.success) {
      throw new Error(`Custom model API returned error: ${data.error || 'Unknown error'}`);
    }

    const messageData = data.data;

    // Parse JSON response if the content contains structured data
    let parsedContent = null;
    try {
      // Try to extract JSON from the response content
      const jsonMatch = messageData.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.log('📝 Response is not structured JSON, treating as plain text');
    }

    // Format the response based on whether it's structured or plain text
    let formattedContent = messageData.content;
    let intent = 'general';
    let relatedQuestions = [];

    if (parsedContent) {
      // Structured response from your model
      const parts = [];

      if (parsedContent.contentment) {
        parts.push(parsedContent.contentment);
      }

      if (parsedContent.main_answer) {
        parts.push(parsedContent.main_answer);
      }

      if (parsedContent.details) {
        parts.push(parsedContent.details);
      }

      formattedContent = parts.join('\n\n');
      intent = parsedContent.intent || 'general';

      // Extract related questions
      if (parsedContent.related_questions && Array.isArray(parsedContent.related_questions)) {
        parsedContent.related_questions.forEach(item => {
          if (item.question1) relatedQuestions.push(item.question1);
          if (item.question2) relatedQuestions.push(item.question2);
          if (item.question3) relatedQuestions.push(item.question3);
        });
      }
    }

    return {
      id: Date.now().toString(),
      content: formattedContent,
      sources: smaResults ? this.formatSMASources(smaResults) : [],
      confidence: 0.9, // High confidence for custom model
      language: language,
      tokens_used: 0, // Your API doesn't return token count
      processing_time: 0, // Your API doesn't return processing time
      intent: intent,
      related_questions: relatedQuestions,
      metadata: {
        model: 'ahmed-ouka/llama3-8b-eniad-merged-32bit',
        timestamp: messageData.timestamp ? new Date(messageData.timestamp).toISOString() : new Date().toISOString(),
        original_query: originalQuery,
        has_sma_enhancement: !!smaResults,
        structured_response: !!parsedContent,
        raw_content: messageData.content
      }
    };
  }

  /**
   * Format SMA sources for display
   * @param {Object} smaResults - SMA search results
   * @returns {Array} Formatted sources
   */
  formatSMASources(smaResults) {
    if (!smaResults || !smaResults.results) return [];

    return smaResults.results.slice(0, 5).map((result, index) => ({
      title: result.title || `SMA Result ${index + 1}`,
      url: result.url || '',
      type: result.type || 'web',
      relevance: result.relevance || 0.8,
      summary: result.summary || result.content || '',
      source: 'SMA Web Intelligence'
    }));
  }

  /**
   * Generate a unique chat ID
   * @returns {string} Chat ID
   */
  generateChatId() {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
   * Test API connection with detailed debugging
   * @returns {Promise<Object>} Connection status with details
   */
  async testConnection() {
    console.log('🔍 Testing connection to custom model API...');

    try {
      // Test with a simple ping-like request
      const testPayload = {
        chatId: 'test_connection_' + Date.now(),
        prompt: 'Hello, this is a connection test.'
      };

      console.log('📡 Testing API endpoint:', {
        url: `${this.baseURL}/api/chat`,
        method: 'POST',
        payload: testPayload
      });

      const response = await this.api.post('/api/chat', testPayload);

      console.log('✅ Connection test successful:', {
        status: response.status,
        hasData: !!response.data,
        success: response.data?.success
      });

      return {
        status: 'connected',
        endpoint: `${this.baseURL}/api/chat`,
        response: response.data
      };
    } catch (error) {
      console.error('❌ Connection test failed:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        endpoint: `${this.baseURL}/api/chat`,
        baseURL: this.baseURL
      });

      return {
        status: 'failed',
        endpoint: `${this.baseURL}/api/chat`,
        error: error.message,
        details: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          isNetworkError: !error.response,
          baseURL: this.baseURL
        }
      };
    }
  }
}

// Create singleton instance
const ragApiService = new RAGApiService();

export default ragApiService;
