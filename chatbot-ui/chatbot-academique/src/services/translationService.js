/**
 * Translation Service for SMA Results
 * Handles automatic translation of scraped content to match user's interface language
 * Optimized for cost-effective translation with caching
 */

class TranslationService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    
    // Language detection patterns
    this.languagePatterns = {
      ar: /[\u0600-\u06FF]/,
      fr: /\b(le|la|les|de|du|des|et|est|dans|pour|avec|sur|par|une|un|ce|cette|qui|que|où|comment|pourquoi|formation|école|université|étudiant|module|cours|programme)\b/i,

    };

    // Simple translation dictionaries for common ENIAD/UMP terms
    this.translations = {
      'fr_to_ar': {
        'École Nationale de l\'Intelligence Artificielle et Digitale': 'المدرسة الوطنية للذكاء الاصطناعي والرقمي',
        'ENIAD': 'إنياد',
        'Université Mohammed Premier': 'جامعة محمد الأول',
        'UMP': 'جامعة محمد الأول',
        'formation': 'تكوين',
        'formations': 'تكوينات',
        'module': 'وحدة',
        'modules': 'وحدات',
        'cours': 'درس',
        'programme': 'برنامج',
        'étudiant': 'طالب',
        'étudiants': 'طلاب',
        'intelligence artificielle': 'الذكاء الاصطناعي',
        'apprentissage automatique': 'التعلم الآلي',
        'réseaux de neurones': 'الشبكات العصبية',
        'traitement du langage naturel': 'معالجة اللغة الطبيعية',
        'vision par ordinateur': 'الرؤية الحاسوبية',
        'science des données': 'data science',
        'sécurité informatique': 'الأمن السيبراني',
        'développement web': 'تطوير الويب',
        'base de données': 'قاعدة البيانات',
        'algorithme': 'خوارزمية',
        'algorithmes': 'خوارزميات'
      },


      'ar_to_fr': {
        'المدرسة الوطنية للذكاء الاصطناعي والرقمي': 'École Nationale de l\'Intelligence Artificielle et Digitale',
        'إنياد': 'ENIAD',
        'جامعة محمد الأول': 'Université Mohammed Premier',
        'الذكاء الاصطناعي': 'intelligence artificielle',
        'التعلم الآلي': 'apprentissage automatique',
        'الشبكات العصبية': 'réseaux de neurones',
        'معالجة اللغة الطبيعية': 'traitement du langage naturel',
        'رؤية الحاسوب': 'vision par ordinateur',
        'علم البيانات': 'science des données',
        'الأمن السيبراني': 'sécurité informatique',
        'تطوير الويب': 'développement web',
        'قاعدة البيانات': 'base de données',
        'خوارزمية': 'algorithme',
        'خوارزميات': 'algorithmes',
        'طالب': 'étudiant',
        'طلاب': 'étudiants',
        'دورة': 'cours',
        'برنامج': 'programme',
        'وحدة': 'module',
        'وحدات': 'modules',
        'تكوين': 'formation'
      },

    };
  }

  /**
   * Detect the language of a text
   * @param {string} text - Text to analyze
   * @returns {string} Language code (ar, fr)
   */
  detectLanguage(text) {
    if (!text || typeof text !== 'string') return 'fr';

    const cleanText = text.toLowerCase().trim();

    // Check for Arabic characters
    if (this.languagePatterns.ar.test(text)) {
      return 'ar';
    }

    // Check for French indicators
    if (this.languagePatterns.fr.test(cleanText)) {
      return 'fr';
    }

    // Default to French for ENIAD context
    return 'fr';
  }

  /**
   * Get cache key for translation
   * @param {string} text - Text to translate
   * @param {string} fromLang - Source language
   * @param {string} toLang - Target language
   * @returns {string} Cache key
   */
  getCacheKey(text, fromLang, toLang) {
    return `${fromLang}_${toLang}_${text.substring(0, 100)}`;
  }

  /**
   * Check if cache entry is valid
   * @param {Object} entry - Cache entry
   * @returns {boolean} Is valid
   */
  isCacheValid(entry) {
    return entry && (Date.now() - entry.timestamp) < this.cacheExpiry;
  }

  /**
   * Simple dictionary-based translation
   * @param {string} text - Text to translate
   * @param {string} fromLang - Source language
   * @param {string} toLang - Target language
   * @returns {string} Translated text
   */
  translateWithDictionary(text, fromLang, toLang) {
    const dictKey = `${fromLang}_to_${toLang}`;
    const dictionary = this.translations[dictKey];
    
    if (!dictionary) return text;
    
    let translatedText = text;
    
    // Sort by length (longest first) to avoid partial replacements
    const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      translatedText = translatedText.replace(regex, dictionary[key]);
    }
    
    return translatedText;
  }

  /**
   * Translate SMA results to target language
   * @param {Object} smaResults - SMA search results
   * @param {string} targetLanguage - Target language (fr, ar)
   * @returns {Object} Translated SMA results
   */
  async translateSMAResults(smaResults, targetLanguage = 'fr') {
    if (!smaResults || !smaResults.results || !Array.isArray(smaResults.results)) {
      return smaResults;
    }

    console.log(`🌐 Translating SMA results to ${targetLanguage}...`);

    const translatedResults = await Promise.all(
      smaResults.results.map(async (result) => {
        try {
          // Detect source language
          const titleLang = this.detectLanguage(result.title || '');
          const contentLang = this.detectLanguage(result.content || result.summary || '');
          
          // Skip translation if already in target language
          if (titleLang === targetLanguage && contentLang === targetLanguage) {
            return result;
          }

          // Create cache key
          const cacheKey = this.getCacheKey(
            (result.title || '') + (result.content || result.summary || ''),
            titleLang,
            targetLanguage
          );

          // Check cache
          const cached = this.cache.get(cacheKey);
          if (this.isCacheValid(cached)) {
            console.log('📋 Using cached translation');
            return cached.result;
          }

          // Translate title
          let translatedTitle = result.title || '';
          if (titleLang !== targetLanguage) {
            translatedTitle = this.translateWithDictionary(result.title || '', titleLang, targetLanguage);
          }

          // Translate content
          let translatedContent = result.content || result.summary || '';
          if (contentLang !== targetLanguage) {
            translatedContent = this.translateWithDictionary(translatedContent, contentLang, targetLanguage);
          }

          const translatedResult = {
            ...result,
            title: translatedTitle,
            content: translatedContent,
            summary: translatedContent,
            originalLanguage: titleLang,
            translatedTo: targetLanguage
          };

          // Cache the result
          this.cache.set(cacheKey, {
            result: translatedResult,
            timestamp: Date.now()
          });

          return translatedResult;
        } catch (error) {
          console.warn('⚠️ Translation failed for result:', error);
          return result; // Return original on error
        }
      })
    );

    return {
      ...smaResults,
      results: translatedResults,
      translatedTo: targetLanguage,
      translationTimestamp: Date.now()
    };
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isCacheValid(entry)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    this.clearExpiredCache();
    return {
      size: this.cache.size,
      maxAge: this.cacheExpiry,
      entries: Array.from(this.cache.keys()).slice(0, 5) // First 5 keys for debugging
    };
  }
}

// Create singleton instance
const translationService = new TranslationService();

export default translationService;
