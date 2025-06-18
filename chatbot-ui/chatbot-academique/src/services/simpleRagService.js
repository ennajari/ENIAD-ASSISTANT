/**
 * Simple RAG Service - NO EXTERNAL CONNECTIONS
 * Uses ONLY Ollama/Llama for RAG - NO Backend, NO Gemini
 * Avoids all connection errors by using direct Ollama + emergency fallback
 */

import ollamaService from './ollamaService.js';

class SimpleRagService {
  constructor() {
    this.useOllamaFirst = true;
    this.useEmergencyFallback = true;
    
    console.log('🦙 Simple RAG Service initialized - NO EXTERNAL CONNECTIONS');
    console.log('✅ Direct Ollama + Emergency fallback only');
    console.log('🚫 NO Backend connections to avoid errors');
  }

  /**
   * Generate answer with Ollama first, emergency fallback second
   */
  async generateAnswer(query, language = 'fr') {
    try {
      console.log('🦙 Simple RAG: Using Ollama first, emergency fallback second');
      
      // Try Ollama first
      if (this.useOllamaFirst) {
        const ollamaResult = await this.tryOllamaGeneration(query, language);
        if (ollamaResult.success) {
          console.log('✅ Simple RAG: Ollama successful');
          return ollamaResult;
        }
      }

      // Emergency fallback
      if (this.useEmergencyFallback) {
        console.log('🔄 Simple RAG: Using emergency fallback');
        const emergencyResult = await this.generateEmergencyResponse(query, language);
        if (emergencyResult.success) {
          console.log('✅ Simple RAG: Emergency fallback successful');
          return emergencyResult;
        }
      }

      // Final error
      return {
        success: false,
        answer: language === 'ar' ? 
          'عذراً، نظام RAG غير متاح حالياً.' : 
          'Désolé, le système RAG n\'est pas disponible.',
        sources: [],
        metadata: {
          model: 'Simple RAG (Failed)',
          gemini_used: false,
          ollama_failed: true,
          emergency_failed: true
        }
      };

    } catch (error) {
      console.error('❌ Simple RAG error:', error);
      return {
        success: false,
        answer: language === 'ar' ? 
          'عذراً، حدث خطأ في النظام.' : 
          'Désolé, une erreur s\'est produite.',
        sources: [],
        metadata: {
          model: 'Simple RAG (Error)',
          gemini_used: false,
          error: error.message
        }
      };
    }
  }

