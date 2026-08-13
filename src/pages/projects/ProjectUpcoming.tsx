import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

export const ProjectUpcoming: React.FC = () => {
  const { filmography } = useSiteContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const upcoming = filmography.filter(
    (item) => item.status === 'Announced' || item.status === 'Post-Production' || item.status === 'In Production'
  );

  return (
    <section id="upcoming" ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Upcoming
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            What's next.
          </h2>
        </motion.div>

        {upcoming.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcoming.map((item, idx) => (
              <motion.div
                key={item.id}
                className="group relative rounded-[1.5rem] overflow-hidden bg-[#111827] text-white min-h-[320px]"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Background */}
                {item.image && (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-[1.2s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/60 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10 p-8 sm:p-10 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6852F]/15 border border-[#A6852F]/25 text-[#A6852F] text-[11px] font-medium tracking-wider uppercase">
                        <Calendar className="w-3 h-3" />
                        {item.status === 'Announced' ? 'Announced' : item.status === 'Post-Production' ? 'Post-Production' : 'In Production'}
                      </span>
                      {item.year !== 'TBA' && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                          <Clock className="w-3 h-3" />
                          {item.year}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-editorial text-white tracking-tight">
                      {item.title}
                    </h3>

                    {item.role && item.role !== 'TBA' && (
                      <p className="text-sm text-[#A6852F] font-medium">
                        {item.role}
                      </p>
                    )}

                    <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center text-xs font-medium text-[#A6852F] group-hover:translate-x-1 transition-transform duration-300 pt-4">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-20 rounded-[1.5rem] bg-[#FAF9F7] border border-[#E8E5DF]/60"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Calendar className="w-12 h-12 text-[#E8E5DF] mx-auto mb-4" />
            <p className="text-base font-editorial text-[#111827] mb-2">
              No upcoming projects announced yet.
            </p>
            <p className="text-sm text-[#71717A] max-w-md mx-auto">
              Future official announcements will appear here. Check back for updates on Homer's
              upcoming film and television projects.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
