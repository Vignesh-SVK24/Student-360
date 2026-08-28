import React, { forwardRef } from 'react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 z-10">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-xl bg-white/10 dark:bg-black/10 backdrop-blur-md 
              border border-white/20 dark:border-white/10 
              px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50
              transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <span className="text-sm text-red-500 dark:text-red-400 ml-1 mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);
GlassInput.displayName = 'GlassInput';

export const GlassTextarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 ml-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full rounded-xl bg-white/10 dark:bg-black/10 backdrop-blur-md 
            border border-white/20 dark:border-white/10 
            px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50
            transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]
            ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-sm text-red-500 dark:text-red-400 ml-1 mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);
GlassTextarea.displayName = 'GlassTextarea';
