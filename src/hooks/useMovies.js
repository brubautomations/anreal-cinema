import { useState, useCallback } from 'react';
import moviesData from '../data/movies.json';

// Helper to filter movies based on IA-style query strings
const filterMovies = (movies, query) => {
    if (!query) return movies;

    const lowerQuery = query.toLowerCase();

    // Mapping of genre identifiers to secondary keywords
    const keywordMap = {
        'horror': ['horror', 'scary', 'spooky'],
        'sci-fi': ['sci-fi', 'science fiction', 'space', 'alien', 'planet'],
        'animation': ['animation', 'cartoon', 'animated'],
        'action': ['action', 'kung fu', 'martial arts', 'fighting'],
        'comedy': ['comedy', 'funny', 'humor', 'slapstick'],
        'drama': ['drama', 'political', 'melodrama'],
        'mystery': ['mystery', 'noir', 'detective', 'crime'],
        'noir': ['noir', 'crime', 'detective'],
        'kung fu': ['kung fu', 'martial arts', 'fighting'],
        'cartoon': ['cartoon', 'animation', 'animated']
    };

    const filtered = movies.filter(movie => {
        const title = (movie.title || '').toLowerCase();
        const description = (movie.description || '').toLowerCase();
        const topics = (Array.isArray(movie.topics)
            ? movie.topics.filter(Boolean).map(t => t.toLowerCase()).join(' ')
            : (typeof movie.topics === 'string' ? movie.topics.toLowerCase() : ''));

        const combinedText = `${title} ${description} ${topics}`;

        // Extract primary terms from query like "horror", "sci-fi", etc.
        // We check if the combined text contains the primary term or any of its mapping keywords
        for (const [key, aliases] of Object.entries(keywordMap)) {
            if (lowerQuery.includes(key)) {
                if (aliases.some(alias => combinedText.includes(alias))) {
                    return true;
                }
            }
        }

        // Generic fallback for queries that don't match our map
        const cleanQuery = lowerQuery.replace(/subject:|OR|AND|\(|\)|"/g, ' ').trim();
        const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);
        if (queryWords.length > 0) {
            return queryWords.some(w => combinedText.includes(w));
        }

        return false;
    });

    return filtered;
};

export function useMovies() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMovies = useCallback(async (genreQuery, page = 1) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate network delay for effect
            await new Promise(resolve => setTimeout(resolve, 500));

            const filtered = filterMovies(moviesData, genreQuery);

            const ITEMS_PER_PAGE = 20;
            const start = (page - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;

            return filtered.slice(start, end);
        } catch (err) {
            console.error(err);
            setError('Failed to load movies');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return { fetchMovies, loading, error };
}
