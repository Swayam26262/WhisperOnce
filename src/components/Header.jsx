import React from 'react';
import { GlitchText } from './GlitchText';
import { Eye, Sparkles } from 'lucide-react';



export const Header = ({ stats }) => {
  return (
    <header className="relative text-center mb-16">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-magenta-400/10 to-cyan-400/10 blur-3xl animate-pulse"></div>
      
      <div className="flex items-center justify-center gap-4 mb-6 relative z-10">
        <div className="relative">
          <Eye className="w-10 h-10 text-cyan-400 animate-pulse" />
          <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-30 animate-pulse"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white relative">
          <GlitchText text="WhisperOnce" className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-magenta-400 to-cyan-400" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-magenta-400 to-cyan-400 blur-2xl opacity-20 animate-pulse"></div>
        </h1>
        <div className="relative">
          <Eye className="w-10 h-10 text-cyan-400 animate-pulse" />
          <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-30 animate-pulse"></div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-8 relative z-10">
        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
        <p className="text-gray-400 text-xl italic font-medium">
          "Some secrets are meant to be heard only once"
        </p>
        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
      </div>
      
      {stats && (
        <div className="flex justify-center gap-12 text-sm text-gray-500 relative z-10">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-cyan-400 blur-md opacity-50 animate-pulse"></div>
            </div>
            <span className="group-hover:text-cyan-400 transition-colors duration-300 font-medium">
              {stats.totalConfessions} whispers shared
            </span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-3 h-3 bg-magenta-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-magenta-400 blur-md opacity-50 animate-pulse"></div>
            </div>
            <span className="group-hover:text-magenta-400 transition-colors duration-300 font-medium">
              {stats.unreadConfessions} awaiting souls
            </span>
          </div>
        </div>
      )}
    </header>
  );
};