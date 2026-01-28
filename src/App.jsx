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

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);
        if (genre) {
            // Scroll to the specific genre row if on Home page
            if (activePage === 'home') {
                const element = document.getElementById(`genre-${genre.id}`);
                if (element) {
                    const offset = 140;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
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

    // Filter genres for Home page
    const displayGenres = selectedGenre ? [selectedGenre] : GENRES;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-600 selection:text-white">
            <Navbar activePage={activePage} setActivePage={setActivePage} />

            <main className="relative z-10 pt-16">
                {activePage === 'home' && (
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

                {activePage === 'movies' && (
                    <div className="pt-8">
                        <MovieGrid
                            title="The Vault"
                            movies={allMovies}
                            onMovieClick={handleMovieClick}
                        />
                    </div>
                )}

                {activePage === 'popular' && (
                    <div className="pt-8">
                        <MovieGrid
                            title="Coming Soon"
                            movies={comingSoonMovies}
                            onMovieClick={handleMovieClick}
                        />
                    </div>
                )}

                {activePage === 'mylist' && (
                    <div className="pt-24 px-6 md:px-12 min-h-[60vh] flex flex-col items-center justify-center text-center">
                        <h2 className="text-4xl md:text-6xl font-black italic mb-4 uppercase tracking-tighter">
                            Your <span className="text-red-600">List</span>
                        </h2>
                        <p className="text-slate-400 max-w-sm">
                            Curate your personal collection of cinematic artifacts. Feature under development.
                        </p>
                        <button
                            onClick={() => setActivePage('home')}
                            className="mt-8 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
                        >
                            Back to Cinema
                        </button>
                    </div>
                )}
            </main>

            <footer className="border-t border-white/5 py-16 px-6 md:px-20 mt-20 bg-slate-950/80 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-16 relative z-10">
                    <div className="flex flex-col items-center md:items-start gap-6 max-w-md">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">ANREAL <span className="text-red-600">CINEMA</span></h2>
                        <p className="text-slate-400 text-base font-medium leading-relaxed text-center md:text-left">
                            Powered & Maintained by <a href="https://brubai.net/" target="_blank" className="text-red-500 font-black hover:text-red-400 transition-all drop-shadow-[0_0_10px_rgba(239,68,68,0.7)] hover:drop-shadow-[0_0_15px_rgba(239,68,68,1)] uppercase tracking-widest">BRUB AI</a>.
                            <br /><span className="opacity-60 text-xs mt-2 inline-block">This platform is 99% AI-run.</span>
                        </p>
                    </div>
                </div>
            </footer>

            {selectedMovie && (
                <MovieModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </div>
    );
}

export default App;