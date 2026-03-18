import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { closeTaskModal } from '../../store/slices/uiSlice';
import { useTasks } from '../../hooks/useTasks';
import toast from 'react-hot-toast';

const STATUSES = [
  { value: 'todo',        label: 'To Do',       icon: '○', color: 'text-slate-400' },
  { value: 'in-progress', label: 'In Progress',  icon: '◔', color: 'text-amber-400' },
  { value: 'done',        label: 'Done',         icon: '●', color: 'text-emerald-400' },
];

const PRIORITIES = [
  { value: 'urgent', label: 'Urgent', color: 'text-red-400',    dot: 'bg-red-500' },
  { value: 'high',   label: 'High',   color: 'text-orange-400', dot: 'bg-orange-500' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400', dot: 'bg-yellow-500' },
  { value: 'low',    label: 'Low',    color: 'text-slate-400',  dot: 'bg-slate-500' },
];

export default function TaskModal() {
  const dispatch = useDispatch();
  const { taskModal } = useSelector((s) => s.ui);
  const { addTask, editTask } = useTasks();
  const { open, task } = taskModal;
  const isEdit = !!task;

  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'todo',
        priority: task?.priority || 'medium',
      });
      setErrors({});
    }
  }, [open, task]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') dispatch(closeTaskModal()); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.length > 100) errs.title = 'Max 100 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = isEdit
      ? await editTask(task._id, form)
      : await addTask(form);
    setLoading(false);
    if (result.error) {
      toast.error(result.payload || 'Something went wrong');
    } else {
      toast.success(isEdit ? 'Task updated' : 'Task created');
      dispatch(closeTaskModal());
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeTaskModal())}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-lg pointer-events-auto rounded-2xl border border-white/[0.1]
              shadow-modal overflow-hidden"
              style={{ background: 'rgba(18,18,31,0.98)', backdropFilter: 'blur(24px)' }}>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-iris-600/20 border border-iris-500/30
                    flex items-center justify-center">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d={isEdit ? 'M2 7l3 3 6-6' : 'M6.5 1v11M1 6.5h11'}
                        stroke="#8075ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-white/90">
                    {isEdit ? 'Edit task' : 'Create task'}
                  </h2>
                </div>
                <button onClick={() => dispatch(closeTaskModal())}
                  className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/30 hover:text-white/60 transition-all">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <input
                    type="text"
                    className={`w-full bg-transparent text-white/90 text-base font-semibold placeholder-white/20
                      focus:outline-none border-b pb-2 transition-colors
                      ${errors.title ? 'border-red-500/50' : 'border-white/[0.08] focus:border-iris-500/50'}`}
                    placeholder="Task title..."
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    autoFocus
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <textarea
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm
                    text-white/70 placeholder-white/20 focus:outline-none focus:border-iris-500/40
                    focus:bg-white/[0.05] transition-all resize-none"
                  placeholder="Add description (optional)..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                {/* Status + Priority row */}
                <div className="flex gap-3">
                  {/* Status */}
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">
                      Status
                    </label>
                    <div className="flex flex-col gap-1.5">
                      {STATUSES.map((s) => (
                        <button key={s.value} type="button"
                          onClick={() => setForm({ ...form, status: s.value })}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium
                            transition-all duration-150
                            ${form.status === s.value
                              ? 'bg-white/[0.08] border border-white/[0.12]'
                              : 'hover:bg-white/[0.04] border border-transparent'}`}>
                          <span className={s.color}>{s.icon}</span>
                          <span className="text-white/70">{s.label}</span>
                          {form.status === s.value && (
                            <motion.span layoutId="status-check" className="ml-auto text-iris-400">
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </motion.span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-px bg-white/[0.06]" />

                  {/* Priority */}
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">
                      Priority
                    </label>
                    <div className="flex flex-col gap-1.5">
                      {PRIORITIES.map((p) => (
                        <button key={p.value} type="button"
                          onClick={() => setForm({ ...form, priority: p.value })}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium
                            transition-all duration-150
                            ${form.priority === p.value
                              ? 'bg-white/[0.08] border border-white/[0.12]'
                              : 'hover:bg-white/[0.04] border border-transparent'}`}>
                          <span className={`w-2 h-2 rounded-full ${p.dot} flex-shrink-0`} />
                          <span className="text-white/70">{p.label}</span>
                          {form.priority === p.value && (
                            <motion.span layoutId="priority-check" className="ml-auto text-iris-400">
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </motion.span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/20">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] font-mono">Esc</kbd>
                    <span>to close</span>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => dispatch(closeTaskModal())}
                      className="btn-surface text-xs py-2 px-4">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading}
                      className="btn-primary text-xs py-2 px-5">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </span>
                      ) : isEdit ? 'Save changes' : 'Create task'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
