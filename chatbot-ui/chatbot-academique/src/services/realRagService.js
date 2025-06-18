/**
 * Real RAG Service - OLLAMA ONLY VERSION
 * Uses ONLY Ollama/Llama for RAG - NO Gemini
 * Gemini is reserved for SMA web scraping only
 */

import axios from 'axios';
import ollamaService from './ollamaService.js';

class RealRagService {
  constructor() {
    this.ragApiUrl = import.meta.env.VITE_RAG_API_URL || 'http://localhost:8004';
    this.ragApiV1Url = `${this.ragApiUrl}/api/v1`;
    this.projectId = 'eniadproject';  // Alphanumeric only
    this.isRagAvailable = false;
    this.useDirectOllamaOnly = false; // Use real RAG backend

    // NO FAKE DOCUMENTS - Force use of real RAG backend only
    this.documents = [];

    // Test connection to real RAG service
    this.testConnection();

    console.log('🦙 Real RAG Service initialized - CONNECTING TO REAL BACKEND');
    console.log('📡 RAG API URL:', this.ragApiUrl);
    console.log('📡 RAG API V1 URL:', this.ragApiV1Url);
    console.log('✅ Will use friend\'s RAG project with uploaded DATA files');
  }

  /**
   * Test connection to RAG backend
   */
  async testConnection() {
    try {
      console.log('🔍 Testing Real RAG backend connection...');
      const response = await axios.get(`${this.ragApiUrl}/docs`, { timeout: 10000 });
      this.isRagAvailable = response.status === 200;
      console.log('✅ Real RAG backend is available on port 8004');
      console.log('📡 Connected to friend\'s RAG project');
      return { success: true, message: 'Real RAG backend connected', backend: 'friend_rag_project' };
    } catch (error) {
      this.isRagAvailable = false;
      console.log('⚠️ Real RAG backend not available - Will use fallback');
      console.log(`   Error: ${error.message}`);
      console.log('💡 Start RAG server: cd RAG_Project/src && python -m uvicorn main:app --port 8004');
      return { success: false, message: 'Real RAG backend required', error: error.message };
    }
  }

