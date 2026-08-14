import React from 'react';
import { motion } from 'motion/react';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const DashboardBookmarks: React.FC = () => {
  const { bookmarks, toggleBookmark } = useDashboard();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Journal Bookmarks</h1>
        <p className="text-sm text-[#57534E] mt-1">Articles and entries you've saved for later.</p>
      </motion.div>

      {bookmarks.length === 0 ? (
        <motion.div
          className="rounded-2xl border border-dashed border-[#A6852F]/20 bg-[#A6852F]/5 p-12 text-center shadow-sm hover:shadow-md transition-shadow duration-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Bookmark className="w-8 h-8 text-[#57534E]/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-[#1C1917]">No bookmarks yet</p>
          <p className="text-xs text-[#57534E] mt-1">Browse the Journal and save articles you want to read later.</p>
          <a href="/journal" className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors">
            Browse Journal <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b, i) => (
            <motion.div
              key={b.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-[#A6852F]/20 bg-white hover:border-[#A6852F]/35 transition-all duration-500 shadow-sm shadow-[#A6852F]/5 hover:shadow-md hover:shadow-[#A6852F]/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
            >
              {b.image && (
                <img src={b.image} alt={b.title} className="w-16 h-16 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" loading="lazy" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-medium text-[#A6852F] uppercase">{b.category}</span>
                  <span className="text-[10px] text-[#57534E]/60">· {b.bookmarkedAt}</span>
                </div>
                <p className="text-sm font-medium text-[#1C1917] truncate">{b.title}</p>
                <p className="text-xs text-[#57534E] mt-0.5 line-clamp-1">{b.excerpt}</p>
              </div>
              <button onClick={() => toggleBookmark(b)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
