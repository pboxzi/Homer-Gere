import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Clock, User } from 'lucide-react';
import { JournalArticleExtended } from '../../data/journal';

interface JournalFeaturedProps {
  article: JournalArticleExtended;
}

export const JournalFeatured: React.FC<JournalFeaturedProps> = ({ article }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Featured Story
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            Latest Official Story
          </h2>
        </motion.div>

        <motion.article
          className="group relative rounded-[2rem] overflow-hidden bg-[#111827] cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-80 lg:h-[480px] overflow-hidden">
              <img
                src={article.image}
                alt={article.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111827]/30 lg:to-[#111827]/60" />

              {/* Category Badge */}
              <div className="absolute top-5 left-5 px-3 py-1.5 bg-[#C9A84C] text-[#111827] text-[10px] font-semibold tracking-wider uppercase rounded-lg">
                {article.category}
              </div>
            </div>

            {/* Content */}
            <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <div className="space-y-6">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-editorial text-white leading-tight">
                  {article.title}
                </h3>

                <p className="text-[#A8A29E] leading-relaxed text-base sm:text-lg">
                  {article.excerpt}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#71717A]">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {article.author}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#71717A]" />
                  <span>{article.date}</span>
                  <span className="w-1 h-1 rounded-full bg-[#71717A]" />
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>

                <div className="flex items-center text-sm font-medium text-[#C9A84C] group-hover:translate-x-1 transition-transform duration-300 pt-2">
                  <span>Continue Reading</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
};
