import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Newspaper, ExternalLink, Quote } from 'lucide-react';

const PRESS_ITEMS = [
  {
    id: 'bbc',
    publication: 'BBC News',
    headline: 'Euphoria confirms new cast members for season three',
    date: 'October 7, 2025',
    excerpt: 'BBC News confirmed Homer Gere among new cast additions to HBO\'s Euphoria for its third and final season.',
    source: 'bbc.com',
    url: 'https://www.bbc.com/news/articles/c8eyk31w3j5o',
  },
  {
    id: 'vogue',
    publication: 'British Vogue',
    headline: 'Who Is Homer Gere — Star Of The Shards — And Richard Gere\'s Son?',
    date: 'August 6, 2026',
    excerpt: 'He\'s good in it, too: slick, sly, stylish, secretive and utterly believable as a preppy high schooler in this cartoonish yet moreish version of \'80s Los Angeles.',
    source: 'vogue.co.uk',
    url: 'https://www.vogue.co.uk/article/homer-gere-the-shards',
  },
  {
    id: 'hollywood-reporter',
    publication: 'Hollywood Reporter',
    headline: 'Richard Gere on Son Homer Gere\'s Acting Career After Euphoria',
    date: 'June 8, 2026',
    excerpt: 'Richard Gere opens up about his son following in his acting footsteps, including his recent role in Euphoria with Sydney Sweeney.',
    source: 'hollywoodreporter.com',
    url: 'https://www.hollywoodreporter.com/tv/tv-news/richard-gere-reacts-son-homer-gere-acting-career-euphoria-1236616986/',
  },
  {
    id: 'deadline',
    publication: 'Deadline',
    headline: 'FX Greenlights Ryan Murphy\'s The Shards; Homer Gere Joins Kaia Gerber',
    date: 'July 16, 2025',
    excerpt: 'Homer Gere, Igby Rigney, and Graham Campbell join Kaia Gerber in the Ryan Murphy adaptation of the Bret Easton Ellis novel.',
    source: 'deadline.com',
    url: 'https://deadline.com/2025/07/ryan-murphy-the-shards-fx-greenlight-adds-3-cast-1236459942/',
  },
  {
    id: 'variety',
    publication: 'Variety',
    headline: 'Michael Douglas, Willem Dafoe, Ellen Barkin and Homer Gere Join Oliver Stone\'s White Lies',
    date: 'June 10, 2026',
    excerpt: 'Homer Gere joins an ensemble cast including Michael Douglas, Willem Dafoe, and Ellen Barkin in Oliver Stone\'s upcoming film.',
    source: 'variety.com',
    url: 'https://variety.com/2026/film/news/michael-douglas-willem-dafoe-oliver-stone-white-lies-1236771220/',
  },
  {
    id: 'ew',
    publication: 'Entertainment Weekly',
    headline: 'Homer Gere debuts first leading role in The Shards trailer',
    date: 'July 14, 2026',
    excerpt: 'Homer Gere made a viral splash on the final season of Euphoria, but now the son of legendary actor Richard Gere is taking the lead for the first time.',
    source: 'ew.com',
    url: 'https://ew.com/homer-gere-the-shards-trailer-first-leading-role-ryan-murphy-12017090',
  },
];

export const JourneyPress: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="journey-press" ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Recognition & Press
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            In the headlines.
          </h2>
        </motion.div>

        {/* Press Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRESS_ITEMS.map((item, idx) => (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-[1.25rem] bg-[#FAF9F7] border border-[#E8E5DF]/60 p-7 sm:p-8 transition-all duration-500 hover:shadow-xl hover:shadow-[#C9A84C]/5 hover:-translate-y-1 hover:border-[#C9A84C]/20 block"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Publication badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-[#C9A84C]" />
                  <span className="text-xs font-medium text-[#C9A84C] uppercase tracking-wider">
                    {item.publication}
                  </span>
                </div>
                <span className="text-[10px] text-[#71717A]">{item.date}</span>
              </div>

              {/* Headline */}
              <h3 className="text-base sm:text-lg font-editorial text-[#111827] leading-snug mb-3 group-hover:text-[#C9A84C] transition-colors duration-300">
                {item.headline}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-[#52525B] leading-relaxed mb-6 line-clamp-3">
                {item.excerpt}
              </p>

              {/* Source link */}
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#71717A] group-hover:text-[#C9A84C] transition-colors duration-300">
                <ExternalLink className="w-3 h-3" />
                <span>{item.source}</span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Quote from Homer */}
        <motion.div
          className="mt-16 sm:mt-20 rounded-[1.5rem] bg-[#111827] p-8 sm:p-12 lg:p-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-3xl">
            <Quote className="w-12 h-12 text-[#C9A84C]/30 mb-6" />
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-editorial text-white/90 leading-[1.4] italic mb-8">
              "It's not necessarily related to like the craft, but more like how do you carry yourself,
              how do you make this work in a positive way. Having that kind of sounding board
              constantly is amazing."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1.5px] bg-[#C9A84C]" />
              <div>
                <span className="text-sm font-editorial text-[#C9A84C] tracking-[0.1em] uppercase">
                  Homer Gere
                </span>
                <span className="text-xs text-white/40 ml-3">on his father's guidance, Euphoria premiere 2026</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
