import React from 'react';
import { ArrowRight, Play, Calendar } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { formatDate } from '../utils/formatDate';

interface MediaSectionProps {
  onNavigate: (sectionId: string) => void;
}

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

export const MediaSection: React.FC<MediaSectionProps> = ({ onNavigate }) => {
  const { mediaVideos } = useSiteContent();

  return (
    <section id="media" className="py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
              Media
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] mt-3 tracking-tight hover-underline">
              Videos & Interviews
            </h2>
          </div>

          <button
            onClick={() => onNavigate('media')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1C1917] hover:text-[#A6852F] transition-colors duration-300 group focus:outline-none cursor-pointer"
          >
            View All Media
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Video Grid — 6 items only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {mediaVideos.slice(0, 6).map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-[#E8E5DF]">
                <img
                  src={
                    video.thumbnail?.match(/[0-9a-f]{8}-[0-9a-f]{4}-/)
                      ? getYouTubeThumbnail(video.url) || '/placeholder-video.jpg'
                      : video.thumbnail || getYouTubeThumbnail(video.url) || '/placeholder-video.jpg'
                  }
                  alt={video.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#1C1917]/20 group-hover:bg-[#1C1917]/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-4 h-4 text-[#1C1917] fill-[#1C1917] ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-[#1C1917]/80 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-1 rounded-lg">
                  {video.duration}
                </div>
                {video.featured && (
                  <div className="absolute top-2.5 left-2.5 bg-[#A6852F] text-white text-[9px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Featured
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] text-[#A6852F] font-medium tracking-wide uppercase">
                  <span>{video.source}</span>
                  <span className="text-[#D6D3D1]">·</span>
                  <span>{video.category.replace('-', ' ')}</span>
                </div>
                <h3 className="text-sm font-medium text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300 line-clamp-2 leading-snug">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-[#71717A] font-medium">
                  <Calendar className="w-3 h-3" />
                  {formatDate(video.date)}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
