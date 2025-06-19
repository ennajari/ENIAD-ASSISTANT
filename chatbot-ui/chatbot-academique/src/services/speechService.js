/**
 * Enhanced Speech Service - High-quality TTS and STT for multiple languages
 * Supports French, English, and Arabic with premium APIs
 */

import axios from 'axios';

class SpeechService {
  constructor() {
    // API Configuration - ElevenLabs only
    this.elevenLabsApiKey = 'sk_d8fc9625fbfd20f51143215781f41238b0f80986af1648ef';

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

    try {
      // Priority 1: Try ElevenLabs TTS for best quality (if API key available)
      if (this.elevenLabsApiKey && (finalLanguage === 'ar' || finalLanguage === 'fr' || finalLanguage === 'en')) {
        try {
          if (options.onStateChange) {
            options.onStateChange('speaking');
          }
          await this.elevenLabsTTS(text, finalLanguage, options);
          if (options.onStateChange) {
            options.onStateChange('completed');
          }
          return;
        } catch (error) {
          console.warn('⚠️ ElevenLabs TTS failed, trying other services:', error.message);
          if (options.onStateChange) {
            options.onStateChange('error', error.message);
          }
        }
      }

      // Priority 2: Fallback to browser's built-in TTS
      console.log('🔄 Falling back to browser TTS');
      if (options.onStateChange) {
        options.onStateChange('speaking');
      }
      await this.browserTTS(text, finalLanguage, { speed, pitch, volume });
      if (options.onStateChange) {
        options.onStateChange('completed');
      }
      
    } catch (error) {
      console.error('❌ All TTS services failed:', error);
      throw new Error('Text-to-speech service unavailable');
    }
  }

  /**
   * ElevenLabs TTS (Premium quality for multilingual)
   */
  async elevenLabsTTS(text, language, options = {}) {
    try {
      console.group(`🎙️ ELEVENLABS TTS - ${language.toUpperCase()}`);
      console.log(`🎤 Voice ID: ${voiceId}`);
      console.log(`🔧 Model: eleven_multilingual_v2`);

      // Configuration des voix par langue
      const voiceConfig = {
        'fr': 'JBFqnCBsd6RMkjVDRZzb', // Voix française de qualité
        'ar': 'JBFqnCBsd6RMkjVDRZzb', // Même voix multilingue pour l'arabe
        'en': 'JBFqnCBsd6RMkjVDRZzb'  // Voix anglaise
      };

      const voiceId = voiceConfig[language] || voiceConfig['en'];

      // Nettoyer le texte (supprimer les astérisques et autres caractères de formatage)
      const cleanText = text.replace(/\*/g, '').replace(/[#*_`]/g, '').trim();

      if (!cleanText) {
        throw new Error('No text to synthesize after cleaning');
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': 'sk_d8fc9625fbfd20f51143215781f41238b0f80986af1648ef'
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
      });

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
   * Browser built-in TTS (fallback)
   */
  async browserTTS(text, language, options = {}) {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Wait for voices to load if they haven't already
      const loadVoices = () => {
        const utterance = new SpeechSynthesisUtterance(text);

        // Set language based on the language parameter
        if (language === 'ar') {
          utterance.lang = 'ar-SA'; // Saudi Arabic
        } else if (language === 'fr') {
          utterance.lang = 'fr-FR'; // French
        } else {
          utterance.lang = language;
        }

        // Language-specific TTS optimization for better quality
        if (language === 'ar') {
          utterance.rate = options.speed || 0.8; // Slower for Arabic pronunciation
          utterance.pitch = options.pitch || 0.95; // Slightly lower pitch for Arabic
        } else if (language === 'fr') {
          utterance.rate = options.speed || 0.85; // Optimal speed for French
          utterance.pitch = options.pitch || 1.0; // Standard pitch for French
        } else {
          utterance.rate = options.speed || 0.9; // Default speed
          utterance.pitch = options.pitch || 1.0; // Default pitch
        }
        utterance.volume = options.volume || 1.0;

        // Try to find the best voice for the language
        const voices = speechSynthesis.getVoices();
        console.log('🔊 Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));

        let selectedVoice = null;

        if (language === 'ar') {
          // Debug: Log all available voices to understand what's available
          console.log('🔊 Available voices for Arabic detection:', voices.map(v => ({
            name: v.name,
            lang: v.lang,
            localService: v.localService
          })));

          // Look for Arabic voices with multiple patterns
          selectedVoice = voices.find(v =>
            v.lang.toLowerCase().includes('ar') ||
            v.name.toLowerCase().includes('arabic') ||
            v.lang.toLowerCase().startsWith('ar-') ||
            v.name.toLowerCase().includes('عربي') ||
            v.lang.includes('SA') || // Saudi Arabic
            v.lang.includes('EG') || // Egyptian Arabic
            v.lang.includes('AE') || // UAE Arabic
            v.lang.includes('MA') || // Moroccan Arabic
            v.name.toLowerCase().includes('zira') || // Microsoft Zira (often supports Arabic)
            v.name.toLowerCase().includes('naayf') // Microsoft Naayf (Arabic voice)
          );

          if (selectedVoice) {
            console.log('✅ Selected Arabic voice:', selectedVoice.name, '(', selectedVoice.lang, ')');
          } else {
            // Try to find any voice that might work with Arabic
            const fallbackVoice = voices.find(v =>
              v.lang.includes('en-US') || v.lang.includes('en-GB')
            );
            if (fallbackVoice) {
              selectedVoice = fallbackVoice;
              console.log('🔊 Using fallback voice for Arabic:', fallbackVoice.name);
            } else {
              console.log('🔊 No suitable voice found, using browser default for Arabic text');
            }
          }
        } else if (language === 'fr') {
          // Look for French voices with priority for high-quality voices
          selectedVoice = voices.find(v =>
            v.lang.toLowerCase().includes('fr') ||
            v.name.toLowerCase().includes('french') ||
            v.lang.toLowerCase().startsWith('fr-') ||
            v.name.toLowerCase().includes('marie') || // Microsoft Marie (French)
            v.name.toLowerCase().includes('hortense') || // Microsoft Hortense (French)
            v.name.toLowerCase().includes('paul') || // Microsoft Paul (French)
            v.lang.includes('FR') || // French France
            v.lang.includes('CA') // French Canada
          );

          if (selectedVoice) {
            console.log('✅ Selected French voice:', selectedVoice.name, '(', selectedVoice.lang, ')');
          } else {
            console.log('🔊 No French voice found, using default voice for French text');
          }
        } else {
          // Generic language matching
          selectedVoice = voices.find(v =>
            v.lang.toLowerCase().startsWith(language.toLowerCase())
          );
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log('✅ Using voice:', selectedVoice.name, 'for language:', language);
        }

        utterance.onstart = () => {
          console.log('🔊 TTS started for language:', language);
        };

        utterance.onend = () => {
          console.log('✅ TTS completed for language:', language);
          resolve();
        };

        utterance.onerror = (error) => {
          console.error('❌ TTS error:', error);
          reject(error);
        };

        // Cancel any ongoing speech before starting new one
        speechSynthesis.cancel();

        // Small delay to ensure cancellation is complete
        setTimeout(() => {
          speechSynthesis.speak(utterance);
        }, 100);
      };

      // Check if voices are already loaded
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        loadVoices();
      } else {
        // Wait for voices to load
        speechSynthesis.onvoiceschanged = loadVoices;
        // Fallback timeout in case onvoiceschanged doesn't fire
        setTimeout(loadVoices, 1000);
      }
    });
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
