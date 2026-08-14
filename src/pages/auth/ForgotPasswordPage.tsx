import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Mail, CheckCircle } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased flex items-center justify-center px-4">
        <SEO title="Check Your Email" />
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
            Check Your Email
          </h1>
          <p className="text-[#57534E] leading-relaxed mb-10 max-w-md mx-auto">
            We&apos;ve sent a password reset link to <span className="font-medium text-[#1C1917]">{email}</span>.
            Please check your inbox and follow the instructions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/auth/sign-in')}
              className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              Back to Sign In
            </button>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="inline-flex items-center justify-center gap-2 border border-[#E8E5DF]/60 hover:bg-[#F3F1ED]/60 text-[#57534E] font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              Try another email
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased flex flex-col">
      <SEO title="Forgot Password" />
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
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E5DF]/80 bg-white/60 hover:bg-[#F3F1ED] text-[#57534E] hover:text-[#A6852F] transition-all text-xs font-medium cursor-pointer shadow-sm shadow-black/3">
              <span className="text-sm">←</span> Return
            </button>
          </div>
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] mx-auto mb-6">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-3">
              Forgot Password?
            </h1>
            <p className="text-sm text-[#57534E] leading-relaxed max-w-sm mx-auto">
              Enter your email address and we&apos;ll send you a link to reset your password.
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
                  Send Reset Link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-sm text-[#57534E]">
              Remember your password?{' '}
              <button
                onClick={() => navigate('/auth/sign-in')}
                className="text-[#A6852F] hover:text-[#8B6F1F] font-medium transition-colors duration-200 cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </motion.div>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
        </div>
      </main>
    </div>
  );
}
