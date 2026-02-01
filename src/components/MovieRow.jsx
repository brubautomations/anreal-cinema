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

    // --- DRAG TO SCROLL LOGIC ---
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
        const walk = (x - startX) * 2; // Scroll speed
        rowRef.current.scrollLeft = scrollLeft - walk;
    };

    // Safe Filter to prevent crashes
    const genreMovies = movies.filter(movie => {
        if (!movie.topics) return false;
        const topics = Array.isArray(movie.topics) 
            ? movie.topics 
            : movie.topics.split(',').map(t => t.trim());
        return topics.some(t => t && t.toString().toLowerCase().includes(genre.id.toLowerCase()));
    });

    const moviesToRender = genre.id === 'custom' ? movies : genreMovies;

    if (moviesToRender.length === 0) return null;

    return (
        <div className="mb-12 group relative px-6 md:px-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                {genre.name}
            </h2>

            {/* Left Button */}
            <button 
                onClick={() => scroll(-800)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
            >
                <ChevronLeft size={24} />
            </button>

            {/* SCROLL CONTAINER */}
            <div 
                ref={rowRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 cursor-grab active:cursor-grabbing no-scrollbar"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {moviesToRender.map((movie) => (
                    <div key={movie.id} className="flex-none pointer-events-none md:pointer-events-auto">
                        <MovieCard 
                            movie={movie} 
                            // Prevent click if dragging
                            onClick={(m) => !isDragging && onMovieClick(m)} 
                        />
                    </div>
                ))}
            </div>

            {/* Right Button */}
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