  /**
   * Search documents - ONLY real RAG backend
   */
  async searchDocuments(query, options = {}) {
    try {
      console.log(`🔍 Searching documents for: "${query}"`);

      // ONLY use RAG backend - no fake fallback
      if (this.isRagAvailable) {
        return await this.searchWithBackend(query, options);
      } else {
        console.error('❌ RAG backend not available and no fake fallback allowed');
        return {
          success: false,
          error: 'RAG backend not available',
          results: []
        };
      }

    } catch (error) {
      console.error('❌ Error searching documents:', error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  /**
   * Search using RAG backend ONLY
   */
  async searchWithBackend(query, options) {
    try {
      const response = await axios.post(`${this.ragApiUrl}/search/${this.projectId}`, {
        query: query,
        llm_type: "ollama",
        mode: "hybrid"
      }, { timeout: 10000 });

      if (response.data.signal === 'vectordb_search_success') {
        return {
          success: true,
          results: response.data.results.map(result => ({
            id: result.id || Math.random().toString(36),
            title: result.metadata?.title || 'Document ENIAD',
            content: result.text || result.content || '',
            snippet: result.text?.substring(0, 200) + '...' || '',
            relevanceScore: result.score || 0.8,
            category: 'academic',
            language: 'fr',
            metadata: result.metadata || {}
          })) || [],
          metadata: { source: 'RAG Backend', query: query }
        };
      } else {
        throw new Error('RAG search failed: ' + response.data.signal);
      }
    } catch (error) {
      console.error('❌ RAG backend search failed:', error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  /**
   * Generate answer using ONLY Ollama/Llama - NO Gemini
   */
  async generateAnswerWithOllama(query, language = 'fr') {
    try {
      console.log(`🦙 Generating RAG answer with OLLAMA ONLY for: "${query}"`);
      console.log('🚫 NO Gemini - Ollama/Llama exclusively for RAG');

      console.log('📡 Calling REAL RAG backend:', `${this.ragApiV1Url}/nlp/index/answer/${this.projectId}`);

      const response = await axios.post(`${this.ragApiV1Url}/nlp/index/answer/${this.projectId}`, {
        text: query,
        limit: 5
      }, {
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.signal === 'rag_answer_success') {
        return {
          success: true,
          answer: response.data.answer,
          sources: response.data.chat_history || [],
          metadata: {
            model: 'RAG + Friend\'s Project (Real)',
            documentsUsed: response.data.chat_history?.length || 0,
            llm_used: 'ollama',
            embedding_model: 'nomic-embed-text',
            generation_model: 'llama3.2:1b',
            backend: 'real_rag_server_8004',
            gemini_used: false,  // Explicitly no Gemini
            real_rag_used: true,
            data_files_used: true,
            project_id: this.projectId
          }
        };
      } else {
        throw new Error('RAG answer failed: ' + response.data.signal);
      }
    } catch (error) {
      console.error(`❌ RAG Ollama answer failed:`, error);
      return {
        success: false,
        error: error.message,
        answer: language === 'ar' ?
          'عذراً، لا يمكنني الوصول إلى قاعدة البيانات مع Ollama.' :
          'Désolé, je ne peux pas accéder à la base de données avec Ollama.'
      };
    }
  }

  /**
   * Generate answer with direct Ollama fallback
   */
  async generateAnswerWithDirectOllama(query, language = 'fr') {
    try {
      console.log('🦙 Using direct Ollama service for RAG (backend unavailable)');

      // Check if Ollama is ready
      const isReady = await ollamaService.isReadyForRAG();
      if (!isReady) {
        console.warn('⚠️ Ollama not ready, using simple fallback');
        return await this.generateSimpleOllamaFallback(query, language);
      }

      // Use direct Ollama service
      const result = await ollamaService.generateRAGResponse(query, [], language);

      if (result.success) {
        return {
          success: true,
          answer: result.answer,
          sources: [],
          metadata: {
            model: 'RAG + Ollama (Direct)',
            provider: 'ollama-direct',
            llm_engine: 'ollama',
            generation_model: result.model,
            embedding_model: result.embedding_model,
            gemini_used: false,
            backend: false,
            direct_ollama: true
          }
        };
      } else {
        throw new Error(result.error || 'Direct Ollama failed');
      }
    } catch (error) {
      console.error('❌ Direct Ollama failed:', error);
      console.log('🔄 Trying simple Ollama fallback...');
      return await this.generateSimpleOllamaFallback(query, language);
    }
  }

  /**
   * Simple Ollama fallback without complex RAG
   */
  async generateSimpleOllamaFallback(query, language = 'fr') {
    try {
      console.log('🦙 Using simple Ollama fallback');

      // Simple context about ENIAD
      const eniadContext = language === 'ar' ?
        'ENIAD (المدرسة الوطنية للذكاء الاصطناعي والرقمي) هي مدرسة متخصصة في الذكاء الاصطناعي في بركان، المغرب. تقدم تكوينات في الذكاء الاصطناعي وعلوم البيانات.' :
        'ENIAD (École Nationale de l\'Intelligence Artificielle et du Digital) est une école spécialisée en intelligence artificielle à Berkane, Maroc. Elle propose des formations en IA et science des données.';

      const prompt = language === 'ar' ?
        `أنت مساعد ENIAD. استخدم المعلومات التالية للإجابة:\n\n${eniadContext}\n\nسؤال: ${query}\n\nإجابة:` :
        `Tu es l'assistant ENIAD. Utilise les informations suivantes pour répondre:\n\n${eniadContext}\n\nQuestion: ${query}\n\nRéponse:`;

      // Use basic Ollama generation
      const result = await ollamaService.generateResponse(prompt, {
        temperature: 0.3,
        maxTokens: 400
      });

      if (result.success) {
        return {
          success: true,
          answer: result.response,
          sources: [],
          metadata: {
            model: 'RAG + Ollama (Simple)',
            provider: 'ollama-simple',
            llm_engine: 'ollama',
            generation_model: result.model,
            gemini_used: false,
            backend: false,
            simple_fallback: true
          }
        };
      } else {
        throw new Error('Simple Ollama fallback failed');
      }
    } catch (error) {
      console.error('❌ Simple Ollama fallback failed:', error);
      return {
        success: false,
        error: error.message,
        answer: language === 'ar' ?
          'عذراً، فشل النظام البديل لـ Ollama.' :
          'Désolé, échec du système de fallback Ollama.'
      };
    }
  }

  /**
   * Generate answer - REAL RAG BACKEND FIRST, then fallbacks
   */
  async generateAnswer(query, language = 'fr') {
    try {
      console.log('🦙 RAG Service: Using REAL RAG Backend with DATA files');
      console.log('🚫 NO Gemini for RAG - Ollama only');

      // Try Real RAG backend first (with uploaded DATA files)
      if (this.isRagAvailable) {
        console.log('📡 Using Real RAG backend with friend\'s project...');
        const backendResult = await this.generateAnswerWithOllama(query, language);

        if (backendResult.success) {
          console.log('✅ Using Real RAG backend (with DATA files)');
          return backendResult;
        }
      }

      // Fallback to direct Ollama
      console.log('🔄 RAG backend unavailable, trying direct Ollama...');
      const directResult = await this.generateAnswerWithDirectOllama(query, language);

      if (directResult.success) {
        console.log('✅ Using direct Ollama fallback');
        return directResult;
      }

      // Emergency fallback
      console.log('🔄 Direct Ollama failed, using emergency fallback...');
      const emergencyResult = await this.generateEmergencyFallback(query, language);

      if (emergencyResult.success) {
        console.log('✅ Using emergency fallback');
        return emergencyResult;
      }

      // Final error
      console.error('❌ All RAG methods failed - NO Gemini fallback');
      return {
        success: false,
        answer: language === 'ar' ?
          'عذراً، نظام RAG غير متاح حالياً. يرجى التأكد من تشغيل الخادم.' :
          'Désolé, le système RAG n\'est pas disponible. Veuillez vérifier que le serveur fonctionne.',
        sources: [],
        metadata: {
          model: 'RAG + All Failed',
          gemini_used: false,
          backend_failed: true,
          ollama_direct_failed: true,
          emergency_failed: true
        }
      };

    } catch (error) {
      console.error('❌ Error in RAG service:', error);
      return {
        success: false,
        answer: language === 'ar' ?
          'عذراً، حدث خطأ في نظام RAG.' :
          'Désolé, une erreur RAG s\'est produite.',
        sources: [],
        metadata: {
          model: 'RAG + Error',
          gemini_used: false,
          error: error.message
        }
      };
    }
  }

  /**
   * Get system status
   */
  async getStatus() {
    try {
      const response = await axios.get(`${this.ragApiUrl}/status`, { timeout: 5000 });
      return {
        success: true,
        status: response.data.status,
        projects: response.data.projects,
        totalFiles: response.data.total_files,
        totalChunks: response.data.total_chunks,
        ragAvailable: this.isRagAvailable
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        ragAvailable: false
      };
    }
  }

  /**
   * Upload document to RAG backend
   */
  async uploadDocument(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${this.ragApiUrl}/upload/${this.projectId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000
        }
      );

      return {
        success: response.data.signal === 'file_upload_success',
        fileId: response.data.file_id,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process uploaded documents
   */
  async processDocuments() {
    try {
      const response = await axios.post(
        `${this.ragApiUrl}/process/${this.projectId}`,
        {
          chunk_size: 400,
          overlab_size: 100,
          reset: 0,
          llm_type: "ollama"
        },
        { timeout: 120000 }
      );

      return {
        success: response.data.signal === 'processing_success',
        insertedChunks: response.data.inserted_chunks,
        processedFiles: response.data.processed_files
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Emergency fallback without any external dependencies
   */
  async generateEmergencyFallback(query, language = 'fr') {
    try {
      console.log('🚨 Using emergency fallback (no external dependencies)');

      // Simple ENIAD knowledge base
      const eniadInfo = {
        fr: {
          name: "ENIAD (École Nationale de l'Intelligence Artificielle et du Digital)",
          location: "Berkane, Maroc",
          programs: [
            "Cycle Ingénieur en Intelligence Artificielle",
            "Machine Learning et Deep Learning",
            "Traitement du Langage Naturel",
            "Vision par Ordinateur"
          ],
          website: "https://eniad.ump.ma/fr"
        },
        ar: {
          name: "ENIAD (المدرسة الوطنية للذكاء الاصطناعي والرقمي)",
          location: "بركان، المغرب",
          programs: [
            "دورة المهندس في الذكاء الاصطناعي",
            "التعلم الآلي والشبكات العصبية",
            "معالجة اللغة الطبيعية",
            "الرؤية الحاسوبية"
          ],
          website: "https://eniad.ump.ma/fr"
        }
      };

      const info = eniadInfo[language] || eniadInfo.fr;
      const queryLower = query.toLowerCase();

      let answer;

      if (queryLower.includes('programme') || queryLower.includes('formation')) {
        answer = language === 'ar' ?
          `🎓 **برامج ${info.name}:**\n\n${info.programs.map(p => `• ${p}`).join('\n')}\n\n📍 **الموقع:** ${info.location}\n📚 **للمزيد:** ${info.website}` :
          `🎓 **Programmes ${info.name} :**\n\n${info.programs.map(p => `• ${p}`).join('\n')}\n\n📍 **Localisation :** ${info.location}\n📚 **Plus d'infos :** ${info.website}`;
      } else {
        answer = language === 'ar' ?
          `مرحباً بك في مساعد ${info.name}! 🎓\n\n**معلومات أساسية:**\n• **الاسم:** ${info.name}\n• **الموقع:** ${info.location}\n• **التخصص:** الذكاء الاصطناعي\n\n📚 **الموقع الرسمي:** ${info.website}` :
          `Bienvenue sur l'assistant ${info.name} ! 🎓\n\n**Informations de base :**\n• **Nom :** ${info.name}\n• **Localisation :** ${info.location}\n• **Spécialité :** Intelligence artificielle\n\n📚 **Site officiel :** ${info.website}`;
      }

      return {
        success: true,
        answer: answer,
        sources: [{ url: info.website, title: info.name }],
        metadata: {
          model: 'RAG + Emergency Fallback',
          provider: 'eniad-emergency',
          llm_engine: 'none',
          gemini_used: false,
          ollama_used: false,
          emergency_mode: true
        }
      };

    } catch (error) {
      console.error('❌ Emergency fallback failed:', error);
      return {
        success: false,
        error: error.message,
        answer: language === 'ar' ?
          'عذراً، حدث خطأ في النظام الاحتياطي.' :
          'Désolé, erreur dans le système de secours.'
      };
    }
  }
}

export default new RealRagService();
