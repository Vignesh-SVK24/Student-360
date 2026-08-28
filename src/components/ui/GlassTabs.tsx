import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
}

interface GlassTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function GlassTabs({ tabs, activeTab, onChange, className = '' }: GlassTabsProps) {
  return (
    <div className={`flex space-x-1 p-1 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl border border-white/20 overflow-x-auto custom-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap
              ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-white/50 dark:bg-white/10 rounded-lg shadow-sm border border-white/40 dark:border-white/20"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
