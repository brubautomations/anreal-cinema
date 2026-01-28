import React from 'react';
import { Play } from 'lucide-react';

const Hero = ({ onRandomWatch }) => {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden mb-12">
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          {/* UPDATED FILENAME TO MATCH YOUR UPLOAD */}
          <source src="/anrealhero.mp4" type="video/mp4" />
        </video>
        
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      {/* TEXT CONTENT */}
      <div className="relative z-10 h-full flex items-center px-6 md:px-12">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-[0.8]">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Vault</span>
            <br />
            <span className="text-white">Of Time</span>
          </h1>
          
          <div className="w-20 h-2 bg-red-600 mb-8 skew-x-[-12deg]"></div>

          <p className="text-lg md:text-xl text-slate-300 font-medium mb-10 max-w-lg leading-relaxed drop-shadow-lg">
            Stream thousands of public domain masterpieces, restored by AI and preserved for the future.
          </p>

          <button 
            onClick={onRandomWatch}
            className="group flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-900/20"
          >
            <Play className="w-5 h-5 fill-current" />
            Watch Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;