import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { JournalArticle } from '../types';

interface JournalSectionProps {
  onSelectArticle: (article: JournalArticle) => void;
  onNavigate: (sectionId: string) => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({ onSelectArticle, onNavigate }) => {
  const { journalArticles } = useSiteContent();

  return (
    <section id="journal" className="py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-14">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">Latest from the Journal</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight hover-underline">Reflections & Writings</h2>
          </div>
          <button onClick={() => onNavigate('journal')} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#57534E] hover:text-[#A6852F] transition-colors duration-300 group focus:outline-none cursor-pointer">
            View All Articles<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {journalArticles.map((article) => (
            <article key={article.id} onClick={() => onSelectArticle(article)} className="group p-5 rounded-2xl border border-[#E8E5DF]/60 transition-all duration-500 flex flex-col justify-between cursor-pointer hover:border-[#A6852F]/30 hover:shadow-lg hover:shadow-[#A6852F]/5">
              <div>
                <div className="relative h-56 rounded-xl overflow-hidden mb-5">
                  <img src={article.image} alt={article.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 bg-[#FAF9F7]/95 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-medium tracking-wider text-[#A6852F] uppercase">{article.category}</div>
                </div>
                <h3 className="text-base font-editorial text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300 line-clamp-2 leading-snug">{article.title}</h3>
                <p className="mt-2 text-xs text-[#57534E] line-clamp-2 leading-relaxed">{article.excerpt}</p>
              </div>
              <div className="mt-5 pt-4 flex items-center justify-between text-xs text-[#78716C]">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
                <span className="font-medium text-[#A6852F] group-hover:translate-x-0.5 transition-transform duration-300">Read &rarr;</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
