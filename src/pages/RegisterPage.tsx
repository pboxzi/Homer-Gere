import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, Upload, CheckCircle,
  Crown, Sparkles, UserPlus, Mail, Globe, Clock, Bell,
} from 'lucide-react';
import {
  REGISTER_CONFIG, COUNTRIES, LANGUAGES, TIMEZONES,
} from '../data/registerData';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';

type Step = 'form' | 'pending' | 'welcome';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
  profilePhoto: File | null;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingPreferences: boolean;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeCommunity: boolean;
}

const INITIAL_FORM: FormData = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  country: '',
  dateOfBirth: '',
  password: '',
  confirmPassword: '',
  profilePhoto: null,
  language: 'English',
  timezone: 'Pacific Time (PT)',
  emailNotifications: true,
  smsNotifications: false,
  marketingPreferences: false,
  agreeTerms: false,
  agreePrivacy: false,
  agreeCommunity: false,
};

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

export default function RegisterPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { signUp, isAuthenticated, user } = useAuth();
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const passwordStrength = getPasswordStrength(formData.password);

  const update = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'First name is required';
    if (!formData.lastName.trim()) e.lastName = 'Last name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email address';
    if (!formData.country) e.country = 'Country is required';
    if (!formData.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < REGISTER_CONFIG.passwordPolicy.minLength) {
      e.password = `Password must be at least ${REGISTER_CONFIG.passwordPolicy.minLength} characters`;
    }
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) e.agreeTerms = 'You must agree to the Terms of Service';
    if (!formData.agreePrivacy) e.agreePrivacy = 'You must agree to the Privacy Policy';
    if (!formData.agreeCommunity) e.agreeCommunity = 'You must agree to the Community Guidelines';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    const result = await signUp({ email: formData.email, password: formData.password, firstName: formData.firstName, lastName: formData.lastName });
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
        <motion.div
          className="w-full max-w-lg text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-20 h-20 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mx-auto mb-8">
            <Clock className="w-10 h-10 text-[#F59E0B]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-4">
            Application Submitted
          </h1>
          <p className="text-[#57534E] leading-relaxed mb-4 max-w-md mx-auto">
            Thank you for applying to join the official Homer Gere platform.
            Your application is now <span className="font-medium text-[#F59E0B]">pending review</span> by our admin team.
          </p>
          <p className="text-sm text-[#57534E]/70 leading-relaxed mb-10 max-w-md mx-auto">
            You will receive an email at <span className="font-medium text-[#1C1917]">{formData.email}</span> once your application has been reviewed. This typically takes 1-2 business days.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              Return to Home
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center gap-2 border border-[#E8E5DF]/60 hover:bg-[#F3F1ED]/60 text-[#57534E] font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased flex items-center justify-center px-4">
        <SEO title="Register" />
        <motion.div
          className="w-full max-w-lg text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-20 h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-[#16A34A]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-4">
            Welcome to the Official Homer Gere Platform
          </h1>
          <p className="text-[#57534E] leading-relaxed mb-10 max-w-md mx-auto">
            Your account has been created successfully.
            {REGISTER_CONFIG.emailVerificationRequired && (
              <> Please check your email at <span className="font-medium text-[#1C1917]">{formData.email}</span> to verify your account.</>
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-sm mx-auto">
            <button
              onClick={() => navigate('/membership')}
              className="inline-flex items-center justify-center gap-2 bg-[#A6852F] hover:bg-[#8B6F1F] active:scale-95 text-white font-medium text-sm px-5 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              Explore Membership
            </button>
            <button
              onClick={() => navigate('/experiences')}
              className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-medium text-sm px-5 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Browse Experiences
            </button>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 border border-[#E8E5DF]/60 hover:bg-[#F3F1ED]/60 text-[#57534E] font-medium text-sm px-5 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              Continue as Guest
            </button>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 border border-[#E8E5DF]/60 hover:bg-[#F3F1ED]/60 text-[#57534E] font-medium text-sm px-5 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Complete Profile
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title="Register" />
      {/* Header */}
      <header className="px-5 sm:px-8 py-5">
        <button
          onClick={() => navigate('/login')}
          className="group flex flex-col text-left focus:outline-none cursor-pointer"
        >
          <span className="font-editorial tracking-[0.06em] text-[#1C1917] group-hover:text-[#A6852F] transition-all duration-500 uppercase leading-none text-lg sm:text-xl">
            Homer Gere
          </span>
          <span className="font-medium tracking-[0.35em] text-[#A6852F]/70 uppercase text-[11px] sm:text-xs mt-1">
            Official Website
          </span>
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Hero */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-3">
            Create Your Official Account
          </h1>
          <p className="text-sm text-[#57534E] leading-relaxed max-w-lg mx-auto">
            Join the official Homer Gere platform to access exclusive features, memberships, experiences, and personalized services.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
          {/* Section 1: Personal Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-lg font-editorial text-[#1C1917] mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] text-xs font-medium">1</span>
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">First Name *</label>
                  <input type="text" value={formData.firstName} onChange={(e) => update('firstName', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" placeholder="First name" />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Last Name *</label>
                  <input type="text" value={formData.lastName} onChange={(e) => update('lastName', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" placeholder="Last name" />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Username {REGISTER_CONFIG.usernameRequired ? '*' : '(optional)'}</label>
                <input type="text" value={formData.username} onChange={(e) => update('username', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" placeholder="Choose a username" />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Email Address *</label>
                <input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" placeholder="you@example.com" autoComplete="email" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Mobile {REGISTER_CONFIG.phoneRequired ? '*' : '(optional)'}</label>
                  <input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Country *</label>
                  <select value={formData.country} onChange={(e) => update('country', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 appearance-none">
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Date of Birth *</label>
                <input type="date" value={formData.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" />
                {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
              </div>
            </div>
          </motion.section>

          {/* Section 2: Password */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-lg font-editorial text-[#1C1917] mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] text-xs font-medium">2</span>
              Set Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => update('password', e.target.value)} className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" placeholder="Create a password" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#1C1917] transition-colors duration-200 cursor-pointer p-2.5" tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 rounded-full bg-[#E8E5DF]/60 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(passwordStrength.score / 5) * 100}%`, backgroundColor: passwordStrength.color }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Confirm Password *</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" placeholder="Confirm your password" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#1C1917] transition-colors duration-200 cursor-pointer p-2.5" tabIndex={-1}>
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-xs text-[#16A34A] mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passwords match</p>
                )}
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </motion.section>

          {/* Section 3: Profile Photo */}
          {REGISTER_CONFIG.profilePhotoEnabled && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-lg font-editorial text-[#1C1917] mb-2 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] text-xs font-medium">3</span>
                Profile Photo
              </h2>
              <p className="text-xs text-[#57534E] mb-4 ml-9">Optional — you can skip and add later from your profile.</p>
              <div className="ml-9">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => update('profilePhoto', e.target.files?.[0] || null)} />
                {formData.profilePhoto ? (
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#F3F1ED] flex items-center justify-center overflow-hidden">
                      <img src={URL.createObjectURL(formData.profilePhoto)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1C1917]">{formData.profilePhoto.name}</p>
                      <button type="button" onClick={() => update('profilePhoto', null)} className="text-xs text-[#A6852F] hover:text-[#8B6F1F] transition-colors duration-200 cursor-pointer">Remove</button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-dashed border-[#E8E5DF] hover:border-[#A6852F]/40 bg-[#F3F1ED]/30 hover:bg-[#F3F1ED]/60 transition-all duration-300 cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] group-hover:bg-[#A6852F] group-hover:text-white transition-all duration-500">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[#1C1917]">Upload a photo</p>
                      <p className="text-xs text-[#57534E]">JPG, PNG or WebP. Max 5MB.</p>
                    </div>
                  </button>
                )}
              </div>
            </motion.section>
          )}

          {/* Section 4: Account Preferences */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-lg font-editorial text-[#1C1917] mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] text-xs font-medium">4</span>
              Account Preferences
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2 flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Preferred Language
                  </label>
                  <select value={formData.language} onChange={(e) => update('language', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 appearance-none">
                    {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Time Zone
                  </label>
                  <select value={formData.timezone} onChange={(e) => update('timezone', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 appearance-none">
                    {TIMEZONES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.emailNotifications} onChange={(e) => update('emailNotifications', e.target.checked)} className="w-4 h-4 rounded border-[#E8E5DF] text-[#A6852F] focus:ring-[#A6852F]/30 accent-[#A6852F]" />
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#57534E]" />
                    <span className="text-sm text-[#57534E]">Email notifications</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.smsNotifications} onChange={(e) => update('smsNotifications', e.target.checked)} className="w-4 h-4 rounded border-[#E8E5DF] text-[#A6852F] focus:ring-[#A6852F]/30 accent-[#A6852F]" />
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-[#57534E]" />
                    <span className="text-sm text-[#57534E]">SMS notifications (optional)</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.marketingPreferences} onChange={(e) => update('marketingPreferences', e.target.checked)} className="w-4 h-4 rounded border-[#E8E5DF] text-[#A6852F] focus:ring-[#A6852F]/30 accent-[#A6852F]" />
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#57534E]" />
                    <span className="text-sm text-[#57534E]">Marketing and promotional emails</span>
                  </div>
                </label>
              </div>
            </div>
          </motion.section>

          {/* Section 5: Terms */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-lg font-editorial text-[#1C1917] mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] text-xs font-medium">5</span>
              Terms & Agreements
            </h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer py-2">
                <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => update('agreeTerms', e.target.checked)} className="w-4 h-4 rounded border-[#E8E5DF] text-[#A6852F] focus:ring-[#A6852F]/30 accent-[#A6852F] mt-0.5" />
                <span className="text-sm text-[#57534E] leading-relaxed">I agree to the <button type="button" className="text-[#A6852F] hover:text-[#8B6F1F] font-medium cursor-pointer">Terms of Service</button> *</span>
              </label>
              {errors.agreeTerms && <p className="text-xs text-red-500 ml-7">{errors.agreeTerms}</p>}

              <label className="flex items-start gap-3 cursor-pointer py-2">
                <input type="checkbox" checked={formData.agreePrivacy} onChange={(e) => update('agreePrivacy', e.target.checked)} className="w-4 h-4 rounded border-[#E8E5DF] text-[#A6852F] focus:ring-[#A6852F]/30 accent-[#A6852F] mt-0.5" />
                <span className="text-sm text-[#57534E] leading-relaxed">I agree to the <button type="button" className="text-[#A6852F] hover:text-[#8B6F1F] font-medium cursor-pointer">Privacy Policy</button> *</span>
              </label>
              {errors.agreePrivacy && <p className="text-xs text-red-500 ml-7">{errors.agreePrivacy}</p>}

              <label className="flex items-start gap-3 cursor-pointer py-2">
                <input type="checkbox" checked={formData.agreeCommunity} onChange={(e) => update('agreeCommunity', e.target.checked)} className="w-4 h-4 rounded border-[#E8E5DF] text-[#A6852F] focus:ring-[#A6852F]/30 accent-[#A6852F] mt-0.5" />
                <span className="text-sm text-[#57534E] leading-relaxed">I agree to the <button type="button" className="text-[#A6852F] hover:text-[#8B6F1F] font-medium cursor-pointer">Community Guidelines</button> *</span>
              </label>
              {errors.agreeCommunity && <p className="text-xs text-red-500 ml-7">{errors.agreeCommunity}</p>}
            </div>
          </motion.section>

          {/* Submit */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {error && (
              <p className="text-sm text-red-500 w-full">{error}</p>
            )}
            <button type="submit" disabled={loading} className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#1C1917] hover:bg-[#292524] disabled:bg-[#57534E] active:scale-95 text-white font-medium text-sm px-8 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#1C1917]/10 focus:outline-none cursor-pointer disabled:cursor-not-allowed">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-xs text-[#57534E]">
              Already have an account?{' '}
              <button type="button" onClick={() => navigate('/login')} className="text-[#A6852F] hover:text-[#8B6F1F] font-medium transition-colors duration-200 cursor-pointer">
                Sign In
              </button>
            </p>
          </motion.div>
        </form>

        {/* Back to Homepage */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#57534E]/70 hover:text-[#A6852F] transition-colors duration-300 cursor-pointer"
          >
            ← Back to Homer Gere
          </button>
        </motion.div>
      </main>
    </div>
  );
}
