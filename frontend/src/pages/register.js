import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, user, loading, error, clearError } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => { if (user) router.replace('/'); }, [user]);
  useEffect(() => { if (error) { toast.error(error); clearError(); } }, [error]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    if (form.password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await register(form);
  };

  return (
    <>
      <Head><title>Create Account — TaskFlow</title></Head>
      <div className="min-h-screen bg-void flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-iris-600/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-iris-800/6 rounded-full blur-[80px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm relative">

          <div className="flex flex-col items-center mb-8">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-12 h-12 rounded-2xl bg-iris-600 flex items-center justify-center mb-4
              shadow-[0_8px_32px_rgba(98,70,255,0.4)]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M3 10h10M3 15h7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-white">Create account</h1>
            <p className="text-sm text-white/35 mt-1">Start managing your work</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] p-6"
            style={{ background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(20px)' }}>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Full Name</label>
                <input type="text" className={`input ${errors.name ? 'border-red-500/40' : ''}`}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Email</label>
                <input type="email" className={`input ${errors.email ? 'border-red-500/40' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Password</label>
                <input type="password" className={`input ${errors.password ? 'border-red-500/40' : ''}`}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : 'Create account'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-white/30 mt-5">
            Already have one?{' '}
            <Link href="/login" className="text-iris-400 hover:text-iris-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}