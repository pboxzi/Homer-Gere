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
    <section id="journal" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs font-bold tracking-widest text-gold uppercase font-outfit">
              Latest from the Journal
            </span>
            <h2 className="text-3xl sm:text-4xl font-outfit font-extrabold text-gray-900 mt-1">
              Reflections & Writings
            </h2>
          </div>

          <button
            onClick={onViewAllArticles}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group focus:outline-none cursor-pointer"
          >
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Article Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {JOURNAL_ARTICLES.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="bg-gray-50/70 hover:bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-lg flex flex-col justify-between cursor-pointer group transform hover:-translate-y-1"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-gray-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                    {article.category}
                  </div>
                </div>

                {/* Body */}
                <h3 className="text-base font-serif font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.date}
                </span>
                <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
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
