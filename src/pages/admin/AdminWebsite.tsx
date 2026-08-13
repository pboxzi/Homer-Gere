import React from 'react';
import { motion } from 'motion/react';
import { Globe, Eye, Edit, Trash2, Plus, Clock, CheckCircle, FileText } from 'lucide-react';
import { MOCK_ADMIN_PAGES } from '../../data/adminData';

export const AdminWebsite: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Website Management</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage homepage, navigation, footer, menus, and SEO settings.</p>
      </motion.div>

      {/* Quick Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Homepage', desc: 'Hero, sections, CTAs', count: 'Published' },
          { label: 'Navigation', desc: 'Nav items, ordering', count: '9 items' },
          { label: 'Footer', desc: 'Links, social, legal', count: 'Published' },
          { label: 'SEO Settings', desc: 'Meta tags, OG images', count: 'Configured' },
        ].map((item, i) => (
          <motion.button
            key={item.label}
            className="text-left p-5 rounded-2xl border border-[#E8E5DF]/60 bg-white hover:border-[#A6852F]/30 hover:bg-[#A6852F]/5 transition-all cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] mb-3 group-hover:bg-[#A6852F] group-hover:text-white transition-all duration-500">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-[#1C1917] group-hover:text-[#A6852F] transition-colors">{item.label}</h3>
            <p className="text-[11px] text-[#57534E] mt-0.5">{item.desc}</p>
            <p className="text-[10px] text-[#16A34A] font-medium mt-2">{item.count}</p>
          </motion.button>
        ))}
      </div>

      {/* Pages */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[#1C1917]">Pages</h3>
          <button className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add Page
          </button>
        </div>
        <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_120px_100px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span>Page</span><span>Status</span><span>Last Modified</span><span>Actions</span>
          </div>
          {MOCK_ADMIN_PAGES.map((page) => (
            <div key={page.id} className="grid grid-cols-[1fr_100px_120px_100px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#57534E]" />
                <span className="text-sm text-[#1C1917]">{page.title}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 w-fit ${
                page.status === 'published' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
              }`}>
                {page.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {page.status}
              </span>
              <span className="text-xs text-[#57534E]">{page.lastModified}</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
