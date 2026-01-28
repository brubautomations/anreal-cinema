import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react';
import { useDraggable } from '../hooks/useDraggable';

export default function MovieRow({ genre, movies = [], onMovieClick }) {
    // 1. THE FIX: Look for 'topics' OR 'genre' (Case Insensitive)
    const allGenreMovies = movies.filter(movie => {
        // Get the list of tags from the movie (handle missing data safely)
        const tags = movie.topics || movie.genre || [];
        
        // Check if any tag matches the Genre Title (e.g. "Horror" matches "Horror")
        return Array.isArray(tags) && tags.some(tag => 
            tag && (
                tag.toString().toLowerCase().includes(genre.title.toLowerCase()) || 
                genre.title.toLowerCase().includes(tag.toString().toLowerCase())
            )
        );
    });

    // 2. Pagination State
    const [visibleMovies, setVisibleMovies] = useState([]);
    const [page, setPage] = useState(1);
    const MOVIES_PER_PAGE = 10;
    
    // 3. Load initial movies when data arrives
    useEffect(() => {
        const initialMovies = allGenreMovies.slice(0, MOVIES_PER_PAGE);
        setVisibleMovies(initialMovies);
    }, [genre, movies]);

    // 4. Handle "Load More" button
    const handleLoadMore = () => {
        const nextPage = page + 1;
        const nextBatch = allGenreMovies.slice(0, nextPage * MOVIES_PER_PAGE);
        setVisibleMovies(nextBatch);
        setPage(nextPage);
    };

    const hasMore = visibleMovies.length < allGenreMovies.length;

    // 5. Advanced Drag & Scroll Logic (Preserved)
    const { ref, isDragging, ...dragProps } = useDraggable();

    const handleMovieClick = (movie) => {
        if (!isDragging) {
            onMovieClick(movie);
        }
    };

    const scroll = (direction) => {
        if (ref.current) {
            const { scrollLeft, clientWidth } = ref.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth * 0.8
                : scrollLeft + clientWidth * 0.8;

            ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    // If no movies match, hide the row
    if (allGenreMovies.length === 0) return null;

    return (
        <div className="group/row mb-12 last:mb-24 px-6 md:px-12 relative">
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                {genre.title}
            </h2>

            <div className="relative group/scroll">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-2 rounded-full text-white opacity-0 group-hover/scroll:opacity-100 transition-opacity hidden md:block"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div
                    ref={ref}
                    {...dragProps}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing"
                >
                    {visibleMovies.map((movie, idx) => (
                        <div key={`${movie.id}-${idx}`} className="snap-start flex-none">
                            <MovieCard movie={movie} onClick={handleMovieClick} />
                        </div>
                    ))}

                    {hasMore && (
                        <button
                            onClick={handleLoadMore}
                            className="flex-none w-40 md:w-64 aspect-[2/3] bg-slate-900/50 hover:bg-slate-900 border-2 border-dashed border-slate-700 hover:border-red-600/50 rounded-md transition-all flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-red-500"
                        >
                            <div className="bg-slate-800 p-3 rounded-full group-hover:bg-slate-700 transition-colors">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-semibold uppercase tracking-wider">Load More</span>
                        </button>
                    )}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-2 rounded-full text-white opacity-0 group-hover/scroll:opacity-100 transition-opacity hidden md:block"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}