import { useState, useCallback, useRef, useEffect } from 'react';
import speechService from '../services/speechService';

/**
 * Hook personnalisé pour gérer l'état TTS avec ElevenLabs
 */
export const useTTSState = (currentLanguage = 'fr') => {
  // États TTS
  const [isSpeaking, setIsSpeaking] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState(currentLanguage);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Refs pour le suivi
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Nettoyer les intervalles
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Détecter la langue du texte
  const detectLanguage = useCallback((text) => {
    return speechService.detectLanguage(text);
  }, []);

  // Estimer la durée de lecture
  const estimateReadingDuration = useCallback((text, language) => {
    if (!text) return 0;
    
    // Vitesses de lecture approximatives (mots par minute)
    const readingSpeeds = {
      'fr': 150, // mots par minute en français
      'ar': 120, // mots par minute en arabe (plus lent)
      'en': 160  // mots par minute en anglais
    };
    
    const speed = readingSpeeds[language] || readingSpeeds['fr'];
    const wordCount = text.split(/\s+/).length;
    const durationMinutes = wordCount / speed;
    
    return Math.max(durationMinutes * 60, 2); // Minimum 2 secondes
  }, []);

  // Démarrer le suivi de progression
  const startProgressTracking = useCallback((duration) => {
    setProgress(0);
    setCurrentTime(0);
    setEstimatedDuration(duration);
    startTimeRef.current = Date.now();

    progressIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(progressPercent);
      setCurrentTime(elapsed);

      if (progressPercent >= 100) {
        clearInterval(progressIntervalRef.current);
      }
    }, 100);
  }, []);

  // Arrêter le suivi de progression
  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(0);
    setCurrentTime(0);
  }, []);

  // Fonction principale de synthèse vocale
  const speakText = useCallback(async (text, messageId, language = null) => {
    // Si déjà en train de parler ce message, l'arrêter
    if (isSpeaking[messageId]) {
      stopSpeech();
      return;
    }

    try {
      // Nettoyer les états précédents
      setError(null);
      
      // Détecter la langue si non spécifiée
      const finalLanguage = language || detectLanguage(text) || currentLanguage;
      setDetectedLanguage(finalLanguage);
      setCurrentText(text);
      setCurrentSpeakingId(messageId);

      // Estimer la durée
      const duration = estimateReadingDuration(text, finalLanguage);

      // Définir l'état de chargement
      setIsLoading(prev => ({ ...prev, [messageId]: true }));

      console.group(`🎙️ TTS STATE MANAGER - ${finalLanguage.toUpperCase()}`);
      console.log(`📝 Message ID: ${messageId}`);
      console.log(`🌐 Language: ${finalLanguage}`);
      console.log(`⏱️ Estimated duration: ${duration}s`);

      // Utiliser ElevenLabs TTS avec callbacks d'état
      await speechService.textToSpeech(text, finalLanguage, {
        speed: 0.9,
        pitch: 1.0,
        volume: 1.0,
        autoDetect: true,
        onStateChange: (state, errorMessage) => {
          console.log(`🎙️ TTS State: ${state}`, errorMessage ? `Error: ${errorMessage}` : '');
          
          switch (state) {
            case 'loading':
              setIsLoading(prev => ({ ...prev, [messageId]: true }));
              setIsSpeaking(prev => ({ ...prev, [messageId]: false }));
              break;
              
            case 'speaking':
              setIsLoading(prev => ({ ...prev, [messageId]: false }));
              setIsSpeaking(prev => ({ ...prev, [messageId]: true }));
              startProgressTracking(duration);
              break;
              
            case 'completed':
              setIsLoading(prev => ({ ...prev, [messageId]: false }));
              setIsSpeaking(prev => ({ ...prev, [messageId]: false }));
              setCurrentSpeakingId(null);
              stopProgressTracking();
              break;
              
            case 'error':
              setIsLoading(prev => ({ ...prev, [messageId]: false }));
              setIsSpeaking(prev => ({ ...prev, [messageId]: false }));
              setCurrentSpeakingId(null);
              setError(errorMessage || 'Erreur TTS inconnue');
              stopProgressTracking();
              break;
          }
        }
      });

      console.log('✅ ElevenLabs TTS completed successfully');
      console.groupEnd();
      
    } catch (error) {
      console.error('❌ ElevenLabs TTS error:', error);
      console.error('🔍 Error stack:', error.stack);

      // Nettoyer les états en cas d'erreur
      setIsLoading(prev => ({ ...prev, [messageId]: false }));
      setIsSpeaking(prev => ({ ...prev, [messageId]: false }));
      setCurrentSpeakingId(null);
      setError(error.message || 'Erreur de synthèse vocale');
      stopProgressTracking();

      // Message d'erreur localisé
      const errorMessage = finalLanguage === 'ar'
        ? 'خطأ في تشغيل الصوت - تحقق من الاتصال بالإنترنت'
        : 'Erreur de synthèse vocale - vérifiez votre connexion internet';

      console.warn(`⚠️ ${errorMessage}`);
      console.groupEnd();
    }
  }, [isSpeaking, currentLanguage, detectLanguage, estimateReadingDuration, startProgressTracking, stopProgressTracking]);

  // Arrêter la synthèse vocale
  const stopSpeech = useCallback(() => {
    try {
      speechService.stopSpeech();
      
      // Nettoyer tous les états
      setIsSpeaking({});
      setIsLoading({});
      setCurrentSpeakingId(null);
      setCurrentText('');
      setError(null);
      stopProgressTracking();
      
      console.log('🛑 TTS stopped');
    } catch (error) {
      console.error('❌ Error stopping TTS:', error);
    }
  }, [stopProgressTracking]);

  // Vérifier si un message spécifique est en cours de lecture
  const isMessageSpeaking = useCallback((messageId) => {
    return !!isSpeaking[messageId];
  }, [isSpeaking]);

  // Vérifier si un message spécifique est en cours de chargement
  const isMessageLoading = useCallback((messageId) => {
    return !!isLoading[messageId];
  }, [isLoading]);

  // Obtenir le statut d'un message
  const getMessageStatus = useCallback((messageId) => {
    if (isLoading[messageId]) return 'loading';
    if (isSpeaking[messageId]) return 'speaking';
    return 'idle';
  }, [isLoading, isSpeaking]);

  // Vérifier si le TTS est supporté
  const isSupported = useCallback(() => {
    return speechService.getAvailableServices().tts.elevenlabs || 
           speechService.getAvailableServices().tts.browser;
  }, []);

  // Obtenir les informations sur le TTS actuel
  const getCurrentTTSInfo = useCallback(() => {
    return {
      messageId: currentSpeakingId,
      text: currentText,
      language: detectedLanguage,
      progress,
      estimatedDuration,
      currentTime,
      isActive: !!currentSpeakingId
    };
  }, [currentSpeakingId, currentText, detectedLanguage, progress, estimatedDuration, currentTime]);

  return {
    // États
    isSpeaking,
    isLoading,
    currentSpeakingId,
    currentText,
    detectedLanguage,
    error,
    progress,
    estimatedDuration,
    currentTime,
    
    // Fonctions
    speakText,
    stopSpeech,
    isMessageSpeaking,
    isMessageLoading,
    getMessageStatus,
    isSupported,
    getCurrentTTSInfo,
    detectLanguage,
    
    // Utilitaires
    clearError: () => setError(null)
  };
};
