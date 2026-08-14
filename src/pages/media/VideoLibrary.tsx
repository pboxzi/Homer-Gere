import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Clock, Calendar, ExternalLink, Search } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { MediaCategory } from '../../types';

function getYouTubeThumbnail(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname.includes('youtube.com')) videoId = u.searchParams.get('v');
    else if (u.hostname === 'youtu.be') videoId = u.pathname.slice(1);
    if (videoId && videoId.length === 11) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  } catch {}
  return null;
}

interface VideoLibraryProps {
  onWatch: (url: string) => void;
}

const CATEGORIES: { id: MediaCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'trailers', label: 'Trailers' },
  { id: 'behind-the-scenes', label: 'Behind the Scenes' },
  { id: 'event-coverage', label: 'Event Coverage' },
];

export const VideoLibrary: React.FC<VideoLibraryProps> = ({ onWatch }) => {
  const [activeCategory, setActiveCategory] = useState<MediaCategory>('all');
  const { mediaVideos } = useSiteContent();

  const filteredVideos =
    activeCategory === 'all'
      ? mediaVideos
      : mediaVideos.filter((v) => v.category === activeCategory);

  return (
    <section className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Browse
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight hover-underline">
            Video Library
          </h2>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-300 focus:outline-none cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#A6852F] text-white'
                  : 'bg-white text-[#57534E] hover:bg-[#E8E5DF] hover:text-[#1C1917]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-[#71717A]">
          {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}{' '}
          {activeCategory !== 'all' && (
            <>
              in <span className="text-[#111827] font-medium">{CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
            </>
          )}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredVideos.map((video, idx) => (
            <motion.div
              key={video.id}
              onClick={() => onWatch(video.url)}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-[#E8E5DF]">
                <img 
                  src={video.thumbnail?.match(/[0-9a-f]{8}-[0-9a-f]{4}-/)
                    ? getYouTubeThumbnail(video.url) || '/placeholder-video.jpg'
                    : video.thumbnail || getYouTubeThumbnail(video.url) || '/placeholder-video.jpg'}
                  alt={video.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy" />
                <div className="absolute inset-0 bg-[#1C1917]/20 group-hover:bg-[#1C1917]/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-5 h-5 text-[#1C1917] fill-[#1C1917] ml-0.5" />
                  </div>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-3 right-3 bg-[#1C1917]/80 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-1 rounded-lg">
                  {video.duration}
                </div>
                {/* Featured badge */}
                {video.featured && (
                  <div className="absolute top-3 left-3 bg-[#A6852F] text-white text-[9px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Featured
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-[#A6852F] font-medium tracking-wide uppercase">
                  <span>{video.source}</span>
                  <span className="text-[#D6D3D1]">·</span>
                  <span>{video.category.replace('-', ' ')}</span>
                </div>
                <h3 className="text-sm font-medium text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300 line-clamp-2 leading-snug">
                  {video.title}
                </h3>
                <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#71717A] font-medium">
                  <Calendar className="w-3 h-3" />
                  {video.date}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-8 h-8 text-[#D6D3D1] mx-auto mb-4" />
            <p className="text-sm text-[#57534E]">
              No media found in this category. Check back soon for updates.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
