import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Send, CheckCircle, Paperclip, ArrowLeft } from 'lucide-react';
import {
  CONTACT_DEPARTMENTS,
  CONTACT_SUBJECTS,
  COUNTRIES,
  ContactFormData,
} from '../../data/contactData';

interface ContactFormProps {
  preselectedDepartment?: string;
  onBack?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  preselectedDepartment,
  onBack,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    country: '',
    subject: '',
    department: preselectedDepartment || '',
    message: '',
    attachment: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (validate()) {
      setLoading(true);
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
      }, 1500);
    }
  };

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  if (submitted) {
    return (
      <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-20 h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-[#16A34A]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-4">
              Message Sent
            </h2>
            <p className="text-[#57534E] leading-relaxed mb-8 max-w-md mx-auto">
              Thank you for reaching out. Your enquiry has been submitted to the{' '}
              <span className="font-medium text-[#1C1917]">
                {CONTACT_DEPARTMENTS.find((d) => d.id === formData.department)?.name}
              </span>{' '}
              team. You will receive a response at <span className="font-medium text-[#1C1917]">{formData.email}</span>{' '}
              within their typical response time.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: '',
                  email: '',
                  country: '',
                  subject: '',
                  department: preselectedDepartment || '',
                  message: '',
                  attachment: null,
                });
              }}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors duration-300 cursor-pointer"
            >
              Send another message
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="contact-form" className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#A6852F] transition-colors duration-300 mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Directory
            </button>
          )}
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Send a Message
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mt-3">
            Contact Form
          </h2>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300"
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300"
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Country */}
          <div>
            <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">
              Country *
            </label>
            <select
              value={formData.country}
              onChange={(e) => updateField('country', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 appearance-none"
            >
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
          </div>

          {/* Subject + Department row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">
                Subject *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 appearance-none"
              >
                <option value="">Select subject</option>
                {CONTACT_SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => updateField('department', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 appearance-none"
              >
                <option value="">Select department</option>
                {CONTACT_DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => updateField('message', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 resize-none"
              placeholder="Describe your enquiry..."
            />
            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">
              Attachment (optional)
            </label>
            <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#57534E] cursor-pointer hover:bg-[#F3F1ED] transition-all duration-300">
              <Paperclip className="w-4 h-4 text-[#A6852F]/60" />
              <span>{formData.attachment ? formData.attachment.name : 'Choose a file (max 10MB)'}</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData((prev) => ({ ...prev, attachment: file }));
                }}
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2.5 bg-[#1C1917] hover:bg-[#292524] disabled:bg-[#57534E]/40 disabled:cursor-not-allowed active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#1C1917]/10 focus:outline-none cursor-pointer"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Send className="w-4 h-4" />
            )}
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      </div>
    </section>
  );
};
