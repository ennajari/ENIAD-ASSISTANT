/**
 * Service Ollama pour RAG UNIQUEMENT
 * Llama 3.2 + nomic-embed-text pour RAG SEULEMENT
 * 🚫 PAS DE GEMINI - Ollama exclusif pour RAG
 * Gemini réservé pour SMA et web scraping uniquement
 */

import axios from 'axios';

class OllamaService {
  constructor() {
    this.baseUrl = 'http://localhost:11434';
    this.isAvailable = false;
    this.generationModel = 'llama3:8b-instruct-q4_K_M'; // Optimized for RTX 4060
    this.fallbackModel = 'llama3.2:1b'; // Fallback if 8B not available
    this.embeddingModel = 'nomic-embed-text'; // Embeddings (768 dimensions)
    this.ollamaPath = 'C:\\Users\\ROG FLOW\\AppData\\Local\\Programs\\Ollama\\ollama.exe';
    this.checkAvailability();

    console.log('🦙 Ollama Service initialized for RAG ONLY (NO Gemini) - RTX 4060 Optimized:', {
      generation: this.generationModel,
      fallback: this.fallbackModel,
      embedding: this.embeddingModel,
      purpose: 'RAG EXCLUSIVELY',
      gpu_optimized: 'RTX 4060'
    });
  }

