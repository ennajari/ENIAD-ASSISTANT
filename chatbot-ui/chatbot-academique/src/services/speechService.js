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
    
    // Voice configurations for different languages
    this.voiceConfig = {
      fr: {
        elevenlabs: 'pNInz6obpgDQGcFmaJgB', // French voice ID
        azure: 'fr-FR-DeniseNeural',
        google: 'fr-FR-Wavenet-C',
        fallback: 'fr-FR'
      },
      en: {
        elevenlabs: 'EXAVITQu4vr4xnSDxMaL', // English voice ID
        azure: 'en-US-AriaNeural',
        google: 'en-US-Wavenet-F',
        fallback: 'en-US'
      },
      ar: {
        elevenlabs: null, // ElevenLabs doesn't support Arabic well
        azure: 'ar-SA-ZariyahNeural',
        google: 'ar-XA-Wavenet-A',
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
      // Try premium services first for high quality
      if (quality === 'high') {
        // Try ElevenLabs for English and French
        if ((language === 'en' || language === 'fr') && this.elevenLabsApiKey) {
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
            console.warn('⚠️ Azure TTS failed, trying Google:', error.message);
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

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.voiceConfig[language]?.fallback || language;
      utterance.rate = options.speed || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Try to find a voice for the language
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => 
        v.lang.toLowerCase().startsWith(language.toLowerCase())
      );
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      speechSynthesis.speak(utterance);
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
