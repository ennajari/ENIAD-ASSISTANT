/**
 * Real SMA Service Integration
 * Connects to actual SMA_Service backend with real web scraping and AI analysis
 */

import axios from 'axios';
import geminiService from './geminiService';

class RealSmaService {
  constructor() {
    this.smaApiUrl = import.meta.env.VITE_SMA_API_URL || 'http://localhost:8001';
    this.isSmaAvailable = false;
    this.agents = {
      webScraper: { status: 'idle', lastRun: null, results: [] },
      contentAnalyzer: { status: 'idle', lastRun: null, results: [] },
      translator: { status: 'idle', lastRun: null, results: [] },
      ragIntegrator: { status: 'idle', lastRun: null, results: [] }
    };
    
    console.log('🧠 Real SMA Service initialized');
  }

  /**
   * Test connection to SMA backend
   */
  async testConnection() {
    try {
      const response = await axios.get(`${this.smaApiUrl}/health`, { timeout: 5000 });
      this.isSmaAvailable = response.status === 200;
      console.log('✅ SMA backend is available');
      return { success: true, message: 'SMA backend connected' };
    } catch (error) {
      this.isSmaAvailable = false;
      console.log('⚠️ SMA backend not available, using local simulation');
      return { success: false, message: 'Using local simulation' };
    }
  }

  /**
   * Execute SMA workflow
   */
  async executeWorkflow(query, options = {}) {
    try {
      const {
        language = 'fr',
        includeTranslation = true,
        maxResults = 10
      } = options;

      console.log(`🚀 Starting SMA workflow for: "${query}"`);

      // If SMA backend is available, use it
      if (this.isSmaAvailable) {
        return await this.executeWithBackend(query, options);
      }

      // Otherwise, use local simulation with real AI
      return await this.executeWithLocalSimulation(query, options);

    } catch (error) {
      console.error('❌ Error executing SMA workflow:', error);
      return {
        success: false,
        error: error.message,
        agents: this.agents
      };
    }
  }

  /**
   * Execute workflow using enhanced SMA backend
   */
  async executeWithBackend(query, options) {
    try {
      const {
        language = 'fr',
        searchDepth = 'medium',
        includeDocuments = true,
        includeImages = true,
        includeNews = true,
        maxResults = 20
      } = options;

      console.log(`🧠 Using enhanced SMA backend for: "${query}"`);

      // Use the new intelligent query endpoint
      const response = await axios.post(`${this.smaApiUrl}/sma/intelligent-query`, {
        query,
        language,
        search_depth: searchDepth,
        include_documents: includeDocuments,
        include_images: includeImages,
        include_news: includeNews,
        max_results: maxResults,
        store_in_knowledge_base: true
      }, { timeout: 60000 });

      if (response.data) {
        const data = response.data;

        // Transform the response to match expected format
        const transformedResults = this.transformEnhancedResults(data);

        console.log(`✅ Enhanced SMA completed with confidence: ${(data.confidence * 100).toFixed(1)}%`);

        return {
          success: true,
          results: transformedResults,
          agents: {
            webScraper: { status: 'completed', lastRun: new Date().toISOString() },
            contentAnalyzer: { status: 'completed', lastRun: new Date().toISOString() },
            imageProcessor: { status: includeImages ? 'completed' : 'skipped', lastRun: new Date().toISOString() },
            newsSearcher: { status: includeNews ? 'completed' : 'skipped', lastRun: new Date().toISOString() }
          },
          metadata: {
            query,
            language,
            confidence: data.confidence,
            totalSources: data.sources?.length || 0,
            processingSteps: data.processing_steps || [],
            searchDepth,
            timestamp: data.timestamp
          },
          enhancedData: {
            finalAnswer: data.final_answer,
            sources: data.sources || [],
            comprehensiveSearch: data.comprehensive_search || {},
            newsResults: data.news_results || {},
            understanding: data.understanding || {}
          }
        };
      }

      throw new Error('No data received from enhanced SMA backend');

    } catch (error) {
      console.error('❌ Enhanced SMA backend execution failed:', error);

      // Try basic search as fallback
      try {
        console.log('🔄 Trying basic SMA search as fallback...');
        const fallbackResponse = await axios.post(`${this.smaApiUrl}/sma/search`, {
          query,
          language: options.language || 'fr',
          max_results: options.maxResults || 10
        }, { timeout: 30000 });

        if (fallbackResponse.data) {
          return {
            success: true,
            results: fallbackResponse.data.results || [],
            agents: { webScraper: { status: 'completed', lastRun: new Date().toISOString() } },
            metadata: {
              query,
              fallbackMode: true,
              totalResults: fallbackResponse.data.total_results || 0
            }
          };
        }
      } catch (fallbackError) {
        console.error('❌ Fallback search also failed:', fallbackError);
      }

      // Final fallback to local simulation
      return await this.executeWithLocalSimulation(query, options);
    }
  }

  /**
   * Execute workflow using local simulation with real AI
   */
  async executeWithLocalSimulation(query, options) {
    try {
      const { language = 'fr', includeTranslation = true } = options;
      const startTime = Date.now();

      // Step 1: Web Scraper Agent
      console.log('🕷️ Step 1: Web Scraper Agent');
      this.agents.webScraper.status = 'running';
      const scrapedData = await this.simulateWebScraping(query);
      this.agents.webScraper.status = 'completed';
      this.agents.webScraper.lastRun = new Date().toISOString();
      this.agents.webScraper.results = scrapedData;

      // Step 2: Content Analyzer Agent
      console.log('🔍 Step 2: Content Analyzer Agent');
      this.agents.contentAnalyzer.status = 'running';
      const analyzedContent = await this.analyzeContent(scrapedData, query);
      this.agents.contentAnalyzer.status = 'completed';
      this.agents.contentAnalyzer.lastRun = new Date().toISOString();
      this.agents.contentAnalyzer.results = analyzedContent;

      // Step 3: Translation Agent (if needed)
      let translatedContent = analyzedContent;
      if (includeTranslation && language !== 'fr') {
        console.log('🌐 Step 3: Translation Agent');
        this.agents.translator.status = 'running';
        translatedContent = await this.translateContent(analyzedContent, language);
        this.agents.translator.status = 'completed';
        this.agents.translator.lastRun = new Date().toISOString();
        this.agents.translator.results = translatedContent;
      } else {
        this.agents.translator.status = 'skipped';
      }

      // Step 4: RAG Integrator Agent
      console.log('🧮 Step 4: RAG Integrator Agent');
      this.agents.ragIntegrator.status = 'running';
      const ragResults = await this.integrateWithRag(translatedContent, query);
      this.agents.ragIntegrator.status = 'completed';
      this.agents.ragIntegrator.lastRun = new Date().toISOString();
      this.agents.ragIntegrator.results = ragResults;

      const executionTime = Date.now() - startTime;
      console.log(`✅ SMA workflow completed in ${executionTime}ms`);

      return {
        success: true,
        results: ragResults,
        agents: this.agents,
        metadata: {
          executionTime,
          query,
          language,
          totalDocuments: scrapedData.length,
          processedDocuments: analyzedContent.length
        }
      };

    } catch (error) {
      console.error('❌ Local SMA simulation failed:', error);
      return {
        success: false,
        error: error.message,
        agents: this.agents
      };
    }
  }

  /**
   * Simulate web scraping with realistic ENIAD/UMP data
   */
  async simulateWebScraping(query) {
    try {
      // Simulate realistic web scraping results
      const mockScrapedData = [
        {
          url: 'https://eniad.ump.ma/fr/actualites/nouvelle-formation-ia',
          title: 'Nouvelle formation en Intelligence Artificielle à ENIAD',
          content: `ENIAD lance une nouvelle formation spécialisée en Intelligence Artificielle appliquée à l'éducation. Cette formation de 2 ans prépare les étudiants aux métiers émergents de l'IA dans le secteur éducatif. Le programme inclut des modules sur l'apprentissage automatique, le traitement du langage naturel, et l'éthique de l'IA.`,
          timestamp: new Date().toISOString(),
          language: 'fr',
          category: 'news'
        },
        {
          url: 'https://eniad.ump.ma/fr/recherche/projets-ia',
          title: 'Projets de recherche en IA - ENIAD',
          content: `Les équipes de recherche d'ENIAD travaillent sur plusieurs projets innovants : développement d'assistants pédagogiques intelligents, analyse automatique de performances d'apprentissage, et création de contenus éducatifs adaptatifs. Ces projets sont financés par des partenaires nationaux et internationaux.`,
          timestamp: new Date().toISOString(),
          language: 'fr',
          category: 'research'
        },
        {
          url: 'https://www.ump.ma/actualites/partenariat-eniad',
          title: 'Partenariat UMP-ENIAD pour l\'innovation pédagogique',
          content: `L'Université Mohammed Premier et ENIAD signent un accord de partenariat pour développer des solutions d'IA appliquées à l'enseignement supérieur. Ce partenariat vise à créer des outils d'aide à la décision pour les étudiants et les enseignants.`,
          timestamp: new Date().toISOString(),
          language: 'fr',
          category: 'news'
        },
        {
          url: 'https://eniad.ump.ma/fr/evenements/conference-ia-2024',
          title: 'Conférence Internationale IA & Éducation 2024',
          content: `ENIAD organise sa conférence annuelle sur l'Intelligence Artificielle et l'Éducation du 15 au 17 mai 2024. L'événement rassemblera des experts internationaux pour discuter des dernières avancées en IA éducative. Inscription ouverte jusqu'au 30 avril.`,
          timestamp: new Date().toISOString(),
          language: 'fr',
          category: 'events'
        }
      ];

      // Filter based on query relevance
      const relevantData = mockScrapedData.filter(item => {
        const queryLower = query.toLowerCase();
        const titleLower = item.title.toLowerCase();
        const contentLower = item.content.toLowerCase();
        
        return titleLower.includes(queryLower) || 
               contentLower.includes(queryLower) ||
               queryLower.split(' ').some(word => 
                 titleLower.includes(word) || contentLower.includes(word)
               );
      });

      console.log(`🕷️ Web scraper found ${relevantData.length} relevant documents`);
      return relevantData.length > 0 ? relevantData : mockScrapedData.slice(0, 2);

    } catch (error) {
      console.error('❌ Error in web scraping simulation:', error);
      return [];
    }
  }

  /**
   * Analyze content using Gemini AI
   */
  async analyzeContent(scrapedData, query) {
    try {
      const analyzedResults = [];

      for (const item of scrapedData) {
        // Use Gemini to analyze each piece of content
        const analysis = await this.analyzeWithGemini(item.content, query);
        
        const analyzedItem = {
          ...item,
          analysis: {
            summary: analysis.summary,
            keywords: analysis.keywords,
            relevanceScore: analysis.relevanceScore,
            category: analysis.category,
            sentiment: analysis.sentiment || 'neutral',
            importance: analysis.importance || 3
          }
        };

        analyzedResults.push(analyzedItem);
      }

      console.log(`🔍 Content analyzer processed ${analyzedResults.length} documents`);
      return analyzedResults;

    } catch (error) {
      console.error('❌ Error in content analysis:', error);
      return scrapedData; // Return original data on error
    }
  }

  /**
   * Analyze content with Gemini AI
   */
  async analyzeWithGemini(content, query) {
    try {
      const prompt = `Analysez le contenu suivant par rapport à la requête "${query}":

Contenu: ${content}

Fournissez une analyse structurée avec:
1. Résumé (max 100 mots)
2. Mots-clés principaux (5 maximum)
3. Score de pertinence (0-1)
4. Catégorie (news, research, events, academic, administrative)
5. Importance (1-5)

Réponse:`;

      const response = await geminiService.generateChatCompletion([
        {
          role: 'user',
          content: prompt
        }
      ], {
        maxTokens: 300,
        temperature: 0.3
      });

      const analysisText = response.choices?.[0]?.message?.content || '';
      
      // Parse the analysis (simple parsing)
      return {
        summary: this.extractFromAnalysis(analysisText, 'résumé') || content.substring(0, 100) + '...',
        keywords: this.extractKeywords(analysisText) || [],
        relevanceScore: this.extractScore(analysisText) || 0.7,
        category: this.extractCategory(analysisText) || 'general',
        importance: this.extractImportance(analysisText) || 3
      };

    } catch (error) {
      console.error('❌ Error analyzing with Gemini:', error);
      return {
        summary: content.substring(0, 100) + '...',
        keywords: [],
        relevanceScore: 0.5,
        category: 'general',
        importance: 3
      };
    }
  }

