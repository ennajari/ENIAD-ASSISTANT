/**
 * Real RAG Service - CLEANED VERSION - NO FAKE DATA
 * Only uses real RAG backend with uploaded files
 */

import axios from 'axios';
import geminiService from './geminiService';

class RealRagService {
  constructor() {
    this.ragApiUrl = import.meta.env.VITE_RAG_API_URL || 'http://localhost:5000/api/v1';
    this.projectId = '1';
    this.isRagAvailable = false;
    
    // NO FAKE DOCUMENTS - Force use of real RAG backend only
    this.documents = [];

    // Test connection to real RAG service
    this.testConnection();

    console.log('🧮 Real RAG Service initialized (CLEAN) with URL:', this.ragApiUrl);
    console.log('🚫 NO FAKE DOCUMENTS - Using only real RAG backend with uploaded files');
  }

  /**
   * Test connection to RAG backend
   */
  async testConnection() {
    try {
      const response = await axios.get(`${this.ragApiUrl}/`, { timeout: 5000 });
      this.isRagAvailable = response.status === 200;
      console.log('✅ RAG backend is available');
      return { success: true, message: 'RAG backend connected' };
    } catch (error) {
      this.isRagAvailable = false;
      console.log('⚠️ RAG backend not available - NO FALLBACK TO FAKE DATA');
      return { success: false, message: 'RAG backend required' };
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
   * Generate answer using ONLY real RAG backend
   */
  async generateAnswerWithBackend(query, language = 'fr') {
    try {
      console.log(`🤖 Generating RAG answer with backend for: "${query}"`);

      const response = await axios.post(`${this.ragApiUrl}/answer/${this.projectId}`, {
        query: query,
        llm_type: "ollama",
        mode: "hybrid",
        return_prompt: false
      }, { timeout: 30000 });

      if (response.data.signal === 'rag_answer_success') {
        return {
          success: true,
          answer: response.data.answer,
          sources: response.data.chat_history || [],
          metadata: {
            model: 'RAG + Ollama',
            documentsUsed: response.data.chat_history?.length || 0,
            backend: true
          }
        };
      } else {
        throw new Error('RAG answer failed: ' + response.data.signal);
      }
    } catch (error) {
      console.error('❌ RAG backend answer failed:', error);
      return {
        success: false,
        error: error.message,
        answer: language === 'ar' ? 
          'عذراً، لا يمكنني الوصول إلى قاعدة البيانات.' : 
          'Désolé, je ne peux pas accéder à la base de données.'
      };
    }
  }

  /**
   * Generate answer - ONLY real RAG backend
   */
  async generateAnswer(query, language = 'fr') {
    try {
      // ONLY use backend - no fake fallback
      if (this.isRagAvailable) {
        const backendResult = await this.generateAnswerWithBackend(query, language);
        if (backendResult.success) {
          console.log('✅ Using RAG backend answer');
          return backendResult;
        }
      }

      // No fallback to fake data
      console.error('❌ RAG backend not available and no fake fallback allowed');
      return {
        success: false,
        answer: language === 'ar' ? 
          'عذراً، قاعدة البيانات غير متاحة حالياً.' : 
          'Désolé, la base de données n\'est pas disponible actuellement.',
        sources: []
      };

    } catch (error) {
      console.error('❌ Error generating answer:', error);
      return {
        success: false,
        answer: language === 'ar' ? 
          'عذراً، حدث خطأ في النظام.' : 
          'Désolé, une erreur système s\'est produite.',
        sources: []
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
}

export default new RealRagService();
