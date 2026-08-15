import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowRight, CheckCircle, Crown, Shield } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import { COUNTRIES } from '../../data/registerData';

type Step = 'form' | 'pending';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Weak', color: '#DC2626' };
  if (score <= 2) return { score, label: 'Fair', color: '#F59E0B' };
  if (score <= 3) return { score, label: 'Good', color: '#3B82F6' };
  if (score <= 4) return { score, label: 'Strong', color: '#16A34A' };
  return { score, label: 'Very Strong', color: '#16A34A' };
}

export default function MemberRegister() {
  const navigate = useNavigate();
  const { signUp, isAuthenticated, user } = useAuth();
  const [step, setStep] = useState<Step>('form');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'super_admin') navigate('/admin');
      else if (user.role === 'pending') navigate('/application-status');
      else navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const passwordStrength = getPasswordStrength(password);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'Required';
    if (!lastName.trim()) e.lastName = 'Required';
    if (!email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email';
    if (!password) e.password = 'Required';
    else if (password.length < 8) e.password = 'Min 8 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) e.agreeTerms = 'You must agree';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    const result = await signUp({ email, password, firstName, lastName, country });
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      setStep('pending');
    }
  };

  if (step === 'pending') {
    return (
      <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased flex items-center justify-center px-4">
        <SEO title="Application Submitted" />
        <motion.div className="w-full max-w-sm text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-16 h-16 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-[#F59E0B]" />
          </div>
          <h1 className="text-2xl font-editorial text-[#1C1917] tracking-tight mb-3">Application Submitted</h1>
          <p className="text-sm text-[#57534E] leading-relaxed mb-6">
            Your application is <span className="font-medium text-[#F59E0B]">pending review</span>. We'll email you at <span className="font-medium text-[#1C1917]">{email}</span> once approved.
          </p>
          <div className="flex flex-col gap-2.5">
            <button onClick={() => navigate('/')} className="w-full py-2.5 bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-medium rounded-xl transition-all cursor-pointer">Return Home</button>
            <button onClick={() => navigate('/auth/sign-in')} className="w-full py-2.5 border border-[#E8E5DF]/60 hover:bg-[#F3F1ED]/60 text-[#57534E] text-sm font-medium rounded-xl transition-all cursor-pointer">Sign In</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased relative overflow-hidden">
      <SEO title="Register" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-20%] w-[70vw] h-[70vw] rounded-full bg-[#A6852F]/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-[#D4AF37]/[0.05] blur-[100px]" />
      </div>
      <header className="relative z-10 px-6 py-5">
        <button onClick={() => navigate('/')} className="group flex flex-col text-left focus:outline-none cursor-pointer">
          <span className="font-editorial tracking-[0.06em] text-[#1C1917] group-hover:text-[#A6852F] transition-all duration-500 uppercase text-lg">Homer Gere</span>
          <span className="font-medium tracking-[0.35em] text-[#A6852F]/70 uppercase text-[10px] mt-0.5">Official Website</span>
        </button>
      </header>

      <main className="relative z-10 max-w-md mx-auto px-5 pb-16 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E5DF]/80 bg-white/60 hover:bg-[#F3F1ED] text-[#57534E] hover:text-[#A6852F] transition-all text-xs font-medium cursor-pointer shadow-sm shadow-black/3">
            <span className="text-sm">←</span> Return
          </button>
        </div>
        <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight mb-2">Create Your Account</h1>
          <p className="text-xs sm:text-sm text-[#57534E]">Join the official Homer Gere platform.</p>
        </motion.div>

        <motion.div
          className="relative rounded-2xl bg-white/80 backdrop-blur-xl border border-white/[0.5] p-6 shadow-[0_0_80px_rgba(166,133,47,0.15),0_0_160px_rgba(166,133,47,0.08)]"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4AF37]/[0.04] via-transparent to-[#A6852F]/[0.03] pointer-events-none" />
          <div className="absolute top-[-1px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
          <div className="absolute left-[-1px] top-[15%] bottom-[15%] w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />
          <div className="absolute right-[-1px] top-[15%] bottom-[15%] w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          {/* Name */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
            <div>
              <label className="block text-[11px] font-semibold text-[#57534E] uppercase tracking-wider mb-1.5">First Name *</label>
              <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); setErrors(p => { const n = { ...p }; delete n.firstName; return n; }); }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF]/80 bg-white/60 text-[13px] text-[#1C1917] placeholder:text-[#57534E]/40 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/25 focus:border-[#A6852F]/50 transition-all shadow-[0_0_20px_rgba(166,133,47,0.08)]" placeholder="First name" />
              {errors.firstName && <p className="text-[10px] text-red-500 mt-0.5">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#57534E] uppercase tracking-wider mb-1.5">Last Name *</label>
              <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); setErrors(p => { const n = { ...p }; delete n.lastName; return n; }); }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF]/80 bg-white/60 text-[13px] text-[#1C1917] placeholder:text-[#57534E]/40 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/25 focus:border-[#A6852F]/50 transition-all shadow-[0_0_20px_rgba(166,133,47,0.08)]" placeholder="Last name" />
              {errors.lastName && <p className="text-[10px] text-red-500 mt-0.5">{errors.lastName}</p>}
            </div>
          </motion.div>

          {/* Email */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <label className="block text-[11px] font-semibold text-[#57534E] uppercase tracking-wider mb-1.5">Email Address *</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(p => { const n = { ...p }; delete n.email; return n; }); }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF]/80 bg-white/60 text-[13px] text-[#1C1917] placeholder:text-[#57534E]/40 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/25 focus:border-[#A6852F]/50 transition-all shadow-[0_0_20px_rgba(166,133,47,0.08)]" placeholder="you@example.com" autoComplete="email" />
            {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
          </motion.div>

          {/* Country */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            <label className="block text-[11px] font-semibold text-[#57534E] uppercase tracking-wider mb-1.5">Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DF]/80 bg-white/60 text-[13px] text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/25 focus:border-[#A6852F]/50 transition-all appearance-none cursor-pointer shadow-[0_0_20px_rgba(166,133,47,0.08)]">
              <option value="">Select country</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </motion.div>

          {/* Password */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div>
              <label className="block text-[11px] font-semibold text-[#57534E] uppercase tracking-wider mb-1.5">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setErrors(p => { const n = { ...p }; delete n.password; return n; }); }}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#E8E5DF]/80 bg-white/60 text-[13px] text-[#1C1917] placeholder:text-[#57534E]/40 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/25 focus:border-[#A6852F]/50 transition-all shadow-[0_0_20px_rgba(166,133,47,0.08)]" placeholder="Create password" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#1C1917] cursor-pointer p-1" tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {password && (
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="flex-1 h-1 rounded-full bg-[#E8E5DF]/60 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(passwordStrength.score / 5) * 100}%`, backgroundColor: passwordStrength.color }} />
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                </div>
              )}
              {errors.password && <p className="text-[10px] text-red-500 mt-0.5">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#57534E] uppercase tracking-wider mb-1.5">Confirm *</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => { const n = { ...p }; delete n.confirmPassword; return n; }); }}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#E8E5DF]/80 bg-white/60 text-[13px] text-[#1C1917] placeholder:text-[#57534E]/40 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/25 focus:border-[#A6852F]/50 transition-all shadow-[0_0_20px_rgba(166,133,47,0.08)]" placeholder="Confirm password" autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#1C1917] cursor-pointer p-1" tabIndex={-1}>
                  {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="text-[10px] text-[#16A34A] mt-0.5 flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Match</p>
              )}
              {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-0.5">{errors.confirmPassword}</p>}
            </div>
          </motion.div>

          {/* Terms */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => { setAgreeTerms(e.target.checked); setErrors(p => { const n = { ...p }; delete n.agreeTerms; return n; }); }}
                className="w-3.5 h-3.5 rounded border-[#E8E5DF] text-[#A6852F] focus:ring-[#A6852F]/30 accent-[#A6852F] mt-0.5 shrink-0" />
              <span className="text-xs text-[#57534E] leading-relaxed">I agree to the <button type="button" onClick={() => navigate('/terms')} className="text-[#A6852F] hover:text-[#8B6F1F] font-medium cursor-pointer">Terms of Service</button> and <button type="button" onClick={() => navigate('/privacy')} className="text-[#A6852F] hover:text-[#8B6F1F] font-medium cursor-pointer">Privacy Policy</button> *</span>
            </label>
            {errors.agreeTerms && <p className="text-[10px] text-red-500 ml-6">{errors.agreeTerms}</p>}
          </motion.div>

          {/* Submit */}
          <motion.div className="space-y-2.5 pt-1" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#1C1917] hover:bg-[#292524] disabled:bg-[#57534E] text-white text-[13px] font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(166,133,47,0.3),0_0_60px_rgba(166,133,47,0.12)] hover:shadow-[0_0_40px_rgba(166,133,47,0.45),0_0_80px_rgba(166,133,47,0.2)] active:scale-[0.98]">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
            <p className="text-xs text-[#57534E] text-center">
              Already have an account?{' '}
              <button type="button" onClick={() => navigate('/auth/sign-in')} className="text-[#A6852F] hover:text-[#8B6F1F] font-medium cursor-pointer">Sign In</button>
            </p>
          </motion.div>
        </form>

        </motion.div>
      </main>
    </div>
  );
}