  /**
   * Try Ollama generation with error handling
   */
  async tryOllamaGeneration(query, language = 'fr') {
    try {
      console.log('🤖 Trying Ollama generation...');
      
      // Check if Ollama is ready
      const isReady = await ollamaService.isReadyForRAG();
      if (!isReady) {
        console.log('⚠️ Ollama not ready');
        return { success: false, error: 'Ollama not ready' };
      }
      
      // Use Ollama RAG response
      const result = await ollamaService.generateRAGResponse(query, language, []);
      
      if (result.success) {
        return {
          success: true,
          answer: result.answer,
          sources: [],
          metadata: {
            model: 'Simple RAG + Ollama',
            provider: 'ollama-direct',
            llm_engine: 'ollama',
            generation_model: result.model,
            embedding_model: result.embedding_model,
            gemini_used: false,
            simple_rag: true
          }
        };
      } else {
        return { success: false, error: result.error || 'Ollama generation failed' };
      }
      
    } catch (error) {
      console.error('❌ Ollama generation error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Emergency response without any external dependencies
   */
  async generateEmergencyResponse(query, language = 'fr') {
    try {
      console.log('🚨 Generating emergency response...');
      
      // Simple ENIAD knowledge base
      const eniadKnowledge = {
        fr: {
          name: "ENIAD (École Nationale de l'Intelligence Artificielle et du Digital)",
          location: "Berkane, Maroc",
          speciality: "Intelligence artificielle et technologies digitales",
          programs: [
            "Cycle Ingénieur en Intelligence Artificielle",
            "Machine Learning et Deep Learning",
            "Traitement du Langage Naturel",
            "Vision par Ordinateur",
            "Éthique de l'IA"
          ],
          admission: {
            period: "Mars à Juin",
            requirements: "Baccalauréat scientifique ou technique",
            process: "Concours écrit + entretien"
          },
          contact: {
            website: "https://eniad.ump.ma/fr",
            news: "https://eniad.ump.ma/fr/actualite"
          }
        },
        ar: {
          name: "ENIAD (المدرسة الوطنية للذكاء الاصطناعي والرقمي)",
          location: "بركان، المغرب",
          speciality: "الذكاء الاصطناعي والتكنولوجيا الرقمية",
          programs: [
            "دورة المهندس في الذكاء الاصطناعي",
            "التعلم الآلي والشبكات العصبية",
            "معالجة اللغة الطبيعية",
            "الرؤية الحاسوبية",
            "أخلاقيات الذكاء الاصطناعي"
          ],
          admission: {
            period: "من مارس إلى يونيو",
            requirements: "بكالوريا علمية أو تقنية",
            process: "اختبار كتابي + مقابلة"
          },
          contact: {
            website: "https://eniad.ump.ma/fr",
            news: "https://eniad.ump.ma/fr/actualite"
          }
        }
      };
      
      const knowledge = eniadKnowledge[language] || eniadKnowledge.fr;
      const queryLower = query.toLowerCase();
      
      let answer;
      
      // Detect query type and generate appropriate response
      if (queryLower.includes('programme') || queryLower.includes('formation') || queryLower.includes('cours')) {
        answer = language === 'ar' ? 
          `🎓 **برامج ${knowledge.name}:**\n\n${knowledge.programs.map(p => `• ${p}`).join('\n')}\n\n📍 **الموقع:** ${knowledge.location}\n🌐 **الموقع الإلكتروني:** ${knowledge.contact.website}` :
          `🎓 **Programmes ${knowledge.name} :**\n\n${knowledge.programs.map(p => `• ${p}`).join('\n')}\n\n📍 **Localisation :** ${knowledge.location}\n🌐 **Site web :** ${knowledge.contact.website}`;
      } else if (queryLower.includes('inscription') || queryLower.includes('admission') || queryLower.includes('candidature')) {
        answer = language === 'ar' ? 
          `📝 **التسجيل في ${knowledge.name}:**\n\n• **فترة التسجيل:** ${knowledge.admission.period}\n• **المتطلبات:** ${knowledge.admission.requirements}\n• **عملية الاختيار:** ${knowledge.admission.process}\n\n🌐 **للمزيد من المعلومات:** ${knowledge.contact.website}` :
          `📝 **Inscription à ${knowledge.name} :**\n\n• **Période d'inscription :** ${knowledge.admission.period}\n• **Prérequis :** ${knowledge.admission.requirements}\n• **Processus de sélection :** ${knowledge.admission.process}\n\n🌐 **Plus d'informations :** ${knowledge.contact.website}`;
      } else if (queryLower.includes('actualité') || queryLower.includes('news') || queryLower.includes('événement')) {
        answer = language === 'ar' ? 
          `📰 **أخبار وفعاليات ${knowledge.name}:**\n\n• **الأخبار الحديثة:** ${knowledge.contact.news}\n• **الموقع الرسمي:** ${knowledge.contact.website}\n\n💡 **نصيحة:** فعّل زر SMA (🔍) للحصول على آخر الأخبار!` :
          `📰 **Actualités et événements ${knowledge.name} :**\n\n• **Dernières actualités :** ${knowledge.contact.news}\n• **Site officiel :** ${knowledge.contact.website}\n\n💡 **Astuce :** Activez le bouton SMA (🔍) pour les dernières nouvelles !`;
      } else {
        answer = language === 'ar' ? 
          `مرحباً بك في مساعد ${knowledge.name}! 🎓\n\n**معلومات أساسية:**\n• **الاسم:** ${knowledge.name}\n• **الموقع:** ${knowledge.location}\n• **التخصص:** ${knowledge.speciality}\n\n🔍 **للمعلومات المحدثة:** فعّل زر SMA\n🌐 **الموقع الرسمي:** ${knowledge.contact.website}` :
          `Bienvenue sur l'assistant ${knowledge.name} ! 🎓\n\n**Informations de base :**\n• **Nom :** ${knowledge.name}\n• **Localisation :** ${knowledge.location}\n• **Spécialité :** ${knowledge.speciality}\n\n🔍 **Pour des infos à jour :** Activez le bouton SMA\n🌐 **Site officiel :** ${knowledge.contact.website}`;
      }
      
      return {
        success: true,
        answer: answer,
        sources: [
          { url: knowledge.contact.website, title: knowledge.name },
          { url: knowledge.contact.news, title: "Actualités ENIAD" }
        ],
        metadata: {
          model: 'Simple RAG + Emergency',
          provider: 'eniad-knowledge-base',
          llm_engine: 'none',
          gemini_used: false,
          ollama_used: false,
          emergency_mode: true,
          query_type: queryLower.includes('programme') ? 'programs' :
                     queryLower.includes('inscription') ? 'admission' :
                     queryLower.includes('actualité') ? 'news' : 'general'
        }
      };
      
    } catch (error) {
      console.error('❌ Emergency response error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get service status
   */
  async getStatus() {
    return {
      service: 'Simple RAG',
      mode: 'Direct Ollama + Emergency Fallback',
      external_connections: false,
      gemini_used: false,
      ollama_available: await ollamaService.isReadyForRAG(),
      emergency_available: true
    };
  }
}

// Export singleton
const simpleRagService = new SimpleRagService();
export default simpleRagService;
