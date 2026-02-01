import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Lock } from 'lucide-react';

const SmartMovieCard = ({ movie, onClick, onToggleList, isInList, progress }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [playPreview, setPlayPreview] = useState(false);

    useEffect(() => {
        let timer;
        // ONLY play preview if hovered AND NOT coming soon
        if (isHovered && !movie.isComingSoon) {
            timer = setTimeout(() => setPlayPreview(true), 800); 
        } else {
            setPlayPreview(false);
        }
        return () => clearTimeout(timer);
    }, [isHovered, movie.isComingSoon]);

    return (
        <div 
            className="relative flex-none w-[160px] md:w-[240px] aspect-[2/3] rounded-md overflow-hidden transition-all duration-300 ease-in-out cursor-pointer group bg-slate-900"
            style={{ 
                transform: isHovered && !movie.isComingSoon ? 'scale(1.05)' : 'scale(1)',
                zIndex: isHovered ? 20 : 1,
                // THIS FIXES THE "COMING SOON" LOOK:
                filter: movie.isComingSoon ? 'grayscale(100%) brightness(70%)' : 'none',
                pointerEvents: movie.isComingSoon ? 'none' : 'auto' // Optional: prevent clicking
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick(movie)}
        >
            {/* 1. MEDIA LAYER */}
            {playPreview && movie.videoUrl && !movie.videoUrl.includes('youtube') ? (
                <video
                    src={movie.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                />
            ) : (
                <img 
                    src={movie.poster || movie.image} 
                    alt={movie.title} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                />
            )}

            {/* 2. OVERLAY LAYER (Dark gradient on hover) */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3`}>
                
                {!movie.isComingSoon && (
                    <div className="flex gap-2 mb-2">
                        <button className="bg-white text-black p-1.5 rounded-full hover:bg-slate-200">
                            <Play size={16} fill="currentColor" />
                        </button>
                        
                        <button 
                            className={`border-2 p-1.5 rounded-full hover:border-white ${isInList ? 'bg-red-600 border-red-600 text-white' : 'border-slate-400 text-white bg-black/50'}`}
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onToggleList(movie);
                            }}
                        >
                            {isInList ? <Check size={16} /> : <Plus size={16} />}
                        </button>
                    </div>
                )}

                <h3 className="text-white font-bold text-sm leading-tight drop-shadow-md">
                    {movie.title}
                </h3>
                
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-300 font-medium">
                   {movie.isComingSoon ? (
                       <div className="flex items-center gap-1 text-amber-400">
                           <Lock size={12} /> <span>COMING SUNDAY</span>
                       </div>
                   ) : (
                       <span>WATCH NOW</span>
                   )}
                </div>
            </div>

            {/* 3. PROGRESS BAR */}
            {progress > 0 && progress < 95 && !movie.isComingSoon && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-700/50">
                    <div 
                        className="h-full bg-red-600" 
                        style={{ width: `${progress}%` }} 
                    />
                </div>
            )}
        </div>
    );
};

export default SmartMovieCard;