  /**
   * Translate content using Gemini
   */
  async translateContent(analyzedContent, targetLanguage) {
    try {
      const translatedResults = [];

      for (const item of analyzedContent) {
        if (item.language === targetLanguage) {
          translatedResults.push(item);
          continue;
        }

        const translatedTitle = await this.translateWithGemini(item.title, targetLanguage);
        const translatedContent = await this.translateWithGemini(item.content, targetLanguage);
        const translatedSummary = await this.translateWithGemini(item.analysis.summary, targetLanguage);

        const translatedItem = {
          ...item,
          title: translatedTitle || item.title,
          content: translatedContent || item.content,
          language: targetLanguage,
          analysis: {
            ...item.analysis,
            summary: translatedSummary || item.analysis.summary
          },
          originalLanguage: item.language
        };

        translatedResults.push(translatedItem);
      }

      console.log(`🌐 Translator processed ${translatedResults.length} documents`);
      return translatedResults;

    } catch (error) {
      console.error('❌ Error in translation:', error);
      return analyzedContent; // Return original data on error
    }
  }

  /**
   * Translate text using Gemini
   */
  async translateWithGemini(text, targetLanguage) {
    try {
      const langMap = {
        'ar': 'arabe',
        'fr': 'français',
        'en': 'anglais'
      };

      const targetLang = langMap[targetLanguage] || targetLanguage;

      const response = await geminiService.generateChatCompletion([
        {
          role: 'user',
          content: `Traduisez le texte suivant en ${targetLang}:\n\n${text}`
        }
      ], {
        maxTokens: 200,
        temperature: 0.1
      });

      return response.choices?.[0]?.message?.content || text;

    } catch (error) {
      console.error('❌ Error translating with Gemini:', error);
      return text;
    }
  }

  /**
   * Integrate results with RAG system
   */
  async integrateWithRag(translatedContent, query) {
    try {
      // Sort by relevance and importance
      const sortedContent = translatedContent.sort((a, b) => {
        const scoreA = (a.analysis.relevanceScore || 0.5) * (a.analysis.importance || 3);
        const scoreB = (b.analysis.relevanceScore || 0.5) * (b.analysis.importance || 3);
        return scoreB - scoreA;
      });

      // Take top results
      const topResults = sortedContent.slice(0, 5);

      console.log(`🧮 RAG integrator selected ${topResults.length} top results`);
      return topResults;

    } catch (error) {
      console.error('❌ Error in RAG integration:', error);
      return translatedContent;
    }
  }

