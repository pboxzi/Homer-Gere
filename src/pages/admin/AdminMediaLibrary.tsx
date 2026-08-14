import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Image, Film, FileText, Upload, Trash2, Eye, Search, X, CheckSquare, Square,
  Loader2, Check, Copy, Replace, AlertTriangle, Link, ExternalLink, Grid, List,
} from 'lucide-react';
import { type AdminSection } from '../../data/adminData';
import { supabase } from '../../lib/supabase';
import { getSupabaseClient } from '../../lib/repositories';

interface MediaAsset {
  id: string;
  filename: string;
  original_filename: string | null;
  storage_bucket: string;
  storage_path: string;
  public_url: string;
  file_type: string;
  file_size: number | null;
  mime_type: string | null;
  section: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const SECTION_OPTIONS = [
  { value: '', label: 'All Sections' },
  { value: 'homepage', label: 'Homepage' },
  { value: 'journey', label: 'Journey' },
  { value: 'projects', label: 'Projects' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'journal', label: 'Journal' },
  { value: 'media', label: 'Media' },
  { value: 'experiences', label: 'Experiences' },
  { value: 'membership', label: 'Membership' },
  { value: 'profile', label: 'Profile' },
];

const BUCKETS: Record<string, string> = {
  homepage: 'hero-banners',
  journey: 'gallery',
  projects: 'projects',
  gallery: 'gallery',
  journal: 'journal',
  media: 'media',
  experiences: 'gallery',
  membership: 'hero-banners',
  profile: 'avatars',
};

interface Props {
  activeSection: AdminSection;
}

export const AdminMediaLibrary: React.FC<Props> = ({ activeSection }) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [filterSection, setFilterSection] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'broken' | 'placeholder'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewItem, setPreviewItem] = useState<MediaAsset | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);
  const [uploadSection, setUploadSection] = useState('homepage');
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [replaceItem, setReplaceItem] = useState<MediaAsset | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replaceUploading, setReplaceUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load assets from site_media table
  const loadAssets = useCallback(async () => {
    setLoading(true);
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('site_media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets((data as MediaAsset[]) || []);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  // Filtered assets
  const filtered = useMemo(() => {
    let items = [...assets];
    if (filterType !== 'all') items = items.filter((m) => m.file_type === filterType);
    if (filterSection) items = items.filter((m) => m.section === filterSection);
    if (filterStatus !== 'all') items = items.filter((m) => m.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((m) =>
        m.filename.toLowerCase().includes(q) ||
        m.original_filename?.toLowerCase().includes(q) ||
        m.section?.toLowerCase().includes(q)
      );
    }
    return items;
  }, [assets, filterType, filterSection, filterStatus, search]);

  // Upload handler
  const handleUpload = useCallback(async (files: FileList | File[], section: string) => {
    setUploading(true);
    const client = getSupabaseClient();
    const bucket = BUCKETS[section] || 'media';

    for (const file of Array.from(files)) {
      try {
        const path = `${section}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { data, error: uploadErr } = await client.storage
          .from(bucket)
          .upload(path, file, { contentType: file.type, upsert: false });

        if (uploadErr) throw uploadErr;

        const { data: urlData } = client.storage.from(bucket).getPublicUrl(data.path);
        const fileType = file.type.startsWith('video/') ? 'video'
          : file.type.startsWith('image/') ? 'image' : 'document';

        const { error: dbErr } = await client.from('site_media').insert({
          filename: file.name,
          original_filename: file.name,
          storage_bucket: bucket,
          storage_path: data.path,
          public_url: urlData.publicUrl,
          file_type: fileType,
          file_size: file.size,
          mime_type: file.type,
          section,
          status: 'active',
        });

        if (dbErr) throw dbErr;
      } catch (err) {
        console.error('Upload failed:', file.name, err);
      }
    }

    setUploading(false);
    loadAssets();
  }, [loadAssets]);

  // Delete handler
  const handleDelete = useCallback(async (asset: MediaAsset) => {
    const client = getSupabaseClient();
    try {
      await client.storage.from(asset.storage_bucket).remove([asset.storage_path]);
      await client.from('site_media').delete().eq('id', asset.id);
      loadAssets();
    } catch (err) {
      console.error('Delete failed:', err);
    }
    setDeleteConfirm(null);
  }, [loadAssets]);

  // Bulk delete
  const handleBulkDelete = useCallback(async () => {
    const client = getSupabaseClient();
    for (const id of selectedIds) {
      const asset = assets.find((a) => a.id === id);
      if (asset) {
        try {
          await client.storage.from(asset.storage_bucket).remove([asset.storage_path]);
        } catch { /* ignore */ }
      }
    }
    await client.from('site_media').delete().in('id', Array.from(selectedIds));
    setSelectedIds(new Set());
    loadAssets();
  }, [selectedIds, assets, loadAssets]);

  // Replace handler
  const handleReplace = useCallback(async () => {
    if (!replaceItem || !replaceFile) return;
    setReplaceUploading(true);
    const client = getSupabaseClient();
    try {
      // Delete old file
      await client.storage.from(replaceItem.storage_bucket).remove([replaceItem.storage_path]);

      // Upload new file
      const path = `${replaceItem.section || 'misc'}/${Date.now()}_${replaceFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data, error: uploadErr } = await client.storage
        .from(replaceItem.storage_bucket)
        .upload(path, replaceFile, { contentType: replaceFile.type, upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = client.storage.from(replaceItem.storage_bucket).getPublicUrl(data.path);

      // Update DB
      await client.from('site_media').update({
        filename: replaceFile.name,
        original_filename: replaceFile.name,
        storage_path: data.path,
        public_url: urlData.publicUrl,
        file_size: replaceFile.size,
        mime_type: replaceFile.type,
        status: 'active',
        updated_at: new Date().toISOString(),
      }).eq('id', replaceItem.id);

      setReplaceItem(null);
      setReplaceFile(null);
      loadAssets();
    } catch (err) {
      console.error('Replace failed:', err);
    } finally {
      setReplaceUploading(false);
    }
  }, [replaceItem, replaceFile, loadAssets]);

  // Copy URL
  const handleCopyUrl = useCallback((url: string, id: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  // Drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files, uploadSection);
    }
  }, [handleUpload, uploadSection]);

  // Stats
  const stats = useMemo(() => ({
    total: assets.length,
    images: assets.filter((a) => a.file_type === 'image').length,
    videos: assets.filter((a) => a.file_type === 'video').length,
    broken: assets.filter((a) => a.status === 'broken').length,
  }), [assets]);

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Media Library</h1>
        <p className="text-sm text-[#57534E] mt-1">Upload, manage, and track all media assets across the website.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: '#1C1917' },
          { label: 'Images', value: stats.images, color: '#A6852F' },
          { label: 'Videos', value: stats.videos, color: '#8B5CF6' },
          { label: 'Broken', value: stats.broken, color: '#DC2626' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[#E8E5DF]/60 bg-white px-4 py-3">
            <p className="text-[10px] text-[#57534E] uppercase tracking-wider">{s.label}</p>
            <p className="text-lg font-medium mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4"
          className="hidden"
          onChange={(e) => { if (e.target.files) handleUpload(e.target.files, uploadSection); if (fileInputRef.current) fileInputRef.current.value = ''; }}
        />
        <div className="flex items-center gap-3 mb-3">
          <label className="text-[10px] font-medium text-[#57534E] uppercase tracking-wider">Upload to:</label>
          <select
            value={uploadSection}
            onChange={(e) => setUploadSection(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg text-xs border border-[#E8E5DF]/60 bg-white text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40"
          >
            {SECTION_OPTIONS.filter((s) => s.value).map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {uploading && <Loader2 className="w-4 h-4 text-[#A6852F] animate-spin" />}
        </div>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
            dragOver ? 'border-[#A6852F] bg-[#A6852F]/5' : 'border-[#E8E5DF] hover:border-[#A6852F]/40 bg-[#F3F1ED]/20 hover:bg-[#F3F1ED]/40'
          }`}
        >
          <Upload className="w-7 h-7 text-[#A6852F]/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-[#1C1917]">Drag & drop files here</p>
          <p className="text-xs text-[#57534E] mt-1">or click to browse. JPG, PNG, WebP, MP4.</p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterType === t ? 'bg-[#A6852F]/10 text-[#A6852F]' : 'text-[#57534E] hover:bg-[#F3F1ED]'
              }`}
            >
              {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}s
            </button>
          ))}
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg text-xs border border-[#E8E5DF]/60 bg-white text-[#57534E] focus:outline-none focus:border-[#A6852F]/40"
          >
            {SECTION_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg text-xs border border-[#E8E5DF]/60 bg-white text-[#57534E] focus:outline-none focus:border-[#A6852F]/40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="broken">Broken</option>
            <option value="placeholder">Placeholder</option>
          </select>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#57534E]/60" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg text-xs border border-[#E8E5DF]/60 bg-white text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:border-[#A6852F]/40 w-48"
          />
        </div>
      </div>

      {/* Bulk actions */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 rounded-xl border border-[#A6852F]/20 bg-[#A6852F]/5 px-4 py-2.5"
          >
            <span className="text-xs font-medium text-[#A6852F]">{selectedIds.size} selected</span>
            <div className="flex-1" />
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-[#DC2626]/20 text-[#DC2626] hover:bg-[#DC2626]/5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View toggle + select all */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedIds((prev) => prev.size === filtered.length ? new Set() : new Set(filtered.map((m) => m.id)))}
          className="flex items-center gap-1.5 text-xs text-[#57534E] hover:text-[#1C1917] cursor-pointer"
        >
          {selectedIds.size === filtered.length && filtered.length > 0
            ? <CheckSquare className="w-3.5 h-3.5 text-[#A6852F]" />
            : <Square className="w-3.5 h-3.5" />}
          Select all
        </button>
        <div className="flex items-center gap-1 bg-[#F3F1ED] rounded-lg p-0.5">
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#A6852F]' : 'text-[#57534E]'}`}>
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-sm text-[#A6852F]' : 'text-[#57534E]'}`}>
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Assets grid/list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Image className="w-12 h-12 text-[#57534E]/20 mx-auto mb-3" />
          <p className="text-sm font-medium text-[#1C1917]">No media found</p>
          <p className="text-xs text-[#57534E] mt-1">{search ? 'Try a different search.' : 'Upload files using the area above.'}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => {
            const isSelected = selectedIds.has(item.id);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className={`rounded-xl border bg-white overflow-hidden transition-all group ${
                  isSelected ? 'border-[#A6852F] shadow-sm shadow-[#A6852F]/10' : 'border-[#E8E5DF]/80 hover:border-[#A6852F]/20'
                }`}
              >
                <div className="relative h-32 bg-[#F3F1ED]/60 overflow-hidden">
                  {item.file_type === 'image' ? (
                    <img src={item.public_url} alt={item.filename} referrerPolicy="no-referrer" className="w-full h-full object-cover" loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : item.file_type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center"><Film className="w-10 h-10 text-[#8B5CF6]/40" /></div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><FileText className="w-10 h-10 text-[#3B82F6]/40" /></div>
                  )}

                  {item.status === 'broken' && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#DC2626] text-white text-[9px] font-medium flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" /> BROKEN
                    </div>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                    className="absolute top-2 left-2 w-5 h-5 rounded flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer"
                  >
                    {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-[#A6852F]" /> : <Square className="w-3.5 h-3.5 text-[#57534E]/50" />}
                  </button>

                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setPreviewItem(item)} className="w-6 h-6 rounded bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white cursor-pointer" title="Preview">
                      <Eye className="w-3 h-3 text-[#57534E]" />
                    </button>
                    <button onClick={() => handleCopyUrl(item.public_url, item.id)} className="w-6 h-6 rounded bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white cursor-pointer" title="Copy URL">
                      {copied === item.id ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3 text-[#57534E]" />}
                    </button>
                  </div>

                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-medium text-white/90 bg-[#A6852F]/80">
                    {item.file_type}
                  </span>
                </div>

                <div className="p-3">
                  <p className="text-xs font-medium text-[#1C1917] truncate" title={item.filename}>{item.filename}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-[#57534E]">{formatSize(item.file_size)}</span>
                    <span className="text-[10px] text-[#57534E]/40">|</span>
                    <span className="text-[10px] text-[#57534E]">{item.section || '—'}</span>
                  </div>
                  {item.section && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] bg-[#F3F1ED] text-[#57534E]">
                      {item.section}
                    </span>
                  )}

                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-[#E8E5DF]/40">
                    <button onClick={() => setPreviewItem(item)} className="flex-1 px-2 py-1 rounded text-[10px] text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer text-center">
                      Preview
                    </button>
                    <button onClick={() => handleCopyUrl(item.public_url, item.id)} className="flex-1 px-2 py-1 rounded text-[10px] text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer text-center">
                      {copied === item.id ? 'Copied!' : 'Copy URL'}
                    </button>
                    <button onClick={() => { setReplaceItem(item); setReplaceFile(null); }} className="flex-1 px-2 py-1 rounded text-[10px] text-[#A6852F] hover:bg-[#A6852F]/5 transition-colors cursor-pointer text-center">
                      Replace
                    </button>
                    <button onClick={() => setDeleteConfirm(item.id)} className="px-2 py-1 rounded text-[10px] text-[#DC2626] hover:bg-[#DC2626]/5 transition-colors cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="rounded-xl border border-[#E8E5DF]/60 overflow-hidden">
          <div className="bg-[#F3F1ED]/60 px-4 py-2 grid grid-cols-12 gap-3 text-[10px] font-medium text-[#57534E] uppercase tracking-wider">
            <div className="col-span-1" />
            <div className="col-span-4">File</div>
            <div className="col-span-2">Section</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Size</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {filtered.map((item) => (
            <div key={item.id} className="px-4 py-2.5 grid grid-cols-12 gap-3 items-center border-t border-[#E8E5DF]/40 hover:bg-[#F3F1ED]/20">
              <div className="col-span-1">
                <button onClick={() => toggleSelect(item.id)} className="cursor-pointer">
                  {selectedIds.has(item.id) ? <CheckSquare className="w-3.5 h-3.5 text-[#A6852F]" /> : <Square className="w-3.5 h-3.5 text-[#57534E]/50" />}
                </button>
              </div>
              <div className="col-span-4 flex items-center gap-2 min-w-0">
                {item.file_type === 'image' ? (
                  <img src={item.public_url} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover shrink-0" loading="lazy" />
                ) : (
                  <div className="w-8 h-8 rounded bg-[#F3F1ED] flex items-center justify-center shrink-0">
                    {item.file_type === 'video' ? <Film className="w-4 h-4 text-[#8B5CF6]/40" /> : <FileText className="w-4 h-4 text-[#3B82F6]/40" />}
                  </div>
                )}
                <span className="text-xs text-[#1C1917] truncate">{item.filename}</span>
              </div>
              <div className="col-span-2 text-xs text-[#57534E]">{item.section || '—'}</div>
              <div className="col-span-1 text-xs text-[#57534E] capitalize">{item.file_type}</div>
              <div className="col-span-1 text-xs text-[#57534E]">{formatSize(item.file_size)}</div>
              <div className="col-span-1">
                {item.status === 'broken' ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#DC2626]/10 text-[#DC2626]">Broken</span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#16A34A]/10 text-[#16A34A]">Active</span>
                )}
              </div>
              <div className="col-span-2 flex items-center justify-end gap-1">
                <button onClick={() => setPreviewItem(item)} className="p-1 rounded hover:bg-[#F3F1ED] cursor-pointer" title="Preview">
                  <Eye className="w-3 h-3 text-[#57534E]" />
                </button>
                <button onClick={() => handleCopyUrl(item.public_url, item.id)} className="p-1 rounded hover:bg-[#F3F1ED] cursor-pointer" title="Copy URL">
                  {copied === item.id ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3 text-[#57534E]" />}
                </button>
                <button onClick={() => { setReplaceItem(item); setReplaceFile(null); }} className="p-1 rounded hover:bg-[#F3F1ED] cursor-pointer" title="Replace">
                  <Replace className="w-3 h-3 text-[#A6852F]" />
                </button>
                <button onClick={() => setDeleteConfirm(item.id)} className="p-1 rounded hover:bg-[#DC2626]/5 cursor-pointer" title="Delete">
                  <Trash2 className="w-3 h-3 text-[#DC2626]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal — modern full-screen lightbox */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            key="preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md"
            onClick={() => setPreviewItem(null)}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/70 text-[10px] font-medium uppercase tracking-wider shrink-0">
                  {previewItem.file_type}
                </span>
                <p className="text-sm text-white/90 truncate">{previewItem.filename}</p>
                {previewItem.status === 'broken' && (
                  <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 text-[10px] font-medium shrink-0">Broken</span>
                )}
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image area */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-8 pb-2 min-h-0" onClick={(e) => e.stopPropagation()}>
              {previewItem.file_type === 'image' ? (
                <img
                  src={previewItem.public_url}
                  alt={previewItem.filename}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-white/40">
                  {previewItem.file_type === 'video' ? <Film className="w-20 h-20" /> : <FileText className="w-20 h-20" />}
                  <p className="text-sm">Preview not available for this file type</p>
                </div>
              )}
            </div>

            {/* Bottom bar */}
            <div
              className="shrink-0 px-4 sm:px-6 py-3 bg-black/40 backdrop-blur-sm border-t border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-white/50 min-w-0 flex-1">
                  <span>{formatSize(previewItem.file_size)}</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="capitalize">{previewItem.section || '—'}</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="capitalize">{previewItem.storage_bucket}</span>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyUrl(previewItem.public_url, previewItem.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    {copied === previewItem.id ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy URL</>}
                  </button>
                  <a
                    href={previewItem.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open
                  </a>
                  <button
                    onClick={() => { setReplaceItem(previewItem); setReplaceFile(null); setPreviewItem(null); }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-[#A6852F] hover:bg-[#8F7228] text-white transition-colors cursor-pointer"
                  >
                    <Replace className="w-3.5 h-3.5" /> Replace
                  </button>
                  <button
                    onClick={() => { setDeleteConfirm(previewItem.id); setPreviewItem(null); }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replace Modal */}
      <AnimatePresence>
        {replaceItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => { setReplaceItem(null); setReplaceFile(null); }} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E5DF]/40 shrink-0">
                  <p className="text-sm font-medium text-[#1C1917]">Replace Image</p>
                  <button onClick={() => { setReplaceItem(null); setReplaceFile(null); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] shrink-0 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 space-y-4 overflow-y-auto">
                  <div className="aspect-video rounded-xl overflow-hidden bg-[#F3F1ED]">
                    <img src={replaceItem.public_url} alt="Current" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                  </div>
                  <div className="rounded-xl border border-dashed border-[#A6852F]/40 p-4 text-center">
                    {replaceFile ? (
                      <div className="space-y-2">
                        <p className="text-xs text-[#1C1917] truncate">{replaceFile.name}</p>
                        <p className="text-[10px] text-[#57534E]">{(replaceFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-6 h-6 text-[#A6852F]/40 mx-auto mb-2" />
                        <p className="text-xs text-[#57534E]">Click to choose replacement file</p>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setReplaceFile(e.target.files?.[0] || null)} />
                      </label>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setReplaceItem(null); setReplaceFile(null); }}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border border-[#E8E5DF]/60 text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                      Cancel
                    </button>
                    <button onClick={handleReplace} disabled={!replaceFile || replaceUploading}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-[#A6852F] text-white hover:bg-[#8F7228] transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-1.5">
                      {replaceUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Replace className="w-3 h-3" />}
                      {replaceUploading ? 'Replacing...' : 'Replace'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5 text-[#DC2626]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1C1917]">Delete Media</p>
                    <p className="text-[11px] text-[#57534E]">This cannot be undone.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border border-[#E8E5DF]/60 text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={() => { const asset = assets.find((a) => a.id === deleteConfirm); if (asset) handleDelete(asset); }}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors cursor-pointer">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
