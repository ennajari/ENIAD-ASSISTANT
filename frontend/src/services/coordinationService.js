/**
 * Coordination Service - SÉPARATION RAG/SMA
 * Coordonne la séparation claire entre:
 * - RAG = Ollama/Llama UNIQUEMENT
 * - SMA = Gemini UNIQUEMENT
 */

import ollamaService from './ollamaService.js';
import geminiService from './geminiService.js';
import realRagService from './realRagService.js';
import modalService from './modalService.js';

class CoordinationService {
  constructor() {
    this.separationPolicy = {
      rag: 'ollama-only',
      sma: 'gemini-only',
      modal: 'premium-model',
      strict: true
    };

    console.log('🎯 Coordination Service initialized with STRICT separation:');
    console.log('   🦙 RAG = Ollama/Llama UNIQUEMENT');
    console.log('   ✨ SMA = Gemini UNIQUEMENT');
    console.log('   🚀 Modal = Votre modèle premium Llama3');
  }

  /**
   * Vérifier la disponibilité des services selon la séparation
   */
  async checkServicesAvailability() {
    console.log('🔍 Checking services availability with separation policy...');

    try {
      // Check Ollama for RAG
      let ollamaStatus, ollamaReady;
      try {
        ollamaStatus = await ollamaService.getStatus();
        ollamaReady = ollamaStatus.available && ollamaStatus.models?.length > 0;
      } catch (error) {
        console.warn('⚠️ Ollama check failed:', error.message);
        ollamaStatus = { available: false, error: error.message };
        ollamaReady = false;
      }

      // Check Gemini for SMA
      let geminiStatus, geminiReady;
      try {
        geminiStatus = await geminiService.testConnection();
        geminiReady = geminiStatus.success;
      } catch (error) {
        console.warn('⚠️ Gemini check failed:', error.message);
        geminiStatus = { success: false, error: error.message };
        geminiReady = false;
      }

      // Check Real RAG Backend
      let ragStatus, ragReady;
      try {
        ragStatus = await realRagService.testConnection();
        ragReady = ragStatus.success;
      } catch (error) {
        console.warn('⚠️ Real RAG check failed:', error.message);
        ragStatus = { success: false, error: error.message };
        ragReady = false;
      }
      
      // Check Modal Service
      let modalStatus, modalReady;
      try {
        modalStatus = await modalService.getStatus();
        modalReady = modalStatus.available;
      } catch (error) {
        console.warn('⚠️ Modal service check failed:', error.message);
        modalStatus = { available: false, error: error.message };
        modalReady = false;
      }

      const status = {
        rag: {
          engine: 'ollama',
          available: ollamaReady,
          backend: ragReady,
          models: ollamaStatus.models || [],
          policy: 'Ollama UNIQUEMENT - NO Gemini'
        },
        sma: {
          engine: 'gemini',
          available: geminiReady,
          model: geminiStatus.model || 'gemini-1.5-flash',
          policy: 'Gemini UNIQUEMENT - NO Ollama'
        },
        modal: {
          engine: 'modal-llama3',
          available: modalReady,
          model: modalStatus.model || 'llama3',
          url: modalStatus.url,
          policy: 'Votre modèle premium - RAG/SMA compatible'
        },
        separation: {
          enforced: true,
          policy: this.separationPolicy
        }
      };
      
      console.log('✅ Services status with separation:', status);
      return status;
      
    } catch (error) {
      console.error('❌ Error checking services:', error);
      return {
        rag: { available: false, error: error.message },
        sma: { available: false, error: error.message },
        separation: { enforced: true, error: error.message }
      };
    }
  }

