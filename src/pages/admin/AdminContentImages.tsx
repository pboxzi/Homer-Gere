import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen, Camera, Film, Mic, Newspaper, Map, Briefcase, Star, User,
  Layout, Loader2, AlertTriangle,
} from 'lucide-react';
import { getSupabaseClient } from '../../lib/repositories';
import { ImageUploader } from '../../components/ImageUploader';
import { BrokenImageScanner } from '../../components/BrokenImageScanner';

type ContentTab =
  | 'homepage' | 'journey' | 'projects' | 'gallery'
  | 'journal' | 'videos' | 'podcasts' | 'press'
  | 'experiences' | 'membership' | 'profile' | 'broken';

interface ContentItemImage {
  id: string;
  title: string;
  imageUrl: string;
  section: ContentTab;
  fieldName: string;
  tableName: string;
}

const TABS: { id: ContentTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'homepage', label: 'Homepage', icon: Layout },
  { id: 'journey', label: 'Journey', icon: Map },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'gallery', label: 'Gallery', icon: Camera },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'videos', label: 'Videos', icon: Film },
  { id: 'podcasts', label: 'Podcasts', icon: Mic },
  { id: 'press', label: 'Press', icon: Newspaper },
  { id: 'experiences', label: 'Experiences', icon: Star },
  { id: 'membership', label: 'Membership', icon: User },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'broken', label: 'Broken Images', icon: AlertTriangle },
];

