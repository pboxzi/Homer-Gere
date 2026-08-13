import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { MEDIA_PRESS } from '../../data/content';

interface PressHighlightsProps {
  onReadArticle: (url: string) => void;
}

export const PressHighlights: React.FC<PressHighlightsProps> = ({ onReadArticle }) => {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Press
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight hover-underline">
            Press Highlights
          </h2>
          <p className="text-[#57534E] mt-4 max-w-lg">
            Verified coverage from Vogue, People, Variety, The Hollywood Reporter, and
            other trusted publications covering Homer Gere's career and public appearances.
          </p>
        </div>

        {/* Featured Press — Large Card */}
        {MEDIA_PRESS.length > 0 && (
          <motion.div
            onClick={() => onReadArticle(MEDIA_PRESS[0].url)}
            className="group relative rounded-[2rem] overflow-hidden mb-8 cursor-pointer bg-[#F3F1ED]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {MEDIA_PRESS[0].image && (
                <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                  <img
                    src={MEDIA_PRESS[0].image}
                    alt={MEDIA_PRESS[0].publisher}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F3F1ED] to-transparent lg:block hidden" />
                </div>
              )}
              <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] text-[#C9A84C] font-medium tracking-wide uppercase">
                    <Newspaper className="w-3.5 h-3.5" />
                    <span>{MEDIA_PRESS[0].publisher}</span>
                    <span className="text-[#D6D3D1]">·</span>
                    <span className="flex items-center gap-1 text-[#71717A]">
                      <Calendar className="w-3 h-3" />
                      {MEDIA_PRESS[0].date}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-editorial text-[#111827] group-hover:text-[#C9A84C] transition-colors duration-300 leading-snug">
                    {MEDIA_PRESS[0].headline}
                  </h3>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    {MEDIA_PRESS[0].summary}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C9A84C] group-hover:translate-x-0.5 transition-transform duration-300">
                    Read Article
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Press Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEDIA_PRESS.slice(1).map((press, idx) => (
            <motion.div
              key={press.id}
              onClick={() => onReadArticle(press.url)}
              className="group flex gap-5 cursor-pointer p-4 rounded-2xl hover:bg-[#F3F1ED] transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              {/* Image */}
              {press.image && (
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#E8E5DF]">
                  <img
                    src={press.image}
                    alt={press.publisher}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-[#C9A84C] font-medium tracking-wide uppercase">
                  <span>{press.publisher}</span>
                  <span className="text-[#D6D3D1]">·</span>
                  <span className="flex items-center gap-1 text-[#71717A]">
                    <Calendar className="w-3 h-3" />
                    {press.date}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-[#1C1917] group-hover:text-[#C9A84C] transition-colors duration-300 leading-snug line-clamp-2">
                  {press.headline}
                </h3>
                <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                  {press.summary}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#C9A84C] group-hover:translate-x-0.5 transition-transform duration-300">
                  Read Article
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
