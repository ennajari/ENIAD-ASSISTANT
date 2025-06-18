/**
 * Modal Service - Votre modèle Llama3 personnalisé sur Modal
 * Intégration avec RAG et SMA - Support du schéma chatBotResponseSchema
 */

import axios from 'axios';

class ModalService {
  constructor() {
    this.modalApiUrl = 'https://abdellahennajari2018--llama3-openai-compatible-serve.modal.run';
    this.isAvailable = false;

    // Schéma de réponse structuré pour votre modèle
    this.chatBotResponseSchema = {
      "title": "ChatBotResponse",
      "type": "object",
      "properties": {
        "contentment": {
          "title": "Contentment",
          "description": "Exprimez poliment que vous avez bien compris la question. Utilisez une phrase courte, rassurante, naturelle et adaptée au contexte de la question. Par exemple : 'Merci pour votre question', 'Je comprends votre demande', 'سؤال جيد، شكرًا لك'. Répondez dans la même langue que celle de la question.",
          "type": "string"
        },
        "main_answer": {
          "title": "Main Answer",
          "description": "Fournissez une réponse directe, claire et concise à la question posée. Évitez les longueurs inutiles. Répondez dans la même langue que celle utilisée dans la question.",
          "type": "string"
        },
        "details": {
          "title": "Details",
          "description": "Ajoutez des explications ou informations supplémentaires pour enrichir la réponse si nécessaire. Incluez des exemples, contextes ou précisions utiles. Répondez dans la même langue que celle de la question.",
          "type": "string"
        },
        "intent": {
          "title": "Intent",
          "description": "Identifiez l'intention principale de la question.",
          "enum": [
            "acadimique information",
            "Admissions et inscriptions",
            "Services aux étudiants",
            "Droits et responsabilités des étudiants",
            "Activités étudiantes",
            "Services administratifs",
            "Vie sur le campus",
            "Autre"
          ],
          "type": "string"
        },
        "related_questions": {
          "title": "Related Questions",
          "description": "Une liste de questions similaires ou couramment posées en lien avec la question actuelle. Répondez dans la même langue que celle de la question d'origine.",
          "type": "array",
          "items": {
            "title": "RelatedQuestion",
            "type": "object",
            "properties": {
              "question1": { "type": "string" },
              "question2": { "type": "string" },
              "question3": { "type": "string" }
            }
          }
        }
      },
      "required": ["contentment", "main_answer", "intent"]
    };

    // Ne pas tester automatiquement - service payant
    console.log('🚀 Modal Service initialized (testing disabled - paid service)');
  }

  /**
   * Test de connexion au service Modal (désactivé - service payant)
   */
  async testConnection() {
    // Ne pas tester automatiquement - service payant
    console.log('🚀 Modal service ready (testing disabled - paid service)');
    this.isAvailable = true; // Assume available for UI purposes
    return true;
  }

  /**
   * Test manuel de connexion (à utiliser seulement si nécessaire)
   */
  async manualTestConnection() {
    try {
      console.log('🔗 Manual testing Modal service connection...');

      const response = await axios.get(`${this.modalApiUrl}/health`, {
        timeout: 5000
      });

      this.isAvailable = response.status === 200;
      console.log(`✅ Modal service: ${this.isAvailable ? 'Available' : 'Unavailable'}`);

      return this.isAvailable;
    } catch (error) {
      console.warn('⚠️ Modal service unavailable:', error.message);
      this.isAvailable = false;
      return false;
    }
  }

