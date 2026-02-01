import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieRow = ({ genre, movies, onMovieClick }) => {
    const rowRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const scroll = (offset) => {
        if (rowRef.current) {
            rowRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    // --- DRAG LOGIC (Restored for Desktop) ---
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - rowRef.current.offsetLeft);
        setScrollLeft(rowRef.current.scrollLeft);
    };
    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - rowRef.current.offsetLeft;
        const walk = (x - startX) * 2; 
        rowRef.current.scrollLeft = scrollLeft - walk;
    };

    // Filter Logic
    const genreMovies = movies.filter(movie => {
        if (!movie.topics) return false;
        const topics = Array.isArray(movie.topics) 
            ? movie.topics 
            : (typeof movie.topics === 'string' ? movie.topics.split(',') : []);
        return topics.some(t => t && t.toString().toLowerCase().includes(genre.id.toLowerCase()));
    });

    const moviesToRender = genre.id === 'custom' ? movies : genreMovies;

    if (moviesToRender.length === 0) return null;

    return (
        <div className="mb-12 group relative px-6 md:px-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-600 rounded-full mr-2"></span>
                {genre.name || genre.title}
            </h2>

            <button 
                onClick={() => scroll(-800)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
            >
                <ChevronLeft size={24} />
            </button>

            <div 
                ref={rowRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 cursor-grab active:cursor-grabbing no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {moviesToRender.map((movie) => (
                    <div key={movie.id} className="flex-none pointer-events-none md:pointer-events-auto">
                        <MovieCard 
                            movie={movie} 
                            onClick={(m) => !isDragging && onMovieClick(m)} 
                        />
                    </div>
                ))}
            </div>

            <button 
                onClick={() => scroll(800)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default MovieRow;