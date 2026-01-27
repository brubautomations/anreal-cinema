import React from 'react';
import MovieCard from './MovieCard';

export default function MovieGrid({ title, movies, onMovieClick }) {
    if (!movies || movies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-slate-500 italic">
                No movies available in this section.
            </div>
        );
    }

    return (
        <div className="px-6 md:px-12 py-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">
                    {title} <span className="text-red-600">Collection</span>
                </h2>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                    {movies.length} Artifacts
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {movies.map((movie) => (
                    <div key={movie.id} className="w-full">
                        <MovieCard
                            movie={movie}
                            onClick={onMovieClick}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
