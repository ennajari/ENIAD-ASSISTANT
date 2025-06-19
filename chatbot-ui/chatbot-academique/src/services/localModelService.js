/**
 * Service de modèle local utilisant le vrai système RAG
 * Connecté au serveur RAG sur le port 8009
 */

import axios from 'axios';

class LocalModelService {
  constructor() {
    this.isAvailable = false;
    this.modelName = 'RAG-Local-Ollama';
    this.ragApiUrl = import.meta.env.VITE_RAG_API_URL || 'http://localhost:8009';
    this.projectId = '1';

    // Tester la connexion au démarrage
    this.testConnection();

    console.log('🤖 Local Model Service initialized - Using Real RAG');
    console.log('📡 RAG API URL:', this.ragApiUrl);
  }

  /**
   * Tester la connexion au serveur RAG
   */
  async testConnection() {
    try {
      console.log('🔍 Testing RAG connection...');
      const response = await axios.get(`${this.ragApiUrl}/status`, { timeout: 10000 });
      this.isAvailable = response.status === 200;
      console.log('✅ RAG backend available for Local Model Service');
      return { success: true, message: 'RAG backend connected' };
    } catch (error) {
      this.isAvailable = false;
      console.log('⚠️ RAG backend not available for Local Model Service');
      console.log(`   Error: ${error.message}`);
      return { success: false, message: 'RAG backend required', error: error.message };
    }
  }


  /**
   * Appeler le système RAG pour obtenir une réponse
   */
  async callRAGSystem(query, language = 'fr') {
    try {
      console.log(`🤖 Local Model Service calling RAG for: "${query}"`);

      const response = await axios.post(
        `${this.ragApiUrl}/api/v1/nlp/index/answer/${this.projectId}`,
        {
          query: query,
          language: language,
          max_results: 5
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.answer) {
        return {
          success: true,
          answer: response.data.answer,
          sources: response.data.sources || [],
          confidence: response.data.confidence || 0.0,
          timestamp: response.data.timestamp
        };
      } else {
        throw new Error('Invalid RAG response format');
      }
    } catch (error) {
      console.error('❌ RAG call failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Générer une réponse basée sur la requête en utilisant le vrai RAG
   */
  async generateResponse(query, language = 'fr', context = '') {
    try {
      console.log(`🤖 Local Model Service generating response for: "${query}"`);

      // Vérifier que le RAG est disponible
      if (!this.isAvailable) {
        await this.testConnection();
        if (!this.isAvailable) {
          throw new Error('RAG backend not available');
        }
      }

      // Appeler le système RAG
      const ragResult = await this.callRAGSystem(query, language);

      if (ragResult.success) {
        // Ajouter une note sur le modèle utilisé
        const modelNote = language === 'ar' ?
          '\n\n🤖 *تم إنتاج هذه الإجابة بواسطة نظام RAG المحلي مع Ollama*' :
          '\n\n🤖 *Réponse générée par le système RAG local avec Ollama*';

        return {
          success: true,
          answer: ragResult.answer + modelNote,
          sources: ragResult.sources,
          confidence: ragResult.confidence,
          model: this.modelName,
          source: 'RAG Local + Ollama',
          icon: '🦙',
          metadata: {
            backend: 'rag_local_ollama',
            sources_count: ragResult.sources?.length || 0,
            confidence: ragResult.confidence,
            timestamp: ragResult.timestamp
          }
        };
      } else {
        throw new Error('RAG generation failed: ' + ragResult.error);
      }
    } catch (error) {
      console.error('❌ Local Model Service error:', error);
      return {
        success: false,
        answer: language === 'ar' ?
          'عذراً، حدث خطأ في النموذج المحلي. يرجى المحاولة مرة أخرى.' :
          'Désolé, erreur avec le modèle local. Veuillez réessayer.',
        model: 'error',
        error: error.message
      };
    }
  }

  /**
   * Vérifier la disponibilité du système RAG
   */
  async checkAvailability() {
    const connectionTest = await this.testConnection();
    return connectionTest.success;
  }

  /**
   * Obtenir le statut du service
   */
  async getStatus() {
    const connectionTest = await this.testConnection();

    return {
      service: 'Local Model Service (RAG)',
      available: this.isAvailable,
      model: this.modelName,
      ragBackend: this.ragApiUrl,
      projectId: this.projectId,
      connection: connectionTest,
      lastCheck: new Date().toISOString()
    };
  }

  /**
   * Générer une réponse optimisée pour ENIAD
   */
  async generateENIADResponse(query, language = 'fr') {
    return await this.generateResponse(query, language);
  }
}

// Export singleton
const localModelService = new LocalModelService();
export default localModelService;