  /**
   * Générer une réponse RAG avec Real RAG Backend
   */
  async generateRAGResponse(query, language = 'fr', options = {}) {
    console.log('🦙 Coordination: RAG request - Using REAL RAG Backend');
    console.log('🚫 NO Gemini for RAG - Strict separation enforced');
    console.log('✅ Using friend\'s RAG project with uploaded DATA files');

    try {
      // Check if Modal should be used for generation (if available and requested)
      const useModal = options.useModal && await modalService.getStatus().then(s => s.available);

      if (useModal) {
        console.log('🚀 Using Modal Llama3 for RAG generation...');

        // Get RAG context from backend
        const searchResult = await realRagService.searchDocuments(query, language);

        if (searchResult.success && searchResult.results.length > 0) {
          const ragContext = searchResult.results
            .map(doc => doc.text)
            .join('\n\n');

          const modalResult = await modalService.generateRAGResponse(query, ragContext, language);

          if (modalResult.success) {
            return {
              ...modalResult,
              metadata: {
                ...modalResult.metadata,
                coordination_policy: 'rag-modal-premium',
                gemini_excluded: true,
                separation_enforced: true,
                real_rag_backend: true,
                modal_generation: true,
                data_files_used: true
              }
            };
          }
        }

        console.log('🔄 Modal RAG failed, falling back to Ollama...');
      }

      // Use Real RAG Service with backend (Ollama)
      const result = await realRagService.generateAnswer(query, language);

      // Ensure metadata reflects coordination policy
      if (result.success) {
        result.metadata = {
          ...result.metadata,
          coordination_policy: 'rag-ollama-only',
          gemini_excluded: true,
          separation_enforced: true,
          real_rag_backend: true,
          data_files_used: true,
          modal_attempted: useModal
        };
      }

      return result;

    } catch (error) {
      console.error('❌ RAG coordination error:', error);
      return {
        success: false,
        answer: language === 'ar' ?
          'عذراً، فشل نظام RAG الحقيقي.' :
          'Désolé, échec du système RAG réel.',
        metadata: {
          coordination_policy: 'rag-ollama-only',
          gemini_excluded: true,
          real_rag_backend: false,
          error: error.message
        }
      };
    }
  }

  /**
   * Générer une réponse SMA avec Gemini UNIQUEMENT
   */
  async generateSMAResponse(query, language = 'fr', smaResults = null) {
    console.log('✨ Coordination: SMA request - Using Gemini ONLY');
    console.log('🚫 NO Ollama for SMA - Strict separation enforced');
    
    try {
      // Use Gemini for SMA processing
      const messages = [
        {
          role: 'system',
          content: language === 'ar' ? 
            'أنت مساعد ENIAD متخصص في معالجة نتائج البحث الويب. استخدم المعلومات المقدمة للإجابة.' :
            'Tu es l\'assistant ENIAD spécialisé dans le traitement des résultats de recherche web. Utilise les informations fournies pour répondre.'
        },
        {
          role: 'user',
          content: smaResults ? 
            `${query}\n\nRésultats SMA:\n${JSON.stringify(smaResults, null, 2)}` : 
            query
        }
      ];
      
      const result = await geminiService.generateChatCompletion(messages);
      
      if (result.choices && result.choices[0]) {
        return {
          success: true,
          answer: result.choices[0].message.content,
          sources: smaResults?.sources || [],
          metadata: {
            model: 'gemini',
            provider: 'gemini-sma-only',
            coordination_policy: 'sma-gemini-only',
            ollama_excluded: true,
            separation_enforced: true,
            smaEnhanced: !!smaResults
          }
        };
      } else {
        throw new Error('Invalid Gemini response');
      }
      
    } catch (error) {
      console.error('❌ SMA coordination error:', error);
      return {
        success: false,
        answer: language === 'ar' ? 
          'عذراً، فشل نظام SMA مع Gemini.' : 
          'Désolé, échec du système SMA avec Gemini.',
        metadata: {
          coordination_policy: 'sma-gemini-only',
          ollama_excluded: true,
          error: error.message
        }
      };
    }
  }

