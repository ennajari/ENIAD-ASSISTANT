const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Translation service for multilingual support
class TranslationService {
  constructor() {
    this.translations = {
      'fr': {
        'fallback_response': "Je suis désolé, mais le modèle n'est pas disponible actuellement. Voici quelques informations générales sur l'ENIAD :",
        'eniad_info': "L'ENIAD (École Nationale de l'Intelligence Artificielle et Digitale) est une école spécialisée dans l'IA et les technologies digitales, située à Berkane, Maroc.",
        'contact_info': "Pour plus d'informations, vous pouvez visiter le site officiel de l'ENIAD ou contacter l'administration.",
        'technical_error': "Une erreur technique s'est produite. Veuillez réessayer plus tard."
      },
      'en': {
        'fallback_response': "I'm sorry, but the model is currently unavailable. Here's some general information about ENIAD:",
        'eniad_info': "ENIAD (National School of Artificial Intelligence and Digital) is a school specialized in AI and digital technologies, located in Berkane, Morocco.",
        'contact_info': "For more information, you can visit the official ENIAD website or contact the administration.",
        'technical_error': "A technical error occurred. Please try again later."
      },
      'ar': {
        'fallback_response': "أعتذر، لكن النموذج غير متاح حالياً. إليك بعض المعلومات العامة حول إنياد:",
        'eniad_info': "إنياد (المدرسة الوطنية للذكاء الاصطناعي والرقمي) هي مدرسة متخصصة في الذكاء الاصطناعي والتقنيات الرقمية، تقع في بركان، المغرب.",
        'contact_info': "لمزيد من المعلومات، يمكنك زيارة الموقع الرسمي لإنياد أو الاتصال بالإدارة.",
        'technical_error': "حدث خطأ تقني. يرجى المحاولة مرة أخرى لاحقاً."
      }
    };
  }

  translate(key, language = 'fr') {
    return this.translations[language]?.[key] || this.translations['fr'][key] || key;
  }

  getFallbackResponse(language = 'fr') {
    return [
      this.translate('fallback_response', language),
      '',
      this.translate('eniad_info', language),
      '',
      this.translate('contact_info', language)
    ].join('\n');
  }

  // Detect language from text content
  detectLanguage(text) {
    const arabicPattern = /[\u0600-\u06FF]/;
    const frenchPattern = /\b(le|la|les|de|du|des|et|est|dans|pour|avec|sur|par|une|un|ce|cette|qui|que|où|comment|pourquoi)\b/i;
    const englishPattern = /\b(the|and|is|in|for|with|on|by|a|an|this|that|which|what|where|how|why)\b/i;

    if (arabicPattern.test(text)) {
      return 'ar';
    } else if (frenchPattern.test(text)) {
      return 'fr';
    } else if (englishPattern.test(text)) {
      return 'en';
    }
    return 'fr'; // Default to French
  }

  // Ensure response is in the correct language
  ensureLanguageConsistency(response, targetLanguage) {
    const detectedLanguage = this.detectLanguage(response);

    // If response language doesn't match target, add a language note
    if (detectedLanguage !== targetLanguage && targetLanguage !== 'fr') {
      const languageNote = targetLanguage === 'ar' ?
        'ملاحظة: الإجابة باللغة المطلوبة.\n\n' :
        'Note: Response in requested language.\n\n';
      return languageNote + response;
    }

    return response;
  }
}

const translator = new TranslationService();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Mock database for conversation history (in production, use a real database)
const conversations = new Map();

// Your custom model configuration
const LLAMA3_CONFIG = {
  baseURL: 'https://gorafrenk--llama3-openai-compatible-serve.modal.run/v1',
  apiKey: 'super-secret-key',
  model: 'ahmed-ouka/llama3-8b-eniad-merged-32bit'
};

// RAG System Configuration
const RAG_CONFIG = {
  baseURL: process.env.RAG_API_BASE_URL || 'http://localhost:8000',
  projectId: process.env.RAG_PROJECT_ID || 'eniad-assistant'
};

// SMA System Configuration
const SMA_CONFIG = {
  baseURL: process.env.SMA_API_BASE_URL || 'http://localhost:8001',
  enabled: process.env.SMA_ENABLED !== 'false'
};

