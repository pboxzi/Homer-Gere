import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  FileText,
  ChevronUp,
  ChevronDown,
  Search,
  X,
  ToggleLeft,
  ToggleRight,
  Loader2,
  RotateCcw,
  Archive,
  Copy,
  Upload,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { AdminSection } from '../../data/adminData';
import { useAuth } from '../../context/AuthContext';
import {
  journeyRepository,
  journalRepository,
  filmographyRepository,
  galleryRepository,
  mediaRepository,
  faqRepository,
  projectsRepository,
  auditLogsRepository,
} from '../../lib/repositories';
import type {
  JourneyEntry,
  JournalArticle,
  FilmographyEntry,
  GalleryPhoto,
  GalleryCategory,
  MediaVideo,
  MediaPodcast,
  MediaPress,
  Faq,
  Project,
} from '../../types/database';

interface AdminContentProps {
  activeSection: AdminSection;
}

const SECTION_TITLES: Record<string, string> = {
  journey: 'Journey',
  projects: 'Projects',
  gallery: 'Gallery',
  'media-content': 'Media Content',
  journal: 'Journal',
  faqs: 'FAQs',
};

const STATUS_OPTIONS = ['All', 'Published', 'Draft', 'Scheduled', 'Archived'] as const;
const PAGE_SIZE = 10;

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'published':
      return 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/20';
    case 'draft':
      return 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20';
    case 'scheduled':
      return 'bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/20';
    case 'archived':
      return 'bg-[#9CA3AF]/10 text-[#9CA3AF] border border-[#9CA3AF]/15';
    default:
      return 'bg-[#9CA3AF]/10 text-[#9CA3AF] border border-[#9CA3AF]/15';
  }
}

function statusIcon(status: string) {
  switch (status) {
    case 'published':
      return <CheckCircle className="w-3 h-3" />;
    case 'draft':
      return <Clock className="w-3 h-3" />;
    case 'scheduled':
      return <Clock className="w-3 h-3" />;
    default:
      return null;
  }
}

// ============================================================
// Stats Bar Component
// ============================================================
function StatsBar({ total, published, draft, archived }: { total: number; published: number; draft: number; archived: number }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {[
        { label: 'Total', value: total, color: '#1C1917' },
        { label: 'Published', value: published, color: '#16A34A' },
        { label: 'Draft', value: draft, color: '#F59E0B' },
        { label: 'Archived', value: archived, color: '#9CA3AF' },
      ].map((stat) => (
        <div key={stat.label} className="rounded-xl border p-3 text-center transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: `${stat.color}40`, borderColor: `${stat.color}90`, boxShadow: `0 0 40px ${stat.color}35` }}>
          <p className="text-lg font-medium" style={{ color: stat.color }}>{stat.value}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: stat.color, opacity: 0.7 }}>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Journey CMS
// ============================================================
function JourneyCMS() {
  const { user } = useAuth();
  const [items, setItems] = useState<JourneyEntry[]>([]);
  const [deletedItems, setDeletedItems] = useState<JourneyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showTrash, setShowTrash] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  const [addForm, setAddForm] = useState({ title: '', description: '', year: new Date().getFullYear(), highlight: false, status: 'published' });
  const [editForm, setEditForm] = useState({ title: '', description: '', year: 2024, highlight: false, status: 'published' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [allRes, deletedRes] = await Promise.allSettled([
        journeyRepository.getAll(),
        journeyRepository.getDeleted(),
      ]);
      if (allRes.status === 'fulfilled') setItems(allRes.value);
      if (deletedRes.status === 'fulfilled') setDeletedItems(deletedRes.value);
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = search === '' || item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const stats = useMemo(() => ({
    total: items.length,
    published: items.filter(i => i.status === 'published').length,
    draft: items.filter(i => i.status === 'draft').length,
    archived: items.filter(i => i.status === 'archived').length,
  }), [items]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAdd = async () => {
    if (!addForm.title.trim()) return;
    const optimistic: JourneyEntry = {
      id: 'temp-' + Date.now(), year: addForm.year, title: addForm.title, description: addForm.description,
      details: null, highlight: addForm.highlight, icon_name: null, image_url: null, sort_order: items.length,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      status: addForm.status, deleted_at: null, deleted_by: null, created_by: null,
      seo_title: null, seo_description: null, seo_keywords: null, og_image: null, canonical_url: null, version: 1,
    };
    setItems(prev => [optimistic, ...prev]);
    setShowAddForm(false);
    setAddForm({ title: '', description: '', year: new Date().getFullYear(), highlight: false, status: 'published' });
    try {
      const created = await journeyRepository.create({ title: addForm.title, description: addForm.description, year: addForm.year, highlight: addForm.highlight, status: addForm.status, sort_order: 0 });
      setItems(prev => prev.map(i => i.id === optimistic.id ? created : i));
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'create', table_name: 'journey_entries', record_id: created.id, new_data: JSON.parse(JSON.stringify(created)), module: 'journey' });
      showSuccess('Journey entry created');
    } catch { setItems(prev => prev.filter(i => i.id !== optimistic.id)); }
  };

  const handleSaveEdit = async (id: string) => {
    const original = items.find(i => i.id === id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...editForm } : i));
    setEditingId(null);
    try {
      await journeyRepository.update(id, editForm);
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'update', table_name: 'journey_entries', record_id: id, old_data: JSON.parse(JSON.stringify(original)), new_data: JSON.parse(JSON.stringify(editForm)), module: 'journey' });
      showSuccess('Journey entry updated');
    } catch { /* optimistic */ }
  };

  const handleSoftDelete = async (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
    if (item) setDeletedItems(prev => [item, ...prev]);
    setDeleteConfirmId(null);
    try {
      await journeyRepository.softDelete(id);
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'delete', table_name: 'journey_entries', record_id: id, old_data: JSON.parse(JSON.stringify(item)), module: 'journey' });
      showSuccess('Moved to trash');
    } catch { /* optimistic */ }
  };

  const handleRestore = async (id: string) => {
    const item = deletedItems.find(i => i.id === id);
    setDeletedItems(prev => prev.filter(i => i.id !== id));
    if (item) setItems(prev => [item, ...prev]);
    try {
      await journeyRepository.restore(id);
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'update', table_name: 'journey_entries', record_id: id, module: 'journey' });
      showSuccess('Restored');
    } catch { /* optimistic */ }
  };

  const handlePermanentDelete = async (id: string) => {
    setDeletedItems(prev => prev.filter(i => i.id !== id));
    try {
      await journeyRepository.delete(id);
      showSuccess('Permanently deleted');
    } catch { /* optimistic */ }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" /></div>;

  return (
    <div className="space-y-4">
      {successMsg && (
        <div className="px-4 py-2 rounded-xl bg-[#16A34A]/10 text-[#16A34A] text-sm font-medium">{successMsg}</div>
      )}
      <StatsBar {...stats} />
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]" />
          <input type="text" placeholder="Search journey..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917]">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowTrash(!showTrash)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${showTrash ? 'bg-[#DC2626]/10 text-[#DC2626]' : 'border border-[#E8E5DF]/60 text-[#57534E] hover:bg-[#F3F1ED]'}`}>
          <Trash2 className="w-3.5 h-3.5" /> Trash ({deletedItems.length})
        </button>
        <button onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add New
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#1C1917]">Add Journey Entry</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input placeholder="Title" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <input placeholder="Year" type="number" value={addForm.year} onChange={(e) => setAddForm({ ...addForm, year: parseInt(e.target.value) || 2024 })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <select value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value })} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm">
                  <option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option>
                </select>
              </div>
              <textarea placeholder="Description" value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm resize-none" />
              <div className="flex items-center gap-3">
                <button onClick={() => setAddForm({ ...addForm, highlight: !addForm.highlight })} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm cursor-pointer">
                  {addForm.highlight ? <ToggleRight className="w-5 h-5 text-[#16A34A]" /> : <ToggleLeft className="w-5 h-5 text-[#9CA3AF]" />}
                  <span className="text-xs text-[#57534E]">{addForm.highlight ? 'Highlight' : 'Normal'}</span>
                </button>
                <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showTrash ? (
        <div className="rounded-2xl border border-[#DC2626]/10 bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Trash</div>
          {deletedItems.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-[#57534E]">Trash is empty.</div>
          ) : deletedItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0">
              <span className="text-sm text-[#1C1917]">{item.title}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleRestore(item.id)} className="px-3 py-1.5 rounded-lg bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-medium cursor-pointer">Restore</button>
                <button onClick={() => handlePermanentDelete(item.id)} className="px-3 py-1.5 rounded-lg bg-[#DC2626]/10 text-[#DC2626] text-[10px] font-medium cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl border border-[#A6852F]/10 bg-white overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_80px_80px_100px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
              <span>Title</span><span>Year</span><span>Status</span><span>Highlight</span><span>Actions</span>
            </div>
            {paginated.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-[#57534E]">No items found.</div>
            ) : paginated.map((item) => (
              <div key={item.id}>
                {editingId === item.id ? (
                  <div className="px-5 py-3 border-b border-[#E8E5DF]/20 bg-[#F3F1ED]/20 space-y-2">
                    <div className="grid grid-cols-[1fr_80px_80px] gap-3 items-center">
                      <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                      <input value={editForm.year} type="number" onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) || 2024 })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                      <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm">
                        <option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option>
                      </select>
                    </div>
                    <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm resize-none" />
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleSaveEdit(item.id)} className="px-3 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium cursor-pointer">Save</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[10px] font-medium text-[#57534E] cursor-pointer">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-[1fr_80px_80px_80px_100px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
                    <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#57534E] shrink-0" /><span className="text-sm text-[#1C1917] truncate">{item.title}</span></div>
                    <span className="text-xs text-[#57534E]">{item.year}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 w-fit ${statusBadgeClass(item.status)}`}>{statusIcon(item.status)}{item.status}</span>
                    <span className="text-xs text-[#57534E]">{item.highlight ? 'Yes' : 'No'}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditingId(item.id); setEditForm({ title: item.title, description: item.description, year: item.year, highlight: item.highlight, status: item.status }); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleSoftDelete(item.id)} className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirmId(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#E8E5DF]/40">
                <span className="text-xs text-[#57534E]">{filtered.length} items</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs text-[#57534E]">{page}/{totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paginated.length === 0 ? (
              <div className="text-center py-10 text-sm text-[#57534E]">No items found.</div>
            ) : paginated.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-[#E8E5DF]/60 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1C1917]">{item.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBadgeClass(item.status)}`}>{item.status}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#57534E]">{item.year} · Highlight: {item.highlight ? 'Yes' : 'No'}</p>
                  {item.description && <p className="text-xs text-[#57534E] line-clamp-2">{item.description}</p>}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => { setEditingId(item.id); setEditForm({ title: item.title, description: item.description, year: item.year, highlight: item.highlight, status: item.status }); }}
                    className="flex-1 min-h-[44px] rounded-lg bg-[#F3F1ED] text-[#57534E] text-xs font-medium hover:bg-[#E8E5DF] transition-colors cursor-pointer flex items-center justify-center gap-1">Edit</button>
                  <button onClick={() => setDeleteConfirmId(item.id)}
                    className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626]/10 text-[#DC2626] text-xs font-medium hover:bg-[#DC2626]/20 transition-colors cursor-pointer flex items-center justify-center gap-1">Delete</button>
                </div>
                {deleteConfirmId === item.id && (
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => handleSoftDelete(item.id)} className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm Delete</button>
                    <button onClick={() => setDeleteConfirmId(null)} className="flex-1 min-h-[44px] rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">Cancel</button>
                  </div>
                )}
              </div>
            ))}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#57534E]">{filtered.length} items</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs text-[#57534E]">{page}/{totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// Projects CMS