export const AdminContentImages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentTab>('homepage');
  const [items, setItems] = useState<ContentItemImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const client = getSupabaseClient();
      let mapped: ContentItemImage[] = [];

      switch (activeTab) {
        case 'homepage': {
          // Load from site_settings where category = 'website'
          const { data } = await client.from('site_settings').select('settings').eq('category', 'website').single();
          const settings = (data?.settings as any) || {};
          mapped = [
            { id: 'hero', title: 'Hero Background', imageUrl: settings.heroImage || '', section: 'homepage', fieldName: 'heroImage', tableName: 'site_settings' },
            { id: 'hero-mobile', title: 'Hero Mobile Image', imageUrl: settings.heroMobileImage || '', section: 'homepage', fieldName: 'heroMobileImage', tableName: 'site_settings' },
            { id: 'featured-banner', title: 'Featured Banner', imageUrl: settings.featuredBanner || '', section: 'homepage', fieldName: 'featuredBanner', tableName: 'site_settings' },
            { id: 'promo-card-1', title: 'Promotional Card 1', imageUrl: settings.promoCard1 || '', section: 'homepage', fieldName: 'promoCard1', tableName: 'site_settings' },
            { id: 'promo-card-2', title: 'Promotional Card 2', imageUrl: settings.promoCard2 || '', section: 'homepage', fieldName: 'promoCard2', tableName: 'site_settings' },
          ];
          break;
        }
        case 'journey': {
          const { data } = await client.from('journey_entries').select('id, title, image_url').order('sort_order');
          mapped = (data || []).map((e: any) => ({
            id: e.id, title: e.title, imageUrl: e.image_url || '',
            section: 'journey', fieldName: 'image_url', tableName: 'journey_entries',
          }));
          break;
        }
        case 'projects': {
          const { data } = await client.from('projects').select('id, title, image, hero_image, poster_image, logo_image').order('sort_order');
          for (const p of (data || []) as any[]) {
            mapped.push(
              { id: `${p.id}-image`, title: `${p.title} — Cover`, imageUrl: p.image || '', section: 'projects', fieldName: 'image', tableName: 'projects' },
              { id: `${p.id}-hero`, title: `${p.title} — Hero`, imageUrl: p.hero_image || '', section: 'projects', fieldName: 'hero_image', tableName: 'projects' },
              { id: `${p.id}-poster`, title: `${p.title} — Poster`, imageUrl: p.poster_image || '', section: 'projects', fieldName: 'poster_image', tableName: 'projects' },
              { id: `${p.id}-logo`, title: `${p.title} — Logo`, imageUrl: p.logo_image || '', section: 'projects', fieldName: 'logo_image', tableName: 'projects' },
            );
          }
          break;
        }
        case 'gallery': {
          const { data: photos } = await client.from('gallery_photos').select('id, alt, src').order('sort_order');
          mapped = (photos || []).map((p: any) => ({
            id: p.id, title: p.alt || 'Untitled', imageUrl: p.src,
            section: 'gallery', fieldName: 'src', tableName: 'gallery_photos',
          }));
          const { data: collections } = await client.from('gallery_collections').select('id, title, cover_image');
          for (const c of (collections || []) as any[]) {
            mapped.push({
              id: `col-${c.id}`, title: `${c.title} — Cover`, imageUrl: c.cover_image || '',
              section: 'gallery', fieldName: 'cover_image', tableName: 'gallery_collections',
            });
          }
          break;
        }
        case 'journal': {
          const { data } = await client.from('journal_articles').select('id, title, cover_image, og_image, author_image').order('published_date', { ascending: false });
          for (const a of (data || []) as any[]) {
            mapped.push(
              { id: `${a.id}-cover`, title: `${a.title} — Cover`, imageUrl: a.cover_image || '', section: 'journal', fieldName: 'cover_image', tableName: 'journal_articles' },
              { id: `${a.id}-og`, title: `${a.title} — OG Image`, imageUrl: a.og_image || '', section: 'journal', fieldName: 'og_image', tableName: 'journal_articles' },
              { id: `${a.id}-author`, title: `${a.title} — Author`, imageUrl: a.author_image || '', section: 'journal', fieldName: 'author_image', tableName: 'journal_articles' },
            );
          }
          break;
        }
        case 'videos': {
          const { data } = await client.from('media_videos').select('id, title, thumbnail').order('sort_order');
          mapped = (data || []).map((v: any) => ({
            id: v.id, title: v.title, imageUrl: v.thumbnail || '',
            section: 'videos', fieldName: 'thumbnail', tableName: 'media_videos',
          }));
          break;
        }
        case 'podcasts': {
          const { data } = await client.from('media_podcasts').select('id, episode_title, cover_art').order('sort_order');
          mapped = (data || []).map((p: any) => ({
            id: p.id, title: p.episode_title, imageUrl: p.cover_art || '',
            section: 'podcasts', fieldName: 'cover_art', tableName: 'media_podcasts',
          }));
          break;
        }
        case 'press': {
          const { data } = await client.from('media_press').select('id, headline, image').order('sort_order');
          mapped = (data || []).map((p: any) => ({
            id: p.id, title: p.headline, imageUrl: p.image || '',
            section: 'press', fieldName: 'image', tableName: 'media_press',
          }));
          break;
        }
        case 'experiences': {
          const { data } = await client.from('experiences').select('id, title, image').order('sort_order');
          mapped = (data || []).map((e: any) => ({
            id: e.id, title: e.title, imageUrl: e.image || '',
            section: 'experiences', fieldName: 'image', tableName: 'experiences',
          }));
          break;
        }
        case 'membership': {
          const { data } = await client.from('site_settings').select('settings').eq('category', 'website').single();
          const settings = (data?.settings as any) || {};
          mapped = [
            { id: 'membership-hero', title: 'Membership Hero', imageUrl: settings.membershipHero || '', section: 'membership', fieldName: 'membershipHero', tableName: 'site_settings' },
            { id: 'membership-why', title: 'Why Join Image', imageUrl: settings.membershipWhy || '', section: 'membership', fieldName: 'membershipWhy', tableName: 'site_settings' },
            { id: 'membership-plans', title: 'Plans Image', imageUrl: settings.membershipPlans || '', section: 'membership', fieldName: 'membershipPlans', tableName: 'site_settings' },
          ];
          break;
        }
        case 'profile': {
          const { data } = await client.from('profiles').select('id, first_name, last_name, avatar_url').limit(1).single();
          mapped = data ? [{
            id: data.id, title: `${data.first_name} ${data.last_name} — Avatar`, imageUrl: data.avatar_url || '',
            section: 'profile', fieldName: 'avatar_url', tableName: 'profiles',
          }] : [];
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
    if (activeTab !== 'broken') loadItems();
  }, [loadItems, activeTab]);

  const handleUpdate = useCallback(async (item: ContentItemImage, newUrl: string) => {
    setSaving(item.id);
    try {
      const client = getSupabaseClient();

      if (item.tableName === 'site_settings') {
        // Load current settings, merge, upsert
        const { data } = await client.from('site_settings').select('settings').eq('category', 'website').single();
        const current = (data?.settings as any) || {};
        await client.from('site_settings').upsert({
          category: 'website',
          settings: { ...current, [item.fieldName]: newUrl },
          updated_at: new Date().toISOString(),
        }, { onConflict: 'category' });
      } else {
        await client.from(item.tableName).update({
          [item.fieldName]: newUrl || null,
          updated_at: new Date().toISOString(),
        }).eq('id', item.id.split('-')[0]);
      }

      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, imageUrl: newUrl } : i));
      setSaved(item.id);
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      console.error('Failed to save:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(null);
    }
  }, []);

  const handleRemove = useCallback(async (item: ContentItemImage) => {
    await handleUpdate(item, '');
  }, [handleUpdate]);

  if (activeTab === 'broken') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Content Images</h1>
          <p className="text-sm text-[#57534E] mt-1">Manage cover images, thumbnails, and photos across all content sections.</p>
        </motion.div>
        <div className="flex items-center gap-1 p-1 bg-[#F3F1ED] rounded-2xl overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id ? 'bg-white text-[#A6852F] shadow-sm' : 'text-[#57534E] hover:text-[#1C1917]'
                }`}>
                <Icon className="w-4 h-4" />{tab.label}
              </button>
            );
          })}
        </div>
        <BrokenImageScanner onNavigateToSection={(section) => {
          const tabMap: Record<string, ContentTab> = {
            Journal: 'journal', Gallery: 'gallery', Filmography: 'projects',
            Media: 'videos', Projects: 'projects', Journey: 'journey', Profile: 'profile',
          };
          setActiveTab(tabMap[section] || 'journal');
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Content Images</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage cover images, thumbnails, and photos across all content sections.</p>
      </motion.div>

      <div className="flex items-center gap-1 p-1 bg-[#F3F1ED] rounded-2xl overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id ? 'bg-white text-[#A6852F] shadow-sm' : 'text-[#57534E] hover:text-[#1C1917]'
              }`}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>

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
            <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="group rounded-2xl border border-[#A6852F]/20 bg-white overflow-hidden hover:shadow-xl hover:shadow-[#A6852F]/10 transition-all duration-500">
              <div className="p-3">
                <p className="text-xs font-medium text-[#1C1917] truncate mb-2" title={item.title}>{item.title}</p>
                <ImageUploader
                  currentUrl={item.imageUrl}
                  folder={`content/${item.section}`}
                  onUpload={(url) => handleUpdate(item, url)}
                  onRemove={() => handleRemove(item)}
                  label=""
                />
                {saving === item.id && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#A6852F]">
                    <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                  </div>
                )}
                {saved === item.id && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#16A34A]">
                    ✓ Saved
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
