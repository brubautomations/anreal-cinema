const fs = require('fs');
const movies = JSON.parse(fs.readFileSync('src/data/movies.json', 'utf8'));

const genres = [
    { id: 'animation', terms: ['animation', 'cartoon'] },
    { id: 'action', terms: ['action', 'kung fu', 'martial arts'] },
    { id: 'horror', terms: ['horror'] },
    { id: 'sci-fi', terms: ['sci-fi', 'science fiction', 'space'] },
    { id: 'comedy', terms: ['comedy'] },
    { id: 'drama', terms: ['drama'] },
    { id: 'mystery', terms: ['mystery', 'noir'] }
];

const stats = genres.map(g => {
    const matching = movies.filter(m => {
        const topics = (Array.isArray(m.topics)
            ? m.topics.filter(Boolean).map(t => t.toLowerCase()).join(' ')
            : (typeof m.topics === 'string' ? m.topics.toLowerCase() : '')) + ' ' + (m.description || '').toLowerCase();

        return g.terms.some(term => topics.includes(term));
    });
    return { id: g.id, count: matching.length };
});

console.log(JSON.stringify(stats, null, 2));
