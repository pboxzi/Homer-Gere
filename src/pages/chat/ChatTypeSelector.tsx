import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import { IMAGES } from '../../data/images';

interface ChatTypeSelectorProps {
  onSelect: (type: 'fan' | 'business') => void;
}

export const ChatTypeSelector: React.FC<ChatTypeSelectorProps> = ({ onSelect }) => {
  return (
    <section className="relative min-h-screen bg-[#FAF9F7] overflow-hidden">
      {/* Soft Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#A6852F]/5 via-transparent to-[#FAF9F7]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#A6852F]/3 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#A6852F]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Homer Portrait */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-[#A6852F]/20 mx-auto">
              <img 
                src={IMAGES.homerGqLifestyleStudio}
                alt="Homer Gere"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
                loading="lazy" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center border-3 border-[#FAF9F7]">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 bg-[#A6852F]/10 px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#A6852F]" />
            <span className="text-[11px] font-medium tracking-[0.15em] text-[#A6852F] uppercase">
              Chat with Homer
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial text-[#1C1917] tracking-tight leading-[1.05]">
            Hey, it's nice to
            <span className="block text-[#A6852F]">see you here.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#57534E] max-w-xl mx-auto leading-relaxed">
            Stick around, say hello. Whether you're here to talk about
            a project or just want to connect — I'd love to hear from you.
          </p>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Fan Chat */}
          <motion.button
            onClick={() => onSelect('fan')}
            className="group text-left transition-all duration-500 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center mb-6 group-hover:bg-[#A6852F] group-hover:text-white text-[#A6852F] transition-all duration-500">
              <Heart className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-editorial text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300 mb-3">
              Fan Chat
            </h2>

            <p className="text-sm text-[#57534E] leading-relaxed mb-6">
              Send a note, share a thought, or just say hi. This is your space
              to connect — no filters, no pressure. Just a genuine conversation.
            </p>

            <div className="flex items-center gap-2 text-sm font-medium text-[#57534E] group-hover:text-[#A6852F] transition-colors duration-300">
              <span>Start chatting</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.button>

          {/* Business Chat */}
          <motion.button
            onClick={() => onSelect('business')}
            className="group text-left transition-all duration-500 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
              <div className="w-14 h-14 rounded-2xl bg-[#1C1917]/10 flex items-center justify-center mb-6 group-hover:bg-[#1C1917] group-hover:text-white text-[#1C1917] transition-all duration-500">
                <span className="text-lg font-editorial">B</span>
              </div>

              <h2 className="text-2xl font-editorial text-[#1C1917] mb-3">
                Business
              </h2>

              <p className="text-sm text-[#57534E] leading-relaxed mb-6">
                Partnerships, film projects, media requests — anything professional
                goes through the team. They'll get back to you quickly.
              </p>

              <div className="flex items-center gap-2 text-sm font-medium text-[#57534E] group-hover:text-[#1C1917] transition-colors duration-300">
                <span>Send an enquiry</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
          </motion.button>
        </div>

        {/* Bottom Note */}
        <motion.p
          className="text-center text-[11px] text-[#57534E]/60 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Every conversation is private and secure. Your information stays safe.
        </motion.p>
      </div>
    </section>
  );
};
