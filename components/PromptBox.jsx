'use client';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import VoiceModal from './VoiceModal';

const PromptBox = ({ setIsLoading, isLoading, prompt, setPrompt }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const [recognitionLang, setRecognitionLang] = useState('ar-SA');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const textareaRef = useRef(null);
    const mountedRef = useRef(false);

    const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendPrompt(e);
        }
    };

    const startVoiceRecording = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error('Reconnaissance vocale non supportée');
            return;
        }
        setShowVoiceModal(true);
    };

    const handleLanguageChange = (langCode) => {
        if (!mountedRef.current) return;

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = langCode;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsRecording(true);

        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            setPrompt(transcript);
            setShowVoiceModal(false);
        };

        recognition.onerror = (e) => {
            console.error('Erreur reconnaissance vocale', e.error);
            toast.error(`Erreur: ${e.error}`);
            setShowVoiceModal(false);
        };

        recognition.onend = () => setIsRecording(false);

        recognition.start();
    };

    const handleApiResponse = async (data, promptCopy) => {
        if (!data.success) {
            toast.error(data.message || 'Erreur de réponse');
            setPrompt(promptCopy);
            return;
        }

        const assistantMessage = data.data;

        // Mise à jour de la liste des chats
        setChats(prev => prev.map(chat => 
            chat._id === selectedChat._id 
                ? { ...chat, messages: [...chat.messages, assistantMessage] } 
                : chat
        ));

        // Animation de frappe
        setSelectedChat(prev => ({
            ...prev,
            messages: [...prev.messages, { ...assistantMessage, content: '' }]
        }));

        const words = assistantMessage.content.split(' ');
        for (let i = 0; i < words.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 30));
            setSelectedChat(prev => {
                const newMessages = [...prev.messages];
                newMessages[newMessages.length - 1].content = words.slice(0, i + 1).join(' ');
                return { ...prev, messages: newMessages };
            });
        }
    };

    const sendPrompt = async (e) => {
        e.preventDefault();
        if (!mountedRef.current || !user || !selectedChat) return;

        const promptCopy = prompt.trim();
        if (!promptCopy) {
            toast.error('Veuillez saisir un message');
            return;
        }

        try {
            setIsLoading(true);
            setPrompt('');

            // Ajout du message utilisateur
            const userMessage = {
                role: 'user',
                content: promptCopy,
                timestamp: Date.now()
            };

            setChats(prev => prev.map(chat => 
                chat._id === selectedChat._id 
                    ? { ...chat, messages: [...chat.messages, userMessage] } 
                    : chat
            ));

            setSelectedChat(prev => ({
                ...prev,
                messages: [...prev.messages, userMessage]
            }));

            // Appel à l'API appropriée
            const endpoint = isSearchMode ? '/api/chat/search' : '/api/chat/ai';
            const payload = isSearchMode 
                ? { prompt: promptCopy, searchActive: true }
                : { chatId: selectedChat._id, prompt: promptCopy };

            console.log("Sending request to API...");
            const { data } = await axios.post(endpoint, payload);
            console.log("Received response from API");

            await handleApiResponse(data, promptCopy);

        } catch (error) {
            console.error('API Error:', error);
            let errorMsg = 'Erreur de communication';
            
            if (error.response) {
                errorMsg = error.response.data?.message || error.response.statusText;
            } else if (error.message.includes('Network Error')) {
                errorMsg = 'Problème de connexion réseau';
            } else {
                errorMsg = error.message || 'Erreur inconnue';
            }
            
            toast.error(errorMsg);
            setPrompt(promptCopy);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4">
            {showVoiceModal && (
                <VoiceModal
                    isRecording={isRecording}
                    onClose={() => setShowVoiceModal(false)}
                    onLanguageChange={handleLanguageChange}
                />
            )}

            <form onSubmit={sendPrompt} className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm">
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    placeholder="Message Eniad-Assistant"
                    className="w-full outline-none resize-none bg-transparent text-gray-800 placeholder-gray-500"
                    disabled={isLoading}
                />

                <div className="flex justify-between items-center mt-2 text-sm">
                    <button
                        type="button"
                        onClick={() => setIsSearchMode(!isSearchMode)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border ${
                            isSearchMode 
                                ? 'bg-orange-200 border-orange-400 text-orange-800' 
                                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                        }`}
                        disabled={isLoading}
                    >
                        <Image src={assets.search_icon} alt="Search" width={16} height={16} />
                        {isSearchMode ? 'Recherche ON' : 'Recherche'}
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={startVoiceRecording}
                            disabled={isLoading}
                            className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                            title="Enregistrement vocal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                            </svg>
                        </button>

                        <button
                            type="submit"
                            disabled={!prompt.trim() || isLoading}
                            className={`p-2 rounded-full ${
                                prompt.trim() && !isLoading
                                    ? 'bg-orange-200 hover:bg-orange-300'
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Image 
                                    src={prompt.trim() ? assets.arrow_icon : assets.arrow_icon_dull} 
                                    alt="Send" 
                                    width={14} 
                                    height={14} 
                                />
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PromptBox;