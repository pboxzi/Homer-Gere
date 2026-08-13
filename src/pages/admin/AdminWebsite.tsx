import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Search,
  X,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Home,
  Navigation as NavigationIcon,
  LayoutTemplate,
  LayoutList,
  SearchCode,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import type { AdminSection } from '../../data/adminData';

interface AdminWebsiteProps {
  activeSection: AdminSection;
}

const inputCls =
  'w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 transition-colors';
const labelCls = 'text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]';
const sectionCls = 'rounded-xl border border-[#E8E5DF]/80 bg-white p-4';
const saveBtnCls =
  'px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] transition-colors cursor-pointer';

// ─── Toggle ──────────────────────────────────────────────────
const Toggle: React.FC<{ on: boolean; onToggle: () => void }> = ({ on, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
      on ? 'bg-[#A6852F]' : 'bg-[#E8E5DF]'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
        on ? 'translate-x-4' : 'translate-x-0'
      }`}
    />
  </button>
);

// ─── Section Header ──────────────────────────────────────────
const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  search: string;
  onSearchChange: (v: string) => void;
}> = ({ icon, title, description, search, onSearchChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F]">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[#1C1917] tracking-tight">{title}</h2>
        <p className="text-xs text-[#57534E]">{description}</p>
      </div>
    </div>
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#57534E]" />
      <input
        type="text"
        placeholder="Search settings..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 transition-colors w-56"
      />
    </div>
  </div>
);

// ─── Homepage Sub-section ─────────────────────────────────────
interface HeroState {
  title: string;
  subtitle: string;
  heroImage: string;
  ctaText: string;
  ctaLink: string;
  featuredSections: { id: string; name: string; enabled: boolean }[];
}

const defaultHero: HeroState = {
  title: 'Welcome to Homer Gere',
  subtitle: 'Exclusive access to the world behind the screen.',
  heroImage: '/images/hero-portrait.jpg',
  ctaText: 'Join Now',
  ctaLink: '/membership',
  featuredSections: [
    { id: 'fs1', name: 'Latest Projects', enabled: true },
    { id: 'fs2', name: 'Exclusive Experiences', enabled: true },
    { id: 'fs3', name: 'Journal & Updates', enabled: false },
  ],
};

const HomepageSection: React.FC<{ search: string }> = ({ search }) => {
  const { updateWebsiteSettings } = useAdmin();
  const [hero, setHero] = useState<HeroState>(defaultHero);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateWebsiteSettings({ siteName: hero.title, siteUrl: hero.ctaLink });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const filtered = (s: string) =>
    search === '' || s.toLowerCase().includes(search.toLowerCase());

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      {/* Hero Settings */}
      {(filtered('hero') || filtered('title') || filtered('subtitle') || filtered('image')) && (
        <div className={sectionCls}>
          <h3 className="text-sm font-medium text-[#1C1917] mb-4">Hero Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`${labelCls} block mb-1.5`}>Hero Title</label>
              <input
                className={inputCls}
                value={hero.title}
                onChange={(e) => setHero((p) => ({ ...p, title: e.target.value }))}
                placeholder="Hero title..."
              />
            </div>
            <div>
              <label className={`${labelCls} block mb-1.5`}>Subtitle</label>
              <input
                className={inputCls}
                value={hero.subtitle}
                onChange={(e) => setHero((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="Hero subtitle..."
              />
            </div>
            <div className="md:col-span-2">
              <label className={`${labelCls} block mb-1.5`}>Hero Image URL</label>
              <input
                className={inputCls}
                value={hero.heroImage}
                onChange={(e) => setHero((p) => ({ ...p, heroImage: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Featured Sections */}
      {(filtered('featured') || filtered('section')) && (
        <div className={sectionCls}>
          <h3 className="text-sm font-medium text-[#1C1917] mb-4">Featured Sections</h3>
          <div className="space-y-3">
            {hero.featuredSections.map((fs) => (
              <div
                key={fs.id}
                className="flex items-center justify-between py-2 px-3 rounded-xl border border-[#E8E5DF]/40 hover:bg-[#FAF9F7] transition-colors"
              >
                <span className="text-sm text-[#1C1917]">{fs.name}</span>
                <Toggle
                  on={fs.enabled}
                  onToggle={() =>
                    setHero((p) => ({
                      ...p,
                      featuredSections: p.featuredSections.map((item) =>
                        item.id === fs.id ? { ...item, enabled: !item.enabled } : item
                      ),
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {(filtered('cta') || filtered('button') || filtered('link')) && (
        <div className={sectionCls}>
          <h3 className="text-sm font-medium text-[#1C1917] mb-4">Call to Action</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`${labelCls} block mb-1.5`}>Button Text</label>
              <input
                className={inputCls}
                value={hero.ctaText}
                onChange={(e) => setHero((p) => ({ ...p, ctaText: e.target.value }))}
                placeholder="Join Now"
              />
            </div>
            <div>
              <label className={`${labelCls} block mb-1.5`}>Button Link</label>
              <input
                className={inputCls}
                value={hero.ctaLink}
                onChange={(e) => setHero((p) => ({ ...p, ctaLink: e.target.value }))}
                placeholder="/membership"
              />
            </div>
          </div>
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave} className={saveBtnCls}>
          {saved ? (
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" /> Save Homepage
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Navigation Sub-section ───────────────────────────────────
interface NavItem {
  id: string;
  label: string;
  url: string;
  visible: boolean;
}

const defaultNavItems: NavItem[] = [
  { id: 'n1', label: 'Home', url: '/', visible: true },
  { id: 'n2', label: 'Journey', url: '/journey', visible: true },
  { id: 'n3', label: 'Projects', url: '/projects', visible: true },
  { id: 'n4', label: 'Gallery', url: '/gallery', visible: true },
  { id: 'n5', label: 'Journal', url: '/journal', visible: true },
  { id: 'n6', label: 'Membership', url: '/membership', visible: true },
  { id: 'n7', label: 'Contact', url: '/contact', visible: true },
  { id: 'n8', label: 'FAQ', url: '/faq', visible: false },
];

const NavigationSection: React.FC<{ search: string }> = ({ search }) => {
  const [items, setItems] = useState<NavItem[]>(defaultNavItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [saved, setSaved] = useState(false);

  const addItem = () => {
    const newItem: NavItem = {
      id: 'nav_' + Date.now(),
      label: 'New Item',
      url: '/new-page',
      visible: true,
    };
    setItems((p) => [...p, newItem]);
  };

  const removeItem = (id: string) => {
    setItems((p) => p.filter((i) => i.id !== id));
  };

  const toggleVisible = (id: string) => {
    setItems((p) => p.map((i) => (i.id === id ? { ...i, visible: !i.visible } : i)));
  };

  const startEdit = (item: NavItem) => {
    setEditingId(item.id);
    setEditLabel(item.label);
    setEditUrl(item.url);
  };

  const saveEdit = () => {
    setItems((p) =>
      p.map((i) => (i.id === editingId ? { ...i, label: editLabel, url: editUrl } : i))
    );
    setEditingId(null);
  };

  const filteredItems = items.filter(
    (i) =>
      search === '' ||
      i.label.toLowerCase().includes(search.toLowerCase()) ||
      i.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#1C1917]">Navigation Items</h3>
        <button onClick={addItem} className="text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer inline-flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 py-3 px-4 rounded-xl border border-[#E8E5DF]/60 bg-white hover:border-[#E8E5DF] transition-all group"
            >
              <GripVertical className="w-4 h-4 text-[#D6D3D1] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

              {editingId === item.id ? (
                <>
                  <input
                    className={`${inputCls} !w-36`}
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    placeholder="Label"
                    autoFocus
                  />
                  <input
                    className={`${inputCls} flex-1`}
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="/path"
                  />
                  <button onClick={saveEdit} className="text-[#16A34A] hover:text-[#15803D] transition-colors cursor-pointer p-1">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer p-1">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm text-[#1C1917] font-medium w-36 truncate">{item.label}</span>
                  <span className="text-xs text-[#57534E] flex-1 truncate">{item.url}</span>
                  <Toggle on={item.visible} onToggle={() => toggleVisible(item.id)} />
                  <button
                    onClick={() => startEdit(item)}
                    className="text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer p-1"
                  >
                    <NavigationIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#57534E] hover:text-[#DC2626] transition-colors cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className={saveBtnCls}
        >
          {saved ? (
            <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Saved</span>
          ) : (
            <span className="inline-flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save Navigation</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Footer Sub-section ───────────────────────────────────────
interface FooterColumn {
  id: string;
  title: string;
  links: { id: string; label: string; url: string }[];
}

interface SocialLink {
  platform: string;
  url: string;
}

const defaultColumns: FooterColumn[] = [
  {
    id: 'fc1',
    title: 'Explore',
    links: [
      { id: 'fl1', label: 'Journey', url: '/journey' },
      { id: 'fl2', label: 'Projects', url: '/projects' },
      { id: 'fl3', label: 'Gallery', url: '/gallery' },
      { id: 'fl4', label: 'Journal', url: '/journal' },
    ],
  },
  {
    id: 'fc2',
    title: 'Community',
    links: [
      { id: 'fl5', label: 'Membership', url: '/membership' },
      { id: 'fl6', label: 'Experiences', url: '/experiences' },
      { id: 'fl7', label: 'FAQ', url: '/faq' },
    ],
  },
  {
    id: 'fc3',
    title: 'Legal',
    links: [
      { id: 'fl8', label: 'Terms & Conditions', url: '/terms' },
      { id: 'fl9', label: 'Privacy Policy', url: '/privacy' },
      { id: 'fl10', label: 'Cookie Policy', url: '/cookies' },
    ],
  },
];

const defaultSocial: SocialLink[] = [
  { platform: 'Twitter', url: 'https://twitter.com/homergere' },
  { platform: 'Instagram', url: 'https://instagram.com/homergere' },
  { platform: 'YouTube', url: 'https://youtube.com/@homergere' },
  { platform: 'TikTok', url: 'https://tiktok.com/@homergere' },
  { platform: 'Facebook', url: '' },
];

const FooterSection: React.FC<{ search: string }> = ({ search }) => {
  const [columns, setColumns] = useState<FooterColumn[]>(defaultColumns);
  const [socials, setSocials] = useState<SocialLink[]>(defaultSocial);
  const [copyright, setCopyright] = useState('© 2025 Homer Gere. All rights reserved.');
  const [saved, setSaved] = useState(false);

  const updateSocialUrl = (platform: string, url: string) => {
    setSocials((p) => p.map((s) => (s.platform === platform ? { ...s, url } : s)));
  };

  const addSocial = () => {
    setSocials((p) => [...p, { platform: 'New Platform', url: '' }]);
  };

  const removeSocial = (platform: string) => {
    setSocials((p) => p.filter((s) => s.platform !== platform));
  };

  const addLinkToColumn = (colId: string) => {
    setColumns((p) =>
      p.map((c) =>
        c.id === colId
          ? { ...c, links: [...c.links, { id: 'fl_' + Date.now(), label: 'New Link', url: '/' }] }
          : c
      )
    );
  };

  const removeLinkFromColumn = (colId: string, linkId: string) => {
    setColumns((p) =>
      p.map((c) =>
        c.id === colId ? { ...c, links: c.links.filter((l) => l.id !== linkId) } : c
      )
    );
  };

  const updateLinkInColumn = (colId: string, linkId: string, field: 'label' | 'url', value: string) => {
    setColumns((p) =>
      p.map((c) =>
        c.id === colId
          ? {
              ...c,
              links: c.links.map((l) => (l.id === linkId ? { ...l, [field]: value } : l)),
            }
          : c
      )
    );
  };

  const matchesSearch = (text: string) =>
    search === '' || text.toLowerCase().includes(search.toLowerCase());

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      {/* Link Columns */}
      {(matchesSearch('links') || matchesSearch('columns')) && (
        <div className={sectionCls}>
          <h3 className="text-sm font-medium text-[#1C1917] mb-4">Footer Links</h3>
          <div className="space-y-4">
            {columns.map((col) => (
              <div key={col.id} className="rounded-xl border border-[#E8E5DF]/40 p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[#1C1917]">{col.title}</span>
                  <button
                    onClick={() => addLinkToColumn(col.id)}
                    className="text-[10px] font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {col.links.map((link) => (
                    <div key={link.id} className="flex items-center gap-2">
                      <input
                        className={`${inputCls} !w-36 !text-xs`}
                        value={link.label}
                        onChange={(e) => updateLinkInColumn(col.id, link.id, 'label', e.target.value)}
                        placeholder="Label"
                      />
                      <input
                        className={`${inputCls} !text-xs flex-1`}
                        value={link.url}
                        onChange={(e) => updateLinkInColumn(col.id, link.id, 'url', e.target.value)}
                        placeholder="/path"
                      />
                      <button
                        onClick={() => removeLinkFromColumn(col.id, link.id)}
                        className="text-[#57534E] hover:text-[#DC2626] transition-colors cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Media */}
      {(matchesSearch('social') || matchesSearch('twitter') || matchesSearch('instagram') || matchesSearch('youtube')) && (
        <div className={sectionCls}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#1C1917]">Social Media</h3>
            <button
              onClick={addSocial}
              className="text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {socials.map((s) => (
              <div key={s.platform} className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#1C1917] w-24">{s.platform}</span>
                <input
                  className={`${inputCls} flex-1`}
                  value={s.url}
                  onChange={(e) => updateSocialUrl(s.platform, e.target.value)}
                  placeholder="https://..."
                />
                <button
                  onClick={() => removeSocial(s.platform)}
                  className="text-[#57534E] hover:text-[#DC2626] transition-colors cursor-pointer p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Copyright */}
      {matchesSearch('copyright') && (
        <div className={sectionCls}>
          <h3 className="text-sm font-medium text-[#1C1917] mb-4">Copyright</h3>
          <input
            className={inputCls}
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            placeholder="© 2025 Your Name"
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className={saveBtnCls}
        >
          {saved ? (
            <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Saved</span>
          ) : (
            <span className="inline-flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save Footer</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Menus Sub-section ────────────────────────────────────────
interface MenuItem {
  id: string;
  label: string;
  url: string;
  openInNewTab: boolean;
  children: MenuItem[];
}

const defaultMenus: MenuItem[] = [
  {
    id: 'm1',
    label: 'Explore',
    url: '#',
    openInNewTab: false,
    children: [
      { id: 'm1a', label: 'Journey', url: '/journey', openInNewTab: false, children: [] },
      { id: 'm1b', label: 'Projects', url: '/projects', openInNewTab: false, children: [] },
      { id: 'm1c', label: 'Gallery', url: '/gallery', openInNewTab: false, children: [] },
    ],
  },
  {
    id: 'm2',
    label: 'Community',
    url: '#',
    openInNewTab: false,
    children: [
      { id: 'm2a', label: 'Membership', url: '/membership', openInNewTab: false, children: [] },
      { id: 'm2b', label: 'Experiences', url: '/experiences', openInNewTab: false, children: [] },
    ],
  },
  {
    id: 'm3',
    label: 'Journal',
    url: '/journal',
    openInNewTab: false,
    children: [],
  },
  {
    id: 'm4',
    label: 'Contact',
    url: '/contact',
    openInNewTab: false,
    children: [],
  },
];

const MenuTreeItem: React.FC<{
  item: MenuItem;
  depth: number;
  onToggleTab: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: 'label' | 'url', value: string) => void;
  onAddChild: (parentId: string) => void;
}> = ({ item, depth, onToggleTab, onRemove, onUpdate, onAddChild }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-xl border border-[#E8E5DF]/40 bg-white hover:border-[#E8E5DF] transition-all group"
        style={{ marginLeft: `${depth * 20}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer p-0.5"
          >
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <input
          className={`${inputCls} !w-32 !text-xs`}
          value={item.label}
          onChange={(e) => onUpdate(item.id, 'label', e.target.value)}
          placeholder="Label"
        />
        <input
          className={`${inputCls} !text-xs flex-1`}
          value={item.url}
          onChange={(e) => onUpdate(item.id, 'url', e.target.value)}
          placeholder="/path"
        />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#57534E] whitespace-nowrap">New tab</span>
          <Toggle on={item.openInNewTab} onToggle={() => onToggleTab(item.id)} />
        </div>
        <button
          onClick={() => onAddChild(item.id)}
          className="text-[#57534E] hover:text-[#A6852F] transition-colors cursor-pointer p-1"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="text-[#57534E] hover:text-[#DC2626] transition-colors cursor-pointer p-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children.map((child) => (
              <MenuTreeItem
                key={child.id}
                item={child}
                depth={depth + 1}
                onToggleTab={onToggleTab}
                onRemove={onRemove}
                onUpdate={onUpdate}
                onAddChild={onAddChild}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenusSection: React.FC<{ search: string }> = ({ search }) => {
  const [menus, setMenus] = useState<MenuItem[]>(defaultMenus);
  const [saved, setSaved] = useState(false);

  const toggleTab = useCallback((targetId: string) => {
    const toggle = (items: MenuItem[]): MenuItem[] =>
      items.map((i) =>
        i.id === targetId
          ? { ...i, openInNewTab: !i.openInNewTab }
          : { ...i, children: toggle(i.children) }
      );
    setMenus((p) => toggle(p));
  }, []);

  const removeItem = useCallback((targetId: string) => {
    const remove = (items: MenuItem[]): MenuItem[] =>
      items.filter((i) => i.id !== targetId).map((i) => ({ ...i, children: remove(i.children) }));
    setMenus((p) => remove(p));
  }, []);

  const updateField = useCallback((targetId: string, field: 'label' | 'url', value: string) => {
    const update = (items: MenuItem[]): MenuItem[] =>
      items.map((i) =>
        i.id === targetId ? { ...i, [field]: value } : { ...i, children: update(i.children) }
      );
    setMenus((p) => update(p));
  }, []);

  const addChild = useCallback((parentId: string) => {
    const add = (items: MenuItem[]): MenuItem[] =>
      items.map((i) =>
        i.id === parentId
          ? {
              ...i,
              children: [
                ...i.children,
                { id: 'm_' + Date.now(), label: 'New Item', url: '/', openInNewTab: false, children: [] },
              ],
            }
          : { ...i, children: add(i.children) }
      );
    setMenus((p) => add(p));
  }, []);

  const addTopLevel = () => {
    setMenus((p) => [
      ...p,
      { id: 'm_' + Date.now(), label: 'New Menu', url: '/', openInNewTab: false, children: [] },
    ]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#1C1917]">Menu Items</h3>
        <button
          onClick={addTopLevel}
          className="text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Menu Item
        </button>
      </div>

      <div className="space-y-2">
        {menus.map((item) => (
          <MenuTreeItem
            key={item.id}
            item={item}
            depth={0}
            onToggleTab={toggleTab}
            onRemove={removeItem}
            onUpdate={updateField}
            onAddChild={addChild}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className={saveBtnCls}
        >
          {saved ? (
            <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Saved</span>
          ) : (
            <span className="inline-flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save Menus</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// ─── SEO Sub-section ──────────────────────────────────────────
const SEOSection: React.FC<{ search: string }> = ({ search }) => {
  const { seoSettings, updateSEOSettings } = useAdmin();

  const [metaTitle, setMetaTitle] = useState(seoSettings.metaTitle);
  const [metaDescription, setMetaDescription] = useState(seoSettings.metaDescription);
  const [ogImage, setOgImage] = useState(seoSettings.ogImage);
  const [gaId, setGaId] = useState(seoSettings.googleAnalyticsId);
  const [sitemapEnabled, setSitemapEnabled] = useState(seoSettings.sitemapEnabled);
  const [robotsTxt, setRobotsTxt] = useState(seoSettings.robotsTxt);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSEOSettings({
      metaTitle,
      metaDescription,
      ogImage,
      googleAnalyticsId: gaId,
      sitemapEnabled,
      robotsTxt,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const matchesSearch = (text: string) =>
    search === '' || text.toLowerCase().includes(search.toLowerCase());

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      {/* Meta Title */}
      {(matchesSearch('meta') || matchesSearch('title')) && (
        <div className={sectionCls}>
          <label className={`${labelCls} block mb-1.5`}>Meta Title</label>
          <input
            className={inputCls}
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Page title for search engines..."
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-[#57534E]">
              Appears in search results and browser tabs
            </span>
            <span className={`text-[10px] font-medium ${metaTitle.length > 60 ? 'text-[#DC2626]' : metaTitle.length > 50 ? 'text-[#F59E0B]' : 'text-[#57534E]'}`}>
              {metaTitle.length}/60
            </span>
          </div>
        </div>
      )}

      {/* Meta Description */}
      {(matchesSearch('meta') || matchesSearch('description')) && (
        <div className={sectionCls}>
          <label className={`${labelCls} block mb-1.5`}>Meta Description</label>
          <textarea
            className={`${inputCls} !h-24 resize-none`}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Brief description for search engines..."
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-[#57534E]">
              Shown below the title in search results
            </span>
            <span className={`text-[10px] font-medium ${metaDescription.length > 160 ? 'text-[#DC2626]' : metaDescription.length > 140 ? 'text-[#F59E0B]' : 'text-[#57534E]'}`}>
              {metaDescription.length}/160
            </span>
          </div>
        </div>
      )}

      {/* OG Image */}
      {matchesSearch('og') && (
        <div className={sectionCls}>
          <label className={`${labelCls} block mb-1.5`}>OG Image URL</label>
          <input
            className={inputCls}
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            placeholder="/og-image.jpg"
          />
          <span className="text-[10px] text-[#57534E] mt-1.5 block">
            Image displayed when shared on social media (1200×630 recommended)
          </span>
        </div>
      )}

      {/* Google Analytics */}
      {matchesSearch('analytics') && (
        <div className={sectionCls}>
          <label className={`${labelCls} block mb-1.5`}>Google Analytics ID</label>
          <input
            className={inputCls}
            value={gaId}
            onChange={(e) => setGaId(e.target.value)}
            placeholder="G-XXXXXXXXXX"
          />
        </div>
      )}

      {/* Sitemap */}
      {(matchesSearch('sitemap') || matchesSearch('search')) && (
        <div className={sectionCls}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#1C1917]">Sitemap</h3>
              <p className="text-[10px] text-[#57534E] mt-0.5">
                Auto-generate and submit sitemap to search engines
              </p>
            </div>
            <Toggle on={sitemapEnabled} onToggle={() => setSitemapEnabled(!sitemapEnabled)} />
          </div>
        </div>
      )}

      {/* Robots.txt */}
      {matchesSearch('robots') && (
        <div className={sectionCls}>
          <label className={`${labelCls} block mb-1.5`}>Robots.txt</label>
          <textarea
            className={`${inputCls} !h-32 resize-none font-mono text-xs`}
            value={robotsTxt}
            onChange={(e) => setRobotsTxt(e.target.value)}
            placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin/"
          />
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleSave} className={saveBtnCls}>
          {saved ? (
            <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Saved</span>
          ) : (
            <span className="inline-flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save SEO Settings</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────
export const AdminWebsite: React.FC<AdminWebsiteProps> = ({ activeSection }) => {
  const [search, setSearch] = useState('');

  const sectionConfig: Record<string, { icon: React.ReactNode; title: string; description: string; component: React.ReactNode }> = {
    homepage: {
      icon: <Home className="w-5 h-5" />,
      title: 'Homepage Settings',
      description: 'Manage hero content, featured sections, and call to action.',
      component: <HomepageSection search={search} />,
    },
    navigation: {
      icon: <NavigationIcon className="w-5 h-5" />,
      title: 'Navigation',
      description: 'Manage navigation items, labels, and visibility.',
      component: <NavigationSection search={search} />,
    },
    footer: {
      icon: <LayoutTemplate className="w-5 h-5" />,
      title: 'Footer Settings',
      description: 'Manage footer links, social media, and copyright.',
      component: <FooterSection search={search} />,
    },
    menus: {
      icon: <LayoutList className="w-5 h-5" />,
      title: 'Menus',
      description: 'Manage menu items with nested sub-items.',
      component: <MenusSection search={search} />,
    },
    seo: {
      icon: <SearchCode className="w-5 h-5" />,
      title: 'SEO Settings',
      description: 'Configure meta tags, OG images, analytics, and indexing.',
      component: <SEOSection search={search} />,
    },
  };

  const config = sectionConfig[activeSection] || sectionConfig.homepage;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={config.icon}
        title={config.title}
        description={config.description}
        search={search}
        onSearchChange={setSearch}
      />
      {config.component}
    </div>
  );
};
