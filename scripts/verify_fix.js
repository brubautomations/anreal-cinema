const fs = require('fs');
const moviesData = JSON.parse(fs.readFileSync('src/data/movies.json', 'utf8'));

const filterMovies = (movies, query) => {
    if (!query) return movies;
    const lowerQuery = query.toLowerCase();
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
        for (const [key, aliases] of Object.entries(keywordMap)) {
            if (lowerQuery.includes(key)) {
                if (aliases.some(alias => combinedText.includes(alias))) return true;
            }
        }
        const cleanQuery = lowerQuery.replace(/subject:|OR|AND|\(|\)|"/g, ' ').trim();
        const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);
        if (queryWords.length > 0) return queryWords.some(w => combinedText.includes(w));
        return false;
    });
    return filtered;
};

const genres = [
    { id: 'animation', search: '(subject:"animation" OR subject:"cartoon")' },
    { id: 'horror', search: 'subject:"horror"' },
    { id: 'action', search: '(subject:"action" OR subject:"kung fu")' }
];

genres.forEach(g => {
    const res = filterMovies(moviesData, g.search);
    console.log(`${g.id}: ${res.length} matches`);
    if (res.length > 0) {
        console.log(`  First 3: ${res.slice(0, 3).map(m => m.title).join(', ')}`);
        // Check for misclassification (vague/generic titles)
        const commonMisclassified = ['Home Movies', 'Untitled', 'Fragment'];
        const suspicious = res.filter(m => commonMisclassified.some(term => m.title.includes(term)));
        if (suspicious.length > 0) {
            console.log(`  Suspicious matches found: ${suspicious.length}`);
        }
    }
});

// Check for data mutation
const firstMovieBefore = moviesData[0].title;
filterMovies(moviesData, 'subject:"horror"');
const firstMovieAfter = moviesData[0].title;
if (firstMovieBefore === firstMovieAfter) {
    console.log("SUCCESS: Original data was NOT mutated.");
} else {
    console.log("FAILURE: Original data WAS mutated!");
}
