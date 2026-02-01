import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieModal from './components/MovieModal';
import GenreBar from './components/GenreBar';
import MovieGrid from './components/MovieGrid';
import MovieCard from './components/MovieCard'; // Using the stable card
import { GENRES } from './config/GenreConfig';

// --- DATA IMPORTS ---
import vaultMoviesData from './data/movies.json'; 
import comingSoonData from './data/coming_soon.json';

// --- CONFIGURATION ---
const API_KEY = '9f779ecda119c29a7de55ce4e7f4f56c'; 
const START_DATE = new Date('2026-02-01T06:00:00'); 
const BATCH_SIZE = 50;

function App() {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [activePage, setActivePage] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
    
    // MY LIST STATE
    const [myList, setMyList] = useState([]);

    const [schedule, setSchedule] = useState({
        vaultMovies: [],
        recentMovies: [],
        comingSoonMovies: []
    });

    // --- LOAD MY LIST ---
    useEffect(() => {
        try {
            const listRaw = localStorage.getItem('anreal_mylist');
            if (listRaw) setMyList(JSON.parse(listRaw));
        } catch (error) {
            console.error("Storage error", error);
        }
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

    // --- AUTOMATION ENGINE ---
    useEffect(() => {
        const getRawSchedule = () => {
            const now = new Date();
            const msPerWeek = 7 * 24 * 60 * 60 * 1000;
            
            const sanitize = (list) => (!list ? [] : list.map(m => ({
                ...m,
                id: m.id || Math.random().toString(36).substr(2, 9),
                poster: m.poster || m.image, 
                image: m.image || m.poster, 
                videoUrl: m.videoUrl || "/banner.mp4",
                topics: Array.isArray(m.topics) ? m.topics : [] 
            })));

            let vaultMovies = [];
            let recentMovies = [];
            let comingSoonMovies = [];

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
            
            return { vaultMovies, recentMovies, comingSoonMovies };
        };

        const raw = getRawSchedule();
        
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
                comingSoonMovies: com
            });
        };
        run();
    }, []);

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
    
    // RENDERING HELPERS
    const renderMovieRow = (title, movies) => {
        if (!movies || movies.length === 0) return null;
        return (
            <div className="mb-12 pl-6 md:pl-12">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    {title}
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-2">
                    {movies.map(movie => (
                        <MovieCard 
                            key={movie.id} 
                            movie={movie} 
                            onClick={setSelectedMovie}
                            onToggleList={toggleMyList}
                            isInList={myList.some(m => m.id === movie.id)}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const renderGrid = (title, movies) => (
        <div className="pt-8 px-6">
            <h2 className="text-3xl font-black italic mb-8 uppercase">{title}</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map(movie => (
                    <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        onClick={setSelectedMovie} 
                        onToggleList={toggleMyList} 
                        isInList={myList.some(m => m.id === movie.id)} 
                    />
                ))}
            </div>
        </div>
    );

    const safeVault = schedule.vaultMovies || [];
    const safeRecent = schedule.recentMovies || [];
    const safeComingSoon = schedule.comingSoonMovies || [];
    const allSearchable = [...safeVault, ...safeRecent, ...safeComingSoon];
    const searchResults = searchQuery ? allSearchable.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())) : [];

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-600 selection:text-white">
            <Navbar activePage={activePage} setActivePage={setActivePage} onSearch={handleSearch} />

            <main className="relative z-10 pt-16">
                {searchQuery ? renderGrid(`Results for "${searchQuery}"`, searchResults) : (
                    <>
                        {activePage === 'home' && (
                            <>
                                <Hero onRandomWatch={() => {}} />
                                <GenreBar onGenreSelect={handleGenreSelect} selectedGenre={selectedGenre} />
                                <div className="z-20 relative mt-8 pb-20">
                                    {renderMovieRow("Recently Added", safeRecent)}
                                    
                                    {GENRES.map(genre => (
                                        <div key={genre.id} id={`genre-${genre.id}`}>
                                            {renderMovieRow(genre.name, safeVault.filter(m => {
                                                if (!m.topics || !Array.isArray(m.topics)) return false;
                                                return m.topics.some(t => typeof t === 'string' && t.toLowerCase().includes(genre.id));
                                            }).slice(0, 10))}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {activePage === 'movies' && renderGrid("The Vault", safeVault)}
                        {activePage === 'recent' && renderGrid("Recently Added", safeRecent)}
                        {activePage === 'popular' && renderGrid("Coming Soon", safeComingSoon)}

                        {activePage === 'mylist' && (
                            <div className="pt-8 px-6 min-h-[60vh]">
                                <h2 className="text-3xl font-black italic mb-8">MY <span className="text-red-600">LIST</span></h2>
                                {myList.length === 0 ? (
                                    <p className="text-slate-500">Your list is empty. Click the + on any movie.</p>
                                ) : (
                                    renderGrid("My Watchlist", myList)
                                )}
                            </div>
                        )}
                        
                        {activePage === 'about' && (
                           <div className="pt-24 px-6 md:px-20 max-w-4xl mx-auto text-slate-300 pb-20">
                                <h1 className="text-4xl md:text-5xl font-black italic mb-10 uppercase tracking-tighter text-white">
                                    About <span className="text-red-600">Anreal Cinema</span>
                                </h1>
                                
                                <div className="space-y-12 text-lg leading-relaxed">
                                    <section>
                                        <p className="mb-4 text-xl text-white font-medium">
                                            Anreal Cinema is a digital streaming archive focused on public-domain and copyright-expired films.
                                        </p>
                                        <p>
                                            The platform provides legal access to classic motion pictures from the silent era through mid-20th-century cinema, including early horror, science fiction, drama, and documentary titles that are no longer under active copyright protection. Our goal is simple: to make historically significant films accessible in a modern viewing format.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-red-600 pl-4">AI-Driven Platform</h3>
                                        <p className="mb-4">
                                            Anreal Cinema is operated primarily through automated systems. Approximately 99% of the platform is managed by artificial intelligence, including:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-400">
                                            <li>Film indexing and catalog organization</li>
                                            <li>Metadata generation and search optimization</li>
                                            <li>Video processing and formatting</li>
                                            <li>Playback delivery and monitoring</li>
                                            <li>Archival maintenance</li>
                                        </ul>
                                        <p>
                                            Selected titles on the platform have undergone AI-assisted restoration, improving image stability, clarity, and audio balance while maintaining the integrity of the original material. No narrative, visual, or editorial modifications are introduced.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-red-600 pl-4">Film Sources and Restoration</h3>
                                        <p className="mb-4">
                                            All films hosted on Anreal Cinema are verified to be:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-400">
                                            <li>In the public domain, or</li>
                                            <li>Free of active copyright restrictions</li>
                                        </ul>
                                        <p>
                                            Where available, original or historically accurate cuts are used. In some cases, enhanced versions are presented to improve viewing quality on modern displays.
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-red-600 pl-4">Purpose</h3>
                                        <p className="mb-4">
                                            Anreal Cinema is not a commercial streaming service and does not host newly released or licensed studio content. It exists as a preservation-focused archive intended for:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-400">
                                            <li>Education</li>
                                            <li>Research</li>
                                            <li>Historical reference</li>
                                            <li>General public viewing</li>
                                        </ul>
                                        <p>
                                            The platform is designed to operate quietly in the background, allowing the films themselves to remain the focus.
                                        </p>
                                    </section>

                                    <section className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 mt-8">
                                        <h3 className="text-xl font-bold text-white mb-2">Legal Notice</h3>
                                        <p className="text-sm text-slate-500">
                                            Copyright laws vary by jurisdiction. Public-domain status is evaluated using available records and U.S. copyright standards. If you believe a title has been listed incorrectly, please contact the site administrator for review.
                                        </p>
                                    </section>
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
                        Powered by <a href="https://brubai.net/" target="_blank" rel="noopener noreferrer" className="text-red-500 font-bold hover:text-red-400 transition-colors">BRUB AI</a>
                    </p>
                </div>
            </footer>

            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </div>
    );
}

export default App;