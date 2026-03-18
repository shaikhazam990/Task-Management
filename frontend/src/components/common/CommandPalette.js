import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMD } from '../../context/CMDContext';
import { useDispatch } from 'react-redux';
import { openTaskModal, setActiveView } from '../../store/slices/uiSlice';
import { useTasks } from '../../hooks/useTasks';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function CommandPalette() {
  const { open, setOpen } = useCMD();
  const dispatch = useDispatch();
  const router = useRouter();
  const { tasks } = useTasks();
  const { logout } = useAuth();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const COMMANDS = [
    { id: 'new-task',   label: 'New Task',       icon: '＋', group: 'Actions',    action: () => { dispatch(openTaskModal(null)); setOpen(false); } },
    { id: 'dashboard',  label: 'Go to Dashboard', icon: '⊞', group: 'Navigate',   action: () => { dispatch(setActiveView('dashboard')); setOpen(false); } },
    { id: 'board',      label: 'Go to My Tasks',  icon: '☰', group: 'Navigate',   action: () => { dispatch(setActiveView('board')); setOpen(false); } },
    { id: 'today',      label: 'Due Today',        icon: '◫', group: 'Navigate',   action: () => { dispatch(setActiveView('today')); setOpen(false); } },
    { id: 'logout',     label: 'Logout',           icon: '→', group: 'Account',    action: async () => { await logout(); toast.success('Logged out'); router.push('/login'); setOpen(false); } },
  ];

  const taskResults = query
    ? tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5).map((t) => ({
        id: t._id,
        label: t.title,
        icon: t.status === 'done' ? '●' : t.status === 'in-progress' ? '◔' : '○',
        group: 'Tasks',
        action: () => { dispatch(openTaskModal(t)); setOpen(false); },
      }))
    : [];

  const filteredCommands = query
    ? COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  const allResults = [...filteredCommands, ...taskResults];

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, allResults.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && allResults[selected]) { allResults[selected].action(); }
  };

  const grouped = allResults.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  let globalIdx = 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)} />

          <div className="fixed inset-0 z-[61] flex items-start justify-center pt-[20vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md pointer-events-auto rounded-2xl border border-white/[0.12]
                shadow-modal overflow-hidden"
              style={{ background: 'rgba(15,15,24,0.98)', backdropFilter: 'blur(24px)' }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-white/30 flex-shrink-0">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Search tasks, actions..."
                  className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/25 focus:outline-none"
                />
                <kbd className="text-[10px] text-white/25 font-mono px-1.5 py-0.5 rounded bg-white/[0.05]">Esc</kbd>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto py-2">
                {allResults.length === 0 ? (
                  <div className="py-10 text-center text-sm text-white/25">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  Object.entries(grouped).map(([group, items]) => (
                    <div key={group}>
                      <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-4 py-1.5">
                        {group}
                      </p>
                      {items.map((item) => {
                        const idx = globalIdx++;
                        return (
                          <button
                            key={item.id}
                            onClick={item.action}
                            onMouseEnter={() => setSelected(idx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all
                              ${selected === idx ? 'bg-iris-600/15 text-white/90' : 'text-white/60 hover:text-white/90'}`}
                          >
                            <span className="w-5 text-center text-white/40 flex-shrink-0 font-mono text-xs">
                              {item.icon}
                            </span>
                            <span className="flex-1 text-left">{item.label}</span>
                            {selected === idx && (
                              <kbd className="text-[10px] text-white/30 font-mono px-1.5 py-0.5 rounded bg-white/[0.06]">
                                ↵
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center gap-4 text-[10px] text-white/25">
                <span className="flex items-center gap-1"><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="font-mono">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="font-mono">Esc</kbd> close</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