// Load enhanced local RAG data as fallback
let localRAGData = [];
try {
  // Load from multiple sources
  const dataSources = [
    // Original data folder
    { dir: path.join(__dirname, '..', 'data'), files: ['FAQ ENIAD Berkane - Informatique et IT.json', 'ensasafi&eniad.json', 'hetic&ENIAD.json'] },
    // RAG data folder (PDF content will be processed later)
    { dir: path.join(__dirname, '..', 'RAG', 'data'), files: [] }
  ];

  dataSources.forEach(source => {
    source.files.forEach(file => {
      const filePath = path.join(source.dir, file);
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(data)) {
          localRAGData = localRAGData.concat(data);
        }
      }
    });
  });

  // Add some basic ENIAD information as fallback
  if (localRAGData.length === 0) {
    localRAGData = [
      {
        question: "Qu'est-ce que l'ENIAD?",
        answer: "L'ENIAD (École Nationale de l'Intelligence Artificielle et Digitale) est une école spécialisée dans l'intelligence artificielle et les technologies digitales, située à Berkane, Maroc.",
        source: "eniad_basic",
        category: "general"
      },
      {
        question: "Où se trouve l'ENIAD?",
        answer: "L'ENIAD est située à Berkane, dans la région de l'Oriental au Maroc.",
        source: "eniad_basic",
        category: "location"
      },
      {
        question: "Quelles sont les spécialités de l'ENIAD?",
        answer: "L'ENIAD propose des formations en intelligence artificielle, data science, développement logiciel, cybersécurité et technologies digitales.",
        source: "eniad_basic",
        category: "programs"
      }
    ];
  }

  console.log(`📚 Loaded ${localRAGData.length} enhanced local RAG documents`);
} catch (error) {
  console.warn('⚠️ Could not load enhanced local RAG data:', error.message);
}

// Chat completion schema
const chatBotResponseSchema = {
  "title": "ChatBotResponse",
  "type": "object",
  "properties": {
    "contentment": {
      "title": "Contentment",
      "description": "Exprimez poliment que vous avez bien compris la question. Utilisez une phrase courte, rassurante, naturelle et adaptée au contexte de la question. Par exemple : 'Merci pour votre question', 'Je comprends votre demande', 'سؤال جيد، شكرًا لك'. Répondez dans la même langue que celle de la question.",
      "type": "string"
    },
    "main_answer": {
      "title": "Main Answer",
      "description": "Fournissez une réponse directe, claire et concise à la question posée. Évitez les longueurs inutiles. Répondez dans la même langue que celle utilisée dans la question.",
      "type": "string"
    },
    "details": {
      "title": "Details",
      "description": "Ajoutez des explications ou informations supplémentaires pour enrichir la réponse si nécessaire. Incluez des exemples, contextes ou précisions utiles. Répondez dans la même langue que celle de la question.",
      "type": "string"
    },
    "intent": {
      "title": "Intent",
      "description": "Identifiez l'intention principale de la question.",
      "enum": [
        "acadimique information", "Admissions et inscriptions", "Services aux étudiants",
        "Droits et responsabilités des étudiants", "Activités étudiantes", "Services administratifs",
        "Vie sur le campus", "Autre"
      ],
      "type": "string"
    },
    "related_questions": {
      "title": "Related Questions",
      "description": "Une liste de questions similaires ou couramment posées en lien avec la question actuelle. Répondez dans la même langue que celle de la question d'origine.",
      "type": "array",
      "items": {
        "title": "RelatedQuestion",
        "type": "object",
        "properties": {
          "question1": { "type": "string" },
          "question2": { "type": "string" },
          "question3": { "type": "string" }
        }
      }
    }
  },
  "required": ["contentment", "main_answer", "intent"]
};

