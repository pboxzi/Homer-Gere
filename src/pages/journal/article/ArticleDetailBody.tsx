import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Clock, Tag, ArrowUp } from 'lucide-react';
import { JournalArticleExtended } from '../../data/journal';

interface ArticleDetailBodyProps {
  article: JournalArticleExtended;
}

// Parse markdown-like content into structured sections
const parseContent = (content: string) => {
  const sections: { type: 'heading' | 'paragraph' | 'list' | 'bold'; text: string }[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      sections.push({ type: 'heading', text: trimmed.replace(/\*\*/g, '') });
    } else if (trimmed.startsWith('- ')) {
      sections.push({ type: 'list', text: trimmed.substring(2) });
    } else if (trimmed.startsWith('**')) {
      sections.push({ type: 'bold', text: trimmed.replace(/\*\*/g, '') });
    } else {
      sections.push({ type: 'paragraph', text: trimmed });
    }
  }

  return sections;
};

// Extract headings for TOC
const extractHeadings = (content: string) => {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      const text = trimmed.replace(/\*\*/g, '');
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      headings.push({ id, text, level: 2 });
    }
  }

  return headings;
};

export const ArticleDetailBody: React.FC<ArticleDetailBodyProps> = ({ article }) => {
  const sections = useMemo(() => parseContent(article.content), [article.content]);
  const headings = useMemo(() => extractHeadings(article.content), [article.content]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 xl:gap-16">
          {/* Article Body */}
          <article className="max-w-3xl">
            {/* Image Caption */}
            {article.imageCaption && (
              <motion.figure
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="rounded-[1.5rem] overflow-hidden bg-[#E8E5DF]">
                  <img
                    src={article.image}
                    alt={article.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[16/9] object-cover object-top"
                  />
                </div>
                <figcaption className="mt-3 text-xs text-[#71717A] text-center italic">
                  {article.imageCaption}
                </figcaption>
              </motion.figure>
            )}

            {/* Content */}
            <motion.div
              className="prose-journal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {sections.map((section, idx) => {
                if (section.type === 'heading') {
                  const id = section.text
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
                  return (
                    <h2
                      key={idx}
                      id={id}
                      className="text-2xl sm:text-3xl font-editorial text-[#111827] tracking-tight mt-12 mb-5 scroll-mt-24"
                    >
                      {section.text}
                    </h2>
                  );
                }

                if (section.type === 'list') {
                  return (
                    <li
                      key={idx}
                      className="text-[#44403C] text-base sm:text-[17px] leading-[1.85] mb-3 ml-4 list-disc list-outside"
                    >
                      {section.text}
                    </li>
                  );
                }

                if (section.type === 'bold') {
                  return (
                    <p key={idx} className="text-[#111827] text-base sm:text-[17px] leading-[1.85] mb-5 font-semibold">
                      {section.text}
                    </p>
                  );
                }

                return (
                  <p key={idx} className="text-[#44403C] text-base sm:text-[17px] leading-[1.85] mb-5">
                    {section.text}
                  </p>
                );
              })}
            </motion.div>

            {/* Tags */}
            <motion.div
              className="mt-12 pt-8 border-t border-[#E8E5DF]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-[#71717A]" />
                <span className="text-sm font-medium text-[#71717A]">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-[#F3F1ED] text-[#52525B] text-xs font-medium rounded-lg border border-[#E8E5DF]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Back to Top */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-sm text-[#71717A] hover:text-[#C9A84C] transition-colors duration-300 cursor-pointer group"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                <span>Back to top</span>
              </button>
            </motion.div>
          </article>

          {/* Sidebar — Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <motion.div
                className="rounded-[1.25rem] bg-[#F3F1ED] border border-[#E8E5DF] p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-sm font-medium text-[#111827] mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C9A84C]" />
                  In this article
                </h3>

                <nav className="space-y-1">
                  {headings.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => scrollToHeading(heading.id)}
                      className="block w-full text-left px-3 py-2 text-sm text-[#52525B] hover:text-[#C9A84C] hover:bg-[#E8E5DF]/60 rounded-lg transition-all duration-200 cursor-pointer leading-snug"
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>

                {/* Reading Info */}
                <div className="mt-6 pt-5 border-t border-[#E8E5DF] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#71717A]">Reading time</span>
                    <span className="text-[#111827] font-medium">{article.readTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#71717A]">Word count</span>
                    <span className="text-[#111827] font-medium">{article.wordCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#71717A]">Published</span>
                    <span className="text-[#111827] font-medium">{article.date}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
