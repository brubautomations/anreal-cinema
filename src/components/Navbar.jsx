import React, { useState } from 'react';
import { Menu, X, Search, Film } from 'lucide-react';

const Navbar = ({ activePage, setActivePage, onSearch }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState('');

    const handleNavClick = (page) => {
        setActivePage(page);
        setIsMenuOpen(false); // Close menu after clicking
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(localSearch);
        setIsMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* LOGO */}
                    <div 
                        className="flex items-center gap-2 cursor-pointer" 
                        onClick={() => handleNavClick('home')}
                    >
                        <Film className="w-8 h-8 text-red-600" />
                        <span className="text-xl font-black tracking-tighter italic">
                            ANREAL <span className="text-red-600">CINEMA</span>
                        </span>
                    </div>

                    {/* DESKTOP MENU (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['home', 'movies', 'recent', 'popular', 'about'].map((page) => (
                            <button
                                key={page}
                                onClick={() => handleNavClick(page)}
                                className={`text-sm font-bold uppercase tracking-widest hover:text-red-500 transition-colors ${
                                    activePage === page ? 'text-red-600' : 'text-slate-300'
                                }`}
                            >
                                {page === 'home' ? 'Home' : 
                                 page === 'movies' ? 'The Vault' :
                                 page === 'recent' ? 'Recently Added' :
                                 page === 'popular' ? 'Coming Soon' : 'About'}
                            </button>
                        ))}
                    </div>

                    {/* SEARCH BAR (Desktop) */}
                    <div className="hidden md:block">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                placeholder="Search archives..."
                                className="bg-slate-900 border border-slate-700 rounded-full py-1 px-4 text-sm focus:outline-none focus:border-red-600 w-64 transition-all"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                            />
                            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2" />
                        </form>
                    </div>

                    {/* MOBILE MENU BUTTON (Visible only on Mobile) */}
                    <div className="md:hidden">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-300 hover:text-white p-2"
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE DROPDOWN MENU */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-950 border-b border-white/10">
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        {['home', 'movies', 'recent', 'popular', 'about'].map((page) => (
                            <button
                                key={page}
                                onClick={() => handleNavClick(page)}
                                className={`block w-full text-left px-3 py-3 rounded-md text-base font-bold uppercase tracking-wider ${
                                    activePage === page ? 'bg-red-600/10 text-red-500' : 'text-slate-300 hover:bg-slate-900'
                                }`}
                            >
                                {page === 'home' ? 'Home' : 
                                 page === 'movies' ? 'The Vault' :
                                 page === 'recent' ? 'Recently Added' :
                                 page === 'popular' ? 'Coming Soon' : 'About'}
                            </button>
                        ))}
                        
                        {/* Mobile Search */}
                        <form onSubmit={handleSearchSubmit} className="mt-4 pb-2 relative">
                            <input
                                type="text"
                                placeholder="Search movies..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:border-red-600"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                            />
                            <button type="submit" className="absolute right-3 top-3.5">
                                <Search className="w-5 h-5 text-slate-400" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;