import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, Phone, Mail, Send as Telegram, MessageCircle, CheckCircle } from 'lucide-react';
import { CHAT_SETTINGS, ENQUIRY_TYPES } from '../../data/chatSettings';

interface BusinessChatProps {
  onBack: () => void;
  onComplete: (data: { fullName: string; email: string; company: string; enquiryType: string; message: string; method: string }) => void;
}

export const BusinessChat: React.FC<BusinessChatProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<'form' | 'methods'>('form');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    enquiryType: '',
    message: '',
  });

  const settings = CHAT_SETTINGS.businessChat;

  const isFormValid = formData.fullName.trim() !== '' && formData.email.trim() !== '' && formData.enquiryType !== '' && formData.message.trim() !== '';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.enquiryType) newErrors.enquiryType = 'Enquiry type is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFormSubmit = () => {
    if (loading) return;
    if (validate()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('methods');
      }, 1500);
    }
  };

  const handleMethodSelect = (method: string) => {
    onComplete({ ...formData, method });
  };

  const enabledMethods = [
    settings.whatsappEnabled && { id: 'whatsapp', label: 'WhatsApp', icon: Phone, color: '#25D366', description: 'Send via WhatsApp to management' },
    settings.emailEnabled && { id: 'email', label: 'Email', icon: Mail, color: '#A6852F', description: 'Send via email to management' },
    settings.telegramEnabled && { id: 'telegram', label: 'Telegram', icon: Telegram, color: '#0088CC', description: 'Send via Telegram to management' },
    settings.websiteFormEnabled && { id: 'website', label: 'Website Form', icon: MessageCircle, color: '#1C1917', description: 'Submit through the website' },
  ].filter(Boolean) as Array<{ id: string; label: string; icon: React.FC<{ className?: string; style?: React.CSSProperties }>; color: string; description: string }>;

  if (step === 'methods') {
    return (
      <section className="relative min-h-screen bg-[#FAF9F7] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1917]/3 via-transparent to-[#FAF9F7]" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <button onClick={() => setStep('form')} className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#A6852F] transition-colors duration-300 mb-8 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Back to Form
            </button>

            <h2 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight mb-3">
              Choose how to send
            </h2>
            <p className="text-sm text-[#57534E] mb-8">
              Select your preferred communication method.
            </p>

            <div className="space-y-3">
              {enabledMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 transition-all duration-300 text-left cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${method.color}12` }}>
                    <method.icon className="w-5 h-5" style={{ color: method.color }} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-[#1C1917] block">{method.label}</span>
                    <span className="text-xs text-[#57534E]">{method.description}</span>
                  </div>
                  <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ))}
            </div>

            <p className="text-[11px] text-[#57534E] mt-6 leading-relaxed">
              All business enquiries are routed exclusively to Homer's management team.
              You will receive a response within 5–10 business days.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-[#FAF9F7] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1C1917]/3 via-transparent to-[#FAF9F7]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#A6852F] transition-colors duration-300 mb-8 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h2 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight mb-3">
            Business Chat
          </h2>
          <p className="text-sm text-[#57534E] mb-8">
            Submit a professional enquiry. All messages are routed to Homer's management team.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Full Name *</label>
              <input type="text" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" placeholder="Enter your full name" />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Email *</label>
              <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" placeholder="your@company.com" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Company / Organization</label>
              <input type="text" value={formData.company} onChange={(e) => updateField('company', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" placeholder="Company or organization name" />
              {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Enquiry Type *</label>
              <select value={formData.enquiryType} onChange={(e) => updateField('enquiryType', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 appearance-none">
                <option value="">Select enquiry type</option>
                {ENQUIRY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.enquiryType && <p className="text-xs text-red-500 mt-1">{errors.enquiryType}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Message *</label>
              <textarea value={formData.message} onChange={(e) => updateField('message', e.target.value)} rows={5} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 resize-none" placeholder="Describe your enquiry..." />
              {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
            </div>
          </div>

          <button onClick={handleFormSubmit} disabled={loading || !isFormValid} className="mt-6 inline-flex items-center justify-center gap-2.5 bg-[#1C1917] hover:bg-[#292524] disabled:bg-[#E8E5DF] disabled:text-[#57534E] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#1C1917]/10 focus:outline-none cursor-pointer disabled:cursor-not-allowed">
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </section>
  );
};
