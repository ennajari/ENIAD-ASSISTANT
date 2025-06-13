import axios from 'axios';
import { API_URL } from '../constants/config';
import staticSuggestionsService from '../services/staticSuggestionsService';
import ragApiService from '../services/ragApiService';
import speechService from '../services/speechService';
import smaService from '../services/smaService';
import translationService from '../services/translationService';
import autoCorrectionService from '../services/autoCorrectionService';
import firebaseStorageService from '../services/firebaseStorageService';

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateConversationHistory = async (updatedMessages) => {
    if (!currentChatId) return;

    setConversationHistory(prev => {
      const existingChat = prev.find(c => c.id === currentChatId);
      const title = existingChat?.title || updatedMessages.find(m => m.role === 'user')?.content?.substring(0, 30) || 'Nouvelle conversation';

      const updatedChat = {
        id: currentChatId,
        title: title.length > 30 ? title.substring(0, 30) + '...' : title,
        messages: updatedMessages,
        lastUpdated: new Date().toISOString(),
        userId: user?.uid
      };

      // Save to Firebase if user is logged in
      if (user?.uid) {
        firebaseStorageService.saveConversation(user.uid, updatedChat)
          .then(() => {
            console.log('✅ Conversation saved to Firebase:', currentChatId);
          })
          .catch(error => {
            console.warn('⚠️ Failed to save conversation to Firebase:', error);
          });
      }

      // Update local storage
      const newHistory = [
        updatedChat,
        ...prev.filter(c => c.id !== currentChatId)
      ];
      localStorage.setItem('conversationHistory', JSON.stringify(newHistory));

      return newHistory;
    });
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

      if (useRAG) {
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
        // Fallback to original API
        console.log('📡 Using fallback API');
        const response = await axios.post(API_URL, {
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        }, {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });

        botMessage = {
          role: 'assistant',
          content: response.data.reply || response.data.response || response.data,
          id: Date.now().toString(),
          chatId: currentChatId,
          timestamp: new Date().toISOString()
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

      // Set context-based title if this is the first message
      if (messages.length === 0) {
        const contextTitle = userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? '...' : '');
        const updatedChat = {
          id: currentChatId,
          title: contextTitle,
          messages: [...messages, userMessage, botMessage],
          lastUpdated: new Date().toISOString(),
          userId: user?.uid
        };

        const updatedHistory = conversationHistory.map(chat =>
          chat.id === currentChatId ? updatedChat : chat
        );

        setConversationHistory(updatedHistory);
        localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));

        // Save to Firebase if user is logged in
        if (user?.uid) {
          firebaseStorageService.saveConversation(user.uid, updatedChat)
            .then(() => {
              console.log('✅ New conversation saved to Firebase:', currentChatId);
            })
            .catch(error => {
              console.warn('⚠️ Failed to save new conversation to Firebase:', error);
            });
        }
      } else {
        await updateConversationHistory([...messages, userMessage, botMessage]);
      }

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

  const handleNewChat = () => {
    try {
      // Save current chat before creating new one
      if (messages.length > 0 && currentChatId) {
        const updatedHistory = conversationHistory.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: messages }
            : chat
        );
        localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
        setConversationHistory(updatedHistory);
      }

      const newChatId = Date.now().toString();
      const newChat = {
        id: newChatId,
        title: t('newConversation'),
        messages: [],
        lastUpdated: new Date().toISOString()
      };

      setCurrentChatId(newChatId);
      localStorage.setItem('currentChatId', newChatId);

      setConversationHistory(prev => [newChat, ...prev]);
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

  const handleLoadChat = (chatId) => {
    try {
      // Save current chat before switching
      if (currentChatId && messages.length > 0) {
        const updatedHistory = conversationHistory.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: messages }
            : chat
        );
        localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
        setConversationHistory(updatedHistory);
      }

      const conversation = conversationHistory.find(c => c.id === chatId);
      if (conversation) {
        setCurrentChatId(chatId);
        localStorage.setItem('currentChatId', chatId);
        setMessages(conversation.messages);
      }

      setMobileOpen(false);
      setEditingMessageId(null);
      setEditedMessageContent('');
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    try {
      const updatedHistory = conversationHistory.filter(c => c.id !== chatId);
      localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
      setConversationHistory(updatedHistory);

      if (currentChatId === chatId) {
        if (updatedHistory.length > 0) {
          // Load the first available chat
          const firstChat = updatedHistory[0];
          setCurrentChatId(firstChat.id);
          localStorage.setItem('currentChatId', firstChat.id);
          setMessages(firstChat.messages);
        } else {
          // No conversations left - create a fresh new chat
          console.log('🗑️ Last conversation deleted, creating fresh chat');

          // Clear current state
          setCurrentChatId(null);
          localStorage.removeItem('currentChatId');
          setMessages([]);
          setInputValue('');
          setEditingMessageId(null);
          setEditedMessageContent('');

          // Create a new chat immediately
          const newChatId = Date.now().toString();
          const newChat = {
            id: newChatId,
            title: t('newConversation'),
            messages: [],
            lastUpdated: new Date().toISOString()
          };

          // Set the new chat as current
          setCurrentChatId(newChatId);
          localStorage.setItem('currentChatId', newChatId);

          // Add to conversation history
          setConversationHistory([newChat]);
          localStorage.setItem('conversationHistory', JSON.stringify([newChat]));

          // Close mobile menu if open
          setMobileOpen(false);

          // Refresh static suggestions for new conversation
          staticSuggestionsService.forceRefresh();
          console.log('🔄 Static suggestions refreshed for new conversation after delete');

          // Trigger UI refresh for suggestion cards
          if (setSuggestionsRefreshTrigger) {
            setSuggestionsRefreshTrigger(prev => prev + 1);
          }

          // Focus input after a short delay
          setTimeout(() => {
            document.querySelector('.chat-input input')?.focus();
          }, 100);
        }
      }
    } catch (error) {
      console.error('❌ Error deleting chat:', error);

      // Fallback: ensure we have at least one conversation
      if (conversationHistory.length === 0) {
        console.log('🔄 Fallback: Creating emergency conversation');
        const emergencyChat = {
          id: Date.now().toString(),
          title: t('newConversation'),
          messages: [],
          lastUpdated: new Date().toISOString()
        };

        setConversationHistory([emergencyChat]);
        setCurrentChatId(emergencyChat.id);
        setMessages([]);
        localStorage.setItem('conversationHistory', JSON.stringify([emergencyChat]));
        localStorage.setItem('currentChatId', emergencyChat.id);
      }
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

  const handleRenameSubmit = (newTitle) => {
    if (newTitle.trim()) {
      const updatedHistory = conversationHistory.map(chat =>
        chat.id === chatState.renameChatId
          ? { ...chat, title: newTitle.trim() }
          : chat
      );
      setConversationHistory(updatedHistory);
      localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
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