  /**
   * Vérifier la disponibilité d'Ollama
   */
  async checkAvailability() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 5000 });
      this.isAvailable = response.status === 200;
      console.log('✅ Ollama is available');

      // Vérifier les modèles installés
      const models = response.data.models || [];
      console.log('📚 Modèles disponibles:', models.map(m => m.name));

      // Auto-detect best available model
      const availableModels = models.map(m => m.name);
      const bestModel = this.selectBestModel(availableModels);

      if (bestModel !== this.generationModel) {
        console.log(`🔄 Switching to better model: ${bestModel}`);
        this.generationModel = bestModel;
      }

      return true;
    } catch (error) {
      this.isAvailable = false;
      console.log('⚠️ Ollama not available:', error.message);
      return false;
    }
  }

  /**
   * Sélectionner le meilleur modèle disponible pour RTX 4060
   */
  selectBestModel(availableModels) {
    // Priority order optimized for RTX 4060: 8B > 7B > 3B > 1B
    const modelPriority = [
      'llama3:8b-instruct-q4_K_M',
      'llama3:8b-instruct',
      'llama3:8b',
      'mistral:7b-instruct',
      'llama3.2:3b-instruct-q4_K_M',
      'llama3.2:3b',
      'llama3.2:1b',
      'llama3.2'
    ];

    for (const preferredModel of modelPriority) {
      const found = availableModels.find(model =>
        model.includes(preferredModel) || model.startsWith(preferredModel.split(':')[0])
      );
      if (found) {
        console.log(`🎯 Best model detected: ${found} (optimized for RTX 4060)`);
        return found;
      }
    }

    // Fallback to first available model
    console.log(`⚠️ Using fallback model: ${availableModels[0] || this.fallbackModel}`);
    return availableModels[0] || this.fallbackModel;
  }

  /**
   * Installer un modèle Llama
   */
  async installModel(modelName = 'llama3.2:1b') {
    try {
      console.log(`📥 Installation du modèle ${modelName}...`);
      
      const response = await axios.post(`${this.baseUrl}/api/pull`, {
        name: modelName
      }, { 
        timeout: 300000, // 5 minutes pour l'installation
        responseType: 'stream'
      });

      return {
        success: true,
        message: `Modèle ${modelName} installé avec succès`
      };
    } catch (error) {
      console.error('❌ Erreur installation modèle:', error);
      return {
        success: false,
        message: `Erreur installation: ${error.message}`
      };
    }
  }

  /**
   * Générer une réponse avec Ollama
   */
  async generateResponse(prompt, options = {}) {
    if (!this.isAvailable) {
      throw new Error('Ollama n\'est pas disponible');
    }

    try {
      const {
        model = this.currentModel,
        temperature = 0.3,
        maxTokens = 500,
        stream = false
      } = options;

      console.log(`🤖 Génération avec ${model}:`, prompt.substring(0, 100) + '...');

      console.log(`🔗 Calling Ollama API: ${this.baseUrl}/api/generate`);

      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: model,
        prompt: prompt,
        stream: stream,
        options: {
          temperature: temperature,
          num_predict: maxTokens,
          top_p: 0.9,
          top_k: 40
        }
      }, { timeout: 30000 });

      if (response.data && response.data.response) {
        return {
          success: true,
          response: response.data.response,
          model: model,
          done: response.data.done || true
        };
      } else {
        throw new Error('Réponse invalide d\'Ollama');
      }
    } catch (error) {
      console.error('❌ Erreur génération Ollama:', error);
      throw error;
    }
  }

  /**
   * Générer une réponse de chat
   */
  async generateChatResponse(messages, options = {}) {
    try {
      // Convertir les messages en prompt simple
      const prompt = messages.map(msg => {
        if (msg.role === 'system') {
          return `Instructions: ${msg.content}`;
        } else if (msg.role === 'user') {
          return `Utilisateur: ${msg.content}`;
        } else if (msg.role === 'assistant') {
          return `Assistant: ${msg.content}`;
        }
        return msg.content;
      }).join('\n\n') + '\n\nAssistant:';

      const result = await this.generateResponse(prompt, options);
      
      return {
        choices: [{
          message: {
            role: 'assistant',
            content: result.response
          }
        }],
        model: result.model,
        usage: {
          total_tokens: result.response.length // Approximation
        }
      };
    } catch (error) {
      console.error('❌ Erreur chat Ollama:', error);
      throw error;
    }
  }

  /**
   * Générer des embeddings avec nomic-embed-text (REAL)
   */
  async generateEmbeddings(text, options = {}) {
    try {
      console.log(`🔢 Generating REAL embeddings with ${this.embeddingModel}...`);

      const response = await axios.post(`${this.baseUrl}/api/embeddings`, {
        model: this.embeddingModel,
        prompt: text
      }, { timeout: 30000 });

      if (response.data && response.data.embedding) {
        console.log(`✅ Real embeddings generated: ${response.data.embedding.length} dimensions`);
        return {
          success: true,
          embedding: response.data.embedding,
          model: this.embeddingModel,
          dimensions: response.data.embedding.length
        };
      } else {
        throw new Error('Invalid embedding response from Ollama');
      }
    } catch (error) {
      console.error('❌ Real embeddings failed, using fallback:', error);

      // Fallback to simple hash-based embedding
      const words = text.toLowerCase().split(/\s+/);
      const embedding = new Array(768).fill(0); // nomic-embed-text dimensions

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        for (let j = 0; j < word.length; j++) {
          const charCode = word.charCodeAt(j);
          embedding[charCode % 768] += 1;
        }
      }

      const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
      const normalizedEmbedding = embedding.map(val => val / (norm || 1));

      return {
        success: true,
        embedding: normalizedEmbedding,
        model: 'ollama-fallback-768',
        dimensions: 768,
        fallback: true
      };
    }
  }

  /**
   * Lister les modèles disponibles
   */
  async listModels() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`);
      return {
        success: true,
        models: response.data.models || []
      };
    } catch (error) {
      console.error('❌ Erreur liste modèles:', error);
      return {
        success: false,
        models: []
      };
    }
  }

  /**
   * Changer le modèle actuel
   */
  setModel(modelName) {
    this.currentModel = modelName;
    console.log(`🔄 Modèle changé vers: ${modelName}`);
  }

  /**
   * Obtenir le statut du service
   */
  async getStatus() {
    const available = await this.checkAvailability();
    const models = await this.listModels();
    
    return {
      service: 'Ollama Local',
      available: available,
      currentModel: this.currentModel,
      baseUrl: this.baseUrl,
      models: models.models,
      lastCheck: new Date().toISOString()
    };
  }

  /**
   * Réponse RAG optimisée pour ENIAD avec Ollama UNIQUEMENT
   */
  async generateRAGResponse(query, language = 'fr', context = []) {
    try {
      console.log('🦙 Generating RAG response with Ollama ONLY (NO Gemini)');

      // Ensure context is an array
      const contextArray = Array.isArray(context) ? context : [];

      const systemPrompt = language === 'ar' ?
        'أنت مساعد أكاديمي لمعهد ENIAD متخصص في الذكاء الاصطناعي. استخدم المعلومات المقدمة للإجابة بدقة. لا تستخدم Gemini - Ollama فقط.' :
        'Tu es l\'assistant académique ENIAD spécialisé en IA. Utilise les informations fournies pour répondre avec précision. Pas de Gemini - Ollama uniquement.';

      // Build context from RAG documents
      const contextText = contextArray.length > 0
        ? contextArray.map((doc, i) => `Document ${i+1}: ${doc.content || doc.text || doc || ''}`).join('\n\n')
        : '';

      const ragPrompt = contextText
        ? `${systemPrompt}\n\nDocuments RAG:\n${contextText}\n\nQuestion: ${query}\n\nRéponse basée sur les documents:`
        : `${systemPrompt}\n\nQuestion: ${query}\n\nRéponse:`;

      const result = await this.generateResponse(ragPrompt, {
        model: this.generationModel,
        temperature: 0.3,
        maxTokens: 500
      });

      if (result.success) {
        return {
          success: true,
          answer: result.response,
          model: this.generationModel,
          embedding_model: this.embeddingModel,
          source: 'RAG + Ollama ONLY',
          context_used: contextArray.length,
          gemini_used: false,
          metadata: {
            llm_engine: 'ollama',
            generation_model: this.generationModel,
            embedding_model: this.embeddingModel,
            rag_documents: contextArray.length,
            gemini_excluded: true
          },
          icon: '🦙'
        };
      } else {
        throw new Error(result.error || 'Ollama generation failed');
      }
    } catch (error) {
      console.error('❌ Erreur RAG Ollama:', error);
      return {
        success: false,
        answer: language === 'ar' ?
          'عذراً، حدث خطأ في نظام RAG مع Ollama.' :
          'Désolé, erreur dans le système RAG avec Ollama.',
        model: 'ollama-error',
        gemini_used: false,
        error: error.message
      };
    }
  }

  /**
   * Vérifier si Ollama est prêt pour RAG
   */
  async isReadyForRAG() {
    try {
      console.log('🔍 Checking if Ollama is ready for RAG...');

      const response = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 5000 });

      if (response.status === 200) {
        const models = response.data.models || [];
        const modelNames = models.map(model => model.name || '');

        const hasGeneration = modelNames.some(name => name.includes('llama3.2:1b'));
        const hasEmbedding = modelNames.some(name => name.includes('nomic-embed-text'));

        const isReady = hasGeneration && hasEmbedding;

        console.log(`🦙 Ollama RAG readiness: ${isReady ? '✅' : '❌'}`, {
          models: models.length,
          hasGeneration,
          hasEmbedding
        });

        return isReady;
      } else {
        console.log('❌ Ollama not accessible');
        return false;
      }
    } catch (error) {
      console.error('❌ Error checking Ollama RAG readiness:', error);
      return false;
    }
  }

  /**
   * Obtenir le statut du service
   */
  async getStatus() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`);

      if (response.status === 200) {
        const models = response.data.models || [];

        return {
          available: true,
          models: models,
          currentModel: this.generationModel,
          embeddingModel: this.embeddingModel,
          baseUrl: this.baseUrl
        };
      } else {
        return {
          available: false,
          error: `HTTP ${response.status}`
        };
      }
    } catch (error) {
      console.error('❌ Erreur statut Ollama:', error);
      return {
        available: false,
        error: error.message
      };
    }
  }
}

// Export singleton
const ollamaService = new OllamaService();
export default ollamaService;
