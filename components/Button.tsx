import React from 'react';
import { playHoverSound } from '../utils/soundEngine';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  // Brutalist / Collage style buttons
  const baseStyles = "relative px-8 py-4 font-pixel font-bold uppercase tracking-widest transition-all duration-100 border-2 border-ink active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const variants = {
    primary: "bg-ink text-paper hover:bg-gum hover:text-white shadow-[4px_4px_0px_0px_#000000]",
    secondary: "bg-transparent text-ink hover:bg-ink hover:text-paper shadow-[4px_4px_0px_0px_#000000]",
    danger: "bg-gum text-white hover:bg-void hover:text-gum shadow-[4px_4px_0px_0px_#1a1a1a]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      onMouseEnter={() => playHoverSound('pop')}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;