// System prompt
const SYSTEM_PROMPT = [
  "Vous êtes un assistant dans une école qui s'appelle l'École Nationale de l'Intelligence Artificielle et Digitale de Berkane, capable de répondre aux questions des étudiants.",
  "Soyez poli dans votre réponse. Si l'on vous salue, accueillez l'utilisateur avec une des expressions suivantes:",
  "En arabe: السلام عليكم - صباح الخير - مساء الخير - مرحباً بك - أهلاً وسهلاً - كيف يمكنني مساعدتك اليوم؟",
  "En français: Bonjour - Bonsoir - Salut - Bienvenue - Comment puis-je vous aider aujourd'hui?",
  "Pour vos réponses, variez vos phrases d'introduction au lieu d'utiliser toujours 'Merci pour votre question'. Utilisez différentes expressions comme:",
  "En arabe: أهلاً بك، يسعدني مساعدتك - شكراً على سؤالك - أفهم ما تقصد - سؤال جيد - طبعاً يمكنني مساعدتك",
  "En français: Je comprends votre demande - Je vous écoute - Bien sûr, je peux vous aider - C'est une excellente question - Je suis là pour vous aider",
  "Si l'utilisateur vous salue en arabe, répondez avec une salutation en arabe. Si la salutation est en français, répondez en français.",
  "Adaptez toujours votre réponse à la langue de la question (arabe ou français).",
  "Vérifiez les données attentivement lorsque vous répondez.",
  "Essayez d'éviter tous les mots et textes qui n'ont pas de sens dans ces données.",
  "Faites très attention à la langue dans laquelle la question est posée.",
  "Vous devez répondre dans la même langue que celle de la question.",
  "Ne répondez pas tant que vous n'êtes pas sûr de la langue de la question.",
  "Si c'est en arabe, répondez en arabe. Si c'est en français, répondez en français. Si c'est en anglais, répondez en anglais.",
  "Ignorez les éléments inutiles dans la question tels que les numéros de version ou de commande, et concentrez-vous uniquement sur la question.",
  "Faites attention aux fautes d'orthographe pour ne pas altérer votre compréhension.",
  "Extraire les détails JSON du texte conformément aux questions posées et aux spécifications Pydantic.",
  "Extraire les détails comme indiqué dans le texte. Vous pouvez les reformater, mais gardez le sens.",
  "Ne pas générer d'introduction ni de conclusion.",
  "repandre en paragraphe text",
  "n'oblier pas les questions similaires a la fin au moins deux mais Ils doivent être présentés avec le contexte du texte et ne doivent en aucun cas être mentionnés auparavant. Indiquez simplement à l'utilisateur que vous pouvez l'aider avec d'autres choses, puis posez des questions. ",
  "Ne vous limitez pas toujours à la première phrase de votre question, très bien, merci, mais diversifiez plutôt la phrase.",
].join('\n');

// Enhanced RAG Helper Functions
async function searchRAGDocuments(query, language = 'fr', limit = 5) {
  try {
    // Try external RAG system first (your friend's RAG_Project)
    const response = await axios.post(`${RAG_CONFIG.baseURL}/api/v1/nlp/index/search/${RAG_CONFIG.projectId}`, {
      text: query.trim(),
      limit: limit
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.signal === 'VECTORDB_SEARCH_SUCCESS') {
      console.log(`📚 External RAG found ${response.data.results?.length || 0} documents`);
      return response.data.results || [];
    }
  } catch (error) {
    console.warn('⚠️ External RAG system unavailable, using enhanced local fallback');
  }

  // Enhanced fallback with better document processing
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  const results = localRAGData.filter(doc => {
    const content = (doc.question + ' ' + doc.answer + ' ' + (doc.content || '')).toLowerCase();
    const score = searchTerms.reduce((acc, term) => {
      return acc + (content.includes(term) ? 1 : 0);
    }, 0);
    return score > 0;
  }).sort((a, b) => {
    // Sort by relevance score
    const scoreA = searchTerms.reduce((acc, term) => {
      const content = (a.question + ' ' + a.answer + ' ' + (a.content || '')).toLowerCase();
      return acc + (content.includes(term) ? 1 : 0);
    }, 0);
    const scoreB = searchTerms.reduce((acc, term) => {
      const content = (b.question + ' ' + b.answer + ' ' + (b.content || '')).toLowerCase();
      return acc + (content.includes(term) ? 1 : 0);
    }, 0);
    return scoreB - scoreA;
  }).slice(0, limit);

  console.log(`📚 Enhanced local RAG found ${results.length} documents`);
  return results.map(doc => ({
    content: doc.answer || doc.content || '',
    metadata: {
      question: doc.question || '',
      source: doc.source || 'local_enhanced',
      category: doc.category || 'general',
      relevance: 0.8
    }
  }));
}

// SMA Helper Functions
async function searchSMAWebIntelligence(query, language = 'fr') {
  if (!SMA_CONFIG.enabled) {
    console.log('🧠 SMA disabled, skipping web intelligence');
    return null;
  }

  try {
    console.log('🧠 Searching SMA web intelligence...');

    const response = await axios.post(`${SMA_CONFIG.baseURL}/api/search`, {
      query: query,
      language: language,
      sources: ['eniad.ump.ma', 'ump.ma'],
      max_results: 3
    }, {
      timeout: 30000,  // Increased timeout for web scraping
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success && response.data.results) {
      console.log(`🧠 SMA found ${response.data.results.length} web results`);
      return response.data;
    } else {
      console.warn('⚠️ SMA returned no results');
      return null;
    }
  } catch (error) {
    console.warn('⚠️ SMA web intelligence unavailable:', error.message);
  }

  return null;
}

// Enhanced Context Builder
function buildEnhancedContext(query, ragResults, smaResults, language) {
  let context = [];

  // Add RAG context
  if (ragResults && ragResults.length > 0) {
    context.push("=== INFORMATIONS DOCUMENTAIRES ENIAD ===");
    ragResults.forEach((result, index) => {
      context.push(`Document ${index + 1}:`);
      if (result.metadata?.question) {
        context.push(`Q: ${result.metadata.question}`);
      }
      context.push(`Contenu: ${result.content}`);
      context.push('---');
    });
  }

  // Add SMA context
  if (smaResults && smaResults.results && smaResults.results.length > 0) {
    context.push("=== INFORMATIONS WEB RÉCENTES (ENIAD/UMP) ===");
    smaResults.results.forEach((result, index) => {
      context.push(`Source ${index + 1}: ${result.title}`);
      context.push(`URL: ${result.url}`);
      context.push(`Contenu: ${result.content || result.summary || ''}`);
      context.push('---');
    });
  }

  if (context.length > 0) {
    return context.join('\n') + '\n\n';
  }

  return '';
}

// API Routes

// Health check
app.get('/health', async (req, res) => {
  try {
    // Test connection to Modal endpoint
    const testResponse = await axios.get(`${LLAMA3_CONFIG.baseURL.replace('/v1', '')}/health`, {
      timeout: 5000,
      headers: {
        'Authorization': `Bearer ${LLAMA3_CONFIG.apiKey}`
      }
    }).catch(() => null);

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      model: LLAMA3_CONFIG.model,
      modal_endpoint: LLAMA3_CONFIG.baseURL,
      modal_status: testResponse ? 'connected' : 'unreachable'
    });
  } catch (error) {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      model: LLAMA3_CONFIG.model,
      modal_endpoint: LLAMA3_CONFIG.baseURL,
      modal_status: 'error',
      modal_error: error.message
    });
  }
});

