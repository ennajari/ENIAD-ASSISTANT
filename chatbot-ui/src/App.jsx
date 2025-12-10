import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
// Speech recognition using native Web Speech API
import Login from './components/Login';
import GeminiTest from './components/GeminiTest';
import { useLanguage } from './contexts/LanguageContext';
import { createAppTheme } from './theme/theme';
import { useChatState } from './hooks/useChatState';

import { useThemeMode } from './hooks/useThemeMode';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import ChatContent from './components/ChatContent';
import ChatInput from './components/ChatInput';
import ModelSelector from './components/ModelSelector';
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
import speechService from './services/speechService';
import { useTTSState } from './hooks/useTTSState';
import TTSFloatingPanel from './components/TTSFloatingPanel';
import ApiConnectionTest from './components/Debug/ApiConnectionTest';
import InterfaceTest from './components/Debug/InterfaceTest';
import FirebaseTest from './components/Debug/FirebaseTest';
import AvatarTest from './components/Debug/AvatarTest';

function App() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { language: currentLanguage, changeLanguage } = useLanguage();

  // Custom hooks
  const { darkMode, toggleDarkMode, prefersDarkMode } = useThemeMode();
  const chatState = useChatState();
  const { t } = useTranslation(currentLanguage);

  // TTS State avec ElevenLabs
  const ttsState = useTTSState(currentLanguage);

  // SMA (Smart Multi-Agent) state - using research button
  const [isSMAActive, setIsSMAActive] = useState(false);
  const [isSMALoading, setIsSMALoading] = useState(false);
  const [isSMACompleted, setIsSMACompleted] = useState(false);
  const [smaStatusMessage, setSmaStatusMessage] = useState('');

  // Model selection state
  const [selectedModel, setSelectedModel] = useState('gemini'); // 'gemini' or 'llama'

  // Suggestions refresh trigger
  const [suggestionsRefreshTrigger, setSuggestionsRefreshTrigger] = useState(0);

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const currentSidebarWidth = sidebarCollapsed ? 72 : DRAWER_WIDTH;



  // Speech recognition state
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const browserSupportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

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
      isSMAActive: isSMAActive,
      autoCorrect: true,
      selectedModel: selectedModel,
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

        // Save current conversation state before user change (login/logout)
        if (chatState.currentChatId && chatState.messages.length > 0) {
          console.log('💾 Saving conversation state before user change...');
          await conversationStateManager.saveConversationStateBeforeCriticalOperation(
            chatState.messages,
            chatState.currentChatId,
            chatState.setConversationHistory
          );
        }

        // Initialize static suggestions on app load
        staticSuggestionsService.forceRefresh();
        setSuggestionsRefreshTrigger(prev => prev + 1);
        console.log('🔄 Static suggestions initialized on app load');

        // Set current user in conversation state manager
        conversationStateManager.setCurrentUser(user);

        // FORCE RELOAD FROM FIREBASE - Clear local storage first if user is logged in
        if (user) {
          console.log('🔥 User logged in - forcing fresh load from Firebase');
          localStorage.removeItem('conversationHistory');
          localStorage.removeItem('currentChatId');
        }

        // Load conversations using the state manager
        const conversations = await conversationStateManager.loadConversations(
          chatState.setConversationHistory
        );

        console.log(`📋 Loaded ${conversations.length} conversations from ${user ? 'Firebase' : 'local storage'}`);

        // Handle current chat selection
        let savedCurrentChatId = localStorage.getItem('currentChatId');

        if (conversations.length > 0) {
          // For logged-in users, always start with the most recent conversation
          if (user && conversations.length > 0) {
            const mostRecentChat = conversations[0]; // Conversations are sorted by lastUpdated desc
            chatState.setCurrentChatId(mostRecentChat.id);
            chatState.setMessages(mostRecentChat.messages || []);
            localStorage.setItem('currentChatId', mostRecentChat.id);
            console.log('✅ Loaded most recent chat for logged-in user:', mostRecentChat.id, 'with', mostRecentChat.messages?.length || 0, 'messages');
          } else if (savedCurrentChatId) {
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
    if (chatState.autoRead && chatState.messages.length > 0 && ttsState.isSupported()) {
      const lastMessage = chatState.messages[chatState.messages.length - 1];
      if (lastMessage.role === 'assistant' && !chatState.isLoading && !ttsState.currentSpeakingId) {
        speakText(lastMessage.content, lastMessage.id);
      }
    }
  }, [chatState.messages, chatState.autoRead, chatState.isLoading, ttsState.currentSpeakingId, ttsState.isSupported]);

  // ElevenLabs TTS initialization (no voice loading needed)
  useEffect(() => {
    console.log('🎙️ ElevenLabs TTS initialized and ready');
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

  // Add beforeunload listener to save conversations before page refresh/close
  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      if (chatState.currentChatId && chatState.messages.length > 0) {
        console.log('💾 Saving conversation before page unload...');
        try {
          await conversationStateManager.saveConversationStateBeforeCriticalOperation(
            chatState.messages,
            chatState.currentChatId,
            chatState.setConversationHistory
          );
        } catch (error) {
          console.error('❌ Failed to save conversation before unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [chatState.currentChatId, chatState.messages]);

  // Speech synthesis using enhanced ElevenLabs TTS
  const speakText = async (text, id, language = null) => {
    await ttsState.speakText(text, id, language);
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
      if (recognition) {
        recognition.stop();
      }
      setListening(false);
      chatState.setIsRecording(false);
    } else {
      if (browserSupportsSpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const newRecognition = new SpeechRecognition();

        newRecognition.continuous = true;
        newRecognition.interimResults = true;
        newRecognition.lang = currentLanguage === 'ar' ? 'ar-SA' : 'fr-FR';

        newRecognition.onstart = () => {
          setListening(true);
          chatState.setIsRecording(true);
        };

        newRecognition.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript);
          }
        };

        newRecognition.onend = () => {
          setListening(false);
          chatState.setIsRecording(false);
        };

        newRecognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setListening(false);
          chatState.setIsRecording(false);
        };

        setRecognition(newRecognition);
        setTranscript('');
        newRecognition.start();
      }
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



  // Model selection handler
  const handleModelChange = (newModel) => {
    setSelectedModel(newModel);
    console.log('🤖 Model changed to:', newModel);

    if (newModel === 'llama') {
      console.log('🦙 Using Llama model - Custom ENIAD project model');
    } else {
      console.log('✨ Using Gemini model - Google AI model');
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
        <Route path="/test" element={<InterfaceTest />} />
        <Route path="/firebase" element={<FirebaseTest />} />
        <Route path="/gemini" element={<GeminiTest />} />
        <Route path="/avatar" element={<AvatarTest />} />
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
                onClearAllConversations={chatHandlers.handleClearAllConversations}
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
                    isLoading={chatState.isLoading || Object.values(ttsState.isLoading).some(Boolean)}
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
                    isSpeaking={ttsState.isSpeaking}
                    supported={ttsState.isSupported()}
                    messagesEndRef={messagesEndRef}
                    refreshTrigger={suggestionsRefreshTrigger}
                    user={user}
                  />

                  {/* Model Selector */}
                  <Box sx={{
                    px: { xs: 2, sm: 4, md: 6 },
                    maxWidth: '1200px',
                    mx: 'auto',
                    width: '100%'
                  }}>
                    <ModelSelector
                      selectedModel={selectedModel}
                      onModelChange={handleModelChange}
                      currentLanguage={currentLanguage}
                      darkMode={darkMode}
                      disabled={chatState.isLoading}
                    />
                  </Box>

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
                    selectedModel={selectedModel}
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
        supported={ttsState.isSupported()}
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

      {/* Panneau TTS flottant ElevenLabs */}
      <TTSFloatingPanel
        isVisible={ttsState.getCurrentTTSInfo().isActive}
        isPlaying={!!ttsState.currentSpeakingId}
        isLoading={Object.values(ttsState.isLoading).some(loading => loading)}
        currentText={ttsState.currentText}
        currentLanguage={ttsState.detectedLanguage}
        darkMode={darkMode}
        onPlay={() => {
          const info = ttsState.getCurrentTTSInfo();
          if (info.messageId && info.text) {
            speakText(info.text, info.messageId, info.language);
          }
        }}
        onStop={ttsState.stopSpeech}
        onClose={ttsState.stopSpeech}
        progress={ttsState.progress}
        estimatedDuration={ttsState.estimatedDuration}
        currentTime={ttsState.currentTime}
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