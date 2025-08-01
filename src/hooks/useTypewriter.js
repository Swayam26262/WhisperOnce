import { useState, useEffect } from 'react';

export const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);
  
  const reset = () => {
    setDisplayText('');
    setCurrentIndex(0);
  };
  
  return { displayText, isComplete: currentIndex >= text.length, reset };
};