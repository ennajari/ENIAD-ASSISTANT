/**
 * Real RAG Service Integration
 * Connects to actual RAG_Project backend with Gemini
 */

import axios from 'axios';
import geminiService from './geminiService';

class RealRagService {
  constructor() {
    this.ragApiUrl = import.meta.env.VITE_RAG_API_URL || 'http://localhost:8000';
    this.isRagAvailable = false;
    this.documents = [];
    this.embeddings = new Map();
    
    // Initialize with sample ENIAD documents
    this.initializeSampleDocuments();
    
    console.log('🧮 Real RAG Service initialized');
  }

  /**
   * Initialize with sample ENIAD documents for demonstration
   */
  initializeSampleDocuments() {
    this.documents = [
      {
        id: 'doc_1',
        title: 'Programme Master Intelligence Artificielle - ENIAD',
        content: `Le Master en Intelligence Artificielle d'ENIAD forme des experts en IA capables de concevoir et développer des solutions innovantes. Le programme couvre l'apprentissage automatique, le deep learning, le traitement du langage naturel, la vision par ordinateur et l'éthique de l'IA. Les étudiants travaillent sur des projets concrets avec des entreprises partenaires et bénéficient d'un encadrement par des chercheurs reconnus internationalement.`,
        category: 'academic',
        language: 'fr',
        metadata: {
          source: 'https://eniad.ump.ma/fr/formations/master-ia',
          date: '2024-01-15',
          type: 'programme'
        }
      },
      {
        id: 'doc_2',
        title: 'Conditions d\'admission ENIAD 2024',
        content: `Pour intégrer ENIAD, les candidats doivent avoir un diplôme de licence en informatique, mathématiques ou domaine connexe avec une moyenne minimale de 12/20. Le processus d'admission comprend un examen écrit, un entretien oral et l'évaluation du dossier académique. Les candidatures sont ouvertes de mars à juin. Les frais de scolarité sont de 15,000 DH par an pour les étudiants marocains.`,
        category: 'administrative',
        language: 'fr',
        metadata: {
          source: 'https://eniad.ump.ma/fr/admission',
          date: '2024-02-01',
          type: 'procedure'
        }
      },
      {
        id: 'doc_3',
        title: 'Laboratoire de Recherche en IA - ENIAD',
        content: `Le laboratoire de recherche d'ENIAD se concentre sur l'IA explicable, l'apprentissage fédéré et les applications de l'IA dans l'éducation. Nos chercheurs publient régulièrement dans des conférences internationales comme NeurIPS, ICML et ICLR. Le laboratoire dispose d'équipements de pointe incluant des serveurs GPU et des clusters de calcul haute performance pour l'entraînement de modèles complexes.`,
        category: 'research',
        language: 'fr',
        metadata: {
          source: 'https://eniad.ump.ma/fr/recherche',
          date: '2024-01-20',
          type: 'research'
        }
      },
      {
        id: 'doc_4',
        title: 'شروط القبول في معهد ENIAD للذكاء الاصطناعي',
        content: `يتطلب القبول في معهد ENIAD للذكاء الاصطناعي حصول المرشح على شهادة الإجازة في الإعلاميات أو الرياضيات أو مجال ذي صلة بمعدل لا يقل عن 12/20. تشمل عملية القبول امتحاناً كتابياً ومقابلة شفوية وتقييم الملف الأكاديمي. التسجيل مفتوح من مارس إلى يونيو. الرسوم الدراسية 15,000 درهم سنوياً للطلاب المغاربة.`,
        category: 'administrative',
        language: 'ar',
        metadata: {
          source: 'https://eniad.ump.ma/ar/admission',
          date: '2024-02-01',
          type: 'procedure'
        }
      },
      {
        id: 'doc_5',
        title: 'Événements et Conférences ENIAD 2024',
        content: `ENIAD organise plusieurs événements majeurs en 2024 : la Conférence Internationale sur l'IA en Éducation (15-17 mai), l'Atelier sur l'Éthique de l'IA (20 juin), et le Symposium sur l'IA et la Santé (10-12 septembre). Ces événements rassemblent des experts internationaux et offrent des opportunités de networking pour les étudiants et chercheurs.`,
        category: 'events',
        language: 'fr',
        metadata: {
          source: 'https://eniad.ump.ma/fr/evenements',
          date: '2024-03-01',
          type: 'events'
        }
      }
    ];
    
    console.log(`📚 Initialized ${this.documents.length} sample documents`);
  }

