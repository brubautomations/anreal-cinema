import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import MovieModal from './components/MovieModal';
import GenreBar from './components/GenreBar';
import MovieGrid from './components/MovieGrid';
import { GENRES } from './config/GenreConfig';

// Data imports - EVERYTHING should be in allMovies eventually
import allMovies from './data/movies.json'; 

function App() {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [activePage, setActivePage] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');

    // --- AUTOMATION ENGINE ---
    // 1. Set the "Epoch" - The Sunday when your cycle started.
    // Let's set this to a recent Sunday (e.g., Jan 28, 2024, or roughly now).
    // ADJUST THIS DATE to shift the batches if needed.
    const START_DATE = new Date('2024-01-28T06:00:00'); 
    const BATCH_SIZE = 50;
    const INITIAL_VAULT_SIZE = 500; // The first 500 are always in the vault

    const getSchedule = () => {
        const now = new Date();
        const msPerWeek = 7 * 24 * 60 * 60 * 1000;
        
        // Calculate how many full weeks have passed since Start Date
        const weeksPassed = Math.floor((now - START_DATE) / msPerWeek);
        
        // Calculate the boundary for the Vault
        // Every week, the vault grows by 50
        const vaultCutoff = INITIAL_VAULT_SIZE + (weeksPassed * BATCH_SIZE);
        
        // Define the Arrays
        const vaultMovies = allMovies.slice(0, vaultCutoff);
        const recentMovies = allMovies.slice(vaultCutoff, vaultCutoff + BATCH_SIZE);
        
        // Coming Soon Logic:
        // Shows the NEXT batch, but only after Monday 6am.
        // If today is Sunday (Day 0) and it's before Monday 6am, we might want to hide it or show empty.
        // Let's simplify: It just grabs the next batch.
        // To strictly enforce "Monday 6am", we check the current day/time relative to the current week start.
        
        let comingSoonMovies = [];
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday
        const hours = now.getHours();

        // Logic: On Sunday (after 6am) until Monday (before 6am), Coming Soon is empty/hidden.
        // From Monday 6am onwards, it shows the next batch.
        const isMondayMorningOrLater = (dayOfWeek === 1 && hours >= 6) || (dayOfWeek > 1);
        
        if (isMondayMorningOrLater || dayOfWeek === 0) { 
             // Allow Sunday too? User said "Monday morning 6am... new list uploaded".
             // So strictly:
             if (dayOfWeek === 1 && hours < 6) {
                 // It's Monday early morning, wait.
                 comingSoonMovies = [];
             } else if (dayOfWeek === 0 && hours >= 6) {
                 // It's Sunday after 6am. The "Next" coming soon hasn't arrived yet (arrives Monday).
                 comingSoonMovies = [];
             } else {
                 // It is safe to show coming soon
                 comingSoonMovies = allMovies.slice(vaultCutoff + BATCH_SIZE, vaultCutoff + (BATCH_SIZE * 2));
             }
        }

        // If simple logic is preferred (Always show next batch):
        // comingSoonMovies = allMovies.slice(vaultCutoff + BATCH_SIZE, vaultCutoff + (BATCH_SIZE * 2));

        return { vaultMovies, recentMovies, comingSoonMovies };
    };

    const schedule = getSchedule();
    // -------------------------

    const handleRandomWatch = () => {
        if (schedule.vaultMovies.length > 0) {
            const random = schedule.vaultMovies[Math.floor(Math.random() * schedule.vaultMovies.length)];
            setSelectedMovie(random);
        }
    };

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            setActivePage('search');
        } else {
            setActivePage('home');
        }
    };

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);
        setSearchQuery('');
        if (genre) {
            if (activePage === 'home') {
                const element = document.getElementById(`genre-${genre.id}`);
                if (element) {
                    const offset = 140;
                    window.scrollTo({
                        top: element.getBoundingClientRect().top + window.scrollY - offset,
                        behavior: 'smooth'
                    });
                }
            } else {
                setActivePage('home');
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const searchResults = searchQuery 
        ? allMovies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const displayGenres = selectedGenre ? [selectedGenre] : GENRES;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-600 selection:text-white">
            <Navbar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                onSearch={handleSearch} 
            />

            <main className="relative z-10 pt-16">
                
                {/* SEARCH RESULTS VIEW */}
                {searchQuery && (
                    <div className="pt-8">
                        <MovieGrid
                            title={`Results for "${searchQuery}"`}
                            movies={searchResults}
                            onMovieClick={handleMovieClick}
                        />
                    </div>
                )}

                {/* HOME PAGE VIEW - Uses Vault Movies */}
                {!searchQuery && activePage === 'home' && (
                    <>
                        <Hero onRandomWatch={handleRandomWatch} />
                        <GenreBar onGenreSelect={handleGenreSelect} selectedGenre={selectedGenre} />

                        <div className="z-20 relative mt-8">
                            {displayGenres.map(genre => (
                                <div key={genre.id} id={`genre-${genre.id}`}>
                                    <MovieRow
                                        genre={genre}
                                        movies={schedule.vaultMovies} // Only show Vault movies here
                                        onMovieClick={handleMovieClick}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* THE VAULT PAGE */}
                {!searchQuery && activePage === 'movies' && (
                    <div className="pt-8">
                        <MovieGrid 
                            title="The Vault (Full Collection)" 
                            movies={schedule.vaultMovies} 
                            onMovieClick={handleMovieClick} 
                        />
                    </div>
                )}

                {/* RECENTLY ADDED PAGE (New Tab) */}
                {!searchQuery && activePage === 'recent' && (
                    <div className="pt-8">
                        <MovieGrid 
                            title="Recently Added (This Week)" 
                            movies={schedule.recentMovies} 
                            onMovieClick={handleMovieClick} 
                        />
                         {schedule.recentMovies.length === 0 && (
                            <p className="text-center text-slate-500 mt-10">
                                New movies arrive every Sunday at 6am.
                            </p>
                        )}
                    </div>
                )}

                {/* COMING SOON PAGE */}
                {!searchQuery && activePage === 'popular' && (
                    <div className="pt-8">
                        <MovieGrid 
                            title="Coming Soon (Next Week)" 
                            movies={schedule.comingSoonMovies} 
                            // Pass a "disabled" prop or just don't handle click if you want them unwatchable
                            // For now we let them click to see info, or you can block it.
                            onMovieClick={(m) => alert("This movie unlocks next Sunday!")} 
                        />
                        {schedule.comingSoonMovies.length === 0 && (
                            <div className="text-center mt-20 px-6">
                                <h2 className="text-2xl font-bold text-slate-400 mb-2">Shhh...</h2>
                                <p className="text-slate-500">
                                    The next batch is being prepared.<br/>
                                    Check back <strong>Monday at 6:00 AM</strong> for the reveal.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* ABOUT PAGE */}
                {!searchQuery && activePage === 'about' && (
                    <div className="pt-24 px-6 md:px-20 max-w-4xl mx-auto text-slate-300 pb-20">
                        <h1 className="text-4xl md:text-5xl font-black italic mb-10 uppercase tracking-tighter text-white">
                            About <span className="text-red-600">Anreal Cinema</span>
                        </h1>
                        <p className="text-lg mb-8">
                            This platform is automated. New movies are unlocked from the archives every Sunday.
                        </p>
                        {/* ... (Keep your previous About text here) ... */}
                    </div>
                )}
            </main>

            {/* FOOTER */}
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