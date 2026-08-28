import React from 'react';

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'premium' | 'default';
  className?: string;
}

export function GlassBadge({ children, variant = 'default', className = '' }: GlassBadgeProps) {
  const variants = {
    success: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
    error: "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30",
    info: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
    premium: "bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30",
    default: "bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30"
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
      backdrop-blur-md border shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
      ${variants[variant]} ${className}
    `}>
      {children}
    </span>
  );
}
