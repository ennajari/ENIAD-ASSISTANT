'use client';
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import VoiceModal from './VoiceModal';

const PromptBox = ({setIsLoading, isLoading, prompt, setPrompt}) => {

    const [isRecording, setIsRecording] = useState(false);
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const [recognitionLang, setRecognitionLang] = useState('ar-SA');
    const [mounted, setMounted] = useState(false);
    const {user, chats, setChats, selectedChat, setSelectedChat} = useAppContext();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleKeyDown = (e)=>{
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            sendPrompt(e);
        }
    }

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

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setPrompt(transcript);
            setShowVoiceModal(false);
            setIsRecording(false);
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            setIsRecording(false);
            setShowVoiceModal(false);
            toast.error('حدث خطأ في التسجيل');
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
    };

    const handleApiResponse = async (data, promptCopy) => {
        if(data.success){
            const fullMessage = data.data;
            
            setChats((prevChats)=>prevChats.map((chat)=>
                chat._id === selectedChat._id 
                    ? {...chat, messages: [...(chat.messages || []), fullMessage]} 
                    : chat
            ));

            const messageContent = fullMessage.content;
            const messageTokens = messageContent.split(" ");
            let assistantMessage = {
                role: 'assistant',
                content: "",
                timestamp: Date.now(),
            };

            setSelectedChat((prev) => ({
                ...prev,
                messages: [...(prev.messages || []), assistantMessage],
            }));

            for (let i = 0; i < messageTokens.length; i++) {
               await new Promise(resolve => setTimeout(resolve, 50));
               assistantMessage.content = messageTokens.slice(0, i + 1).join(" ");
               setSelectedChat((prev)=>{
                   if (!prev) return prev;
                   const updatedMessages = [
                           ...(prev.messages || []).slice(0, -1),
                           {...assistantMessage}
                       ];
                       return {...prev, messages: updatedMessages};
                   });
            }

            // After typing, replace with the full message to include audio data
            setSelectedChat((prev) => {
                if (!prev) return prev;
                const finalMessages = [
                    ...(prev.messages || []).slice(0, -1),
                    fullMessage
                ];
                return {...prev, messages: finalMessages };
            });

        } else {
            toast.error(data.message);
            setPrompt(promptCopy);
        }
    };

    const sendPrompt = async (e) => {
        e.preventDefault();
        if (!mounted) return;

        try {
            if(!user) return toast.error('Login to send message');
            if(isLoading) return toast.error('Wait for the previous prompt response');
            if(!selectedChat) return toast.error('Please select or create a chat first');

            setIsLoading(true);
            const promptCopy = prompt;
            setPrompt("");

            const userPrompt = {
                role: "user",
                content: promptCopy,
                timestamp: Date.now(),
            };

            if (selectedChat && selectedChat._id) {
                setChats((prevChats) => prevChats.map((chat) => 
                    chat._id === selectedChat._id 
                        ? {
                            ...chat,
                            messages: [...(chat.messages || []), userPrompt]
                        } 
                        : chat
                ));

                setSelectedChat((prev) => ({
                    ...prev,
                    messages: [...(prev.messages || []), userPrompt]
                }));

                try {
                    const {data} = await axios.post('/api/chat/ai', {
                        chatId: selectedChat._id,
                        prompt: promptCopy
                    });
                    await handleApiResponse(data, promptCopy);
                } catch (error) {
                    toast.error('Error sending message');
                    console.error(error);
                    setPrompt(promptCopy);
                }
            }
        } catch (error) {
            toast.error(error.message);
            setPrompt(promptCopy);
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
    <form onSubmit={sendPrompt}
             className={`w-full ${selectedChat?.messages?.length > 0 ? "max-w-3xl" : "max-w-2xl"} bg-white border border-gray-200 shadow-sm p-4 rounded-3xl mt-4 transition-all`}>
        <textarea
        onKeyDown={handleKeyDown}
                className='outline-none w-full resize-none overflow-hidden break-words bg-transparent text-gray-800 placeholder-gray-500'
        rows={2}
                placeholder='Message Eniad-Assistant' required 
        onChange={(e)=> setPrompt(e.target.value)} value={prompt}/>

                <div className='flex items-center justify-between text-sm text-gray-700'>
            <div className='flex items-center gap-2'>
                        <p className='flex items-center gap-2 text-xs border border-gray-300 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-100 transition'>
                    <Image className='h-5' src={assets.search_icon} alt=''/>
                    Search
                </p>
            </div>

            <div className='flex items-center gap-2'>
                        <button 
                            type="button"
                            onClick={startVoiceRecording}
                            className='w-6 h-6 cursor-pointer hover:opacity-80 text-gray-600' 
                            title="تسجيل صوتي">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                            </svg>
                        </button>
                        <button className={`${prompt ? "bg-orange-200 hover:bg-orange-300" : "bg-gray-300"} rounded-full p-2 cursor-pointer transition-colors duration-200`}>
                <Image className='w-3.5 aspect-square' src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt=''/>
            </button>
            </div>
        </div>
    </form>
        </>
  )
}

export default PromptBox
