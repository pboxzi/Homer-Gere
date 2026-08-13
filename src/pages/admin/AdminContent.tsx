import React from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Eye, CheckCircle, Clock, FileText } from 'lucide-react';
import { MOCK_ADMIN_PAGES } from '../../data/adminData';

export const AdminContent: React.FC = () => {
  const sections = ['Journey', 'Projects', 'Gallery', 'Media', 'Journal', 'FAQs'];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Content Management</h1>
        <p className="text-sm text-[#57534E] mt-1">Create, edit, publish, and manage all website content.</p>
      </motion.div>

      {/* Content Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, i) => (
          <motion.div
            key={section}
            className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5 hover:border-[#A6852F]/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#1C1917]">{section}</h3>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A6852F] hover:bg-[#A6852F]/10 transition-colors cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {MOCK_ADMIN_PAGES.slice(0, 2).map((page) => (
                <div key={page.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F3F1ED]/40 transition-colors">
                  <FileText className="w-3.5 h-3.5 text-[#57534E]" />
                  <span className="text-xs text-[#1C1917] flex-1">{page.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                    page.status === 'published' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                  }`}>{page.status}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">All Content</h3>
        <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_120px_100px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span>Title</span><span>Status</span><span>Last Modified</span><span>Actions</span>
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
