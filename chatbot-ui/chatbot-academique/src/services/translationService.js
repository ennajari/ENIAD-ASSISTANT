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
      en: /\b(the|and|is|in|for|with|on|by|a|an|this|that|which|what|where|how|why|school|university|student|module|course|program|training)\b/i
    };

    // Simple translation dictionaries for common ENIAD/UMP terms
    this.translations = {
      'fr_to_en': {
        'École Nationale de l\'Intelligence Artificielle et Digitale': 'National School of Artificial Intelligence and Digital',
        'ENIAD': 'ENIAD',
        'Université Mohammed Premier': 'Mohammed First University',
        'UMP': 'UMP',
        'formation': 'training',
        'formations': 'programs',
        'module': 'module',
        'modules': 'modules',
        'cours': 'course',
        'programme': 'program',
        'étudiant': 'student',
        'étudiants': 'students',
        'intelligence artificielle': 'artificial intelligence',
        'apprentissage automatique': 'machine learning',
        'réseaux de neurones': 'neural networks',
        'traitement du langage naturel': 'natural language processing',
        'vision par ordinateur': 'computer vision',
        'science des données': 'data science',
        'sécurité informatique': 'cybersecurity',
        'développement web': 'web development',
        'base de données': 'database',
        'algorithme': 'algorithm',
        'algorithmes': 'algorithms'
      },
      'fr_to_ar': {
        'École Nationale de l\'Intelligence Artificielle et Digitale': 'المدرسة الوطنية للذكاء الاصطناعي والرقمي',
        'ENIAD': 'إنياد',
        'Université Mohammed Premier': 'جامعة محمد الأول',
        'UMP': 'جامعة محمد الأول',
        'formation': 'تكوين',
        'formations': 'برامج',
        'module': 'وحدة',
        'modules': 'وحدات',
        'cours': 'دورة',
        'programme': 'برنامج',
        'étudiant': 'طالب',
        'étudiants': 'طلاب',
        'intelligence artificielle': 'الذكاء الاصطناعي',
        'apprentissage automatique': 'التعلم الآلي',
        'réseaux de neurones': 'الشبكات العصبية',
        'traitement du langage naturel': 'معالجة اللغة الطبيعية',
        'vision par ordinateur': 'رؤية الحاسوب',
        'science des données': 'علم البيانات',
        'sécurité informatique': 'الأمن السيبراني',
        'développement web': 'تطوير الويب',
        'base de données': 'قاعدة البيانات',
        'algorithme': 'خوارزمية',
        'algorithmes': 'خوارزميات'
      },
      'en_to_fr': {
        'National School of Artificial Intelligence and Digital': 'École Nationale de l\'Intelligence Artificielle et Digitale',
        'artificial intelligence': 'intelligence artificielle',
        'machine learning': 'apprentissage automatique',
        'neural networks': 'réseaux de neurones',
        'natural language processing': 'traitement du langage naturel',
        'computer vision': 'vision par ordinateur',
        'data science': 'science des données',
        'cybersecurity': 'sécurité informatique',
        'web development': 'développement web',
        'database': 'base de données',
        'algorithm': 'algorithme',
        'algorithms': 'algorithmes',
        'student': 'étudiant',
        'students': 'étudiants',
        'course': 'cours',
        'program': 'programme',
        'module': 'module',
        'modules': 'modules',
        'training': 'formation'
      },
      'en_to_ar': {
        'National School of Artificial Intelligence and Digital': 'المدرسة الوطنية للذكاء الاصطناعي والرقمي',
        'artificial intelligence': 'الذكاء الاصطناعي',
        'machine learning': 'التعلم الآلي',
        'neural networks': 'الشبكات العصبية',
        'natural language processing': 'معالجة اللغة الطبيعية',
        'computer vision': 'رؤية الحاسوب',
        'data science': 'علم البيانات',
        'cybersecurity': 'الأمن السيبراني',
        'web development': 'تطوير الويب',
        'database': 'قاعدة البيانات',
        'algorithm': 'خوارزمية',
        'algorithms': 'خوارزميات',
        'student': 'طالب',
        'students': 'طلاب',
        'course': 'دورة',
        'program': 'برنامج',
        'module': 'وحدة',
        'modules': 'وحدات',
        'training': 'تكوين'
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
      'ar_to_en': {
        'المدرسة الوطنية للذكاء الاصطناعي والرقمي': 'National School of Artificial Intelligence and Digital',
        'إنياد': 'ENIAD',
        'جامعة محمد الأول': 'Mohammed First University',
        'الذكاء الاصطناعي': 'artificial intelligence',
        'التعلم الآلي': 'machine learning',
        'الشبكات العصبية': 'neural networks',
        'معالجة اللغة الطبيعية': 'natural language processing',
        'رؤية الحاسوب': 'computer vision',
        'علم البيانات': 'data science',
        'الأمن السيبراني': 'cybersecurity',
        'تطوير الويب': 'web development',
        'قاعدة البيانات': 'database',
        'خوارزمية': 'algorithm',
        'خوارزميات': 'algorithms',
        'طالب': 'student',
        'طلاب': 'students',
        'دورة': 'course',
        'برنامج': 'program',
        'وحدة': 'module',
        'وحدات': 'modules',
        'تكوين': 'training'
      }
    };
  }

  /**
   * Detect the language of a text
   * @param {string} text - Text to analyze
   * @returns {string} Language code (ar, fr, en)
   */
  detectLanguage(text) {
    if (!text || typeof text !== 'string') return 'fr';
    
    const cleanText = text.toLowerCase().trim();
    
    // Check for Arabic characters
    if (this.languagePatterns.ar.test(text)) {
      return 'ar';
    }
    
    // Count French and English indicators
    const frenchMatches = (cleanText.match(this.languagePatterns.fr) || []).length;
    const englishMatches = (cleanText.match(this.languagePatterns.en) || []).length;
    
    if (frenchMatches > englishMatches) {
      return 'fr';
    } else if (englishMatches > frenchMatches) {
      return 'en';
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
   * @param {string} targetLanguage - Target language (fr, en, ar)
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
