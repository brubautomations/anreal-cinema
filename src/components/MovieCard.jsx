import React, { useState } from 'react';
import { Play, Lock, Film } from 'lucide-react';

const MovieCard = ({ movie, onClick }) => {
    const [imgError, setImgError] = useState(false);
    const isComingSoon = movie.isComingSoon;

    return (
        <div 
            onClick={() => !isComingSoon && onClick(movie)}
            className={`relative flex-none w-44 md:w-72 aspect-[2/3] group cursor-pointer overflow-hidden rounded-md transition-all duration-500 hover:z-10 shadow-lg bg-slate-900 select-none ${
                isComingSoon ? 'grayscale-[0.8] cursor-not-allowed opacity-60 hover:scale-100' : 'hover:scale-105'
            }`}
        >
            {imgError ? (
                // FALLBACK if image is broken
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center border border-white/5">
                    <Film className="w-12 h-12 text-red-600/40 mb-3" />
                    <h3 className="text-white font-black text-xs md:text-sm uppercase italic tracking-tighter line-clamp-3">
                        {movie.title}
                    </h3>
                </div>
            ) : (
                <img 
                    src={movie.poster || movie.image} 
                    alt={movie.title}
                    onError={() => setImgError(true)}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                    loading="lazy"
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                {isComingSoon ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest">
                            <Lock className="w-4 h-4" /> Locked
                        </div>
                        <h3 className="text-white font-bold text-sm md:text-lg leading-tight">{movie.title}</h3>
                        <p className="text-[10px] text-slate-400">Scheduled for Ingestion</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-white font-bold text-sm md:text-lg leading-tight mb-1 line-clamp-2">{movie.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-red-600 p-1.5 rounded-full">
                                <Play className="w-3 h-3 text-white fill-current" />
                            </div>
                            <span className="text-slate-300 text-[10px] md:text-xs">Watch Now</span>
                        </div>
                    </>
                )}
            </div>

            {/* Badges */}
            {!isComingSoon && (
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    HD
                </div>
            )}
            {isComingSoon && (
                <div className="absolute top-2 right-2 bg-red-600/90 border border-white/10 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest text-white">
                    Soon
                </div>
            )}
        </div>
    );
};

export default MovieCard;