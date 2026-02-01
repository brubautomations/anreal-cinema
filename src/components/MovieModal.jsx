import React from 'react';
import { X, Calendar, HardDrive, Tag, Info } from 'lucide-react';

const MovieModal = ({ movie, onClose }) => {
    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-300 flex flex-col overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="sticky top-0 z-[110] w-full px-6 py-4 flex items-center justify-between bg-slate-950/80 backdrop-blur-md border-b border-white/5">
                <button 
                    onClick={onClose}
                    className="flex items-center gap-2 text-white hover:text-red-600 transition-all font-bold group"
                >
                    <span className="text-lg uppercase tracking-wider">Back to Menu</span>
                </button>
                <button 
                    onClick={onClose}
                    className="text-slate-400 hover:text-white transition-colors p-2"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center max-w-6xl mx-auto w-full py-8 px-4">
                
                {/* VIDEO PLAYER (The Fix: Using iframe for Archive.org embeds) */}
                <div className="relative w-full aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 mb-10">
                    <iframe 
                        src={movie.embedUrl || movie.videoUrl} 
                        className="w-full h-full" 
                        frameBorder="0" 
                        allowFullScreen 
                        title={movie.title}
                    ></iframe>
                </div>

                {/* Info Section */}
                <div className="w-full text-slate-100 flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-500">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 text-white">
                            {movie.title}
                        </h2>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-semibold text-slate-400 bg-white/5 py-4 px-6 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-red-600" />
                                <span className="text-white">Year:</span> {movie.year || "Unknown"}
                            </div>
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-red-600" />
                                <span className="text-white">Topics:</span> 
                                {Array.isArray(movie.topics) ? movie.topics.join(", ") : (movie.topics || "Classic")}
                            </div>
                            <div className="flex items-center gap-2">
                                <HardDrive className="w-4 h-4 text-red-600" />
                                <span className="text-white">Downloads:</span> {Math.round(movie.downloads / 1000)}k
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3 text-slate-300 font-bold uppercase tracking-widest text-xs">
                            <Info className="w-4 h-4 text-red-600" /> Synopsis
                        </div>
                        <p className="text-slate-300 text-lg leading-relaxed max-w-4xl bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-white/5 whitespace-pre-wrap">
                            {movie.description || "No description available."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieModal;