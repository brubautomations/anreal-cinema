
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TMDB_API_KEY = '9f779ecda119c29a7de55ce4e7f4f56c';
const IA_BASE_URL = 'https://archive.org/advancedsearch.php';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, '../src/data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function fetchIAMovies() {
    console.log('Fetching top 500 movies from Internet Archive...');
    // Query for feature films, sorted by downloads
    const q = 'collection:(feature_films) AND mediatype:(movies)';
    const params = new URLSearchParams({
        q,
        'sort[]': 'downloads desc',
        output: 'json',
        rows: '500',
        'fl[]': 'identifier,title,description,downloads,subject,publicdate,item_size,date,year', // Added year
        page: '1'
    });

    try {
        const response = await fetch(`${IA_BASE_URL}?${params.toString()}`);
        if (!response.ok) throw new Error(`IA Fetch failed: ${response.statusText}`);
        const data = await response.json();
        return data.response.docs;
    } catch (error) {
        console.error('Error fetching from IA:', error);
        return [];
    }
}

async function searchTMDB(title, year) {
    if (!title || typeof title !== 'string') return null;

    // Clean title for better search
    // remove stuff like [video], (1234), special chars, extra spaces
    const cleanTitle = title
        .replace(/\[.*?\]/g, '') // remove [text]
        .replace(/\(.*?\)/g, '') // remove (text)
        .replace(/[^a-zA-Z0-9\s]/g, ' ') // remove special chars
        .replace(/\s+/g, ' ') // collapse spaces
        .trim();

    if (cleanTitle.length < 2) return null; // Too short to search reliably

    const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        query: cleanTitle,
        include_adult: 'false',
        language: 'en-US',
        page: '1'
    });

    if (year) {
        params.append('primary_release_year', year);
    }

    try {
        const url = `${TMDB_BASE_URL}/search/movie?${params.toString()}`;
        const res = await fetch(url);

        if (!res.ok) {
            // handle rate limit
            if (res.status === 429) {
                console.warn(`TMDB Rate limit hit for "${cleanTitle}". Waiting...`);
                await delay(2000); // 2s wait
                return searchTMDB(title, year); // recursive retry
            }
            return null; // 404 or other error
        }

        const data = await res.json();
        if (data.results && data.results.length > 0) {
            // Sort by popularity to get the "main" movie if ambiguous
            const sorted = data.results.sort((a, b) => b.popularity - a.popularity);
            return sorted[0];
        }
    } catch (e) {
        console.error(`Error searching TMDB for "${cleanTitle}":`, e.message);
        return null;
    }
    return null;
}

// Helper to delay for rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    const iaMovies = await fetchIAMovies();
    console.log(`Found ${iaMovies.length} movies from IA. Starting enrichment...`);

    const enrichedMovies = [];
    const BATCH_SIZE = 5; // Process in small batches to respect rate limits

    for (let i = 0; i < iaMovies.length; i += BATCH_SIZE) {
        const batch = iaMovies.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (item) => {
            const year = item.year || (item.publicdate ? item.publicdate.substring(0, 4) : null) || (item.date ? item.date.substring(0, 4) : null);

            // Try TMDB
            let tmdbData = null;

            // Robust check for title
            const rawTitle = Array.isArray(item.title) ? item.title[0] : item.title;

            if (rawTitle) {
                try {
                    tmdbData = await searchTMDB(rawTitle, year);
                } catch (err) {
                    console.error(`Failed to process movie ${rawTitle}:`, err);
                }
            }

            // Fallback images
            // IA standard thumb: https://archive.org/services/img/${item.identifier}
            const iaImage = `https://archive.org/download/${item.identifier}/__ia_thumb.jpg`;

            let poster = iaImage;
            let backdrop = null;
            let rating = null;

            if (tmdbData) {
                if (tmdbData.poster_path) {
                    poster = `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`;
                }
                if (tmdbData.backdrop_path) {
                    backdrop = `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`;
                }
                rating = tmdbData.vote_average;
            }

            return {
                id: item.identifier,
                title: tmdbData ? tmdbData.title : (rawTitle || 'Untitled'),
                description: tmdbData ? tmdbData.overview : item.description,
                downloads: item.downloads,
                image: poster,
                backdrop: backdrop || poster,
                embedUrl: `https://archive.org/embed/${item.identifier}`,
                date: tmdbData ? tmdbData.release_date : (item.publicdate || item.date),
                year: year,
                topics: Array.isArray(item.subject) ? item.subject : [item.subject],
                rating: rating,
                tmdbId: tmdbData ? tmdbData.id : null
            };
        });

        const batchResults = await Promise.all(promises);
        enrichedMovies.push(...batchResults);

        // Log progress less frequently to reduce noise
        if ((i + BATCH_SIZE) % 50 === 0 || i + BATCH_SIZE >= iaMovies.length) {
            console.log(`Processed ${Math.min(i + BATCH_SIZE, iaMovies.length)}/${iaMovies.length}`);
        }

        await delay(300); // Friendly pause
    }

    // Filter out items with very little data if needed, or just keep all
    const validMovies = enrichedMovies.filter(m => m.image);

    const outputPath = path.join(DATA_DIR, 'movies.json');
    fs.writeFileSync(outputPath, JSON.stringify(validMovies, null, 2));
    console.log(`Done! Saved ${validMovies.length} movies to ${outputPath}`);
}

main().catch(console.error);
