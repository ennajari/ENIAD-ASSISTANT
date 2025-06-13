import axios from 'axios';
import { API_URL } from '../constants/config';
import staticSuggestionsService from '../services/staticSuggestionsService';
import ragApiService from '../services/ragApiService';
import speechService from '../services/speechService';

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

  const updateConversationHistory = (updatedMessages) => {
    if (!currentChatId) return;

    setConversationHistory(prev => {
      const existingChat = prev.find(c => c.id === currentChatId);
      const title = existingChat?.title || updatedMessages.find(m => m.role === 'user')?.content?.substring(0, 30) || 'Nouvelle conversation';

      const updatedChat = {
        id: currentChatId,
        title: title.length > 30 ? title.substring(0, 30) + '...' : title,
        messages: updatedMessages,
        lastUpdated: new Date().toISOString()
      };

      return [
        updatedChat,
        ...prev.filter(c => c.id !== currentChatId)
      ];
    });
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const {
      useRAG = true,
      autoSpeak = false,
      speechQuality = 'high'
    } = options;

    const userMessage = {
      role: 'user',
      content: inputValue,
      chatId: currentChatId,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
      userId: user?.uid
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let botMessage;

      if (useRAG) {
        // Use RAG API for intelligent responses
        console.log('🤖 Using RAG API for response generation');

        // Prepare context from recent messages
        const context = messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        }));

        // Query your RAG system
        const ragResponse = await ragApiService.query({
          query: userMessage.content,
          language: currentLanguage,
          userId: user?.uid,
          context,
          options: {
            limit: 5, // Number of documents to retrieve
            projectId: 'eniad-assistant' // Your project ID
          }
        });

        botMessage = {
          role: 'assistant',
          content: ragResponse.content,
          id: ragResponse.id,
          chatId: currentChatId,
          timestamp: new Date().toISOString(),
          sources: ragResponse.sources,
          confidence: ragResponse.confidence,
          metadata: ragResponse.metadata
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
        const updatedHistory = conversationHistory.map(chat =>
          chat.id === currentChatId
            ? { ...chat, title: contextTitle, messages: [...messages, userMessage, botMessage] }
            : chat
        );
        setConversationHistory(updatedHistory);
        localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
      } else {
        updateConversationHistory([...messages, userMessage, botMessage]);
      }

      // Save conversation to RAG system if available
      if (useRAG && currentChatId) {
        try {
          await ragApiService.saveConversation({
            id: currentChatId,
            messages: [userMessage, botMessage],
            userId: user?.uid,
            language: currentLanguage,
            timestamp: new Date().toISOString()
          });
        } catch (saveError) {
          console.warn('⚠️ Failed to save conversation to RAG:', saveError.message);
        }
      }

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
          const firstChat = updatedHistory[0];
          setCurrentChatId(firstChat.id);
          localStorage.setItem('currentChatId', firstChat.id);
          setMessages(firstChat.messages);
        } else {
          setCurrentChatId(null);
          localStorage.removeItem('currentChatId');
          setMessages([]);
          handleNewChat();
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
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
