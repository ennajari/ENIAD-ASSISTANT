/**
 * Service Ollama pour modèles locaux
 * Intégration avec Llama 3.2 pour les tests RAG
 */

import axios from 'axios';

class OllamaService {
  constructor() {
    this.baseUrl = 'http://localhost:11434';
    this.isAvailable = false;
    this.currentModel = 'llama3.2:1b'; // Modèle léger parfait pour 8GB RAM
    this.ollamaPath = 'C:\\Users\\ROG FLOW\\AppData\\Local\\Programs\\Ollama\\ollama.exe';
    this.checkAvailability();

    console.log('🦙 Ollama Service initialized with model:', this.currentModel);
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
      
      return true;
    } catch (error) {
      this.isAvailable = false;
      console.log('⚠️ Ollama not available:', error.message);
      return false;
    }
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
   * Générer des embeddings (simulation simple)
   */
  async generateEmbeddings(text, options = {}) {
    try {
      // Pour l'instant, simulation simple
      // Ollama ne supporte pas encore les embeddings directement
      console.log('⚠️ Embeddings simulés pour Ollama');
      
      // Générer un vecteur simple basé sur le texte
      const words = text.toLowerCase().split(/\s+/);
      const embedding = new Array(384).fill(0); // Dimension standard
      
      // Hash simple pour créer un vecteur reproductible
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        for (let j = 0; j < word.length; j++) {
          const charCode = word.charCodeAt(j);
          embedding[charCode % 384] += 1;
        }
      }
      
      // Normaliser
      const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
      const normalizedEmbedding = embedding.map(val => val / (norm || 1));
      
      return {
        success: true,
        embedding: normalizedEmbedding,
        model: 'ollama-simulation'
      };
    } catch (error) {
      console.error('❌ Erreur embeddings Ollama:', error);
      throw error;
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
   * Réponse optimisée pour ENIAD
   */
  async generateENIADResponse(query, language = 'fr', context = '') {
    try {
      const systemPrompt = language === 'ar' ? 
        'أنت مساعد أكاديمي لمعهد ENIAD متخصص في الذكاء الاصطناعي وعلوم البيانات. أجب بدقة ووضوح.' :
        'Tu es l\'assistant académique ENIAD spécialisé en intelligence artificielle et science des données. Réponds avec précision et clarté.';

      const contextPrompt = context ? 
        (language === 'ar' ? `السياق: ${context}\n\n` : `Contexte: ${context}\n\n`) : '';

      const fullPrompt = `${systemPrompt}\n\n${contextPrompt}Question: ${query}\n\nRéponse:`;

      const result = await this.generateResponse(fullPrompt, {
        temperature: 0.3,
        maxTokens: 400
      });

      return {
        success: true,
        answer: result.response,
        model: result.model,
        source: 'Ollama Local',
        icon: '🦙'
      };
    } catch (error) {
      console.error('❌ Erreur réponse ENIAD:', error);
      return {
        success: false,
        answer: language === 'ar' ? 
          'عذراً، حدث خطأ في النموذج المحلي.' : 
          'Désolé, erreur avec le modèle local.',
        model: 'error'
      };
    }
  }
}

// Export singleton
const ollamaService = new OllamaService();
export default ollamaService;
