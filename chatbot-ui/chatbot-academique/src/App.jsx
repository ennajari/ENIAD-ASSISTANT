import React, { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '@mui/material';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Container,
  Avatar,
  CircularProgress,
  Tooltip,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Divider,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Drawer,
  InputAdornment,
  Fab,
  Grid
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  VolumeUp as VolumeUpIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// 1. Move constants that don't depend on component state here
const drawerWidth = 300;
const API_URL = "https://25ae-35-198-214-255.ngrok-free.app/generate";
const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' }
];

const translations = {
  fr: {
    newChat: "Nouveau chat",
    settings: "Paramètres",
    darkMode: "Mode sombre",
    lightMode: "Mode clair",
    autoRead: "Lecture automatique des réponses",
    languageSection: "Langue",
    close: "Fermer",
    writeMessage: "Écrivez votre message...",
    thinking: "Réflexion en cours...",
    newConversation: "Nouvelle conversation",
    edit: "Modifier",
    cancel: "Annuler",
    save: "Enregistrer",
    startRecording: "Enregistrer un message audio",
    stopRecording: "Arrêter l'enregistrement",
    assistant: "Assistant Académique ENIAD",
    startPrompt: "Posez votre question ou choisissez un sujet ci-dessous pour commencer une nouvelle conversation.",
    errorMessage: "Désolé, une erreur est survenue. Veuillez réessayer.",
    disclaimer: "ENIAD AI peut faire des erreurs. Vérifiez les informations importantes.",
    version: "v1.0.0",
    suggestions: [
      "Quelles sont les causes de la Première Guerre mondiale ?",
      "Expliquez-moi le fonctionnement d'une base de données relationnelle",
      "Analysez les thèmes principaux dans Les Misérables de Victor Hugo",
    ],
    usingSystemPreference: "Utilise les préférences système",
    editTitle: "Modifier le titre de la conversation",
    contextTitle: "Contexte: "
  },
  en: {
    newChat: "New Chat",
    settings: "Settings",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    autoRead: "Auto-read responses",
    languageSection: "Language",
    close: "Close",
    writeMessage: "Write your message...",
    thinking: "Thinking...",
    newConversation: "New Conversation",
    edit: "Edit",
    cancel: "Cancel",
    save: "Save",
    startRecording: "Record audio message",
    stopRecording: "Stop recording",
    assistant: "ENIAD Academic Assistant",
    startPrompt: "Ask your question or choose a topic below to start a new conversation.",
    errorMessage: "Sorry, an error occurred. Please try again.",
    disclaimer: "ENIAD AI may make mistakes. Please verify important information.",
    version: "v1.0.0",
    suggestions: [
      "What are the causes of World War I?",
      "Explain how a relational database works",
      "Analyze the main themes in Les Misérables by Victor Hugo",
    ],
    usingSystemPreference: "Using system preference",
    editTitle: "Edit conversation title",
    contextTitle: "Context: "
  },
  ar: {
    newChat: "محادثة جديدة",
    settings: "الإعدادات",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
    autoRead: "قراءة تلقائية للردود",
    languageSection: "اللغة",
    close: "إغلاق",
    writeMessage: "اكتب رسالتك...",
    thinking: "جاري التفكير...",
    newConversation: "محادثة جديدة",
    edit: "تعديل",
    cancel: "إلغاء",
    save: "حفظ",
    startRecording: "تسجيل رسالة صوتية",
    stopRecording: "إيقاف التسجيل",
    assistant: "المساعد الأكاديمي ENIAD",
    startPrompt: "اطرح سؤالك أو اختر موضوعًا أدناه لبدء محادثة جديدة.",
    errorMessage: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
    disclaimer: "قد يرتكب ENIAD AI أخطاء. يرجى التحقق من المعلومات المهمة.",
    version: "الإصدار 1.0.0",
    suggestions: [
      "ما هي أسباب الحرب العالمية الأولى؟",
      "اشرح لي كيف تعمل قواعد البيانات العلائقية",
      "حلل المواضيع الرئيسية في رواية البؤساء لفيكتور هوغو",
    ],
    usingSystemPreference: "يستخدم تفضيلات النظام",
    editTitle: "تعديل عنوان المحادثة",
    contextTitle: "السياق: "
  }
};

