import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, Upload, Link, Check, Loader2, X, ChevronDown, Film, Mic, Newspaper, BookOpen, Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getSupabaseClient } from '../../lib/repositories';

type ContentTab = 'journal' | 'gallery' | 'filmography' | 'videos' | 'podcasts' | 'press';

interface ContentItemImage {
  id: string;
  title: string;
  imageUrl: string;
  section: ContentTab;
}

const TABS: { id: ContentTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'gallery', label: 'Gallery', icon: Camera },
  { id: 'filmography', label: 'Filmography', icon: Film },
  { id: 'videos', label: 'Videos', icon: Film },
  { id: 'podcasts', label: 'Podcasts', icon: Mic },
  { id: 'press', label: 'Press', icon: Newspaper },
];

export const AdminContentImages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentTab>('journal');
  const [items, setItems] = useState<ContentItemImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      let mapped: ContentItemImage[] = [];

      switch (activeTab) {
        case 'journal': {
          const { data } = await supabase.from('journal_articles').select('id, title, cover_image').order('published_date', { ascending: false });
          mapped = (data || []).map((a: any) => ({
            id: a.id,
            title: a.title,
            imageUrl: a.cover_image || '',
            section: 'journal' as ContentTab,
          }));
          break;
        }
        case 'gallery': {
          const { data } = await supabase.from('gallery_photos').select('id, alt, caption, src').order('sort_order', { ascending: true });
          mapped = (data || []).map((p: any) => ({
            id: p.id,
            title: p.alt || p.caption || 'Untitled',
            imageUrl: p.src,
            section: 'gallery' as ContentTab,
          }));
          break;
        }
        case 'filmography': {
          const { data } = await supabase.from('filmography_entries').select('id, title, image').order('sort_order', { ascending: true });
          mapped = (data || []).map((f: any) => ({
            id: f.id,
            title: f.title,
            imageUrl: f.image || '',
            section: 'filmography' as ContentTab,
          }));
          break;
        }
        case 'videos': {
          const { data } = await supabase.from('media_videos').select('id, title, thumbnail').order('sort_order', { ascending: true });
          mapped = (data || []).map((v: any) => ({
            id: v.id,
            title: v.title,
            imageUrl: v.thumbnail || '',
            section: 'videos' as ContentTab,
          }));
          break;
        }
        case 'podcasts': {
          const { data } = await supabase.from('media_podcasts').select('id, episode_title, cover_art').order('sort_order', { ascending: true });
          mapped = (data || []).map((p: any) => ({
            id: p.id,
            title: p.episode_title,
            imageUrl: p.cover_art || '',
            section: 'podcasts' as ContentTab,
          }));
          break;
        }
        case 'press': {
          const { data } = await supabase.from('media_press').select('id, headline, image').order('sort_order', { ascending: true });
          mapped = (data || []).map((p: any) => ({
            id: p.id,
            title: p.headline,
            imageUrl: p.image || '',
            section: 'press' as ContentTab,
          }));
          break;
        }
      }
      setItems(mapped);
    } catch (err) {
      console.error('Failed to load content images:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSaveUrl = async (item: ContentItemImage) => {
    if (!editUrl.trim()) return;
    setSaving(true);
    try {
      const supabase = getSupabaseClient();
      const { table, field } = getTableField(item.section);

      const { error } = await supabase
        .from(table)
        .update({ [field]: editUrl, updated_at: new Date().toISOString() })
        .eq('id', item.id);

      if (error) throw error;

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, imageUrl: editUrl } : i))
      );
      setEditingId(null);
      setSaved(item.id);
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      console.error('Failed to save image:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (item: ContentItemImage, file: File) => {
    setUploading(item.id);
    try {
      const supabase = getSupabaseClient();
      const path = `content/${item.section}/${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.path);
      const publicUrl = urlData.publicUrl;

      const { table, field } = getTableField(item.section);
      const { error } = await supabase
        .from(table)
        .update({ [field]: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', item.id);

      if (error) throw error;

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, imageUrl: publicUrl } : i))
      );
      setEditingId(null);
      setSaved(item.id);
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  const getTableField = (section: ContentTab): { table: string; field: string } => {
    switch (section) {
      case 'journal': return { table: 'journal_articles', field: 'cover_image' };
      case 'gallery': return { table: 'gallery_photos', field: 'src' };
      case 'filmography': return { table: 'filmography_entries', field: 'image' };
      case 'videos': return { table: 'media_videos', field: 'thumbnail' };
      case 'podcasts': return { table: 'media_podcasts', field: 'cover_art' };
      case 'press': return { table: 'media_press', field: 'image' };
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">
          Content Images
        </h1>
        <p className="text-sm text-[#57534E] mt-1">
          Manage cover images, thumbnails, and photos across all content sections.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#F3F1ED] rounded-2xl overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = items.filter((i) => i.section === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setEditingId(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-[#A6852F] shadow-sm'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-sm text-[#57534E]">
          No items found in this section.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group rounded-2xl border border-[#E8E5DF]/60 bg-white overflow-hidden hover:shadow-lg hover:shadow-[#A6852F]/5 transition-all duration-300"
            >
              {/* Image Preview */}
              <div className="relative aspect-[4/3] bg-[#F3F1ED] overflow-hidden">
                {item.imageUrl ? (
                  <img                     src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-[#D6D3D1]" />
                  </div>
                )}

                {/* Status indicator */}
                {saved === item.id && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-[#16A34A] text-white text-[10px] font-medium">
                    <Check className="w-3 h-3" />
                    Saved
                  </div>
                )}
                {uploading === item.id && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Uploading...
                  </div>
                )}
              </div>

              {/* Info + Actions */}
              <div className="p-3 space-y-2">
                <p className="text-xs font-medium text-[#1C1917] truncate" title={item.title}>
                  {item.title}
                </p>

                {editingId === item.id ? (
                  <div className="space-y-2">
                    {/* URL Input */}
                    <div className="flex items-center gap-1">
                      <Link className="w-3 h-3 text-[#57534E] shrink-0" />
                      <input
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className="flex-1 px-2 py-1.5 rounded-lg border border-[#E8E5DF]/60 bg-white text-[11px] focus:outline-none focus:border-[#A6852F]/40"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveUrl(item);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                    </div>

                    {/* OR divider */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-[#E8E5DF]/60" />
                      <span className="text-[9px] text-[#57534E] uppercase">or</span>
                      <div className="flex-1 h-px bg-[#E8E5DF]/60" />
                    </div>

                    {/* File Upload */}
                    <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#A6852F]/40 bg-[#A6852F]/5 text-[11px] font-medium text-[#A6852F] hover:bg-[#A6852F]/10 transition-colors cursor-pointer">
                      <Upload className="w-3 h-3" />
                      Upload file
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(item, file);
                        }}
                      />
                    </label>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSaveUrl(item)}
                        disabled={saving || !editUrl.trim()}
                        className="flex-1 px-2 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium hover:bg-[#8F7228] transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {saving ? 'Saving...' : 'Save URL'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditUrl(item.imageUrl);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[11px] font-medium text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"
                  >
                    <Image className="w-3 h-3" />
                    {item.imageUrl ? 'Change Image' : 'Add Image'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
