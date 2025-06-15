/**
 * Gemini API Service
 * Temporary fallback service for testing while Modal API is unavailable
 */

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDIDbm8CcUxtTTW3omJcOHQj1BWcmRWeYc';
    this.modelName = import.meta.env.VITE_MODEL_NAME || 'gemini-1.5-flash';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    this.maxTokens = parseInt(import.meta.env.VITE_MAX_TOKENS) || 400;
    this.temperature = parseFloat(import.meta.env.VITE_TEMPERATURE) || 0.7;
    
    if (!this.apiKey) {
      console.warn('⚠️ Gemini API key not found in environment variables');
    }
    
    console.log('🤖 Gemini Service initialized:', {
      model: this.modelName,
      maxTokens: this.maxTokens,
      temperature: this.temperature,
      hasApiKey: !!this.apiKey
    });
  }

  /**
   * Generate chat completion using Gemini API
   * @param {Array} messages - Chat messages
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Response object
   */
  async generateChatCompletion(messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      console.log('🚀 Sending request to Gemini API...');
      
      // Convert messages to Gemini format
      const geminiMessages = this.convertMessagesToGeminiFormat(messages);
      
      const requestBody = {
        contents: geminiMessages,
        generationConfig: {
          temperature: options.temperature || this.temperature,
          maxOutputTokens: options.maxTokens || this.maxTokens,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(
        `${this.baseURL}/models/${this.modelName}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API Error (${response.status}): ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Gemini API response received');

      // Convert Gemini response to OpenAI-compatible format
      return this.convertGeminiResponseToOpenAI(data);

    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      throw this.handleGeminiError(error);
    }
  }

  /**
   * Convert OpenAI-style messages to Gemini format
   * @param {Array} messages - OpenAI format messages
   * @returns {Array} Gemini format contents
   */
  convertMessagesToGeminiFormat(messages) {
    const geminiContents = [];
    
    for (const message of messages) {
      if (message.role === 'system') {
        // Add system message as user message with instruction prefix
        geminiContents.push({
          role: 'user',
          parts: [{ text: `Instructions: ${message.content}` }]
        });
      } else if (message.role === 'user') {
        geminiContents.push({
          role: 'user',
          parts: [{ text: message.content }]
        });
      } else if (message.role === 'assistant') {
        geminiContents.push({
          role: 'model',
          parts: [{ text: message.content }]
        });
      }
    }
    
    return geminiContents;
  }

  /**
   * Convert Gemini response to OpenAI-compatible format
   * @param {Object} geminiResponse - Gemini API response
   * @returns {Object} OpenAI-compatible response
   */
  convertGeminiResponseToOpenAI(geminiResponse) {
    const candidate = geminiResponse.candidates?.[0];
    const content = candidate?.content?.parts?.[0]?.text || '';
    
    return {
      choices: [
        {
          message: {
            role: 'assistant',
            content: content
          },
          finish_reason: candidate?.finishReason === 'STOP' ? 'stop' : 'length'
        }
      ],
      usage: {
        prompt_tokens: geminiResponse.usageMetadata?.promptTokenCount || 0,
        completion_tokens: geminiResponse.usageMetadata?.candidatesTokenCount || 0,
        total_tokens: geminiResponse.usageMetadata?.totalTokenCount || 0
      },
      model: this.modelName,
      provider: 'gemini'
    };
  }

  /**
   * Handle Gemini API errors
   * @param {Error} error - Original error
   * @returns {Error} Formatted error
   */
  handleGeminiError(error) {
    if (error.message.includes('API key')) {
      return new Error('Gemini API key is invalid or missing');
    } else if (error.message.includes('quota')) {
      return new Error('Gemini API quota exceeded. Please try again later.');
    } else if (error.message.includes('429')) {
      return new Error('Rate limit exceeded. Please wait a moment before trying again.');
    } else if (error.message.includes('400')) {
      return new Error('Invalid request format. Please try rephrasing your question.');
    } else if (error.message.includes('403')) {
      return new Error('Access denied. Please check your API permissions.');
    } else if (error.message.includes('500')) {
      return new Error('Gemini service temporarily unavailable. Please try again.');
    } else {
      return new Error(`Gemini API Error: ${error.message}`);
    }
  }

  /**
   * Test API connection
   * @returns {Promise<Object>} Test result
   */
  async testConnection() {
    try {
      console.log('🧪 Testing Gemini API connection...');
      
      const testMessages = [
        { role: 'user', content: 'Hello, please respond with "API connection successful"' }
      ];
      
      const response = await this.generateChatCompletion(testMessages, {
        maxTokens: 50,
        temperature: 0.1
      });
      
      console.log('✅ Gemini API connection test successful');
      return {
        success: true,
        message: 'Gemini API connection successful',
        model: this.modelName,
        response: response.choices[0].message.content
      };
      
    } catch (error) {
      console.error('❌ Gemini API connection test failed:', error);
      return {
        success: false,
        message: error.message,
        model: this.modelName
      };
    }
  }

  /**
   * Get service status
   * @returns {Object} Service status
   */
  getStatus() {
    return {
      service: 'Gemini',
      model: this.modelName,
      configured: !!this.apiKey,
      maxTokens: this.maxTokens,
      temperature: this.temperature,
      baseURL: this.baseURL
    };
  }
}

// Create and export singleton instance
const geminiService = new GeminiService();
export default geminiService;
