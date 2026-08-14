import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Emily R.',
    experience: 'Meet & Greet',
    text: 'Meeting Homer was surreal. He was so genuine and took time to talk with each person. The whole experience felt personal and unforgettable.',
    rating: 5,
  },
  {
    name: 'David C.',
    experience: 'Fan Event',
    text: 'The fan event was beautifully organized. Homer\'s warmth and attention to every fan made it feel like we were old friends catching up.',
    rating: 5,
  },
  {
    name: 'Lisa T.',
    experience: 'Virtual Appearance',
    text: 'Even through a screen, Homer\'s presence was incredible. He answered questions, shared stories, and made every participant feel valued.',
    rating: 5,
  },
];

export const ExperiencesTestimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <motion.span
            className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Experience Stories
          </motion.span>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Hear from fans who've been there.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              className="relative p-5 sm:p-8 rounded-[1.5rem] bg-white border border-[#E8E5DF]/60 hover:border-[#A6852F]/20 transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Quote className="w-8 h-8 text-[#A6852F]/20 mb-4" />
              <p className="text-sm text-[#44403C] leading-relaxed mb-6">
                "{testimonial.text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1C1917]">{testimonial.name}</p>
                  <p className="text-[11px] text-[#A6852F]">{testimonial.experience}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-[#A6852F] fill-[#A6852F]" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
