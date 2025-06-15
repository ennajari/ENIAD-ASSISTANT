'use client';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import VoiceModal from './VoiceModal';

const PromptBox = ({ setIsLoading, isLoading, prompt, setPrompt }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [recognitionLang, setRecognitionLang] = useState('ar-SA');
  const [mounted, setMounted] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const startVoiceRecording = () => {
    if (!mounted) return;

    if ('webkitSpeechRecognition' in window) {
      setShowVoiceModal(true);
    } else {
      toast.error('متصفحك لا يدعم تسجيل الصوت');
    }
  };

  const handleLanguageChange = (langCode) => {
    if (!mounted) return;

    setRecognitionLang(langCode);
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = langCode;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setShowVoiceModal(false);
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      setIsRecording(false);
      setShowVoiceModal(false);
      toast.error('حدث خطأ في التسجيل');
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleApiResponse = async (data, promptCopy) => {
    if (data.success) {
      const fullMessage = data.data;

      // Mettre à jour la liste des chats
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...(chat.messages || []), fullMessage] }
            : chat
        )
      );

      // Créer le message de l'assistant
      let assistantMessage = {
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      // Ajouter le message vide à l'affichage
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), assistantMessage],
      }));

      // Animation de frappe
      const messageTokens = fullMessage.content.split(' ');
      for (let i = 0; i < messageTokens.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 30));
        assistantMessage.content = messageTokens.slice(0, i + 1).join(' ');
        
        setSelectedChat((prev) => {
          if (!prev) return prev;
          const updatedMessages = [...(prev.messages || [])];
          updatedMessages[updatedMessages.length - 1] = { ...assistantMessage };
          return { ...prev, messages: updatedMessages };
        });
      }

      // Remplacer par le message final complet
      setSelectedChat((prev) => {
        if (!prev) return prev;
        const updatedMessages = [...(prev.messages || [])];
        updatedMessages[updatedMessages.length - 1] = fullMessage;
        return { ...prev, messages: updatedMessages };
      });

    } else {
      toast.error(data.message || 'Erreur lors de la réponse');
      setPrompt(promptCopy);
    }
  };

  const sendPrompt = async (e) => {
    e.preventDefault();
    if (!mounted) return;

    const promptCopy = prompt.trim();

    // Validations
    if (!user) {
      toast.error('Connectez-vous pour envoyer un message');
      return;
    }

    if (isLoading) {
      toast.error('Attendez la réponse précédente');
      return;
    }

    if (!selectedChat) {
      toast.error('Veuillez sélectionner ou créer un chat');
      return;
    }

    if (!promptCopy) {
      toast.error('Veuillez saisir votre message');
      return;
    }

    try {
      setIsLoading(true);
      setPrompt('');

      // Créer le message utilisateur
      const userPrompt = {
        role: 'user',
        content: promptCopy,
        timestamp: Date.now(),
      };

      // Mettre à jour l'affichage avec le message utilisateur
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...(chat.messages || []), userPrompt] }
            : chat
        )
      );

      setSelectedChat((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), userPrompt],
      }));

      // Appeler l'API appropriée
      let response;
      if (isSearchMode) {
        console.log('Mode recherche activé');
        response = await axios.post('/api/chat/search', { 
          prompt: promptCopy 
        }, {
          timeout: 30000 // 30 secondes timeout
        });
      } else {
        console.log('Mode chat IA activé');
        response = await axios.post('/api/chat/ai', {
          chatId: selectedChat._id,
          prompt: promptCopy,
        }, {
          timeout: 60000 // 60 secondes pour l'IA
        });
      }

      await handleApiResponse(response.data, promptCopy);

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      
      let errorMessage = 'Erreur lors de l\'envoi du message';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'La requête a expiré. Veuillez réessayer.';
      } else if (error.response) {
        errorMessage = `Erreur du serveur: ${error.response.status}`;
        if (error.response.data?.message) {
          errorMessage += ` - ${error.response.data.message}`;
        }
      } else if (error.request) {
        errorMessage = 'Problème de connexion réseau';
      }
      
      toast.error(errorMessage);
      setPrompt(promptCopy); // Restaurer le prompt en cas d'erreur
      
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {showVoiceModal && (
        <VoiceModal
          isRecording={isRecording}
          onClose={() => {
            setShowVoiceModal(false);
            setIsRecording(false);
          }}
          onLanguageChange={handleLanguageChange}
        />
      )}

      <form
        onSubmit={sendPrompt}
        className={`w-full ${
          selectedChat?.messages?.length > 0 ? 'max-w-3xl' : 'max-w-2xl'
        } bg-white border border-gray-200 shadow-sm p-4 rounded-3xl mt-4 transition-all`}
      >
        <textarea
          onKeyDown={handleKeyDown}
          className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-gray-800 placeholder-gray-500"
          rows={2}
          placeholder="Message Eniad-Assistant"
          required
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          disabled={isLoading}
        />

        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`flex items-center gap-2 text-xs border px-3 py-1.5 rounded-full cursor-pointer transition ${
                isSearchMode
                  ? 'bg-orange-200 border-orange-400 text-orange-800'
                  : 'border-gray-300 hover:bg-gray-100 text-gray-600'
              }`}
              onClick={() => setIsSearchMode((prev) => !prev)}
              disabled={isLoading}
            >
              <Image className="h-4 w-4" src={assets.search_icon} alt="Recherche" />
              <span>{isSearchMode ? 'Recherche ON' : 'Recherche'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startVoiceRecording}
              className="w-6 h-6 cursor-pointer hover:opacity-80 text-gray-600 disabled:opacity-50"
              title="تسجيل صوتي"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>
            
            <button
              type="submit"
              className={`${
                prompt.trim() && !isLoading
                  ? 'bg-orange-200 hover:bg-orange-300' 
                  : 'bg-gray-300 cursor-not-allowed'
              } rounded-full p-2 transition-colors duration-200`}
              disabled={!prompt.trim() || isLoading}
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Image
                  className="w-3.5 aspect-square"
                  src={prompt.trim() ? assets.arrow_icon : assets.arrow_icon_dull}
                  alt="Envoyer"
                />
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PromptBox;