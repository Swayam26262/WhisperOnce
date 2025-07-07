import React from 'react';
import { Heart, Frown, Minus, Sparkles } from 'lucide-react';



export const SentimentIndicator = ({ sentiment, score, className = '' }) => {
  const getSentimentIcon = () => {
    switch (sentiment) {
      case 'positive':
        return <Heart className="w-5 h-5 text-green-400 animate-pulse" />;
      case 'negative':
        return <Frown className="w-5 h-5 text-red-400 animate-pulse" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400 animate-pulse" />;
    }
  };
  
  const getSentimentColor = () => {
    switch (sentiment) {
      case 'positive':
        return 'from-green-400 to-green-300';
      case 'negative':
        return 'from-red-400 to-red-300';
      default:
        return 'from-gray-400 to-gray-300';
    }
  };
  
  const getSentimentText = () => {
    switch (sentiment) {
      case 'positive':
        return 'Hopeful whisper';
      case 'negative':
        return 'Heavy heart';
      default:
        return 'Neutral tone';
    }
  };
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        {getSentimentIcon()}
        <div className={`absolute inset-0 bg-gradient-to-r ${getSentimentColor()} blur-lg opacity-30 animate-pulse`}></div>
      </div>
      <span className="text-sm text-gray-400 font-medium flex items-center gap-2">
        {getSentimentText()}
        <Sparkles className="w-3 h-3 opacity-60" />
      </span>
      <div className="relative">
        <div className="w-20 h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <div 
            className={`h-full bg-gradient-to-r ${getSentimentColor()} rounded-full transition-all duration-2000 ease-out relative overflow-hidden`}
            style={{ width: `${Math.abs(score) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};