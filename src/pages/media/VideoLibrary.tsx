import React, { useState } from 'react';
import { Play, Clock, Calendar, ExternalLink } from 'lucide-react';
import { MEDIA_VIDEOS } from '../../data/content';
import { MediaCategory } from '../../types';

interface VideoLibraryProps {
  onWatch: (url: string) => void;
}

const CATEGORIES: { id: MediaCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'trailers', label: 'Trailers' },
  { id: 'behind-the-scenes', label: 'Behind the Scenes' },
  { id: 'press', label: 'Press' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'promotional', label: 'Promotional' },
  { id: 'event-coverage', label: 'Event Coverage' },
];

export const VideoLibrary: React.FC<VideoLibraryProps> = ({ onWatch }) => {
  const [activeCategory, setActiveCategory] = useState<MediaCategory>('all');

  const filteredVideos =
    activeCategory === 'all'
      ? MEDIA_VIDEOS
      : MEDIA_VIDEOS.filter((v) => v.category === activeCategory);

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
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
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 focus:outline-none cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#C9A84C] text-white'
                  : 'bg-[#F3F1ED] text-[#57534E] hover:bg-[#E8E5DF] hover:text-[#1C1917]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => onWatch(video.url)}
              className="group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#1C1917]/20 group-hover:bg-[#1C1917]/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-5 h-5 text-[#1C1917] fill-[#1C1917] ml-0.5" />
                  </div>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-3 right-3 bg-[#1C1917]/80 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg">
                  {video.duration}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-[#57534E] font-medium tracking-wide uppercase">
                  <span>{video.source}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {video.date}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-[#1C1917] group-hover:text-[#C9A84C] transition-colors duration-300 line-clamp-2 leading-snug">
                  {video.title}
                </h3>
                <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-[#57534E]">
              No media found in this category. Check back soon for updates.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
