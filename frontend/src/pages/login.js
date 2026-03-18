import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const GUEST_EMAIL = 'guest@taskflow.demo';
const GUEST_PASSWORD = 'guest123';

export default function LoginPage() {
  const { login, user, loading, error, clearError } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  useEffect(() => { if (user) router.replace('/'); }, [user]);
  useEffect(() => { if (error) { toast.error(error); clearError(); } }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Fill in all fields'); return; }
    await login(form);
  };

  const handleGuest = async () => {
    setGuestLoading(true);
    const result = await login({ email: GUEST_EMAIL, password: GUEST_PASSWORD });
    // If guest account doesn't exist yet, auto-register it first
    if (result?.error) {
      const { registerUser } = await import('../store/slices/authSlice');
      // Try registering via API directly
      try {
        const api = (await import('../services/api')).default;
        await api.post('/auth/register', {
          name: 'Guest User',
          email: GUEST_EMAIL,
          password: GUEST_PASSWORD,
        });
        await login({ email: GUEST_EMAIL, password: GUEST_PASSWORD });
      } catch {
        toast.error('Guest login failed. Please try again.');
      }
    }
    setGuestLoading(false);
  };

  return (
    <>
      <Head><title>Sign In — TaskFlow</title></Head>
      <div className="min-h-screen bg-void flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-iris-600/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-iris-800/6 rounded-full blur-[80px] pointer-events-none" />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm relative">

          {/* Logo mark */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-12 h-12 rounded-2xl bg-iris-600 flex items-center justify-center mb-4
              shadow-[0_8px_32px_rgba(98,70,255,0.4)]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M3 10h10M3 15h7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-white">TaskFlow</h1>
            <p className="text-sm text-white/35 mt-1">Sign in to your workspace</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/[0.08] p-6"
            style={{ background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(20px)' }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Email</label>
                <input type="email" className="input" placeholder="you@example.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email" />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className="input pr-10"
                    placeholder="••••••••"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 2l12 12M6.5 6.6A2 2 0 009.4 9.5M4.5 4.6C3.2 5.5 2.2 6.7 2 8c.6 2.5 3 4 6 4a8 8 0 003.5-.8M7 3.1C7.3 3 7.6 3 8 3c3 0 5.4 2 6 4-.3 1-1 2-1.8 2.7"
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-xs text-white/25">or</span>
                <div className="flex-1 h-px bg-white/[0.07]" />
              </div>

              {/* Guest login */}
              <button
                type="button"
                onClick={handleGuest}
                disabled={guestLoading || loading}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl
                  border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06]
                  text-white/60 hover:text-white/90 text-sm font-medium
                  transition-all duration-200 disabled:opacity-40"
              >
                {guestLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/25 border-t-white/60 rounded-full animate-spin" />
                    Entering as guest...
                  </span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Continue as Guest
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-white/30 mt-5">
            No account?{' '}
            <Link href="/register" className="text-iris-400 hover:text-iris-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>

          {/* Keyboard hint */}
          <p className="text-center text-[10px] text-white/15 mt-3 font-mono">
            Press ⌘K anywhere for quick actions
          </p>
        </motion.div>
      </div>
    </>
  );
}
