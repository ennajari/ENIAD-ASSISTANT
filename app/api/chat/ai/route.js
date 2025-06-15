// /api/chat/search/route.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Prompt manquant ou vide'
      });
    }

    console.log('Recherche pour:', prompt);

    // Configuration des headers pour simuler un navigateur réel
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8,ar;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    let searchResults = [];
    let errorMessage = '';

    // Tentative de recherche sur le site ENIAD
    try {
      const response = await axios.get('https://eniad.ump.ma/', {
        headers,
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 300;
        }
      });

      if (response.data) {
        const $ = cheerio.load(response.data);
        
        // Recherche de contenu pertinent
        const titles = [];
        const descriptions = [];
        
        // Extraire les titres
        $('h1, h2, h3, h4, .title, .heading').each((_, el) => {
          const text = $(el).text().trim();
          if (text && text.length > 3 && text.length < 200) {
            titles.push(text);
          }
        });

        // Extraire les descriptions et paragraphes
        $('p, .description, .content, .text').each((_, el) => {
          const text = $(el).text().trim();
          if (text && text.length > 10 && text.length < 300) {
            descriptions.push(text);
          }
        });

        // Filtrer le contenu pertinent par rapport au prompt
        const keywords = prompt.toLowerCase().split(' ').filter(word => word.length > 2);
        
        const relevantTitles = titles.filter(title => 
          keywords.some(keyword => title.toLowerCase().includes(keyword))
        );
        
        const relevantDescriptions = descriptions.filter(desc => 
          keywords.some(keyword => desc.toLowerCase().includes(keyword))
        );

        searchResults = [
          ...relevantTitles.slice(0, 3),
          ...relevantDescriptions.slice(0, 2)
        ];

        if (searchResults.length === 0) {
          // Si aucun résultat pertinent, prendre les premiers titres
          searchResults = titles.slice(0, 3);
        }
      }

    } catch (siteError) {
      console.error('Erreur lors de l\'accès au site ENIAD:', siteError.message);
      
      if (siteError.code === 'ENOTFOUND') {
        errorMessage = 'Le site ENIAD n\'est pas accessible actuellement';
      } else if (siteError.code === 'ETIMEDOUT') {
        errorMessage = 'Le site ENIAD met trop de temps à répondre';
      } else if (siteError.response) {
        errorMessage = `Le site ENIAD a retourné une erreur ${siteError.response.status}`;
      } else {
        errorMessage = 'Problème de connexion au site ENIAD';
      }
    }

    // Si aucun résultat du site, utiliser une base de données de connaissances locale
    if (searchResults.length === 0) {
      const localKnowledge = getLocalKnowledge(prompt);
      if (localKnowledge.length > 0) {
        searchResults = localKnowledge;
      }
    }

    // Créer la réponse finale
    let resultText;
    
    if (searchResults.length > 0) {
      resultText = `🔎 Résultats de recherche pour "${prompt}":\n\n`;
      resultText += searchResults.map((result, index) => `${index + 1}. ${result}`).join('\n\n');
      
      if (errorMessage) {
        resultText += `\n\n⚠️ Note: ${errorMessage}. Les résultats ci-dessus proviennent de notre base de connaissances locale.`;
      }
    } else {
      resultText = `❌ Aucun résultat trouvé pour "${prompt}".`;
      if (errorMessage) {
        resultText += `\n\n⚠️ ${errorMessage}`;
      }
      resultText += `\n\nVeuillez essayer avec des mots-clés différents ou contactez directement l'administration de l'ENIAD.`;
    }

    return NextResponse.json({
      success: true,
      data: {
        role: 'assistant',
        content: resultText,
        timestamp: Date.now(),
      }
    });

  } catch (error) {
    console.error('Erreur générale dans l\'API de recherche:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur lors de la recherche',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Base de connaissances locale pour ENIAD
function getLocalKnowledge(prompt) {
  const knowledge = {
    'admission': [
      'Les admissions à l\'ENIAD se font sur concours national',
      'Les dossiers d\'admission doivent être soumis avant la date limite',
      'L\'école accepte les étudiants avec un baccalauréat scientifique ou technique'
    ],
    'inscription': [
      'L\'inscription administrative se fait en début d\'année académique',
      'Les frais d\'inscription sont fixés annuellement',
      'Les documents requis incluent le diplôme du baccalauréat et les relevés de notes'
    ],
    'formation': [
      'L\'ENIAD propose des formations en Intelligence Artificielle et Technologies Digitales',
      'Les programmes incluent des stages pratiques en entreprise',
      'La durée de formation varie selon le niveau d\'études'
    ],
    'contact': [
      'L\'ENIAD est située à Berkane, région de l\'Oriental',
      'Pour plus d\'informations, contactez le secrétariat de l\'école',
      'Le site web officiel est https://eniad.ump.ma/'
    ],
    'programme': [
      'Les programmes couvrent l\'IA, le machine learning et les technologies digitales',
      'Formation théorique et pratique avec des projets concrets',
      'Partenariats avec des entreprises du secteur technologique'
    ]
  };

  const keywords = prompt.toLowerCase().split(' ');
  let results = [];

  for (const [topic, info] of Object.entries(knowledge)) {
    if (keywords.some(keyword => keyword.includes(topic) || topic.includes(keyword))) {
      results = [...results, ...info];
    }
  }

  // Si aucun résultat spécifique, retourner des informations générales
  if (results.length === 0) {
    results = [
      'L\'École Nationale de l\'Intelligence Artificielle et Digitale (ENIAD) de Berkane',
      'Formation spécialisée en IA et technologies digitales',
      'Établissement d\'enseignement supérieur de l\'Université Mohammed Premier'
    ];
  }

  return results.slice(0, 5); // Limiter à 5 résultats
}