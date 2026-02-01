import React, { useState } from 'react';
import { Play, Lock } from 'lucide-react';

const MovieCard = ({ movie, onClick }) => {
    const [imgSrc, setImgSrc] = useState(movie.poster || movie.image);

    const handleError = () => {
        setImgSrc("https://placehold.co/400x600/1e293b/ffffff?text=No+Image");
    };

    return (
        <div 
            className="relative flex-none w-[160px] md:w-[200px] aspect-[2/3] rounded-md overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer group bg-slate-900 shadow-lg"
            onClick={() => !movie.isComingSoon && onClick(movie)}
        >
            <img 
                src={imgSrc} 
                alt={movie.title}
                onError={handleError}
                className={`w-full h-full object-cover transition-all duration-300 ${
                    movie.isComingSoon ? 'grayscale opacity-50' : 'group-hover:opacity-40'
                }`}
                loading="lazy"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {!movie.isComingSoon ? (
                    <>
                        <div className="flex justify-center mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            <div className="bg-red-600 rounded-full p-3 shadow-lg">
                                <Play fill="white" className="text-white ml-1" size={24} />
                            </div>
                        </div>
                        <h3 className="text-white font-bold text-center text-sm drop-shadow-md">{movie.title}</h3>
                        <p className="text-slate-300 text-xs text-center mt-1">{movie.year}</p>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Lock className="text-slate-400 mb-2" size={32} />
                        <span className="text-slate-400 font-bold text-xs tracking-widest uppercase border border-slate-500 px-2 py-1 rounded">Locked</span>
                        <span className="text-slate-500 text-[10px] mt-2">Coming Sunday</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieCard;