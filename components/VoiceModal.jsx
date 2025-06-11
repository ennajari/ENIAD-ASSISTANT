'use client';
import React, { useState, useEffect } from 'react';

const VoiceModal = ({ isRecording, onClose, onLanguageChange }) => {
    const [mounted, setMounted] = useState(false);
    const [selectedLang, setSelectedLang] = useState('ar-SA');

    useEffect(() => {
        setMounted(true);
    }, []);

    const languages = [
        { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
        { code: 'en-US', name: 'English', flag: '🇺🇸' },
        { code: 'fr-FR', name: 'Français', flag: '🇫🇷' }
    ];

    const handleLanguageChange = (langCode) => {
        setSelectedLang(langCode);
        onLanguageChange(langCode);
    };

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-[400px] flex flex-col items-center gap-6 shadow-2xl">
                {/* Header */}
                <div className="w-full flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">enregistrement audio</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Microphone Animation */}
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center 
                    ${isRecording ? 'bg-orange-50' : 'bg-gray-50'}`}>
                    {/* Ripple Effect */}
                    {isRecording && (
                        <>
                            <span className="absolute w-full h-full rounded-full bg-orange-200 animate-ping opacity-25"></span>
                            <span className="absolute w-[90%] h-[90%] rounded-full bg-orange-100 animate-pulse"></span>
                        </>
                    )}
                    {/* Microphone Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
                        className={`w-12 h-12 z-10 transition-colors duration-300 ${isRecording ? 'text-orange-500' : 'text-gray-600'}`}
                        fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                </div>

                {/* Status Text */}
                <p className={`text-lg font-medium text-center transition-colors duration-300
                    ${isRecording ? 'text-orange-500' : 'text-gray-600'}`}>
                    {isRecording ? ' Ecouter...' : 'Cliquez sur la langue souhaitée pour commencer'}
                </p>

                {/* Language Selection */}
                <div className="flex gap-3 w-full justify-center">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                                ${selectedLang === lang.code 
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                            <span className="text-xl">{lang.flag}</span>
                            <span className="font-medium">{lang.name}</span>
                        </button>
                    ))}
                </div>

                {/* Cancel Button */}
                <button 
                    onClick={onClose}
                    className="mt-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Close
                </button>
            </div>
        </div>
    );
};

export default VoiceModal; 