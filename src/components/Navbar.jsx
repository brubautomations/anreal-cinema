import React, { useState } from 'react';
import { Menu, X, Search, Film } from 'lucide-react';

const Navbar = ({ activePage, setActivePage, onSearch }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState('');

    const handleNavClick = (page) => {
        setActivePage(page);
        setIsMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(localSearch);
        setIsMenuOpen(false);
    };

    // RESTORED: Simple Menu with My List
    const navLinks = [
        { id: 'home', label: 'Home' },
        { id: 'movies', label: 'The Vault' },
        { id: 'recent', label: 'Recently Added' },
        { id: 'popular', label: 'Coming Soon' },
        { id: 'mylist', label: 'My List' }, 
        { id: 'about', label: 'About' }
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div 
                        className="flex items-center gap-2 cursor-pointer" 
                        onClick={() => handleNavClick('home')}
                    >
                        <Film className="w-8 h-8 text-red-600" />
                        <span className="text-xl font-black tracking-tighter italic hidden md:block">
                            ANREAL <span className="text-red-600">CINEMA</span>
                        </span>
                        <span className="text-xl font-black tracking-tighter italic md:hidden">
                            ANREAL
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavClick(link.id)}
                                className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                                    activePage === link.id ? 'text-red-600' : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                placeholder="Search archives..."
                                className="bg-slate-900 border border-slate-700 rounded-full py-1 px-4 text-sm focus:outline-none focus:border-red-600 w-48 transition-all"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                            />
                            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2" />
                        </form>
                    </div>

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

            {isMenuOpen && (
                <div className="md:hidden bg-slate-950 border-b border-white/10">
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavClick(link.id)}
                                className={`block w-full text-left px-3 py-3 rounded-md text-base font-bold uppercase tracking-wider ${
                                    activePage === link.id ? 'bg-red-600/10 text-red-500' : 'text-slate-300 hover:bg-slate-900'
                                }`}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;