  /**
   * Créer le prompt système pour votre modèle avec schéma structuré
   */
  createSystemPrompt() {
    return [
      "Vous êtes un assistant dans une école qui s'appelle l'École Nationale de l'Intelligence Artificielle et Digitale de Berkane, capable de répondre aux questions des étudiants.",
      "Soyez poli dans votre réponse. Si l'on vous salue, accueillez l'utilisateur avec une des expressions suivantes:",
      "En arabe: السلام عليكم - صباح الخير - مساء الخير - مرحباً بك - أهلاً وسهلاً - كيف يمكنني مساعدتك اليوم؟",
      "En français: Bonjour - Bonsoir - Salut - Bienvenue - Comment puis-je vous aider aujourd'hui?",
      "Dans le cas où l'utilisateur pose une question uniquement pour les questions et non pour une autre entrée Pour vos réponses, variez vos phrases d'introduction au lieu d'utiliser toujours 'Merci pour votre question'. Utilisez différentes expressions comme:",
      "En arabe: أهلاً بك، يسعدني مساعدتك - شكراً على سؤالك - أفهم ما تقصد - سؤال جيد - طبعاً يمكنني مساعدتك",
      "En français: Je comprends votre demande - Je vous écoute - Bien sûr, je peux vous aider - C'est une excellente question - Je suis là pour vous aider",
      "Si l'utilisateur vous salue en arabe, répondez avec une salutation en arabe. Si la salutation est en français, répondez en français.",
      "Adaptez toujours votre réponse à la langue de la question (arabe ou français).",
      "Vérifiez les données attentivement lorsque vous répondez.",
      "Essayez d'éviter tous les mots et textes qui n'ont pas de sens dans ces données.",
      "Faites très attention à la langue dans laquelle la question est posée.",
      "Vous devez répondre dans la même langue que celle de la question.",
      "Ne répondez pas tant que vous n'êtes pas sûr de la langue de la question.",
      "Si c'est en arabe, répondez en arabe. Si c'est en français, répondez en français. Si c'est en anglais, répondez en anglais.",
      "Ignorez les éléments inutiles dans la question tels que les numéros de version ou de commande, et concentrez-vous uniquement sur la question.",
      "Faites attention aux fautes d'orthographe pour ne pas altérer votre compréhension.",
      "Extraire les détails JSON du texte conformément aux questions posées et aux spécifications Pydantic.",
      "Extraire les détails comme indiqué dans le texte. Vous pouvez les reformater, mais gardez le sens.",
      "Ne pas générer d'introduction ni de conclusion.",
      "repandre en paragraphe text",
      "n'oblier pas les questions similaires a la fin au moins deux mais Ils doivent être présentés avec le contexte du texte et ne doivent en aucun cas être mentionnés auparavant. Indiquez simplement à l'utilisateur que vous pouvez l'aider avec d'autres choses, puis posez des questions.",
      "Ne vous limitez pas toujours à la première phrase de votre question, très bien, merci, mais diversifiez plutôt la phrase.",
      "",
      "IMPORTANT: Répondez UNIQUEMENT avec un objet JSON valide selon le schéma chatBotResponseSchema fourni. Ne pas inclure de texte avant ou après le JSON."
    ].join('\n');
  }

  /**
   * Générer une réponse avec votre modèle Modal (schéma structuré)
   */
  async generateResponse(prompt, options = {}) {
    try {
      if (!this.isAvailable) {
        throw new Error('Modal service not available - testing disabled (paid service)');
      }

      console.log('🚀 Using Modal Llama3 model with structured schema...');

      const payload = {
        model: 'llama3',
        messages: [
          {
            role: 'system',
            content: this.createSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 1200,
        temperature: options.temperature || 0.3,
        stream: false,
        response_format: { type: "json_object" } // Force JSON response
      };

      const response = await axios.post(
        `${this.modalApiUrl}/v1/chat/completions`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer dummy' // Modal peut nécessiter un token
          },
          timeout: 60000
        }
      );

      if (response.data.choices && response.data.choices[0]) {
        const rawContent = response.data.choices[0].message.content;

        try {
          // Parse JSON response according to schema
          const structuredResponse = JSON.parse(rawContent);

          // Format the final answer
          let finalAnswer = structuredResponse.contentment + '\n\n' + structuredResponse.main_answer;

          if (structuredResponse.details) {
            finalAnswer += '\n\n' + structuredResponse.details;
          }

          // Add related questions if available
          if (structuredResponse.related_questions && structuredResponse.related_questions.length > 0) {
            const questions = structuredResponse.related_questions[0];
            const questionsList = [questions.question1, questions.question2, questions.question3]
              .filter(q => q && q.trim())
              .join('\n• ');

            if (questionsList) {
              finalAnswer += '\n\n📝 Questions similaires :\n• ' + questionsList;
            }
          }

          return {
            success: true,
            answer: finalAnswer,
            model: 'modal-llama3-structured',
            usage: response.data.usage,
            structured_data: structuredResponse,
            intent: structuredResponse.intent
          };
        } catch (parseError) {
          console.warn('⚠️ Failed to parse structured response, using raw content:', parseError);
          return {
            success: true,
            answer: rawContent,
            model: 'modal-llama3-fallback',
            usage: response.data.usage,
            parse_error: parseError.message
          };
        }
      } else {
        throw new Error('Invalid Modal response format');
      }

    } catch (error) {
      console.error('❌ Modal service error:', error);
      return {
        success: false,
        error: error.message,
        answer: null
      };
    }
  }