// Instead of react-speech-kit, let's use the native Web Speech API
const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const supported = 'speechSynthesis' in window;

  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const speak = ({ text, lang, onEnd, onError }) => {
    if (!supported) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Set language and rate
    utterance.lang = lang;
    utterance.rate = 0.9; // Slower rate for better pronunciation
    utterance.pitch = 1;

    // Try to find a voice for the language
    const availableVoices = window.speechSynthesis.getVoices();
    const voiceForLang = availableVoices.find(voice =>
      voice.lang.toLowerCase().startsWith(lang.toLowerCase().split('-')[0])
    );

    if (voiceForLang) {
      utterance.voice = voiceForLang;
    }

    utterance.onend = () => {
      setSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setSpeaking(false);
      onError?.(event);
    };

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return {
    speak,
    speaking,
    supported,
    voices
  };
};

function App() {
  // Add this with your other state declarations at the top of the App component
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? JSON.parse(savedMode) : prefersDarkMode;
  });

  // 1. First declare all state and refs
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [autoRead, setAutoRead] = useState(() => {
    const saved = localStorage.getItem('autoRead');
    return saved ? JSON.parse(saved) : false;
  });
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessageContent, setEditedMessageContent] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'fr';
  });

  // Add these state declarations in the App component
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameChatId, setRenameChatId] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState('');

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // 2. Then declare hooks that depend on component state
  const isMobile = useMediaQuery('(max-width:600px)');
  const drawerOpenDesktop = sidebarOpen && !isMobile;
  const drawerVariant = isMobile ? 'temporary' : 'persistent';
  const drawerOpen = isMobile ? mobileOpen : sidebarOpen;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const { speak, speaking, supported, voices } = useSpeechSynthesis();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#4caf50' : '#2e7d32', // Green shades
        dark: darkMode ? '#388e3c' : '#1b5e20',
        light: darkMode ? '#81c784' : '#66bb6a',
      },
      secondary: {
        main: darkMode ? '#ff9800' : '#f57c00', // Orange shades
        dark: darkMode ? '#f57c00' : '#e65100',
        light: darkMode ? '#ffb74d' : '#ffa726',
      },
      background: {
        default: darkMode ? '#0a0d0a' : '#f5f8f5',
        paper: darkMode ? '#1a1d1a' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#1c2119',
        secondary: darkMode ? '#a5a5a5' : '#666666',
      },
      divider: darkMode ? '#2d3748' : '#e2e8f0',
    },
    direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
    typography: {
      fontFamily: currentLanguage === 'ar'
        ? 'Arial, "Helvetica Neue", Helvetica, sans-serif'
        : 'Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            borderLeft: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? '#1a202c' : '#ffffff',
            boxShadow: theme.direction === 'rtl'
              ? '-2px 0 10px rgba(0,0,0,0.05)'
              : '2px 0 10px rgba(0,0,0,0.05)',
            transform: 'none', // Reset any default transforms
            transition: theme.transitions.create(['transform'], {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.sharp,
            }),
          }),
        },
      },
    },
    // Add custom keyframes
    '@keyframes slideInRTL': {
      '0%': {
        transform: 'translateX(-100%)',
      },
      '100%': {
        transform: 'translateX(0)',
      },
    },
    '@keyframes slideOutRTL': {
      '0%': {
        transform: 'translateX(0)',
      },
      '100%': {
        transform: 'translateX(100%)',
      },
    },
    '@keyframes slideInLTR': {
      '0%': {
        transform: 'translateX(-100%)',
      },
      '100%': {
        transform: 'translateX(0)',
      },
    },
    '@keyframes slideOutLTR': {
      '0%': {
        transform: 'translateX(0)',
      },
      '100%': {
        transform: 'translateX(-100%)',
      },
    },
  });

  useEffect(() => {
    // 1. Update the useEffect for loading saved conversations
    try {
      const savedHistory = localStorage.getItem('conversationHistory');
      const savedCurrentChatId = localStorage.getItem('currentChatId');
      
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setConversationHistory(parsedHistory);
        
        if (savedCurrentChatId) {
          setCurrentChatId(savedCurrentChatId);
          const currentChat = parsedHistory.find(chat => chat.id === savedCurrentChatId);
          if (currentChat) {
            setMessages(currentChat.messages);
          }
        } else {
          handleNewChat();
        }
      } else {
        handleNewChat();
      }
    } catch (error) {
      console.error('Error loading saved conversations:', error);
      handleNewChat();
    }
  }, []);

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    scrollToBottom();
    if (autoRead && messages.length > 0 && supported) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !isLoading && !speaking) {
        speakText(lastMessage.content, lastMessage.id);
      }
    }
  }, [messages, autoRead, isLoading, speaking, supported]);

  // Add this near your other useEffect hooks
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // 2. Update the useEffect for saving conversations
  useEffect(() => {
    try {
      if (currentChatId) {
        localStorage.setItem('currentChatId', currentChatId);
        
        const updatedHistory = conversationHistory.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: messages }
            : chat
        );
        
        localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
        setConversationHistory(updatedHistory);
      }
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  }, [messages, currentChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
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
    resetTranscript();
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleRecording = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsRecording(false);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: currentLanguage === 'ar' ? 'ar-SA' : currentLanguage === 'en' ? 'en-US' : 'fr-FR'
      });
      setIsRecording(true);
    }
  };

  // Helper to find best matching voice for current language
  const getBestVoice = (langCode) => {
    if (!voices || voices.length === 0) return null;

    // Try to find exact match first
    const exactMatch = voices.find(voice =>
      voice.lang.toLowerCase().startsWith(langCode.toLowerCase())
    );
    if (exactMatch) return exactMatch;

    // Fallback to partial match
    const langPrefix = langCode.split('-')[0];
    const partialMatch = voices.find(voice =>
      voice.lang.toLowerCase().startsWith(langPrefix)
    );
    if (partialMatch) return partialMatch;

    // Default to first available voice if no match
    return voices[0];
  };

  const speakText = (text, id) => {
    if (isSpeaking[id]) {
      window.speechSynthesis.cancel();
      setIsSpeaking(prev => ({ ...prev, [id]: false }));
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
        onEnd: () => setIsSpeaking(prev => ({ ...prev, [id]: false })),
        onError: (event) => {
          console.error('Speech synthesis error:', event);
          setIsSpeaking(prev => ({ ...prev, [id]: false }));
        }
      });
      setIsSpeaking(prev => ({ ...prev, [id]: true }));
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(prev => ({ ...prev, [id]: false }));
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  // 3. Update the handleNewChat function
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

  // 4. Update the handleLoadChat function
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

  // 5. Update the handleDeleteChat function
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
          handleNewChat(); // Create a new chat when all are deleted
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const getMessageStyle = (role) => ({
    maxWidth: 'min(90%, 800px)',
    alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
    bgcolor: role === 'user'
      ? (darkMode ? 'primary.dark' : 'primary.light')
      : (darkMode ? 'background.paper' : 'background.paper'),
    color: role === 'user' ? '#fff' : (darkMode ? '#fff' : 'text.primary'),
    border: role === 'user' ? 'none' : `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
    borderRadius: role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
    p: 2,
    mb: 2,
    boxShadow: role === 'user' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
    position: 'relative',
    '&:hover': {
      boxShadow: role === 'user' ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
    }
  });

  // 3. Responsive Drawer toggle
  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  const handleQuestionClick = (question) => {
    setInputValue(question);
    setTimeout(() => {
      document.querySelector('.chat-input input')?.focus();
    }, 100);
  };

  // 4. Responsive layout for content and AppBar
  const contentMarginLeft = { md: sidebarOpen ? drawerWidth : 0 };
  const appBarSx = {
    width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
    marginLeft: { md: sidebarOpen ? drawerWidth : 0 },
    transition: 'width 225ms ease, margin 225ms ease',
    bgcolor: 'background.paper',
    color: 'text.primary',
    borderBottom: `1px solid ${darkMode ? '#2d3748' : '#e2e8f0'}`,
    height: '64px',
    justifyContent: 'center'
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key];
  };

  // Update the handleEditTitle function
  const handleEditTitle = (chatId, currentTitle) => {
    setRenameChatId(chatId);
    setNewChatTitle(currentTitle);
    setRenameDialogOpen(true);
  };

  // Add this new function to handle the rename submission
  const handleRenameSubmit = () => {
    if (newChatTitle.trim()) {
      const updatedHistory = conversationHistory.map(chat => 
        chat.id === renameChatId 
          ? { ...chat, title: newChatTitle.trim() }
          : chat
      );
      setConversationHistory(updatedHistory);
      localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
    }
    setRenameDialogOpen(false);
    setRenameChatId(null);
    setNewChatTitle('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
        '& .MuiDrawer-root': {
          flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row'
        }
      }}>
        {/* Drawer */}
        <Drawer
          variant={drawerVariant}
          open={drawerOpen}
          onClose={() => isMobile && setMobileOpen(false)}
          anchor={currentLanguage === 'ar' ? 'right' : 'left'}
          sx={{
            width: {
              xs: 0,
              md: drawerOpenDesktop ? drawerWidth : 0
            },
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              transform: (theme) => {
                if (!drawerOpen) {
                  return theme.direction === 'rtl' 
                    ? 'translateX(100%)' 
                    : 'translateX(-100%)';
                }
                return 'translateX(0)';
              },
              visibility: drawerOpen ? 'visible' : 'hidden',
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#fff' : 'text.primary' }}>
              ENIAD AI
            </Typography>
            {/* 1. Updated close icon logic */}
            <IconButton onClick={() => isMobile ? setMobileOpen(false) : setSidebarOpen(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          {/* 5. Nouveau chat button always visible, fullWidth, styled */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={currentLanguage === 'ar' ? null : <AddIcon />}
            endIcon={currentLanguage === 'ar' ? <AddIcon /> : null}
            onClick={handleNewChat}
            sx={{
              textTransform: 'none',
              py: 1.5,
              borderRadius: 1,
              mb: 2,
              flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
              '& .MuiButton-startIcon': {
                marginRight: currentLanguage === 'ar' ? 0 : 1,
                marginLeft: currentLanguage === 'ar' ? 1 : 0,
              },
              '& .MuiButton-endIcon': {
                marginLeft: currentLanguage === 'ar' ? 0 : 1,
                marginRight: currentLanguage === 'ar' ? 1 : 0,
              }
            }}
          >
            {t('newChat')}
          </Button>
          <Divider sx={{ my: 1 }} />
          <List sx={{ overflow: 'auto', flex: 1 }}>
            {conversationHistory.map((convo) => (
              <ListItem
                key={convo.id}
                disablePadding
                secondaryAction={
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row' 
                  }}>
                    <IconButton
                      edge="end"
                      onClick={(e) => handleEditTitle(convo.id, convo.title)}
                      sx={{ 
                        color: 'text.secondary',
                        mr: currentLanguage === 'ar' ? 0 : 1,
                        ml: currentLanguage === 'ar' ? 1 : 0
                      }}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={(e) => handleDeleteChat(convo.id, e)}
                      sx={{ color: 'text.secondary' }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemButton
                  selected={currentChatId === convo.id}
                  onClick={() => handleLoadChat(convo.id)}
                  sx={{
                    borderRadius: '8px',
                    mx: 1,
                    my: 0.5,
                    pr: currentLanguage === 'ar' ? 2 : 8,
                    pl: currentLanguage === 'ar' ? 8 : 2,
                    '&.Mui-selected': {
                      bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                    },
                    '&.Mui-selected:hover': {
                      bgcolor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 36,
                    mr: currentLanguage === 'ar' ? 0 : 1,
                    ml: currentLanguage === 'ar' ? 1 : 0
                  }}>
                    <ChatIcon fontSize="small" color={currentChatId === convo.id ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={convo.title}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: currentChatId === convo.id ? '600' : 'normal',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '0.9rem',
                        textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                      }
                    }}
                    secondary={new Date(convo.lastUpdated).toLocaleString()}
                    secondaryTypographyProps={{
                      sx: {
                        fontSize: '0.7rem',
                        color: darkMode ? 'text.secondary' : 'text.secondary',
                        textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex' }}>
              <Tooltip title={darkMode === prefersDarkMode 
  ? t('usingSystemPreference') 
  : darkMode ? t('lightMode') : t('darkMode')}>
  <IconButton 
    onClick={toggleDarkMode} 
    size="small" 
    sx={{ 
      mr: 1,
      opacity: darkMode === prefersDarkMode ? 0.7 : 1 
    }}
  >
    {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
  </IconButton>
</Tooltip>
              <Tooltip title={t('settings')}>
                <IconButton onClick={() => setSettingsOpen(true)} size="small">
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {translations[currentLanguage].version}
            </Typography>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            width: {
              xs: '100%',
              md: drawerOpenDesktop ? `calc(100% - ${drawerWidth}px)` : '100%'
            },
            transition: theme => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              width: {
                xs: '100%',
                md: drawerOpenDesktop ? `calc(100% - ${drawerWidth}px)` : '100%'
              },
              [currentLanguage === 'ar' ? 'mr' : 'ml']: {
                xs: 0,
                md: drawerOpenDesktop ? `${drawerWidth}px` : 0
              },
              transition: theme => theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderBottom: `1px solid ${darkMode ? '#2d3748' : '#e2e8f0'}`,
              zIndex: (theme) => theme.zIndex.drawer + 1
            }}
          >
            <Toolbar>
              <IconButton
                edge={currentLanguage === 'ar' ? 'end' : 'start'}
                onClick={handleDrawerToggle}
                sx={{
                  mr: currentLanguage === 'ar' ? 0 : 2,
                  ml: currentLanguage === 'ar' ? 2 : 0
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  flexGrow: 1,
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                }}
              >
                {conversationHistory.find(c => c.id === currentChatId)?.title || t('newConversation')}
              </Typography>

              <Tooltip title="Change Language / Changer la langue / تغيير اللغة">
                <IconButton
                  size="small"
                  onClick={() => setSettingsOpen(true)}
                  sx={{
                    ml: currentLanguage === 'ar' ? 0 : 1,
                    mr: currentLanguage === 'ar' ? 1 : 0
                  }}
                >
                  <Typography sx={{
                    fontSize: '1.2rem',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {LANGUAGES.find(l => l.code === currentLanguage)?.flag}
                  </Typography>
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>

          <Toolbar /> {/* This creates space below the fixed AppBar */}

          <Box
            ref={chatContainerRef}
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              height: `calc(100vh - 64px)`, // 64px is AppBar height
              pt: `64px`, // Add padding top to account for AppBar
              overflow: 'hidden', // Prevent double scrollbars
            }}
          >
            {/* Chat content container */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                bgcolor: 'background.default',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Container
                maxWidth="md"
                disableGutters
                sx={{
                  px: { xs: 1, sm: 3 },
                  py: { xs: 1, sm: 3 },
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {messages.length === 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      textAlign: 'center',
                      color: 'text.secondary',
                      gap: 2,
                      px: 2
                    }}
                  >
                    <Avatar sx={{
                      width: 80,
                      height: 80,
                      mb: 2,
                      bgcolor: 'primary.main',
                      '& .MuiSvgIcon-root': {
                        fontSize: '2.5rem'
                      }
                    }}>
                      <SchoolIcon />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {t('assistant')}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px' }}>
                      {t('startPrompt')}
                    </Typography>

                    <Box sx={{ width: '100%', maxWidth: 'md' }}>
                      <Grid container spacing={2} justifyContent="center">
                        {translations[currentLanguage].suggestions.map((question, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper
                              elevation={0}
                              onClick={() => handleQuestionClick(question)}
                              sx={{
                                p: 2,
                                borderRadius: '12px',
                                border: `1px solid ${darkMode ? '#2d3748' : '#e2e8f0'}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                '&:hover': {
                                  borderColor: darkMode ? '#4a5568' : '#cbd5e0',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }
                              }}
                            >
                              <Typography sx={{
                                fontSize: '0.95rem',
                                lineHeight: 1.4,
                                textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                              }}>
                                {question}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ width: '100%' }}>
                    {messages.map((msg, index) => (
                      <Box key={index} sx={{
                        display: 'flex',
                        mb: 2,
                        justifyContent: msg.role === 'user'
                          ? currentLanguage === 'ar' ? 'flex-start' : 'flex-end'
                          : currentLanguage === 'ar' ? 'flex-end' : 'flex-start',
                        px: { xs: 0.5, sm: 0 }
                      }}>
                        {msg.role !== 'user' && (
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              mr: 2,
                              mt: 1,
                              bgcolor: darkMode ? 'secondary.dark' : 'secondary.main',
                              color: '#fff'
                            }}
                          >
                            <SchoolIcon fontSize="small" />
                          </Avatar>
                        )}
                        <Paper
                          elevation={0}
                          sx={{
                            ...getMessageStyle(msg.role),
                            maxWidth: '85%'
                          }}
                        >
                          {editingMessageId === msg.id ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <TextField
                                fullWidth
                                multiline
                                value={editedMessageContent}
                                onChange={(e) => setEditedMessageContent(e.target.value)}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                  }
                                }}
                              />
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                  size="small"
                                  onClick={handleCancelEdit}
                                  variant="outlined"
                                >
                                  <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
                                  {t('cancel')}
                                </Button>
                                <Button
                                  size="small"
                                  onClick={handleSaveEdit}
                                  variant="contained"
                                  color="primary"
                                >
                                  <SaveIcon fontSize="small" sx={{ mr: 0.5 }} />
                                  {t('save')}
                                </Button>
                              </Box>
                            </Box>
                          ) : (
                            <>
                              <Typography sx={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.6,
                                fontSize: '0.95rem'
                              }}>
                                {msg.content}
                              </Typography>
                              <Box sx={{
                                position: 'absolute',
                                bottom: -16,
                                right: -16,
                                display: 'flex',
                                gap: 0.5
                              }}>
                                {msg.role === 'user' && (
                                  <Tooltip title={t('edit')}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEditMessage(msg.id, msg.content)}
                                      sx={{
                                        bgcolor: darkMode ? 'background.paper' : 'background.paper',
                                        color: darkMode ? '#fff' : 'text.primary',
                                        boxShadow: 1,
                                        '&:hover': {
                                          bgcolor: darkMode ? 'background.default' : 'background.default'
                                        }
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {msg.role === 'assistant' && (
                                  <IconButton
                                    size="small"
                                    onClick={() => speakText(msg.content, msg.id)}
                                    disabled={!supported}
                                    sx={{
                                      bgcolor: darkMode ? 'primary.dark' : 'primary.main',
                                      color: '#fff',
                                      boxShadow: 1,
                                      '&:hover': {
                                        bgcolor: darkMode ? 'primary.main' : 'primary.dark'
                                      },
                                      '&.Mui-disabled': {
                                        bgcolor: 'rgba(0, 0, 0, 0.12)',
                                        color: 'rgba(0, 0, 0, 0.26)'
                                      }
                                    }}
                                  >
                                    <VolumeUpIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </Box>
                            </>
                          )}
                        </Paper>
                        {msg.role === 'user' && (
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              ml: 2,
                              mt: 1,
                              bgcolor: darkMode ? 'primary.dark' : 'primary.main',
                              color: '#fff'
                            }}
                          >
                            <PersonIcon fontSize="small" />
                          </Avatar>
                        )}
                      </Box>
                    ))}

                    {isLoading && (
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 2,
                            mt: 1,
                            bgcolor: darkMode ? 'secondary.dark' : 'secondary.main',
                            color: '#fff'
                          }}
                        >
                          <SchoolIcon fontSize="small" />
                        </Avatar>
                        <Paper
                          elevation={0}
                          sx={{
                            bgcolor: darkMode ? 'background.paper' : 'background.paper',
                            p: 2,
                            borderRadius: '8px'
                          }}
                        >
                          <Typography>{t('thinking')}</Typography>
                        </Paper>
                      </Box>
                    )}
                    <div ref={messagesEndRef} />
                  </Box>
                )}
              </Container>
            </Box>

            {/* Input container - Update the styling */}
            <Box
              sx={{
                borderTop: `1px solid ${darkMode ? '#2d3748' : '#e2e8f0'}`,
                bgcolor: 'background.paper',
                position: 'sticky',
                bottom: 0,
                width: '100%',
                zIndex: 1
              }}
            >
              <Container
                maxWidth="md"
                disableGutters
                sx={{
                  px: { xs: 1, sm: 3 },
                  py: { xs: 1, sm: 2 }
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={t('writeMessage')}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  multiline
                  maxRows={4}
                  className="chat-input"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '24px',
                      paddingRight: '8px',
                      bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${darkMode ? '#2d3748' : '#e2e8f0'}`,
                      '&:hover': {
                        borderColor: darkMode ? '#4a5568' : '#cbd5e0'
                      },
                      '&.Mui-focused': {
                        borderColor: darkMode ? '#4a6fa5' : '#2c5282',
                        boxShadow: `0 0 0 2px ${darkMode ? 'rgba(74, 111, 165, 0.2)' : 'rgba(44, 82, 130, 0.2)'}`
                      }
                    },
                    '& .MuiInputAdornment-root': {
                      [currentLanguage === 'ar' ? 'marginLeft' : 'marginRight']: 0
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{
                          display: 'flex',
                          flexDirection: currentLanguage === 'ar' ? 'row-reverse' : 'row',
                          gap: 1
                        }}>
                          <Tooltip title={isRecording ? t('stopRecording') : t('startRecording')}>
                            <IconButton
                              onClick={toggleRecording}
                              disabled={!browserSupportsSpeechRecognition}
                              sx={{
                                color: isRecording ? 'error.main' : 'inherit'
                              }}
                            >
                              <MicIcon />
                            </IconButton>
                          </Tooltip>

                          <Fab
                            color="primary"
                            size="small"
                            onClick={handleSubmit}
                            disabled={!inputValue.trim() || isLoading}
                            sx={{
                              boxShadow: 'none',
                              '&:disabled': {
                                bgcolor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
                              }
                            }}
                          >
                            {isLoading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              <SendIcon />
                            )}
                          </Fab>
                        </Box>
                      </InputAdornment>
                    ),
                    sx: {
                      '& .MuiInputAdornment-root': {
                        [currentLanguage === 'ar' ? 'marginLeft' : 'marginRight']: 0
                      }
                    }
                  }}
                />
                <Typography variant="caption" sx={{
                  display: 'block',
                  textAlign: 'center',
                  mt: 1,
                  color: 'text.secondary'
                }}>
                  {t('disclaimer')}
                </Typography>
              </Container>
            </Box>
          </Box>
        </Box >
      </Box >

      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: darkMode ? '#1e1e1e' : '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: darkMode ? 'primary.dark' : 'primary.main',
          color: '#fff',
          fontWeight: 600
        }}>
          {t('settings')}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Theme Toggle */}
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
              label={t('darkMode')}
              sx={{
                justifyContent: 'space-between',
                mx: 0,
                py: 1
              }}
            />
            
            {/* Auto Read Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={autoRead}
                  onChange={(e) => setAutoRead(e.target.checked)}
                  disabled={!supported}
                />
              }
              label={t('autoRead')}
              sx={{
                justifyContent: 'space-between',
                mx: 0,
                py: 1
              }}
            />

            {/* Language Selection */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                {t('languageSection')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {LANGUAGES.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={currentLanguage === lang.code ? 'contained' : 'outlined'}
                    onClick={() => {
                      setCurrentLanguage(lang.code);
                      localStorage.setItem('language', lang.code);
                    }}
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      py: 1
                    }}
                  >
                    <Typography sx={{ fontSize: '1.2rem', mr: 1 }}>
                      {lang.flag}
                    </Typography>
                    {lang.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
<Dialog
  open={renameDialogOpen}
  onClose={() => setRenameDialogOpen(false)}
  fullWidth
  maxWidth="xs"
  PaperProps={{
    sx: {
      bgcolor: darkMode ? '#1e1e1e' : '#ffffff'
    }
  }}
>
  <DialogTitle sx={{
    bgcolor: darkMode ? 'primary.dark' : 'primary.main',
    color: '#fff',
    fontWeight: 600
  }}>
    {t('editTitle')}
  </DialogTitle>
  <DialogContent sx={{ py: 2, mt: 1 }}>
    <TextField
      fullWidth
      value={newChatTitle}
      onChange={(e) => setNewChatTitle(e.target.value)}
      placeholder={t('newConversation')}
      autoFocus
      InputProps={{
        sx: {
          bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        }
      }}
    />
  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button 
      onClick={() => setRenameDialogOpen(false)}
      variant="outlined"
    >
      {t('cancel')}
    </Button>
    <Button 
      onClick={handleRenameSubmit}
      variant="contained"
      disabled={!newChatTitle.trim()}
    >
      {t('save')}
    </Button>
  </DialogActions>
</Dialog>
    </ThemeProvider >
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Wrap the App component with ErrorBoundary in index.js or where you render the App
export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}