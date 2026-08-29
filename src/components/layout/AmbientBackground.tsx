import React from 'react';
import { motion } from 'framer-motion';

interface AmbientBackgroundProps {
  theme?: 'dark' | 'light' | 'emerald-gold';
  children: React.ReactNode;
}

export function AmbientBackground({ theme = 'light', children }: AmbientBackgroundProps) {
  const isDark = theme === 'dark';
  const isEmeraldGold = theme === 'emerald-gold';
  
  const getContainerClass = () => {
    if (isEmeraldGold) return 'bg-[#06150f] text-[#f2ebde]';
    if (isDark) return 'bg-slate-950 text-slate-100';
    return 'bg-slate-50 text-slate-900';
  };

  const getBaseGradient = () => {
    if (isEmeraldGold) {
      return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0d4933] via-[#092218] to-[#040e0b]';
    }
    if (isDark) {
      return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-[#070b14]';
    }
    return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0d4933]/15 via-slate-50 to-[#629176]/10';
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${getContainerClass()}`}>
      {/* Background Gradients & Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Base dynamic gradient */}
        <div className={`absolute inset-0 ${getBaseGradient()}`} />
        
        {/* Animated Light Orb 1 - Sage / Emerald */}
        <motion.div 
          animate={{ 
            scale: [1, 1.25, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
            opacity: isEmeraldGold ? [0.3, 0.5, 0.3] : isDark ? [0.25, 0.45, 0.25] : [0.3, 0.55, 0.3]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-32 -left-32 w-[42vw] h-[42vw] rounded-full filter blur-[110px] ${
            isEmeraldGold ? 'bg-[#c1912a]/35' : isDark ? 'bg-[#0d4933]/50' : 'bg-[#629176]/40'
          }`} 
        />

        {/* Animated Light Orb 2 - Deep Emerald */}
        <motion.div 
          animate={{ 
            scale: [1, 1.35, 1],
            x: [0, -50, 0],
            y: [0, 50, 0],
            opacity: isEmeraldGold ? [0.4, 0.65, 0.4] : isDark ? [0.25, 0.5, 0.25] : [0.25, 0.5, 0.25]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute -bottom-32 -right-32 w-[48vw] h-[48vw] rounded-full filter blur-[130px] ${
            isEmeraldGold ? 'bg-[#0d4933]/80' : isDark ? 'bg-[#042821]/80' : 'bg-[#0d4933]/30'
          }`} 
        />

        {/* Animated Light Orb 3 - Sage Mist */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, 40, 0],
            opacity: isEmeraldGold ? [0.25, 0.45, 0.25] : isDark ? [0.15, 0.3, 0.15] : [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className={`absolute top-1/3 left-2/3 w-[34vw] h-[34vw] rounded-full filter blur-[95px] ${
            isEmeraldGold ? 'bg-[#629176]/45' : isDark ? 'bg-[#629176]/25' : 'bg-[#629176]/30'
          }`} 
        />

        {/* Animated Light Orb 4 - Gold Pearl accent */}
        {isEmeraldGold && (
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              x: [-20, 20, -20],
              y: [20, -20, 20],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-2/3 left-1/4 w-[28vw] h-[28vw] rounded-full filter blur-[80px] bg-[#f2ebde]/15"
          />
        )}

        {/* Subtle geometric grid overlay */}
        <div className={`absolute inset-0 ${
          isEmeraldGold
            ? 'bg-[linear-gradient(to_right,#c1912a14_1px,transparent_1px),linear-gradient(to_bottom,#c1912a14_1px,transparent_1px)] opacity-40'
            : isDark 
              ? 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] opacity-30' 
              : 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] opacity-60'
        } bg-[size:28px_28px]`} />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}
