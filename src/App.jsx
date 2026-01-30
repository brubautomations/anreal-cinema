import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import MovieModal from './components/MovieModal';
import GenreBar from './components/GenreBar';
import MovieGrid from './components/MovieGrid';
import { GENRES } from './config/GenreConfig';

// --- DATA IMPORTS ---
import vaultMoviesData from './data/movies.json'; 
import comingSoonData from './data/coming_soon.json';

// --- CONFIGURATION ---
const API_KEY = '9f779ecda119c29a7de55ce4e7f4f56c'; // <--- PASTE YOUR KEY HERE
const NEXT_DROP_DATE = new Date('2026-02-01T06:00:00'); // Sunday Feb 1 6AM

function App() {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [activePage, setActivePage] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
    
    // State to hold movies AFTER we find their real posters
    const [schedule, setSchedule] = useState({
        vaultMovies: [],
        recentMovies: [],
        comingSoonMovies: []
    });

    // --- 1. THE AUTOMATION ENGINE (Logic Only) ---
    const getRawSchedule = () => {
        const now = new Date();
        let vault = [];
        let recent = [];
        let comingSoon = [];

        // Helper: Ensure every movie has the required fields
        const sanitize = (list) => list.map(m => ({
            ...m,
            // If ID is weird, make sure it's a string
            id: m.id || Math.random().toString(36).substr(2, 9),
            // Default to Archive image, but we will override this with TMDB later
            poster: m.image || m.poster, 
            videoUrl: m.videoUrl || "/banner.mp4"
        }));

        if (now < NEXT_DROP_DATE) {
            // SCENARIO 1: Before Sunday Feb 1
            vault = sanitize(vaultMoviesData);
            recent = []; // Empty
            comingSoon = sanitize(comingSoonData); // The list you showed me
        } else {
            // SCENARIO 2: After Sunday Feb 1
            vault = sanitize(vaultMoviesData);
            recent = sanitize(comingSoonData); // Moved to Recent
            comingSoon = []; // Empty until you add more to the JSON
        }
        return { vault, recent, comingSoon };
    };

    // --- 2. THE API FETCHING ENGINE (Auto-Images) ---
    useEffect(() => {
        const rawSchedule = getRawSchedule();
        
        // Function to find a poster for a single movie
        const fetchPoster = async (movie) => {
            // If it already has a high-quality TMDB link, skip fetching
            if (movie.poster && movie.poster.includes('tmdb.org')) return movie;

            try {
                // Search TMDB by Title
                const response = await fetch(
                    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.title)}`
                );
                const data = await response.json();
                
                if (data.results && data.results.length > 0) {
                    // Found it! Use the first result's poster
                    const hit = data.results[0];
                    return {
                        ...movie,
                        poster: `https://image.tmdb.org/t/p/w500${hit.poster_path}`,
                        overview: hit.overview || movie.description, // Bonus: Update description too
                        releaseDate: hit.release_date
                    };
                }
            } catch (error) {
                console.error("Could not find poster for:", movie.title);
            }
            // If fail, return original movie with old image
            return movie;
        };

        // Run the fetcher on our lists
        const enrichMovies = async () => {
            // We only fetch posters for "Recent" and "Coming Soon" to save API calls
            // Vault movies usually stay static, but we can fetch them too if you want.
            
            const enrichedRecent = await Promise.all(
                rawSchedule.recent.map(movie => fetchPoster(movie))
            );

            const enrichedComingSoon = await Promise.all(
                rawSchedule.comingSoon.map(movie => fetchPoster(movie))
            );

            setSchedule({
                vaultMovies: rawSchedule.vault,
                recentMovies: enrichedRecent,
                comingSoonMovies: enrichedComingSoon
            });
        };

        enrichMovies();

    }, []); // Run once on load

    // --- HANDLERS ---
    const handleRandomWatch = () => {
        if (schedule.vaultMovies.length > 0) {
            const random = schedule.vaultMovies[Math.floor(Math.random() * schedule.vaultMovies.length)];
            setSelectedMovie(random);
        }
    };

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

    // Combine for search
    const allSearchableMovies = [...schedule.vaultMovies, ...schedule.recentMovies, ...schedule.comingSoonMovies];
    const searchResults = searchQuery 
        ? allSearchableMovies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];
    const displayGenres = selectedGenre ? [selectedGenre] : GENRES;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-600 selection:text-white">
            <Navbar activePage={activePage} setActivePage={setActivePage} onSearch={handleSearch} />

            <main className="relative z-10 pt-16">
                
                {searchQuery && (
                    <div className="pt-8">
                        <MovieGrid
                            title={`Results for "${searchQuery}"`}
                            movies={searchResults}
                            onMovieClick={(m) => setSelectedMovie(m)}
                        />
                    </div>
                )}

                {!searchQuery && activePage === 'home' && (
                    <>
                        <Hero onRandomWatch={handleRandomWatch} />
                        <GenreBar onGenreSelect={handleGenreSelect} selectedGenre={selectedGenre} />
                        <div className="z-20 relative mt-8">
                            {displayGenres.map(genre => (
                                <div key={genre.id} id={`genre-${genre.id}`}>
                                    <MovieRow
                                        genre={genre}
                                        movies={schedule.vaultMovies}
                                        onMovieClick={(m) => setSelectedMovie(m)}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {!searchQuery && activePage === 'movies' && (
                    <div className="pt-8">
                        <MovieGrid title="The Vault" movies={schedule.vaultMovies} onMovieClick={(m) => setSelectedMovie(m)} />
                    </div>
                )}

                {!searchQuery && activePage === 'recent' && (
                    <div className="pt-8">
                        <MovieGrid 
                            title="Recently Added" 
                            movies={schedule.recentMovies} 
                            onMovieClick={(m) => setSelectedMovie(m)} 
                        />
                         {schedule.recentMovies.length === 0 && (
                            <div className="text-center mt-20 px-6 text-slate-500">
                                The first batch drops this Sunday at 6:00 AM.
                            </div>
                        )}
                    </div>
                )}

                {!searchQuery && activePage === 'popular' && (
                    <div className="pt-8">
                        <MovieGrid 
                            title="Coming Soon" 
                            movies={schedule.comingSoonMovies} 
                            // We disable clicking for Coming Soon, or let them click to see the poster?
                            // Let's let them click to see details.
                            onMovieClick={(m) => setSelectedMovie(m)} 
                        />
                        {schedule.comingSoonMovies.length === 0 && (
                            <div className="text-center mt-20 px-6 text-slate-500">
                                No upcoming movies scheduled.
                            </div>
                        )}
                    </div>
                )}

                {!searchQuery && activePage === 'about' && (
                    <div className="pt-24 px-6 md:px-20 max-w-4xl mx-auto text-slate-300 pb-20">
                        <h1 className="text-4xl md:text-5xl font-black italic mb-10 uppercase tracking-tighter text-white">
                            About <span className="text-red-600">Anreal Cinema</span>
                        </h1>
                        <p className="mb-4 text-xl text-white font-medium">
                            Anreal Cinema is a digital streaming archive focused on public-domain and copyright-expired films.
                        </p>
                        <p>This platform is automated. New movies are unlocked from the archives every Sunday.</p>
                        <div className="mt-8 p-6 bg-slate-900/50 rounded-lg border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-2">Legal Notice</h3>
                            <p className="text-sm text-slate-500">
                                Copyright laws vary by jurisdiction. Public-domain status is evaluated using available records and U.S. copyright standards.
                            </p>
                        </div>
                    </div>
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
                <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </div>
    );
}

export default App;