import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { openTaskModal } from '../../store/slices/uiSlice';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, subDays } from 'date-fns';

const STAT_CARDS = [
  { key: 'total',    label: 'Total Tasks',    color: '#6246ff', bg: 'from-iris-600/10 to-transparent', border: 'border-iris-500/20' },
  { key: 'todo',     label: 'To Do',          color: '#64748b', bg: 'from-slate-600/10 to-transparent', border: 'border-slate-700/40' },
  { key: 'progress', label: 'In Progress',    color: '#f59e0b', bg: 'from-amber-500/10 to-transparent', border: 'border-amber-500/20' },
  { key: 'done',     label: 'Completed',      color: '#10b981', bg: 'from-emerald-500/10 to-transparent', border: 'border-emerald-500/20' },
];

export default function Dashboard() {
  const { tasks } = useTasks();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const progress = tasks.filter((t) => t.status === 'in-progress').length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const completionRate = total ? Math.round((done / total) * 100) : 0;
    return { total, todo, progress, done, completionRate };
  }, [tasks]);

  // Simulate last 7 days activity
  const activityData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dayTasks = tasks.filter((t) => {
        const created = new Date(t.createdAt);
        return format(created, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd');
      });
      return {
        day: format(d, 'EEE'),
        created: dayTasks.length,
        done: dayTasks.filter((t) => t.status === 'done').length,
      };
    });
  }, [tasks]);

  const radialData = [
    { name: 'Completion', value: stats.completionRate, fill: '#6246ff' },
  ];

  const priorityData = useMemo(() => {
    const counts = { urgent: 0, high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => { if (counts[t.priority] !== undefined) counts[t.priority]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl border border-iris-500/20 overflow-hidden p-6"
        style={{ background: 'linear-gradient(135deg, rgba(98,70,255,0.12) 0%, rgba(8,8,16,0) 60%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-iris-600/5 rounded-full blur-3xl pointer-events-none" />
        <p className="text-xs text-iris-400 font-medium mb-1 uppercase tracking-widest">Dashboard</p>
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          Welcome back, {user?.name?.split(' ')[0]} ✦
        </h1>
        <p className="text-sm text-white/40">
          {stats.done > 0
            ? `You've completed ${stats.done} task${stats.done !== 1 ? 's' : ''}. ${stats.todo > 0 ? `${stats.todo} more to go.` : 'Amazing work!'}`
            : 'Create your first task to get started.'}
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div key={card.key}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`relative rounded-2xl border ${card.border} p-5 overflow-hidden
              bg-gradient-to-br ${card.bg}`}>
            <p className="text-xs text-white/40 font-medium mb-3">{card.label}</p>
            <p className="text-3xl font-display font-bold" style={{ color: card.color }}>
              {stats[card.key]}
            </p>
            {card.key === 'done' && stats.total > 0 && (
              <p className="text-[10px] text-white/30 mt-1">
                {stats.completionRate}% completion
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Activity bar chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white/80">Task Activity</h3>
              <p className="text-xs text-white/30 mt-0.5">Last 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={activityData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                itemStyle={{ color: 'rgba(255,255,255,0.5)' }}
              />
              <Bar dataKey="created" name="Created" fill="rgba(98,70,255,0.5)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="done" name="Done" fill="rgba(16,185,129,0.6)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Completion radial */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-white/80 mb-1">Completion</h3>
          <p className="text-xs text-white/30 mb-4">Overall rate</p>
          <div className="relative w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: 'rgba(255,255,255,0.04)' }} dataKey="value" cornerRadius={6} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-bold text-white">{stats.completionRate}%</span>
              <span className="text-[10px] text-white/30">complete</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />{stats.done} done
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-600" />{stats.todo} left
            </span>
          </div>
        </motion.div>
      </div>

      {/* Recent tasks */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/80">Recent Tasks</h3>
          <button onClick={() => dispatch(openTaskModal(null))}
            className="text-xs text-iris-400 hover:text-iris-300 transition-colors font-medium">
            + Add task
          </button>
        </div>

        {recentTasks.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-white/25">No tasks yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTasks.map((task, i) => (
              <motion.div key={task._id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                onClick={() => dispatch(openTaskModal(task))}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.04]
                  border border-transparent hover:border-white/[0.06] cursor-pointer transition-all group">
                <span className={`text-sm flex-shrink-0
                  ${task.status === 'done' ? 'text-emerald-400' : task.status === 'in-progress' ? 'text-amber-400' : 'text-slate-400'}`}>
                  {task.status === 'done' ? '●' : task.status === 'in-progress' ? '◔' : '○'}
                </span>
                <span className={`flex-1 text-sm font-medium truncate
                  ${task.status === 'done' ? 'line-through text-white/30' : 'text-white/75 group-hover:text-white/90'}`}>
                  {task.title}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {task.priority && (
                    <span className={`text-[10px] font-mono
                      ${task.priority === 'urgent' ? 'text-red-400' : task.priority === 'high' ? 'text-orange-400' : task.priority === 'medium' ? 'text-yellow-400' : 'text-slate-500'}`}>
                      {task.priority}
                    </span>
                  )}
                  <span className="text-[10px] text-white/20 font-mono">
                    {format(new Date(task.createdAt), 'MMM d')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
