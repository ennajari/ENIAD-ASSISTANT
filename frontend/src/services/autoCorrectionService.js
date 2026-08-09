/**
 * Auto-Correction Service for Multilingual Spell-Check
 * Provides spell-check and grammar correction for French, English, and Arabic
 * Optimized for ENIAD/UMP academic context
 */

class AutoCorrectionService {
  constructor() {
    // Common corrections for ENIAD/UMP context
    this.corrections = {
      'fr': {
        // Common French typos in academic context
        'eniad': 'ENIAD',
        'ump': 'UMP',
        'universite': 'université',
        'etudiant': 'étudiant',
        'etudiants': 'étudiants',
        'ecole': 'école',
        'formation': 'formation',
        'formations': 'formations',
        'intelligence artificiel': 'intelligence artificielle',
        'apprentissage automatique': 'apprentissage automatique',
        'reseaux de neurones': 'réseaux de neurones',
        'traitement du language naturel': 'traitement du langage naturel',
        'science des donnees': 'science des données',
        'securite informatique': 'sécurité informatique',
        'developement web': 'développement web',
        'base de donnee': 'base de données',
        'algorithme': 'algorithme',
        'algorithmes': 'algorithmes',
        'programation': 'programmation',
        'informatique': 'informatique',
        'technologie': 'technologie',
        'technologies': 'technologies',
        'digitale': 'digitale',
        'numerique': 'numérique',
        'berkane': 'Berkane',
        'maroc': 'Maroc',
        'marocain': 'marocain',
        'marocaine': 'marocaine',
        'qu\'est ce que': 'qu\'est-ce que',
        'comment ca marche': 'comment ça marche',
        'ca': 'ça',
        'a': 'à',
        'ou': 'où'
      },

      'ar': {
        // Common Arabic typos in academic context
        'انياد': 'إنياد',
        'جامعة محمد الاول': 'جامعة محمد الأول',
        'الذكاء الاصتناعي': 'الذكاء الاصطناعي',
        'التعلم الالي': 'التعلم الآلي',
        'الشبكات العصبيه': 'الشبكات العصبية',
        'معالجة اللغه الطبيعية': 'معالجة اللغة الطبيعية',
        'رؤية الحاسب': 'رؤية الحاسوب',
        'علم البيانت': 'علم البيانات',
        'الامن السيبراني': 'الأمن السيبراني',
        'تطوير الويب': 'تطوير الويب',
        'قاعدة البيانت': 'قاعدة البيانات',
        'خوارزميه': 'خوارزمية',
        'خوارزميات': 'خوارزميات',
        'طالب': 'طالب',
        'طلاب': 'طلاب',
        'دوره': 'دورة',
        'برنامج': 'برنامج',
        'وحده': 'وحدة',
        'وحدات': 'وحدات',
        'تكوين': 'تكوين',
        'بركان': 'بركان',
        'المغرب': 'المغرب',
        'مغربي': 'مغربي',
        'مغربية': 'مغربية',
        'ما هو': 'ما هو',
        'كيف': 'كيف',
        'متى': 'متى',
        'اين': 'أين',
        'لماذا': 'لماذا'
      }
    };

    // Grammar patterns for basic corrections
    this.grammarPatterns = {
      'fr': [
        {
          pattern: /\b(le|la|les)\s+(a)\s+/gi,
          replacement: '$1 à ',
          description: 'Correct "a" to "à" after articles'
        },
        {
          pattern: /\b(ou)\s+(est)\b/gi,
          replacement: 'où $2',
          description: 'Correct "ou" to "où" in questions'
        },
        {
          pattern: /\b(ca)\s+/gi,
          replacement: 'ça ',
          description: 'Correct "ca" to "ça"'
        }
      ],

      'ar': [
        {
          pattern: /\b(انا)\s+/gi,
          replacement: 'أنا ',
          description: 'Correct "انا" to "أنا"'
        },
        {
          pattern: /\b(اين)\s+/gi,
          replacement: 'أين ',
          description: 'Correct "اين" to "أين"'
        }
      ]
    };

    // Cache for corrections
    this.correctionCache = new Map();
    this.cacheExpiry = 60 * 60 * 1000; // 1 hour
  }

  /**
   * Detect language of text
   * @param {string} text - Text to analyze
   * @returns {string} Language code
   */
  detectLanguage(text) {
    if (!text) return 'fr';

    const arabicPattern = /[\u0600-\u06FF]/;
    const frenchPattern = /\b(le|la|les|de|du|des|et|est|dans|pour|avec|sur|par|une|un|ce|cette|qui|que|où|comment|pourquoi)\b/i;

    if (arabicPattern.test(text)) {
      return 'ar';
    } else if (frenchPattern.test(text)) {
      return 'fr';
    }

    return 'fr'; // Default to French
  }

