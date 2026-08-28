import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface GlassDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: "right" | "left" | "bottom";
}

export function GlassDrawer({ isOpen, onClose, title, children, position = "right" }: GlassDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const slideVariants = {
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
  };

  const posClasses = {
    right: "right-0 top-0 h-full w-full max-w-md border-l",
    left: "left-0 top-0 h-full w-full max-w-md border-r",
    bottom: "bottom-0 left-0 w-full h-[80vh] rounded-t-3xl border-t"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={slideVariants[position].initial}
            animate={slideVariants[position].animate}
            exit={slideVariants[position].exit}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`absolute ${posClasses[position]} bg-white/20 dark:bg-slate-900/60 backdrop-blur-2xl border-white/20 shadow-2xl flex flex-col z-10`}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
              <button 
                onClick={onClose}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
