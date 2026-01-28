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
    const [searchQuery, setSearchQuery] = useState('');

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
                        {searchResults.length === 0 && (
                            <p className="text-center text-gray-500 mt-10">No movies found in the vault.</p>
                        )}
                    </div>
                )}

                {/* HOME PAGE VIEW */}
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

                {/* THE VAULT PAGE */}
                {!searchQuery && activePage === 'movies' && (
                    <div className="pt-8">
                        <MovieGrid title="The Vault" movies={allMovies} onMovieClick={handleMovieClick} />
                    </div>
                )}

                {/* COMING SOON PAGE */}
                {!searchQuery && activePage === 'popular' && (
                    <div className="pt-8">
                        <MovieGrid title="Coming Soon" movies={comingSoonMovies} onMovieClick={handleMovieClick} />
                    </div>
                )}

                {/* ABOUT PAGE (This replaced My List) */}
                {!searchQuery && activePage === 'about' && (
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
            </main>

            <footer className="border-t border-white/5 py-16 px-6 md:px-20 mt-20 bg-slate-950/80 backdrop-blur-xl relative">
                <div className="flex flex-col items-center gap-6">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">ANREAL <span className="text-red-600">CINEMA</span></h2>
                    
                    {/* UPDATED: LINKED FOOTER TEXT */}
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