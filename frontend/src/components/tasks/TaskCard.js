import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { openTaskModal } from '../../store/slices/uiSlice';
import { useTasks } from '../../hooks/useTasks';
import { usePomodoro } from '../../hooks/usePomodoro';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-500' },
  high:   { label: 'High',   color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', dot: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-500' },
  low:    { label: 'Low',    color: 'text-slate-400',  bg: 'bg-slate-700/30',  border: 'border-slate-600/30',  dot: 'bg-slate-500' },
};

const STATUS_CONFIG = {
  'todo':        { label: 'To Do',       icon: '○', color: 'text-slate-400' },
  'in-progress': { label: 'In Progress', icon: '◔', color: 'text-amber-400' },
  'done':        { label: 'Done',        icon: '●', color: 'text-emerald-400' },
};

const TaskCard = forwardRef(function TaskCard({ task, index }, ref) {
  const dispatch = useDispatch();
  const { removeTask, editTask } = useTasks();
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { mode, minutes, seconds, progress, running, sessions, toggle, reset, switchMode } = usePomodoro();

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.low;
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG['todo'];

  const handleDelete = async () => {
    setDeleting(true);
    const res = await removeTask(task._id);
    if (res.error) { toast.error('Failed to delete'); setDeleting(false); }
    else toast.success('Task removed');
  };

  const handleStatusCycle = async (e) => {
    e.stopPropagation();
    const cycle = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' };
    await editTask(task._id, { status: cycle[task.status] });
  };

  const circumference = 2 * Math.PI * 20;
  const strokeDash = circumference * (1 - progress);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className={`group relative rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden
        ${deleting ? 'opacity-50 scale-95' : ''}
        bg-white/[0.02] border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.04]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]`}
      onClick={() => dispatch(openTaskModal(task))}
    >
      {/* Priority bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${priority.dot} opacity-60`} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {/* Status icon - clickable */}
            <button
              onClick={handleStatusCycle}
              className={`text-base flex-shrink-0 ${status.color} hover:scale-110 transition-transform`}
              title="Cycle status"
            >
              {status.icon}
            </button>
            <h3 className={`text-sm font-semibold leading-snug truncate
              ${task.status === 'done' ? 'line-through text-white/40' : 'text-white/90'}`}>
              {task.title}
            </h3>
          </div>

          {/* Actions (hover only) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setShowPomodoro(!showPomodoro); }}
              className={`p-1.5 rounded-lg transition-all ${showPomodoro ? 'bg-iris-600/30 text-iris-400' : 'hover:bg-white/[0.08] text-white/30 hover:text-white/70'}`}
              title="Pomodoro timer"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 3v3.5l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"
              title="Delete task"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 3h8M5 3V2h2v1M4.5 3v6M7.5 3v6M3 3l.5 7h5L9 3" 
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-white/35 mb-3 leading-relaxed line-clamp-2 pl-5">
            {task.description}
          </p>
        )}

        {/* Pomodoro Timer (expanded) */}
        <AnimatePresence>
          {showPomodoro && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-2 mb-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1">
                    {['work', 'break'].map((m) => (
                      <button key={m} onClick={() => switchMode(m)}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all
                        ${mode === m ? 'bg-iris-600/40 text-iris-300' : 'text-white/30 hover:text-white/60'}`}>
                        {m === 'work' ? 'Focus' : 'Break'}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-white/30">{sessions} sessions</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* SVG circle timer */}
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <svg width="48" height="48" className="-rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
                      <circle cx="24" cy="24" r="20" fill="none"
                        stroke={mode === 'work' ? '#6246ff' : '#10b981'}
                        strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDash}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-mono font-bold text-white/80">{minutes}:{seconds}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={toggle}
                      className="px-3 py-1.5 rounded-lg bg-iris-600/80 hover:bg-iris-500 text-white
                      text-xs font-medium transition-all">
                      {running ? 'Pause' : 'Start'}
                    </button>
                    <button onClick={reset}
                      className="px-2 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/50 text-xs transition-all">
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between pl-5">
          <div className="flex items-center gap-2">
            {/* Priority badge */}
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full
              ${priority.bg} ${priority.color} border ${priority.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>
          </div>
          <span className="text-[10px] text-white/20 font-mono">
            {format(new Date(task.createdAt), 'MMM d')}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

TaskCard.displayName = 'TaskCard';
export default TaskCard;
