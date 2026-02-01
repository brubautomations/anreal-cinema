import React, { useState } from 'react';
import { Play, Lock } from 'lucide-react';

const MovieCard = ({ movie, onClick }) => {
    const [imgSrc, setImgSrc] = useState(movie.poster || movie.image);

    const handleError = () => {
        setImgSrc("https://placehold.co/400x600/1e293b/ffffff?text=No+Image");
    };

    return (
        <div 
            onClick={() => !movie.isComingSoon && onClick(movie)}
            className={`relative flex-none w-44 md:w-72 aspect-[2/3] group cursor-pointer overflow-hidden rounded-md transition-all duration-500 hover:z-10 shadow-lg bg-slate-900 select-none ${
                movie.isComingSoon ? 'grayscale-[0.8] cursor-not-allowed opacity-60 hover:scale-100' : 'hover:scale-105'
            }`}
        >
            <img 
                src={imgSrc} 
                alt={movie.title}
                onError={handleError}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                {movie.isComingSoon ? (
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
        </div>
    );
};

export default MovieCard;