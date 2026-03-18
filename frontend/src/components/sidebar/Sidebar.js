import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveView, openTaskModal } from '../../store/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import { useCMD } from '../../context/CMDContext';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: SquaresIcon },
  { id: 'board', label: 'My Tasks', icon: TasksIcon },
  { id: 'today', label: 'Due Today', icon: TodayIcon },
  { id: 'overdue', label: 'Overdue', icon: OverdueIcon },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { activeView, sidebarCollapsed } = useSelector((s) => s.ui);
  const { user, logout } = useAuth();
  const { setOpen } = useCMD();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col overflow-hidden"
      style={{ background: 'rgba(8,8,16,0.95)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-iris-600 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 3h10M2 7h7M2 11h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="font-display font-700 text-white text-base tracking-tight whitespace-nowrap"
            >
              TaskFlow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* New Task Button */}
      <div className="px-3 mb-4">
        <button
          onClick={() => dispatch(openTaskModal(null))}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-iris-600/90 hover:bg-iris-500 
          text-white text-sm font-medium transition-all duration-200 group
          shadow-[0_2px_12px_rgba(98,70,255,0.3)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                New Task
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Search / CMD */}
      <div className="px-3 mb-2">
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.03] 
          hover:bg-white/[0.06] border border-white/[0.05] text-white/40 hover:text-white/60
          text-xs transition-all duration-150 group"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0">
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center justify-between w-full">
                <span>Search...</span>
                <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/30 font-mono">⌘K</kbd>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 pt-4 pb-1">
              Workspace
            </motion.p>
          )}
        </AnimatePresence>

        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => dispatch(setActiveView(item.id))}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium
              transition-all duration-150 cursor-pointer relative group
              ${activeView === item.id
                ? 'text-white bg-iris-600/15 border border-iris-500/20'
                : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
              }`}
          >
            <item.icon active={activeView === item.id} />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="whitespace-nowrap">
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {activeView === item.id && (
              <motion.div layoutId="nav-indicator"
                className="absolute right-3 w-1.5 h-1.5 rounded-full bg-iris-400" />
            )}
          </button>
        ))}

        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 pt-5 pb-1">
              Priority
            </motion.p>
          )}
        </AnimatePresence>

        {[
          { id: 'urgent', label: 'Urgent', color: 'bg-red-500' },
          { id: 'high', label: 'High', color: 'bg-orange-500' },
          { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
        ].map((p) => (
          <button key={p.id}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/40
            hover:text-white/80 hover:bg-white/[0.04] transition-all duration-150">
            <span className={`w-2 h-2 rounded-full ${p.color} flex-shrink-0`} />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {p.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-white/[0.05] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-iris-400 to-iris-700
            flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/80 truncate">{user?.name}</p>
                <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-red-400
                transition-all duration-150 flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2M10 10l3-3-3-3M13 7H5" 
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}

function SquaresIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
function TasksIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
      <path d="M2 4h12M2 8h9M2 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function TodayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function OverdueIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