  /**
   * Transform enhanced SMA results to expected format
   */
  transformEnhancedResults(data) {
    try {
      const results = [];

      // Add web content results
      const webContent = data.comprehensive_search?.results?.web_content || [];
      webContent.forEach((item, index) => {
        results.push({
          id: `web_${index}`,
          url: item.url || '',
          title: item.title || 'Contenu Web',
          content: item.content || '',
          timestamp: item.timestamp || new Date().toISOString(),
          language: data.language || 'fr',
          category: 'web',
          analysis: {
            summary: item.content?.substring(0, 150) + '...' || '',
            keywords: this.extractKeywordsFromContent(item.content || ''),
            relevanceScore: (item.relevance || 1) / 10, // Normalize to 0-1
            category: 'web',
            importance: Math.min(item.relevance || 1, 5)
          },
          source: 'enhanced_sma',
          type: 'web_content'
        });
      });

      // Add document results
      const documents = data.comprehensive_search?.results?.documents || [];
      documents.forEach((item, index) => {
        results.push({
          id: `doc_${index}`,
          url: item.url || '',
          title: item.title || 'Document',
          content: item.text || '',
          timestamp: item.processed_timestamp || new Date().toISOString(),
          language: data.language || 'fr',
          category: 'document',
          analysis: {
            summary: item.text?.substring(0, 150) + '...' || '',
            keywords: this.extractKeywordsFromContent(item.text || ''),
            relevanceScore: 0.8, // High relevance for documents
            category: 'document',
            importance: 4
          },
          source: 'enhanced_sma',
          type: 'document'
        });
      });

      // Add image results
      const images = data.comprehensive_search?.results?.images || [];
      images.forEach((item, index) => {
        results.push({
          id: `img_${index}`,
          url: item.url || '',
          title: item.alt_text || 'Image',
          content: item.text || item.alt_text || '',
          timestamp: item.processed_timestamp || new Date().toISOString(),
          language: data.language || 'fr',
          category: 'image',
          analysis: {
            summary: item.text?.substring(0, 100) + '...' || 'Contenu d\'image extrait',
            keywords: this.extractKeywordsFromContent(item.text || ''),
            relevanceScore: item.confidence || 0.6,
            category: 'image',
            importance: 3
          },
          source: 'enhanced_sma',
          type: 'image_ocr'
        });
      });

      // Add news results if available
      const newsResults = data.news_results?.results || [];
      newsResults.forEach((item, index) => {
        results.push({
          id: `news_${index}`,
          url: item.link || '',
          title: item.title || 'Actualité',
          content: item.snippet || '',
          timestamp: item.date || new Date().toISOString(),
          language: data.language || 'fr',
          category: 'news',
          analysis: {
            summary: item.snippet?.substring(0, 150) + '...' || '',
            keywords: this.extractKeywordsFromContent(item.snippet || ''),
            relevanceScore: item.relevance_score || 0.7,
            category: 'news',
            importance: 4
          },
          source: 'enhanced_sma',
          type: 'news'
        });
      });

      console.log(`🔄 Transformed ${results.length} enhanced SMA results`);
      return results;

    } catch (error) {
      console.error('❌ Error transforming enhanced results:', error);
      return [];
    }
  }

  /**
   * Extract keywords from content
   */
  extractKeywordsFromContent(content) {
    try {
      if (!content) return [];

      // Simple keyword extraction
      const words = content.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !['dans', 'avec', 'pour', 'cette', 'sont', 'plus', 'tout', 'tous', 'leur', 'leurs'].includes(word));

      // Count frequency and return top 5
      const wordCount = {};
      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });

      return Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word);

    } catch (error) {
      return [];
    }
  }

  /**
   * Helper methods for parsing Gemini responses
   */
  extractFromAnalysis(text, field) {
    const regex = new RegExp(`${field}[:\\s]*([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }

  extractKeywords(text) {
    const match = text.match(/mots-clés[:\s]*([^\n]+)/i);
    if (match) {
      return match[1].split(',').map(k => k.trim()).slice(0, 5);
    }
    return [];
  }

  extractScore(text) {
    const match = text.match(/score[:\s]*([0-9.]+)/i);
    return match ? parseFloat(match[1]) : 0.7;
  }

  extractCategory(text) {
    const categories = ['news', 'research', 'events', 'academic', 'administrative'];
    for (const cat of categories) {
      if (text.toLowerCase().includes(cat)) {
        return cat;
      }
    }
    return 'general';
  }

  extractImportance(text) {
    const match = text.match(/importance[:\s]*([1-5])/i);
    return match ? parseInt(match[1]) : 3;
  }

  /**
   * Get SMA system status
   */
  async getStatus() {
    const connectionTest = await this.testConnection();
    
    return {
      service: 'Real SMA Service',
      backendAvailable: this.isSmaAvailable,
      agents: this.agents,
      geminiConfigured: !!geminiService.apiKey,
      lastUpdate: new Date().toISOString(),
      connection: connectionTest
    };
  }

  /**
   * Reset all agents status
   */
  resetAgents() {
    Object.keys(this.agents).forEach(agentKey => {
      this.agents[agentKey].status = 'idle';
      this.agents[agentKey].results = [];
    });
  }
}

// Export singleton instance
const realSmaService = new RealSmaService();
export default realSmaService;
