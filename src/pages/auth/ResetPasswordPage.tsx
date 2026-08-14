import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setValidToken(true);
      } else {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        if (accessToken) {
          setValidToken(true);
        } else {
          setValidToken(false);
        }
      }
    };
    checkSession();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password) {
      setError('Please enter a new password.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
    } catch {
      setError('Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (validToken === false) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased flex items-center justify-center px-4">
        <SEO title="Invalid Link" />
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-20 h-20 rounded-full bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-8">
            <Lock className="w-10 h-10 text-[#DC2626]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-4">
            Invalid or Expired Link
          </h1>
          <p className="text-[#57534E] leading-relaxed mb-10 max-w-md mx-auto">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/auth/forgot-password')}
              className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              Request New Link
            </button>
            <button
              onClick={() => navigate('/auth/sign-in')}
              className="inline-flex items-center justify-center gap-2 border border-[#E8E5DF]/60 hover:bg-[#F3F1ED]/60 text-[#57534E] font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased flex items-center justify-center px-4">
        <SEO title="Password Reset" />
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-20 h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-[#16A34A]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-4">
            Password Reset Successfully
          </h1>
          <p className="text-[#57534E] leading-relaxed mb-10 max-w-md mx-auto">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <button
            onClick={() => navigate('/auth/sign-in')}
            className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (validToken === null) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#A6852F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased flex flex-col">
      <SEO title="Reset Password" />
      <header className="px-5 sm:px-8 py-5">
        <button
          onClick={() => navigate('/auth/sign-in')}
          className="group flex flex-col text-left focus:outline-none cursor-pointer"
        >
          <span className="font-editorial tracking-[0.06em] text-[#1C1917] group-hover:text-[#A6852F] transition-all duration-500 uppercase leading-none text-lg sm:text-xl">
            Homer Gere
          </span>
          <span className="font-medium tracking-[0.35em] text-[#A6852F]/70 uppercase text-[10px] sm:text-[11px] mt-1">
            Official Website
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
            <div className="w-14 h-14 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] mx-auto mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-3">
              Reset Password
            </h1>
            <p className="text-sm text-[#57534E] leading-relaxed max-w-sm mx-auto">
              Enter your new password below.
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
              <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#1C1917] transition-colors duration-200 cursor-pointer p-2.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#1C1917] transition-colors duration-200 cursor-pointer p-2.5"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="text-xs text-[#16A34A] mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passwords match</p>
              )}
            </div>

            {error && (
              <motion.p
                className="text-xs text-red-500"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#1C1917] hover:bg-[#292524] disabled:bg-[#57534E] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#1C1917]/10 focus:outline-none cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={() => navigate('/')}
              className="text-xs text-[#57534E]/70 hover:text-[#A6852F] transition-colors duration-300 cursor-pointer"
            >
              ← Back to Homer Gere
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
