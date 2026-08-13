import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { JOURNAL_ARTICLES } from '../data/content';
import { JournalArticle } from '../types';

interface JournalSectionProps {
  onSelectArticle: (article: JournalArticle) => void;
  onViewAllArticles: () => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  onSelectArticle,
  onViewAllArticles,
}) => {
  return (
    <section id="journal" className="py-24 sm:py-32 bg-[#EDE9E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-14">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#C8A96A] uppercase">
              Latest from the Journal
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#111827] mt-3 tracking-tight">
              Reflections & Writings
            </h2>
          </div>

          <button
            onClick={onViewAllArticles}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#57534E] hover:text-[#C8A96A] transition-colors duration-300 group focus:outline-none cursor-pointer"
          >
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {JOURNAL_ARTICLES.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group bg-[#F5F2EB] hover:bg-white rounded-[1.5rem] p-4 transition-all duration-500 hover:shadow-xl hover:shadow-[#C8A96A]/5 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
            >
              <div>
                {/* Image */}
                <div className="relative h-52 rounded-2xl overflow-hidden mb-5 bg-[#E4DFD5]">
                  <img
                    src={article.image}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#F5F2EB]/95 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-semibold tracking-wider text-[#C8A96A] uppercase">
                    {article.category}
                  </div>
                </div>

                {/* Body */}
                <h3 className="text-base font-editorial font-bold text-[#111827] group-hover:text-[#C8A96A] transition-colors duration-300 line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="mt-2 text-xs text-[#78716C] line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E4DFD5] flex items-center justify-between text-xs text-[#8A8580]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.date}
                </span>
                <span className="font-semibold text-[#C8A96A] group-hover:translate-x-0.5 transition-transform duration-300">
                  Read &rarr;
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
