import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, User, Calendar, Share2, Bookmark } from 'lucide-react';
import { JournalArticleExtended } from '../../../data/journal';

interface ArticleDetailHeroProps {
  article: JournalArticleExtended;
  onBack: () => void;
}

export const ArticleDetailHero: React.FC<ArticleDetailHeroProps> = ({ article, onBack }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.seoTitle,
        text: article.seoDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] bg-[#111827] overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={article.image}
          alt={article.imageAlt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/80 to-[#111827]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/30 to-[#111827]/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-8">
        {/* Top Bar */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-300 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Journal</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 cursor-pointer"
              aria-label="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 cursor-pointer"
              aria-label="Bookmark article"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Article Info */}
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Category + Date */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="px-3 py-1.5 bg-[#A6852F] text-[#111827] text-[10px] font-semibold tracking-wider uppercase rounded-lg">
              {article.category}
            </span>
            <span className="text-white/50 text-sm">{article.date}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-editorial text-white tracking-tight leading-[1.1] mb-6">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-2xl">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/40">
            <span className="inline-flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#A6852F]/20 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-[#A6852F]" />
              </div>
              <span className="text-white/60">{article.author}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{article.wordCount.toLocaleString()} words</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
