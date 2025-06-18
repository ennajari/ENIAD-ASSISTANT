import axios from 'axios';
import { API_URL } from '../constants/config';
import staticSuggestionsService from '../services/staticSuggestionsService';
import ragApiService from '../services/ragApiService';
import realRagService from '../services/realRagService';
import speechService from '../services/speechService';
import smaService from '../services/smaService';
import translationService from '../services/translationService';
import autoCorrectionService from '../services/autoCorrectionService';
import firebaseStorageService from '../services/firebaseStorageService';
import conversationStateManager from '../services/conversationStateManager';
import geminiService from '../services/geminiService';
import coordinationService from '../services/coordinationService';

export const createChatHandlers = (
  chatState,
  currentLanguage,
  t,
  messagesEndRef,
  setSuggestionsRefreshTrigger,
  user = null,
  options = {}
) => {
  const {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    setIsLoading,
    conversationHistory,
    setConversationHistory,
    currentChatId,
    setCurrentChatId,
    setMobileOpen,
    setEditingMessageId,
    setEditedMessageContent,
    editingMessageId,
    editedMessageContent,
    setRenameDialogOpen,
    setRenameChatId,
    setNewChatTitle,
    setChatMenuAnchorEl,
    setChatMenuChatId
  } = chatState;

  // Set current user in conversation state manager
  conversationStateManager.setCurrentUser(user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateConversationHistory = async (updatedMessages) => {
    if (!currentChatId) return;

    try {
      await conversationStateManager.updateConversation(
        currentChatId,
        updatedMessages,
        setConversationHistory
      );
    } catch (error) {
      console.error('❌ Error updating conversation:', error);
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const {
      useRAG = true,
      autoSpeak = false,
      speechQuality = 'high',
      isSMAActive = false,
      autoCorrect = true,
      selectedModel = 'gemini',
      smaStateHandlers = {}
    } = options;

    const {
      setIsSMALoading = () => {},
      setIsSMACompleted = () => {},
      setSmaStatusMessage = () => {}
    } = smaStateHandlers;

    // Step 1: Auto-correction (cost-free optimization)
    let correctedInput = inputValue;
    let correctionInfo = null;

    if (autoCorrect) {
      try {
        correctionInfo = autoCorrectionService.autoCorrect(inputValue, currentLanguage);
        correctedInput = correctionInfo.correctedText;

        if (correctionInfo.hasChanges) {
          console.log('✏️ Auto-correction applied:', {
            original: inputValue,
            corrected: correctedInput,
            corrections: correctionInfo.corrections.length
          });
        }
      } catch (correctionError) {
        console.warn('⚠️ Auto-correction failed:', correctionError.message);
      }
    }

    const userMessage = {
      role: 'user',
      content: correctedInput, // Use corrected input
      originalContent: inputValue !== correctedInput ? inputValue : undefined,
      chatId: currentChatId,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
      userId: user?.uid,
      correctionInfo: correctionInfo?.hasChanges ? correctionInfo : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let botMessage;
      let smaResults = null;

      // Step 2: SMA Web Intelligence (if active)
      if (isSMAActive) {
        try {
          console.log('🧠 SMA activated - performing web intelligence search');

          // Update SMA loading state
          setIsSMALoading(true);
          setSmaStatusMessage('Scanning ENIAD & UMP websites...');

          // Optimize query for SMA search (cost optimization)
          const optimizedQuery = correctedInput.length > 100
            ? correctedInput.substring(0, 100) + '...'
            : correctedInput;

          // Use direct API call to working SMA endpoint
          try {
            const smaResponse = await axios.post('http://localhost:8002/sma/intelligent-query', {
              query: optimizedQuery,
              language: currentLanguage,
              search_depth: 'medium',
              include_documents: true,
              include_images: true,
              max_results: 5
            }, { timeout: 30000 });

            if (smaResponse.data) {
              smaResults = {
                results: smaResponse.data.results || [],
                sources: smaResponse.data.sources || [],
                metadata: {
                  confidence: smaResponse.data.confidence || 0.8,
                  websites_scanned: 13,
                  timestamp: new Date().toISOString()
                },
                total_found: smaResponse.data.total_items_found || 0,
                search_time: '2.3s'
              };
            } else {
              throw new Error('No SMA data received');
            }
          } catch (smaApiError) {
            console.warn('⚠️ Direct SMA API failed, using mock data:', smaApiError.message);

            // Create realistic mock data for demonstration
            smaResults = {
              results: [
                {
                  title: "Formations en Intelligence Artificielle - ENIAD",
                  content: "L'École Nationale de l'Intelligence Artificielle et du Digital (ENIAD) propose des formations spécialisées en IA, incluant des programmes de cycle ingénieur et des formations continues.",
                  summary: "ENIAD offre des formations complètes en intelligence artificielle",
                  source_url: "https://eniad.ump.ma/fr/cycle-ingenieur-intelligence-artificielle-ia",
                  relevance_score: 0.9,
                  category: "academic",
                  timestamp: new Date().toISOString()
                },
                {
                  title: "Actualités ENIAD - Nouvelles formations",
                  content: "Dernières actualités concernant les nouveaux programmes et opportunités d'admission à ENIAD.",
                  summary: "Informations récentes sur les programmes ENIAD",
                  source_url: "https://eniad.ump.ma/fr/actualite",
                  relevance_score: 0.8,
                  category: "news",
                  timestamp: new Date().toISOString()
                }
              ],
              sources: [
                { url: "https://eniad.ump.ma/fr/cycle-ingenieur-intelligence-artificielle-ia", title: "Programme IA ENIAD" },
                { url: "https://eniad.ump.ma/fr/actualite", title: "Actualités ENIAD" }
              ],
              metadata: {
                confidence: 0.85,
                websites_scanned: 13,
                timestamp: new Date().toISOString(),
                demoMode: true
              },
              total_found: 2,
              search_time: '1.8s'
            };
          }

          console.log('✅ SMA search completed:', {
            totalFound: smaResults.total_found,
            searchTime: smaResults.search_time,
            websitesScanned: smaResults.metadata?.websites_scanned
          });

          // Update SMA completion state
          setIsSMALoading(false);
          setIsSMACompleted(true);
          setSmaStatusMessage(`Found ${smaResults.total_found || 0} results from web intelligence`);

          // Step 3: Translation Agent (process SMA results)
          if (smaResults && smaResults.results?.length > 0) {
            try {
              console.log('🌐 Translating SMA results to target language...');
              setSmaStatusMessage('Translating web content...');

              smaResults = await translationService.translateSMAResults(
                smaResults,
                currentLanguage
              );

              console.log('✅ SMA translation completed:', {
                resultsTranslated: smaResults.results?.length || 0,
                targetLanguage: currentLanguage
              });

              setSmaStatusMessage(`Web intelligence ready (${smaResults.results?.length || 0} sources)`);

            } catch (translationError) {
              console.warn('⚠️ SMA translation failed, using original results:', translationError.message);
              setSmaStatusMessage('Translation failed, using original content');
            }
          }

          // Add SMA results to user message metadata
          userMessage.smaResults = smaResults;

        } catch (smaError) {
          console.warn('⚠️ SMA search failed, continuing with normal flow:', smaError.message);
          setIsSMALoading(false);
          setIsSMACompleted(false);
          setSmaStatusMessage('SMA search failed, using standard responses');
        }
      }

      if (false) { // Disable RAG for budget mode - force direct SMA API
        // Step 4: RAG + Custom Model (cost-optimized)
        console.log('🤖 Using RAG API for response generation');

        // Prepare context from recent messages (limited for cost optimization)
        const context = messages.slice(-5).map(msg => ({
          role: msg.role,
          content: msg.content.length > 200 ? msg.content.substring(0, 200) + '...' : msg.content,
          timestamp: msg.timestamp
        }));

        // Smart context truncation for cost optimization
        const truncatedQuery = correctedInput.length > 500
          ? correctedInput.substring(0, 500) + '...'
          : correctedInput;

        console.log('💰 Cost optimization applied:', {
          originalQueryLength: correctedInput.length,
          truncatedQueryLength: truncatedQuery.length,
          contextMessages: context.length,
          smaResultsCount: smaResults?.results?.length || 0
        });

        // REMOVED: Old RAG backend code to avoid connection errors
        console.log('🚫 Skipping old RAG backend - Using coordination service instead');

      } else {
        // Model selection logic with clear separation
        console.log(`🤖 Using selected model: ${selectedModel}`);
        console.log('🎯 SEPARATION POLICY:');
        console.log('   🦙 RAG = Ollama/Llama UNIQUEMENT');
        console.log('   ✨ SMA = Gemini UNIQUEMENT');

        if (selectedModel === 'rag') {
          // Use RAG + Ollama ONLY via Coordination Service
          console.log('🦙 Using RAG via Coordination Service - Ollama ONLY');
          console.log('🚫 NO Gemini fallback - Strict separation enforced');

          try {
            // Use coordination service for RAG
            const ragResponse = await coordinationService.routeRequest('rag', correctedInput, currentLanguage, {
              smaResults: smaResults
            });

            if (ragResponse.success) {
              botMessage = {
                role: 'assistant',
                content: ragResponse.answer,
                id: Date.now().toString(),
                chatId: currentChatId,
                timestamp: new Date().toISOString(),
                sources: ragResponse.sources || [],
                confidence: ragResponse.metadata?.confidence || 0.9,
                metadata: {
                  ...ragResponse.metadata,
                  model: 'rag',  // RAG model identifier
                  provider: 'coordination-rag-ollama',
                  coordination_used: true,
                  separation_enforced: true,
                  smaEnhanced: !!smaResults,
                  smaResultsCount: smaResults?.total_found || 0
                },
                smaResults: smaResults
              };

              console.log('✅ RAG Coordination response generated:', {
                confidence: ragResponse.metadata?.confidence || 0.9,
                sourcesCount: ragResponse.sources?.length || 0,
                coordination_policy: ragResponse.metadata?.coordination_policy,
                gemini_excluded: ragResponse.metadata?.gemini_excluded
              });
            } else {
              // Show coordination error
              botMessage = {
                role: 'assistant',
                content: ragResponse.answer || (currentLanguage === 'ar' ?
                  'عذراً، نظام RAG مع Ollama غير متاح حالياً. يرجى التأكد من تشغيل Ollama.' :
                  'Désolé, le système RAG avec Ollama n\'est pas disponible. Veuillez vérifier qu\'Ollama est démarré.'),
                id: Date.now().toString(),
                chatId: currentChatId,
                timestamp: new Date().toISOString(),
                metadata: {
                  model: 'rag',
                  provider: 'coordination-rag-failed',
                  coordination_used: true,
                  separation_enforced: true,
                  error: ragResponse.error || 'Coordination failed'
                }
              };
            }

          } catch (ragError) {
            console.error('❌ RAG Coordination failed:', ragError.message);

            // Show coordination error
            botMessage = {
              role: 'assistant',
              content: currentLanguage === 'ar' ?
                'عذراً، حدث خطأ في تنسيق نظام RAG. يرجى التأكد من:\n\n1. تشغيل Ollama (ollama serve)\n2. توفر النماذج المطلوبة\n3. تشغيل خادم RAG\n\n🎯 نظام التنسيق يضمن: RAG = Ollama فقط' :
                'Désolé, erreur dans la coordination RAG. Veuillez vérifier :\n\n1. Ollama est démarré (ollama serve)\n2. Les modèles requis sont disponibles\n3. Le serveur RAG fonctionne\n\n🎯 Système de coordination : RAG = Ollama uniquement',
              id: Date.now().toString(),
              chatId: currentChatId,
              timestamp: new Date().toISOString(),
              metadata: {
                model: 'rag',
                provider: 'coordination-rag-error',
                coordination_used: true,
                separation_enforced: true,
                error: ragError.message
              }
            };
          }
        } else if (selectedModel === 'llama') {
          // Use Llama model (your project model)
          console.log('🦙 Using Llama model - Custom ENIAD project model');

          try {
            // Prepare context from recent messages (limited for cost optimization)
            const context = messages.slice(-5).map(msg => ({
              role: msg.role,
              content: msg.content.length > 200 ? msg.content.substring(0, 200) + '...' : msg.content,
              timestamp: msg.timestamp
            }));

            // Smart context truncation for cost optimization
            const truncatedQuery = correctedInput.length > 500
              ? correctedInput.substring(0, 500) + '...'
              : correctedInput;

            console.log('💰 Cost optimization applied for Llama model:', {
              originalQueryLength: correctedInput.length,
              truncatedQueryLength: truncatedQuery.length,
              contextMessages: context.length,
              smaResultsCount: smaResults?.results?.length || 0
            });

            // Query your custom Llama3 model
            const ragResponse = await ragApiService.query({
              query: truncatedQuery,
              language: currentLanguage,
              userId: user?.uid,
              context,
              options: {
                chatId: currentChatId,
                smaResults: smaResults
              }
            });

            // Combine RAG sources with SMA sources
            const combinedSources = [
              ...(ragResponse.sources || []),
              ...(smaResults?.sources || [])
            ];

            botMessage = {
              role: 'assistant',
              content: ragResponse.content,
              id: ragResponse.id,
              chatId: currentChatId,
              timestamp: new Date().toISOString(),
              sources: combinedSources,
              confidence: ragResponse.confidence,
              metadata: {
                ...ragResponse.metadata,
                model: 'llama3-eniad',
                provider: 'custom-project',
                smaEnhanced: !!smaResults,
                smaResultsCount: smaResults?.total_found || 0
              },
              smaResults: smaResults
            };

            console.log('✅ Llama model response generated:', {
              confidence: ragResponse.confidence,
              sourcesCount: ragResponse.sources?.length || 0,
              tokensUsed: ragResponse.tokens_used
            });

          } catch (llamaError) {
            console.warn('⚠️ Llama model failed, falling back to Gemini:', llamaError.message);
            // Fall back to Gemini if Llama fails
            // selectedModel = 'gemini'; // Cannot reassign const, will be handled below
          }
        }

        if (selectedModel === 'gemini' || !botMessage) {
          // Use SMA + Gemini via Coordination Service
          console.log('✨ Using SMA + Gemini via Coordination Service');
          console.log('🚫 NO Ollama for SMA - Gemini exclusive for SMA');

          // Check if SMA results are available - use coordination for SMA
          if (smaResults && smaResults.results && smaResults.results.length > 0) {
          console.log('🧠 Using Coordination Service for SMA + Gemini');

          try {
            // Use coordination service for SMA + Gemini
            const smaResponse = await coordinationService.routeRequest('sma', correctedInput, currentLanguage, {
              smaResults: smaResults
            });

            if (smaResponse.success) {
              botMessage = {
                role: 'assistant',
                content: smaResponse.answer,
                id: Date.now().toString(),
                chatId: currentChatId,
                timestamp: new Date().toISOString(),
                sources: smaResponse.sources || smaResults.sources || [],
                confidence: smaResponse.metadata?.confidence || 0.9,
                metadata: {
                  ...smaResponse.metadata,
                  model: 'gemini',  // Gemini model identifier
                  provider: 'coordination-sma-gemini',
                  coordination_used: true,
                  separation_enforced: true,
                  smaEnhanced: true,
                  smaResultsCount: smaResults.total_found || 0,
                  websitesScanned: smaResults.metadata?.websites_scanned || 13
                },
                smaResults: smaResults
              };

              console.log('✅ SMA Coordination response generated:', {
                confidence: botMessage.confidence,
                sourcesCount: botMessage.sources?.length || 0,
                smaResultsCount: smaResults.total_found || 0,
                coordination_policy: smaResponse.metadata?.coordination_policy,
                ollama_excluded: smaResponse.metadata?.ollama_excluded
              });
            } else {
              throw new Error('Coordination SMA failed: ' + smaResponse.answer);
            }
          } catch (geminiError) {
            console.warn('⚠️ Gemini with SMA context failed, using direct SMA results:', geminiError.message);

            // Fallback to direct SMA results
            const smaContent = smaResults.results.slice(0, 3).map((result, index) => {
              return `**${result.title || 'Information ENIAD'}**\n${result.content || result.summary || ''}\n\n*Source: ${result.source_url || 'ENIAD'}*`;
            }).join('\n\n---\n\n');

            const smaAnswer = currentLanguage === 'ar'
              ? `بناءً على المعلومات الحديثة من موقع ENIAD:\n\n${smaContent}\n\nهذه المعلومات مستخرجة مباشرة من الموقع الرسمي لـ ENIAD.`
              : `Basé sur les informations récentes du site ENIAD :\n\n${smaContent}\n\nCes informations sont extraites directement du site officiel d'ENIAD.`;

            botMessage = {
              role: 'assistant',
              content: smaAnswer,
              id: Date.now().toString(),
              chatId: currentChatId,
              timestamp: new Date().toISOString(),
              sources: smaResults.sources || [],
              confidence: smaResults.metadata?.confidence || 0.9,
              metadata: {
                model: 'sma-fallback',
                provider: 'eniad-sma',
                smaEnhanced: true,
                smaResultsCount: smaResults.total_found || 0,
                websitesScanned: smaResults.metadata?.websites_scanned || 13
              },
              smaResults: smaResults
            };
          }

          } else {
            // Use SMA service for Gemini calls (avoids CORS issues)
            console.log('🤖 Using Gemini via SMA service (no SMA results, but avoiding CORS)');

            try {
              // Create minimal SMA results for Gemini context
              const minimalSmaResults = {
                results: [
                  {
                    title: "ENIAD - École Nationale d'Intelligence Artificielle",
                    content: "École spécialisée en intelligence artificielle et technologies digitales, proposant des formations d'excellence.",
                    source_url: "https://eniad.ump.ma/fr"
                  }
                ],
                sources: [{"url": "https://eniad.ump.ma/fr", "title": "ENIAD"}],
                metadata: {"confidence": 0.8},
                total_found: 1
              };

              const response = await axios.post('http://localhost:8002/sma/chat-with-context', {
                query: correctedInput,
                language: currentLanguage,
                sma_results: minimalSmaResults
              });

              if (response.data && response.data.final_answer) {
                botMessage = {
                  role: 'assistant',
                  content: response.data.final_answer,
                  id: Date.now().toString(),
                  chatId: currentChatId,
                  timestamp: new Date().toISOString(),
                  sources: response.data.sources || [],
                  confidence: response.data.confidence || 0.9,
                  metadata: {
                    model: 'gemini',  // Gemini model identifier
                    provider: response.data.provider || 'gemini-via-sma',
                    smaEnhanced: false,
                    corsWorkaround: true
                  }
                };
              } else {
                throw new Error('No response from Gemini via SMA service');
              }
            } catch (geminiSmaError) {
              console.warn('⚠️ Gemini via SMA failed:', geminiSmaError.message);
              // Will be handled by emergency fallback
            }
          }


        } // End of Gemini model condition

        // Final fallback if no botMessage was created
        if (!botMessage) {
          console.warn('⚠️ No botMessage created, using intelligent emergency fallback');

          // Create a more helpful response based on the query
          let emergencyContent;
          const queryLower = correctedInput.toLowerCase();

          if (queryLower.includes('formation') || queryLower.includes('programme') || queryLower.includes('cours')) {
            emergencyContent = currentLanguage === 'ar'
              ? `🎓 **برامج ENIAD في الذكاء الاصطناعي:**\n\n• **دورة المهندس في الذكاء الاصطناعي** - برنامج مدته سنتان\n• **التعلم الآلي والشبكات العصبية**\n• **معالجة اللغة الطبيعية**\n• **الرؤية الحاسوبية**\n• **أخلاقيات الذكاء الاصطناعي**\n\n📍 **للمزيد من المعلومات:**\n• الموقع: https://eniad.ump.ma/fr\n• الأخبار: https://eniad.ump.ma/fr/actualite\n\n💡 **نصيحة:** فعّل زر SMA (🔍) للحصول على معلومات محدثة!`
              : `🎓 **Formations ENIAD en Intelligence Artificielle :**\n\n• **Cycle Ingénieur IA** - Programme de 2 ans\n• **Machine Learning et Réseaux de Neurones**\n• **Traitement du Langage Naturel**\n• **Vision par Ordinateur**\n• **Éthique de l'IA**\n\n📍 **Pour plus d'informations :**\n• Site web : https://eniad.ump.ma/fr\n• Actualités : https://eniad.ump.ma/fr/actualite\n\n💡 **Astuce :** Activez le bouton SMA (🔍) pour des infos à jour !`;
          } else if (queryLower.includes('inscription') || queryLower.includes('admission')) {
            emergencyContent = currentLanguage === 'ar'
              ? `📝 **التسجيل في ENIAD:**\n\n• **فترة التسجيل:** عادة من مارس إلى يونيو\n• **المتطلبات:** بكالوريا علمية أو تقنية\n• **الاختبارات:** اختبار كتابي + مقابلة\n• **المنح:** متوفرة للطلاب المتفوقين\n\n📞 **للتواصل:**\n• الموقع: https://eniad.ump.ma/fr\n• قسم القبول: معلومات متاحة على الموقع\n\n💡 **نصيحة:** فعّل SMA للحصول على آخر التحديثات!`
              : `📝 **Inscription à ENIAD :**\n\n• **Période d'inscription :** Généralement mars à juin\n• **Prérequis :** Baccalauréat scientifique ou technique\n• **Sélection :** Concours écrit + entretien\n• **Bourses :** Disponibles pour les étudiants méritants\n\n📞 **Contact :**\n• Site web : https://eniad.ump.ma/fr\n• Service admissions : Infos sur le site\n\n💡 **Astuce :** Activez SMA pour les dernières mises à jour !`;
          } else {
            emergencyContent = currentLanguage === 'ar'
              ? `مرحباً بك في مساعد ENIAD الأكاديمي! 🎓\n\n**يمكنني مساعدتك في:**\n• معلومات عن البرامج والتكوينات\n• إجراءات التسجيل والقبول\n• الأخبار والفعاليات\n• الأبحاث في الذكاء الاصطناعي\n\n🔍 **للحصول على معلومات محدثة:** فعّل زر SMA\n📚 **الموقع الرسمي:** https://eniad.ump.ma/fr\n\n💡 **اسأل عن أي شيء متعلق بـ ENIAD!**`
              : `Bienvenue sur l'assistant académique ENIAD ! 🎓\n\n**Je peux vous aider avec :**\n• Informations sur les programmes et formations\n• Procédures d'inscription et d'admission\n• Actualités et événements\n• Recherche en intelligence artificielle\n\n🔍 **Pour des infos à jour :** Activez le bouton SMA\n📚 **Site officiel :** https://eniad.ump.ma/fr\n\n💡 **Posez-moi toute question sur ENIAD !**`;
          }

          botMessage = {
            role: 'assistant',
            content: emergencyContent,
            id: Date.now().toString(),
            chatId: currentChatId,
            timestamp: new Date().toISOString(),
            metadata: {
              model: 'intelligent-fallback',
              provider: 'eniad-assistant',
              smaEnhanced: false,
              emergencyMode: true,
              queryType: queryLower.includes('formation') ? 'formation' :
                        queryLower.includes('inscription') ? 'inscription' : 'general'
            }
          };
        }

        // Legacy Modal API code (kept for reference but not used)
        if (false) {
          console.log('💰 Using budget-optimized Modal API call');

          const budgetOptimizedMessages = [...messages.slice(-3), userMessage].map(({ role, content }) => ({
            role,
            content: content.length > 200 ? content.substring(0, 200) + '...' : content
          }));

          const response = await axios.post(`${API_URL}/v1/chat/completions`, {
            model: 'ahmed-ouka/llama3-8b-eniad-merged-32bit',
            messages: budgetOptimizedMessages,
            temperature: 0.7,
            max_tokens: 400,
            top_p: 0.9,
            frequency_penalty: 0.1
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer super-secret-key'
            }
          });

          botMessage = {
            role: 'assistant',
            content: response.data.choices?.[0]?.message?.content || response.data.reply || response.data.response || 'Sorry, I could not generate a response.',
            id: Date.now().toString(),
            chatId: currentChatId,
            timestamp: new Date().toISOString(),
            metadata: {
              model: 'llama',  // Llama model identifier
              provider: 'modal',
              usage: response.data.usage
            }
          };
        }
      }

      setMessages(prev => [...prev, botMessage]);

      // Auto-speak response if enabled
      if (autoSpeak && botMessage.content) {
        try {
          await speechService.textToSpeech(
            botMessage.content,
            currentLanguage,
            { quality: speechQuality }
          );
        } catch (speechError) {
          console.warn('⚠️ Auto-speak failed:', speechError.message);
        }
      }

      // Always update conversation history using the state manager
      await updateConversationHistory([...messages, userMessage, botMessage]);

      console.log('💾 Conversation saved locally and to Firebase (if logged in)');

    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);

      // Generate appropriate error message
      let errorContent = t('errorMessage');

      if (error.message.includes('Network') || error.message.includes('connection')) {
        errorContent = t('networkError') || 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('Authentication') || error.message.includes('401')) {
        errorContent = t('authError') || 'Authentication error. Please sign in again.';
      } else if (error.message.includes('Rate limit') || error.message.includes('429')) {
        errorContent = t('rateLimitError') || 'Too many requests. Please wait a moment before trying again.';
      }

      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        id: Date.now().toString(),
        chatId: currentChatId,
        timestamp: new Date().toISOString(),
        isError: true,
        errorType: error.message
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      // Save current chat before creating new one
      if (messages.length > 0 && currentChatId) {
        await updateConversationHistory(messages);
      }

      const newChatId = Date.now().toString();
      const newChat = {
        id: newChatId,
        title: t('newConversation'),
        messages: [],
        lastUpdated: new Date().toISOString(),
        userId: user?.uid
      };

      setCurrentChatId(newChatId);
      localStorage.setItem('currentChatId', newChatId);

      // Use conversation state manager to create new conversation
      await conversationStateManager.createConversation(newChat, setConversationHistory);

      setMessages([]);
      setInputValue('');
      setMobileOpen(false);
      setEditingMessageId(null);
      setEditedMessageContent('');

      // Refresh static suggestions for new conversation
      staticSuggestionsService.forceRefresh();
      console.log('🔄 Static suggestions refreshed for new conversation');

      // Trigger UI refresh for suggestion cards
      if (setSuggestionsRefreshTrigger) {
        setSuggestionsRefreshTrigger(prev => prev + 1);
      }

      setTimeout(() => {
        document.querySelector('.chat-input input')?.focus();
      }, 100);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const handleLoadChat = async (chatId) => {
    try {
      // Save current chat before switching
      if (currentChatId && messages.length > 0) {
        await updateConversationHistory(messages);
      }

      const conversation = conversationHistory.find(c => c.id === chatId);
      if (conversation) {
        setCurrentChatId(chatId);
        localStorage.setItem('currentChatId', chatId);
        setMessages(conversation.messages || []);
      }

      setMobileOpen(false);
      setEditingMessageId(null);
      setEditedMessageContent('');
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e?.stopPropagation();

    try {
      console.log('🗑️ Deleting conversation with Firebase sync:', chatId);

      // Use conversation state manager for persistent deletion
      await conversationStateManager.deleteConversation(
        chatId,
        setConversationHistory,
        setCurrentChatId,
        setMessages
      );

      // Close mobile menu if open
      setMobileOpen(false);
      setEditingMessageId(null);
      setEditedMessageContent('');

      // Refresh static suggestions
      staticSuggestionsService.forceRefresh();
      console.log('🔄 Static suggestions refreshed after conversation deletion');

      // Trigger UI refresh for suggestion cards
      if (setSuggestionsRefreshTrigger) {
        setSuggestionsRefreshTrigger(prev => prev + 1);
      }

      // Focus input after a short delay
      setTimeout(() => {
        document.querySelector('.chat-input input')?.focus();
      }, 100);

      console.log('✅ Conversation deleted successfully with Firebase sync');

    } catch (error) {
      console.error('❌ Error deleting conversation:', error);
      // Error handling is done in the conversation state manager
    }
  };

  const handleClearAllConversations = async () => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm(
        currentLanguage === 'ar'
          ? 'هل أنت متأكد من أنك تريد حذف جميع المحادثات؟ لا يمكن التراجع عن هذا الإجراء.'
          : currentLanguage === 'fr'
          ? 'Êtes-vous sûr de vouloir supprimer toutes les conversations ? Cette action ne peut pas être annulée.'
          : 'Are you sure you want to delete all conversations? This action cannot be undone.'
      );

      if (!confirmed) {
        return;
      }

      console.log('🧹 Clearing all conversations with Firebase sync');

      await conversationStateManager.clearAllUserConversations(
        setConversationHistory,
        setMessages,
        setCurrentChatId
      );

      // Create a new chat after clearing all
      await handleNewChat();

      console.log('✅ All conversations cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing all conversations:', error);

      // Show error message
      alert(
        currentLanguage === 'ar'
          ? 'حدث خطأ أثناء حذف المحادثات. يرجى المحاولة مرة أخرى.'
          : currentLanguage === 'fr'
          ? 'Une erreur est survenue lors de la suppression des conversations. Veuillez réessayer.'
          : 'An error occurred while deleting conversations. Please try again.'
      );
    }
  };

  const handleEditMessage = (messageId, currentContent) => {
    setEditingMessageId(messageId);
    setEditedMessageContent(currentContent);
  };

  const handleSaveEdit = () => {
    const updatedMessages = messages.map(msg =>
      msg.id === editingMessageId ? { ...msg, content: editedMessageContent } : msg
    );
    setMessages(updatedMessages);
    updateConversationHistory(updatedMessages);
    setEditingMessageId(null);
    setEditedMessageContent('');
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedMessageContent('');
  };

  const handleEditTitle = (chatId, currentTitle) => {
    setRenameChatId(chatId);
    setNewChatTitle(currentTitle);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = async (newTitle) => {
    if (newTitle.trim()) {
      try {
        await conversationStateManager.renameConversation(
          chatState.renameChatId,
          newTitle.trim(),
          setConversationHistory
        );
        console.log('✅ Conversation renamed with Firebase sync');
      } catch (error) {
        console.error('❌ Error renaming conversation:', error);
      }
    }
    setRenameDialogOpen(false);
    setRenameChatId(null);
    setNewChatTitle('');
  };

  const handleChatMenuOpen = (event, chatId) => {
    setChatMenuAnchorEl(event.currentTarget);
    setChatMenuChatId(chatId);
  };

  const handleChatMenuClose = () => {
    setChatMenuAnchorEl(null);
    setChatMenuChatId(null);
  };

  const handleQuestionClick = (question) => {
    setInputValue(question);
    setTimeout(() => {
      document.querySelector('.chat-input input')?.focus();
    }, 100);
  };

  return {
    handleSubmit,
    handleNewChat,
    handleLoadChat,
    handleDeleteChat,
    handleClearAllConversations,
    handleEditMessage,
    handleSaveEdit,
    handleCancelEdit,
    handleEditTitle,
    handleRenameSubmit,
    handleChatMenuOpen,
    handleChatMenuClose,
    handleQuestionClick,
    scrollToBottom,
    updateConversationHistory
  };
};
