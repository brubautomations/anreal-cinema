import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieRow = ({ genre, movies, onMovieClick, onToggleList, myList }) => {
    const rowRef = useRef(null);

    const scroll = (offset) => {
        if (rowRef.current) {
            rowRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    return (
        <div className="mb-8 group relative px-4 md:px-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                {genre.name}
            </h2>

            <button 
                onClick={() => scroll(-800)}
                className="absolute left-2 top-1/2 -translate-y-8 z-40 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hidden md:block"
            >
                <ChevronLeft size={24} />
            </button>

            <div 
                ref={rowRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {movies.map((movie) => (
                    <div key={movie.id} className="flex-none">
                        <MovieCard 
                            movie={movie} 
                            onClick={onMovieClick}
                            onToggleList={onToggleList}
                            isInList={myList.some(m => m.id === movie.id)}
                        />
                    </div>
                ))}
            </div>

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