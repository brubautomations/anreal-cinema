import React from 'react';
import { Play, Info } from 'lucide-react';

export default function Hero({ onRandomWatch }) {
    return (
        <div className="relative h-[85vh] w-full overflow-hidden mb-12">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2000"
                    alt="Hero background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>

            <div className="relative h-full flex flex-col justify-center px-6 md:px-20 max-w-6xl">
                <h1 className="text-6xl md:text-[8rem] font-black text-white mb-8 uppercase italic leading-[0.85] tracking-tighter drop-shadow-2xl">
                    THE VAULT <br /> <span className="text-red-600">OF TIME</span>
                </h1>

                <p className="text-slate-300 text-lg md:text-2xl mb-12 max-w-2xl font-medium leading-relaxed border-l-4 border-red-600 pl-8 drop-shadow-md">
                    Stream thousands of public domain masterpieces, restored by AI and preserved for the future.
                </p>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onRandomWatch}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-lg font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-red-600/20"
                    >
                        <Play className="w-5 h-5 fill-current" />
                        Watch Now
                    </button>
                </div>
            </div>
        </div>
    );
}
