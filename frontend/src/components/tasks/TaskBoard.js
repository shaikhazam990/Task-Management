import { useEffect, useMemo, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { setFilterStatus, setFilterPriority } from '../../store/slices/uiSlice';
import { useTasks } from '../../hooks/useTasks';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'todo',        label: 'To Do',       icon: '○', color: 'text-slate-400', border: 'border-slate-700/50', glow: '' },
  { id: 'in-progress', label: 'In Progress',  icon: '◔', color: 'text-amber-400',  border: 'border-amber-500/20', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.05)]' },
  { id: 'done',        label: 'Done',         icon: '●', color: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.05)]' },
];

const PRIORITY_FILTERS = [
  { value: 'all',    label: 'All Priority' },
  { value: 'urgent', label: '🔴 Urgent' },
  { value: 'high',   label: '🟠 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low',    label: '⚪ Low' },
];

export default function TaskBoard() {
  const dispatch = useDispatch();
  const { filterStatus, filterPriority, searchQuery } = useSelector((s) => s.ui);
  const { user } = useSelector((s) => s.auth); // ✅ added
  const { tasks, loading, fetchTasks } = useTasks();

  useEffect(() => {
    if (!user || user?.isGuest) return; // ✅ guest skip
    fetchTasks({ limit: 500 });
  }, [user]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
      return matchSearch && matchPriority;
    });
  }, [tasks, searchQuery, filterPriority]);

  const getColumnTasks = (status) => filteredTasks.filter((t) => t.status === status);

  const totalFiltered = filteredTasks.length;

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          {['all', 'todo', 'in-progress', 'done'].map((s) => (
            <button key={s}
              onClick={() => dispatch(setFilterStatus(s))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
                ${filterStatus === s
                  ? 'bg-iris-600/80 text-white shadow-[0_2px_8px_rgba(98,70,255,0.3)]'
                  : 'text-white/40 hover:text-white/70'}`}>
              {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterPriority}
            onChange={(e) => dispatch(setFilterPriority(e.target.value))}
            className="text-xs bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5
            text-white/60 focus:outline-none focus:border-iris-500/40 transition-all"
          >
            {PRIORITY_FILTERS.map((p) => (
              <option key={p.value} value={p.value} className="bg-slate-900">{p.label}</option>
            ))}
          </select>
          <span className="text-xs text-white/25 font-mono">{totalFiltered} tasks</span>
        </div>
      </div>

      {/* Kanban columns */}
      {loading ? (
        <SkeletonBoard />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 overflow-y-auto pb-6">
          {COLUMNS.map((col) => {
            const colTasks = getColumnTasks(col.id);
            const show = filterStatus === 'all' || filterStatus === col.id;
            if (!show) return null;

            return (
              <motion.div
                key={col.id}
                layout
                className={`flex flex-col rounded-2xl border ${col.border} ${col.glow}
                  bg-white/[0.015] min-h-[200px]`}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <span className={`text-base ${col.color}`}>{col.icon}</span>
                    <span className="text-sm font-semibold text-white/80">{col.label}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full
                    bg-white/[0.06] ${col.color}`}>
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {colTasks.length === 0 ? (
                      <EmptyColumn label={col.label} />
                    ) : (
                      colTasks.map((task, i) => (
                        <TaskCard key={task._id} task={task} index={i} />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const EmptyColumn = forwardRef(function EmptyColumn({ label }, ref) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06]
        flex items-center justify-center mb-3">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 4v8M4 8h8" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-xs text-white/20">No {label.toLowerCase()} tasks</p>
    </motion.div>
  );
});

function SkeletonBoard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 space-y-3">
          <div className="skeleton h-4 w-24 rounded-full" />
          {[0, 1, 2].map((j) => (
            <div key={j} className="rounded-xl border border-white/[0.05] p-4 space-y-2">
              <div className="skeleton h-3 w-3/4 rounded" />
              <div className="skeleton h-2 w-1/2 rounded" />
              <div className="skeleton h-2 w-1/3 rounded" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}