import React, { useState, useEffect } from 'react';
import { Shuffle, TrendingUp, Sparkles } from 'lucide-react';
import { Header } from './Header';
import { ConfessionForm } from './ConfessionForm';
import { confessionService } from '../services/confessionService';


export const HomePage = () => {
    const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchStats = async () => {
    try {
      const fetchedStats = await confessionService.getStats();
      setStats(fetchedStats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
    
    // Debug: Log storage state on component mount
    if (process.env.NODE_ENV === 'development') {
      confessionService.debugStorage();
    }
  }, []);
  
    const handleConfessionSubmitted = (confession) => {
    // Stats will be updated via onStatsUpdate callback
    console.log('Confession submitted:', confession.id);
  };
  
  const handleReadRandom = () => {
    if (stats && stats.unreadConfessions > 0) {
      window.location.href = '/read-random';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden text-sm sm:text-base">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-magenta-400 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-20 animation-delay-2000"></div>
        <div className="absolute top-1/6 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-25 animation-delay-3000"></div>
        <div className="absolute bottom-1/4 left-1/6 w-2 h-2 bg-magenta-400 rounded-full animate-pulse opacity-35 animation-delay-4000"></div>
      </div>
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 relative z-10">
        <Header stats={stats} />
        
        <main className="space-y-16">
          <ConfessionForm 
            onSubmitted={handleConfessionSubmitted}
            onStatsUpdate={fetchStats}
          />
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 w-full max-w-2xl mx-auto">
            <button
              onClick={handleReadRandom}
              disabled={!stats || stats.unreadConfessions === 0}
              className="group w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-600 hover:to-gray-700 disabled:from-gray-900 disabled:via-gray-800 disabled:to-gray-900 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-3 border border-gray-600 hover:border-gray-500 disabled:border-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <Shuffle className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-medium">
                {!stats || stats.unreadConfessions === 0 ? 'No Whispers Available' : 'Read Random Whisper'}
              </span>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            </button>
          </div>
          
          {/* Debug panel in development
          {process.env.NODE_ENV === 'development' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-400 mb-2">Debug Panel</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => confessionService.debugStorage()}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded"
                  >
                    Log Storage
                  </button>
                  <button
                    onClick={() => {
                      confessionService.clearAllData();
                      fetchStats();
                    }}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded"
                  >
                    Clear All Data
                  </button>
                  <button
                    onClick={fetchStats}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded"
                  >
                    Refresh Stats
                  </button>
                </div>
                {stats && (
                  <div className="mt-2 text-xs text-gray-500">
                    Total: {stats.totalConfessions} | Unread: {stats.unreadConfessions}
                  </div>
                )}
              </div>
            </div>
          )} */}
          
          {stats && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-400 to-magenta-400 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-black" />
                    </div>
                    The Void's Whispers
                  </h3>
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105">
                      <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                        {stats.totalConfessions}
                      </div>
                      <div className="text-gray-400 text-sm font-medium">Total Whispers</div>
                      <div className="w-full h-1 bg-gray-700 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-magenta-400 transition-all duration-300 transform hover:scale-105">
                      <div className="text-4xl font-bold bg-gradient-to-r from-magenta-400 to-magenta-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                        {stats.unreadConfessions}
                      </div>
                      <div className="text-gray-400 text-sm font-medium">Awaiting Souls</div>
                      <div className="w-full h-1 bg-gray-700 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-magenta-400 to-magenta-300 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105">
                      <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                        {Math.round((stats.sentimentDistribution.positive / Math.max(stats.totalConfessions, 1)) * 100)}%
                      </div>
                      <div className="text-gray-400 text-sm font-medium">Hopeful</div>
                      <div className="w-full h-1 bg-gray-700 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 border border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold text-gray-300">Sentiment Distribution</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-500"></div>
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse animation-delay-1000"></div>
                    </div>
                  </div>
                  
                  <div className="flex h-6 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-300 transition-all duration-2000 ease-out relative overflow-hidden" 
                      style={{ width: `${(stats.sentimentDistribution.positive / Math.max(stats.totalConfessions, 1)) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                    </div>
                    <div 
                      className="bg-gradient-to-r from-gray-400 to-gray-300 transition-all duration-2000 ease-out relative overflow-hidden" 
                      style={{ width: `${(stats.sentimentDistribution.neutral / Math.max(stats.totalConfessions, 1)) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-20 animate-pulse animation-delay-500"></div>
                    </div>
                    <div 
                      className="bg-gradient-to-r from-red-400 to-red-300 transition-all duration-2000 ease-out relative overflow-hidden" 
                      style={{ width: `${(stats.sentimentDistribution.negative / Math.max(stats.totalConfessions, 1)) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-20 animate-pulse animation-delay-1000"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-400 mt-3">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      Hopeful ({stats.sentimentDistribution.positive})
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      Neutral ({stats.sentimentDistribution.neutral})
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      Heavy ({stats.sentimentDistribution.negative})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <footer className="mt-20 text-center text-gray-500 text-sm space-y-3">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            <Sparkles className="w-4 h-4 text-gray-600" />
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>
          <p className="font-medium">Your whispers are anonymous and disappear after being read once.</p>
          <p>No data is stored permanently. No tracking. Just pure, ephemeral connection.</p>
          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
              Secure
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-magenta-400 rounded-full animate-pulse"></div>
              Anonymous
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
              Ephemeral
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};