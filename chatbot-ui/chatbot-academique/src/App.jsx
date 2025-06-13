import { useState, useEffect, useRef } from 'react';
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

import { DRAWER_WIDTH } from './constants/config';
import { createChatHandlers } from './utils/chatHandlers';
import { useTranslation } from './utils/translations';
import { auth } from './firebase';
import staticSuggestionsService from './services/staticSuggestionsService';
import conversationStateManager from './services/conversationStateManager';
import ApiConnectionTest from './components/Debug/ApiConnectionTest';

function App() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { language: currentLanguage, changeLanguage } = useLanguage();

  // Custom hooks
  const { darkMode, toggleDarkMode, prefersDarkMode } = useThemeMode();
  const chatState = useChatState();
  const { speak, speaking, supported } = useSpeechSynthesis();
  const { t } = useTranslation(currentLanguage);

  // SMA (Smart Multi-Agent) state - using research button
  const [isSMAActive, setIsSMAActive] = useState(false);
  const [isSMALoading, setIsSMALoading] = useState(false);
  const [isSMACompleted, setIsSMACompleted] = useState(false);
  const [smaStatusMessage, setSmaStatusMessage] = useState('');

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
  const chatHandlers = createChatHandlers(
    chatState,
    currentLanguage,
    t,
    messagesEndRef,
    setSuggestionsRefreshTrigger,
    user,
    {
      useRAG: true,
      autoSpeak: false,
      speechQuality: 'high',
      isSMAActive: isSMAActive,
      autoCorrect: true,
      smaStateHandlers: {
        setIsSMALoading,
        setIsSMACompleted,
        setSmaStatusMessage
      }
    }
  );

  // Load saved conversations on mount and user changes
  useEffect(() => {
    const loadConversations = async () => {
      try {
        console.log('🔄 Loading conversations for user:', user ? user.email : 'anonymous');

        // Initialize static suggestions on app load
        staticSuggestionsService.forceRefresh();
        setSuggestionsRefreshTrigger(prev => prev + 1);
        console.log('🔄 Static suggestions initialized on app load');

        // Set current user in conversation state manager
        conversationStateManager.setCurrentUser(user);

        // Load conversations using the state manager
        const conversations = await conversationStateManager.loadConversations(
          chatState.setConversationHistory
        );

        console.log(`📋 Loaded ${conversations.length} conversations from ${user ? 'Firebase' : 'local storage'}`);

        // Handle current chat selection
        const savedCurrentChatId = localStorage.getItem('currentChatId');

        if (conversations.length > 0) {
          if (savedCurrentChatId) {
            const currentChat = conversations.find(chat => chat.id === savedCurrentChatId);
            if (currentChat) {
              chatState.setCurrentChatId(savedCurrentChatId);
              chatState.setMessages(currentChat.messages || []);
              console.log('✅ Restored current chat:', savedCurrentChatId, 'with', currentChat.messages?.length || 0, 'messages');
            } else {
              // Current chat ID not found, load first available chat
              const firstChat = conversations[0];
              chatState.setCurrentChatId(firstChat.id);
              chatState.setMessages(firstChat.messages || []);
              localStorage.setItem('currentChatId', firstChat.id);
              console.log('✅ Loaded first available chat:', firstChat.id, 'with', firstChat.messages?.length || 0, 'messages');
            }
          } else {
            // No current chat ID, load first available chat
            const firstChat = conversations[0];
            chatState.setCurrentChatId(firstChat.id);
            chatState.setMessages(firstChat.messages || []);
            localStorage.setItem('currentChatId', firstChat.id);
            console.log('✅ Loaded first chat:', firstChat.id, 'with', firstChat.messages?.length || 0, 'messages');
          }
        } else {
          // No conversations found, create new chat
          console.log('📝 No conversations found, creating new chat');
          await chatHandlers.handleNewChat();
        }

      } catch (error) {
        console.error('❌ Error loading conversations:', error);
        console.error('Error details:', error.stack);
        // Create new chat as fallback
        try {
          await chatHandlers.handleNewChat();
        } catch (newChatError) {
          console.error('❌ Failed to create new chat:', newChatError);
        }
      }
    };

    // Only load conversations if not in loading state
    if (!authLoading) {
      console.log('🚀 Auth loading complete, loading conversations...');
      loadConversations();
    } else {
      console.log('⏳ Auth still loading, waiting...');
    }
  }, [user, authLoading]); // Depend on user and authLoading to reload conversations when login state changes

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

  // Save current chat ID to localStorage (conversation saving is handled by conversation state manager)
  useEffect(() => {
    try {
      if (chatState.currentChatId) {
        localStorage.setItem('currentChatId', chatState.currentChatId);
        console.log('💾 Current chat ID saved to localStorage:', chatState.currentChatId);
      }
    } catch (error) {
      console.error('Error saving current chat ID:', error);
    }
  }, [chatState.currentChatId]);

  // Add window focus listener to reload conversations when user comes back
  useEffect(() => {
    const handleWindowFocus = async () => {
      if (user && !authLoading) {
        console.log('🔄 Window focused, reloading conversations...');
        try {
          conversationStateManager.setCurrentUser(user);
          const conversations = await conversationStateManager.loadConversations(
            chatState.setConversationHistory
          );
          console.log(`✅ Reloaded ${conversations.length} conversations on window focus`);
        } catch (error) {
          console.error('❌ Error reloading conversations on focus:', error);
        }
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [user, authLoading]);

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
  const handleAuthAction = async () => {
    if (user) {
      try {
        // Use conversation state manager to clear all data
        await conversationStateManager.clearConversations(
          chatState.setConversationHistory,
          chatState.setMessages,
          chatState.setCurrentChatId
        );

        // Sign out
        await auth.signOut();
        console.log('✅ User logged out and data cleared');

        // Create a fresh new chat after logout
        await chatHandlers.handleNewChat();
      } catch (error) {
        console.error('❌ Error during logout:', error);
        // Force logout even if there's an error
        auth.signOut();
      }
    } else {
      navigate('/login');
    }
  };



  // SMA Research handler (using research button for SMA)
  const handleResearch = () => {
    const newSMAState = !isSMAActive;
    setIsSMAActive(newSMAState);

    // Reset states when toggling
    setIsSMALoading(false);
    setIsSMACompleted(false);
    setSmaStatusMessage('');

    console.log('🧠 SMA toggled:', newSMAState);

    if (newSMAState) {
      console.log('🧠 Activating SMA - Smart Multi-Agent web intelligence');
      console.log('🔍 SMA will scan ENIAD and UMP websites for real-time information');
      setSmaStatusMessage('SMA activated - Ready to enhance responses with web intelligence');
    } else {
      console.log('💬 Deactivating SMA - returning to standard RAG responses');
      setSmaStatusMessage('');
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
        <Route path="/debug" element={<ApiConnectionTest />} />
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
                user={user}
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
                    onResearch={handleResearch}
                    isResearchMode={isSMAActive}
                    isSMALoading={isSMALoading}
                    isSMACompleted={isSMACompleted}
                    smaStatusMessage={smaStatusMessage}
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