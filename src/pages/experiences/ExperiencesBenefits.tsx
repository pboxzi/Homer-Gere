import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Star, Users, Calendar, MapPin, Heart, Sparkles } from 'lucide-react';

const BENEFITS = [
  {
    icon: Star,
    title: 'Exclusive Access',
    description: 'Get behind-the-scenes access and personal moments with Homer that are unavailable anywhere else.',
  },
  {
    icon: Users,
    title: 'Personal Connection',
    description: 'Meet Homer in person or connect through virtual experiences designed for meaningful interactions.',
  },
  {
    icon: Calendar,
    title: 'Priority Booking',
    description: 'Members receive priority access to limited-capacity experiences before they open to the public.',
  },
  {
    icon: MapPin,
    title: 'Unique Locations',
    description: 'Experiences are held in curated venues that match the exclusivity of the occasion.',
  },
  {
    icon: Heart,
    title: 'Memorable Moments',
    description: 'Create lasting memories with professionally documented experiences and personal keepsakes.',
  },
  {
    icon: Sparkles,
    title: 'Tailored to You',
    description: 'Each experience is crafted to feel personal, whether it\'s a meet-and-greet or a private event.',
  },
];

export const ExperiencesBenefits: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <motion.span
            className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Why Experiences
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Moments that matter.
          </motion.h2>
          <motion.p
            className="text-base text-[#57534E] leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Every experience is designed to create genuine, meaningful connections
            between Homer and the fans who support his journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              className="p-6 rounded-[1.5rem] bg-[#F3F1ED]/60 border border-[#E8E5DF]/40 hover:border-[#A6852F]/20 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] mb-4">
                <benefit.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-editorial text-[#1C1917] mb-2">{benefit.title}</h3>
              <p className="text-sm text-[#57534E] leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
