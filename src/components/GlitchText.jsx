import React from 'react';
import { useGlitchText } from '../hooks/useGlitchText';



export const GlitchText = ({ text, className = '', interval = 150 }) => {
  const glitchText = useGlitchText(text, interval);
  
  return (
    <span className={`inline-block ${className}`} style={{ fontFamily: 'monospace' }}>
      {glitchText}
    </span>
  );
};