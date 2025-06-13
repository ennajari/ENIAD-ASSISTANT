import axios from 'axios';
import { API_URL } from '../constants/config';

export const createChatHandlers = (
  chatState,
  currentLanguage,
  t,
  messagesEndRef
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

    const userMessage = {
      role: 'user',
      content: inputValue,
      chatId: currentChatId,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, {
        messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
      }, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      const botMessage = {
        role: 'assistant',
        content: response.data.reply || response.data.response || response.data,
        id: Date.now().toString(),
        chatId: currentChatId,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);

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
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: t('errorMessage'),
        id: Date.now().toString(),
        chatId: currentChatId,
        timestamp: new Date().toISOString()
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
