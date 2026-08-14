import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Film, Tv, Clock, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

interface JourneyFilmographyProps {
  onItemClick?: (projectId: string) => void;
}

export const JourneyFilmography: React.FC<JourneyFilmographyProps> = ({ onItemClick }) => {
  const { filmography } = useSiteContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const films = filmography.filter((e) => e.type === 'film');
  const television = filmography.filter((e) => e.type === 'television');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Released': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Post-Production': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Production': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Announced': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-[#FAF9F7] text-[#44403C] border-[#E8E5DF]';
    }
  };

  const renderEntry = (entry: typeof filmography[0], idx: number) => (
    <motion.article
      key={entry.id}
      className="group flex flex-col sm:flex-row gap-6 sm:gap-8 p-6 sm:p-8 rounded-[1.5rem] bg-[#FAF9F7] hover:bg-white transition-all duration-500 hover:shadow-lg hover:shadow-[#A6852F]/5 border border-transparent hover:border-[#E8E5DF]/60 cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onItemClick?.(entry.slug || entry.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onItemClick?.(entry.slug || entry.id);
        }
      }}
    >
      {/* Poster */}
      {entry.image && (
        <div className="w-full sm:w-48 h-64 sm:h-64 rounded-2xl overflow-hidden bg-[#E8E5DF] shrink-0">
          <img 
            src={entry.image}
            alt={entry.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col justify-between flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl sm:text-2xl font-editorial text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300">
              {entry.title}
            </h3>
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${getStatusColor(entry.status)}`}>
              {entry.status}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-[#44403C]">
            <span className="flex items-center gap-1.5">
              <span className="text-[#A6852F] font-medium">{entry.role}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#E8E5DF]" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#57534E]" />
              {entry.year}
            </span>
          </div>

          <p className="text-sm text-[#44403C] leading-relaxed">
            {entry.description}
          </p>
        </div>

        <div className="mt-4 flex items-center text-xs font-medium text-[#A6852F] group-hover:translate-x-1 transition-transform duration-300">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </div>
      </div>
    </motion.article>
  );

  return (
    <section id="journey-filmography" ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            The Craft
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            On screen.
          </h2>
        </motion.div>

        {/* Film Section */}
        {films.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F]">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-editorial text-[#1C1917]">Film</h3>
            </div>
            <div className="space-y-5">
              {films.map((entry, idx) => renderEntry(entry, idx))}
            </div>
          </div>
        )}

        {/* Television Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F]">
              <Tv className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-editorial text-[#1C1917]">Television</h3>
          </div>
          {television.length > 0 ? (
            <div className="space-y-5">
              {television.map((entry, idx) => renderEntry(entry, idx))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16 rounded-[1.5rem] bg-[#FAF9F7] border border-[#E8E5DF]/60"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Tv className="w-10 h-10 text-[#E8E5DF] mx-auto mb-4" />
              <p className="text-sm text-[#57534E]">
                Television credits will be added as projects are announced.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
