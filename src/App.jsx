import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieModal from './components/MovieModal';
import GenreBar from './components/GenreBar';
import MovieGrid from './components/MovieGrid';
import MovieRow from './components/MovieRow'; // Uses the new scrolling row
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
            console.error(error);
        }
    }, []);

    const toggleMyList = (movie) => {
        const currentList = [...myList];
        const exists = currentList.find(m => m.id === movie.id);
        let newList = exists ? currentList.filter(m => m.id !== movie.id) : [...currentList, movie];
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
                poster: m.poster || m.image || "https://placehold.co/400x600/1e293b/ffffff?text=No+Image", 
                image: m.image || m.poster, 
                videoUrl: m.videoUrl || "/banner.mp4",
                topics: Array.isArray(m.topics) ? m.topics : (m.topics ? m.topics.split(',') : []) 
            })));

            let vaultMovies = [], recentMovies = [], comingSoonMovies = [];

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
                    return { ...movie, poster: hdPoster, image: hdPoster, backdrop: `https://image.tmdb.org/t/p/original${hit.backdrop_path}`, overview: hit.overview || movie.description };
                }
            } catch (e) {}
            return movie;
        };

        const run = async () => {
            const [rec, com] = await Promise.all([
                Promise.all(raw.recentMovies.map(fetchPoster)),
                Promise.all(raw.comingSoonMovies.map(fetchPoster))
            ]);
            setSchedule({ vaultMovies: raw.vaultMovies, recentMovies: rec, comingSoonMovies: com });
        };
        run();
    }, []);

    const handleSearch = (query) => { setSearchQuery(query); setActivePage(query ? 'search' : 'home'); };
    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);
        setSearchQuery('');
        if (genre) {
            setActivePage('home');
            setTimeout(() => {
                const element = document.getElementById(`genre-${genre.id}`);
                if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    // SAFE RENDER ROW
    const renderRowSection = (title, movies) => {
        if (!movies || movies.length === 0) return null;
        return (
            <MovieRow 
                genre={{ id: 'custom', name: title }} 
                movies={movies} 
                onMovieClick={setSelectedMovie}
                onToggleList={toggleMyList}
                myList={myList}
            />
        );
    };

    const displayGenres = selectedGenre ? [selectedGenre] : GENRES;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-600 selection:text-white">
            <Navbar activePage={activePage} setActivePage={setActivePage} onSearch={handleSearch} />

            <main className="relative z-10 pt-16">
                {searchQuery ? (
                    <div className="pt-8 px-6">
                        <MovieGrid title={`Results for "${searchQuery}"`} movies={[...schedule.vaultMovies, ...schedule.recentMovies].filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))} onMovieClick={setSelectedMovie} />
                    </div>
                ) : (
                    <>
                        {activePage === 'home' && (
                            <>
                                <Hero onRandomWatch={() => {}} />
                                <GenreBar onGenreSelect={handleGenreSelect} selectedGenre={selectedGenre} />
                                <div className="z-20 relative mt-8 pb-20">
                                    {renderRowSection("Recently Added", schedule.recentMovies)}
                                    {displayGenres.map(genre => (
                                        <div key={genre.id} id={`genre-${genre.id}`}>
                                            <MovieRow genre={genre} movies={schedule.vaultMovies} onMovieClick={setSelectedMovie} onToggleList={toggleMyList} myList={myList} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {activePage === 'movies' && <div className="pt-8 px-6"><MovieGrid title="The Vault" movies={schedule.vaultMovies} onMovieClick={setSelectedMovie} /></div>}
                        {activePage === 'recent' && <div className="pt-8 px-6"><MovieGrid title="Recently Added" movies={schedule.recentMovies} onMovieClick={setSelectedMovie} /></div>}
                        {activePage === 'popular' && <div className="pt-8 px-6"><MovieGrid title="Coming Soon" movies={schedule.comingSoonMovies} onMovieClick={() => {}} /></div>}
                        
                        {activePage === 'mylist' && (
                            <div className="pt-8 px-6 min-h-[60vh]">
                                <h2 className="text-3xl font-black italic mb-8">MY <span className="text-red-600">LIST</span></h2>
                                {myList.length === 0 ? <p className="text-slate-500">Your list is empty. Click the + on any movie.</p> : <MovieGrid title="" movies={myList} onMovieClick={setSelectedMovie} />}
                            </div>
                        )}
                        
                        {activePage === 'about' && (
                           <div className="pt-24 px-6 md:px-20 max-w-4xl mx-auto text-slate-300 pb-20">
                                {/* FIXED ABOUT HEADER */}
                                <h1 className="text-4xl md:text-5xl font-black italic mb-10 uppercase tracking-tighter text-white">
                                    ABOUT <span className="text-red-600">ANREAL</span>
                                </h1>
                                <div className="space-y-12 text-lg leading-relaxed">
                                    <section>
                                        <p className="mb-4 text-xl text-white font-medium">Anreal Cinema is a digital streaming archive focused on public-domain and copyright-expired films.</p>
                                        <p>The platform provides legal access to classic motion pictures from the silent era through mid-20th-century cinema, including early horror, science fiction, drama, and documentary titles that are no longer under active copyright protection.</p>
                                    </section>
                                    <section>
                                        <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-red-600 pl-4">AI-Driven Platform</h3>
                                        <p>Anreal Cinema is operated primarily through automated systems. Approximately 99% of the platform is managed by artificial intelligence.</p>
                                    </section>
                                    <section>
                                        <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-red-600 pl-4">Purpose</h3>
                                        <p>Anreal Cinema is not a commercial streaming service. It exists as a preservation-focused archive intended for Education, Research, and Historical reference.</p>
                                    </section>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
        </div>
    );
}

export default App;