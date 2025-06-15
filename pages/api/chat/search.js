import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://eniad.ump.ma';
const MAX_PAGES = 3;
const MAX_TITLES = 5;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed' 
        });
    }

    const { prompt, searchActive } = req.body;
    
    if (!searchActive) {
        return res.status(200).json({
            success: true,
            data: {
                role: 'assistant',
                content: `Mode recherche désactivé pour: "${prompt}"`,
                timestamp: Date.now(),
            }
        });
    }

    try {
        // Scraping de la page principale
        console.log("Starting website scraping...");
        const mainResponse = await axios.get(BASE_URL);
        const $main = cheerio.load(mainResponse.data);
        
        // Extraction des liens pertinents
        const links = new Set();
        $main('a[href^="/"]').each((_, el) => {
            const href = $main(el).attr('href');
            if (href && !href.includes('#') && links.size < MAX_PAGES) {
                links.add(new URL(href, BASE_URL).href);
            }
        });

        // Fonction de scraping
        const scrapePage = async (url) => {
            try {
                const resp = await axios.get(url);
                const $ = cheerio.load(resp.data);
                const titles = [];
                
                $('h1, h2, h3').each((_, el) => {
                    if (titles.length < MAX_TITLES) {
                        const text = $(el).text().trim();
                        if (text) titles.push(text);
                    }
                });
                
                return { url, titles };
            } catch (error) {
                return { url, error: error.message };
            }
        };

        // Scraping parallèle des pages
        const pages = await Promise.all(
            Array.from(links).map(scrapePage)
        );

        // Construction de la réponse
        let content = `🔍 Résultats de recherche pour "${prompt}":\n\n`;
        
        // Titres de la page principale
        const mainTitles = [];
        $main('h1, h2, h3').each((_, el) => {
            if (mainTitles.length < MAX_TITLES) {
                const text = $main(el).text().trim();
                if (text) mainTitles.push(text);
            }
        });
        
        if (mainTitles.length) {
            content += `Page principale:\n${mainTitles.map(t => `- ${t}`).join('\n')}\n\n`;
        }

        // Sous-pages
        pages.forEach(page => {
            content += `Page: ${page.url}\n`;
            if (page.error) {
                content += `Erreur: ${page.error}\n\n`;
            } else if (page.titles?.length) {
                content += `${page.titles.map(t => `- ${t}`).join('\n')}\n\n`;
            } else {
                content += `Aucun titre trouvé\n\n`;
            }
        });

        console.log("Scraping completed successfully");
        return res.status(200).json({
            success: true,
            data: {
                role: 'assistant',
                content,
                timestamp: Date.now()
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche',
            error: error.message
        });
    }
}