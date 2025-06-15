// pages/api/chat/search.js

import axios from 'axios';
import * as cheerio from 'cheerio'; // Important : utilise * as pour éviter "undefined load"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, message: 'Prompt invalide ou manquant' });
  }

  try {
    const response = await axios.get('https://eniad.ump.ma/');
    const html = response.data;
    const $ = cheerio.load(html);

    // Exemple : récupère les titres h1, h2, h3
    const titles = [];
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text) titles.push(text);
    });

    if (titles.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          role: 'assistant',
          content: `Aucun titre trouvé sur le site pour "${prompt}".`,
          timestamp: Date.now(),
        },
      });
    }

    const resultText = `🔎 Résultats trouvés pour "${prompt}" sur le site ENIAD :\n\n` +
      titles.slice(0, 5).join('\n');

    return res.status(200).json({
      success: true,
      data: {
        role: 'assistant',
        content: resultText,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du site ENIAD:', error.message);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'analyse du site ENIAD. Veuillez réessayer plus tard.",
    });
  }
}
