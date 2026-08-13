import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { TrendingUp, Clock } from 'lucide-react';
import { JournalArticle } from '../../types';

interface JournalTrendingProps {
  articles: JournalArticle[];
  onArticleClick?: (slug: string) => void;
}

export const JournalTrending: React.FC<JournalTrendingProps> = ({ articles, onArticleClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  if (articles.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#A6852F]/15 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#A6852F]" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-editorial text-white tracking-tight">
              Trending Stories
            </h2>
            <p className="text-sm text-[#71717A]">Most-read and editor-selected articles</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, idx) => (
            <motion.div
              key={article.id}
              className="group flex items-start gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/8 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + idx * 0.08 }}
              onClick={() => onArticleClick?.(article.slug)}
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#1C1917]">
                <img
                  src={article.image}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-[#A6852F] uppercase tracking-wider mb-1">
                  {article.category}
                </p>
                <h4 className="text-sm font-medium text-white leading-snug mb-2 group-hover:text-[#A6852F] transition-colors duration-300 line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-[#71717A]">
                  <span>{article.date}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
