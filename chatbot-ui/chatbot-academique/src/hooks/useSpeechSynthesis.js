import { useState, useEffect } from 'react';

export const useSpeechSynthesis = () => {
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
    utterance.rate = 0.9;
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
