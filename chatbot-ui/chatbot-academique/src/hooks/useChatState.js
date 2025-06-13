import { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useChatState = () => {
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
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameChatId, setRenameChatId] = useState(null);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [chatMenuAnchorEl, setChatMenuAnchorEl] = useState(null);
  const [chatMenuChatId, setChatMenuChatId] = useState(null);

  const isMobile = useMediaQuery('(max-width:600px)');

  // Save autoRead setting when it changes
  useEffect(() => {
    localStorage.setItem('autoRead', JSON.stringify(autoRead));
  }, [autoRead]);

  return {
    // State
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    setIsLoading,
    isSpeaking,
    setIsSpeaking,
    settingsOpen,
    setSettingsOpen,
    autoRead,
    setAutoRead,
    conversationHistory,
    setConversationHistory,
    currentChatId,
    setCurrentChatId,
    sidebarOpen,
    setSidebarOpen,
    isRecording,
    setIsRecording,
    mobileOpen,
    setMobileOpen,
    editingMessageId,
    setEditingMessageId,
    editedMessageContent,
    setEditedMessageContent,
    renameDialogOpen,
    setRenameDialogOpen,
    renameChatId,
    setRenameChatId,
    newChatTitle,
    setNewChatTitle,
    chatMenuAnchorEl,
    setChatMenuAnchorEl,
    chatMenuChatId,
    setChatMenuChatId,
    isMobile
  };
};
