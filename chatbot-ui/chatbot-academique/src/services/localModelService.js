/**
 * Service de modèle local simulé pour les tests RAG
 * Alternative à Ollama pour les démonstrations
 */

class LocalModelService {
  constructor() {
    this.isAvailable = true;
    this.modelName = 'Local-ENIAD-Model';
    this.responses = this.initializeResponses();
    
    console.log('🤖 Local Model Service initialized');
  }

  /**
   * Initialiser les réponses prédéfinies pour ENIAD
   */
  initializeResponses() {
    return {
      formations: {
        keywords: ['formation', 'programme', 'étude', 'cursus', 'diplôme', 'master', 'licence'],
        responses: {
          fr: `L'ENIAD propose plusieurs formations spécialisées en intelligence artificielle et sciences des données :

🎓 **Programmes disponibles :**
• Master en Intelligence Artificielle
• Master en Science des Données  
• Licence en Informatique et IA
• Formation continue en Machine Learning

📚 **Spécialisations :**
• Deep Learning et réseaux de neurones
• Traitement du langage naturel
• Vision par ordinateur
• IA éthique et explicable
• Big Data et analyse prédictive

🏆 **Points forts :**
• Projets pratiques avec l'industrie
• Laboratoires équipés de GPU
• Encadrement par des chercheurs reconnus
• Partenariats internationaux`,
          ar: `يقدم معهد ENIAD عدة برامج متخصصة في الذكاء الاصطناعي وعلوم البيانات:

🎓 **البرامج المتاحة:**
• ماجستير في الذكاء الاصطناعي
• ماجستير في علوم البيانات
• إجازة في الإعلاميات والذكاء الاصطناعي
• تكوين مستمر في التعلم الآلي

📚 **التخصصات:**
• التعلم العميق والشبكات العصبية
• معالجة اللغة الطبيعية
• الرؤية الحاسوبية
• الذكاء الاصطناعي الأخلاقي
• البيانات الضخمة والتحليل التنبؤي`
        }
      },
      admission: {
        keywords: ['admission', 'inscription', 'candidature', 'condition', 'requis'],
        responses: {
          fr: `**Conditions d'admission à l'ENIAD :**

📋 **Prérequis :**
• Licence en informatique, mathématiques ou domaine connexe
• Moyenne minimale de 12/20
• Maîtrise du français et de l'anglais

📅 **Processus d'admission :**
1. **Candidature en ligne** (Mars - Juin)
2. **Examen écrit** (Juillet)
3. **Entretien oral** (Août)
4. **Résultats** (Septembre)

💰 **Frais de scolarité :**
• Étudiants marocains : 15,000 DH/an
• Étudiants étrangers : 25,000 DH/an

📞 **Contact :** admission@eniad.ump.ma`,
          ar: `**شروط القبول في معهد ENIAD:**

📋 **المتطلبات:**
• إجازة في الإعلاميات أو الرياضيات أو مجال ذي صلة
• معدل لا يقل عن 12/20
• إتقان الفرنسية والإنجليزية

📅 **عملية القبول:**
1. **التسجيل عبر الإنترنت** (مارس - يونيو)
2. **امتحان كتابي** (يوليو)
3. **مقابلة شفوية** (أغسطس)
4. **النتائج** (سبتمبر)

💰 **الرسوم الدراسية:**
• الطلاب المغاربة: 15,000 درهم/سنة
• الطلاب الأجانب: 25,000 درهم/سنة`
        }
      },
      recherche: {
        keywords: ['recherche', 'laboratoire', 'projet', 'publication', 'thèse'],
        responses: {
          fr: `**Recherche à l'ENIAD :**

🔬 **Laboratoires de recherche :**
• Lab IA Explicable
• Lab Vision par Ordinateur
• Lab Traitement du Langage Naturel
• Lab IA pour l'Éducation

📊 **Projets en cours :**
• IA pour le diagnostic médical
• Systèmes de recommandation intelligents
• Analyse de sentiments en arabe
• Robotique éducative

📚 **Publications récentes :**
• 25+ articles dans des conférences internationales
• Collaborations avec MIT, Stanford
• Brevets en IA appliquée

🎯 **Opportunités :**
• Stages de recherche
• Thèses de doctorat
• Projets industriels`,
          ar: `**البحث في معهد ENIAD:**

🔬 **مختبرات البحث:**
• مختبر الذكاء الاصطناعي القابل للتفسير
• مختبر الرؤية الحاسوبية
• مختبر معالجة اللغة الطبيعية
• مختبر الذكاء الاصطناعي للتعليم

📊 **المشاريع الجارية:**
• الذكاء الاصطناعي للتشخيص الطبي
• أنظمة التوصية الذكية
• تحليل المشاعر باللغة العربية
• الروبوتات التعليمية`
        }
      },
      general: {
        keywords: ['eniad', 'école', 'université', 'ump', 'berkane', 'maroc'],
        responses: {
          fr: `**À propos de l'ENIAD :**

🏛️ **École Nationale d'Intelligence Artificielle et Data Science**
• Établissement public d'enseignement supérieur
• Rattachée à l'Université Mohammed Premier (UMP)
• Située à Berkane, Maroc

🎯 **Mission :**
Former des experts en IA et science des données pour répondre aux besoins du marché national et international.

🌟 **Valeurs :**
• Excellence académique
• Innovation technologique
• Éthique de l'IA
• Ouverture internationale

📍 **Campus :**
• Laboratoires modernes
• Équipements de pointe
• Bibliothèque numérique
• Espaces collaboratifs`,
          ar: `**حول معهد ENIAD:**

🏛️ **المعهد الوطني للذكاء الاصطناعي وعلوم البيانات**
• مؤسسة عمومية للتعليم العالي
• تابعة لجامعة محمد الأول (UMP)
• تقع في بركان، المغرب

🎯 **المهمة:**
تكوين خبراء في الذكاء الاصطناعي وعلوم البيانات لتلبية احتياجات السوق الوطني والدولي.

🌟 **القيم:**
• التميز الأكاديمي
• الابتكار التكنولوجي
• أخلاقيات الذكاء الاصطناعي
• الانفتاح الدولي`
        }
      }
    };
  }

