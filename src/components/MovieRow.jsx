import React, { useState, useEffect } from 'react';
import { useMovies } from '../hooks/useMovies';
import MovieCard from './MovieCard';
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react';
import { useDraggable } from '../hooks/useDraggable';

export default function MovieRow({ genre, onMovieClick }) {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const { fetchMovies, loading } = useMovies();
    const { ref, isDragging, ...dragProps } = useDraggable();

    const loadMovies = async (p) => {
        const newMovies = await fetchMovies(genre.search, p);
        if (newMovies.length > 0) {
            setMovies(prev => [...prev, ...newMovies]);
        }
    };

    useEffect(() => {
        const load = async () => {
            const newMovies = await fetchMovies(genre.search, 1);
            setMovies(newMovies);
        };
        load();
    }, [genre.search, fetchMovies]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadMovies(nextPage);
    };

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
                    {movies.map((movie, idx) => (
                        <div key={`${movie.id}-${idx}`} className="snap-start flex-none">
                            <MovieCard movie={movie} onClick={handleMovieClick} />
                        </div>
                    ))}

                    {loading ? (
                        <div className="flex-none w-40 md:w-64 aspect-[2/3] bg-slate-900 animate-pulse rounded-md flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
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