// ============================================================
function ProjectsCMS() {
  const { user } = useAuth();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  const [addForm, setAddForm] = useState({ title: '', slug: '', year: new Date().getFullYear(), type: 'film' as string, status: 'announced' as string, tagline: '', synopsis: '', genre: '', director: '' });
  const [editForm, setEditForm] = useState({ title: '', slug: '', year: 2024, type: 'film', status: 'announced', tagline: '', synopsis: '', genre: '', director: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try { const res = await projectsRepository.getAll(); setItems(res); } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = search === '' || item.title.toLowerCase().includes(search.toLowerCase()) || (item.synopsis || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const stats = useMemo(() => ({
    total: items.length, published: items.filter(i => i.status === 'released').length,
    draft: items.filter(i => i.status === 'announced').length, archived: items.filter(i => i.status === 'in_production').length,
  }), [items]);

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleAdd = async () => {
    if (!addForm.title.trim()) return;
    const slug = addForm.slug || addForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const created = await projectsRepository.create({ ...addForm, slug, type: addForm.type as any, status: addForm.status as any });
      setItems(prev => [created, ...prev]);
      setShowAddForm(false);
      setAddForm({ title: '', slug: '', year: new Date().getFullYear(), type: 'film', status: 'announced', tagline: '', synopsis: '', genre: '', director: '' });
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'create', table_name: 'projects', record_id: created.id, new_data: JSON.parse(JSON.stringify(created)), module: 'projects' });
      showSuccess('Project created');
    } catch { /* empty */ }
  };

  const handleSaveEdit = async (id: string) => {
    const original = items.find(i => i.id === id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...editForm, type: editForm.type as any, status: editForm.status as any } : i));
    setEditingId(null);
    try {
      await projectsRepository.update(id, editForm as any);
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'update', table_name: 'projects', record_id: id, old_data: JSON.parse(JSON.stringify(original)), new_data: JSON.parse(JSON.stringify(editForm)), module: 'projects' });
      showSuccess('Project updated');
    } catch { /* optimistic */ }
  };

  const handleSoftDelete = async (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleteConfirmId(null);
    try {
      await projectsRepository.softDelete(id);
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'delete', table_name: 'projects', record_id: id, old_data: JSON.parse(JSON.stringify(item)), module: 'projects' });
      showSuccess('Moved to trash');
    } catch { /* optimistic */ }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" /></div>;

  return (
    <div className="space-y-4">
      {successMsg && <div className="px-4 py-2 rounded-xl bg-[#16A34A]/10 text-[#16A34A] text-sm font-medium">{successMsg}</div>}
      <StatsBar {...stats} />
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]" />
          <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917]">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add New
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#1C1917]">Add Project</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Title" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <input placeholder="Slug (auto-generated)" value={addForm.slug} onChange={(e) => setAddForm({ ...addForm, slug: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <input placeholder="Year" type="number" value={addForm.year} onChange={(e) => setAddForm({ ...addForm, year: parseInt(e.target.value) || 2024 })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <select value={addForm.type} onChange={(e) => setAddForm({ ...addForm, type: e.target.value })} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm">
                  <option value="film">Film</option><option value="series">Series</option><option value="short">Short</option><option value="documentary">Documentary</option>
                </select>
                <select value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value })} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm">
                  <option value="announced">Announced</option><option value="in_production">In Production</option><option value="post_production">Post Production</option><option value="released">Released</option>
                </select>
                <input placeholder="Director" value={addForm.director} onChange={(e) => setAddForm({ ...addForm, director: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
              </div>
              <input placeholder="Tagline" value={addForm.tagline} onChange={(e) => setAddForm({ ...addForm, tagline: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
              <textarea placeholder="Synopsis" value={addForm.synopsis} onChange={(e) => setAddForm({ ...addForm, synopsis: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm resize-none" />
              <div className="flex items-center gap-3">
                <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <>
        {/* Desktop table */}
        <div className="hidden md:block rounded-2xl border border-[#A6852F]/10 bg-white overflow-hidden">
          <div className="grid grid-cols-[1fr_60px_80px_80px_80px_80px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span>Title</span><span>Year</span><span>Type</span><span>Status</span><span>Director</span><span>Actions</span>
          </div>
          {paginated.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-[#57534E]">No projects found.</div>
          ) : paginated.map((item) => (
            <div key={item.id}>
              {editingId === item.id ? (
                <div className="px-5 py-3 border-b border-[#E8E5DF]/20 bg-[#F3F1ED]/20 space-y-2">
                  <div className="grid grid-cols-[1fr_60px_80px_80px] gap-3 items-center">
                    <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                    <input value={editForm.year} type="number" onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) || 2024 })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                    <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm">
                      <option value="film">Film</option><option value="series">Series</option><option value="short">Short</option><option value="documentary">Documentary</option>
                    </select>
                    <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm">
                      <option value="announced">Announced</option><option value="in_production">In Production</option><option value="post_production">Post Production</option><option value="released">Released</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleSaveEdit(item.id)} className="px-3 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium cursor-pointer">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[10px] font-medium text-[#57534E] cursor-pointer">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-[1fr_60px_80px_80px_80px_80px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
                  <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#57534E] shrink-0" /><span className="text-sm text-[#1C1917] truncate">{item.title}</span></div>
                  <span className="text-xs text-[#57534E]">{item.year}</span>
                  <span className="text-xs text-[#57534E]">{item.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium w-fit ${statusBadgeClass(item.status === 'released' ? 'published' : item.status === 'announced' ? 'draft' : 'scheduled')}`}>{item.status}</span>
                  <span className="text-xs text-[#57534E] truncate">{item.director || '—'}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingId(item.id); setEditForm({ title: item.title, slug: item.slug, year: item.year, type: item.type, status: item.status, tagline: item.tagline || '', synopsis: item.synopsis || '', genre: item.genre || '', director: item.director || '' }); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleSoftDelete(item.id)} className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E8E5DF]/40">
              <span className="text-xs text-[#57534E]">{filtered.length} items</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-xs text-[#57534E]">{page}/{totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {paginated.length === 0 ? (
            <div className="text-center py-10 text-sm text-[#57534E]">No projects found.</div>
          ) : paginated.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-[#E8E5DF]/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#1C1917]">{item.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBadgeClass(item.status === 'released' ? 'published' : item.status === 'announced' ? 'draft' : 'scheduled')}`}>{item.status}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#57534E]">{item.year} · {item.type}{item.director ? ` · Dir: ${item.director}` : ''}</p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => { setEditingId(item.id); setEditForm({ title: item.title, slug: item.slug, year: item.year, type: item.type, status: item.status, tagline: item.tagline || '', synopsis: item.synopsis || '', genre: item.genre || '', director: item.director || '' }); }}
                  className="flex-1 min-h-[44px] rounded-lg bg-[#F3F1ED] text-[#57534E] text-xs font-medium hover:bg-[#E8E5DF] transition-colors cursor-pointer flex items-center justify-center gap-1">Edit</button>
                <button onClick={() => setDeleteConfirmId(item.id)}
                  className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626]/10 text-[#DC2626] text-xs font-medium hover:bg-[#DC2626]/20 transition-colors cursor-pointer flex items-center justify-center gap-1">Delete</button>
              </div>
              {deleteConfirmId === item.id && (
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => handleSoftDelete(item.id)} className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm Delete</button>
                  <button onClick={() => setDeleteConfirmId(null)} className="flex-1 min-h-[44px] rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">Cancel</button>
                </div>
              )}
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#57534E]">{filtered.length} items</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-xs text-[#57534E]">{page}/{totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
}

// ============================================================
// Gallery CMS
// ============================================================
function GalleryCMS() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  const [addForm, setAddForm] = useState({ src: '', alt: '', caption: '', category: 'portraits', photographer: '', featured: false });
  const [editForm, setEditForm] = useState({ src: '', alt: '', caption: '', category: 'portraits', photographer: '', featured: false });

  const loadData = useCallback(async () => {
    setLoading(true);
    try { const res = await galleryRepository.getAllPhotos(); setPhotos(res); } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    return photos.filter((p) => {
      const matchesSearch = search === '' || p.alt.toLowerCase().includes(search.toLowerCase()) || (p.caption || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [photos, search, statusFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const stats = useMemo(() => ({
    total: photos.length, published: photos.filter(p => p.status === 'published').length,
    draft: photos.filter(p => p.status === 'draft').length, archived: photos.filter(p => p.status === 'archived').length,
  }), [photos]);

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleAdd = async () => {
    if (!addForm.alt.trim()) return;
    try {
      const created = await galleryRepository.createPhoto({ src: addForm.src || '', alt: addForm.alt, caption: addForm.caption || null, category: addForm.category as any, photographer: addForm.photographer || null, featured: addForm.featured, date: null, event: null, collection_id: null, sort_order: photos.length, status: 'published' });
      setPhotos(prev => [created as any, ...prev]);
      setShowAddForm(false);
      setAddForm({ src: '', alt: '', caption: '', category: 'portraits', photographer: '', featured: false });
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'create', table_name: 'gallery_photos', record_id: created.id, new_data: JSON.parse(JSON.stringify(created)), module: 'gallery' });
      showSuccess('Photo added');
    } catch { /* empty */ }
  };

  const handleSaveEdit = async (id: string) => {
    const original = photos.find(p => p.id === id);
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, ...editForm, category: editForm.category as GalleryCategory } : p));
    setEditingId(null);
    try {
      await galleryRepository.updatePhoto(id, editForm as any);
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'update', table_name: 'gallery_photos', record_id: id, old_data: JSON.parse(JSON.stringify(original)), new_data: JSON.parse(JSON.stringify(editForm)), module: 'gallery' });
      showSuccess('Photo updated');
    } catch { /* optimistic */ }
  };

  const handleSoftDelete = async (id: string) => {
    const photo = photos.find(p => p.id === id);
    setPhotos(prev => prev.filter(p => p.id !== id));
    setDeleteConfirmId(null);
    try {
      await galleryRepository.softDeletePhoto(id);
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'delete', table_name: 'gallery_photos', record_id: id, old_data: JSON.parse(JSON.stringify(photo)), module: 'gallery' });
      showSuccess('Moved to trash');
    } catch { /* optimistic */ }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" /></div>;

  return (
    <div className="space-y-4">
      {successMsg && <div className="px-4 py-2 rounded-xl bg-[#16A34A]/10 text-[#16A34A] text-sm font-medium">{successMsg}</div>}
      <StatsBar {...stats} />
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]" />
          <input type="text" placeholder="Search photos..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917]">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add Photo
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#1C1917]">Add Photo</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Image URL" value={addForm.src} onChange={(e) => setAddForm({ ...addForm, src: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <input placeholder="Alt Text" value={addForm.alt} onChange={(e) => setAddForm({ ...addForm, alt: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <select value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm">
                  <option value="premiere">Premiere</option><option value="behind-the-scenes">Behind the Scenes</option><option value="portraits">Portraits</option>
                  <option value="events">Events</option><option value="on-set">On Set</option><option value="press">Press</option><option value="personal">Personal</option><option value="editorial">Editorial</option>
                </select>
                <input placeholder="Photographer" value={addForm.photographer} onChange={(e) => setAddForm({ ...addForm, photographer: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
              </div>
              <input placeholder="Caption" value={addForm.caption} onChange={(e) => setAddForm({ ...addForm, caption: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
              <div className="flex items-center gap-3">
                <button onClick={() => setAddForm({ ...addForm, featured: !addForm.featured })} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm cursor-pointer">
                  {addForm.featured ? <ToggleRight className="w-5 h-5 text-[#16A34A]" /> : <ToggleLeft className="w-5 h-5 text-[#9CA3AF]" />}
                  <span className="text-xs text-[#57534E]">{addForm.featured ? 'Featured' : 'Not Featured'}</span>
                </button>
                <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <>
        {/* Desktop table */}
        <div className="hidden md:block rounded-2xl border border-[#A6852F]/10 bg-white overflow-hidden">
          <div className="grid grid-cols-[80px_1fr_100px_80px_80px_80px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span>Image</span><span>Alt</span><span>Category</span><span>Photographer</span><span>Status</span><span>Actions</span>
          </div>
          {paginated.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-[#57534E]">No photos found.</div>
          ) : paginated.map((photo) => (
            <div key={photo.id}>
              {editingId === photo.id ? (
                <div className="px-5 py-3 border-b border-[#E8E5DF]/20 bg-[#F3F1ED]/20 space-y-2">
                  <div className="grid grid-cols-[1fr_100px_80px] gap-3 items-center">
                    <input value={editForm.alt} onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                    <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm">
                      <option value="premiere">Premiere</option><option value="behind-the-scenes">BTS</option><option value="portraits">Portraits</option>
                      <option value="events">Events</option><option value="on-set">On Set</option><option value="press">Press</option><option value="personal">Personal</option><option value="editorial">Editorial</option>
                    </select>
                    <input value={editForm.photographer} onChange={(e) => setEditForm({ ...editForm, photographer: e.target.value })} placeholder="Photographer" className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                  </div>
                  <input value={editForm.caption} onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })} placeholder="Caption" className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleSaveEdit(photo.id)} className="px-3 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium cursor-pointer">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[10px] font-medium text-[#57534E] cursor-pointer">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-[80px_1fr_100px_80px_80px_80px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-[#F3F1ED] overflow-hidden">
                    {photo.src ? <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Upload className="w-4 h-4 text-[#57534E]" /></div>}
                  </div>
                  <span className="text-sm text-[#1C1917] truncate">{photo.alt}</span>
                  <span className="text-xs text-[#57534E]">{photo.category}</span>
                  <span className="text-xs text-[#57534E] truncate">{photo.photographer || '—'}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium w-fit ${statusBadgeClass(photo.status)}`}>{photo.status}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingId(photo.id); setEditForm({ src: photo.src, alt: photo.alt, caption: photo.caption || '', category: photo.category, photographer: photo.photographer || '', featured: photo.featured }); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                    {deleteConfirmId === photo.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleSoftDelete(photo.id)} className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(photo.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E8E5DF]/40">
              <span className="text-xs text-[#57534E]">{filtered.length} items</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-xs text-[#57534E]">{page}/{totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {paginated.length === 0 ? (
            <div className="text-center py-10 text-sm text-[#57534E]">No photos found.</div>
          ) : paginated.map((photo) => (
            <div key={photo.id} className="bg-white rounded-xl border border-[#E8E5DF]/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#1C1917]">{photo.alt}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBadgeClass(photo.status)}`}>{photo.status}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#57534E]">{photo.category}{photo.photographer ? ` · ${photo.photographer}` : ''}</p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => { setEditingId(photo.id); setEditForm({ src: photo.src, alt: photo.alt, caption: photo.caption || '', category: photo.category, photographer: photo.photographer || '', featured: photo.featured }); }}
                  className="flex-1 min-h-[44px] rounded-lg bg-[#F3F1ED] text-[#57534E] text-xs font-medium hover:bg-[#E8E5DF] transition-colors cursor-pointer flex items-center justify-center gap-1">Edit</button>
                <button onClick={() => setDeleteConfirmId(photo.id)}
                  className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626]/10 text-[#DC2626] text-xs font-medium hover:bg-[#DC2626]/20 transition-colors cursor-pointer flex items-center justify-center gap-1">Delete</button>
              </div>
              {deleteConfirmId === photo.id && (
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => handleSoftDelete(photo.id)} className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm Delete</button>
                  <button onClick={() => setDeleteConfirmId(null)} className="flex-1 min-h-[44px] rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">Cancel</button>
                </div>
              )}
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#57534E]">{filtered.length} items</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-xs text-[#57534E]">{page}/{totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
}

// ============================================================
// Media CMS (Videos, Podcasts, Press)
// ============================================================
function MediaCMS() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'videos' | 'podcasts' | 'press'>('videos');
  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [podcasts, setPodcasts] = useState<MediaPodcast[]>([]);
  const [press, setPress] = useState<MediaPress[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  const [addForm, setAddForm] = useState({ title: '', url: '', description: '', category: '', thumbnail: '' });
  const [editForm, setEditForm] = useState({ title: '', url: '', description: '', category: '', thumbnail: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [vRes, pRes, prRes] = await Promise.allSettled([mediaRepository.getVideos(), mediaRepository.getPodcasts(), mediaRepository.getPress()]);
      if (vRes.status === 'fulfilled') setVideos(vRes.value);
      if (pRes.status === 'fulfilled') setPodcasts(pRes.value);
      if (prRes.status === 'fulfilled') setPress(prRes.value);
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const currentItems = activeTab === 'videos' ? videos : activeTab === 'podcasts' ? podcasts : press;
  const filtered = useMemo(() => {
    return currentItems.filter((item: any) => {
      const title = item.title || item.episode_title || item.headline || '';
      return search === '' || title.toLowerCase().includes(search.toLowerCase());
    });
  }, [currentItems, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleAdd = async () => {
    if (!addForm.title.trim() || !addForm.url.trim()) return;
    try {
      if (activeTab === 'videos') {
        const created = await mediaRepository.createVideo({ title: addForm.title, url: addForm.url, description: addForm.description || null, thumbnail: addForm.thumbnail || null, source: null, category: addForm.category || null, duration: null, date: null, featured: false, sort_order: videos.length, status: 'published' });
        setVideos(prev => [created, ...prev]);
        await auditLogsRepository.create({ user_id: user?.id || null, action: 'create', table_name: 'media_videos', record_id: created.id, new_data: JSON.parse(JSON.stringify(created)), module: 'media' });
      } else if (activeTab === 'podcasts') {
        const created = await mediaRepository.createPodcast({ episode_title: addForm.title, show_name: addForm.category || 'Unknown', url: addForm.url, description: addForm.description || null, cover_art: addForm.thumbnail || null, date: null, sort_order: podcasts.length, status: 'published' });
        setPodcasts(prev => [created, ...prev]);
        await auditLogsRepository.create({ user_id: user?.id || null, action: 'create', table_name: 'media_podcasts', record_id: created.id, new_data: JSON.parse(JSON.stringify(created)), module: 'media' });
      } else {
        const created = await mediaRepository.createPress({ headline: addForm.title, publisher: addForm.category || 'Unknown', url: addForm.url, summary: addForm.description || null, image: addForm.thumbnail || null, date: null, sort_order: press.length, status: 'published' });
        setPress(prev => [created, ...prev]);
        await auditLogsRepository.create({ user_id: user?.id || null, action: 'create', table_name: 'media_press', record_id: created.id, new_data: JSON.parse(JSON.stringify(created)), module: 'media' });
      }
      setShowAddForm(false);
      setAddForm({ title: '', url: '', description: '', category: '', thumbnail: '' });
      showSuccess(`${activeTab.slice(0, -1)} added`);
    } catch { /* empty */ }
  };

  const handleSaveEdit = async (id: string) => {
    setEditingId(null);
    try {
      if (activeTab === 'videos') {
        await mediaRepository.updateVideo(id, { title: editForm.title, url: editForm.url, description: editForm.description || null, category: editForm.category || null, thumbnail: editForm.thumbnail || null });
        setVideos(prev => prev.map(v => v.id === id ? { ...v, ...editForm } : v));
      } else if (activeTab === 'podcasts') {
        await mediaRepository.updatePodcast(id, { episode_title: editForm.title, url: editForm.url, description: editForm.description || null, cover_art: editForm.thumbnail || null });
        setPodcasts(prev => prev.map(p => p.id === id ? { ...p, episode_title: editForm.title, url: editForm.url, description: editForm.description || null, cover_art: editForm.thumbnail || null } : p));
      } else {
        await mediaRepository.updatePress(id, { headline: editForm.title, url: editForm.url, summary: editForm.description || null, image: editForm.thumbnail || null });
        setPress(prev => prev.map(p => p.id === id ? { ...p, headline: editForm.title, url: editForm.url, summary: editForm.description || null, image: editForm.thumbnail || null } : p));
      }
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'update', table_name: activeTab === 'videos' ? 'media_videos' : activeTab === 'podcasts' ? 'media_podcasts' : 'media_press', record_id: id, new_data: JSON.parse(JSON.stringify(editForm)), module: 'media' });
      showSuccess('Updated');
    } catch { /* optimistic */ }
  };

  const handleSoftDelete = async (id: string) => {
    setDeleteConfirmId(null);
    try {
      if (activeTab === 'videos') { await mediaRepository.softDeleteVideo(id); setVideos(prev => prev.filter(v => v.id !== id)); }
      else if (activeTab === 'podcasts') { await mediaRepository.softDeletePodcast(id); setPodcasts(prev => prev.filter(p => p.id !== id)); }
      else { await mediaRepository.softDeletePress(id); setPress(prev => prev.filter(p => p.id !== id)); }
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'delete', table_name: activeTab === 'videos' ? 'media_videos' : activeTab === 'podcasts' ? 'media_podcasts' : 'media_press', record_id: id, module: 'media' });
      showSuccess('Moved to trash');
    } catch { /* optimistic */ }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" /></div>;

  return (
    <div className="space-y-4">
      {successMsg && <div className="px-4 py-2 rounded-xl bg-[#16A34A]/10 text-[#16A34A] text-sm font-medium">{successMsg}</div>}
      <div className="flex items-center gap-2">
        {(['videos', 'podcasts', 'press'] as const).map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); setSearch(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${activeTab === tab ? 'bg-[#A6852F] text-white' : 'border border-[#E8E5DF]/60 text-[#57534E] hover:bg-[#F3F1ED]'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]" />
          <input type="text" placeholder={`Search ${activeTab}...`} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add New
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#1C1917]">Add {activeTab.slice(0, -1)}</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder={activeTab === 'videos' ? 'Title' : activeTab === 'podcasts' ? 'Episode Title' : 'Headline'} value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <input placeholder="URL" value={addForm.url} onChange={(e) => setAddForm({ ...addForm, url: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <input placeholder={activeTab === 'videos' ? 'Category' : activeTab === 'podcasts' ? 'Show Name' : 'Publisher'} value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <input placeholder="Thumbnail URL" value={addForm.thumbnail} onChange={(e) => setAddForm({ ...addForm, thumbnail: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
              </div>
              <textarea placeholder="Description" value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm resize-none" />
              <div className="flex items-center gap-3">
                <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <>
        {/* Desktop table */}
        <div className="hidden md:block rounded-2xl border border-[#A6852F]/10 bg-white overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_80px_80px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span>{activeTab === 'videos' ? 'Title' : activeTab === 'podcasts' ? 'Episode' : 'Headline'}</span>
            <span>{activeTab === 'videos' ? 'Category' : activeTab === 'podcasts' ? 'Show' : 'Publisher'}</span>
            <span>Status</span><span>Actions</span>
          </div>
          {paginated.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-[#57534E]">No items found.</div>
          ) : paginated.map((item: any) => (
            <div key={item.id}>
              {editingId === item.id ? (
                <div className="px-5 py-3 border-b border-[#E8E5DF]/20 bg-[#F3F1ED]/20 space-y-2">
                  <div className="grid grid-cols-[1fr_1fr] gap-3">
                    <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                    <input value={editForm.url} onChange={(e) => setEditForm({ ...editForm, url: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleSaveEdit(item.id)} className="px-3 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium cursor-pointer">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[10px] font-medium text-[#57534E] cursor-pointer">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-[1fr_1fr_80px_80px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
                  <span className="text-sm text-[#1C1917] truncate">{item.title || item.episode_title || item.headline}</span>
                  <span className="text-xs text-[#57534E] truncate">{item.category || item.show_name || item.publisher || '—'}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium w-fit ${statusBadgeClass(item.status || 'published')}`}>{item.status || 'published'}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingId(item.id); setEditForm({ title: item.title || item.episode_title || item.headline, url: item.url, description: item.description || item.summary || '', category: item.category || item.show_name || item.publisher || '', thumbnail: item.thumbnail || item.cover_art || item.image || '' }); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleSoftDelete(item.id)} className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E8E5DF]/40">
              <span className="text-xs text-[#57534E]">{filtered.length} items</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-xs text-[#57534E]">{page}/{totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {paginated.length === 0 ? (
            <div className="text-center py-10 text-sm text-[#57534E]">No items found.</div>
          ) : paginated.map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl border border-[#E8E5DF]/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#1C1917] truncate">{item.title || item.episode_title || item.headline}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${statusBadgeClass(item.status || 'published')}`}>{item.status || 'published'}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#57534E]">{item.category || item.show_name || item.publisher || '—'}</p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => { setEditingId(item.id); setEditForm({ title: item.title || item.episode_title || item.headline, url: item.url, description: item.description || item.summary || '', category: item.category || item.show_name || item.publisher || '', thumbnail: item.thumbnail || item.cover_art || item.image || '' }); }}
                  className="flex-1 min-h-[44px] rounded-lg bg-[#F3F1ED] text-[#57534E] text-xs font-medium hover:bg-[#E8E5DF] transition-colors cursor-pointer flex items-center justify-center gap-1">Edit</button>
                <button onClick={() => setDeleteConfirmId(item.id)}
                  className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626]/10 text-[#DC2626] text-xs font-medium hover:bg-[#DC2626]/20 transition-colors cursor-pointer flex items-center justify-center gap-1">Delete</button>
              </div>
              {deleteConfirmId === item.id && (
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => handleSoftDelete(item.id)} className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm Delete</button>
                  <button onClick={() => setDeleteConfirmId(null)} className="flex-1 min-h-[44px] rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">Cancel</button>
                </div>
              )}
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#57534E]">{filtered.length} items</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-xs text-[#57534E]">{page}/{totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
}

// ============================================================
// Journal CMS
// ============================================================
function JournalCMS() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [deletedArticles, setDeletedArticles] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showTrash, setShowTrash] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  const [addForm, setAddForm] = useState({ title: '', excerpt: '', content: '', category: 'announcements', tags: '', status: 'draft', readTime: '5 min' });
  const [editForm, setEditForm] = useState({ title: '', excerpt: '', content: '', category: 'announcements', tags: '', status: 'draft', readTime: '5 min' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [allRes, deletedRes] = await Promise.allSettled([journalRepository.getAll(), journalRepository.getDeleted()]);
      if (allRes.status === 'fulfilled') setArticles(allRes.value);
      if (deletedRes.status === 'fulfilled') setDeletedArticles(deletedRes.value);
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch = search === '' || a.title.toLowerCase().includes(search.toLowerCase()) || (a.category || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [articles, search, statusFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const stats = useMemo(() => ({
    total: articles.length, published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length, archived: articles.filter(a => a.status === 'archived').length,
  }), [articles]);

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleAdd = async () => {
    if (!addForm.title.trim()) return;
    const slug = addForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const created = await journalRepository.create({
        title: addForm.title, slug, excerpt: addForm.excerpt || null, content: addForm.content, author: 'Admin',
        category: addForm.category as any, tags: addForm.tags.split(',').map(t => t.trim()).filter(Boolean), status: addForm.status as any,
        published_date: addForm.status === 'published' ? new Date().toISOString() : null, read_time: addForm.readTime, views: 0,
        featured: false, trending: false, cover_image: null, og_image: null, seo_title: null, seo_description: null, author_image: null, related_slugs: [],
      });
      setArticles(prev => [created, ...prev]);
      setShowAddForm(false);
      setAddForm({ title: '', excerpt: '', content: '', category: 'announcements', tags: '', status: 'draft', readTime: '5 min' });
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'create', table_name: 'journal_articles', record_id: created.id, new_data: JSON.parse(JSON.stringify(created)), module: 'journal' });
      showSuccess('Article created');
    } catch { /* empty */ }
  };

  const handleSaveEdit = async (id: string) => {
    const original = articles.find(a => a.id === id);
    setArticles(prev => prev.map(a => a.id === id ? { ...a, title: editForm.title, excerpt: editForm.excerpt, content: editForm.content, category: editForm.category as any, status: editForm.status as any } : a));
    setEditingId(null);
    try {
      await journalRepository.update(id, { title: editForm.title, excerpt: editForm.excerpt, content: editForm.content, category: editForm.category as any, status: editForm.status as any, tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean) as any });
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'update', table_name: 'journal_articles', record_id: id, old_data: JSON.parse(JSON.stringify(original)), new_data: JSON.parse(JSON.stringify(editForm)), module: 'journal' });
      showSuccess('Article updated');
    } catch { /* optimistic */ }
  };

  const handleSoftDelete = async (id: string) => {
    const article = articles.find(a => a.id === id);
    setArticles(prev => prev.filter(a => a.id !== id));
    if (article) setDeletedArticles(prev => [article, ...prev]);
    setDeleteConfirmId(null);
    try {
      await journalRepository.softDelete(id);
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'delete', table_name: 'journal_articles', record_id: id, old_data: JSON.parse(JSON.stringify(article)), module: 'journal' });
      showSuccess('Moved to trash');
    } catch { /* optimistic */ }
  };

  const handleRestore = async (id: string) => {
    const article = deletedArticles.find(a => a.id === id);
    setDeletedArticles(prev => prev.filter(a => a.id !== id));
    if (article) setArticles(prev => [article, ...prev]);
    try { await journalRepository.restore(id); showSuccess('Restored'); } catch { /* optimistic */ }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" /></div>;

  return (
    <div className="space-y-4">
      {successMsg && <div className="px-4 py-2 rounded-xl bg-[#16A34A]/10 text-[#16A34A] text-sm font-medium">{successMsg}</div>}
      <StatsBar {...stats} />
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]" />
          <input type="text" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917]">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowTrash(!showTrash)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${showTrash ? 'bg-[#DC2626]/10 text-[#DC2626]' : 'border border-[#E8E5DF]/60 text-[#57534E] hover:bg-[#F3F1ED]'}`}>
          <Trash2 className="w-3.5 h-3.5" /> Trash ({deletedArticles.length})
        </button>
        <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add Article
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#1C1917]">Add Article</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Title" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <select value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm">
                  <option value="career-reflections">Career Reflections</option><option value="industry-insights">Industry Insights</option>
                  <option value="personal-stories">Personal Stories</option><option value="behind-the-scenes">Behind the Scenes</option>
                  <option value="advice">Advice</option><option value="announcements">Announcements</option>
                </select>
              </div>
              <input placeholder="Excerpt" value={addForm.excerpt} onChange={(e) => setAddForm({ ...addForm, excerpt: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
              <textarea placeholder="Content" value={addForm.content} onChange={(e) => setAddForm({ ...addForm, content: e.target.value })} rows={6} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm resize-none" />
              <div className="grid grid-cols-3 gap-3">
                <input placeholder="Tags (comma-separated)" value={addForm.tags} onChange={(e) => setAddForm({ ...addForm, tags: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <input placeholder="Read Time" value={addForm.readTime} onChange={(e) => setAddForm({ ...addForm, readTime: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <select value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value })} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm">
                  <option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showTrash ? (
        <div className="rounded-2xl border border-[#DC2626]/10 bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Trash</div>
          {deletedArticles.length === 0 ? <div className="px-5 py-10 text-center text-sm text-[#57534E]">Trash is empty.</div> :
            deletedArticles.map((article) => (
              <div key={article.id} className="flex items-center justify-between px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0">
                <span className="text-sm text-[#1C1917]">{article.title}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleRestore(article.id)} className="px-3 py-1.5 rounded-lg bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-medium cursor-pointer">Restore</button>
                  <button onClick={async () => { setDeletedArticles(prev => prev.filter(a => a.id !== article.id)); await journalRepository.delete(article.id); }} className="px-3 py-1.5 rounded-lg bg-[#DC2626]/10 text-[#DC2626] text-[10px] font-medium cursor-pointer">Delete</button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl border border-[#A6852F]/10 bg-white overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_100px_80px_80px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
              <span>Title</span><span>Category</span><span>Status</span><span>Views</span><span>Actions</span>
            </div>
            {paginated.length === 0 ? <div className="px-5 py-10 text-center text-sm text-[#57534E]">No articles found.</div> :
              paginated.map((article) => (
                <div key={article.id}>
                  {editingId === article.id ? (
                    <div className="px-5 py-3 border-b border-[#E8E5DF]/20 bg-[#F3F1ED]/20 space-y-2">
                      <div className="grid grid-cols-[1fr_100px_80px] gap-3 items-center">
                        <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                        <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm">
                          <option value="career-reflections">Career</option><option value="industry-insights">Industry</option><option value="personal-stories">Personal</option>
                          <option value="behind-the-scenes">BTS</option><option value="advice">Advice</option><option value="announcements">Announcements</option>
                        </select>
                        <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm">
                          <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                        </select>
                      </div>
                      <textarea value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm resize-none" />
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleSaveEdit(article.id)} className="px-3 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium cursor-pointer">Save</button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[10px] font-medium text-[#57534E] cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[1fr_100px_100px_80px_80px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
                      <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#57534E] shrink-0" /><span className="text-sm text-[#1C1917] truncate">{article.title}</span></div>
                      <span className="text-xs text-[#57534E]">{article.category}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 w-fit ${statusBadgeClass(article.status)}`}>{statusIcon(article.status)}{article.status}</span>
                      <span className="text-[10px] text-[#57534E]">{article.views.toLocaleString()}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditingId(article.id); setEditForm({ title: article.title, excerpt: article.excerpt || '', content: article.content, category: article.category, tags: (article.tags || []).join(', '), status: article.status, readTime: article.read_time || '5 min' }); }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                        {deleteConfirmId === article.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleSoftDelete(article.id)} className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirmId(article.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#E8E5DF]/40">
                <span className="text-xs text-[#57534E]">{filtered.length} items</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs text-[#57534E]">{page}/{totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paginated.length === 0 ? (
              <div className="text-center py-10 text-sm text-[#57534E]">No articles found.</div>
            ) : paginated.map((article) => (
              <div key={article.id} className="bg-white rounded-xl border border-[#E8E5DF]/60 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1C1917] truncate">{article.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${statusBadgeClass(article.status)}`}>{article.status}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#57534E]">{article.category} · {article.views.toLocaleString()} views</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => { setEditingId(article.id); setEditForm({ title: article.title, excerpt: article.excerpt || '', content: article.content, category: article.category, tags: (article.tags || []).join(', '), status: article.status, readTime: article.read_time || '5 min' }); }}
                    className="flex-1 min-h-[44px] rounded-lg bg-[#F3F1ED] text-[#57534E] text-xs font-medium hover:bg-[#E8E5DF] transition-colors cursor-pointer flex items-center justify-center gap-1">Edit</button>
                  <button onClick={() => setDeleteConfirmId(article.id)}
                    className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626]/10 text-[#DC2626] text-xs font-medium hover:bg-[#DC2626]/20 transition-colors cursor-pointer flex items-center justify-center gap-1">Delete</button>
                </div>
                {deleteConfirmId === article.id && (
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => handleSoftDelete(article.id)} className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm Delete</button>
                    <button onClick={() => setDeleteConfirmId(null)} className="flex-1 min-h-[44px] rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">Cancel</button>
                  </div>
                )}
              </div>
            ))}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#57534E]">{filtered.length} items</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs text-[#57534E]">{page}/{totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// FAQ CMS
// ============================================================
function FaqCMS() {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [deletedFaqs, setDeletedFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  const [addForm, setAddForm] = useState({ question: '', answer: '', category: '', published: true });
  const [editForm, setEditForm] = useState({ question: '', answer: '', category: '', published: true });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [allRes, deletedRes] = await Promise.allSettled([faqRepository.getAll(), faqRepository.getDeleted()]);
      if (allRes.status === 'fulfilled') setFaqs(allRes.value);
      if (deletedRes.status === 'fulfilled') setDeletedFaqs(deletedRes.value);
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      if (search === '') return true;
      return f.question.toLowerCase().includes(search.toLowerCase()) || f.category.toLowerCase().includes(search.toLowerCase());
    });
  }, [faqs, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const stats = useMemo(() => ({
    total: faqs.length, published: faqs.filter(f => f.published).length,
    draft: faqs.filter(f => !f.published).length, archived: 0,
  }), [faqs]);

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleAdd = async () => {
    if (!addForm.question.trim()) return;
    try {
      const created = await faqRepository.create({ question: addForm.question, answer: addForm.answer, category: addForm.category, sort_order: faqs.length, published: addForm.published });
      setFaqs(prev => [...prev, created]);
      setShowAddForm(false);
      setAddForm({ question: '', answer: '', category: '', published: true });
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'create', table_name: 'faqs', record_id: created.id, new_data: JSON.parse(JSON.stringify(created)), module: 'faqs' });
      showSuccess('FAQ created');
    } catch { /* empty */ }
  };

  const handleSaveEdit = async (id: string) => {
    const original = faqs.find(f => f.id === id);
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...editForm } : f));
    setEditingId(null);
    try {
      await faqRepository.update(id, editForm);
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'update', table_name: 'faqs', record_id: id, old_data: JSON.parse(JSON.stringify(original)), new_data: JSON.parse(JSON.stringify(editForm)), module: 'faqs' });
      showSuccess('FAQ updated');
    } catch { /* optimistic */ }
  };

  const handleSoftDelete = async (id: string) => {
    const faq = faqs.find(f => f.id === id);
    setFaqs(prev => prev.filter(f => f.id !== id));
    if (faq) setDeletedFaqs(prev => [faq, ...prev]);
    setDeleteConfirmId(null);
    try {
      await faqRepository.softDelete(id);
      await auditLogsRepository.create({ user_id: user?.id || null, action: 'delete', table_name: 'faqs', record_id: id, old_data: JSON.parse(JSON.stringify(faq)), module: 'faqs' });
      showSuccess('Moved to trash');
    } catch { /* optimistic */ }
  };

  const handleRestore = async (id: string) => {
    const faq = deletedFaqs.find(f => f.id === id);
    setDeletedFaqs(prev => prev.filter(f => f.id !== id));
    if (faq) setFaqs(prev => [...prev, faq]);
    try { await faqRepository.restore(id); showSuccess('Restored'); } catch { /* optimistic */ }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = filtered.findIndex(f => f.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === filtered.length - 1)) return;
    const otherIdx = direction === 'up' ? idx - 1 : idx + 1;
    const other = filtered[otherIdx];
    try {
      await faqRepository.reorder([{ id, sort_order: other.sort_order }, { id: other.id, sort_order: filtered[idx].sort_order }]);
      await loadData();
    } catch { /* optimistic */ }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" /></div>;

  return (
    <div className="space-y-4">
      {successMsg && <div className="px-4 py-2 rounded-xl bg-[#16A34A]/10 text-[#16A34A] text-sm font-medium">{successMsg}</div>}
      <StatsBar {...stats} />
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]" />
          <input type="text" placeholder="Search FAQs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
        </div>
        <button onClick={() => setShowTrash(!showTrash)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${showTrash ? 'bg-[#DC2626]/10 text-[#DC2626]' : 'border border-[#E8E5DF]/60 text-[#57534E] hover:bg-[#F3F1ED]'}`}>
          <Trash2 className="w-3.5 h-3.5" /> Trash ({deletedFaqs.length})
        </button>
        <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add FAQ
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#1C1917]">Add FAQ</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
              <input placeholder="Question" value={addForm.question} onChange={(e) => setAddForm({ ...addForm, question: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
              <textarea placeholder="Answer" value={addForm.answer} onChange={(e) => setAddForm({ ...addForm, answer: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm resize-none" />
              <div className="flex items-center gap-3">
                <input placeholder="Category" value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                <button onClick={() => setAddForm({ ...addForm, published: !addForm.published })} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm cursor-pointer">
                  {addForm.published ? <ToggleRight className="w-5 h-5 text-[#16A34A]" /> : <ToggleLeft className="w-5 h-5 text-[#9CA3AF]" />}
                  <span className="text-xs text-[#57534E]">{addForm.published ? 'Published' : 'Draft'}</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleAdd} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showTrash ? (
        <div className="rounded-2xl border border-[#DC2626]/10 bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Trash</div>
          {deletedFaqs.length === 0 ? <div className="px-5 py-10 text-center text-sm text-[#57534E]">Trash is empty.</div> :
            deletedFaqs.map((faq) => (
              <div key={faq.id} className="flex items-center justify-between px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0">
                <span className="text-sm text-[#1C1917]">{faq.question}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleRestore(faq.id)} className="px-3 py-1.5 rounded-lg bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-medium cursor-pointer">Restore</button>
                  <button onClick={async () => { setDeletedFaqs(prev => prev.filter(f => f.id !== faq.id)); await faqRepository.delete(faq.id); }} className="px-3 py-1.5 rounded-lg bg-[#DC2626]/10 text-[#DC2626] text-[10px] font-medium cursor-pointer">Delete</button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl border border-[#A6852F]/10 bg-white overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_120px_80px_100px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
              <span></span><span>Question</span><span>Category</span><span>Status</span><span>Actions</span>
            </div>
            {paginated.length === 0 ? <div className="px-5 py-10 text-center text-sm text-[#57534E]">No FAQs found.</div> :
              paginated.map((item, index) => (
                <div key={item.id}>
                  {editingId === item.id ? (
                    <div className="px-5 py-3 border-b border-[#E8E5DF]/20 bg-[#F3F1ED]/20 space-y-2">
                      <input value={editForm.question} onChange={(e) => setEditForm({ ...editForm, question: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                      <textarea value={editForm.answer} onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm resize-none" />
                      <div className="flex items-center gap-2">
                        <input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category" className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm" />
                        <button onClick={() => setEditForm({ ...editForm, published: !editForm.published })} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm cursor-pointer">
                          {editForm.published ? <ToggleRight className="w-5 h-5 text-[#16A34A]" /> : <ToggleLeft className="w-5 h-5 text-[#9CA3AF]" />}
                          <span className="text-xs text-[#57534E]">{editForm.published ? 'Published' : 'Draft'}</span>
                        </button>
                        <button onClick={() => handleSaveEdit(item.id)} className="px-3 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium cursor-pointer">Save</button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[10px] font-medium text-[#57534E] cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 hover:bg-[#F3F1ED]/30 transition-colors">
                      <div className="grid grid-cols-[40px_1fr_120px_80px_100px] gap-3 items-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <button onClick={() => handleReorder(item.id, 'up')} disabled={index === 0} className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleReorder(item.id, 'down')} disabled={index === filtered.length - 1} className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
                        </div>
                        <div>
                          <p className="text-sm text-[#1C1917] font-medium">{item.question}</p>
                          <p className="text-[10px] text-[#57534E] mt-0.5 line-clamp-1">{item.answer}</p>
                        </div>
                        <span className="text-xs text-[#57534E]">{item.category}</span>
                        <button onClick={() => faqRepository.update(item.id, { published: !item.published }).then(() => setFaqs(prev => prev.map(f => f.id === item.id ? { ...f, published: !f.published } : f)))}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 w-fit cursor-pointer ${item.published ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#9CA3AF]/10 text-[#9CA3AF]'}`}>
                          {item.published ? <><CheckCircle className="w-3 h-3" />Published</> : <><Clock className="w-3 h-3" />Draft</>}
                        </button>
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditingId(item.id); setEditForm({ question: item.question, answer: item.answer, category: item.category, published: item.published }); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                          {deleteConfirmId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleSoftDelete(item.id)} className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm</button>
                              <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">No</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirmId(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#E8E5DF]/40">
                <span className="text-xs text-[#57534E]">{filtered.length} items</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs text-[#57534E]">{page}/{totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paginated.length === 0 ? (
              <div className="text-center py-10 text-sm text-[#57534E]">No FAQs found.</div>
            ) : paginated.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-[#E8E5DF]/60 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1C1917] truncate">{item.question}</span>
                  <button onClick={() => faqRepository.update(item.id, { published: !item.published }).then(() => setFaqs(prev => prev.map(f => f.id === item.id ? { ...f, published: !f.published } : f)))}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 cursor-pointer ${item.published ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#9CA3AF]/10 text-[#9CA3AF]'}`}>
                    {item.published ? 'Published' : 'Draft'}
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#57534E]">{item.category}</p>
                  <p className="text-xs text-[#57534E] line-clamp-2">{item.answer}</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => { setEditingId(item.id); setEditForm({ question: item.question, answer: item.answer, category: item.category, published: item.published }); }}
                    className="flex-1 min-h-[44px] rounded-lg bg-[#F3F1ED] text-[#57534E] text-xs font-medium hover:bg-[#E8E5DF] transition-colors cursor-pointer flex items-center justify-center gap-1">Edit</button>
                  <button onClick={() => setDeleteConfirmId(item.id)}
                    className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626]/10 text-[#DC2626] text-xs font-medium hover:bg-[#DC2626]/20 transition-colors cursor-pointer flex items-center justify-center gap-1">Delete</button>
                </div>
                {deleteConfirmId === item.id && (
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => handleSoftDelete(item.id)} className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm Delete</button>
                    <button onClick={() => setDeleteConfirmId(null)} className="flex-1 min-h-[44px] rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">Cancel</button>
                  </div>
                )}
              </div>
            ))}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#57534E]">{filtered.length} items</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs text-[#57534E]">{page}/{totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// Main AdminContent Component
// ============================================================
export const AdminContent: React.FC<AdminContentProps> = ({ activeSection }) => {
  const sectionTitle = SECTION_TITLES[activeSection] ?? activeSection;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">{sectionTitle}</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage {sectionTitle.toLowerCase()} content for your website.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        {activeSection === 'journey' && <JourneyCMS />}
        {activeSection === 'projects' && <ProjectsCMS />}
        {activeSection === 'gallery' && <GalleryCMS />}
        {activeSection === 'media-content' && <MediaCMS />}
        {activeSection === 'journal' && <JournalCMS />}
        {activeSection === 'faqs' && <FaqCMS />}
      </motion.div>
    </div>
  );
};
