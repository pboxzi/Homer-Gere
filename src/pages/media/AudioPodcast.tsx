import React from 'react';
import { motion } from 'motion/react';
import { Headphones, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import { MEDIA_PODCASTS } from '../../data/content';

interface AudioPodcastProps {
  onListen: (url: string) => void;
}

export const AudioPodcast: React.FC<AudioPodcastProps> = ({ onListen }) => {
  return (
    <section className="py-24 sm:py-32 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Audio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-white mt-3 tracking-tight">
            Podcasts & Audio
          </h2>
          <p className="text-[#71717A] mt-4 max-w-lg">
            Verified podcast appearances and audio interviews featuring Homer Gere
            discussing his career, The Shards, and his journey from neuroscience to acting.
          </p>
        </div>

        {/* Podcast Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEDIA_PODCASTS.map((podcast, idx) => (
            <motion.div
              key={podcast.id}
              onClick={() => onListen(podcast.url)}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
            >
              {/* Cover Art */}
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-white/5">
                <img
                  src={podcast.coverArt}
                  alt={podcast.showName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#1C1917]/20 group-hover:bg-[#1C1917]/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Headphones className="w-6 h-6 text-[#1C1917]" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-[#C9A84C] font-medium tracking-wide uppercase">
                  <span>{podcast.showName}</span>
                </div>
                <h3 className="text-sm font-medium text-white group-hover:text-[#C9A84C] transition-colors duration-300 line-clamp-2 leading-snug">
                  {podcast.episodeTitle}
                </h3>
                <p className="text-xs text-[#71717A] line-clamp-2 leading-relaxed">
                  {podcast.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-[10px] text-[#71717A] font-medium">
                    <Calendar className="w-3 h-3" />
                    {podcast.date}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#C9A84C] group-hover:translate-x-0.5 transition-transform duration-300">
                    Listen
                    <ArrowRight className="w-3 h-3" />
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
