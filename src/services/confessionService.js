

// Mock sentiment analysis using simple keyword detection
const analyzeSentiment = (text) => {
  const positiveWords = ['happy', 'joy', 'love', 'amazing', 'wonderful', 'grateful', 'excited', 'blessed', 'beautiful', 'perfect'];
  const negativeWords = ['sad', 'hate', 'angry', 'terrible', 'awful', 'depressed', 'anxious', 'worried', 'scared', 'hurt'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
  });
  
  const score = (positiveCount - negativeCount) / Math.max(words.length, 1);
  
  if (score > 0.1) return { sentiment: 'positive', score };
  if (score < -0.1) return { sentiment: 'negative', score };
  return { sentiment: 'neutral', score };
};

const generateSlug = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Helper function to parse confessions and convert date strings back to Date objects
const parseConfessions = (confessions) => {
  return confessions.map(confession => ({
    ...confession,
    createdAt: new Date(confession.createdAt)
  }));
};

// Helper function to save confessions with proper serialization
const saveConfessions = (confessions) => {
  localStorage.setItem('confessions', JSON.stringify(confessions));
};

export const confessionService = {
    submitConfession: async (content) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { sentiment, score } = analyzeSentiment(content);
    
        const confession = {
      id: crypto.randomUUID(),
      content,
      sentiment,
      sentimentScore: score,
      createdAt: new Date(),
      isRead: false,
      uniqueSlug: generateSlug()
    };
    
    // Store in localStorage
    const confessions = parseConfessions(JSON.parse(localStorage.getItem('confessions') || '[]'));
    confessions.push(confession);
    saveConfessions(confessions);
    
    console.log('Confession submitted:', {
      id: confession.id.substring(0, 8),
      slug: confession.uniqueSlug,
      isRead: confession.isRead
    });
    return confession;
  },
  
  // Get confession preview without marking as read
    getConfessionPreview: async (slug) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const confessions = parseConfessions(JSON.parse(localStorage.getItem('confessions') || '[]'));
    const confession = confessions.find(c => c.uniqueSlug === slug && !c.isRead);
    
    console.log('Looking for confession preview with slug:', slug);
    console.log('Found confession:', confession ? {
      id: confession.id.substring(0, 8),
      slug: confession.uniqueSlug,
      isRead: confession.isRead
    } : 'Not found');
    
    return confession || null;
  },
  
  // Mark confession as read (separate from fetching)
    markConfessionAsRead: async (slug) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const confessions = parseConfessions(JSON.parse(localStorage.getItem('confessions') || '[]'));
    const confessionIndex = confessions.findIndex(c => c.uniqueSlug === slug && !c.isRead);
    
    if (confessionIndex === -1) {
      console.log('Confession not found or already read when marking as read:', slug);
      return false;
    }
    
    // Mark as read
    confessions[confessionIndex] = { ...confessions[confessionIndex], isRead: true };
    saveConfessions(confessions);
    
    console.log('Confession marked as read:', {
      id: confessions[confessionIndex].id.substring(0, 8),
      slug: confessions[confessionIndex].uniqueSlug
    });
    
    return true;
  },
  
  // Legacy method for backward compatibility (used by random reading)
    getConfession: async (slug) => {
    const confession = await confessionService.getConfessionPreview(slug);
    if (confession) {
      await confessionService.markConfessionAsRead(slug);
    }
    return confession;
  },
  
    getRandomConfession: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const confessions = parseConfessions(JSON.parse(localStorage.getItem('confessions') || '[]'));
    const unreadConfessions = confessions.filter(c => !c.isRead);
    
    console.log('Random confession request - unread count:', unreadConfessions.length);
    
    if (unreadConfessions.length === 0) {
      console.log('No unread confessions available');
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * unreadConfessions.length);
    const selectedConfession = unreadConfessions[randomIndex];
    
    // Find the confession in the main array and mark as read
    const confessionIndex = confessions.findIndex(c => c.id === selectedConfession.id);
    if (confessionIndex !== -1) {
      confessions[confessionIndex] = { ...selectedConfession, isRead: true };
      saveConfessions(confessions);
    }
    
    console.log('Random confession selected and marked as read:', {
      id: selectedConfession.id.substring(0, 8),
      slug: selectedConfession.uniqueSlug
    });
    
    return selectedConfession;
  },
  
    getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const confessions = parseConfessions(JSON.parse(localStorage.getItem('confessions') || '[]'));
    const unreadConfessions = confessions.filter(c => !c.isRead);
    
    const sentimentDistribution = confessions.reduce((acc, c) => {
      acc[c.sentiment]++;
      return acc;
    }, { positive: 0, negative: 0, neutral: 0 });
    
    const stats = {
      totalConfessions: confessions.length,
      unreadConfessions: unreadConfessions.length,
      sentimentDistribution
    };
    
    console.log('Stats calculated:', stats);
    
    return stats;
  },

  // Debug helper function to inspect localStorage data
    debugStorage: () => {
    console.log('=== DEBUG STORAGE ===');
    const confessions = parseConfessions(JSON.parse(localStorage.getItem('confessions') || '[]'));
    console.log('Total confessions:', confessions.length);
    console.log('Unread confessions:', confessions.filter(c => !c.isRead).length);
    console.log('All confessions:', confessions.map(c => ({
      id: c.id.substring(0, 8),
      slug: c.uniqueSlug,
      isRead: c.isRead,
      content: c.content.substring(0, 50) + '...'
    })));
    console.log('==================');
  },

  // Helper function to clear all data (for testing)
    clearAllData: () => {
    localStorage.removeItem('confessions');
    console.log('All data cleared');
  }
};