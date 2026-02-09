import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyle = "px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-95 transform hover:-translate-y-1 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-slate-800 text-white hover:bg-slate-700",
    secondary: "bg-white text-slate-800 border-2 border-slate-100 hover:border-slate-300",
    outline: "bg-transparent border-2 border-slate-800 text-slate-800 hover:bg-slate-50",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;