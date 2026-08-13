import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, MessageCircle, ExternalLink } from 'lucide-react';

interface ChatConfirmationProps {
  chatType: 'fan' | 'business';
  method: string;
  formData: Record<string, string>;
  onClose: () => void;
}

export const ChatConfirmation: React.FC<ChatConfirmationProps> = ({
  chatType,
  method,
  formData,
  onClose,
}) => {
  const getMethodLabel = () => {
    switch (method) {
      case 'whatsapp': return 'WhatsApp';
      case 'email': return 'Email';
      case 'telegram': return 'Telegram';
      case 'website': return 'Website Chat';
      default: return method;
    }
  };

  const handleOpenChannel = () => {
    if (method === 'whatsapp') {
      const number = chatType === 'fan' ? '1234567890' : '1234567890';
      const message = encodeURIComponent(`Hi, I'm ${formData.fullName}. ${formData.message || formData.enquiryType || ''}`);
      window.open(`https://wa.me/${number}?text=${message}`, '_blank');
    } else if (method === 'email') {
      const subject = encodeURIComponent(`${chatType === 'fan' ? 'Fan Message' : 'Business Enquiry'} from ${formData.fullName}`);
      const body = encodeURIComponent(`Name: ${formData.fullName}\nEmail: ${formData.email}\n\n${formData.message || formData.enquiryType || ''}`);
      window.open(`mailto:management@homergere.com?subject=${subject}&body=${body}`, '_blank');
    } else if (method === 'telegram') {
      const message = encodeURIComponent(`Hi, I'm ${formData.fullName}. ${formData.message || formData.enquiryType || ''}`);
      window.open(`https://t.me/homergere?text=${message}`, '_blank');
    }
  };

  return (
    <section className="relative min-h-screen bg-[#FAF9F7] overflow-hidden">
      {/* Soft Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#16A34A]/3 via-transparent to-[#FAF9F7]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-20 h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-[#16A34A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-4">
            {chatType === 'fan' ? 'Message Ready' : 'Enquiry Ready'}
          </h2>

          <p className="text-base text-[#57534E] leading-relaxed mb-8 max-w-lg mx-auto">
            {chatType === 'fan'
              ? 'Your message has been prepared. Continue to send it via your selected method.'
              : 'Your enquiry has been prepared. Continue to send it to Homer\'s management team.'}
          </p>

          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-[#E8E5DF]/60 p-6 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Name</span>
                <span className="text-sm text-[#1C1917]">{formData.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Email</span>
                <span className="text-sm text-[#1C1917]">{formData.email}</span>
              </div>
              {formData.company && (
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Company</span>
                  <span className="text-sm text-[#1C1917]">{formData.company}</span>
                </div>
              )}
              {formData.enquiryType && (
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Enquiry</span>
                  <span className="text-sm text-[#1C1917]">{formData.enquiryType}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Method</span>
                <span className="text-sm text-[#A6852F] font-medium">{getMethodLabel()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {(method === 'whatsapp' || method === 'email' || method === 'telegram') && (
              <button
                onClick={handleOpenChannel}
                className="inline-flex items-center justify-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6852F]/25 focus:outline-none cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Open {getMethodLabel()}
              </button>
            )}

            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#1C1917]/10 focus:outline-none cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              {method === 'website' ? 'Start Chat' : 'Done'}
            </button>
          </div>

          <p className="text-[11px] text-[#57534E] mt-8 leading-relaxed">
            {chatType === 'fan'
              ? 'Your message has been saved. Homer\'s team will review and respond within 5–10 business days.'
              : 'Your enquiry has been saved. Homer\'s management team will respond within 5–10 business days.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