  /**
   * Générer une réponse combinée SMA + RAG (quand SMA activé)
   */
  async generateCombinedSMARAGResponse(query, language = 'fr', smaResults = null) {
    console.log('🔄 Coordination: Combined SMA + RAG request');
    console.log('🔍 SMA (Gemini) + 📚 RAG (Ollama) - Hybrid approach');

    try {
      // 1. First get RAG response with Ollama
      console.log('📚 Step 1: Getting RAG response with Ollama...');
      const ragResult = await this.generateRAGResponse(query, language);

      // 2. Then enhance with SMA if available
      if (smaResults && smaResults.results && smaResults.results.length > 0) {
        console.log('🔍 Step 2: Enhancing with SMA results using Gemini...');

        // Combine RAG answer with SMA results for Gemini processing
        const combinedContext = {
          rag_answer: ragResult.success ? ragResult.answer : null,
          rag_sources: ragResult.sources || [],
          sma_results: smaResults.results,
          query: query
        };

        const enhancedPrompt = language === 'ar' ?
          `أنت مساعد ENIAD. لديك إجابة من قاعدة المعرفة المحلية ونتائج بحث ويب حديثة. ادمج المعلومات لتقديم إجابة شاملة.

إجابة قاعدة المعرفة المحلية:
${ragResult.answer || 'غير متوفرة'}

نتائج البحث الحديثة:
${JSON.stringify(smaResults.results.slice(0, 3), null, 2)}

السؤال: ${query}

الإجابة المدمجة:` :
          `Tu es l'assistant ENIAD. Tu as une réponse de la base de connaissances locale et des résultats de recherche web récents. Combine les informations pour une réponse complète.

Réponse base de connaissances locale:
${ragResult.answer || 'Non disponible'}

Résultats de recherche récents:
${JSON.stringify(smaResults.results.slice(0, 3), null, 2)}

Question: ${query}

Réponse combinée:`;

        const smaEnhanced = await this.generateSMAResponse(enhancedPrompt, language);

        if (smaEnhanced.success) {
          return {
            success: true,
            answer: smaEnhanced.answer,
            sources: [...(ragResult.sources || []), ...(smaResults.sources || [])],
            metadata: {
              approach: 'combined-sma-rag',
              rag_used: ragResult.success,
              sma_used: true,
              rag_engine: 'ollama',
              sma_engine: 'gemini',
              coordination_policy: 'hybrid-when-sma-active',
              combined_sources: true
            }
          };
        }
      }

      // Fallback to RAG only if SMA enhancement fails
      console.log('🔄 SMA enhancement failed, using RAG only...');
      return {
        ...ragResult,
        metadata: {
          ...ragResult.metadata,
          approach: 'rag-only-fallback',
          sma_attempted: true,
          sma_failed: true
        }
      };

    } catch (error) {
      console.error('❌ Combined SMA+RAG error:', error);
      return {
        success: false,
        answer: language === 'ar' ?
          'عذراً، فشل النظام المدمج SMA+RAG.' :
          'Désolé, échec du système combiné SMA+RAG.',
        metadata: {
          approach: 'combined-sma-rag',
          error: error.message
        }
      };
    }
  }

  /**
   * Router principal qui applique la séparation stricte
   */
  async routeRequest(type, query, language = 'fr', options = {}) {
    console.log(`🎯 Coordination Router: ${type.toUpperCase()} request`);

    // Check if SMA is active and we should combine
    const isSMAActive = options.isSMAActive || false;
    const hasSMAResults = options.smaResults && options.smaResults.results && options.smaResults.results.length > 0;

    switch (type.toLowerCase()) {
      case 'rag':
        if (isSMAActive && hasSMAResults) {
          console.log('🔄 Routing to Combined SMA+RAG (SMA button active)');
          return await this.generateCombinedSMARAGResponse(query, language, options.smaResults);
        } else {
          console.log('📚 Routing to RAG with Ollama ONLY');
          return await this.generateRAGResponse(query, language, options);
        }

      case 'sma':
        console.log('🔍 Routing to SMA with Gemini ONLY');
        return await this.generateSMAResponse(query, language, options.smaResults);

      default:
        console.error('❌ Unknown request type:', type);
        return {
          success: false,
          answer: language === 'ar' ?
            'نوع طلب غير معروف.' :
            'Type de requête inconnu.',
          metadata: {
            error: 'Unknown request type',
            coordination_policy: 'strict-separation'
          }
        };
    }
  }

  /**
   * Valider la séparation des responsabilités
   */
  validateSeparation(requestType, engineUsed) {
    const validCombinations = {
      'rag': ['ollama', 'llama'],
      'sma': ['gemini']
    };
    
    const allowedEngines = validCombinations[requestType.toLowerCase()] || [];
    const isValid = allowedEngines.some(engine => 
      engineUsed.toLowerCase().includes(engine)
    );
    
    if (!isValid) {
      console.warn(`⚠️ SEPARATION VIOLATION: ${requestType} using ${engineUsed}`);
      console.warn(`   Expected: ${allowedEngines.join(' or ')}`);
      console.warn(`   Got: ${engineUsed}`);
    }
    
    return isValid;
  }

  /**
   * Obtenir le statut de la coordination
   */
  async getCoordinationStatus() {
    const services = await this.checkServicesAvailability();
    
    return {
      policy: this.separationPolicy,
      services: services,
      separation: {
        rag_engine: 'ollama-only',
        sma_engine: 'gemini-only',
        strict_mode: true,
        violations: 0
      },
      ready: {
        rag: services.rag?.available || false,
        sma: services.sma?.available || false
      }
    };
  }
}

// Export singleton
const coordinationService = new CoordinationService();
export default coordinationService;
