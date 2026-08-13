import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { MEMBERSHIP_FAQ } from '../../data/content';

export const MembershipFAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="membership-faq" ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight">
            Common questions.
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {MEMBERSHIP_FAQ.map((item, idx) => {
            const isOpen = openId === item.id;

            return (
              <motion.div
                key={item.id}
                className="rounded-2xl overflow-hidden border border-[#E8E5DF]/60 bg-[#F3F1ED]/40 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left focus:outline-none cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-editorial text-[#1C1917] group-hover:text-[#C9A84C] transition-colors duration-300 pr-4">
                    {item.question}
                  </span>
                  <motion.div
                    className="shrink-0 w-8 h-8 rounded-xl bg-[#E8E5DF]/60 flex items-center justify-center text-[#44403C] group-hover:bg-[#C9A84C]/10 group-hover:text-[#C9A84C] transition-colors duration-300"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 sm:px-7 pb-6 sm:pb-7">
                        <div className="w-12 h-[1px] bg-[#C9A84C]/30 mb-4" />
                        <p className="text-sm sm:text-base text-[#44403C] leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
