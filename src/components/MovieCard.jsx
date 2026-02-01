import React from 'react';
import { Play, Lock, Plus, Check } from 'lucide-react';

const MovieCard = ({ movie, onClick, onToggleList, isInList }) => {
    return (
        <div 
            className="relative flex-none w-[160px] md:w-[200px] aspect-[2/3] rounded-md overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer group bg-slate-900"
            onClick={() => !movie.isComingSoon && onClick(movie)}
        >
            <img 
                src={movie.poster || movie.image} 
                alt={movie.title} 
                className={`w-full h-full object-cover transition-all duration-300 ${
                    movie.isComingSoon ? 'grayscale opacity-50' : 'group-hover:opacity-40'
                }`}
                loading="lazy"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {!movie.isComingSoon ? (
                    <>
                        {/* ACTION BUTTONS ROW */}
                        <div className="flex justify-center gap-4 mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            {/* PLAY BUTTON */}
                            <button className="bg-red-600 rounded-full p-3 shadow-lg hover:bg-red-700">
                                <Play fill="white" className="text-white ml-1" size={24} />
                            </button>
                            
                            {/* MY LIST BUTTON (NEW) */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleList(movie);
                                }}
                                className={`rounded-full p-3 shadow-lg border-2 ${
                                    isInList 
                                    ? 'bg-white border-white text-black' 
                                    : 'bg-black/50 border-white text-white hover:bg-white/20'
                                }`}
                            >
                                {isInList ? <Check size={24} /> : <Plus size={24} />}
                            </button>
                        </div>

                        <h3 className="text-white font-bold text-center text-sm drop-shadow-md">{movie.title}</h3>
                        <p className="text-slate-300 text-xs text-center mt-1">{movie.year}</p>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Lock className="text-slate-400 mb-2" size={32} />
                        <span className="text-slate-400 font-bold text-xs tracking-widest uppercase">Locked</span>
                        <span className="text-slate-500 text-[10px] mt-1">Available Sunday</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieCard;