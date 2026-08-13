import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Clock } from 'lucide-react';
import { JournalArticleExtended } from '../../../data/journal';

interface ArticleDetailRelatedProps {
  articles: JournalArticleExtended[];
  onNavigate: (slug: string) => void;
}

export const ArticleDetailRelated: React.FC<ArticleDetailRelatedProps> = ({
  articles,
  onNavigate,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  if (articles.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-20 sm:py-24 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Related Reading
          </span>
          <h2 className="text-2xl sm:text-3xl font-editorial text-[#111827] tracking-tight">
            Continue reading
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <motion.button
              key={article.id}
              onClick={() => onNavigate(article.slug)}
              className="group text-left rounded-[1.25rem] overflow-hidden bg-[#FAF9F7] hover:shadow-xl hover:shadow-[#C9A84C]/8 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="relative h-48 overflow-hidden bg-[#E8E5DF]">
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/30 to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-[#111827]/60 backdrop-blur-sm text-white text-[10px] font-medium tracking-wider uppercase rounded-lg">
                  {article.category}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base sm:text-lg font-editorial text-[#111827] group-hover:text-[#C9A84C] transition-colors duration-300 mb-2 leading-snug line-clamp-2">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#71717A]">
                  <span>{article.date}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
