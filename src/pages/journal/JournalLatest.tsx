import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock } from 'lucide-react';
import { JournalArticle } from '../../types';
import { formatDate } from '../../utils/formatDate';

interface ArticleCardProps {
  article: JournalArticle;
  onArticleClick?: (slug: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onArticleClick }) => {
  return (
    <motion.article
      className="group rounded-[1.5rem] overflow-hidden bg-[#FAF9F7] hover:shadow-2xl hover:shadow-[#A6852F]/8 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => onArticleClick?.(article.slug)}
    >
      {/* Image */}
      <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden bg-[#E8E5DF]">
        <img 
          src={article.image}
          alt={article.imageAlt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
          loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/40 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-2.5 py-1 bg-[#111827]/60 backdrop-blur-sm text-white text-[10px] font-medium tracking-wider uppercase rounded-lg">
          {article.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-7">
        <h3 className="text-lg sm:text-xl font-editorial text-[#111827] group-hover:text-[#A6852F] transition-colors duration-300 mb-2 leading-snug">
          {article.title}
        </h3>

        <p className="text-sm text-[#52525B] leading-relaxed mb-5 line-clamp-2">
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-[#71717A] mb-5">
          <span>{formatDate(article.date)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        </div>

        <div className="flex items-center text-xs font-medium text-[#A6852F] group-hover:translate-x-1 transition-transform duration-300">
          <span>Continue Reading</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </div>
      </div>
    </motion.article>
  );
};

interface JournalLatestProps {
  articles: JournalArticle[];
  initialCount?: number;
  loadMore?: number;
  onArticleClick?: (slug: string) => void;
}

export const JournalLatest: React.FC<JournalLatestProps> = ({
  articles,
  initialCount = 6,
  loadMore = 3,
  onArticleClick,
}) => {
  const [visibleCount, setVisibleCount] = React.useState(initialCount);
  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        {visibleArticles.map((article, idx) => (
          <div key={article.id} style={{ animationDelay: `${Math.min(idx * 0.05, 0.3)}s` }}>
            <ArticleCard article={article} onArticleClick={onArticleClick} />
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-20 rounded-[1.5rem] bg-[#F3F1ED]/60 border border-[#E8E5DF]/60">
          <p className="text-sm text-[#71717A]">No articles in this category yet.</p>
          <p className="text-xs text-[#A8A29E] mt-2">Check back for future updates.</p>
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + loadMore)}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#111827] hover:bg-[#1C1917] text-white text-sm font-medium rounded-2xl transition-all duration-300 cursor-pointer group"
          >
            <span>Load More Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
};
