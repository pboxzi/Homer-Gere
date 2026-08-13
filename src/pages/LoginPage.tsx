import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowRight, Chrome, Apple, LayoutGrid, Shield, Lock } from 'lucide-react';
import { LOGIN_CONFIG, LOGIN_SECURITY_NOTICE } from '../data/loginData';

const SOCIAL_ICONS: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  Chrome,
  Apple,
  LayoutGrid,
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const enabledProviders = LOGIN_CONFIG.socialProviders.filter((p) => p.enabled);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    // Simulated auth — replace with real auth when backend is ready
    setTimeout(() => {
      setLoading(false);
      // Simulate admin login
      if (email === 'admin@homergere.com') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased flex flex-col">
      {/* Minimal top bar */}
      <header className="px-5 sm:px-8 py-5">
        <button
          onClick={() => navigate('/')}
          className="group flex flex-col text-left focus:outline-none cursor-pointer"
        >
          <span className="font-editorial tracking-[0.06em] text-[#1C1917] group-hover:text-[#A6852F] transition-all duration-500 uppercase leading-none text-lg sm:text-xl">
            Homer Gere
          </span>
          <span className="font-medium tracking-[0.35em] text-[#A6852F]/70 uppercase text-[8px] sm:text-[9px] mt-1">
            Official Website
          </span>
        </button>
      </header>

      {/* Main content — centered */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          {/* 1. Welcome Hero */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] mx-auto mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-3">
              Welcome Back
            </h1>
            <p className="text-sm text-[#57534E] leading-relaxed max-w-sm mx-auto">
              Sign in to access your account, exclusive content, and member benefits.
            </p>
          </motion.div>

          {/* 2. Sign In Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Email */}
            <div>
              <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#1C1917] transition-colors duration-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E8E5DF] text-[#A6852F] focus:ring-[#A6852F]/30 accent-[#A6852F]"
                />
                <span className="text-xs text-[#57534E]">Remember me</span>
              </label>
              <button
                type="button"
                className="text-xs text-[#A6852F] hover:text-[#8B6F1F] font-medium transition-colors duration-200 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                className="text-xs text-red-500"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#1C1917] hover:bg-[#292524] disabled:bg-[#57534E] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#1C1917]/10 focus:outline-none cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>

          {/* 3. Social Sign In */}
          {enabledProviders.length > 0 && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E8E5DF]/60" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#FAF9F7] text-[#57534E]">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {enabledProviders.map((provider) => {
                  const Icon = SOCIAL_ICONS[provider.icon] || Chrome;
                  return (
                    <button
                      key={provider.id}
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#E8E5DF]/60 bg-white hover:bg-[#F3F1ED]/60 hover:border-[#A6852F]/30 transition-all duration-300 cursor-pointer group"
                    >
                      <Icon className="w-4 h-4 text-[#57534E] group-hover:text-[#1C1917] transition-colors duration-300" style={{ color: provider.color }} />
                      <span className="text-xs font-medium text-[#57534E] group-hover:text-[#1C1917] transition-colors duration-300 hidden sm:inline">
                        {provider.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 4. Don't Have an Account */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm text-[#57534E]">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-[#A6852F] hover:text-[#8B6F1F] font-medium transition-colors duration-200 cursor-pointer"
              >
                Create an Account
              </button>
            </p>
          </motion.div>

          {/* 5. Security Notice */}
          <motion.div
            className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-[#F3F1ED]/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Shield className="w-4 h-4 text-[#A6852F] mt-0.5 shrink-0" />
            <p className="text-[11px] text-[#57534E] leading-relaxed">
              {LOGIN_SECURITY_NOTICE}
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
