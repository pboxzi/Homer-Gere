import React from 'react';
import { motion } from 'motion/react';
import { Heart, Trash2, ExternalLink } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatDate } from '../../utils/formatDate';

export const DashboardFavorites: React.FC = () => {
  const { favorites, toggleFavorite } = useDashboard();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Gallery Favorites</h1>
        <p className="text-sm text-[#57534E] mt-1">Your saved photos and media from the gallery.</p>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div
          className="rounded-2xl border border-dashed border-[#A6852F]/45 bg-[#A6852F]/8 p-6 sm:p-12 text-center shadow-sm hover:shadow-md transition-shadow duration-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Heart className="w-8 h-8 text-[#57534E]/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-[#1C1917]">No favorites yet</p>
          <p className="text-xs text-[#57534E] mt-1">Browse the Gallery and save photos you love.</p>
          <a href="/gallery" className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors">
            Browse Gallery <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {favorites.map((f, i) => (
            <motion.div
              key={f.id}
              className="group relative rounded-2xl overflow-hidden border border-[#A6852F]/45 bg-white shadow-md shadow-[#A6852F]/18 hover:shadow-lg hover:shadow-[#A6852F]/18 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
            >
              <div className="aspect-square overflow-hidden bg-[#F3F1ED]">
                <img src={f.src} alt={f.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" loading="lazy" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <button
                onClick={() => toggleFavorite(f)}
                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#DC2626] md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-white shadow-md shadow-[#DC2626]/15"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="p-2.5">
                <p className="text-[11px] font-medium text-[#1C1917] truncate">{f.alt}</p>
                <p className="text-[10px] text-[#57534E]/60 mt-0.5">{f.category} · {formatDate(f.favoritedAt)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
