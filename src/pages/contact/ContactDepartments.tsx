import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Mail, Newspaper, Handshake, Clapperboard, Calendar, Heart, Headphones, Clock } from 'lucide-react';
import { CONTACT_DEPARTMENTS } from '../../data/contactData';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Mail, Newspaper, Handshake, Clapperboard, Calendar, Heart, Headphones,
};

export const ContactDepartments: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Departments
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight">
            Who to contact
          </h2>
          <p className="text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            Choose the department that best fits your enquiry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONTACT_DEPARTMENTS.map((dept, index) => {
            const Icon = ICON_MAP[dept.icon] || Mail;
            return (
              <motion.div
                key={dept.id}
                className="group rounded-2xl p-6 hover:bg-[#F3F1ED]/60 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-editorial text-[#1C1917] mb-2">{dept.name}</h3>
                <p className="text-sm text-[#57534E] leading-relaxed mb-4">{dept.description}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-[#57534E]">
                    <Mail className="w-3.5 h-3.5 text-[#A6852F]/60" />
                    <span>{dept.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#57534E]">
                    <Clock className="w-3.5 h-3.5 text-[#A6852F]/60" />
                    <span>{dept.responseTime}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
