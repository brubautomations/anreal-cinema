import React, { useState } from 'react';
import { Search, Film, Calendar, Info, Menu, X, Sparkles } from 'lucide-react';

const Navbar = ({ activePage, setActivePage, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'movies', label: 'The Vault', icon: Film },
    { id: 'recent', label: 'Recently Added', icon: Sparkles },
    { id: 'popular', label: 'Coming Soon', icon: Calendar },
    { id: 'about', label: 'About', icon: Info }, // Label handled via custom logic below
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-slate-950/90 to-transparent backdrop-blur-sm border-b border-white/5 transition-all duration-300">
      <div className="px-6 md:px-12 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          className="flex items-center gap-2 cursor-pointer z-50" 
          onClick={() => setActivePage('home')}
        >
          <Film className="w-8 h-8 text-red-600" />
          <span className="text-2xl font-black italic tracking-tighter text-white">
            ANREAL <span className="text-red-600">CINEMA</span>
          </span>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 hover:text-red-500 ${
                activePage === item.id ? 'text-white' : 'text-slate-400'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              
              {/* SPECIAL LOGIC FOR ABOUT TAB */}
              {item.id === 'about' ? (
                <span>
                  ABOUT <span className="text-red-600">ANREAL</span>
                </span>
              ) : (
                item.label
              )}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center gap-4 z-50">
          <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700' : ''}`}>
            <Search 
              className="w-5 h-5 text-slate-300 cursor-pointer hover:text-white" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            />
            <input 
              type="text"
              placeholder="Search titles..."
              className={`bg-transparent border-none outline-none text-white text-sm ml-2 transition-all duration-300 ${isSearchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-slate-950 z-40 flex flex-col items-center justify-center gap-8 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setIsMenuOpen(false);
              }}
              className="text-2xl font-bold uppercase tracking-widest text-white hover:text-red-500 flex items-center gap-3"
            >
              {item.icon && <item.icon className="w-6 h-6" />}
              {item.id === 'about' ? (
                <span>ABOUT <span className="text-red-600">ANREAL</span></span>
              ) : (
                item.label
              )}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;