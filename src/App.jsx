import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieModal from './components/MovieModal';
import GenreBar from './components/GenreBar';
import MovieGrid from './components/MovieGrid';
import SmartMovieCard from './components/SmartMovieCard'; 
import { GENRES } from './config/GenreConfig';

// --- DATA IMPORTS ---
import vaultMoviesData from './data/movies.json'; 
import comingSoonData from './data/coming_soon.json';
import originalsData from './data/originals.json'; 

// --- CONFIGURATION ---
const API_KEY = '9f779ecda119c29a7de55ce4e7f4f56c'; 
const START_DATE = new Date('2026-02-01T06:00:00'); 
const BATCH_SIZE = 50;

function App() {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [activePage, setActivePage] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
    
    // User Data State
    const [myList, setMyList] = useState([]);
    const [watchProgress, setWatchProgress] = useState({});

    // Movie Data State
    const [schedule, setSchedule] = useState({
        vaultMovies: [],
        recentMovies: [],
        comingSoonMovies: [],
        originalMovies: [] 
    });

    // --- 0. SAFELY LOAD USER DATA ---
    const loadUserData = () => {
        try {
            const listRaw = localStorage.getItem('anreal_mylist');
            const progressRaw = localStorage.getItem('anreal_progress');
            
            const list = listRaw ? JSON.parse(listRaw) : [];
            const progress = progressRaw ? JSON.parse(progressRaw) : {};
            
            setMyList(list);
            setWatchProgress(progress);
        } catch (error) {
            console.error("Error loading user data:", error);
            localStorage.setItem('anreal_mylist', '[]');
            localStorage.setItem('anreal_progress', '{}');
        }
    };

    useEffect(() => {
        loadUserData();
        window.addEventListener('storage', loadUserData);
        return () => window.removeEventListener('storage', loadUserData);
    }, []);

    const toggleMyList = (movie) => {
        const currentList = [...myList];
        const exists = currentList.find(m => m.id === movie.id);
        let newList;
        if (exists) {
            newList = currentList.filter(m => m.id !== movie.id);
        } else {
            newList = [...currentList, movie];
        }
        localStorage.setItem('anreal_mylist', JSON.stringify(newList));
        setMyList(newList);
    };

    // --- 1. AUTOMATION & API ENGINE ---
    useEffect(() => {
        const getRawSchedule = () => {
            const now = new Date();
            const msPerWeek = 7 * 24 * 60 * 60 * 1000;
            
            // Helper: Sanitize AND ensure topics is an array
            const sanitize = (list) => (!list ? [] : list.map(m => ({
                ...m,
                id: m.id || Math.random().toString(36).substr(2, 9),
                poster: m.poster || m.image, 
                image: m.image || m.poster, 
                videoUrl: m.videoUrl || "/banner.mp4",
                topics: Array.isArray(m.topics) ? m.topics : [] // Fix for the Crash
            })));

            // Initialize variables
            let vaultMovies = [];
            let recentMovies = [];
            let comingSoonMovies = [];
            let originalMovies = originalsData ? sanitize(originalsData).map(m => ({ ...m, isComingSoon: false })) : [];

            if (now < START_DATE) {
                vaultMovies = sanitize(vaultMoviesData).map(m => ({ ...m, isComingSoon: false }));
                comingSoonMovies = sanitize(comingSoonData.slice(0, BATCH_SIZE)).map(m => ({ ...m, isComingSoon: true })); 
            } else {
                const weeksPassed = Math.floor((now.getTime() - START_DATE.getTime()) / msPerWeek);
                
                const vaultFromNewData = comingSoonData.slice(0, weeksPassed * BATCH_SIZE);
                vaultMovies = sanitize([...vaultMoviesData, ...vaultFromNewData]).map(m => ({ ...m, isComingSoon: false }));
                
                const recentStart = weeksPassed * BATCH_SIZE;
                const recentEnd = recentStart + BATCH_SIZE;
                recentMovies = sanitize(comingSoonData.slice(recentStart, recentEnd)).map(m => ({ ...m, isComingSoon: false }));
                
                const comingSoonStart = recentEnd;
                const comingSoonEnd = comingSoonStart + BATCH_SIZE;
                comingSoonMovies = sanitize(comingSoonData.slice(comingSoonStart, comingSoonEnd)).map(m => ({ ...m, isComingSoon: true }));
            }
            
            return { vaultMovies, recentMovies, comingSoonMovies, originalMovies };
        };

        const raw = getRawSchedule();
        
        // Fetch Posters logic
        const fetchPoster = async (movie) => {
            if ((movie.poster && movie.poster.includes('tmdb.org'))) return movie;
            try {
                const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.title)}`);
                const data = await res.json();
                if (data.results?.[0]) {
                    const hit = data.results[0];
                    const hdPoster = `https://image.tmdb.org/t/p/w500${hit.poster_path}`;
                    return { 
                        ...movie, 
                        poster: hdPoster, 
                        image: hdPoster, 
                        backdrop: `https://image.tmdb.org/t/p/original${hit.backdrop_path}`,
                        overview: hit.overview || movie.description
                    };
                }
            } catch (e) {}
            return movie;
        };

        const run = async () => {
            const [rec, com] = await Promise.all([
                Promise.all(raw.recentMovies.map(fetchPoster)),
                Promise.all(raw.comingSoonMovies.map(fetchPoster))
            ]);
            
            setSchedule({ 
                vaultMovies: raw.vaultMovies,
                recentMovies: rec, 
                comingSoonMovies: com,
                originalMovies: raw.originalMovies
            });
        };
        run();
    }, []);


    // --- RENDERING HELPERS ---
    
    // THIS WAS MISSING BEFORE - IT IS HERE NOW
    const handleSearch = (query) => {
        setSearchQuery(query);
        setActivePage(query ? 'search' : 'home');
    };

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);
        setSearchQuery('');
        if (genre) {
            setActivePage('home');
            setTimeout(() => {
                const element = document.getElementById(`genre-${genre.id}`);
                if (element) {
                     window.scrollTo({
                        top: element.getBoundingClientRect().top + window.scrollY - 140,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    // Safe Arrays for rendering
    const safeVault = schedule.vaultMovies || [];
    const safeRecent = schedule.recentMovies || [];
    const safeOriginals = schedule.originalMovies || [];
    const safeComingSoon = schedule.comingSoonMovies || [];

    const continueWatchingMovies = [...safeVault, ...safeRecent, ...safeOriginals]
        .filter(m => {
            const prog = watchProgress[m.id];
            return prog && prog.percentage > 0 && prog.percentage < 95;
        });

    const renderMovieRow = (title, movies) => {
        if (!movies || movies.length === 0) return null;
        return (
            <div className="mb-12 pl-6 md:pl-12">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    {title}
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-2">
                    {movies.map(movie => (
                        <SmartMovieCard 
                            key={movie.id} 
                            movie={movie} 
                            onClick={setSelectedMovie}
                            onToggleList={toggleMyList}
                            isInList={myList.some(m => m.id === movie.id)}
                            progress={watchProgress[movie.id]?.percentage || 0}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const allSearchable = [...safeVault, ...safeRecent, ...safeComingSoon, ...safeOriginals];
    const searchResults = searchQuery ? allSearchable.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())) : [];

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-600 selection:text-white">
            <Navbar activePage={activePage} setActivePage={setActivePage} onSearch={handleSearch} />

            <main className="relative z-10 pt-16">
                
                {searchQuery ? (
                    <div className="pt-8 px-6">
                        <h2 className="text-2xl font-bold mb-6">Results for "{searchQuery}"</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                             {searchResults.map(movie => (
                                <SmartMovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} onToggleList={toggleMyList} isInList={myList.some(m => m.id === movie.id)} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {activePage === 'home' && (
                            <>
                                <Hero onRandomWatch={() => {}} />
                                <div className="z-20 relative mt-8 pb-20">
                                    {continueWatchingMovies.length > 0 && renderMovieRow("Continue Watching", continueWatchingMovies)}
                                    {renderMovieRow("Recently Added", schedule.recentMovies)}
                                    {renderMovieRow("Anreal Originals", schedule.originalMovies)}
                                    {/* CRASH FIX: ADDED ULTRA SAFE FILTERING */}
                                    {GENRES.slice(0, 5).map(genre => (
                                        renderMovieRow(genre.name, safeVault.filter(m => {
                                            if (!m.topics) return false;
                                            return m.topics.some(t => {
                                                if (typeof t !== 'string') return false; // Safety Check
                                                return t.toLowerCase().includes(genre.id);
                                            });
                                        }).slice(0, 10))
                                    ))}
                                </div>
                            </>
                        )}

                        {activePage === 'movies' && (
                             <div className="pt-8 px-6">
                                <h2 className="text-3xl font-black italic mb-8">THE <span className="text-red-600">VAULT</span></h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {safeVault.map(movie => <SmartMovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} onToggleList={toggleMyList} isInList={myList.some(m => m.id === movie.id)} />)}
                                </div>
                            </div>
                        )}

                        {activePage === 'recent' && (
                             <div className="pt-8 px-6">
                                <h2 className="text-3xl font-black italic mb-8">RECENTLY <span className="text-red-600">ADDED</span></h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {safeRecent.map(movie => <SmartMovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} onToggleList={toggleMyList} isInList={myList.some(m => m.id === movie.id)} />)}
                                </div>
                            </div>
                        )}

                        {activePage === 'popular' && (
                             <div className="pt-8 px-6">
                                <h2 className="text-3xl font-black italic mb-8">COMING <span className="text-red-600">SOON</span></h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {safeComingSoon.map(movie => <SmartMovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} onToggleList={toggleMyList} isInList={myList.some(m => m.id === movie.id)} />)}
                                </div>
                            </div>
                        )}

                        {activePage === 'mylist' && (
                            <div className="pt-8 px-6 min-h-[60vh]">
                                <h2 className="text-3xl font-black italic mb-8">MY <span className="text-red-600">LIST</span></h2>
                                {myList.length === 0 ? (
                                    <p className="text-slate-500">Your list is empty. Add movies using the + button.</p>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {myList.map(movie => (
                                            <SmartMovieCard 
                                                key={movie.id} 
                                                movie={movie} 
                                                onClick={setSelectedMovie} 
                                                onToggleList={toggleMyList} 
                                                isInList={true}
                                                progress={watchProgress[movie.id]?.percentage || 0}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                         {activePage === 'originals' && (
                            <div className="pt-8 px-6">
                                <h2 className="text-3xl font-black italic mb-8">ANREAL <span className="text-red-600">ORIGINALS</span></h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {safeOriginals.map(movie => <SmartMovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} onToggleList={toggleMyList} isInList={myList.some(m => m.id === movie.id)} />)}
                                </div>
                            </div>
                        )}
                        
                        {activePage === 'about' && (
                           <div className="pt-24 px-6 md:px-20 max-w-4xl mx-auto text-slate-300 pb-20">
                                <h1 className="text-4xl md:text-5xl font-black italic mb-10 uppercase tracking-tighter text-white">
                                    About <span className="text-red-600">Anreal Cinema</span>
                                </h1>
                                <div className="space-y-12 text-lg leading-relaxed">
                                    <p className="mb-4 text-xl text-white font-medium">Anreal Cinema is a digital streaming archive focused on public-domain and copyright-expired films.</p>
                                    <p>This platform is automated. New movies are unlocked from the archives every Sunday.</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            <footer className="border-t border-white/5 py-16 px-6 md:px-20 mt-20 bg-slate-950/80 backdrop-blur-xl relative">
                <div className="flex flex-col items-center gap-6">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">ANREAL <span className="text-red-600">CINEMA</span></h2>
                    <p className="text-slate-400 text-sm">
                        Powered by <a href="https://brubai.net/" className="text-red-500 font-bold">BRUB AI</a>
                    </p>
                </div>
            </footer>

            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={() => { setSelectedMovie(null); loadUserData(); }} />
            )}
        </div>
    );
}

export default App;