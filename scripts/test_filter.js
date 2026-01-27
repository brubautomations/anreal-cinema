const fs = require('fs');
const moviesData = JSON.parse(fs.readFileSync('src/data/movies.json', 'utf8'));

const filterMovies = (movies, query) => {
    if (!query) return movies;
    const lowerQuery = query.toLowerCase();
    const filtered = movies.filter(movie => {
        if (!lowerQuery || lowerQuery.trim() === '') return true;

        const topics = (Array.isArray(movie.topics)
            ? movie.topics.filter(Boolean).map(t => t.toLowerCase()).join(' ')
            : (typeof movie.topics === 'string' ? movie.topics.toLowerCase() : '')) + ' ' + (movie.description || '').toLowerCase();

        if (lowerQuery.includes('horror')) return topics.includes('horror');
        if (lowerQuery.includes('sci-fi')) return topics.includes('sci-fi') || topics.includes('science fiction') || topics.includes('space');
        if (lowerQuery.includes('animation') || lowerQuery.includes('cartoon')) return topics.includes('animation') || topics.includes('cartoon');
        if (lowerQuery.includes('action') || lowerQuery.includes('kung fu')) return topics.includes('action') || topics.includes('kung fu') || topics.includes('martial arts');
        if (lowerQuery.includes('comedy')) return topics.includes('comedy');
        if (lowerQuery.includes('drama')) return topics.includes('drama');
        if (lowerQuery.includes('mystery') || lowerQuery.includes('noir')) return topics.includes('mystery') || topics.includes('noir');

        const cleanQuery = lowerQuery.replace(/subject:|OR|AND|\(|\)|"/g, ' ').trim();
        const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);
        if (queryWords.length === 0) return true;
        return queryWords.some(w => topics.includes(w));
    });
    return filtered;
};

const genres = [
    { id: 'animation', search: '(subject:"animation" OR subject:"cartoon")' },
    { id: 'action', search: '(subject:"action" OR subject:"kung fu")' },
    { id: 'horror', search: 'subject:"horror"' },
    { id: 'sci-fi', search: 'subject:"sci-fi"' },
    { id: 'comedy', search: 'subject:"comedy"' },
    { id: 'drama', search: 'subject:"drama"' },
    { id: 'mystery', search: '(subject:"film noir" OR subject:"mystery")' }
];

genres.forEach(g => {
    const res = filterMovies(moviesData, g.search);
    console.log(`${g.id}: ${res.length} matches`);
    if (res.length > 0) {
        console.log(`  Example: ${res[0].title} (Topics: ${res[0].topics})`);
    }
});
