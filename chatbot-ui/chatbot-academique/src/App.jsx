import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Login from './components/Login';
import { useLanguage } from './contexts/LanguageContext';
import { createAppTheme } from './theme/theme';
import { useChatState } from './hooks/useChatState';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useThemeMode } from './hooks/useThemeMode';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import ChatContent from './components/ChatContent';
import ChatInput from './components/ChatInput';
import SettingsDialog from './components/SettingsDialog';
import RenameDialog from './components/RenameDialog';
import ChatMenu from './components/ChatMenu';
import ErrorBoundary from './components/ErrorBoundary';
import QuestionAutocomplete from './components/QuestionAutocomplete';
import { DRAWER_WIDTH } from './constants/config';
import { createChatHandlers } from './utils/chatHandlers';
import { useTranslation } from './utils/translations';
import { auth } from './firebase';
import staticSuggestionsService from './services/staticSuggestionsService';

function App() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { language: currentLanguage, changeLanguage } = useLanguage();

  // Custom hooks
  const { darkMode, toggleDarkMode, prefersDarkMode } = useThemeMode();
  const chatState = useChatState();
  const { speak, speaking, supported } = useSpeechSynthesis();
  const { t } = useTranslation(currentLanguage);

  // Research mode state
  const [isResearchMode, setIsResearchMode] = useState(false);

  // Suggestions refresh trigger
  const [suggestionsRefreshTrigger, setSuggestionsRefreshTrigger] = useState(0);

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const currentSidebarWidth = sidebarCollapsed ? 72 : DRAWER_WIDTH;



  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Refs
  const messagesEndRef = useRef(null);

  // Responsive
  const isMobile = useMediaQuery('(max-width:600px)');
  const drawerOpenDesktop = chatState.sidebarOpen && !isMobile;
  const drawerVariant = isMobile ? 'temporary' : 'persistent';
  const drawerOpen = isMobile ? chatState.mobileOpen : chatState.sidebarOpen;

  // Create theme
  const theme = createAppTheme(darkMode, currentLanguage, drawerOpen);

  // Chat handlers
  const chatHandlers = createChatHandlers(chatState, currentLanguage, t, messagesEndRef, setSuggestionsRefreshTrigger);

  // Load saved conversations on mount
  useEffect(() => {
    try {
      // Initialize static suggestions on app load
      staticSuggestionsService.forceRefresh();
      setSuggestionsRefreshTrigger(prev => prev + 1);
      console.log('🔄 Static suggestions initialized on app load');

      const savedHistory = localStorage.getItem('conversationHistory');
      const savedCurrentChatId = localStorage.getItem('currentChatId');

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        chatState.setConversationHistory(parsedHistory);

        if (savedCurrentChatId) {
          chatState.setCurrentChatId(savedCurrentChatId);
          const currentChat = parsedHistory.find(chat => chat.id === savedCurrentChatId);
          if (currentChat) {
            chatState.setMessages(currentChat.messages);
          }
        } else {
          chatHandlers.handleNewChat();
        }
      } else {
        chatHandlers.handleNewChat();
      }
    } catch (error) {
      console.error('Error loading saved conversations:', error);
      chatHandlers.handleNewChat();
    }
  }, []);

  // Handle transcript changes
  useEffect(() => {
    if (transcript) {
      chatState.setInputValue(transcript);
    }
  }, [transcript]);

  // Auto-scroll and auto-read
  useEffect(() => {
    chatHandlers.scrollToBottom();
    if (chatState.autoRead && chatState.messages.length > 0 && supported) {
      const lastMessage = chatState.messages[chatState.messages.length - 1];
      if (lastMessage.role === 'assistant' && !chatState.isLoading && !speaking) {
        speakText(lastMessage.content, lastMessage.id);
      }
    }
  }, [chatState.messages, chatState.autoRead, chatState.isLoading, speaking, supported]);

  // Load voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Save conversations
  useEffect(() => {
    try {
      if (chatState.currentChatId) {
        localStorage.setItem('currentChatId', chatState.currentChatId);

        const updatedHistory = chatState.conversationHistory.map(chat =>
          chat.id === chatState.currentChatId
            ? { ...chat, messages: chatState.messages }
            : chat
        );

        localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
        chatState.setConversationHistory(updatedHistory);
      }
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  }, [chatState.messages, chatState.currentChatId]);

  // Speech synthesis
  const speakText = (text, id) => {
    if (chatState.isSpeaking[id]) {
      window.speechSynthesis.cancel();
      chatState.setIsSpeaking(prev => ({ ...prev, [id]: false }));
      return;
    }

    const langMap = {
      'ar': 'ar-SA',
      'en': 'en-US',
      'fr': 'fr-FR'
    };

    try {
      const lang = langMap[currentLanguage];

      speak({
        text,
        lang,
        onEnd: () => chatState.setIsSpeaking(prev => ({ ...prev, [id]: false })),
        onError: (event) => {
          console.error('Speech synthesis error:', event);
          chatState.setIsSpeaking(prev => ({ ...prev, [id]: false }));
        }
      });
      chatState.setIsSpeaking(prev => ({ ...prev, [id]: true }));
    } catch (error) {
      console.error('Speech synthesis error:', error);
      chatState.setIsSpeaking(prev => ({ ...prev, [id]: false }));
    }
  };

  // Input handlers
  const handleInputChange = (e) => {
    chatState.setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatHandlers.handleSubmit();
    }
  };

  const toggleRecording = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      chatState.setIsRecording(false);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: currentLanguage === 'ar' ? 'ar-SA' : currentLanguage === 'en' ? 'en-US' : 'fr-FR'
      });
      chatState.setIsRecording(true);
    }
  };

  // Drawer handlers
  const handleDrawerToggle = () => {
    if (isMobile) {
      chatState.setMobileOpen((prev) => !prev);
    } else {
      chatState.setSidebarOpen((prev) => !prev);
    }
  };

  // Auth handler
  const handleAuthAction = () => {
    if (user) {
      auth.signOut();
    } else {
      navigate('/login');
    }
  };



  // Research handler
  const handleResearch = () => {
    setIsResearchMode(prev => !prev);
    console.log('Research mode toggled:', !isResearchMode);

    // TODO: Wire up to CrewIA or LangChain
    // This is where you'll integrate with your research AI system
    if (!isResearchMode) {
      console.log('🔬 Activating research mode - enhanced AI with web search capabilities');
      // Future integration point for CrewIA/LangChain
      // You can modify the chat behavior here for research mode
    } else {
      console.log('💬 Deactivating research mode - returning to standard chat');
    }
  };

  // Search handler
  const handleSearch = () => {
    console.log('Search button clicked');
    console.log('Current input value:', chatState.inputValue);

    // TODO: Implement search functionality
    // This is where you'll integrate with your search API
    if (chatState.inputValue.trim()) {
      console.log('🔍 Performing search for:', chatState.inputValue.trim());
      // Future integration point for web search API
      // You can call your search API here and append results to the chat
    } else {
      console.log('No search query provided');
    }
  };

  if (authLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Box
              sx={{
                display: 'flex',
                direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
                minHeight: '100vh',
                bgcolor: darkMode ? '#0a0a0a' : '#f8fafc',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                '& .MuiDrawer-root': {
                  flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row'
                }
              }}
            >
              <ChatSidebar
                open={drawerOpen}
                onClose={() => isMobile && chatState.setMobileOpen(false)}
                variant={drawerVariant}
                anchor={currentLanguage === 'ar' ? 'right' : 'left'}
                currentLanguage={currentLanguage}
                darkMode={darkMode}
                prefersDarkMode={prefersDarkMode}
                conversationHistory={chatState.conversationHistory}
                currentChatId={chatState.currentChatId}
                onNewChat={chatHandlers.handleNewChat}
                onLoadChat={chatHandlers.handleLoadChat}
                onChatMenuOpen={chatHandlers.handleChatMenuOpen}
                onToggleDarkMode={toggleDarkMode}
                onSettingsOpen={() => chatState.setSettingsOpen(true)}
                isMobile={isMobile}
                onSidebarCollapse={setSidebarCollapsed}
                sidebarCollapsed={sidebarCollapsed}
              />

              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  [currentLanguage === 'ar' ? 'mr' : 'ml']: {
                    xs: 0,
                    md: drawerOpenDesktop ? `${currentSidebarWidth}px` : 0
                  },
                  transition: theme => theme.transitions.create([
                    currentLanguage === 'ar' ? 'margin-right' : 'margin-left'
                  ], {
                    easing: theme.transitions.easing.easeInOut,
                    duration: theme.transitions.duration.standard,
                  }),
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <ChatHeader
                  drawerOpen={drawerOpenDesktop}
                  darkMode={darkMode}
                  currentLanguage={currentLanguage}
                  conversationHistory={chatState.conversationHistory}
                  currentChatId={chatState.currentChatId}
                  user={user}
                  onDrawerToggle={handleDrawerToggle}
                  onSettingsOpen={() => chatState.setSettingsOpen(true)}
                  onAuthAction={handleAuthAction}
                  sidebarWidth={currentSidebarWidth}
                />

                <Toolbar />

                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'calc(100vh - 64px)',
                    overflow: 'hidden',
                    position: 'relative',
                    bgcolor: darkMode ? '#0a0a0a' : '#f8fafc',
                    width: '100%',
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <ChatContent
                    messages={chatState.messages}
                    isLoading={chatState.isLoading}
                    currentLanguage={currentLanguage}
                    darkMode={darkMode}
                    editingMessageId={chatState.editingMessageId}
                    editedMessageContent={chatState.editedMessageContent}
                    setEditedMessageContent={chatState.setEditedMessageContent}
                    onEditMessage={chatHandlers.handleEditMessage}
                    onSaveEdit={chatHandlers.handleSaveEdit}
                    onCancelEdit={chatHandlers.handleCancelEdit}
                    onQuestionClick={chatHandlers.handleQuestionClick}
                    onSpeakText={speakText}
                    isSpeaking={chatState.isSpeaking}
                    supported={supported}
                    messagesEndRef={messagesEndRef}
                    refreshTrigger={suggestionsRefreshTrigger}
                  />

                  <ChatInput
                    inputValue={chatState.inputValue}
                    onInputChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onSubmit={chatHandlers.handleSubmit}
                    isLoading={chatState.isLoading}
                    currentLanguage={currentLanguage}
                    darkMode={darkMode}
                    isRecording={chatState.isRecording}
                    onToggleRecording={toggleRecording}
                    browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
                    onSearch={handleSearch}
                    onResearch={handleResearch}
                    isResearchMode={isResearchMode}
                  />
                </Box>
              </Box>
            </Box>
          }
        />
      </Routes>

      <SettingsDialog
        open={chatState.settingsOpen}
        onClose={() => chatState.setSettingsOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        autoRead={chatState.autoRead}
        onToggleAutoRead={chatState.setAutoRead}
        currentLanguage={currentLanguage}
        onChangeLanguage={changeLanguage}
        supported={supported}
      />

      <RenameDialog
        open={chatState.renameDialogOpen}
        onClose={() => chatState.setRenameDialogOpen(false)}
        darkMode={darkMode}
        currentLanguage={currentLanguage}
        newChatTitle={chatState.newChatTitle}
        onTitleChange={chatState.setNewChatTitle}
        onSubmit={() => chatHandlers.handleRenameSubmit(chatState.newChatTitle)}
      />

      <ChatMenu
        anchorEl={chatState.chatMenuAnchorEl}
        open={Boolean(chatState.chatMenuAnchorEl)}
        onClose={chatHandlers.handleChatMenuClose}
        currentLanguage={currentLanguage}
        chatId={chatState.chatMenuChatId}
        conversationHistory={chatState.conversationHistory}
        onEditTitle={chatHandlers.handleEditTitle}
        onDeleteChat={chatHandlers.handleDeleteChat}
      />
    </ThemeProvider>
  );
}

export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}