// Chat endpoint - Enhanced with RAG and SMA
app.post('/api/chat', async (req, res) => {
  try {
    console.log('📝 Received chat request:', {
      chatId: req.body.chatId,
      promptLength: req.body.prompt?.length || 0,
      enableSMA: req.body.enableSMA || false,
      enableRAG: req.body.enableRAG !== false,
      timestamp: new Date().toISOString()
    });

    const { chatId, prompt, enableSMA = false, enableRAG = true, language = 'fr' } = req.body;

    if (!chatId || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: chatId and prompt'
      });
    }

    // Get or create conversation history
    let conversation = conversations.get(chatId) || { messages: [] };

    // Step 0: Auto-correction
    let correctedPrompt = prompt;
    let correctionApplied = false;
    try {
      // Simple auto-correction for common typos
      const corrections = {
        'fr': {
          'queles': 'quels',
          'moduls': 'modules',
          'programes': 'programmes',
          'universite': 'université',
          'etudiant': 'étudiant',
          'etudiants': 'étudiants',
          'inscripton': 'inscription',
          'admision': 'admission'
        },
        'en': {
          'programms': 'programs',
          'universtiy': 'university',
          'studens': 'students',
          'admision': 'admission',
          'registraton': 'registration'
        },
        'ar': {
          'الجامعه': 'الجامعة',
          'البرامج': 'البرامج',
          'الطلاب': 'الطلاب'
        }
      };

      const langCorrections = corrections[language] || corrections['fr'];
      for (const [wrong, correct] of Object.entries(langCorrections)) {
        if (correctedPrompt.toLowerCase().includes(wrong.toLowerCase())) {
          correctedPrompt = correctedPrompt.replace(new RegExp(wrong, 'gi'), correct);
          correctionApplied = true;
        }
      }

      if (correctionApplied) {
        console.log('🔧 Auto-correction applied:', {
          original: prompt,
          corrected: correctedPrompt
        });
      }
    } catch (correctionError) {
      console.warn('⚠️ Auto-correction failed:', correctionError.message);
    }

    // Add user message
    const userMessage = {
      role: "user",
      content: correctedPrompt, // Use corrected prompt
      timestamp: Date.now()
    };
    conversation.messages.push(userMessage);

    // Step 1: Search RAG documents
    let ragResults = [];
    if (enableRAG) {
      console.log('📚 Searching RAG documents...');
      ragResults = await searchRAGDocuments(correctedPrompt, language, 5); // Use corrected prompt
    }

    // Step 2: Search SMA web intelligence
    let smaResults = null;
    if (enableSMA) {
      console.log('🧠 Searching SMA web intelligence...');
      smaResults = await searchSMAWebIntelligence(correctedPrompt, language); // Use corrected prompt
    }

    // Step 3: Build enhanced context
    const enhancedContext = buildEnhancedContext(prompt, ragResults, smaResults, language);

    // Step 4: Create enhanced prompt
    const enhancedPrompt = enhancedContext + prompt;

    // Prepare messages for the model with enhanced context
    const languageInstructions = {
      'fr': {
        context: "## CONTEXTE DISPONIBLE :",
        question: "## Question de l'utilisateur : ",
        instructions: "## Instructions de réponse :",
        rules: [
          "- Utilisez les informations du contexte ci-dessus pour enrichir votre réponse",
          "- Si des informations récentes sont disponibles, mentionnez-les",
          "- Citez les sources quand c'est pertinent",
          "- Répondez OBLIGATOIREMENT en français"
        ]
      },
      'en': {
        context: "## AVAILABLE CONTEXT:",
        question: "## User's question: ",
        instructions: "## Response instructions:",
        rules: [
          "- Use the context information above to enrich your response",
          "- If recent information is available, mention it",
          "- Cite sources when relevant",
          "- Respond MANDATORY in English"
        ]
      },
      'ar': {
        context: "## السياق المتاح:",
        question: "## سؤال المستخدم: ",
        instructions: "## تعليمات الإجابة:",
        rules: [
          "- استخدم معلومات السياق أعلاه لإثراء إجابتك",
          "- إذا كانت المعلومات الحديثة متاحة، اذكرها",
          "- اذكر المصادر عند الصلة",
          "- أجب بشكل إلزامي باللغة العربية"
        ]
      }
    };

    const langInstr = languageInstructions[language] || languageInstructions['fr'];

    const systemContent = [
      SYSTEM_PROMPT,
      "",
      enhancedContext ? langInstr.context : "",
      enhancedContext || "",
      langInstr.question + prompt,
      "",
      langInstr.instructions,
      ...langInstr.rules,
      "",
      "## Pydantic Details:",
      JSON.stringify(chatBotResponseSchema),
      "",
      "## Output text:"
    ].filter(line => line !== "").join('\n');

    const messages = [
      {
        role: "system",
        content: systemContent
      }
    ];

    console.log('📝 Enhanced prompt prepared:', {
      hasRAGContext: ragResults.length > 0,
      hasSMAContext: !!smaResults,
      contextLength: enhancedContext.length,
      ragDocuments: ragResults.length,
      smaResults: smaResults?.results?.length || 0
    });

    // Add conversation history (last 5 messages)
    const recentMessages = conversation.messages.slice(-5);
    recentMessages.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    console.log('🤖 Calling Llama3 model...');
    console.log('🔗 Modal endpoint:', LLAMA3_CONFIG.baseURL);

    let assistantMessage;

    try {
      // Call your Llama3 model with shorter timeout
      const response = await axios.post(`${LLAMA3_CONFIG.baseURL}/chat/completions`, {
        model: LLAMA3_CONFIG.model,
        messages: messages,
        temperature: 0.2,
        max_tokens: 1024,
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${LLAMA3_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      });

      assistantMessage = {
        role: "assistant",
        content: response.data.choices[0].message.content,
        timestamp: Date.now(),
        metadata: {
          ragDocuments: ragResults.length,
          smaResults: smaResults?.results?.length || 0,
          hasEnhancedContext: enhancedContext.length > 0,
          language: language,
          fallbackUsed: false,
          correctionApplied: correctionApplied,
          originalQuery: correctionApplied ? prompt : undefined,
          correctedQuery: correctionApplied ? correctedPrompt : undefined,
          sources: {
            rag: ragResults.map(r => r.metadata?.source || 'local'),
            sma: smaResults?.results?.map(r => r.url) || []
          }
        }
      };

      console.log('✅ Enhanced model response received:', {
        ragDocuments: ragResults.length,
        smaResults: smaResults?.results?.length || 0
      });

    } catch (modelError) {
      console.error('❌ Modal endpoint error:', {
        message: modelError.message,
        status: modelError.response?.status,
        statusText: modelError.response?.statusText,
        isTimeout: modelError.code === 'ECONNABORTED'
      });

      // Fallback response when Modal is unavailable
      const fallbackContent = {
        contentment: language === 'ar' ?
          'أعتذر، أواجه مشكلة تقنية مؤقتة' :
          language === 'en' ?
          'I apologize, I\'m experiencing a temporary technical issue' :
          'Je m\'excuse, je rencontre un problème technique temporaire',
        main_answer: language === 'ar' ?
          'نظام الذكاء الاصطناعي غير متاح حالياً. يرجى المحاولة مرة أخرى لاحقاً أو التواصل مع الدعم التقني.' :
          language === 'en' ?
          'The AI system is currently unavailable. Please try again later or contact technical support.' :
          'Le système d\'IA n\'est actuellement pas disponible. Veuillez réessayer plus tard ou contacter le support technique.',
        details: language === 'ar' ?
          'نحن نعمل على حل هذه المشكلة في أقرب وقت ممكن.' :
          language === 'en' ?
          'We are working to resolve this issue as soon as possible.' :
          'Nous travaillons à résoudre ce problème dans les plus brefs délais.',
        intent: 'Autre',
        related_questions: [{
          question1: language === 'ar' ? 'كيف يمكنني التواصل مع الدعم التقني؟' :
                     language === 'en' ? 'How can I contact technical support?' :
                     'Comment puis-je contacter le support technique?',
          question2: language === 'ar' ? 'متى سيعود النظام للعمل؟' :
                     language === 'en' ? 'When will the system be back online?' :
                     'Quand le système sera-t-il de nouveau en ligne?',
          question3: language === 'ar' ? 'هل يمكنني الحصول على المساعدة بطريقة أخرى؟' :
                     language === 'en' ? 'Can I get help in another way?' :
                     'Puis-je obtenir de l\'aide d\'une autre manière?'
        }]
      };

      assistantMessage = {
        role: "assistant",
        content: JSON.stringify(fallbackContent),
        timestamp: Date.now(),
        fallback: true,
        error: modelError.message,
        metadata: {
          ragDocuments: ragResults.length,
          smaResults: smaResults?.results?.length || 0,
          language: language,
          fallbackUsed: true,
          correctionApplied: correctionApplied,
          originalQuery: correctionApplied ? prompt : undefined,
          correctedQuery: correctionApplied ? correctedPrompt : undefined,
          sources: {
            rag: ragResults.map(r => r.metadata?.source || 'local'),
            sma: smaResults?.results?.map(r => r.url) || []
          }
        }
      };

      console.log('🔄 Using fallback response');
    }

    // Save assistant message to conversation
    conversation.messages.push(assistantMessage);
    conversations.set(chatId, conversation);

    console.log('✅ Response generated successfully');

    res.json({
      success: true,
      data: assistantMessage
    });

  } catch (error) {
    console.error('❌ Chat API error:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Test Modal connection
app.get('/api/test-modal', async (req, res) => {
  try {
    console.log('🧪 Testing Modal connection...');

    const testResponse = await axios.post(`${LLAMA3_CONFIG.baseURL}/chat/completions`, {
      model: LLAMA3_CONFIG.model,
      messages: [
        {
          role: "user",
          content: "Hello, this is a connection test."
        }
      ],
      temperature: 0.2,
      max_tokens: 50,
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${LLAMA3_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 seconds
    });

    res.json({
      success: true,
      modal_status: 'connected',
      response: testResponse.data,
      endpoint: LLAMA3_CONFIG.baseURL
    });

  } catch (error) {
    console.error('❌ Modal test failed:', error.message);

    res.json({
      success: false,
      modal_status: 'failed',
      error: error.message,
      endpoint: LLAMA3_CONFIG.baseURL,
      details: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        isTimeout: error.code === 'ECONNABORTED',
        isNetworkError: !error.response
      }
    });
  }
});

// Get conversation history
app.get('/api/chat/:chatId', (req, res) => {
  const { chatId } = req.params;
  const conversation = conversations.get(chatId);

  if (!conversation) {
    return res.status(404).json({
      success: false,
      error: 'Conversation not found'
    });
  }

  res.json({
    success: true,
    data: conversation
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ENIAD API Server running on http://localhost:${PORT}`);
  console.log(`🤖 Model: ${LLAMA3_CONFIG.model}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
});
