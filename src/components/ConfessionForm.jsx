import React, { useState } from 'react';
import { Send, Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { confessionService } from '../services/confessionService';

import { SentimentIndicator } from './SentimentIndicator';



export const ConfessionForm = ({ onSubmitted, onStatsUpdate }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedConfession, setSubmittedConfession] = useState(null);
    const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const maxLength = 1000;
  const remainingChars = maxLength - content.length;
  
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const confession = await confessionService.submitConfession(content.trim());
      setSubmittedConfession(confession);
      onSubmitted(confession);
      onStatsUpdate();
      setContent('');
    } catch (err) {
      setError('Failed to submit confession. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setSubmittedConfession(null);
    setError(null);
    setCopied(false);
  };
  
  const handleCopy = async () => {
    if (submittedConfession) {
      await navigator.clipboard.writeText(`${window.location.origin}/whisper/${submittedConfession.uniqueSlug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  if (submittedConfession) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 mb-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          {/* Animated success glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-magenta-400/10 to-cyan-400/10 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-magenta-400 to-cyan-400"></div>
          
          <div className="text-center mb-6 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-magenta-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform animate-bounce">
              <Send className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Whisper Sent</h3>
            <p className="text-gray-400 text-lg">Your secret has been cast into the void</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-sm text-gray-500">It will disappear after being read once</span>
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
          </div>
          
          <div className="mb-6 relative z-10">
            <SentimentIndicator 
              sentiment={submittedConfession.sentiment} 
              score={submittedConfession.sentimentScore}
              className="justify-center"
            />
          </div>
          
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 mb-6 border border-gray-600 relative z-10">
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Shareable link (optional):
            </p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={`${window.location.origin}/whisper/${submittedConfession.uniqueSlug}`}
                readOnly
                className="flex-1 bg-gray-900 text-gray-300 px-4 py-3 rounded-lg border border-gray-600 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-lg text-sm transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center relative z-10">
            <button
              onClick={resetForm}
              className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-xl transition-all duration-300 font-medium transform hover:scale-105 shadow-lg"
            >
              Whisper Again
            </button>
            <button
              onClick={() => window.location.href = '/read-random'}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 via-magenta-600 to-cyan-600 hover:from-cyan-700 hover:via-magenta-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 font-medium transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Read Random
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-magenta-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your secret... it will disappear after being read once."
            className="relative w-full h-56 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none text-lg leading-relaxed shadow-2xl backdrop-blur-sm transition-all duration-300"
            maxLength={maxLength}
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <div className={`text-sm font-medium transition-colors duration-300 ${
              remainingChars < 50 ? 'text-yellow-400' : 
              remainingChars < 10 ? 'text-red-400' : 
              'text-gray-500'
            }`}>
              {remainingChars} characters left
            </div>
            {content.length > 0 && (
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="bg-gradient-to-r from-red-900 to-red-800 border border-red-700 text-red-200 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              {error}
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="group px-10 py-4 bg-gradient-to-r from-cyan-600 via-magenta-600 to-cyan-600 hover:from-cyan-700 hover:via-magenta-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-2xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 text-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Whispering...</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </>
            ) : (
              <>
                <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                <span>Whisper</span>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};