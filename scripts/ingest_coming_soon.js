
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.join(__dirname, '../src/data/coming_soon.json');

async function ingestComingSoon() {
    console.log('--- ENTRANCE: Ingesting Coming Soon (501-550) ---');
    try {
        const query = 'collection:(feature_films) AND mediatype:(movies)';
        // Fetch 550 items, but we only want 501-550
        const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&sort[]=downloads desc&output=json&rows=550&fl[]=identifier,title,description,downloads,subject,publicdate,item_size,date`;

        const response = await fetch(url);
        const data = await response.json();
        const allDocs = data.response.docs;

        // Take the last 50
        const items = allDocs.slice(500, 550);

        const processed = items.map(item => ({
            id: item.identifier,
            title: item.title,
            description: Array.isArray(item.description) ? item.description.join(' ') : (item.description || ''),
            downloads: item.downloads,
            image: `https://archive.org/download/${item.identifier}/__ia_thumb.jpg`,
            backdrop: `https://archive.org/download/${item.identifier}/__ia_thumb.jpg`,
            embedUrl: `https://archive.org/embed/${item.identifier}`,
            date: item.publicdate || item.date || 'To be announced',
            topics: Array.isArray(item.subject) ? item.subject : (item.subject ? [item.subject] : []),
            rating: null,
            isComingSoon: true
        }));

        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(processed, null, 2));
        console.log(`--- SUCCESS: Saved 50 upcoming movies to ${OUTPUT_PATH} ---`);
    } catch (error) {
        console.error('--- ERROR: Ingestion failed ---', error);
    }
}

ingestComingSoon();
