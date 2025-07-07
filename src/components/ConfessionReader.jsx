import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Shuffle, Sparkles } from 'lucide-react';
import { confessionService } from '../services/confessionService';

import { SentimentIndicator } from './SentimentIndicator';
import { useTypewriter } from '../hooks/useTypewriter';



export const ConfessionReader = ({ isRandom = false }) => {
    const { slug } = useParams();
  const navigate = useNavigate();
    const [confession, setConfession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [isReading, setIsReading] = useState(false);
    const [error, setError] = useState(null);
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);
  
  const { displayText, isComplete } = useTypewriter(
    confession?.content || '', 
    isReading ? 30 : 0
  );
  
  useEffect(() => {
    const fetchConfession = async () => {
      try {
        setIsLoading(true);
        setError(null);
                let fetchedConfession = null;
        
        if (isRandom) {
          // For random confessions, we need to fetch and mark as read immediately
          fetchedConfession = await confessionService.getRandomConfession();
          if (!fetchedConfession) {
            setError('No unread whispers are available at the moment.');
          } else {
            setHasMarkedAsRead(true); // Random confessions are marked as read when fetched
          }
        } else if (slug) {
          // For specific confessions, just fetch without marking as read yet
          fetchedConfession = await confessionService.getConfessionPreview(slug);
          if (!fetchedConfession) {
            setError('This whisper has already been heard or does not exist.');
          }
        } else {
          setError('Invalid whisper link.');
        }
        
        if (fetchedConfession) {
          setConfession(fetchedConfession);
        }
      } catch (err) {
        console.error('Error fetching confession:', err);
        setError('Failed to load whisper. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfession();
  }, [slug, isRandom]);
  
  const handleAcceptReading = async () => {
    setHasAccepted(true);
    setIsReading(true);
    
    // Mark as read only when user actually starts reading (for non-random confessions)
    if (!isRandom && confession && !hasMarkedAsRead) {
      try {
        await confessionService.markConfessionAsRead(confession.uniqueSlug);
        setHasMarkedAsRead(true);
      } catch (err) {
        console.error('Failed to mark confession as read:', err);
      }
    }
  };
  
  const handleFinishReading = () => {
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-magenta-400 border-b-transparent rounded-full animate-spin mx-auto opacity-50" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-400 text-lg">Loading whisper...</p>
          <div className="flex items-center justify-center gap-1 mt-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-magenta-400 rounded-full animate-pulse animation-delay-300"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse animation-delay-600"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative mb-8">
            <EyeOff className="w-20 h-20 text-gray-600 mx-auto animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-magenta-400/20 rounded-full blur-xl"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">Whisper Not Found</h2>
          <p className="text-gray-400 mb-8 text-lg leading-relaxed">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-700 hover:to-magenta-700 text-white rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto font-medium transform hover:scale-105 shadow-2xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Return Home
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
  
  if (!confession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative mb-8">
            <Shuffle className="w-20 h-20 text-gray-600 mx-auto animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-magenta-400/20 rounded-full blur-xl"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">No Whispers Available</h2>
          <p className="text-gray-400 mb-8 text-lg leading-relaxed">There are no unread confessions at the moment.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-700 hover:to-magenta-700 text-white rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto font-medium transform hover:scale-105 shadow-2xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Return Home
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
  
  if (!hasAccepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="relative mb-8">
            <Eye className="w-24 h-24 text-yellow-400 mx-auto animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-2xl"></div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">⚠️ Warning</h2>
          <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-600 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <p className="text-gray-300 text-lg leading-relaxed">
              This whisper can only be read <strong className="text-yellow-400 font-bold">once</strong>. 
              Once you proceed, it will disappear forever. Are you ready to hear this secret?
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group text-sm sm:text-base"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            <button
              onClick={handleAcceptReading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-500 hover:to-magenta-500 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group text-sm sm:text-base"
            >
              <Eye className="w-5 h-5" />
              I'm Ready
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto">
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-magenta-400 to-cyan-400 animate-pulse"></div>
          
          {/* Ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-magenta-400/5 to-cyan-400/5 animate-pulse"></div>
          
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-magenta-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
              <Eye className="w-8 h-8 text-black" />
            </div>
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {new Date(confession.createdAt).toLocaleDateString()} • Anonymous
              <Sparkles className="w-4 h-4" />
            </p>
          </div>
          
          <div className="mb-8 relative z-10">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-8 border border-gray-600 min-h-[300px] flex items-center">
              <p className="text-white text-xl leading-relaxed font-mono w-full">
                {displayText}
                {!isComplete && <span className="animate-pulse text-cyan-400 text-2xl">|</span>}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 sm:mt-8 w-full">
            <SentimentIndicator 
              sentiment={confession.sentiment} 
              score={confession.sentimentScore}
            />
            <div className="text-sm text-gray-500 flex items-center gap-2">
              {isComplete ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Reading complete
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  Reading...
                </>
              )}
            </div>
          </div>
          
          {isComplete && (
            <div className="text-center relative z-10">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 mb-6 border border-gray-600">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <p className="text-gray-400 text-lg font-medium">
                    This whisper has been consumed by the void
                  </p>
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
                <p className="text-gray-500 text-sm">It will never be seen again.</p>
              </div>
              <button
                onClick={handleFinishReading}
                className="px-10 py-4 bg-gradient-to-r from-cyan-600 via-magenta-600 to-cyan-600 hover:from-cyan-700 hover:via-magenta-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 font-semibold text-lg transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto"
              >
                <Sparkles className="w-6 h-6" />
                Return to the Void
                <Sparkles className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};