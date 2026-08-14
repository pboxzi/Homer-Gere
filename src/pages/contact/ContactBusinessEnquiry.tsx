import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Send, CheckCircle, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { ENQUIRY_TYPES } from '../../data/chatSettings';
import { sanitizeInput, sanitizeEmail } from '../../lib/security';
import { businessEnquiriesRepository } from '../../lib/repositories';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  fullName?: string;
  email?: string;
  enquiryType?: string;
  message?: string;
}

export const ContactBusinessEnquiry: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    enquiryType: '',
    message: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors = { ...errors };
    switch (field) {
      case 'fullName':
        newErrors.fullName = formData.fullName.trim() ? undefined : 'Full name is required';
        break;
      case 'email':
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!EMAIL_REGEX.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          newErrors.email = undefined;
        }
        break;
      case 'enquiryType':
        newErrors.enquiryType = formData.enquiryType ? undefined : 'Please select an enquiry type';
        break;
      case 'message':
        newErrors.message = formData.message.trim() ? undefined : 'Message is required';
        break;
    }
    setErrors(newErrors);
    return !newErrors[field as keyof FormErrors];
  };

  const validateAll = (): boolean => {
    const fields = ['fullName', 'email', 'enquiryType', 'message'];
    const allTouched: Record<string, boolean> = {};
    fields.forEach((f) => { allTouched[f] = true; });
    setTouched(allTouched);
    return fields.every((f) => validateField(f));
  };

  const isFormValid = formData.fullName.trim() !== '' && EMAIL_REGEX.test(formData.email) && formData.enquiryType !== '' && formData.message.trim() !== '';

  const handleSubmit = async () => {
    if (!validateAll() || !isFormValid || isSubmitting) return;
    if (!sanitizeEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    setIsSubmitting(true);
    try {
      await businessEnquiriesRepository.create({
        full_name: sanitizeInput(formData.fullName),
        email: sanitizeInput(formData.email),
        phone: null,
        company: sanitizeInput(formData.company) || null,
        enquiry_type: formData.enquiryType,
        subject: `Business Enquiry from ${sanitizeInput(formData.fullName)}`,
        message: sanitizeInput(formData.message),
        status: 'open',
        user_id: null,
      });

      const subject = encodeURIComponent(`Business Enquiry from ${sanitizeInput(formData.fullName)}`);
      const body = encodeURIComponent(
        `Name: ${sanitizeInput(formData.fullName)}\nEmail: ${sanitizeInput(formData.email)}\nCompany: ${sanitizeInput(formData.company)}\nEnquiry Type: ${formData.enquiryType}\n\nMessage:\n${sanitizeInput(formData.message)}`
      );
      window.open(`mailto:management@homergere.com?subject=${subject}&body=${body}`, '_blank');

      setSubmitted(true);
    } catch {
      setErrors({ message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ fullName: '', email: '', company: '', enquiryType: '', message: '' });
    setErrors({});
    setTouched({});
  };

  if (submitted) {
    return (
      <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="w-20 h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-[#16A34A]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-4">Enquiry Sent</h2>
            <p className="text-[#57534E] leading-relaxed mb-8 max-w-md mx-auto">
              Your enquiry has been recorded. Your email client has also opened with your message.
              Homer's management team will respond within 5–10 business days.
            </p>
            <button onClick={handleReset} className="inline-flex items-center gap-2 text-sm font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer">
              Send another enquiry
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  const renderError = (field: keyof FormErrors) => {
    if (!touched[field] || !errors[field]) return null;
    return (
      <p className="text-[11px] text-[#DC2626] mt-1.5 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {errors[field]}
      </p>
    );
  };

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Business Enquiries
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mt-3 mb-3">
            Contact Management
          </h2>
          <p className="text-sm text-[#57534E] mb-10 leading-relaxed">
            Submit a professional enquiry. All messages are routed directly to Homer's management team.
          </p>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 ${touched.fullName && errors.fullName ? 'ring-2 ring-[#DC2626]/30' : ''}`}
                  placeholder="Your full name"
                />
                {renderError('fullName')}
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 ${touched.email && errors.email ? 'ring-2 ring-[#DC2626]/30' : ''}`}
                  placeholder="you@company.com"
                />
                {renderError('email')}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Company</label>
                <input type="text" value={formData.company} onChange={(e) => updateField('company', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" placeholder="Company name" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Enquiry Type *</label>
                <select
                  value={formData.enquiryType}
                  onChange={(e) => updateField('enquiryType', e.target.value)}
                  onBlur={() => handleBlur('enquiryType')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 appearance-none ${touched.enquiryType && errors.enquiryType ? 'ring-2 ring-[#DC2626]/30' : ''}`}
                >
                  <option value="">Select type</option>
                  {ENQUIRY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {renderError('enquiryType')}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value)}
                onBlur={() => handleBlur('message')}
                rows={5}
                className={`w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 resize-none ${touched.message && errors.message ? 'ring-2 ring-[#DC2626]/30' : ''}`}
                placeholder="Describe your enquiry..."
              />
              {renderError('message')}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="mt-6 inline-flex items-center justify-center gap-2.5 bg-[#1C1917] hover:bg-[#292524] disabled:bg-[#E8E5DF] disabled:text-[#57534E] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Enquiry
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-[#57534E] mt-6 leading-relaxed">
            Response times vary by department. Most enquiries receive a reply within 5–10 business days.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
