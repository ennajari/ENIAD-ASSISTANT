export const API_URL = "/api/llama";

export const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦' }
];

export const DRAWER_WIDTH = 300;
export const COLLAPSED_DRAWER_WIDTH = 72;

export const translations = {
  fr: {
    newChat: "Nouveau chat",
    settings: "Paramètres",
    darkMode: "Mode sombre",
    lightMode: "Mode clair",
    autoRead: "Lecture automatique des réponses",
    languageSection: "Langue",
    close: "Fermer",
    writeMessage: "Écrivez votre message...",
    thinking: "Réflexion en cours...",
    newConversation: "Nouvelle conversation",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    startRecording: "Enregistrer un message audio",
    stopRecording: "Arrêter l'enregistrement",
    assistant: "Assistant Académique ENIAD",
    startPrompt: "Posez votre question ou choisissez un sujet ci-dessous pour commencer une nouvelle conversation.",
    welcomeGreeting: "Salut, je suis Eniad-Assistant.",
    welcomeSubtext: "Comment puis-je vous aider aujourd'hui ?",
    errorMessage: "Désolé, une erreur est survenue. Veuillez réessayer.",
    networkError: "Erreur réseau. Veuillez vérifier votre connexion et réessayer.",
    rateLimitError: "Trop de requêtes. Veuillez attendre un moment avant de réessayer.",
    authError: "Erreur d'authentification. Veuillez vous reconnecter.",
    disclaimer: "ENIAD AI peut faire des erreurs. Vérifiez les informations importantes.",
    version: "v1.0.0",
    suggestions: [
      "Quels sont les programmes de formation disponibles à l'ENIAD ?",
      "Comment puis-je m'inscrire à l'ENIAD ?",
      "Quelles sont les conditions d'admission à l'ENIAD ?",
    ],
    // Welcome categories
    welcomeCategories: [
      {
        title: "Conditions d'Admission",
        subtitle: "شروط القبول",
        icon: "🎓",
        questions: [
          "Quelles sont les conditions d'admission à l'ENIAD ?",
          "Comment puis-je m'inscrire à l'ENIAD ?",
          "Quels documents sont nécessaires pour l'inscription ?"
        ]
      },
      {
        title: "Spécialisations",
        subtitle: "التخصصات",
        icon: "📚",
        questions: [
          "Quels sont les programmes de formation disponibles à l'ENIAD ?",
          "Quelles spécialisations sont offertes en intelligence artificielle ?",
          "Quelle est la durée des études à l'ENIAD ?"
        ]
      },
      {
        title: "Bourses d'Études",
        subtitle: "المنح الدراسية",
        icon: "☀️",
        questions: [
          "Y a-t-il des bourses d'études disponibles ?",
          "Comment postuler pour une bourse d'études ?",
          "Quels sont les critères d'éligibilité pour les bourses ?"
        ]
      },
      {
        title: "Vie sur le Campus",
        subtitle: "الحياة الجامعية",
        icon: "🏛️",
        questions: [
          "Comment accéder au campus ENIAD ?",
          "Y a-t-il une bibliothèque sur le campus ?",
          "Y a-t-il des clubs étudiants ?"
        ]
      }
    ],
    usingSystemPreference: "Utilise les préférences système",
    editTitle: "Modifier le titre de la conversation",
    contextTitle: "Contexte: ",
    login: "Se connecter",
    logout: "Se déconnecter",
    contact: "Nous contacter",
    // Settings dialog specific translations
    settingsTitle: "Paramètres",
    customizeExperience: "Personnalisez votre expérience",
    appearance: "Apparence",
    switchThemes: "Basculer entre les thèmes clair et sombre",
    audioSettings: "Paramètres audio",
    readAloud: "Lecture automatique des réponses",
    autoReadDescription: "Lire automatiquement les réponses de l'assistant à voix haute",
    language: "Langue",
    about: "À propos",
    poweredBy: "Alimenté par une technologie IA moderne pour des expériences d'apprentissage améliorées.",

    // RAG Settings translations
    ragSystem: "Système RAG",
    ragParameters: "Paramètres RAG",
    ragStatus: "État du système RAG",
    ragError: "Erreur système RAG",
    ragServiceError: "Erreur service RAG interne",
    projectId: "ID du projet",
    lastVerification: "Dernière vérification",
    terminationPoint: "Point de terminaison",
    expand: "Développer la barre latérale",
    collapse: "Réduire la barre latérale",
    chatHistory: "Historique",
    you: "Vous",
    speak: "Lire à haute voix",
    copy: "Copier",
    copied: "Copié !",
    copiedToClipboard: "Copié dans le presse-papiers !",
    // RAG System
    ragSystem: "Système RAG",
    ragHealthy: "Système RAG en ligne",
    ragUnhealthy: "Problèmes système RAG",
    ragError: "Erreur système RAG",
    ragUnknown: "Statut RAG inconnu",
    checking: "Vérification...",
    endpoint: "Point de terminaison",
    projectId: "ID du projet",
    indexInfo: "Info de l'index",
    lastCheck: "Dernière vérification",
    ragStatusHelp: "Ceci montre l'état de connexion à votre système RAG_Project. Assurez-vous que votre serveur FastAPI fonctionne sur le point de terminaison configuré.",
    error: "Erreur",
    refresh: "Actualiser",
    expand: "Développer",
    collapse: "Réduire",
    unknown: "Inconnu",

    // Additional RAG error messages
    ragNotRunning: "Service RAG non démarré sur le port 8004",
    ragStartInstructions: "Pour démarrer RAG: cd RAG_Project/src && python main.py",
    ragOptional: "Le service RAG est optionnel - le chatbot fonctionne sans lui",
    ragTimeout: "Délai d'attente du service RAG (port 8004)",
    ragNetworkError: "Erreur réseau lors de la connexion au service RAG",
    ragCheckLogs: "Vérifiez les logs du service RAG",
    // SMA System
    smaActive: "SMA Activé - Intelligence Web en temps réel",
    smaInactive: "Activer SMA - Surveillance intelligente des sites",
    smaSearching: "SMA en cours de recherche...",
    smaEnhanced: "Réponse enrichie par SMA",
    smaWebIntelligence: "Intelligence Web SMA",
    smaRealTimeData: "Données en temps réel d'ENIAD et UMP",

    // Model Selection
    modelSelector: "Sélecteur de Modèle IA",
    geminiModel: "Gemini API",
    llamaModel: "Llama (Notre Projet)",
    ragModel: "RAG + Modèle Local",
    modelDescription: "Choisissez le modèle d'IA pour générer les réponses",

    // RAG Status Messages
    ragConnected: "Système RAG connecté",
    ragDisconnected: "Système RAG déconnecté",
    ragHealthy: "Système RAG en ligne",
    ragUnhealthy: "Problèmes système RAG",
    ragError: "Erreur système RAG",
    ragUnknown: "Statut RAG inconnu",
    ragWorking: "Système RAG opérationnel",
  },

  ar: {
    newChat: "محادثة جديدة",
    settings: "الإعدادات",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
    autoRead: "قراءة تلقائية للردود",
    languageSection: "اللغة",
    close: "إغلاق",
    writeMessage: "اكتب رسالتك...",
    thinking: "جاري التفكير...",
    newConversation: "محادثة جديدة",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    startRecording: "تسجيل رسالة صوتية",
    stopRecording: "إيقاف التسجيل",
    assistant: "المساعد الأكاديمي ENIAD",
    startPrompt: "اطرح سؤالك أو اختر موضوعًا أدناه لبدء محادثة جديدة.",
    welcomeGreeting: "مرحباً، أنا مساعد إنياد.",
    welcomeSubtext: "كيف يمكنني مساعدتك اليوم؟",
    errorMessage: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
    networkError: "خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
    rateLimitError: "طلبات كثيرة جداً. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.",
    authError: "خطأ في المصادقة. يرجى تسجيل الدخول مرة أخرى.",
    disclaimer: "قد يرتكب ENIAD AI أخطاء. يرجى التحقق من المعلومات المهمة.",
    version: "الإصدار 1.0.0",
    suggestions: [
      "ما هي البرامج التدريبية المتاحة في ENIAD؟",
      "كيف يمكنني التسجيل في ENIAD؟",
      "ما هي شروط القبول في ENIAD؟",
    ],
    // Welcome categories
    welcomeCategories: [
      {
        title: "شروط القبول",
        subtitle: "Conditions d'Admission",
        icon: "🎓",
        questions: [
          "ما هي شروط القبول في ENIAD؟",
          "كيف يمكنني التسجيل في ENIAD؟",
          "ما هي الوثائق المطلوبة للتسجيل؟"
        ]
      },
      {
        title: "التخصصات",
        subtitle: "Spécialisations",
        icon: "📚",
        questions: [
          "ما هي البرامج التدريبية المتاحة في ENIAD؟",
          "ما هي التخصصات المتاحة في الذكاء الاصطناعي؟",
          "ما هي مدة الدراسة في ENIAD؟"
        ]
      },
      {
        title: "المنح الدراسية",
        subtitle: "Bourses d'Études",
        icon: "☀️",
        questions: [
          "هل توجد منح دراسية متاحة؟",
          "كيف أتقدم بطلب للحصول على منحة دراسية؟",
          "ما هي معايير الأهلية للمنح الدراسية؟"
        ]
      },
      {
        title: "الحياة الجامعية",
        subtitle: "Vie sur le Campus",
        icon: "🏛️",
        questions: [
          "كيف أصل إلى حرم ENIAD؟",
          "هل توجد مكتبة في الحرم؟",
          "هل توجد نوادي طلابية؟"
        ]
      }
    ],
    usingSystemPreference: "يستخدم تفضيلات النظام",
    editTitle: "تعديل عنوان المحادثة",
    contextTitle: "السياق: ",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    contact: "اتصل بنا",
    expand: "توسيع الشريط الجانبي",
    collapse: "طي الشريط الجانبي",
    chatHistory: "تاريخ المحادثات",
    you: "أنت",
    speak: "قراءة بصوت عالٍ",
    copy: "نسخ",
    copied: "تم النسخ!",
    copiedToClipboard: "تم النسخ إلى الحافظة!",
    // Settings dialog specific translations
    settingsTitle: "الإعدادات",
    customizeExperience: "تخصيص تجربتك",
    appearance: "المظهر",
    switchThemes: "التبديل بين الأوضاع الفاتحة والداكنة",
    audioSettings: "إعدادات الصوت",
    readAloud: "قراءة تلقائية للردود",
    autoReadDescription: "قراءة ردود المساعد تلقائياً بصوت عالٍ",
    language: "اللغة",
    about: "حول",
    poweredBy: "مدعوم بتقنية الذكاء الاصطناعي الحديثة لتجارب تعليمية محسّنة.",

    // RAG Settings translations
    ragSystem: "نظام RAG",
    ragParameters: "معاملات RAG",
    ragStatus: "حالة نظام RAG",
    ragError: "خطأ في نظام RAG",
    ragServiceError: "خطأ في خدمة RAG الداخلية",
    projectId: "معرف المشروع",
    lastVerification: "آخر تحقق",
    terminationPoint: "نقطة الإنهاء",
    // RAG System
    ragSystem: "نظام RAG",
    ragHealthy: "نظام RAG متصل",
    ragUnhealthy: "مشاكل في نظام RAG",
    ragError: "خطأ في نظام RAG",
    ragUnknown: "حالة RAG غير معروفة",
    checking: "جاري التحقق...",
    endpoint: "نقطة النهاية",
    projectId: "معرف المشروع",
    indexInfo: "معلومات الفهرس",
    lastCheck: "آخر فحص",
    ragStatusHelp: "يُظهر هذا حالة الاتصال بنظام RAG_Project الخاص بك. تأكد من تشغيل خادم FastAPI على نقطة النهاية المكونة.",
    error: "خطأ",
    refresh: "تحديث",
    expand: "توسيع",
    collapse: "طي",
    unknown: "غير معروف",

    // Additional RAG error messages in Arabic
    ragNotRunning: "خدمة RAG غير مشغلة على المنفذ 8004",
    ragStartInstructions: "لبدء RAG: cd RAG_Project/src && python main.py",
    ragOptional: "خدمة RAG اختيارية - يعمل الشات بوت بدونها",
    ragTimeout: "انتهت مهلة خدمة RAG (المنفذ 8004)",
    ragNetworkError: "خطأ في الشبكة عند الاتصال بخدمة RAG",
    ragCheckLogs: "تحقق من سجلات خدمة RAG",
    // SMA System
    smaActive: "Sما نشط - ذكاء الويب في الوقت الفعلي",
    smaInactive: "تفعيل SMA - مراقبة ذكية للمواقع",
    smaSearching: "SMA يبحث...",
    smaEnhanced: "استجابة محسّنة بـ SMA",
    smaWebIntelligence: "ذكاء الويب SMA",
    smaRealTimeData: "بيانات في الوقت الفعلي من ENIAD و UMP",

    // Model Selection
    modelSelector: "منتقي نموذج الذكاء الاصطناعي",
    geminiModel: "جيميني API",
    llamaModel: "لاما (مشروعنا)",
    ragModel: "RAG + نموذج محلي",
    modelDescription: "اختر نموذج الذكاء الاصطناعي لتوليد الإجابات",

    // RAG Status Messages
    ragConnected: "نظام RAG متصل",
    ragDisconnected: "نظام RAG غير متصل",
    ragHealthy: "نظام RAG يعمل بشكل طبيعي",
    ragUnhealthy: "مشاكل في نظام RAG",
    ragError: "خطأ في نظام RAG",
    ragUnknown: "حالة RAG غير معروفة",
    ragWorking: "نظام RAG يعمل",
  }
};