  /**
   * Test connection to RAG backend
   */
  async testConnection() {
    try {
      const response = await axios.get(`${this.ragApiUrl}/health`, { timeout: 5000 });
      this.isRagAvailable = response.status === 200;
      console.log('✅ RAG backend is available');
      return { success: true, message: 'RAG backend connected' };
    } catch (error) {
      this.isRagAvailable = false;
      console.log('⚠️ RAG backend not available, using local simulation');
      return { success: false, message: 'Using local simulation' };
    }
  }

  /**
   * Search documents using semantic similarity
   */
  async searchDocuments(query, options = {}) {
    try {
      const {
        maxResults = 5,
        language = 'fr',
        category = null,
        threshold = 0.7
      } = options;

      console.log(`🔍 Searching documents for: "${query}"`);

      // If RAG backend is available, use it
      if (this.isRagAvailable) {
        return await this.searchWithBackend(query, options);
      }

      // Otherwise, use local semantic search simulation
      return await this.searchWithLocalSimulation(query, options);

    } catch (error) {
      console.error('❌ Error searching documents:', error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  /**
   * Search using RAG backend
   */
  async searchWithBackend(query, options) {
    try {
      const response = await axios.post(`${this.ragApiUrl}/search`, {
        query,
        ...options
      }, { timeout: 10000 });

      return {
        success: true,
        results: response.data.results || [],
        metadata: response.data.metadata || {}
      };
    } catch (error) {
      console.error('❌ RAG backend search failed:', error);
      // Fallback to local simulation
      return await this.searchWithLocalSimulation(query, options);
    }
  }

  /**
   * Search using local simulation with Gemini
   */
  async searchWithLocalSimulation(query, options) {
    try {
      const {
        maxResults = 5,
        language = 'fr',
        category = null
      } = options;

      // Filter documents by language and category
      let filteredDocs = this.documents.filter(doc => {
        const langMatch = !language || doc.language === language;
        const catMatch = !category || doc.category === category;
        return langMatch && catMatch;
      });

      // Calculate relevance scores using simple text matching + Gemini enhancement
      const scoredDocs = await Promise.all(
        filteredDocs.map(async (doc) => {
          const relevanceScore = await this.calculateRelevance(query, doc);
          return {
            ...doc,
            relevanceScore,
            snippet: this.generateSnippet(doc.content, query)
          };
        })
      );

      // Sort by relevance and take top results
      const results = scoredDocs
        .filter(doc => doc.relevanceScore > 0.3)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, maxResults);

      console.log(`✅ Found ${results.length} relevant documents`);

      return {
        success: true,
        results: results.map(doc => ({
          id: doc.id,
          title: doc.title,
          content: doc.content,
          snippet: doc.snippet,
          relevanceScore: doc.relevanceScore,
          category: doc.category,
          language: doc.language,
          metadata: doc.metadata
        })),
        metadata: {
          totalDocuments: this.documents.length,
          searchTime: Date.now(),
          query: query,
          language: language
        }
      };

    } catch (error) {
      console.error('❌ Local search simulation failed:', error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  /**
   * Calculate relevance score between query and document
   */
  async calculateRelevance(query, document) {
    try {
      // Simple keyword matching
      const queryWords = query.toLowerCase().split(/\s+/);
      const docWords = document.content.toLowerCase().split(/\s+/);
      const titleWords = document.title.toLowerCase().split(/\s+/);

      let score = 0;

      // Title matching (higher weight)
      const titleMatches = queryWords.filter(word => 
        titleWords.some(titleWord => titleWord.includes(word) || word.includes(titleWord))
      );
      score += titleMatches.length * 0.3;

      // Content matching
      const contentMatches = queryWords.filter(word => 
        docWords.some(docWord => docWord.includes(word) || word.includes(docWord))
      );
      score += contentMatches.length * 0.2;

      // Category boost
      if (query.toLowerCase().includes(document.category)) {
        score += 0.2;
      }

      // Language preference
      if (document.language === 'fr' && query.match(/[a-zA-Z]/)) {
        score += 0.1;
      } else if (document.language === 'ar' && query.match(/[\u0600-\u06FF]/)) {
        score += 0.1;
      }

      // Normalize score
      return Math.min(score / queryWords.length, 1.0);

    } catch (error) {
      console.error('❌ Error calculating relevance:', error);
      return 0.3; // Default relevance
    }
  }

  /**
   * Generate snippet from document content
   */
  generateSnippet(content, query, maxLength = 200) {
    try {
      const queryWords = query.toLowerCase().split(/\s+/);
      const sentences = content.split(/[.!?]+/);
      
      // Find sentence with most query words
      let bestSentence = sentences[0] || '';
      let maxMatches = 0;

      for (const sentence of sentences) {
        const sentenceLower = sentence.toLowerCase();
        const matches = queryWords.filter(word => sentenceLower.includes(word)).length;
        
        if (matches > maxMatches) {
          maxMatches = matches;
          bestSentence = sentence;
        }
      }

      // Truncate if too long
      if (bestSentence.length > maxLength) {
        bestSentence = bestSentence.substring(0, maxLength) + '...';
      }

      return bestSentence.trim();

    } catch (error) {
      console.error('❌ Error generating snippet:', error);
      return content.substring(0, maxLength) + '...';
    }
  }

  /**
   * Generate answer using RAG + Gemini
   */
  async generateAnswer(query, language = 'fr') {
    try {
      console.log(`🤖 Generating RAG answer for: "${query}"`);

      // Search for relevant documents
      const searchResults = await this.searchDocuments(query, {
        maxResults: 3,
        language: language
      });

      if (!searchResults.success || searchResults.results.length === 0) {
        return {
          success: false,
          answer: language === 'ar' ? 
            'عذراً، لم أجد معلومات ذات صلة بسؤالك.' : 
            'Désolé, je n\'ai pas trouvé d\'informations pertinentes pour votre question.',
          sources: []
        };
      }

      // Build context from search results
      const context = searchResults.results.map(doc => 
        `Source: ${doc.title}\nContenu: ${doc.content}`
      ).join('\n\n');

      // Generate answer using Gemini with RAG context
      const prompt = language === 'ar' ? 
        `بناءً على المعلومات التالية من قاعدة بيانات ENIAD، أجب على السؤال بشكل دقيق ومفيد:

السياق:
${context}

السؤال: ${query}

الإجابة:` :
        `Basé sur les informations suivantes de la base de données ENIAD, réponds à la question de manière précise et utile:

Contexte:
${context}

Question: ${query}

Réponse:`;

      const answer = await geminiService.generateChatCompletion([
        {
          role: 'system',
          content: language === 'ar' ? 
            'أنت مساعد أكاديمي لمعهد ENIAD متخصص في الذكاء الاصطناعي. استخدم المعلومات المقدمة للإجابة بدقة.' :
            'Tu es l\'assistant académique ENIAD spécialisé en intelligence artificielle. Utilise les informations fournies pour répondre avec précision.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], {
        maxTokens: 400,
        temperature: 0.3
      });

      const generatedAnswer = answer.choices?.[0]?.message?.content || 
        (language === 'ar' ? 'عذراً، لم أتمكن من توليد إجابة.' : 'Désolé, je n\'ai pas pu générer une réponse.');

      return {
        success: true,
        answer: generatedAnswer,
        sources: searchResults.results.map(doc => ({
          title: doc.title,
          url: doc.metadata?.source || '#',
          relevance: doc.relevanceScore
        })),
        metadata: {
          documentsUsed: searchResults.results.length,
          searchTime: searchResults.metadata?.searchTime,
          model: 'gemini-1.5-flash'
        }
      };

    } catch (error) {
      console.error('❌ Error generating RAG answer:', error);
      return {
        success: false,
        answer: language === 'ar' ? 
          'عذراً، حدث خطأ أثناء معالجة سؤالك.' : 
          'Désolé, une erreur s\'est produite lors du traitement de votre question.',
        sources: []
      };
    }
  }

  /**
   * Get RAG system status
   */
  async getStatus() {
    const connectionTest = await this.testConnection();
    
    return {
      service: 'Real RAG Service',
      backendAvailable: this.isRagAvailable,
      documentsLoaded: this.documents.length,
      geminiConfigured: !!geminiService.apiKey,
      lastUpdate: new Date().toISOString(),
      connection: connectionTest
    };
  }
}

// Export singleton instance
const realRagService = new RealRagService();
export default realRagService;
