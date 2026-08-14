import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ClipboardCheck, MessageCircle, Calendar, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    icon: ClipboardCheck,
    title: 'Submit Request',
    description: 'Choose your experience type and fill out the request form with your event details.',
  },
  {
    icon: MessageCircle,
    title: 'Management Review',
    description: "Homer's team reviews each request personally, considering availability and alignment.",
  },
  {
    icon: Calendar,
    title: 'Coordinate Details',
    description: 'Once approved, work with the team to finalize scheduling, logistics, and requirements.',
  },
  {
    icon: CheckCircle,
    title: 'Experience Confirmed',
    description: 'Receive confirmation and all necessary details for your upcoming experience with Homer.',
  },
];

export const HowItWorks: React.FC = () => {
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
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight">
            Simple process.
          </h2>
          <p className="text-base text-[#57534E] max-w-2xl mx-auto leading-relaxed">
            From request to confirmation, every step is handled with care by Homer's official team.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              className="relative text-center group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Connector Line */}
              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[1px] bg-[#E8E5DF]">
                  <motion.div
                    className="h-full bg-[#A6852F]/40"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: '100%' } : {}}
                    transition={{ duration: 0.8, delay: 0.5 + idx * 0.15 }}
                  />
                </div>
              )}

              {/* Icon */}
              <div className="relative w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] group-hover:bg-[#A6852F] group-hover:text-white transition-all duration-500">
                <step.icon className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1C1917] text-white text-[10px] font-medium flex items-center justify-center">
                  {idx + 1}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-base font-editorial text-[#1C1917] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed max-w-[240px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
