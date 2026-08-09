class StaticSuggestionsService {
  constructor() {
    this.suggestions = {
      fr: [
        "Quels sont les programmes de formation disponibles à l'ENIAD ?",
        "Comment puis-je m'inscrire à l'ENIAD ?",
        "Quelles sont les conditions d'admission à l'ENIAD ?",
        "Qu'est-ce que l'intelligence artificielle ?",
        "Quels sont les frais de scolarité ?",
        "Y a-t-il des bourses d'études disponibles ?",
        "Quelle est la durée des études à l'ENIAD ?",
        "Comment accéder au campus ENIAD ?",
        "Y a-t-il une bibliothèque sur le campus ?",
        "Quels sont les horaires des cours ?",
        "Comment contacter les professeurs ?",
        "Y a-t-il des stages obligatoires ?",
        "Qu'est-ce que le machine learning ?",
        "Quels langages de programmation sont enseignés ?",
        "Y a-t-il des clubs étudiants ?",
        "Comment s'inscrire aux cours ?",
        "Où trouver les supports de cours ?",
        "Comment réserver une salle d'étude ?",
        "Y a-t-il des cours en ligne ?",
        "Quels sont les débouchés professionnels ?",
        "Comment obtenir un certificat ?",
        "Y a-t-il une cafétéria sur le campus ?",
        "Qu'est-ce que la cybersécurité ?",
        "Comment accéder au WiFi campus ?",
        "Y a-t-il des partenariats avec des entreprises ?"
      ],
      en: [
        "What training programs are available at ENIAD?",
        "How can I register at ENIAD?",
        "What are the admission requirements for ENIAD?",
        "What is artificial intelligence?",
        "What are the tuition fees?",
        "Are there scholarships available?",
        "What is the duration of studies at ENIAD?",
        "How to access the ENIAD campus?",
        "Is there a library on campus?",
        "What are the class schedules?",
        "How to contact professors?",
        "Are there mandatory internships?",
        "What is machine learning?",
        "What programming languages are taught?",
        "Are there student clubs?",
        "How to register for courses?",
        "Where to find course materials?",
        "How to book a study room?",
        "Are there online courses?",
        "What are the career opportunities?",
        "How to obtain a certificate?",
        "Is there a cafeteria on campus?",
        "What is cybersecurity?",
        "How to access campus WiFi?",
        "Are there partnerships with companies?"
      ],
      ar: [
        "ما هي برامج التدريب المتاحة في ENIAD؟",
        "كيف يمكنني التسجيل في ENIAD؟",
        "ما هي شروط القبول في ENIAD؟",
        "ما هو الذكاء الاصطناعي؟",
        "ما هي الرسوم الدراسية؟",
        "هل توجد منح دراسية متاحة؟",
        "ما هي مدة الدراسة في ENIAD؟",
        "كيف أصل إلى حرم ENIAD؟",
        "هل توجد مكتبة في الحرم؟",
        "ما هي مواعيد الفصول؟",
        "كيف أتواصل مع الأساتذة؟",
        "هل هناك تدريبات إجبارية؟",
        "ما هو التعلم الآلي؟",
        "ما هي لغات البرمجة التي يتم تدريسها؟",
        "هل توجد نوادي طلابية؟",
        "كيف أسجل في المقررات؟",
        "أين أجد مواد الدورة؟",
        "كيف أحجز غرفة دراسة؟",
        "هل توجد دورات عبر الإنترنت؟",
        "ما هي الفرص المهنية؟",
        "كيف أحصل على شهادة؟",
        "هل توجد كافتيريا في الحرم؟",
        "ما هو الأمن السيبراني؟",
        "كيف أصل إلى WiFi الحرم؟",
        "هل توجد شراكات مع الشركات؟"
      ]
    };
    
    this.currentSuggestions = {
      fr: [],
      en: [],
      ar: []
    };
    
    this.lastRefreshTime = 0;
    this.refreshInterval = 30000; // 30 seconds
  }

  // Get random suggestions for a language
  getRandomSuggestions(language = 'fr', count = 3) {
    const allSuggestions = this.suggestions[language] || this.suggestions.fr;
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Get current static suggestions (refresh if needed)
  getCurrentSuggestions(language = 'fr', count = 3) {
    const now = Date.now();

    // Check if we need to refresh suggestions
    if (now - this.lastRefreshTime > this.refreshInterval ||
        this.currentSuggestions[language].length === 0) {
      this.refreshSuggestions();
    }

    const suggestions = this.currentSuggestions[language].slice(0, count);
    console.log(`📝 getCurrentSuggestions for ${language}:`, suggestions);
    return suggestions;
  }

  // Refresh suggestions for all languages
  refreshSuggestions() {
    console.log('🔄 Refreshing static suggestions...');
    
    this.currentSuggestions.fr = this.getRandomSuggestions('fr', 3);
    this.currentSuggestions.en = this.getRandomSuggestions('en', 3);
    this.currentSuggestions.ar = this.getRandomSuggestions('ar', 3);
    
    this.lastRefreshTime = Date.now();
    
    console.log('✅ Static suggestions refreshed:', {
      fr: this.currentSuggestions.fr,
      en: this.currentSuggestions.en,
      ar: this.currentSuggestions.ar
    });
  }

  // Force refresh suggestions (for new conversation)
  forceRefresh() {
    console.log('🔄 Force refreshing static suggestions for new conversation...');
    this.lastRefreshTime = 0; // Reset timer
    this.refreshSuggestions();
  }

  // Get suggestions with metadata
  getSuggestionsWithMetadata(language = 'fr', count = 3) {
    const suggestions = this.getCurrentSuggestions(language, count);
    return suggestions.map((suggestion, index) => ({
      id: `static-${language}-${index}`,
      question: suggestion,
      type: 'static',
      language: language,
      score: 100 - index // Higher score for earlier suggestions
    }));
  }
}

// Create singleton instance
const staticSuggestionsService = new StaticSuggestionsService();

// Initialize immediately
staticSuggestionsService.forceRefresh();

export default staticSuggestionsService;
