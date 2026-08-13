import React from 'react';
import { motion } from 'motion/react';
import { Image, Film, FileText, Upload, Trash2, Eye, Download } from 'lucide-react';
import { MOCK_ADMIN_MEDIA } from '../../data/adminData';

const TYPE_ICONS = { image: Image, video: Film, document: FileText };
const TYPE_COLORS = { image: '#A6852F', video: '#8B5CF6', document: '#3B82F6' };

export const AdminMediaLibrary: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Media Library</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage images, videos, and documents.</p>
      </motion.div>

      {/* Upload */}
      <motion.div
        className="rounded-2xl border-2 border-dashed border-[#E8E5DF] hover:border-[#A6852F]/40 bg-[#F3F1ED]/20 hover:bg-[#F3F1ED]/40 p-8 text-center transition-all cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Upload className="w-8 h-8 text-[#A6852F]/40 mx-auto mb-3" />
        <p className="text-sm font-medium text-[#1C1917]">Drag and drop files here</p>
        <p className="text-xs text-[#57534E] mt-1">or click to browse. Supports JPG, PNG, WebP, MP4, PDF.</p>
      </motion.div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_ADMIN_MEDIA.map((item, i) => {
          const Icon = TYPE_ICONS[item.type];
          const color = TYPE_COLORS[item.type];
          return (
            <motion.div
              key={item.id}
              className="rounded-2xl border border-[#E8E5DF]/60 bg-white overflow-hidden hover:border-[#A6852F]/20 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            >
              <div className="h-32 bg-[#F3F1ED]/60 flex items-center justify-center">
                <Icon className="w-10 h-10" style={{ color: `${color}40` }} />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-[#1C1917] truncate">{item.name}</p>
                <p className="text-[10px] text-[#57534E] mt-0.5">{item.size} — {item.date}</p>
                <div className="flex items-center gap-1 mt-2">
                  <button className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Eye className="w-3 h-3" /></button>
                  <button className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Download className="w-3 h-3" /></button>
                  <button className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
