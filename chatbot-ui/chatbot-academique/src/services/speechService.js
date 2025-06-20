/**
 * Enhanced Speech Service - High-quality TTS and STT for multiple languages
 * Supports French, English, and Arabic with premium APIs
 */

import axios from 'axios';

class SpeechService {
  constructor() {
    // API Configuration - ElevenLabs only
    this.elevenLabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

    // Audio state
    this.currentAudio = null;

    // Initialize speech recognition for STT
    this.recognition = null;
    this.initializeSpeechRecognition();
  }

  /**
   * Initialize Web Speech API for speech recognition
   */
  initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      
      console.log('✅ Speech recognition initialized');
    } else {
      console.warn('⚠️ Speech recognition not supported in this browser');
    }
  }

  /**
   * Detect language from text content
   */
  detectLanguage(text) {
    if (!text) return 'fr';

    // Arabic detection
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    if (arabicRegex.test(text)) {
      return 'ar';
    }

    // French detection (common French words and accents)
    const frenchRegex = /[àâäéèêëïîôöùûüÿç]|(\b(le|la|les|un|une|des|et|ou|est|sont|avec|pour|dans|sur|par|de|du|que|qui|quoi|comment|pourquoi|où|quand)\b)/i;
    if (frenchRegex.test(text)) {
      return 'fr';
    }

    // Default to French
    return 'fr';
  }

  /**
   * Convert text to speech using the best available service
   * @param {string} text - Text to convert
   * @param {string} language - Language code (fr, en, ar)
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async textToSpeech(text, language = 'fr', options = {}) {
    if (!text || text.trim().length === 0) {
      throw new Error('No text provided for speech synthesis');
    }

    // Auto-detect language if not specified or if detection is enabled
    const detectedLanguage = options.autoDetect !== false ? this.detectLanguage(text) : language;
    const finalLanguage = detectedLanguage || language;

    const {
      speed = 1.0,
      pitch = 1.0,
      volume = 1.0,
      quality = 'high'
    } = options;

    console.group(`🎙️ TTS REQUEST - ${finalLanguage.toUpperCase()}`);
    console.log(`📝 Text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
    console.log(`🌐 Language: ${finalLanguage} (detected: ${detectedLanguage})`);
    console.log(`⚙️ Options:`, { speed, pitch, volume, quality });
    console.groupEnd();

    // Emit loading state if callback provided
    if (options.onStateChange) {
      options.onStateChange('loading');
    }

    // Forcer ElevenLabs uniquement
    if (!this.elevenLabsApiKey) {
      const errMsg = 'Aucune clé API ElevenLabs trouvée. Veuillez configurer VITE_ELEVENLABS_API_KEY.';
      if (options.onStateChange) options.onStateChange('error', errMsg);
      throw new Error(errMsg);
    }
    try {
      await this.elevenLabsTTS(text, finalLanguage, options);
      if (options.onStateChange) options.onStateChange('completed');
      return;
    } catch (error) {
      if (options.onStateChange) options.onStateChange('error', error.message);
      throw new Error('Text-to-speech ElevenLabs indisponible : ' + error.message);
    }
  }

  /**
   * ElevenLabs TTS (Premium quality for multilingual)
   */
  async elevenLabsTTS(text, language, options = {}) {
    try {
      console.group(`🎙️ ELEVENLABS TTS - ${language.toUpperCase()}`);
      // Configuration des voix par langue
      const voiceConfig = {
        'fr': 'JBFqnCBsd6RMkjVDRZzb', // Voix française de qualité
        'ar': 'JBFqnCBsd6RMkjVDRZzb', // Même voix multilingue pour l'arabe
        'en': 'JBFqnCBsd6RMkjVDRZzb'  // Voix anglaise
      };
      const voiceId = voiceConfig[language] || voiceConfig['en'];
      console.log(`🎤 Voice ID: ${voiceId}`);
      console.log(`🔧 Model: eleven_multilingual_v2`);

      // Nettoyer le texte (supprimer les astérisques et autres caractères de formatage)
      const cleanText = text.replace(/\*/g, '').replace(/[#*_`]/g, '').trim();

      if (!cleanText) {
        throw new Error('No text to synthesize after cleaning');
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.elevenLabsApiKey
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.0,
              use_speaker_boost: true
            }
          })
        }
      );

      console.log(`📡 API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`❌ ElevenLabs API Error: ${errorBody}`);
        console.groupEnd();
        throw new Error(`ElevenLabs API failed with status ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const sizeKB = Math.round(audioBuffer.byteLength / 1024);
      console.log(`📦 Audio received: ${sizeKB}KB (${audioBuffer.byteLength} bytes)`);

      if (audioBuffer.byteLength === 0) {
        console.error('❌ Empty audio buffer received');
        console.groupEnd();
        throw new Error('Received empty audio buffer from ElevenLabs');
      }

      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      console.log('🔊 Playing audio...');
      await this.playAudioBlob(audioBlob);

      console.log('✅ ElevenLabs TTS completed successfully');
      console.groupEnd();

    } catch (error) {
      console.error('❌ ElevenLabs TTS failed:', error.message);
      console.error('🔍 Error details:', error);
      console.groupEnd();
      throw error;
    }
  }

  /**
   * Play audio blob
   */
  async playAudioBlob(blob) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(blob);

      // Stocker la référence audio pour pouvoir l'arrêter
      this.currentAudio = audio;

      audio.src = url;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        this.currentAudio = null;
        resolve();
      };
      audio.onerror = (error) => {
        URL.revokeObjectURL(url);
        this.currentAudio = null;
        reject(error);
      };

      audio.play().catch((error) => {
        this.currentAudio = null;
        reject(error);
      });
    });
  }

  /**
   * Speech to text using Web Speech API
   * @param {string} language - Language code
   * @param {Object} options - Recognition options
   * @returns {Promise<string>} Recognized text
   */
  async speechToText(language = 'fr', options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const {
        continuous = false,
        interimResults = true,
        maxAlternatives = 1,
        timeout = 10000
      } = options;

      this.recognition.lang = language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : language;
      this.recognition.continuous = continuous;
      this.recognition.interimResults = interimResults;
      this.recognition.maxAlternatives = maxAlternatives;

      let finalTranscript = '';
      let timeoutId;

      this.recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
        timeoutId = setTimeout(() => {
          this.recognition.stop();
          reject(new Error('Speech recognition timeout'));
        }, timeout);
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          clearTimeout(timeoutId);
          resolve(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event) => {
        clearTimeout(timeoutId);
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        clearTimeout(timeoutId);
        if (!finalTranscript) {
          reject(new Error('No speech detected'));
        }
      };

      this.recognition.start();
    });
  }

  /**
   * Stop current speech synthesis
   */
  stopSpeech() {
    try {
      // Arrêter le TTS du navigateur
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        console.log('🛑 Browser TTS stopped');
      }

      // Arrêter l'audio ElevenLabs si en cours
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
        console.log('🛑 ElevenLabs audio stopped');
      }

      console.log('🛑 All TTS services stopped');
    } catch (error) {
      console.error('❌ Error stopping TTS:', error);
    }
  }

  /**
   * Check if speech services are available
   */
  getAvailableServices() {
    return {
      tts: {
        elevenlabs: !!this.elevenLabsApiKey,
        browser: 'speechSynthesis' in window
      },
      stt: {
        browser: !!this.recognition
      }
    };
  }
}

// Create singleton instance
const speechService = new SpeechService();

export default speechService;