  /**
   * Apply dictionary corrections
   * @param {string} text - Text to correct
   * @param {string} language - Language code
   * @returns {Object} Correction result
   */
  applyDictionaryCorrections(text, language) {
    const corrections = this.corrections[language] || {};
    let correctedText = text;
    const appliedCorrections = [];

    // Sort by length (longest first) to avoid partial replacements
    const sortedKeys = Object.keys(corrections).sort((a, b) => b.length - a.length);

    for (const incorrect of sortedKeys) {
      const correct = corrections[incorrect];
      const regex = new RegExp(`\\b${incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      
      if (regex.test(correctedText)) {
        correctedText = correctedText.replace(regex, correct);
        appliedCorrections.push({
          original: incorrect,
          corrected: correct,
          type: 'spelling'
        });
      }
    }

    return {
      text: correctedText,
      corrections: appliedCorrections
    };
  }

  /**
   * Apply grammar corrections
   * @param {string} text - Text to correct
   * @param {string} language - Language code
   * @returns {Object} Correction result
   */
  applyGrammarCorrections(text, language) {
    const patterns = this.grammarPatterns[language] || [];
    let correctedText = text;
    const appliedCorrections = [];

    for (const pattern of patterns) {
      if (pattern.pattern.test(correctedText)) {
        const originalText = correctedText;
        correctedText = correctedText.replace(pattern.pattern, pattern.replacement);
        
        if (originalText !== correctedText) {
          appliedCorrections.push({
            type: 'grammar',
            description: pattern.description,
            pattern: pattern.pattern.source
          });
        }
      }
    }

    return {
      text: correctedText,
      corrections: appliedCorrections
    };
  }

  /**
   * Auto-correct text with caching
   * @param {string} text - Text to correct
   * @param {string} language - Language code (optional, will auto-detect)
   * @returns {Object} Correction result
   */
  autoCorrect(text, language = null) {
    if (!text || typeof text !== 'string') {
      return {
        originalText: text,
        correctedText: text,
        corrections: [],
        language: language || 'fr',
        hasChanges: false
      };
    }

    // Check cache
    const cacheKey = `${language || 'auto'}_${text}`;
    const cached = this.correctionCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      return cached.result;
    }

    // Detect language if not provided
    const detectedLanguage = language || this.detectLanguage(text);
    
    // Apply dictionary corrections
    const dictionaryResult = this.applyDictionaryCorrections(text, detectedLanguage);
    
    // Apply grammar corrections
    const grammarResult = this.applyGrammarCorrections(dictionaryResult.text, detectedLanguage);
    
    // Combine results
    const allCorrections = [
      ...dictionaryResult.corrections,
      ...grammarResult.corrections
    ];

    const result = {
      originalText: text,
      correctedText: grammarResult.text,
      corrections: allCorrections,
      language: detectedLanguage,
      hasChanges: text !== grammarResult.text,
      timestamp: Date.now()
    };

    // Cache the result
    this.correctionCache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });

    return result;
  }

  /**
   * Get suggestions for a specific word
   * @param {string} word - Word to get suggestions for
   * @param {string} language - Language code
   * @returns {Array} Array of suggestions
   */
  getSuggestions(word, language) {
    const corrections = this.corrections[language] || {};
    const suggestions = [];

    // Exact match
    if (corrections[word.toLowerCase()]) {
      suggestions.push(corrections[word.toLowerCase()]);
    }

    // Fuzzy matching (simple implementation)
    for (const [incorrect, correct] of Object.entries(corrections)) {
      if (incorrect.includes(word.toLowerCase()) || word.toLowerCase().includes(incorrect)) {
        if (!suggestions.includes(correct)) {
          suggestions.push(correct);
        }
      }
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, entry] of this.correctionCache.entries()) {
      if ((now - entry.timestamp) > this.cacheExpiry) {
        this.correctionCache.delete(key);
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
      size: this.correctionCache.size,
      maxAge: this.cacheExpiry,
      languages: ['fr', 'ar'],
      totalCorrections: Object.keys(this.corrections.fr).length +
                       Object.keys(this.corrections.ar).length
    };
  }
}

// Create singleton instance
const autoCorrectionService = new AutoCorrectionService();

export default autoCorrectionService;
