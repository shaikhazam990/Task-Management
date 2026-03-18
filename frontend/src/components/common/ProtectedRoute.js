import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, initialized, fetchMe } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ✅ Guest user — skip fetchMe entirely, never call API
    try {
      const saved = localStorage.getItem('auth_user');
      if (saved && JSON.parse(saved)?.isGuest) return;
    } catch {}
    fetchMe();
  }, []);

  useEffect(() => {
    if (initialized && !user) router.replace('/login');
  }, [initialized, user]);

  // ✅ User exists — render immediately, no waiting
  if (user) return children;

  if (!initialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-void gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-2 border-iris-600 border-t-transparent"
        />
        <p className="text-xs text-white/25 font-mono tracking-wider">Authenticating...</p>
      </div>
    );
  }

  return null;
}