import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function GlassButton({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}: GlassButtonProps) {
  const baseClasses = "relative overflow-hidden font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  // Using Tailwind utility classes for glass effects
  const variants = {
    primary: "bg-blue-600/80 hover:bg-blue-500/90 text-white backdrop-blur-md border border-blue-400/50 shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_24px_rgba(37,99,235,0.5)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
    secondary: "bg-white/10 hover:bg-white/20 text-slate-800 dark:text-white backdrop-blur-md border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.1)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
    danger: "bg-red-500/80 hover:bg-red-400/90 text-white backdrop-blur-md border border-red-400/50 shadow-[0_4px_16px_rgba(239,68,68,0.3)]",
    ghost: "bg-transparent hover:bg-white/10 text-slate-800 dark:text-white border border-transparent hover:border-white/20"
  };

  return (
    <button 
      className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Shine effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
