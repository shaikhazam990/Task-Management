import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AppLayout from '../components/common/AppLayout';
import TaskBoard from '../components/tasks/TaskBoard';
import Dashboard from '../components/dashboard/Dashboard';
import { useTasks } from '../hooks/useTasks';
import { useEffect } from 'react';

export default function HomePage() {
  const { activeView } = useSelector((s) => s.ui);
  const { fetchTasks } = useTasks();

  useEffect(() => {
    fetchTasks({ limit: 100 });
  }, []);

  return (
    <ProtectedRoute>
      <Head>
        <title>TaskFlow — Workspace</title>
      </Head>
      <AppLayout>
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' ? (
            <motion.div key="dashboard"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Dashboard />
            </motion.div>
          ) : (
            <motion.div key="board"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div className="mb-6">
                <h1 className="text-xl font-display font-bold text-white/90">
                  {activeView === 'today' ? 'Due Today' : activeView === 'overdue' ? 'Overdue' : 'My Tasks'}
                </h1>
                <p className="text-xs text-white/30 mt-1">Manage and track your work</p>
              </div>
              <TaskBoard />
            </motion.div>
          )}
        </AnimatePresence>
      </AppLayout>
    </ProtectedRoute>
  );
}
