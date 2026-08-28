import React from 'react';
import { motion } from 'framer-motion';

interface AmbientBackgroundProps {
  theme?: 'dark' | 'light';
  children: React.ReactNode;
}

export function AmbientBackground({ theme = 'light', children }: AmbientBackgroundProps) {
  const isDark = theme === 'dark';
  
  return (
    <div className={`min-h-screen relative overflow-x-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Background Gradients & Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Base dynamic gradient */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-[#070b14]' 
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/70 via-slate-50 to-purple-50/50'
        }`} />
        
        {/* Animated Light Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.25, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
            opacity: isDark ? [0.25, 0.45, 0.25] : [0.35, 0.6, 0.35]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-32 -left-32 w-[38vw] h-[38vw] rounded-full filter blur-[100px] ${
            isDark ? 'bg-blue-600/40' : 'bg-blue-300/60'
          }`} 
        />

        <motion.div 
          animate={{ 
            scale: [1, 1.35, 1],
            x: [0, -50, 0],
            y: [0, 50, 0],
            opacity: isDark ? [0.2, 0.4, 0.2] : [0.3, 0.55, 0.3]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute -bottom-32 -right-32 w-[45vw] h-[45vw] rounded-full filter blur-[120px] ${
            isDark ? 'bg-purple-600/35' : 'bg-purple-300/50'
          }`} 
        />

        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, 40, 0],
            opacity: isDark ? [0.15, 0.3, 0.15] : [0.25, 0.45, 0.25]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className={`absolute top-1/3 left-2/3 w-[30vw] h-[30vw] rounded-full filter blur-[90px] ${
            isDark ? 'bg-cyan-500/25' : 'bg-pink-300/45'
          }`} 
        />

        {/* Subtle geometric dot grid overlay */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] ${
          isDark ? 'opacity-30' : 'opacity-60'
        }`} />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}
