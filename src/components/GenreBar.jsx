import React from 'react';
import { GENRES } from '../config/GenreConfig';
import { useDraggable } from '../hooks/useDraggable';

export default function GenreBar({ onGenreSelect, selectedGenre }) {
    const { ref, ...dragProps } = useDraggable();

    return (
        <div className="sticky top-16 z-40 bg-slate-950/80 backdrop-blur-md px-6 md:px-12 py-4 border-b border-white/5">
            <div
                ref={ref}
                {...dragProps}
                className="flex gap-3 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing px-2"
            >
                <button
                    onClick={() => onGenreSelect(null)}
                    className={`flex-none px-6 py-2 rounded-full text-sm font-bold transition-all ${!selectedGenre
                            ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5'
                        }`}
                >
                    All Genres
                </button>
                {GENRES.map((genre) => (
                    <button
                        key={genre.id}
                        onClick={() => onGenreSelect(genre)}
                        className={`flex-none px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedGenre?.id === genre.id
                                ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5'
                            }`}
                    >
                        {genre.title}
                    </button>
                ))}
            </div>
        </div>
    );
}
