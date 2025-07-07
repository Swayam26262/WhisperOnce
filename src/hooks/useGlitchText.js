import { useState, useEffect } from 'react';

export const useGlitchText = (text, interval = 150) => {
  const [glitchText, setGlitchText] = useState(text);
  
  useEffect(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance to glitch
        const glitched = text.split('').map(char => 
          Math.random() < 0.3 ? characters[Math.floor(Math.random() * characters.length)] : char
        ).join('');
        
        setGlitchText(glitched);
        
        // Reset to original after short delay
        setTimeout(() => setGlitchText(text), 100);
      }
    }, interval);
    
    return () => clearInterval(glitchInterval);
  }, [text, interval]);
  
  return glitchText;
};