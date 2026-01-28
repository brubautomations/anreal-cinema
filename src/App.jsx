import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import MovieModal from './components/MovieModal';
import GenreBar from './components/GenreBar';
import MovieGrid from './components/MovieGrid';
import { GENRES } from './config/GenreConfig';

// Data imports
import allMovies from './data/movies.json';
import comingSoonMovies from './data/coming_soon.json';

function App() {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [activePage, setActivePage] = useState('home');
    const [searchQuery, setSearchQuery] = useState(''); // NEW: Search State

    const handleRandomWatch = () => {
        if (allMovies && allMovies.length > 0) {
            const validMovies = allMovies.filter(m => !m.isComingSoon);
            const random = validMovies[Math.floor(Math.random() * validMovies.length)];
            setSelectedMovie(random);
        }
    };

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    // NEW: Handle Search Input
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            setActivePage('search'); // Switch to search view
        } else {
            setActivePage('home'); // Go back home if empty
        }
    };

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);
        setSearchQuery(''); // Clear search when picking genre
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

    // Search Logic: Filter movies based on the query
    const searchResults = searchQuery 
        ? allMovies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const displayGenres = selectedGenre ? [selectedGenre] : GENRES;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-600 selection:text-white">
            {/* Pass handleSearch to Navbar */}
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
                        {searchResults.length === 0 && (
                            <p className="text-center text-gray-500 mt-10">No movies found in the vault.</p>
                        )}
                    </div>
                )}

                {/* HOME PAGE VIEW (Only if not searching) */}
                {!searchQuery && activePage === 'home' && (
                    <>
                        <Hero onRandomWatch={handleRandomWatch} />
                        <GenreBar onGenreSelect={handleGenreSelect} selectedGenre={selectedGenre} />

                        <div className="z-20 relative mt-8">
                            {displayGenres.map(genre => (
                                <div key={genre.id} id={`genre-${genre.id}`}>
                                    <MovieRow
                                        genre={genre}
                                        movies={allMovies}
                                        onMovieClick={handleMovieClick}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* OTHER PAGES */}
                {!searchQuery && activePage === 'movies' && (
                    <div className="pt-8">
                        <MovieGrid title="The Vault" movies={allMovies} onMovieClick={handleMovieClick} />
                    </div>
                )}

                {!searchQuery && activePage === 'popular' && (
                    <div className="pt-8">
                        <MovieGrid title="Coming Soon" movies={comingSoonMovies} onMovieClick={handleMovieClick} />
                    </div>
                )}

                {!searchQuery && activePage === 'mylist' && (
                    <div className="pt-24 px-6 md:px-12 min-h-[60vh] flex flex-col items-center justify-center text-center">
                        <h2 className="text-4xl md:text-6xl font-black italic mb-4 uppercase tracking-tighter">
                            Your <span className="text-red-600">List</span>
                        </h2>
                        <p className="text-slate-400 max-w-sm">Feature under development.</p>
                        <button onClick={() => setActivePage('home')} className="mt-8 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-bold transition-all">
                            Back to Cinema
                        </button>
                    </div>
                )}
            </main>

            {/* FOOTER */}
            <footer className="border-t border-white/5 py-16 px-6 md:px-20 mt-20 bg-slate-950/80 backdrop-blur-xl relative">
                <div className="flex flex-col items-center gap-6">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">ANREAL <span className="text-red-600">CINEMA</span></h2>
                    <p className="text-slate-400 text-sm">Powered by <span className="text-red-500 font-bold">BRUB AI</span></p>
                </div>
            </footer>

            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </div>
    );
}

export default App;