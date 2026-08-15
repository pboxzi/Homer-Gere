import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Image,
  BarChart3,
  Quote,
  Star,
  Megaphone,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import type { AdminSection } from '../../data/adminData';
import { homepageCmsRepository } from '../../lib/repositories';
import {
  HomepageSection,
  HomepageHeroSlide,
  HomepageStatistic,
  HomepageQuote,
  HomepageFeatured,
  HomepageCta,
} from '../../types/database';

interface AdminHomepageProps {
  activeSection: AdminSection;
  onNavigateToSection: (section: AdminSection) => void;
}

const inputCls =
  'w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 transition-colors';
const labelCls = 'text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]';
const sectionCls = 'rounded-xl border border-[#A6852F]/20 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-500';
const saveBtnCls =
  'px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] transition-colors cursor-pointer';

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

const Tabs: React.FC<{ activeTab: string; tabs: { id: string; label: string; icon: React.ReactNode }[]; onChange: (id: string) => void }> = ({
  activeTab,
  tabs,
  onChange,
}) => (
  <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-[#F3F1ED] border border-[#E8E5DF]/60">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
          activeTab === tab.id
            ? 'bg-white text-[#1C1917] shadow-sm'
            : 'text-[#57534E] hover:text-[#1C1917]'
        }`}
      >
        {tab.icon}
        <span className="hidden sm:inline">{tab.label}</span>
      </button>
    ))}
  </div>
);

// ─── Section Order ────────────────────────────────────────────
const SectionOrderTab: React.FC = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    homepageCmsRepository
      .getSections()
      .then(setSections)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggleEnabled = (id: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
    const section = sections.find((s) => s.id === id);
    if (section) {
      homepageCmsRepository.updateSection(id, { enabled: !section.enabled }).catch(() => {});
    }
  };

  const handleTogglePublished = (id: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, published: !s.published } : s)));
    const section = sections.find((s) => s.id === id);
    if (section) {
      homepageCmsRepository.updateSection(id, { published: !section.published }).catch(() => {});
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...sections].sort((a, b) => a.display_order - b.display_order);
    const temp = sorted[index];
    sorted[index] = sorted[index - 1];
    sorted[index - 1] = temp;
    const reordered = sorted.map((s, i) => ({ ...s, display_order: i + 1 }));
    setSections(reordered);
    homepageCmsRepository
      .reorderSections(reordered.map((s) => ({ id: s.id, display_order: s.display_order })))
      .catch(() => {});
  };

  const handleMoveDown = (index: number) => {
    const sorted = [...sections].sort((a, b) => a.display_order - b.display_order);
    if (index === sorted.length - 1) return;
    const temp = sorted[index];
    sorted[index] = sorted[index + 1];
    sorted[index + 1] = temp;
    const reordered = sorted.map((s, i) => ({ ...s, display_order: i + 1 }));
    setSections(reordered);
    homepageCmsRepository
      .reorderSections(reordered.map((s) => ({ id: s.id, display_order: s.display_order })))
      .catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" />
      </div>
    );
  }

  const sorted = [...sections].sort((a, b) => a.display_order - b.display_order);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <>
        {/* Desktop table */}
        <div className="hidden md:block rounded-2xl border border-[#A6852F]/10 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-[40px_1fr_140px_100px_100px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span></span>
            <span>Section</span>
            <span>Key</span>
            <span>Enabled</span>
            <span>Published</span>
          </div>
          {sorted.map((section, index) => (
            <div
              key={section.id}
              className="grid grid-cols-[40px_1fr_140px_100px_100px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors"
            >
              <div className="flex flex-col items-center gap-0.5">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === sorted.length - 1}
                  className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <span className="text-sm text-[#1C1917] font-medium">{section.title || section.section_key}</span>
                {section.subtitle && (
                  <p className="text-[10px] text-[#57534E] mt-0.5 line-clamp-1">{section.subtitle}</p>
                )}
              </div>
              <span className="text-xs text-[#57534E] font-mono">{section.section_key}</span>
              <Toggle on={section.enabled} onToggle={() => handleToggleEnabled(section.id)} />
              <button
                onClick={() => handleTogglePublished(section.id)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 w-fit cursor-pointer ${
                  section.published
                    ? 'bg-[#16A34A]/10 text-[#16A34A]'
                    : 'bg-[#9CA3AF]/10 text-[#9CA3AF]'
                }`}
              >
                {section.published ? 'Published' : 'Draft'}
              </button>
            </div>
          ))}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {sorted.map((section, index) => (
            <div key={section.id} className="bg-white rounded-xl border border-[#E8E5DF]/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#1C1917]">{section.title || section.section_key}</span>
                <div className="flex items-center gap-2">
                  <Toggle on={section.enabled} onToggle={() => handleToggleEnabled(section.id)} />
                  <button
                    onClick={() => handleTogglePublished(section.id)}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 cursor-pointer ${
                      section.published
                        ? 'bg-[#16A34A]/10 text-[#16A34A]'
                        : 'bg-[#9CA3AF]/10 text-[#9CA3AF]'
                    }`}
                  >
                    {section.published ? 'Published' : 'Draft'}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#57534E] font-mono">{section.section_key}</p>
                {section.subtitle && <p className="text-xs text-[#57534E] line-clamp-1">{section.subtitle}</p>}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => handleMoveUp(index)} disabled={index === 0}
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-[#F3F1ED] text-[#57534E] text-xs font-medium hover:bg-[#E8E5DF] transition-colors cursor-pointer disabled:opacity-30 flex items-center justify-center">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => handleMoveDown(index)} disabled={index === sorted.length - 1}
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-[#F3F1ED] text-[#57534E] text-xs font-medium hover:bg-[#E8E5DF] transition-colors cursor-pointer disabled:opacity-30 flex items-center justify-center">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    </motion.div>
  );
};

// ─── Hero Slides ──────────────────────────────────────────────
const HeroSlidesTab: React.FC = () => {
  const [slides, setSlides] = useState<HomepageHeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const emptySlide = {
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    mobile_image_url: '',
    button_text: '',
    button_link: '',
    secondary_button_text: '',
    secondary_button_link: '',
    active: true,
    published: true,
  };

  const [addForm, setAddForm] = useState(emptySlide);
  const [editForm, setEditForm] = useState(emptySlide);

  useEffect(() => {
    homepageCmsRepository
      .getHeroSlides()
      .then(setSlides)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!addForm.title.trim()) return;
    const maxOrder = slides.reduce((max, s) => Math.max(max, s.display_order), 0);
    const payload = { ...addForm, display_order: maxOrder + 1, created_by: null, updated_by: null };
    const tempId = 'temp_' + Date.now();
    setSlides((prev) => [...prev, { ...payload, id: tempId, created_at: '', updated_at: '' }]);
    setShowAddForm(false);
    setAddForm(emptySlide);
    try {
      const created = await homepageCmsRepository.createHeroSlide(payload);
      setSlides((prev) => prev.map((s) => (s.id === tempId ? created : s)));
    } catch {
      setSlides((prev) => prev.filter((s) => s.id !== tempId));
    }
  };

  const handleEdit = (slide: HomepageHeroSlide) => {
    setEditingId(slide.id);
    setEditForm({
      title: slide.title,
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      image_url: slide.image_url || '',
      mobile_image_url: slide.mobile_image_url || '',
      button_text: slide.button_text || '',
      button_link: slide.button_link || '',
      secondary_button_text: slide.secondary_button_text || '',
      secondary_button_link: slide.secondary_button_link || '',
      active: slide.active,
      published: slide.published,
    });
  };

  const handleSaveEdit = async (id: string) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...editForm } : s)));
    setEditingId(null);
    try {
      await homepageCmsRepository.updateHeroSlide(id, editForm);
    } catch { /* optimistic */ }
  };

  const handleDelete = async (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirmId(null);
    try {
      await homepageCmsRepository.deleteHeroSlide(id);
    } catch { /* optimistic */ }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...slides].sort((a, b) => a.display_order - b.display_order);
    const temp = sorted[index];
    sorted[index] = sorted[index - 1];
    sorted[index - 1] = temp;
    const reordered = sorted.map((s, i) => ({ ...s, display_order: i + 1 }));
    setSlides(reordered);
    homepageCmsRepository.reorderHeroSlides(reordered.map((s) => ({ id: s.id, display_order: s.display_order }))).catch(() => {});
  };

  const handleMoveDown = (index: number) => {
    const sorted = [...slides].sort((a, b) => a.display_order - b.display_order);
    if (index === sorted.length - 1) return;
    const temp = sorted[index];
    sorted[index] = sorted[index + 1];
    sorted[index + 1] = temp;
    const reordered = sorted.map((s, i) => ({ ...s, display_order: i + 1 }));
    setSlides(reordered);
    homepageCmsRepository.reorderHeroSlides(reordered.map((s) => ({ id: s.id, display_order: s.display_order }))).catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" />
      </div>
    );
  }

  const sorted = [...slides].sort((a, b) => a.display_order - b.display_order);

  const FormFields: React.FC<{
    form: typeof addForm;
    onChange: (f: typeof addForm) => void;
  }> = ({ form, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={`${labelCls} block mb-1.5`}>Title</label>
        <input
          className={inputCls}
          value={form.title}
          onChange={(e) => onChange({ ...form, title: e.target.value })}
          placeholder="Slide title..."
        />
      </div>
      <div>
        <label className={`${labelCls} block mb-1.5`}>Subtitle</label>
        <input
          className={inputCls}
          value={form.subtitle}
          onChange={(e) => onChange({ ...form, subtitle: e.target.value })}
          placeholder="Subtitle..."
        />
      </div>
      <div className="md:col-span-2">
        <label className={`${labelCls} block mb-1.5`}>Description</label>
        <textarea
          className={`${inputCls} !h-20 resize-none`}
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          placeholder="Description..."
        />
      </div>
      <div>
        <label className={`${labelCls} block mb-1.5`}>Image URL</label>
        <input
          className={inputCls}
          value={form.image_url}
          onChange={(e) => onChange({ ...form, image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div>
        <label className={`${labelCls} block mb-1.5`}>Mobile Image URL</label>
        <input
          className={inputCls}
          value={form.mobile_image_url}
          onChange={(e) => onChange({ ...form, mobile_image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div>
        <label className={`${labelCls} block mb-1.5`}>Button Text</label>
        <input
          className={inputCls}
          value={form.button_text}
          onChange={(e) => onChange({ ...form, button_text: e.target.value })}
          placeholder="Button text..."
        />
      </div>
      <div>
        <label className={`${labelCls} block mb-1.5`}>Button Link</label>
        <input
          className={inputCls}
          value={form.button_link}
          onChange={(e) => onChange({ ...form, button_link: e.target.value })}
          placeholder="/path..."
        />
      </div>
      <div>
        <label className={`${labelCls} block mb-1.5`}>Secondary Button Text</label>
        <input
          className={inputCls}
          value={form.secondary_button_text}
          onChange={(e) => onChange({ ...form, secondary_button_text: e.target.value })}
          placeholder="Secondary text..."
        />
      </div>
      <div>
        <label className={`${labelCls} block mb-1.5`}>Secondary Button Link</label>
        <input
          className={inputCls}
          value={form.secondary_button_link}
          onChange={(e) => onChange({ ...form, secondary_button_link: e.target.value })}
          placeholder="/path..."
        />
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <label className={labelCls}>Active</label>
          <Toggle on={form.active} onToggle={() => onChange({ ...form, active: !form.active })} />
        </div>
        <div className="flex items-center gap-2">
          <label className={labelCls}>Published</label>
          <Toggle on={form.published} onToggle={() => onChange({ ...form, published: !form.published })} />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#1C1917]">Hero Slides</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Slide
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className={`${sectionCls} space-y-4`}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-[#1C1917]">Add New Slide</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <FormFields form={addForm} onChange={setAddForm} />
              <div className="flex items-center gap-3">
                <button onClick={handleAdd} className={saveBtnCls}>Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sorted.map((slide, index) => (
            <motion.div
              key={slide.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {editingId === slide.id ? (
                <div className={`${sectionCls} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-[#1C1917]">Edit Slide</h4>
                    <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <FormFields form={editForm} onChange={setEditForm} />
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleSaveEdit(slide.id)} className={saveBtnCls}>Save</button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-3 px-4 rounded-xl border border-[#A6852F]/20 bg-white hover:border-[#A6852F]/40 transition-all duration-500 group shadow-sm hover:shadow-lg">
                  <div className="flex flex-col items-center gap-0.5">
                    <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleMoveDown(index)} disabled={index === sorted.length - 1} className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {slide.image_url ? (
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-[#F3F1ED] shrink-0">
                      <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-10 rounded-lg bg-[#F3F1ED] flex items-center justify-center shrink-0">
                      <Image className="w-4 h-4 text-[#D6D3D1]" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-[#1C1917] font-medium block truncate">{slide.title}</span>
                    {slide.subtitle && <span className="text-[10px] text-[#57534E] block truncate">{slide.subtitle}</span>}
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 shrink-0 ${slide.active ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#9CA3AF]/10 text-[#9CA3AF]'}`}>
                    {slide.active ? 'Active' : 'Inactive'}
                  </span>

                  <button onClick={() => handleEdit(slide)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer shrink-0">
                    <GripVertical className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirmId === slide.id ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleDelete(slide.id)} className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm</button>
                      <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirmId(slide.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ─── Statistics ────────────────────────────────────────────────
const StatisticsTab: React.FC = () => {
  const [stats, setStats] = useState<HomepageStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const emptyStat = { label: '', value: '', icon: '', published: true };

  const [addForm, setAddForm] = useState(emptyStat);
  const [editForm, setEditForm] = useState(emptyStat);

  useEffect(() => {
    homepageCmsRepository
      .getStatistics()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!addForm.label.trim()) return;
    const maxOrder = stats.reduce((max, s) => Math.max(max, s.display_order), 0);
    const payload = { ...addForm, display_order: maxOrder + 1, created_by: null, updated_by: null };
    const tempId = 'temp_' + Date.now();
    setStats((prev) => [...prev, { ...payload, id: tempId, created_at: '', updated_at: '' }]);
    setShowAddForm(false);
    setAddForm(emptyStat);
    try {
      const created = await homepageCmsRepository.createStatistic(payload);
      setStats((prev) => prev.map((s) => (s.id === tempId ? created : s)));
    } catch {
      setStats((prev) => prev.filter((s) => s.id !== tempId));
    }
  };

  const handleEdit = (stat: HomepageStatistic) => {
    setEditingId(stat.id);
    setEditForm({ label: stat.label, value: stat.value, icon: stat.icon || '', published: stat.published });
  };

  const handleSaveEdit = async (id: string) => {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, ...editForm } : s)));
    setEditingId(null);
    try {
      await homepageCmsRepository.updateStatistic(id, editForm);
    } catch { /* optimistic */ }
  };

  const handleDelete = async (id: string) => {
    setStats((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirmId(null);
    try {
      await homepageCmsRepository.deleteStatistic(id);
    } catch { /* optimistic */ }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...stats].sort((a, b) => a.display_order - b.display_order);
    const temp = sorted[index];
    sorted[index] = sorted[index - 1];
    sorted[index - 1] = temp;
    const reordered = sorted.map((s, i) => ({ ...s, display_order: i + 1 }));
    setStats(reordered);
    homepageCmsRepository.reorderStatistics(reordered.map((s) => ({ id: s.id, display_order: s.display_order }))).catch(() => {});
  };

  const handleMoveDown = (index: number) => {
    const sorted = [...stats].sort((a, b) => a.display_order - b.display_order);
    if (index === sorted.length - 1) return;
    const temp = sorted[index];
    sorted[index] = sorted[index + 1];
    sorted[index + 1] = temp;
    const reordered = sorted.map((s, i) => ({ ...s, display_order: i + 1 }));
    setStats(reordered);
    homepageCmsRepository.reorderStatistics(reordered.map((s) => ({ id: s.id, display_order: s.display_order }))).catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" />
      </div>
    );
  }

  const sorted = [...stats].sort((a, b) => a.display_order - b.display_order);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#1C1917]">Statistics</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Stat
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className={`${sectionCls} space-y-4`}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-[#1C1917]">Add New Statistic</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Label</label>
                  <input className={inputCls} value={addForm.label} onChange={(e) => setAddForm({ ...addForm, label: e.target.value })} placeholder="e.g. Projects Completed" />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Value</label>
                  <input className={inputCls} value={addForm.value} onChange={(e) => setAddForm({ ...addForm, value: e.target.value })} placeholder="e.g. 50+" />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Icon (lucide name)</label>
                  <input className={inputCls} value={addForm.icon} onChange={(e) => setAddForm({ ...addForm, icon: e.target.value })} placeholder="e.g. Film" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <label className={labelCls}>Published</label>
                  <Toggle on={addForm.published} onToggle={() => setAddForm({ ...addForm, published: !addForm.published })} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleAdd} className={saveBtnCls}>Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <>
        {/* Desktop table */}
        <div className="hidden md:block rounded-2xl border border-[#A6852F]/10 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-[40px_1fr_120px_100px_100px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span></span>
            <span>Label</span>
            <span>Value</span>
            <span>Icon</span>
            <span>Actions</span>
          </div>
          {sorted.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-[#57534E]">No statistics found.</div>
          ) : (
            sorted.map((stat, index) => (
              <div key={stat.id}>
                {editingId === stat.id ? (
                  <div className="px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 bg-[#F3F1ED]/20 space-y-3">
                    <div className="grid grid-cols-[40px_1fr_120px_100px] gap-3 items-center">
                      <div />
                      <input className={inputCls} value={editForm.label} onChange={(e) => setEditForm({ ...editForm, label: e.target.value })} />
                      <input className={inputCls} value={editForm.value} onChange={(e) => setEditForm({ ...editForm, value: e.target.value })} />
                      <input className={inputCls} value={editForm.icon} onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })} />
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleSaveEdit(stat.id)} className="px-3 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">Save</button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[10px] font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-[40px_1fr_120px_100px_100px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
                    <div className="flex flex-col items-center gap-0.5">
                      <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleMoveDown(index)} disabled={index === sorted.length - 1} className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm text-[#1C1917] font-medium">{stat.label}</span>
                    <span className="text-sm text-[#1C1917]">{stat.value}</span>
                    <span className="text-xs text-[#57534E]">{stat.icon || '—'}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(stat)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer">
                        <GripVertical className="w-3.5 h-3.5" />
                      </button>
                      {deleteConfirmId === stat.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(stat.id)} className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirmId(stat.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {sorted.length === 0 ? (
            <div className="text-center py-10 text-sm text-[#57534E]">No statistics found.</div>
          ) : sorted.map((stat, index) => (
            <div key={stat.id} className="bg-white rounded-xl border border-[#E8E5DF]/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#1C1917]">{stat.label}</span>
                <span className="text-sm font-medium text-[#1C1917]">{stat.value}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#57534E]">Icon: {stat.icon || '—'}</p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => handleMoveUp(index)} disabled={index === 0}
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-[#F3F1ED] text-[#57534E] text-xs font-medium hover:bg-[#E8E5DF] transition-colors cursor-pointer disabled:opacity-30 flex items-center justify-center">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => handleMoveDown(index)} disabled={index === sorted.length - 1}
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-[#F3F1ED] text-[#57534E] text-xs font-medium hover:bg-[#E8E5DF] transition-colors cursor-pointer disabled:opacity-30 flex items-center justify-center">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button onClick={() => handleEdit(stat)} className="flex-1 min-h-[44px] rounded-lg bg-[#F3F1ED] text-[#57534E] text-xs font-medium hover:bg-[#E8E5DF] transition-colors cursor-pointer flex items-center justify-center gap-1">
                  <GripVertical className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setDeleteConfirmId(stat.id)} className="min-h-[44px] min-w-[44px] rounded-lg bg-[#DC2626]/10 text-[#DC2626] text-xs font-medium hover:bg-[#DC2626]/20 transition-colors cursor-pointer flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {deleteConfirmId === stat.id && (
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => handleDelete(stat.id)} className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm Delete</button>
                  <button onClick={() => setDeleteConfirmId(null)} className="flex-1 min-h-[44px] rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    </motion.div>
  );
};

// ─── Featured Content ──────────────────────────────────────────
const FeaturedTab: React.FC = () => {
  const [featured, setFeatured] = useState<HomepageFeatured[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const sectionKeys = ['featured_project', 'featured_article', 'featured_gallery', 'featured_video', 'featured_experience'] as const;

  const typeMap: Record<string, string> = {
    featured_project: 'project',
    featured_article: 'article',
    featured_gallery: 'gallery',
    featured_video: 'video',
    featured_experience: 'experience',
  };

  const emptyFeatured = { section_key: 'featured_project', reference_id: '', reference_type: 'project', published: true };
  const [addForm, setAddForm] = useState(emptyFeatured);
  const [editForm, setEditForm] = useState(emptyFeatured);

  useEffect(() => {
    homepageCmsRepository
      .getFeatured()
      .then(setFeatured)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!addForm.reference_id.trim()) return;
    const maxOrder = featured.reduce((max, f) => Math.max(max, f.display_order), 0);
    const payload = { ...addForm, reference_type: typeMap[addForm.section_key] || 'project', display_order: maxOrder + 1, created_by: null, updated_by: null };
    const tempId = 'temp_' + Date.now();
    setFeatured((prev) => [...prev, { ...payload, id: tempId, created_at: '', updated_at: '' }]);
    setShowAddForm(false);
    setAddForm(emptyFeatured);
    try {
      const created = await homepageCmsRepository.createFeatured(payload);
      setFeatured((prev) => prev.map((f) => (f.id === tempId ? created : f)));
    } catch {
      setFeatured((prev) => prev.filter((f) => f.id !== tempId));
    }
  };

  const handleEdit = (item: HomepageFeatured) => {
    setEditingId(item.id);
    setEditForm({ section_key: item.section_key, reference_id: item.reference_id, reference_type: item.reference_type, published: item.published });
  };

  const handleSaveEdit = async (id: string) => {
    const updates = { ...editForm, reference_type: typeMap[editForm.section_key] || editForm.reference_type };
    setFeatured((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    setEditingId(null);
    try {
      await homepageCmsRepository.updateFeatured(id, updates);
    } catch { /* optimistic */ }
  };

  const handleDelete = async (id: string) => {
    setFeatured((prev) => prev.filter((f) => f.id !== id));
    setDeleteConfirmId(null);
    try {
      await homepageCmsRepository.deleteFeatured(id);
    } catch { /* optimistic */ }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#1C1917]">Featured Content</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Featured
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className={`${sectionCls} space-y-4`}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-[#1C1917]">Add Featured Item</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Section Key</label>
                  <select
                    className={inputCls}
                    value={addForm.section_key}
                    onChange={(e) => setAddForm({ ...addForm, section_key: e.target.value, reference_type: typeMap[e.target.value] || 'project' })}
                  >
                    {sectionKeys.map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Reference ID</label>
                  <input className={inputCls} value={addForm.reference_id} onChange={(e) => setAddForm({ ...addForm, reference_id: e.target.value })} placeholder="UUID or slug..." />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Reference Type</label>
                  <input className={`${inputCls} !bg-[#F3F1ED]`} value={typeMap[addForm.section_key] || 'project'} readOnly />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <label className={labelCls}>Published</label>
                  <Toggle on={addForm.published} onToggle={() => setAddForm({ ...addForm, published: !addForm.published })} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleAdd} className={saveBtnCls}>Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <>
        {/* Desktop table */}
        <div className="hidden md:block rounded-2xl border border-[#A6852F]/10 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-[1fr_120px_100px_100px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
            <span>Section / Reference</span>
            <span>Type</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {featured.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-[#57534E]">No featured items found.</div>
          ) : (
            featured.map((item) => (
              <div key={item.id}>
                {editingId === item.id ? (
                  <div className="px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 bg-[#F3F1ED]/20 space-y-3">
                    <div className="grid grid-cols-[1fr_120px_100px] gap-3 items-center">
                      <div className="flex items-center gap-2">
                        <select className={inputCls} value={editForm.section_key} onChange={(e) => setEditForm({ ...editForm, section_key: e.target.value, reference_type: typeMap[e.target.value] || 'project' })}>
                          {sectionKeys.map((key) => <option key={key} value={key}>{key}</option>)}
                        </select>
                        <input className={`${inputCls} flex-1`} value={editForm.reference_id} onChange={(e) => setEditForm({ ...editForm, reference_id: e.target.value })} />
                      </div>
                      <input className={inputCls} value={typeMap[editForm.section_key] || 'project'} readOnly />
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleSaveEdit(item.id)} className="px-3 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium hover:bg-[#8F7228] transition-colors cursor-pointer">Save</button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[10px] font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-[1fr_120px_100px_100px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
                    <div>
                      <span className="text-sm text-[#1C1917] font-medium block">{item.section_key}</span>
                      <span className="text-[10px] text-[#57534E] font-mono block">{item.reference_id}</span>
                    </div>
                    <span className="text-xs text-[#57534E]">{item.reference_type}</span>
                    <button
                      onClick={() => {
                        setFeatured((prev) => prev.map((f) => (f.id === item.id ? { ...f, published: !f.published } : f)));
                        homepageCmsRepository.updateFeatured(item.id, { published: !item.published }).catch(() => {});
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 w-fit cursor-pointer ${item.published ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#9CA3AF]/10 text-[#9CA3AF]'}`}
                    >
                      {item.published ? 'Published' : 'Draft'}
                    </button>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(item)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer">
                        <GripVertical className="w-3.5 h-3.5" />
                      </button>
                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(item.id)} className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirmId(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {featured.length === 0 ? (
            <div className="text-center py-10 text-sm text-[#57534E]">No featured items found.</div>
          ) : featured.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-[#E8E5DF]/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#1C1917]">{item.section_key}</span>
                <button
                  onClick={() => {
                    setFeatured((prev) => prev.map((f) => (f.id === item.id ? { ...f, published: !f.published } : f)));
                    homepageCmsRepository.updateFeatured(item.id, { published: !item.published }).catch(() => {});
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 cursor-pointer ${item.published ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#9CA3AF]/10 text-[#9CA3AF]'}`}
                >
                  {item.published ? 'Published' : 'Draft'}
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-[#57534E] font-mono">{item.reference_id}</p>
                <p className="text-xs text-[#57534E]">Type: {item.reference_type}</p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => handleEdit(item)} className="flex-1 min-h-[44px] rounded-lg bg-[#F3F1ED] text-[#57534E] text-xs font-medium hover:bg-[#E8E5DF] transition-colors cursor-pointer flex items-center justify-center gap-1">
                  <GripVertical className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setDeleteConfirmId(item.id)} className="min-h-[44px] min-w-[44px] rounded-lg bg-[#DC2626]/10 text-[#DC2626] text-xs font-medium hover:bg-[#DC2626]/20 transition-colors cursor-pointer flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {deleteConfirmId === item.id && (
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => handleDelete(item.id)} className="flex-1 min-h-[44px] rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm Delete</button>
                  <button onClick={() => setDeleteConfirmId(null)} className="flex-1 min-h-[44px] rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    </motion.div>
  );
};

// ─── Quotes ────────────────────────────────────────────────────
const QuotesTab: React.FC = () => {
  const [quotes, setQuotes] = useState<HomepageQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const emptyQuote = { quote: '', author: '', position: '', portrait_url: '', published: true };
  const [addForm, setAddForm] = useState(emptyQuote);
  const [editForm, setEditForm] = useState(emptyQuote);

  useEffect(() => {
    homepageCmsRepository
      .getQuotes()
      .then(setQuotes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!addForm.quote.trim()) return;
    const maxOrder = quotes.reduce((max, q) => Math.max(max, q.display_order), 0);
    const payload = { ...addForm, display_order: maxOrder + 1, created_by: null, updated_by: null };
    const tempId = 'temp_' + Date.now();
    setQuotes((prev) => [...prev, { ...payload, id: tempId, created_at: '', updated_at: '' }]);
    setShowAddForm(false);
    setAddForm(emptyQuote);
    try {
      const created = await homepageCmsRepository.createQuote(payload);
      setQuotes((prev) => prev.map((q) => (q.id === tempId ? created : q)));
    } catch {
      setQuotes((prev) => prev.filter((q) => q.id !== tempId));
    }
  };

  const handleEdit = (quote: HomepageQuote) => {
    setEditingId(quote.id);
    setEditForm({ quote: quote.quote, author: quote.author, position: quote.position || '', portrait_url: quote.portrait_url || '', published: quote.published });
  };

  const handleSaveEdit = async (id: string) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, ...editForm } : q)));
    setEditingId(null);
    try {
      await homepageCmsRepository.updateQuote(id, editForm);
    } catch { /* optimistic */ }
  };

  const handleDelete = async (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    setDeleteConfirmId(null);
    try {
      await homepageCmsRepository.deleteQuote(id);
    } catch { /* optimistic */ }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...quotes].sort((a, b) => a.display_order - b.display_order);
    const temp = sorted[index];
    sorted[index] = sorted[index - 1];
    sorted[index - 1] = temp;
    const reordered = sorted.map((q, i) => ({ ...q, display_order: i + 1 }));
    setQuotes(reordered);
    homepageCmsRepository.reorderQuotes(reordered.map((q) => ({ id: q.id, display_order: q.display_order }))).catch(() => {});
  };

  const handleMoveDown = (index: number) => {
    const sorted = [...quotes].sort((a, b) => a.display_order - b.display_order);
    if (index === sorted.length - 1) return;
    const temp = sorted[index];
    sorted[index] = sorted[index + 1];
    sorted[index + 1] = temp;
    const reordered = sorted.map((q, i) => ({ ...q, display_order: i + 1 }));
    setQuotes(reordered);
    homepageCmsRepository.reorderQuotes(reordered.map((q) => ({ id: q.id, display_order: q.display_order }))).catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" />
      </div>
    );
  }

  const sorted = [...quotes].sort((a, b) => a.display_order - b.display_order);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#1C1917]">Quotes</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Quote
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className={`${sectionCls} space-y-4`}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-[#1C1917]">Add New Quote</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <label className={`${labelCls} block mb-1.5`}>Quote</label>
                <textarea className={`${inputCls} !h-20 resize-none`} value={addForm.quote} onChange={(e) => setAddForm({ ...addForm, quote: e.target.value })} placeholder="Quote text..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Author</label>
                  <input className={inputCls} value={addForm.author} onChange={(e) => setAddForm({ ...addForm, author: e.target.value })} placeholder="Author name..." />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Position</label>
                  <input className={inputCls} value={addForm.position} onChange={(e) => setAddForm({ ...addForm, position: e.target.value })} placeholder="Position / title..." />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Portrait URL</label>
                  <input className={inputCls} value={addForm.portrait_url} onChange={(e) => setAddForm({ ...addForm, portrait_url: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <label className={labelCls}>Published</label>
                  <Toggle on={addForm.published} onToggle={() => setAddForm({ ...addForm, published: !addForm.published })} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleAdd} className={saveBtnCls}>Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sorted.map((quote, index) => (
            <motion.div
              key={quote.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {editingId === quote.id ? (
                <div className={`${sectionCls} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-[#1C1917]">Edit Quote</h4>
                    <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className={`${labelCls} block mb-1.5`}>Quote</label>
                    <textarea className={`${inputCls} !h-20 resize-none`} value={editForm.quote} onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`${labelCls} block mb-1.5`}>Author</label>
                      <input className={inputCls} value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} />
                    </div>
                    <div>
                      <label className={`${labelCls} block mb-1.5`}>Position</label>
                      <input className={inputCls} value={editForm.position} onChange={(e) => setEditForm({ ...editForm, position: e.target.value })} />
                    </div>
                    <div>
                      <label className={`${labelCls} block mb-1.5`}>Portrait URL</label>
                      <input className={inputCls} value={editForm.portrait_url} onChange={(e) => setEditForm({ ...editForm, portrait_url: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleSaveEdit(quote.id)} className={saveBtnCls}>Save</button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 py-3 px-4 rounded-xl border border-[#E8E5DF]/60 bg-white hover:border-[#E8E5DF] transition-all group">
                  <div className="flex flex-col items-center gap-0.5 pt-1">
                    <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleMoveDown(index)} disabled={index === sorted.length - 1} className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {quote.portrait_url ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F3F1ED] shrink-0">
                      <img src={quote.portrait_url} alt={quote.author} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F3F1ED] flex items-center justify-center shrink-0">
                      <Quote className="w-4 h-4 text-[#D6D3D1]" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1C1917] italic line-clamp-2">"{quote.quote}"</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-[#57534E] font-medium">{quote.author}</span>
                      {quote.position && <span className="text-[10px] text-[#A9A29E]">— {quote.position}</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setQuotes((prev) => prev.map((q) => (q.id === quote.id ? { ...q, published: !q.published } : q)));
                      homepageCmsRepository.updateQuote(quote.id, { published: !quote.published }).catch(() => {});
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 shrink-0 cursor-pointer ${quote.published ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#9CA3AF]/10 text-[#9CA3AF]'}`}
                  >
                    {quote.published ? 'Published' : 'Draft'}
                  </button>

                  <button onClick={() => handleEdit(quote)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer shrink-0">
                    <GripVertical className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirmId === quote.id ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleDelete(quote.id)} className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm</button>
                      <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirmId(quote.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ─── CTA Sections ──────────────────────────────────────────────
const CtaTab: React.FC = () => {
  const [ctas, setCtas] = useState<HomepageCta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const emptyCta = { title: '', description: '', button_text: '', button_link: '', background_image_url: '', published: true };
  const [addForm, setAddForm] = useState(emptyCta);
  const [editForm, setEditForm] = useState(emptyCta);

  useEffect(() => {
    homepageCmsRepository
      .getCtaSections()
      .then(setCtas)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!addForm.title.trim()) return;
    const maxOrder = ctas.reduce((max, c) => Math.max(max, c.display_order), 0);
    const payload = { ...addForm, display_order: maxOrder + 1, created_by: null, updated_by: null };
    const tempId = 'temp_' + Date.now();
    setCtas((prev) => [...prev, { ...payload, id: tempId, created_at: '', updated_at: '' }]);
    setShowAddForm(false);
    setAddForm(emptyCta);
    try {
      const created = await homepageCmsRepository.createCta(payload);
      setCtas((prev) => prev.map((c) => (c.id === tempId ? created : c)));
    } catch {
      setCtas((prev) => prev.filter((c) => c.id !== tempId));
    }
  };

  const handleEdit = (cta: HomepageCta) => {
    setEditingId(cta.id);
    setEditForm({ title: cta.title, description: cta.description || '', button_text: cta.button_text || '', button_link: cta.button_link || '', background_image_url: cta.background_image_url || '', published: cta.published });
  };

  const handleSaveEdit = async (id: string) => {
    setCtas((prev) => prev.map((c) => (c.id === id ? { ...c, ...editForm } : c)));
    setEditingId(null);
    try {
      await homepageCmsRepository.updateCta(id, editForm);
    } catch { /* optimistic */ }
  };

  const handleDelete = async (id: string) => {
    setCtas((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
    try {
      await homepageCmsRepository.deleteCta(id);
    } catch { /* optimistic */ }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...ctas].sort((a, b) => a.display_order - b.display_order);
    const temp = sorted[index];
    sorted[index] = sorted[index - 1];
    sorted[index - 1] = temp;
    const reordered = sorted.map((c, i) => ({ ...c, display_order: i + 1 }));
    setCtas(reordered);
    homepageCmsRepository.reorderCta(reordered.map((c) => ({ id: c.id, display_order: c.display_order }))).catch(() => {});
  };

  const handleMoveDown = (index: number) => {
    const sorted = [...ctas].sort((a, b) => a.display_order - b.display_order);
    if (index === sorted.length - 1) return;
    const temp = sorted[index];
    sorted[index] = sorted[index + 1];
    sorted[index + 1] = temp;
    const reordered = sorted.map((c, i) => ({ ...c, display_order: i + 1 }));
    setCtas(reordered);
    homepageCmsRepository.reorderCta(reordered.map((c) => ({ id: c.id, display_order: c.display_order }))).catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#A6852F] animate-spin" />
      </div>
    );
  }

  const sorted = [...ctas].sort((a, b) => a.display_order - b.display_order);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#1C1917]">CTA Sections</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add CTA
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className={`${sectionCls} space-y-4`}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-[#1C1917]">Add New CTA</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Title</label>
                  <input className={inputCls} value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} placeholder="CTA title..." />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Description</label>
                  <input className={inputCls} value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} placeholder="CTA description..." />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Button Text</label>
                  <input className={inputCls} value={addForm.button_text} onChange={(e) => setAddForm({ ...addForm, button_text: e.target.value })} placeholder="Button label..." />
                </div>
                <div>
                  <label className={`${labelCls} block mb-1.5`}>Button Link</label>
                  <input className={inputCls} value={addForm.button_link} onChange={(e) => setAddForm({ ...addForm, button_link: e.target.value })} placeholder="/path..." />
                </div>
                <div className="md:col-span-2">
                  <label className={`${labelCls} block mb-1.5`}>Background Image URL</label>
                  <input className={inputCls} value={addForm.background_image_url} onChange={(e) => setAddForm({ ...addForm, background_image_url: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <label className={labelCls}>Published</label>
                  <Toggle on={addForm.published} onToggle={() => setAddForm({ ...addForm, published: !addForm.published })} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleAdd} className={saveBtnCls}>Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sorted.map((cta, index) => (
            <motion.div
              key={cta.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {editingId === cta.id ? (
                <div className={`${sectionCls} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-[#1C1917]">Edit CTA</h4>
                    <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`${labelCls} block mb-1.5`}>Title</label>
                      <input className={inputCls} value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                    </div>
                    <div>
                      <label className={`${labelCls} block mb-1.5`}>Description</label>
                      <input className={inputCls} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                    </div>
                    <div>
                      <label className={`${labelCls} block mb-1.5`}>Button Text</label>
                      <input className={inputCls} value={editForm.button_text} onChange={(e) => setEditForm({ ...editForm, button_text: e.target.value })} />
                    </div>
                    <div>
                      <label className={`${labelCls} block mb-1.5`}>Button Link</label>
                      <input className={inputCls} value={editForm.button_link} onChange={(e) => setEditForm({ ...editForm, button_link: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`${labelCls} block mb-1.5`}>Background Image URL</label>
                      <input className={inputCls} value={editForm.background_image_url} onChange={(e) => setEditForm({ ...editForm, background_image_url: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleSaveEdit(cta.id)} className={saveBtnCls}>Save</button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-3 px-4 rounded-xl border border-[#A6852F]/20 bg-white hover:border-[#A6852F]/40 transition-all duration-500 group shadow-sm hover:shadow-lg">
                  <div className="flex flex-col items-center gap-0.5">
                    <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleMoveDown(index)} disabled={index === sorted.length - 1} className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {cta.background_image_url ? (
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-[#F3F1ED] shrink-0">
                      <img src={cta.background_image_url} alt={cta.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-10 rounded-lg bg-[#F3F1ED] flex items-center justify-center shrink-0">
                      <Megaphone className="w-4 h-4 text-[#D6D3D1]" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-[#1C1917] font-medium block truncate">{cta.title}</span>
                    {cta.button_text && <span className="text-[10px] text-[#57534E] block truncate">{cta.button_text} → {cta.button_link}</span>}
                  </div>

                  <button
                    onClick={() => {
                      setCtas((prev) => prev.map((c) => (c.id === cta.id ? { ...c, published: !c.published } : c)));
                      homepageCmsRepository.updateCta(cta.id, { published: !cta.published }).catch(() => {});
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 shrink-0 cursor-pointer ${cta.published ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#9CA3AF]/10 text-[#9CA3AF]'}`}
                  >
                    {cta.published ? 'Published' : 'Draft'}
                  </button>

                  <button onClick={() => handleEdit(cta)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer shrink-0">
                    <GripVertical className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirmId === cta.id ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleDelete(cta.id)} className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer">Confirm</button>
                      <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirmId(cta.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────
export const AdminHomepage: React.FC<AdminHomepageProps> = ({ activeSection, onNavigateToSection }) => {
  const [activeTab, setActiveTab] = useState('sections');

  const tabs = [
    { id: 'sections', label: 'Section Order', icon: <List className="w-3.5 h-3.5" /> },
    { id: 'hero', label: 'Hero Slides', icon: <Image className="w-3.5 h-3.5" /> },
    { id: 'statistics', label: 'Statistics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'featured', label: 'Featured', icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'quotes', label: 'Quotes', icon: <Quote className="w-3.5 h-3.5" /> },
    { id: 'cta', label: 'CTAs', icon: <Megaphone className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Homepage CMS</h1>
        <p className="text-sm text-[#57534E] mt-1">
          Manage homepage content, sections, and layout.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Tabs activeTab={activeTab} tabs={tabs} onChange={setActiveTab} />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'sections' && <SectionOrderTab />}
          {activeTab === 'hero' && <HeroSlidesTab />}
          {activeTab === 'statistics' && <StatisticsTab />}
          {activeTab === 'featured' && <FeaturedTab />}
          {activeTab === 'quotes' && <QuotesTab />}
          {activeTab === 'cta' && <CtaTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
