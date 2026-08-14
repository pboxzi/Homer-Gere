import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, user, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1917] text-white font-body antialiased flex flex-col">
      <SEO title="Admin Login" />
      <header className="px-5 sm:px-8 py-5">
        <button
          onClick={() => navigate('/')}
          className="group flex flex-col text-left focus:outline-none cursor-pointer"
        >
          <span className="font-editorial tracking-[0.06em] text-white group-hover:text-[#A6852F] transition-all duration-500 uppercase leading-none text-lg sm:text-xl">
            Homer Gere
          </span>
          <span className="font-medium tracking-[0.35em] text-[#A6852F]/70 uppercase text-[10px] sm:text-[11px] mt-1">
            Admin Portal
          </span>
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#A6852F]/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-6 h-6 text-[#A6852F]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-editorial text-white tracking-tight mb-3">
              Admin Access
            </h1>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm mx-auto">
              Authorized administrators only. All access is logged and monitored.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-[0.05em] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300"
                placeholder="admin@homergere.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-[0.05em] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors duration-200 cursor-pointer p-2.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                className="text-xs text-red-400"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] disabled:bg-[#A6852F]/60 active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6852F]/25 focus:outline-none cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to Admin
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>

          <motion.div
            className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Shield className="w-4 h-4 text-[#A6852F] mt-0.5 shrink-0" />
            <p className="text-xs text-white/40 leading-relaxed">
              This portal is restricted to authorized administrators. Unauthorized access attempts are logged and reported.
            </p>
          </motion.div>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => navigate('/')}
              className="text-xs text-white/30 hover:text-white/60 transition-colors duration-300 cursor-pointer"
            >
              ← Back to Homer Gere
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
