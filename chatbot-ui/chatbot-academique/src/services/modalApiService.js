/**
 * Modal API Service - Integration avec votre modèle custom
 * Endpoint: https://abdellahennajari2018--llama3-openai-compatible-serve.modal.run
 * Modèle: llama3-8b-eniad-merged-32bit
 */

import axios from 'axios';

class ModalApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_MODAL_API_URL || 'https://abdellahennajari2018--llama3-openai-compatible-serve.modal.run';
    this.modelName = import.meta.env.VITE_MODAL_MODEL_NAME || 'llama3-8b-eniad-merged-32bit';
    this.timeout = 60000; // 60 seconds timeout

    console.log('🚀 Modal API Service Configuration:', {
      baseURL: this.baseURL,
      modelName: this.modelName,
      timeout: this.timeout
    });

    // Initialize axios instance
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log('🚀 Modal API Request:', {
          url: config.url,
          method: config.method
        });
        return config;
      },
      (error) => {
        console.error('❌ Modal API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ Modal API Response:', {
          status: response.status,
          url: response.config.url
        });
        return response;
      },
      (error) => {
        console.error('❌ Modal API Response Error:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: error.config?.url
        });
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  /**
   * Générer une réponse avec votre modèle custom
   * @param {Object} params - Paramètres de la requête
   * @param {string} params.query - Question de l'utilisateur
   * @param {string} params.language - Code de langue (fr, en, ar)
   * @param {Array} params.context - Contexte RAG (optionnel)
   * @param {Object} params.options - Options supplémentaires
   * @returns {Promise<Object>} Réponse du modèle
   */
  async query({
    query,
    language = 'fr',
    context = [],
    options = {}
  }) {
    try {
      const {
        temperature = 0.7,
        maxTokens = 500,
        ragContext = null
      } = options;

      // Construire le prompt avec contexte RAG si disponible
      let enhancedPrompt = query;
      
      if (ragContext && ragContext.length > 0) {
        const contextText = ragContext.map(chunk => chunk.text || chunk.content).join('\n\n');
        enhancedPrompt = `Contexte ENIAD:
${contextText}

Question: ${query}

Réponds en français en te basant sur le contexte fourni:`;
      }

      const payload = {
        model: this.modelName,
        messages: [
          {
            role: "system",
            content: "Tu es un assistant spécialisé dans l'École Nationale de l'Intelligence Artificielle et du Digital (ENIAD) de Berkane. Réponds toujours en français de manière précise et professionnelle."
          },
          {
            role: "user",
            content: enhancedPrompt
          }
        ],
        temperature: temperature,
        max_tokens: maxTokens,
        stream: false
      };

      console.log('📝 Sending query to Modal API:', {
        model: this.modelName,
        query: query.substring(0, 100) + '...',
        language,
        hasRAGContext: !!ragContext,
        temperature,
        maxTokens
      });

      // Appel à votre API Modal
      const response = await this.api.post('/v1/chat/completions', payload);

      return this.formatModalResponse(response.data, query, language, ragContext);
    } catch (error) {
      console.error('❌ Modal API query failed:', error);
      throw error;
    }
  }

  /**
   * Formater la réponse de l'API Modal
   * @param {Object} data - Réponse brute de l'API
   * @param {string} originalQuery - Question originale
   * @param {string} language - Code de langue
   * @param {Array} ragContext - Contexte RAG
   * @returns {Object} Réponse formatée
   */
  formatModalResponse(data, originalQuery, language, ragContext = null) {
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Modal API returned no choices');
    }

    const choice = data.choices[0];
    const content = choice.message?.content || '';

    return {
      id: data.id || Date.now().toString(),
      content: content,
      sources: ragContext ? this.formatRAGSources(ragContext) : [],
      confidence: 0.95, // High confidence for custom model
      language: language,
      tokens_used: data.usage?.total_tokens || 0,
      processing_time: 0,
      intent: 'eniad_specific',
      related_questions: [],
      metadata: {
        model: this.modelName,
        timestamp: new Date().toISOString(),
        original_query: originalQuery,
        has_rag_context: !!ragContext,
        finish_reason: choice.finish_reason,
        usage: data.usage || {},
        api_source: 'modal_custom'
      }
    };
  }

  /**
   * Formater les sources RAG
   * @param {Array} ragContext - Contexte RAG
   * @returns {Array} Sources formatées
   */
  formatRAGSources(ragContext) {
    if (!ragContext || !Array.isArray(ragContext)) return [];

    return ragContext.slice(0, 5).map((chunk, index) => ({
      title: chunk.metadata?.source || `Document ${index + 1}`,
      url: '',
      type: 'document',
      relevance: chunk.score || 0.8,
      summary: chunk.text?.substring(0, 200) + '...' || '',
      source: 'ENIAD Documents'
    }));
  }

  /**
   * Tester la connexion à l'API Modal
   * @returns {Promise<Object>} Statut de la connexion
   */
  async testConnection() {
    try {
      console.log('🔍 Testing Modal API connection...');

      const testPayload = {
        model: this.modelName,
        messages: [
          {
            role: "user",
            content: "Bonjour, test de connexion."
          }
        ],
        max_tokens: 50,
        temperature: 0.1
      };

      const response = await this.api.post('/v1/chat/completions', testPayload);

      return {
        status: 'success',
        message: 'Modal API connection successful',
        model: this.modelName,
        response_length: response.data.choices?.[0]?.message?.content?.length || 0,
        tokens_used: response.data.usage?.total_tokens || 0
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        error_type: error.response?.status ? 'http_error' : 'network_error',
        details: error.response?.data || null
      };
    }
  }

  /**
   * Gérer les erreurs API
   * @param {Error} error - Erreur Axios
   * @returns {Error} Erreur formatée
   */
  handleApiError(error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || error.response.data?.message || 'API Error';
      
      switch (status) {
        case 401:
          return new Error('Authentication failed. Please check your Modal API configuration.');
        case 403:
          return new Error('Access denied. Insufficient permissions for Modal API.');
        case 429:
          return new Error('Rate limit exceeded. Please try again later.');
        case 500:
          return new Error('Modal API internal server error. Please try again.');
        case 503:
          return new Error('Modal API temporarily unavailable. Please try again later.');
        default:
          return new Error(`Modal API Error (${status}): ${message}`);
      }
    } else if (error.request) {
      return new Error('Network error. Please check your connection to Modal API.');
    } else {
      return new Error(error.message || 'An unexpected error occurred with Modal API.');
    }
  }

  /**
   * Obtenir les informations du modèle
   * @returns {Object} Informations du modèle
   */
  getModelInfo() {
    return {
      name: this.modelName,
      provider: 'Modal',
      type: 'custom_llama3',
      description: 'Modèle Llama3 8B personnalisé pour ENIAD',
      capabilities: ['text_generation', 'rag_integration', 'french_language'],
      endpoint: this.baseURL,
      status: 'configured_not_tested'
    };
  }
}

export default new ModalApiService();
