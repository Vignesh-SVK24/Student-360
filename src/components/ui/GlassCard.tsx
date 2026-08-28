import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'solid' | 'high-blur' | 'interactive';
  className?: string;
}

export function GlassCard({ children, variant = 'default', className = '', ...props }: GlassCardProps) {
  const baseClasses = "rounded-2xl border transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]";
  
  const variants = {
    'default': "bg-white/10 backdrop-blur-md border-white/20",
    'solid': "bg-white/70 backdrop-blur-sm border-white/40 dark:bg-slate-800/80 dark:border-slate-700",
    'high-blur': "bg-white/5 backdrop-blur-xl border-white/10",
    'interactive': "bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 hover:border-white/30 cursor-pointer hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:-translate-y-1"
  };

  // Add inner highlight simulating glass edge
  const innerHighlight = "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]";

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${innerHighlight} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
