import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { MapPin, Clock, Globe, Building } from 'lucide-react';
import { CONTACT_OFFICE } from '../../data/contactData';

export const ContactOfficeInfo: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Office
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight">
            Office Information
          </h2>
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <motion.div
            className="rounded-2xl p-6 bg-[#F3F1ED]/40"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-11 h-11 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-[#1C1917] mb-2">Location</h3>
            <p className="text-sm text-[#57534E] leading-relaxed">{CONTACT_OFFICE.city}</p>
          </motion.div>

          <motion.div
            className="rounded-2xl p-6 bg-[#F3F1ED]/40"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-11 h-11 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-[#1C1917] mb-2">Business Hours</h3>
            <p className="text-sm text-[#57534E] leading-relaxed">{CONTACT_OFFICE.businessHours}</p>
          </motion.div>

          <motion.div
            className="rounded-2xl p-6 bg-[#F3F1ED]/40"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-11 h-11 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-[#1C1917] mb-2">Time Zone</h3>
            <p className="text-sm text-[#57534E] leading-relaxed">{CONTACT_OFFICE.timezone}</p>
          </motion.div>

          <motion.div
            className="rounded-2xl p-6 bg-[#F3F1ED]/40"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-11 h-11 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] mb-4">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-[#1C1917] mb-2">Visits</h3>
            <p className="text-sm text-[#57534E] leading-relaxed">{CONTACT_OFFICE.note}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
