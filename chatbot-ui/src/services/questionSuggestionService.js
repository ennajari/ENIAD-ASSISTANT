// Question Suggestion Service for multilingual autocomplete

class QuestionSuggestionService {
  constructor() {
    this.questions = {
      en: [],
      fr: [],
      ar: []
    };

    // Cache for processed questions
    this.processedQuestions = {};
    this.isLoaded = false;
    this.loadPromise = null;

    // Initialize data loading
    this.loadQuestions();
  }

  // Load questions from ENIAD QTA data
  async loadQuestions() {
    // Always fetch fresh data from ENIAD QTA
    return this.fetchAllQuestions();
  }

  async fetchAllQuestions() {
    try {
      console.log('🔄 Loading questions from language-specific JSON files...');

      const fetchQuestion = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.status}`);
        }
        return response.json();
      };

      const [questionsFr, questionsEn, questionsAr] = await Promise.all([
        fetchQuestion('/questions_fr.json'),
        fetchQuestion('/questions_en.json'),
        fetchQuestion('/questions_ar.json')
      ]);

      this.questions = {
        fr: questionsFr || [],
        en: questionsEn || [],
        ar: questionsAr || []
      };

      console.log('✅ Questions loaded from JSON files:', {
        en: this.questions.en.length,
        fr: this.questions.fr.length,
        ar: this.questions.ar.length,
        timestamp: new Date().toLocaleTimeString()
      });

      this.initializeProcessedQuestions();
      this.isLoaded = true;
    } catch (error) {
      console.error('❌ Error loading questions:', error);
      // Fallback to empty arrays
      this.questions = { en: [], fr: [], ar: [] };
      this.initializeProcessedQuestions();
      this.isLoaded = true;
    }
  }



  initializeProcessedQuestions() {
    Object.keys(this.questions).forEach(lang => {
      this.processedQuestions[lang] = this.questions[lang].map((item, index) => ({
        id: `${lang}-${index}`,
        question: item.question,
        answer: item.answer || item.réponse,
        language: lang,
        searchText: this.normalizeText(item.question, lang)
      }));
    });
  }

  // Force refresh questions from ENIAD QTA
  async refreshQuestions() {
    console.log('🔄 Force refreshing questions from ENIAD QTA...');
    this.isLoaded = false;
    this.loadPromise = null;
    return this.fetchAllQuestions();
  }

  // Normalize text for better search matching
  normalizeText(text, language) {
    if (!text) return '';
    
    let normalized = text.toLowerCase();
    
    // Remove diacritics for better matching
    if (language === 'fr') {
      normalized = normalized
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n');
    }
    
    // Remove punctuation and extra spaces
    normalized = normalized
      .replace(/[^\w\s\u0600-\u06FF]/g, ' ') // Keep Arabic characters
      .replace(/\s+/g, ' ')
      .trim();
    
    return normalized;
  }

  // Get suggestions based on user input
  async getSuggestions(input, language = 'fr', maxResults = 5) {
    console.log(`🌍 Getting suggestions for language: ${language}, input: "${input}"`);

    // Ensure questions are loaded
    if (!this.isLoaded) {
      await this.fetchAllQuestions();
    }

    if (!input || input.length < 2) {
      return this.getPopularQuestions(language, maxResults);
    }

    const normalizedInput = this.normalizeText(input, language);
    const questions = this.processedQuestions[language] || [];

    // Score and filter questions
    const scoredQuestions = questions
      .map(question => ({
        ...question,
        score: this.calculateRelevanceScore(normalizedInput, question.searchText, language)
      }))
      .filter(question => question.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    return scoredQuestions;
  }

  // Calculate relevance score for a question
  calculateRelevanceScore(input, questionText, language) {
    if (!input || !questionText) return 0;

    const inputWords = input.split(' ').filter(word => word.length > 1);
    const questionWords = questionText.split(' ');
    
    let score = 0;
    
    // Exact phrase match (highest score)
    if (questionText.includes(input)) {
      score += 100;
    }
    
    // Word-by-word matching
    inputWords.forEach(inputWord => {
      questionWords.forEach(questionWord => {
        if (questionWord.startsWith(inputWord)) {
          score += 10; // Prefix match
        } else if (questionWord.includes(inputWord)) {
          score += 5; // Contains match
        }
      });
    });
    
    // Boost score for shorter questions (more specific)
    if (questionWords.length < 10) {
      score += 2;
    }
    
    // Language-specific boosting
    if (language === 'ar') {
      // Boost Arabic questions that start with common question words
      const arabicQuestionWords = ['ما', 'كيف', 'أين', 'متى', 'هل', 'ماذا'];
      const firstWord = questionWords[0];
      if (arabicQuestionWords.includes(firstWord)) {
        score += 3;
      }
    } else if (language === 'fr') {
      // Boost French questions that start with common question words
      const frenchQuestionWords = ['comment', 'quels', 'quelle', 'où', 'quand', 'pourquoi'];
      const firstWord = questionWords[0];
      if (frenchQuestionWords.includes(firstWord)) {
        score += 3;
      }
    } else if (language === 'en') {
      // Boost English questions that start with common question words
      const englishQuestionWords = ['how', 'what', 'where', 'when', 'why', 'which', 'who'];
      const firstWord = questionWords[0];
      if (englishQuestionWords.includes(firstWord)) {
        score += 3;
      }
    }
    
    return score;
  }

  // Get popular/featured questions when no input
  getPopularQuestions(language = 'fr', maxResults = 5) {
    console.log(`📋 Getting popular questions for language: ${language}`);
    const questions = this.processedQuestions[language] || [];
    console.log(`📊 Available questions in ${language}:`, questions.length);

    if (questions.length > 0) {
      console.log(`📝 Sample question in ${language}:`, questions[0].question);
    }

    // Return first few questions as "popular" ones
    // In a real app, you might track click counts or have a featured flag
    const popular = questions.slice(0, maxResults).map(question => ({
      ...question,
      score: 50 // Default score for popular questions
    }));

    console.log(`⭐ Returning ${popular.length} popular questions in ${language}`);
    return popular;
  }

  // Get questions by category/topic
  getQuestionsByTopic(topic, language = 'fr', maxResults = 10) {
    const normalizedTopic = this.normalizeText(topic, language);
    return this.getSuggestions(normalizedTopic, language, maxResults);
  }

  // Get all available languages
  getAvailableLanguages() {
    return Object.keys(this.questions);
  }

  // Get total question count for a language
  getQuestionCount(language) {
    return this.questions[language]?.length || 0;
  }

  // Search across all languages (useful for multilingual users)
  searchAllLanguages(input, maxResults = 15) {
    const allResults = [];
    
    Object.keys(this.questions).forEach(lang => {
      const results = this.getSuggestions(input, lang, Math.ceil(maxResults / 3));
      allResults.push(...results);
    });
    
    // Sort by score and remove duplicates
    return allResults
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  // Get question by ID
  getQuestionById(id) {
    for (const lang of Object.keys(this.processedQuestions)) {
      const question = this.processedQuestions[lang].find(q => q.id === id);
      if (question) return question;
    }
    return null;
  }
}

// Create singleton instance
const questionSuggestionService = new QuestionSuggestionService();

export default questionSuggestionService;
