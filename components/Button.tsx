import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-3 font-bold uppercase tracking-widest transition-all duration-200 border-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-neon-blue text-black border-neon-blue hover:bg-transparent hover:text-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.5)]",
    secondary: "bg-transparent text-white border-white hover:bg-white hover:text-black",
    danger: "bg-neon-red text-white border-neon-red hover:bg-transparent hover:text-neon-red shadow-[0_0_15px_rgba(255,0,60,0.5)]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;