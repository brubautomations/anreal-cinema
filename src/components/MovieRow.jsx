import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieRow = ({ genre, movies, onMovieClick }) => {
    const rowRef = useRef(null);

    const scroll = (offset) => {
        if (rowRef.current) {
            rowRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    // Filter movies by genre safely
    const genreMovies = movies.filter(movie => {
        if (!movie.topics) return false;
        // Handle array or string
        const topics = Array.isArray(movie.topics) 
            ? movie.topics 
            : movie.topics.split(',').map(t => t.trim());
        // Check for match
        return topics.some(t => t && t.toString().toLowerCase().includes(genre.id.toLowerCase()));
    });

    // If it's a Custom row (like Recently Added), use raw list. Otherwise use filtered.
    const moviesToRender = genre.id === 'custom' ? movies : genreMovies;

    if (moviesToRender.length === 0) return null;

    return (
        <div className="mb-8 group relative px-4 md:px-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-600 rounded-full mr-2"></span>
                {genre.name || genre.title}
                <span className="text-xs font-normal text-slate-500 ml-2 uppercase tracking-wider border border-slate-700 px-2 py-0.5 rounded">
                    {moviesToRender.length}
                </span>
            </h2>

            {/* Left Arrow */}
            <button 
                onClick={() => scroll(-800)}
                className="absolute left-2 top-1/2 -translate-y-8 z-40 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hidden md:block"
            >
                <ChevronLeft size={24} />
            </button>

            {/* Scrolling Container */}
            <div 
                ref={rowRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {moviesToRender.map((movie) => (
                    <div key={movie.id} className="flex-none">
                        <MovieCard movie={movie} onClick={onMovieClick} />
                    </div>
                ))}
            </div>

            {/* Right Arrow */}
            <button 
                onClick={() => scroll(800)}
                className="absolute right-2 top-1/2 -translate-y-8 z-40 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hidden md:block"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default MovieRow;