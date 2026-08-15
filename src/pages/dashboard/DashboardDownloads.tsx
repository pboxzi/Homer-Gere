import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Download, FileText, Image, Film, Music, Search, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { downloadItemsRepository, memberDownloadsRepository } from '../../lib/repositories';
import type { DownloadItem } from '../../types/database';

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.FC<{ className?: string }>; color: string }> = {
  membership: { label: 'Membership', icon: FileText, color: '#A6852F' },
  experience: { label: 'Experience', icon: Film, color: '#8B5CF6' },
  invoice: { label: 'Invoices', icon: FileText, color: '#3B82F6' },
  receipt: { label: 'Receipts', icon: FileText, color: '#16A34A' },
  exclusive: { label: 'Exclusive', icon: Star, color: '#F59E0B' },
  general: { label: 'General', icon: FileText, color: '#57534E' },
};

function Star(props: { className?: string }) {
  return <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}

const FILE_TYPE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  pdf: FileText,
  image: Image,
  video: Film,
  audio: Music,
  document: FileText,
};

export default function DashboardDownloads() {
  const { user } = useAuth();
  const { logActivity } = useDashboard();
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [allItems, myDownloads] = await Promise.all([
        downloadItemsRepository.getActive(),
        memberDownloadsRepository.getByUserId(user.id),
      ]);
      setItems(allItems);
      setDownloaded(new Set(myDownloads.map((d) => d.download_item_id)));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const handleDownload = async (item: DownloadItem) => {
    if (!user?.id) return;
    try {
      await memberDownloadsRepository.recordDownload(user.id, item.id);
      setDownloaded((prev) => new Set([...prev, item.id]));
      logActivity('download', 'downloads', `Downloaded: ${item.title}`, { item_id: item.id, title: item.title });
      // Open file in new tab
      window.open(item.file_url, '_blank');
    } catch (e) { console.error(e); }
  };

  const filtered = items.filter((item) => {
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Downloads</h1>
        <p className="text-sm text-[#57534E] mt-1">Access your membership documents, invoices, and exclusive content.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Items', value: items.length, color: '#A6852F' },
          { label: 'Downloaded', value: downloaded.size, color: '#16A34A' },
          { label: 'Available', value: items.filter((i) => !downloaded.has(i.id)).length, color: '#3B82F6' },
        ].map((s, i) => (
          <motion.div key={s.label} className="rounded-xl p-4 text-center border" style={{ borderColor: `${s.color}35`, background: `linear-gradient(135deg, ${s.color}18, ${s.color}06)`, boxShadow: `0 0 25px ${s.color}27, 0 4px 15px ${s.color}1B` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
            <p className="text-lg font-editorial" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] font-medium text-[#57534E]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]/40" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search downloads..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#A6852F]/45 text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${filterCategory === cat ? 'bg-[#A6852F] text-white' : 'bg-white border border-[#A6852F]/45 text-[#57534E] hover:bg-[#A6852F]/22'}`}>
              {cat === 'all' ? 'All' : CATEGORY_CONFIG[cat]?.label || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      {loading ? (
        <div className="text-center py-12 text-[#57534E]">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/30 p-6 sm:p-12 text-center">
          <Download className="w-8 h-8 text-[#57534E]/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-[#1C1917]">{searchQuery ? 'No matching downloads' : 'No downloads available yet'}</p>
          <p className="text-xs text-[#57534E] mt-1">{searchQuery ? 'Try a different search term' : 'Check back later for new content'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => {
            const catConfig = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.general;
            const CatIcon = catConfig.icon;
            const isDownloaded = downloaded.has(item.id);
            return (
              <motion.div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#A6852F]/45 bg-white hover:border-[#A6852F]/52 transition-all duration-300 shadow-md shadow-[#A6852F]/18 hover:shadow-lg hover:shadow-[#A6852F]/18" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${catConfig.color}18`, color: catConfig.color, boxShadow: `0 0 12px ${catConfig.color}22` }}>
                  <CatIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#1C1917] truncate">{item.title}</p>
                    {isDownloaded && <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />}
                  </div>
                  {item.description && <p className="text-xs text-[#57534E] mt-0.5 truncate">{item.description}</p>}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${catConfig.color}12`, color: catConfig.color }}>{catConfig.label}</span>
                    <span className="text-[10px] text-[#57534E]/60">{item.file_type.toUpperCase()}</span>
                    {item.file_size > 0 && <span className="text-[10px] text-[#57534E]/60">{(item.file_size / 1024 / 1024).toFixed(1)} MB</span>}
                  </div>
                </div>
                <button onClick={() => handleDownload(item)} className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-medium transition-all cursor-pointer ${isDownloaded ? 'bg-[#16A34A]/22 text-[#16A34A] hover:bg-[#16A34A]/20' : 'bg-[#A6852F] text-white hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/30'}`}>
                  <Download className="w-3.5 h-3.5" />
                  {isDownloaded ? 'Downloaded' : 'Download'}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
