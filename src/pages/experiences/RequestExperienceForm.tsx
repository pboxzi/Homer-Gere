import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Check, ChevronRight, Send } from 'lucide-react';
import { EXPERIENCES } from '../../data/content';
import { ExperienceCategory, ExperienceRequest, Experience } from '../../types';

interface RequestExperienceFormProps {
  preselectedExperience?: Experience | null;
  onClose: () => void;
}

const STEPS = [
  { id: 1, title: 'Experience Type', description: 'Choose your experience' },
  { id: 2, title: 'Your Details', description: 'Contact information' },
  { id: 3, title: 'Event Information', description: 'About your event' },
  { id: 4, title: 'Purpose', description: 'Tell us more' },
  { id: 5, title: 'Review & Submit', description: 'Confirm your request' },
];

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'Japan', 'Brazil', 'India', 'Mexico', 'Italy', 'Spain', 'South Korea',
  'Netherlands', 'Sweden', 'Other',
];

export const RequestExperienceForm: React.FC<RequestExperienceFormProps> = ({
  preselectedExperience,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ExperienceRequest>({
    experienceType: (preselectedExperience?.type as ExperienceCategory) || '',
    fullName: '',
    email: '',
    phone: '',
    country: '',
    organization: '',
    eventDate: '',
    eventLocation: '',
    budget: '',
    purpose: '',
    additionalDetails: '',
  });

  const updateField = (field: keyof ExperienceRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1: return formData.experienceType !== '';
      case 2: return formData.fullName.trim() !== '' && formData.email.trim() !== '' && formData.phone.trim() !== '' && formData.country !== '';
      case 3: return formData.eventDate !== '' && formData.eventLocation.trim() !== '';
      case 4: return formData.purpose.trim() !== '';
      case 5: return true;
      default: return false;
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getSelectedExperience = () => {
    return EXPERIENCES.find((e) => e.type === formData.experienceType);
  };

  if (submitted) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-md bg-[#FAF9F7] rounded-[2rem] p-10 text-center shadow-2xl"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-[#16A34A]" />
          </div>
          <h2 className="text-2xl font-editorial text-[#1C1917] tracking-tight mb-3">
            Request Submitted
          </h2>
          <p className="text-sm text-[#57534E] leading-relaxed mb-8">
            Thank you, {formData.fullName}. Your experience request has been received.
            Homer's management team will review your request and respond within 5–10 business days.
          </p>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white font-medium text-sm px-8 py-3.5 rounded-2xl transition-all duration-300 focus:outline-none cursor-pointer"
          >
            Done
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-xl max-h-[85vh] bg-[#FAF9F7] rounded-[2rem] overflow-hidden shadow-2xl"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#E8E5DF]/60">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-editorial text-[#1C1917] tracking-tight">
              Request an Experience
            </h2>
            <button
              onClick={onClose}
              className="text-sm text-[#57534E] hover:text-[#1C1917] transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-all duration-300 ${
                      currentStep > step.id
                        ? 'bg-[#16A34A] text-white'
                        : currentStep === step.id
                        ? 'bg-[#A6852F] text-white'
                        : 'bg-[#E8E5DF] text-[#57534E]'
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-3.5 h-3.5" /> : step.id}
                  </div>
                  <span className={`hidden sm:block text-[11px] font-medium transition-colors duration-300 ${
                    currentStep === step.id ? 'text-[#1C1917]' : 'text-[#57534E]'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-[#D1D5DB] hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-180px)] px-8 py-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Experience Type */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-editorial text-[#1C1917] mb-2">Select experience type</h3>
                <p className="text-sm text-[#57534E] mb-6">Choose the type of experience you're requesting.</p>
                <div className="grid grid-cols-2 gap-3">
                  {EXPERIENCES.map((exp) => (
                    <button
                      key={exp.type}
                      onClick={() => updateField('experienceType', exp.type)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-300 focus:outline-none cursor-pointer ${
                        formData.experienceType === exp.type
                          ? 'border-[#A6852F] bg-[#A6852F]/5 shadow-sm'
                          : 'border-[#E8E5DF]/60 bg-white hover:border-[#A6852F]/30'
                      }`}
                    >
                      <span className={`text-sm font-medium block ${
                        formData.experienceType === exp.type ? 'text-[#A6852F]' : 'text-[#1C1917]'
                      }`}>
                        {exp.title}
                      </span>
                      <span className="text-[11px] text-[#57534E] mt-1 block line-clamp-1">
                        {exp.description}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Your Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-editorial text-[#1C1917] mb-2">Your details</h3>
                <p className="text-sm text-[#57534E] mb-6">Provide your contact information.</p>

                <div>
                  <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F] focus:ring-1 focus:ring-[#A6852F]/20 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F] focus:ring-1 focus:ring-[#A6852F]/20 transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F] focus:ring-1 focus:ring-[#A6852F]/20 transition-all duration-300"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Country *</label>
                  <select
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F] focus:ring-1 focus:ring-[#A6852F]/20 transition-all duration-300 appearance-none"
                  >
                    <option value="">Select your country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 3: Event Information */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-editorial text-[#1C1917] mb-2">Event information</h3>
                <p className="text-sm text-[#57534E] mb-6">Tell us about your event or occasion.</p>

                <div>
                  <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Organization (optional)</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => updateField('organization', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F] focus:ring-1 focus:ring-[#A6852F]/20 transition-all duration-300"
                    placeholder="Company or organization name"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Event Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => updateField('eventDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F] focus:ring-1 focus:ring-[#A6852F]/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Event Location *</label>
                  <input
                    type="text"
                    value={formData.eventLocation}
                    onChange={(e) => updateField('eventLocation', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F] focus:ring-1 focus:ring-[#A6852F]/20 transition-all duration-300"
                    placeholder="City, State / Country"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Budget (optional)</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => updateField('budget', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F] focus:ring-1 focus:ring-[#A6852F]/20 transition-all duration-300"
                    placeholder="Estimated budget range"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Purpose */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-editorial text-[#1C1917] mb-2">Purpose of request</h3>
                <p className="text-sm text-[#57534E] mb-6">Help us understand your request better.</p>

                <div>
                  <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Purpose *</label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => updateField('purpose', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F] focus:ring-1 focus:ring-[#A6852F]/20 transition-all duration-300 resize-none"
                    placeholder="Describe the purpose of your request..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Additional Details (optional)</label>
                  <textarea
                    value={formData.additionalDetails}
                    onChange={(e) => updateField('additionalDetails', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F] focus:ring-1 focus:ring-[#A6852F]/20 transition-all duration-300 resize-none"
                    placeholder="Any other information you'd like to share..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-editorial text-[#1C1917] mb-2">Review your request</h3>
                <p className="text-sm text-[#57534E] mb-6">Please review all details before submitting.</p>

                <div className="space-y-4">
                  {/* Experience Type */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF]/60">
                    <span className="text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Experience</span>
                    <p className="text-sm font-medium text-[#1C1917] mt-1">{getSelectedExperience()?.title || 'Not selected'}</p>
                  </div>

                  {/* Contact Details */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF]/60">
                    <span className="text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Contact</span>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-[#1C1917]">{formData.fullName}</p>
                      <p className="text-sm text-[#57534E]">{formData.email}</p>
                      <p className="text-sm text-[#57534E]">{formData.phone} • {formData.country}</p>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF]/60">
                    <span className="text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Event</span>
                    <div className="mt-2 space-y-1">
                      {formData.organization && <p className="text-sm text-[#1C1917]">{formData.organization}</p>}
                      <p className="text-sm text-[#57534E]">{formData.eventDate} • {formData.eventLocation}</p>
                      {formData.budget && <p className="text-sm text-[#57534E]">Budget: {formData.budget}</p>}
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF]/60">
                    <span className="text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Purpose</span>
                    <p className="text-sm text-[#1C1917] mt-1 leading-relaxed">{formData.purpose}</p>
                    {formData.additionalDetails && (
                      <p className="text-sm text-[#57534E] mt-2 leading-relaxed">{formData.additionalDetails}</p>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-[#57534E] mt-6 leading-relaxed">
                  By submitting this request, you agree that all information provided is accurate.
                  Homer's management team will review your request and respond within 5–10 business days.
                  Submission does not guarantee acceptance.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="px-8 py-6 border-t border-[#E8E5DF]/60 flex items-center justify-between">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#1C1917] transition-colors duration-300 focus:outline-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep > 1 ? 'Back' : 'Cancel'}
          </button>

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!isStepValid(currentStep)}
              className="inline-flex items-center justify-center gap-2 bg-[#A6852F] hover:bg-[#B8983A] disabled:bg-[#E8E5DF] disabled:text-[#57534E] text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-all duration-300 focus:outline-none cursor-pointer disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-all duration-300 focus:outline-none cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Submit Request
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
