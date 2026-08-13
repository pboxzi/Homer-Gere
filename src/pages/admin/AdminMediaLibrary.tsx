import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Image, Film, FileText, Upload, Trash2, Eye, Download, Search, X, CheckSquare, Square,
  Folder, Loader2, Check,
} from 'lucide-react';
import { type AdminSection } from '../../data/adminData';
import { useAdmin } from '../../context/AdminContext';
import { supabase } from '../../lib/supabase';

const TYPE_ICONS = { image: Image, video: Film, document: FileText } as const;
const TYPE_COLORS: Record<string, string> = { image: '#A6852F', video: '#8B5CF6', document: '#3B82F6' };

const SECTION_LABELS: Record<string, string> = {
  images: 'Images',
  videos: 'Videos',
  documents: 'Documents',
};

const FOLDERS = [
  { id: 'gallery', name: 'Gallery' },
  { id: 'projects', name: 'Projects' },
  { id: 'press', name: 'Press Kit' },
  { id: 'events', name: 'Events' },
  { id: 'misc', name: 'Miscellaneous' },
];

interface Props {
  activeSection: AdminSection;
}

export const AdminMediaLibrary: React.FC<Props> = ({ activeSection }) => {
  const { media, addMedia, deleteMedia } = useAdmin();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewItem, setPreviewItem] = useState<string | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('gallery');
  const [uploadingItems, setUploadingItems] = useState<Map<string, { name: string; progress: number }>>(new Map());
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultFilter = useMemo(() => {
    if (activeSection === 'images') return 'image';
    if (activeSection === 'videos') return 'video';
    if (activeSection === 'documents') return 'document';
    return 'all';
  }, [activeSection]);

  useEffect(() => {
    setFilterType(defaultFilter);
  }, [defaultFilter]);

  const filtered = useMemo(() => {
    let items = [...media];
    if (filterType !== 'all') {
      items = items.filter((m) => m.type === filterType);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((m) => m.name.toLowerCase().includes(q));
    }
    return items;
  }, [media, filterType, search]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === filtered.length) return new Set();
      return new Set(filtered.map((m) => m.id));
    });
  }, [filtered]);

  const getMediaType = useCallback((fileName: string): 'image' | 'video' | 'document' => {
    const ext = fileName.toLowerCase().split('.').pop() || '';
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'image';
    if (['mp4'].includes(ext)) return 'video';
    return 'document';
  }, []);

  const simulateUpload = useCallback((file: File) => {
    const id = 'upload_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    const type = getMediaType(file.name);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${sizeMB} MB`;

    setUploadingItems((prev) => new Map(prev).set(id, { name: file.name, progress: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadingItems((prev) => new Map(prev).set(id, { name: file.name, progress: 100 }));

        const path = `admin/${Date.now()}_${file.name}`;
        supabase.storage
          .from('media')
          .upload(path, file)
          .then(({ data, error }) => {
            if (error) throw error;
            const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.path);
            addMedia({
              name: file.name,
              type,
              size: sizeStr,
              uploadedBy: 'Admin',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              url: urlData.publicUrl,
            });
          })
          .catch((err) => {
            console.error('Upload failed:', err);
            addMedia({
              name: file.name,
              type,
              size: sizeStr,
              uploadedBy: 'Admin',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              url: '#',
            });
          })
          .finally(() => {
            setUploadingItems((prev) => {
              const next = new Map(prev);
              next.delete(id);
              return next;
            });
          });
      } else {
        setUploadingItems((prev) => new Map(prev).set(id, { name: file.name, progress: Math.min(progress, 99) }));
      }
    }, 300);
  }, [addMedia, getMediaType]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => simulateUpload(file));
  }, [simulateUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteMedia(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, [deleteMedia]);

  const handleBulkDelete = useCallback(() => {
    selectedIds.forEach((id) => deleteMedia(id));
    setSelectedIds(new Set());
  }, [selectedIds, deleteMedia]);

  const handleBulkMove = useCallback(() => {
    setShowFolderModal(false);
    setSelectedIds(new Set());
  }, []);

  const previewItemData = useMemo(() => {
    if (!previewItem) return null;
    return media.find((m) => m.id === previewItem) || null;
  }, [previewItem, media]);

  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length;
  const hasSelection = selectedIds.size > 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">
          {SECTION_LABELS[activeSection] || 'Media Library'}
        </h1>
        <p className="text-sm text-[#57534E] mt-1">Manage images, videos, and documents for your website.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.mp4,.pdf,.docx"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-[#A6852F] bg-[#A6852F]/5'
              : 'border-[#E8E5DF] hover:border-[#A6852F]/40 bg-[#F3F1ED]/20 hover:bg-[#F3F1ED]/40'
          }`}
        >
          <Upload className="w-8 h-8 text-[#A6852F]/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-[#1C1917]">Drag and drop files here</p>
          <p className="text-xs text-[#57534E] mt-1">
            or click to browse. Supports JPG, PNG, WebP, MP4, PDF, DOCX.
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {uploadingItems.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {Array.from(uploadingItems.entries()).map(([id, { name, progress }]) => (
              <div key={id} className="rounded-xl border border-[#E8E5DF]/60 bg-white px-4 py-3 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-[#A6852F] animate-spin shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#1C1917] truncate">{name}</p>
                  <div className="mt-1.5 h-1.5 bg-[#E8E5DF]/40 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#A6852F] rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-[#57534E] shrink-0">{Math.round(progress)}%</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'image', 'video', 'document'] as const).map((t) => {
            const count = t === 'all' ? media.length : media.filter((m) => m.type === t).length;
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterType === t
                    ? 'bg-[#A6852F]/10 text-[#A6852F]'
                    : 'text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917]'
                }`}
              >
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}s
                <span className="ml-1 text-[10px] opacity-60">({count})</span>
              </button>
            );
          })}
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

      <AnimatePresence>
        {hasSelection && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 rounded-xl border border-[#A6852F]/20 bg-[#A6852F]/5 px-4 py-2.5"
          >
            <span className="text-xs font-medium text-[#A6852F]">{selectedIds.size} selected</span>
            <div className="flex-1" />
            <button
              onClick={() => setShowFolderModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-[#E8E5DF]/60 text-[#57534E] hover:text-[#1C1917] hover:border-[#A6852F]/20 transition-colors cursor-pointer"
            >
              <Folder className="w-3 h-3" /> Move
            </button>
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-[#DC2626]/20 text-[#DC2626] hover:bg-[#DC2626]/5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length > 0 && (
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-1.5 text-xs text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
          >
            {allSelected ? (
              <CheckSquare className="w-3.5 h-3.5 text-[#A6852F]" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            <span>Select all</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => {
            const Icon = TYPE_ICONS[item.type];
            const color = TYPE_COLORS[item.type];
            const isSelected = selectedIds.has(item.id);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className={`rounded-xl border bg-white overflow-hidden transition-all group ${
                  isSelected
                    ? 'border-[#A6852F] shadow-sm shadow-[#A6852F]/10'
                    : 'border-[#E8E5DF]/80 hover:border-[#A6852F]/20'
                }`}
              >
                <div className="relative h-32 bg-[#F3F1ED]/60 flex items-center justify-center">
                  <Icon className="w-10 h-10" style={{ color: `${color}40` }} />

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                    className="absolute top-2 left-2 w-5 h-5 rounded flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-[#A6852F]" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-[#57534E]/50" />
                    )}
                  </button>

                  <span
                    className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-medium text-white/90"
                    style={{ backgroundColor: color }}
                  >
                    {item.type}
                  </span>
                </div>

                <div className="p-3">
                  <p className="text-xs font-medium text-[#1C1917] truncate">{item.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-[#57534E]">{item.size}</span>
                    <span className="text-[10px] text-[#57534E]/40">|</span>
                    <span className="text-[10px] text-[#57534E]">{item.date}</span>
                  </div>
                  <p className="text-[10px] text-[#57534E]/60 mt-0.5">by {item.uploadedBy}</p>

                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-[#E8E5DF]/40">
                    <button
                      onClick={() => setPreviewItem(item.id)}
                      className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                      title="Preview"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {}}
                      className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Image className="w-12 h-12 text-[#57534E]/20 mx-auto mb-3" />
          <p className="text-sm font-medium text-[#1C1917]">No files found</p>
          <p className="text-xs text-[#57534E] mt-1">
            {search ? 'Try a different search term.' : 'Upload files using the area above.'}
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {previewItemData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setPreviewItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E5DF]/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${TYPE_COLORS[previewItemData.type]}15` }}>
                      {React.createElement(TYPE_ICONS[previewItemData.type], { className: 'w-4 h-4', style: { color: TYPE_COLORS[previewItemData.type] } })}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1C1917] truncate">{previewItemData.name}</p>
                      <p className="text-[10px] text-[#57534E]">{previewItemData.type} &mdash; {previewItemData.size}</p>
                    </div>
                  </div>
                  <button onClick={() => setPreviewItem(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-64 bg-[#F3F1ED]/60 flex items-center justify-center">
                  {React.createElement(TYPE_ICONS[previewItemData.type], { className: 'w-16 h-16', style: { color: `${TYPE_COLORS[previewItemData.type]}30` } })}
                </div>

                <div className="px-5 py-4 border-t border-[#E8E5DF]/40">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] text-[#57534E] uppercase tracking-wider">Size</p>
                      <p className="text-[#1C1917] font-medium mt-0.5">{previewItemData.size}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#57534E] uppercase tracking-wider">Uploaded</p>
                      <p className="text-[#1C1917] font-medium mt-0.5">{previewItemData.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#57534E] uppercase tracking-wider">Uploaded By</p>
                      <p className="text-[#1C1917] font-medium mt-0.5">{previewItemData.uploadedBy}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#57534E] uppercase tracking-wider">Type</p>
                      <p className="text-[#1C1917] font-medium mt-0.5 capitalize">{previewItemData.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button onClick={() => {}} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#A6852F] text-white hover:bg-[#8B6F1F] transition-colors cursor-pointer">
                      <Download className="w-3 h-3" /> Download
                    </button>
                    <button onClick={() => { handleDelete(previewItemData.id); setPreviewItem(null); }} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-[#DC2626]/20 text-[#DC2626] hover:bg-[#DC2626]/5 transition-colors cursor-pointer">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFolderModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowFolderModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E5DF]/40">
                  <div>
                    <p className="text-sm font-medium text-[#1C1917]">Move to Folder</p>
                    <p className="text-[10px] text-[#57534E] mt-0.5">{selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selected</p>
                  </div>
                  <button onClick={() => setShowFolderModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-1.5 max-h-60 overflow-y-auto">
                  {FOLDERS.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        selectedFolder === folder.id
                          ? 'bg-[#A6852F]/10 text-[#A6852F]'
                          : 'text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917]'
                      }`}
                    >
                      <Folder className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{folder.name}</span>
                      {selectedFolder === folder.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="px-5 py-4 border-t border-[#E8E5DF]/40 flex items-center gap-2">
                  <button onClick={() => setShowFolderModal(false)} className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border border-[#E8E5DF]/60 text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleBulkMove} className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-[#A6852F] text-white hover:bg-[#8B6F1F] transition-colors cursor-pointer">
                    Move Here
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
