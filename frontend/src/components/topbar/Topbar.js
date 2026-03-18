import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleSidebar, setSearchQuery, setActiveView } from '../../store/slices/uiSlice';
import { useTheme } from '../../context/ThemeContext';
import { useCMD } from '../../context/CMDContext';
import { useState, useEffect, useRef } from 'react';

const VIEW_LABELS = {
  board: 'My Tasks',
  dashboard: 'Dashboard',
  today: 'Due Today',
  overdue: 'Overdue',
};

export default function Topbar() {
  const dispatch = useDispatch();
  const { activeView, searchQuery } = useSelector((s) => s.ui);
  const { theme, toggleTheme } = useTheme();
  const { setOpen } = useCMD();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(setSearchQuery(localSearch));
    }, 350);
  }, [localSearch]);

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.05] flex-shrink-0"
      style={{ background: 'rgba(8,8,16,0.8)', backdropFilter: 'blur(12px)' }}>

      {/* Left: toggle + breadcrumb */}
      <div className="flex items-center gap-4">
        <button onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-all">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/30">Workspace</span>
          <span className="text-white/20">/</span>
          <span className="text-white/80 font-medium">{VIEW_LABELS[activeView] || 'My Tasks'}</span>
        </div>
      </div>

      {/* Right: search, theme, shortcuts */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-52 pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white/[0.04] border border-white/[0.07]
            text-white/70 placeholder-white/25 focus:outline-none focus:border-iris-500/40
            focus:bg-white/[0.06] transition-all"
          />
        </div>

        {/* CMD Palette */}
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07]
          text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all text-xs">
          <kbd className="font-mono">⌘K</kbd>
        </button>

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-all relative overflow-hidden"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <motion.div
            key={theme}
            initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 1v1M7.5 13v1M1 7.5H2M13 7.5h1M3.22 3.22l.7.7M11.08 11.08l.7.7M3.22 11.78l.7-.7M11.08 3.92l.7-.7"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M12.5 9.5A6 6 0 015.5 2.5a6 6 0 107 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </motion.div>
        </button>

        {/* Keyboard shortcut hint */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] text-white/20 font-mono">
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.07]">N</kbd>
          <span>new</span>
        </div>
      </div>
    </header>
  );
}
