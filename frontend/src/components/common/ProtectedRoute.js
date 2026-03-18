import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, initialized, fetchMe } = useAuth();
  const router = useRouter();

  useEffect(() => { fetchMe(); }, []);
  useEffect(() => {
    if (initialized && !user) router.replace('/login');
  }, [initialized, user]);

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

  if (!user) return null;
  return children;
}
