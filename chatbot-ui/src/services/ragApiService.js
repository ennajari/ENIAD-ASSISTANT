/**
 * RAG API Service - Integration with ENIAD Custom Llama3 Model
 * Handles communication with your custom Llama3 model API
 * API Structure: /api/chat (Next.js API route)
 */

import axios from 'axios';
import geminiService from './geminiService';

class RAGApiService {
  constructor() {
    // Enhanced API Server Configuration (Custom Model + RAG + SMA)
    this.baseURL = import.meta.env.VITE_RAG_API_BASE_URL || '/api/llama';
    this.apiKey = import.meta.env.VITE_RAG_API_KEY;
    this.projectId = import.meta.env.VITE_RAG_PROJECT_ID || 'eniadassistant';
    this.timeout = 60000; // 60 seconds timeout for model inference

    // RAG System Configuration (for direct monitoring) - CORRECTED TO PORT 8003
    this.ragSystemURL = import.meta.env.VITE_RAG_SYSTEM_BASE_URL || 'http://localhost:8003';

    // Error logging throttling
    this.lastErrorLogged = 0;

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
   * Uses your endpoint: /search/{project_id}
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
        query: query.trim(),
        llm_type: "ollama",
        mode: "hybrid"
      };

      console.log('🔍 Searching documents in your RAG system:', {
        endpoint: `/search/${pid}`,
        query: query.substring(0, 50) + '...',
        limit
      });

      const response = await this.ragApi.post(`/search/${pid}`, payload);

      if (response.data.signal === 'vectordb_search_success') {
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
   * Uses RAG system endpoint: /status (simplified)
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Index information
   */
  async getProjectInfo(projectId = null) {
    try {
      const pid = projectId || this.projectId;

      console.log('📊 Getting project info from RAG system:', {
        endpoint: `/status`,
        ragSystemURL: this.ragSystemURL
      });

      const response = await this.ragApi.get(`/status`);

      if (response.data && response.data.status === 'operational') {
        return {
          status: 'success',
          info: {
            projects: response.data.projects || [],
            total_files: response.data.total_files || 0,
            total_chunks: response.data.total_chunks || 0
          },
          projectId: pid
        };
      } else {
        console.warn('⚠️ Project info returned non-operational status:', response.data);
        return {
          status: 'error',
          message: 'RAG system not operational'
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

      // Check if RAG system URL is configured
      if (!this.ragSystemURL || this.ragSystemURL === '' || this.ragSystemURL === 'undefined') {
        return {
          status: 'error',
          error: 'RAG system URL not configured',
          projectId: this.projectId,
          baseURL: this.ragSystemURL || 'Not configured',
          message: 'Please set VITE_RAG_SYSTEM_BASE_URL=http://localhost:5000/api/v1 in your .env file'
        };
      }

      // Try to check RAG system health using the correct endpoint
      const response = await this.ragApi.get('/status');

      if (response.status === 200 && response.data) {
        // RAG system is responding, mark as healthy
        return {
          status: 'healthy',
          projectId: this.projectId,
          baseURL: this.ragSystemURL,
          info: response.data,
          message: 'RAG system is operational and responding correctly'
        };
      } else {
        return {
          status: 'unhealthy',
          projectId: this.projectId,
          baseURL: this.ragSystemURL,
          error: `RAG system returned status ${response.status}`
        };
      }
    } catch (error) {
      // Only log RAG errors once every 5 minutes to avoid spam
      if (!this.lastErrorLogged || Date.now() - this.lastErrorLogged > 300000) {
        console.warn('⚠️ RAG system unavailable:', error.message);
        this.lastErrorLogged = Date.now();
      }

      // Provide more specific error messages
      let errorMessage = error.message;
      let helpMessage = 'RAG service is optional. The chatbot will work without it.';

      if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
        errorMessage = 'RAG service not running on port 8003';
        helpMessage = 'To start RAG: cd RAG_Project/src && python main.py. Service is optional - chatbot works without it.';
      } else if (error.code === 'ENOTFOUND' || error.message.includes('ENOTFOUND')) {
        errorMessage = 'RAG service host not found';
        helpMessage = 'Check VITE_RAG_SYSTEM_BASE_URL in .env file. Service is optional.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'RAG service timeout (port 8003)';
        helpMessage = 'Service may be starting up. Check if python main.py is running in RAG_Project/src.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error connecting to RAG service';
        helpMessage = 'Check if RAG service is running: cd RAG_Project/src && python main.py';
      } else if (error.response?.status === 500) {
        errorMessage = 'RAG service internal error';
        helpMessage = 'Check RAG service logs. Service is optional - chatbot works without it.';
      }

      return {
        status: 'error',
        error: errorMessage,
        projectId: this.projectId,
        baseURL: this.ragSystemURL || 'Not configured',
        message: helpMessage
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
