import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Film, Tv, Clock, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

type FilterType = 'all' | 'film' | 'television' | 'upcoming';

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'film', label: 'Film' },
  { id: 'television', label: 'Television' },
  { id: 'upcoming', label: 'Upcoming' },
];

interface ProjectFilmographyProps {
  onItemClick: (projectId: string) => void;
  onNavigateToProject?: (slug: string) => void;
}

export const ProjectFilmography: React.FC<ProjectFilmographyProps> = ({ onItemClick, onNavigateToProject }) => {
  const { filmography } = useSiteContent();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const filteredItems = filmography.filter((item) => {
    switch (activeFilter) {
      case 'film': return item.type === 'film';
      case 'television': return item.type === 'television';
      case 'upcoming': return item.status === 'Announced' || item.status === 'Post-Production' || item.status === 'In Production';
      default: return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Released': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Post-Production': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Production': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Announced': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-[#FAF9F7] text-[#44403C] border-[#E8E5DF]';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'film' ? <Film className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />;
  };

  return (
    <section id="filmography" ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="space-y-4">
            <span className="text-xs font-medium tracking-[0.2em] text-[#A6852F] uppercase">
              Complete Filmography
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
              All credits.
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-[#71717A] mr-1" />
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 focus:outline-none cursor-pointer ${
                  activeFilter === filter.id
                    ? 'bg-[#A6852F] text-white shadow-md shadow-[#A6852F]/20'
                    : 'bg-[#F3F1ED] text-[#52525B] hover:bg-[#E8E5DF] hover:text-[#111827]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filmography Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {filteredItems.map((entry, idx) => (
              <motion.article
                key={entry.id}
                className="group flex flex-col sm:flex-row gap-6 sm:gap-8 p-6 sm:p-8 rounded-[1.5rem] bg-[#F3F1ED]/60 hover:bg-white transition-all duration-500 hover:shadow-lg hover:shadow-[#A6852F]/5 border border-transparent hover:border-[#E8E5DF]/60 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => { if (onNavigateToProject) onNavigateToProject(entry.id); else onItemClick(entry.id); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onNavigateToProject) onNavigateToProject(entry.id); else onItemClick(entry.id);
                  }
                }}
              >
                {/* Poster */}
                {entry.image ? (
                  <div className="w-full sm:w-52 h-72 sm:h-72 rounded-2xl overflow-hidden bg-[#E8E5DF] shrink-0">
                    <img
                      src={entry.image}
                      alt={entry.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ) : (
                  <div className="w-full sm:w-52 h-72 sm:h-72 rounded-2xl bg-[#E8E5DF] shrink-0 flex items-center justify-center">
                    <Film className="w-10 h-10 text-[#D6D3CC]" />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col justify-between flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-editorial text-[#111827] group-hover:text-[#A6852F] transition-colors duration-300">
                        {entry.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${getStatusColor(entry.status)}`}>
                        {entry.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-[#52525B]">
                      <span className="inline-flex items-center gap-1.5 text-[#A6852F] font-medium">
                        {getTypeIcon(entry.type)}
                        {entry.type === 'film' ? 'Film' : 'Television'}
                      </span>
                      {entry.role && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-[#E8E5DF]" />
                          <span>{entry.role}</span>
                        </>
                      )}
                      <span className="w-1 h-1 rounded-full bg-[#E8E5DF]" />
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#71717A]" />
                        {entry.year}
                      </span>
                    </div>

                    <p className="text-sm text-[#52525B] leading-relaxed max-w-2xl">
                      {entry.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center text-xs font-medium text-[#A6852F] group-hover:translate-x-1 transition-transform duration-300">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <motion.div
            className="text-center py-20 rounded-[1.5rem] bg-[#F3F1ED]/60 border border-[#E8E5DF]/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Film className="w-12 h-12 text-[#E8E5DF] mx-auto mb-4" />
            <p className="text-sm text-[#71717A]">
              No projects found for this filter.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
