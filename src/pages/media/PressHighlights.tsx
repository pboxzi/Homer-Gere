import React from 'react';
import { ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import { MEDIA_PRESS } from '../../data/content';

interface PressHighlightsProps {
  onReadArticle: (url: string) => void;
}

export const PressHighlights: React.FC<PressHighlightsProps> = ({ onReadArticle }) => {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Press
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight hover-underline">
            Press Highlights
          </h2>
        </div>

        {/* Press Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MEDIA_PRESS.map((press) => (
            <div
              key={press.id}
              onClick={() => onReadArticle(press.url)}
              className="group flex gap-5 cursor-pointer"
            >
              {/* Image */}
              {press.image && (
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={press.image}
                    alt={press.publisher}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-[#C9A84C] font-medium tracking-wide uppercase">
                  <span>{press.publisher}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-[#57534E]">
                    <Calendar className="w-3 h-3" />
                    {press.date}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-[#1C1917] group-hover:text-[#C9A84C] transition-colors duration-300 leading-snug">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
