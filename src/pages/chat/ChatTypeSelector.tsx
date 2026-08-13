import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Building2, ArrowRight, MessageCircle } from 'lucide-react';
import { SectionFadeIn } from '../../components/SectionFadeIn';

interface ChatTypeSelectorProps {
  onSelect: (type: 'fan' | 'business') => void;
}

export const ChatTypeSelector: React.FC<ChatTypeSelectorProps> = ({ onSelect }) => {
  return (
    <section className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Chat with Homer
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial text-[#1C1917] tracking-tight">
            How can we help?
          </h1>
          <p className="text-base sm:text-lg text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            Choose how you'd like to connect with Homer. Every message is reviewed
            by the team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Fan Chat */}
          <motion.button
            onClick={() => onSelect('fan')}
            className="group relative rounded-[2rem] overflow-hidden bg-white border border-[#E8E5DF]/60 hover:border-[#C9A84C]/30 p-8 sm:p-10 text-left transition-all duration-500 hover:shadow-xl hover:shadow-[#C9A84C]/5 hover:-translate-y-1 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center mb-6 group-hover:bg-[#C9A84C] group-hover:text-white text-[#C9A84C] transition-all duration-500">
              <User className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-editorial text-[#1C1917] group-hover:text-[#C9A84C] transition-colors duration-300 mb-3">
              Fan Chat
            </h2>

            <p className="text-sm text-[#57534E] leading-relaxed mb-6">
              Send personal messages, greetings, appreciation, questions, and support
              directly to Homer's inbox.
            </p>

            <div className="flex items-center gap-2 text-sm font-medium text-[#57534E] group-hover:text-[#C9A84C] transition-colors duration-300">
              <MessageCircle className="w-4 h-4" />
              <span>Website Chat + WhatsApp (Premium)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.button>

          {/* Business Chat */}
          <motion.button
            onClick={() => onSelect('business')}
            className="group relative rounded-[2rem] overflow-hidden bg-white border border-[#E8E5DF]/60 hover:border-[#C9A84C]/30 p-8 sm:p-10 text-left transition-all duration-500 hover:shadow-xl hover:shadow-[#C9A84C]/5 hover:-translate-y-1 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#1C1917]/10 flex items-center justify-center mb-6 group-hover:bg-[#1C1917] group-hover:text-white text-[#1C1917] transition-all duration-500">
              <Building2 className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-editorial text-[#1C1917] group-hover:text-[#1C1917] transition-colors duration-300 mb-3">
              Business Chat
            </h2>

            <p className="text-sm text-[#57534E] leading-relaxed mb-6">
              Professional enquiries for brand partnerships, film opportunities,
              media requests, licensing, and management.
            </p>

            <div className="flex items-center gap-2 text-sm font-medium text-[#57534E] group-hover:text-[#1C1917] transition-colors duration-300">
              <Building2 className="w-4 h-4" />
              <span>Routed to Management Team</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
};