  /**
   * Analyser la requête et trouver la catégorie appropriée
   */
  analyzeQuery(query) {
    const queryLower = query.toLowerCase();
    
    for (const [category, data] of Object.entries(this.responses)) {
      for (const keyword of data.keywords) {
        if (queryLower.includes(keyword)) {
          return category;
        }
      }
    }
    
    return 'general';
  }

  /**
   * Générer une réponse basée sur la requête
   */
  async generateResponse(query, language = 'fr', context = '') {
    try {
      console.log(`🤖 Génération locale pour: "${query}"`);
      
      const category = this.analyzeQuery(query);
      const categoryData = this.responses[category];
      
      let response = categoryData.responses[language] || categoryData.responses.fr;
      
      // Ajouter le contexte si disponible
      if (context && context.trim()) {
        const contextPrefix = language === 'ar' ? 
          '\n\n📚 **معلومات إضافية من قاعدة البيانات:**\n' :
          '\n\n📚 **Informations supplémentaires de la base de données :**\n';
        response += contextPrefix + context.substring(0, 300) + '...';
      }
      
      // Ajouter une note sur le modèle local
      const modelNote = language === 'ar' ? 
        '\n\n🤖 *تم إنتاج هذه الإجابة بواسطة النموذج المحلي لـ ENIAD*' :
        '\n\n🤖 *Réponse générée par le modèle local ENIAD*';
      response += modelNote;
      
      return {
        success: true,
        answer: response,
        model: this.modelName,
        category: category,
        source: 'Modèle Local ENIAD',
        icon: '🤖'
      };
    } catch (error) {
      console.error('❌ Erreur génération locale:', error);
      return {
        success: false,
        answer: language === 'ar' ? 
          'عذراً، حدث خطأ في النموذج المحلي.' : 
          'Désolé, erreur avec le modèle local.',
        model: 'error'
      };
    }
  }

  /**
   * Vérifier la disponibilité
   */
  async checkAvailability() {
    return true; // Toujours disponible
  }

  /**
   * Obtenir le statut
   */
  async getStatus() {
    return {
      service: 'Local Model Service',
      available: this.isAvailable,
      model: this.modelName,
      categories: Object.keys(this.responses),
      lastCheck: new Date().toISOString()
    };
  }

  /**
   * Générer une réponse optimisée pour ENIAD
   */
  async generateENIADResponse(query, language = 'fr', context = '') {
    return await this.generateResponse(query, language, context);
  }
}

// Export singleton
const localModelService = new LocalModelService();
export default localModelService;