  /**
   * Générer une réponse RAG avec Modal (schéma structuré)
   */
  async generateRAGResponse(query, ragContext, language = 'fr') {
    try {
      console.log('🦙 Using Modal Llama3 for RAG response with structured schema...');

      const prompt = language === 'ar' ?
        `أنت مساعد ENIAD متخصص. استخدم السياق التالي من قاعدة المعرفة للإجابة على السؤال.

السياق من قاعدة المعرفة ENIAD:
${ragContext || 'لا يوجد سياق متاح'}

السؤال: ${query}

يرجى الرد بتنسيق JSON المطلوب بناءً على السياق المقدم فقط.` :
        `Tu es l'assistant ENIAD spécialisé. Utilise le contexte suivant de la base de connaissances pour répondre à la question.

Contexte de la base de connaissances ENIAD:
${ragContext || 'Aucun contexte disponible'}

Question: ${query}

Veuillez répondre au format JSON requis basé uniquement sur le contexte fourni.`;

      const result = await this.generateResponse(prompt, {
        maxTokens: 800,
        temperature: 0.2
      });

      if (result.success) {
        return {
          success: true,
          answer: result.answer,
          sources: ['Base de connaissances ENIAD'],
          metadata: {
            model: 'Modal Llama3 + RAG',
            provider: 'modal-rag',
            engine: 'modal-llama3-structured',
            rag_enhanced: true,
            structured_response: true,
            intent: result.intent,
            usage: result.usage,
            structured_data: result.structured_data
          }
        };
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('❌ Modal RAG error:', error);
      return {
        success: false,
        error: error.message,
        answer: language === 'ar' ?
          'عذراً، فشل نموذج Modal في معالجة RAG.' :
          'Désolé, échec du modèle Modal pour RAG.'
      };
    }
  }

  /**
   * Générer une réponse SMA avec Modal
   */
  async generateSMAResponse(query, smaResults, language = 'fr') {
    try {
      console.log('🔍 Using Modal Llama3 for SMA response...');

      const prompt = language === 'ar' ? 
        `أنت مساعد ENIAD متخصص في معالجة نتائج البحث الويب. استخدم النتائج التالية للإجابة.

نتائج البحث:
${JSON.stringify(smaResults, null, 2)}

السؤال: ${query}

الإجابة (بناءً على نتائج البحث):` :
        `Tu es l'assistant ENIAD spécialisé dans le traitement des résultats de recherche web. Utilise les résultats suivants pour répondre.

Résultats de recherche:
${JSON.stringify(smaResults, null, 2)}

Question: ${query}

Réponse (basée sur les résultats de recherche):`;

      const result = await this.generateResponse(prompt, {
        maxTokens: 700,
        temperature: 0.4
      });

      if (result.success) {
        return {
          success: true,
          answer: result.answer,
          sources: smaResults?.sources || [],
          metadata: {
            model: 'Modal Llama3 + SMA',
            provider: 'modal-sma',
            engine: 'modal-llama3',
            sma_enhanced: true,
            usage: result.usage
          }
        };
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('❌ Modal SMA error:', error);
      return {
        success: false,
        error: error.message,
        answer: language === 'ar' ? 
          'عذراً، فشل نموذج Modal في معالجة SMA.' : 
          'Désolé, échec du modèle Modal pour SMA.'
      };
    }
  }

  /**
   * Générer une réponse combinée SMA + RAG avec Modal (schéma structuré)
   */
  async generateCombinedResponse(query, ragContext, smaResults, language = 'fr') {
    try {
      console.log('🔄 Using Modal Llama3 for Combined SMA+RAG with structured schema...');

      const prompt = language === 'ar' ?
        `أنت مساعد ENIAD متقدم. لديك معلومات من قاعدة المعرفة المحلية ونتائج بحث ويب حديثة. ادمج المعلومات لتقديم إجابة شاملة ودقيقة.

معلومات قاعدة المعرفة المحلية (RAG):
${ragContext || 'غير متوفرة'}

نتائج البحث الحديثة (SMA):
${smaResults ? JSON.stringify(smaResults.results?.slice(0, 3) || [], null, 2) : 'غير متوفرة'}

السؤال: ${query}

يرجى الرد بتنسيق JSON المطلوب مع دمج المعلومات من كلا المصدرين.` :
        `Tu es l'assistant ENIAD avancé. Tu as des informations de la base de connaissances locale et des résultats de recherche web récents. Combine les informations pour une réponse complète et précise.

Informations base de connaissances locale (RAG):
${ragContext || 'Non disponible'}

Résultats de recherche récents (SMA):
${smaResults ? JSON.stringify(smaResults.results?.slice(0, 3) || [], null, 2) : 'Non disponible'}

Question: ${query}

Veuillez répondre au format JSON requis en combinant les informations des deux sources.`;

      const result = await this.generateResponse(prompt, {
        maxTokens: 1200,
        temperature: 0.3
      });

      if (result.success) {
        return {
          success: true,
          answer: result.answer,
          sources: [...(smaResults?.sources || []), 'Base de connaissances ENIAD'],
          metadata: {
            model: 'Modal Llama3 + SMA + RAG',
            provider: 'modal-combined',
            engine: 'modal-llama3-structured',
            rag_enhanced: !!ragContext,
            sma_enhanced: !!(smaResults && smaResults.results),
            combined_approach: true,
            structured_response: true,
            intent: result.intent,
            usage: result.usage,
            structured_data: result.structured_data
          }
        };
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('❌ Modal Combined error:', error);
      return {
        success: false,
        error: error.message,
        answer: language === 'ar' ?
          'عذراً، فشل نموذج Modal في المعالجة المدمجة.' :
          'Désolé, échec du modèle Modal pour le traitement combiné.'
      };
    }
  }

  /**
   * Obtenir le statut du service Modal
   */
  async getStatus() {
    const isConnected = await this.testConnection();
    
    return {
      available: isConnected,
      url: this.modalApiUrl,
      model: 'llama3',
      provider: 'modal',
      capabilities: ['rag', 'sma', 'combined'],
      last_check: new Date().toISOString()
    };
  }
}

// Export singleton
const modalService = new ModalService();
export default modalService;
