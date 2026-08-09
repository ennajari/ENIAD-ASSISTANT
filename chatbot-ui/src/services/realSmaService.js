/**
 * Real SMA Service Integration
 * Connects to actual SMA_Service backend with real web scraping and AI analysis
 */

import axios from 'axios';
import geminiService from './geminiService';

class RealSmaService {
  constructor() {
    this.smaApiUrl = import.meta.env.VITE_SMA_API_URL || 'http://localhost:8002';
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
    } catch (err) {
      this.isSmaAvailable = false;
      console.log('⚠️ SMA backend not available:', err?.message || err);
      return { success: false, message: 'SMA backend unavailable' };
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

      console.log(`🚀 Starting SMA workflow for: "${query}" (lang: ${language}, translate: ${includeTranslation}, max: ${maxResults})`);

      // If SMA backend is available, use it
      if (this.isSmaAvailable) {
        return await this.executeWithBackend(query, options);
      }

      // NO FAKE SIMULATION - Only real SMA backend
      console.error('❌ SMA backend not available and no fake simulation allowed');
      return {
        success: false,
        error: 'SMA backend required - no fake simulation',
        agents: this.agents
      };

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

      // NO FAKE SIMULATION - Return error
      console.error('❌ All SMA backends failed - no fake simulation allowed');
      return {
        success: false,
        error: 'SMA backend required - no fake simulation',
        agents: this.agents
      };
    }
  }

  /**
   * REMOVED - No fake simulation allowed
   */
  async executeWithLocalSimulation(_query, _options) {
    console.error('🚫 FAKE SIMULATION REMOVED - Use only real SMA backend');
    return {
      success: false,
      error: 'Fake simulation removed - use real SMA backend only',
      agents: this.agents
    };
  }

  /**
   * Transform enhanced SMA backend response to component expected format
   */
  transformEnhancedResults(data) {
    const results = [];

    // Add main answer as primary result
    if (data.final_answer) {
      results.push({
        id: 'sma-final-answer',
        title: 'Résumé de l\'intelligence web SMA',
        summary: data.final_answer,
        content: data.final_answer,
        url: 'https://eniad.ump.ma',
        source: 'SMA Intelligence Engine',
        importance: 5,
        relevanceScore: data.confidence || 0.9,
        type: 'summary',
        timestamp: data.timestamp
      });
    }

    // Add sources
    if (data.sources && Array.isArray(data.sources)) {
      data.sources.forEach((source, index) => {
        results.push({
          id: `sma-source-${index}`,
          title: source.title || source.name || `Source ${index + 1}`,
          summary: source.snippet || source.description || source.summary || '',
          content: source.content || source.snippet || '',
          url: source.url || source.link || 'https://eniad.ump.ma',
          source: source.source || source.domain || 'Web Search',
          importance: source.importance || 3,
          relevanceScore: source.relevance || source.score || 0.8,
          type: source.type || 'web_page',
          timestamp: source.timestamp || data.timestamp
        });
      });
    }

    // Add news results if available
    if (data.news_results && data.news_results.articles) {
      data.news_results.articles.forEach((article, index) => {
        results.push({
          id: `sma-news-${index}`,
          title: article.title,
          summary: article.description || article.snippet || '',
          content: article.content || article.description || '',
          url: article.url || article.link,
          source: article.source?.name || 'ENIAD News',
          importance: 4,
          relevanceScore: 0.85,
          type: 'news_article',
          publishedAt: article.publishedAt || article.date
        });
      });
    }

    return results;
  }

  /**
   * REMOVED - No fake web scraping simulation
   */
  async simulateWebScraping(_query) {
    console.error('🚫 FAKE WEB SCRAPING REMOVED - Use only real SMA backend');
    return [];
  }

  /**
   * Analyze content using Gemini AI
   */
  async analyzeContent(scrapedData, query) {
    try {
      const analyzedResults = [];

      for (const item of scrapedData) {
        console.log(`🤖 Analyzing item: ${item.title}`);

        const prompt = `
En tant qu'assistant académique de l'ENIAD (École Nationale d'Intelligence Artificielle et du Digital), analysez ce contenu web par rapport à la question de l'utilisateur:

Question: "${query}"
Titre: "${item.title}"
Contenu: "${item.content}"

Fournissez une analyse structurée en format JSON:
{
  "summary": "Résumé concis (2-3 phrases)",
  "relevanceScore": score de 0.0 à 1.0,
  "keyPoints": ["point 1", "point 2"],
  "category": "catégorie du contenu",
  "importance": score de 1 à 5
}
        `;

        try {
          const analysisText = await geminiService.generateContent(prompt);
          let analysis;

          try {
            const firstBrace = analysisText.indexOf('{');
            const lastBrace = analysisText.lastIndexOf('}');
            const jsonString = (firstBrace !== -1 && lastBrace > firstBrace)
              ? analysisText.slice(firstBrace, lastBrace + 1)
              : null;
            analysis = jsonString ? JSON.parse(jsonString) : this.fallbackAnalysis(analysisText);
          } catch (e) {
            console.warn('Analysis text parsing error:', e?.message);
            analysis = this.fallbackAnalysis(analysisText);
          }

          analyzedResults.push({
            ...item,
            analysis
          });
        } catch (itemError) {
          console.warn(`Failed to analyze item ${item.title}:`, itemError);
          analyzedResults.push({
            ...item,
            analysis: {
              summary: item.summary || item.content.substring(0, 150) + '...',
              relevanceScore: 0.5,
              keyPoints: ['Contenu non analysé'],
              category: 'general',
              importance: 3
            }
          });
        }
      }

      return analyzedResults;
    } catch (error) {
      console.error('❌ Content analysis failed:', error);
      return scrapedData.map(item => ({
        ...item,
        analysis: {
          summary: item.summary,
          relevanceScore: 0.5,
          keyPoints: [],
          category: 'general',
          importance: 3
        }
      }));
    }
  }

  /**
   * Fallback parsing when Gemini JSON is malformed
   */
  fallbackAnalysis(text) {
    return {
      summary: this.extractFromAnalysis(text, 'summary') || 'Contenu analysé par l\'assistant ENIAD',
      relevanceScore: this.extractScore(text),
      keyPoints: this.extractKeywords(text),
      category: this.extractCategory(text),
      importance: this.extractImportance(text)
    };
  }

  /**
   * Translate content to requested language
   */
  async translateContent(content, targetLanguage) {
    try {
      console.log(`🌐 Translating ${content.length} items to ${targetLanguage}`);
      const translated = [];

      for (const item of content) {
        const prompt = `
Traduisez les informations suivantes en ${targetLanguage === 'ar' ? 'arabe' : 'français'}:

Titre: "${item.title}"
Résumé: "${item.analysis.summary}"

Format JSON:
{
  "translatedTitle": "Titre traduit",
  "translatedSummary": "Résumé traduit"
}
        `;

        try {
          const translationText = await geminiService.generateContent(prompt);
          const firstBrace = translationText.indexOf('{');
          const lastBrace = translationText.lastIndexOf('}');
          const jsonString = (firstBrace !== -1 && lastBrace > firstBrace)
            ? translationText.slice(firstBrace, lastBrace + 1)
            : null;
          const translation = jsonString ? JSON.parse(jsonString) : {
            translatedTitle: item.title,
            translatedSummary: item.analysis.summary
          };

          translated.push({
            ...item,
            title: translation.translatedTitle,
            analysis: {
              ...item.analysis,
              summary: translation.translatedSummary
            },
            originalLanguage: 'fr',
            translatedTo: targetLanguage
          });
        } catch (e) {
          console.warn('Item translation failed:', e?.message);
          translated.push(item);
        }
      }

      return translated;
    } catch (error) {
      console.error('❌ Translation failed:', error);
      return content;
    }
  }

  /**
   * Integrate results with RAG system
   */
  async integrateWithRag(translatedContent, _query) {
    try {
      // Sort by relevance and importance
      const sortedContent = translatedContent.sort((a, b) => {
        const scoreA = (a.analysis.relevanceScore || 0.5) * (a.analysis.importance || 3);
        const scoreB = (b.analysis.relevanceScore || 0.5) * (b.analysis.importance || 3);
        return scoreB - scoreA;
      });

      // Take top results
      const topResults = sortedContent.slice(0, 5);

      return topResults.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        summary: item.analysis.summary,
        url: item.url,
        source: item.source,
        relevanceScore: item.analysis.relevanceScore,
        importance: item.analysis.importance,
        keyPoints: item.analysis.keyPoints,
        category: item.analysis.category,
        timestamp: item.timestamp,
        metadata: {
          agent: 'SMA-WebScraper',
          processedAt: new Date().toISOString(),
          translated: !!item.translatedTo
        }
      }));
    } catch (error) {
      console.error('❌ RAG integration failed:', error);
      return translatedContent;
    }
  }

  /**
   * Monitor ENIAD website for updates
   */
  async monitorEniadWebsite(category = 'all') {
    console.log(`📡 Monitoring ENIAD website for category: ${category}`);

    try {
      // If SMA backend is available, call its monitoring endpoint
      if (this.isSmaAvailable) {
        const response = await axios.get(`${this.smaApiUrl}/sma/monitor?category=${category}`, { timeout: 15000 });
        if (response.data) {
          return response.data;
        }
      }

      // No fake simulation
      return {
        success: false,
        error: 'SMA backend required for monitoring',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Website monitoring failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get fresh documents from ENIAD/UMP websites
   */
  async getFreshDocuments(topic = '') {
    console.log(`📚 Searching fresh documents for topic: ${topic}`);

    try {
      if (this.isSmaAvailable) {
        const response = await axios.post(`${this.smaApiUrl}/sma/documents`, {
          topic,
          limit: 10
        }, { timeout: 20000 });

        if (response.data) {
          return response.data;
        }
      }

      return {
        success: false,
        documents: [],
        error: 'SMA backend required'
      };
    } catch (error) {
      console.error('❌ Fresh documents search failed:', error);
      return {
        success: false,
        documents: [],
        error: error.message
      };
    }
  }

  /**
   * Extract key concepts from search results
   */
  extractKeyConcepts(results) {
    const text = results.map(r => `${r.title} ${r.summary}`).join(' ');
    const words = text.toLowerCase()
      .replace(/[^\w\sàâäéèêëîïôöùûüç]/gi, '')
      .split(/\s+/)
      .filter(w => w.length > 4);

    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Helper methods for parsing Gemini responses
   */
  extractFromAnalysis(text, field) {
    try {
      const regex = new RegExp(String.raw`${field}[:\s]*([^\n]+)`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : null;
    } catch (err) {
      console.warn('Extraction failed:', err?.message);
      return null;
    }
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
    return match ? Number.parseFloat(match[1]) : 0.7;
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
    return match ? Number.parseInt(match[1], 10) : 3;
  }

  /**
   * Get SMA system status
   */
  async getStatus() {
    await this.testConnection();
    
    return {
      service: 'Real SMA Service',
      backendAvailable: this.isSmaAvailable,
      agents: this.agents,
      backendUrl: this.smaApiUrl,
      capabilities: [
        'Real-time Web Scraping',
        'Gemini AI Content Analysis',
        'Automatic Translation',
        'RAG Integration',
        'Intelligent Query Engine',
        'News & Document Search'
      ]
    };
  }
}

// Export singleton instance
export default new RealSmaService();
