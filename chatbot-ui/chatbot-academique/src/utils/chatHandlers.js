import axios from 'axios';
import { API_URL } from '../constants/config';
import staticSuggestionsService from '../services/staticSuggestionsService';
import ragApiService from '../services/ragApiService';
import speechService from '../services/speechService';
import smaService from '../services/smaService';
import translationService from '../services/translationService';
import autoCorrectionService from '../services/autoCorrectionService';
import firebaseStorageService from '../services/firebaseStorageService';
import conversationStateManager from '../services/conversationStateManager';

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

          smaResults = await smaService.activateSearch({
            query: optimizedQuery,
            language: currentLanguage,
            categories: ['news', 'documents', 'announcements', 'events'],
            realTime: true,
            maxResults: 5 // Reduced for cost optimization
          });

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

      if (false) { // Disable RAG for budget mode - force direct Modal API
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

        // Query your custom Llama3 model
        const ragResponse = await ragApiService.query({
          query: truncatedQuery, // Use truncated query for cost optimization
          language: currentLanguage,
          userId: user?.uid,
          context,
          options: {
            chatId: currentChatId,
            smaResults: smaResults // Pass translated SMA results to the model
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
            smaEnhanced: !!smaResults,
            smaResultsCount: smaResults?.total_found || 0
          },
          smaResults: smaResults // Include SMA results for display
        };

        console.log('✅ RAG response generated:', {
          confidence: ragResponse.confidence,
          sourcesCount: ragResponse.sources?.length || 0,
          tokensUsed: ragResponse.tokens_used
        });

      } else {
        // Fallback to direct API (OpenAI-compatible format) - BUDGET OPTIMIZED
        console.log('💰 Using budget-optimized direct API call');

        // Budget optimization: Limit context and tokens
        const budgetOptimizedMessages = [...messages.slice(-3), userMessage].map(({ role, content }) => ({
          role,
          content: content.length > 200 ? content.substring(0, 200) + '...' : content
        }));

        const response = await axios.post(`${API_URL}/v1/chat/completions`, {
          model: 'ahmed-ouka/llama3-8b-eniad-merged-32bit',
          messages: budgetOptimizedMessages,
          temperature: 0.7,
          max_tokens: 400, // Reduced from 1000 to save costs
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
            model: 'ahmed-ouka/llama3-8b-eniad-merged-32bit',
            usage: response.data.usage
          }
        };
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
