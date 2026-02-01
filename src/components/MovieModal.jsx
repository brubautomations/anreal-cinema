import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Plus, Check, Volume2, VolumeX } from 'lucide-react';

const MovieModal = ({ movie, onClose }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isInList, setIsInList] = useState(false);

    // 1. Load Initial State (List & Progress)
    useEffect(() => {
        // Check List
        const currentList = JSON.parse(localStorage.getItem('anreal_mylist') || '[]');
        setIsInList(currentList.some(m => m.id === movie.id));

        // Check Progress
        const progressData = JSON.parse(localStorage.getItem('anreal_progress') || '{}');
        const savedTime = progressData[movie.id]?.time || 0;
        
        // If saved time exists, we can seek to it (once video metadata loads)
        // We'll set a flag to seek later or handle it in onLoadedMetadata
    }, [movie.id]);

    // 2. Toggle My List
    const toggleList = () => {
        const currentList = JSON.parse(localStorage.getItem('anreal_mylist') || '[]');
        let newList;
        if (isInList) {
            newList = currentList.filter(m => m.id !== movie.id);
        } else {
            newList = [...currentList, movie];
        }
        localStorage.setItem('anreal_mylist', JSON.stringify(newList));
        setIsInList(!isInList);
        
        // Trigger a custom event so App.tsx knows to update
        window.dispatchEvent(new Event('storage'));
    };

    // 3. Save Progress Loop
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const time = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            if (duration > 0) {
                const percentage = (time / duration) * 100;
                
                // Save to LocalStorage
                const allProgress = JSON.parse(localStorage.getItem('anreal_progress') || '{}');
                allProgress[movie.id] = { time, percentage, lastWatched: Date.now() };
                localStorage.setItem('anreal_progress', JSON.stringify(allProgress));
            }
        }
    };

    // 4. Resume Logic
    const handleLoadedMetadata = () => {
        const progressData = JSON.parse(localStorage.getItem('anreal_progress') || '{}');
        const savedTime = progressData[movie.id]?.time || 0;
        if (savedTime > 0 && videoRef.current) {
            videoRef.current.currentTime = savedTime;
        }
    };

    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-5xl bg-[#141414] rounded-xl overflow-hidden shadow-2xl border border-white/10">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Video Player Area */}
                <div className="relative aspect-video bg-black group">
                    {!movie.isComingSoon ? (
                        <video 
                            ref={videoRef}
                            src={movie.videoUrl} 
                            className="w-full h-full"
                            controls 
                            autoPlay
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900">
                             <img src={movie.backdrop || movie.poster} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                             <div className="relative z-10 text-center">
                                <h2 className="text-3xl font-black italic text-white mb-2">COMING SOON</h2>
                                <p className="text-slate-300">Unlock date: Sunday, 6:00 AM</p>
                             </div>
                        </div>
                    )}
                </div>

                {/* Details Area */}
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        
                        {/* Poster (Mobile Hidden) */}
                        <div className="hidden md:block w-32 shrink-0">
                            <img src={movie.poster} className="rounded shadow-lg" />
                        </div>

                        {/* Text Info */}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
                            
                            <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                                <span>{movie.year || "Classic"}</span>
                                <span className="border border-slate-600 px-1 rounded text-xs">HD</span>
                            </div>

                            <p className="text-slate-300 leading-relaxed mb-6">
                                {movie.description}
                            </p>

                            <div className="flex gap-3">
                                {!movie.isComingSoon && (
                                    <button 
                                        onClick={() => videoRef.current?.play()}
                                        className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        <Play size={20} fill="currentColor" /> Play
                                    </button>
                                )}
                                
                                <button 
                                    onClick={toggleList}
                                    className="flex items-center gap-2 border border-slate-500 text-white px-6 py-2 rounded font-bold hover:border-white transition-colors"
                                >
                                    {isInList ? <Check size={20} /> : <Plus size={20} />}
                                    {isInList ? 'In My List' : 'My List'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieModal;