/**
 * Enhanced Speech Service - High-quality TTS and STT for multiple languages
 * Supports French, English, and Arabic with premium APIs
 */

import axios from 'axios';

class SpeechService {
  constructor() {
    // API Configuration
    this.elevenLabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    this.azureSpeechKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
    this.azureSpeechRegion = import.meta.env.VITE_AZURE_SPEECH_REGION || 'eastus';
    this.googleCloudApiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    // Voice configurations for different languages
    this.voiceConfig = {
      fr: {
        elevenlabs: 'pNInz6obpgDQGcFmaJgB', // French voice ID
        azure: 'fr-FR-DeniseNeural',
        google: 'fr-FR-Wavenet-C',
        fallback: 'fr-FR'
      },

      ar: {
        elevenlabs: 'pNInz6obpgDQGcFmaJgB', // Multilingual voice that supports Arabic
        azure: 'ar-SA-ZariyahNeural', // Best Arabic female voice
        google: 'ar-XA-Wavenet-A', // High quality Arabic voice
        openai: 'nova', // OpenAI's multilingual voice
        fallback: 'ar-SA'
      }
    };

    // Initialize speech recognition
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
   * Convert text to speech using the best available service
   * @param {string} text - Text to convert
   * @param {string} language - Language code (fr, en, ar)
   * @param {Object} options - Additional options
   * @returns {Promise<void>}
   */
  async textToSpeech(text, language = 'fr', options = {}) {
    const {
      speed = 1.0,
      pitch = 1.0,
      volume = 1.0,
      quality = 'high'
    } = options;

    console.log(`🔊 TTS Request: ${text.substring(0, 50)}... (${language})`);

    try {
      // Try eSpeak NG first for Arabic and French (as per user preference)
      if (language === 'ar' || language === 'fr') {
        try {
          await this.eSpeakTTS(text, language, options);
          return;
        } catch (error) {
          console.warn('⚠️ eSpeak NG failed, trying premium services:', error.message);
        }
      }

      // Try premium services for high quality
      if (quality === 'high') {
        // For Arabic, prioritize Azure and OpenAI
        if (language === 'ar') {
          // Try Azure first (best Arabic support)
          if (this.azureSpeechKey) {
            try {
              await this.azureTTS(text, language, options);
              return;
            } catch (error) {
              console.warn('⚠️ Azure TTS failed, trying OpenAI:', error.message);
            }
          }

          // Try OpenAI TTS (excellent multilingual support)
          if (this.openaiApiKey) {
            try {
              await this.openaiTTS(text, language, options);
              return;
            } catch (error) {
              console.warn('⚠️ OpenAI TTS failed, trying Google:', error.message);
            }
          }

          // Try Google Cloud TTS
          if (this.googleCloudApiKey) {
            try {
              await this.googleTTS(text, language, options);
              return;
            } catch (error) {
              console.warn('⚠️ Google TTS failed, trying ElevenLabs:', error.message);
            }
          }

          // Try ElevenLabs as last resort for Arabic
          if (this.elevenLabsApiKey) {
            try {
              await this.elevenLabsTTS(text, language, options);
              return;
            } catch (error) {
              console.warn('⚠️ ElevenLabs TTS failed, using browser TTS:', error.message);
            }
          }
        } else {
          // For French and English, prioritize ElevenLabs
          if (this.elevenLabsApiKey) {
            try {
              await this.elevenLabsTTS(text, language, options);
              return;
            } catch (error) {
              console.warn('⚠️ ElevenLabs TTS failed, trying Azure:', error.message);
            }
          }

          // Try Azure Cognitive Services
          if (this.azureSpeechKey) {
            try {
              await this.azureTTS(text, language, options);
              return;
            } catch (error) {
              console.warn('⚠️ Azure TTS failed, trying OpenAI:', error.message);
            }
          }

          // Try OpenAI TTS
          if (this.openaiApiKey) {
            try {
              await this.openaiTTS(text, language, options);
              return;
            } catch (error) {
              console.warn('⚠️ OpenAI TTS failed, trying Google:', error.message);
            }
          }

          // Try Google Cloud TTS
          if (this.googleCloudApiKey) {
            try {
              await this.googleTTS(text, language, options);
              return;
            } catch (error) {
              console.warn('⚠️ Google TTS failed, using browser TTS:', error.message);
            }
          }
        }
      }

      // Fallback to browser's built-in TTS
      await this.browserTTS(text, language, { speed, pitch, volume });
      
    } catch (error) {
      console.error('❌ All TTS services failed:', error);
      throw new Error('Text-to-speech service unavailable');
    }
  }

  /**
   * ElevenLabs TTS (Premium quality for English and French)
   */
  async elevenLabsTTS(text, language, options = {}) {
    const voiceId = this.voiceConfig[language]?.elevenlabs;
    if (!voiceId) {
      throw new Error(`ElevenLabs voice not available for ${language}`);
    }

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.elevenLabsApiKey
        },
        responseType: 'arraybuffer'
      }
    );

    const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
    await this.playAudioBlob(audioBlob);
  }

  /**
   * Azure Cognitive Services TTS
   */
  async azureTTS(text, language, options = {}) {
    const voice = this.voiceConfig[language]?.azure;
    if (!voice) {
      throw new Error(`Azure voice not available for ${language}`);
    }

    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${language}">
        <voice name="${voice}">
          <prosody rate="${options.speed || 1.0}" pitch="${options.pitch || 1.0}">
            ${text}
          </prosody>
        </voice>
      </speak>
    `;

    const response = await axios.post(
      `https://${this.azureSpeechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
      ssml,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': this.azureSpeechKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
        },
        responseType: 'arraybuffer'
      }
    );

    const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
    await this.playAudioBlob(audioBlob);
  }

  /**
   * OpenAI TTS (Excellent for Arabic and multilingual)
   */
  async openaiTTS(text, language, options = {}) {
    const voice = this.voiceConfig[language]?.openai || 'nova';

    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1-hd', // High quality model
        input: text,
        voice: voice,
        speed: options.speed || 0.9 // Slightly slower for better clarity
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
    await this.playAudioBlob(audioBlob);
  }

  /**
   * Google Cloud TTS
   */
  async googleTTS(text, language, options = {}) {
    const voice = this.voiceConfig[language]?.google;
    if (!voice) {
      throw new Error(`Google voice not available for ${language}`);
    }

    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.googleCloudApiKey}`,
      {
        input: { text },
        voice: {
          languageCode: language === 'ar' ? 'ar-XA' : language === 'fr' ? 'fr-FR' : 'en-US',
          name: voice,
          ssmlGender: 'FEMALE'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: options.speed || 1.0,
          pitch: (options.pitch || 1.0) * 2 - 2 // Convert to Google's range
        }
      }
    );

    const audioContent = response.data.audioContent;
    const audioBlob = new Blob([
      Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))
    ], { type: 'audio/mpeg' });
    
    await this.playAudioBlob(audioBlob);
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
          utterance.lang = this.voiceConfig[language]?.fallback || language;
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
   * eSpeak NG TTS (User preferred for Arabic and French)
   */
  async eSpeakTTS(text, language, options = {}) {
    try {
      // Check if eSpeak NG is available (requires server-side implementation)
      const eSpeakEndpoint = import.meta.env.VITE_ESPEAK_API_URL || 'http://localhost:8002/espeak';

      const response = await axios.post(eSpeakEndpoint, {
        text: text,
        language: language,
        speed: options.speed || 1.0,
        pitch: options.pitch || 1.0,
        volume: options.volume || 1.0,
        voice: language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'
      }, {
        responseType: 'arraybuffer',
        timeout: 10000
      });

      const audioBlob = new Blob([response.data], { type: 'audio/wav' });
      await this.playAudioBlob(audioBlob);

      console.log('✅ eSpeak NG TTS completed successfully');

    } catch (error) {
      console.error('❌ eSpeak NG TTS failed:', error.message);

      // Fallback to browser TTS with eSpeak-like settings
      console.log('🔄 Falling back to browser TTS with eSpeak-like configuration');
      await this.browserTTSWitheSpeakConfig(text, language, options);
    }
  }

  /**
   * Browser TTS with eSpeak-like configuration
   */
  async browserTTSWitheSpeakConfig(text, language, options = {}) {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // eSpeak-like configuration
      if (language === 'ar') {
        utterance.lang = 'ar-SA';
        utterance.rate = options.speed || 0.7; // Slower for Arabic clarity
        utterance.pitch = options.pitch || 0.9; // Lower pitch for Arabic
      } else if (language === 'fr') {
        utterance.lang = 'fr-FR';
        utterance.rate = options.speed || 0.8; // Moderate speed for French
        utterance.pitch = options.pitch || 1.0; // Standard pitch for French
      } else {
        utterance.lang = language;
        utterance.rate = options.speed || 0.9;
        utterance.pitch = options.pitch || 1.0;
      }

      utterance.volume = options.volume || 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      speechSynthesis.cancel();
      setTimeout(() => speechSynthesis.speak(utterance), 100);
    });
  }

  /**
   * Play audio blob
   */
  async playAudioBlob(blob) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(blob);

      audio.src = url;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.onerror = (error) => {
        URL.revokeObjectURL(url);
        reject(error);
      };

      audio.play().catch(reject);
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

      this.recognition.lang = this.voiceConfig[language]?.fallback || language;
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
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  /**
   * Check if speech services are available
   */
  getAvailableServices() {
    return {
      tts: {
        elevenlabs: !!this.elevenLabsApiKey,
        azure: !!this.azureSpeechKey,
        google: !!this.googleCloudApiKey,
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
