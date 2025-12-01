import React from 'react';
import { playHoverSound } from '../utils/soundEngine';

interface BrainrotElementProps {
  emoji: string;
  top: string;
  left: string;
  delay?: string;
  rotation?: string;
  scale?: number;
  type?: 'float' | 'jitter' | 'spin';
}

const BrainrotElement: React.FC<BrainrotElementProps> = ({ 
  emoji, top, left, delay = '0s', rotation = '0deg', scale = 1, type = 'float' 
}) => {
  const animationClass = type === 'jitter' ? 'animate-jitter' : type === 'spin' ? 'animate-spin-slow' : 'animate-float';
  
  return (
    <div 
      className={`absolute cursor-help select-none z-10 hover:z-50 transition-transform duration-200 hover:scale-125 ${animationClass}`}
      style={{ top, left, animationDelay: delay, transform: `rotate(${rotation}) scale(${scale})` }}
      onMouseEnter={() => playHoverSound('glitch')}
    >
      <span className="text-4xl md:text-6xl filter drop-shadow-md opacity-90">{emoji}</span>
    </div>
  );
};

export default BrainrotElement;