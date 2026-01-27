import React from 'react';
import { Film, Search, User, Menu } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
    const links = [
        { name: 'Home', id: 'home' },
        { name: 'The Vault', id: 'movies' },
        { name: 'Coming Soon', id: 'popular' },
        { name: 'My List', id: 'mylist' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActivePage('home')}>
                <div className="bg-red-600 p-1.5 rounded-lg group-hover:bg-red-500 transition-colors shadow-lg shadow-red-900/20">
                    <Film className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                    Anreal <span className="text-red-600">Cinema</span>
                </h1>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                {links.map(link => (
                    <button
                        key={link.id}
                        onClick={() => setActivePage(link.id)}
                        className={`transition-colors relative py-1 ${activePage === link.id ? 'text-white' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        {link.name}
                        {activePage === link.id && (
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-5 text-slate-300">
                <button className="hover:text-white transition-all hover:scale-110 active:scale-90">
                    <Search className="w-5 h-5" />
                </button>
                <button className="hover:text-white transition-all hover:scale-110 active:scale-90">
                    <User className="w-5 h-5" />
                </button>
                <button className="md:hidden hover:text-white transition-all hover:scale-110 active:scale-90">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </nav>
    );
}
