import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { openTaskModal } from '../../store/slices/uiSlice';
import Sidebar from '../sidebar/Sidebar';
import Topbar from '../topbar/Topbar';
import TaskModal from '../modals/TaskModal';
import CommandPalette from '../common/CommandPalette';

export default function AppLayout({ children }) {
  const { sidebarCollapsed } = useSelector((s) => s.ui);
  const dispatch = useDispatch();

  // Global keyboard shortcut: N = new task
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'n' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        dispatch(openTaskModal(null));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar />

      {/* Main content */}
      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col min-h-screen min-w-0"
      >
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Global overlays */}
      <TaskModal />
      <CommandPalette />
    </div>
  );
}
