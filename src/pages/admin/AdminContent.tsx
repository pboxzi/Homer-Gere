import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import type { AdminSection, ContentItem, FAQItem, JournalArticle } from '../../data/adminData';
import { useAdmin } from '../../context/AdminContext';

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

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayFormatted(): string {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'published':
      return 'bg-[#16A34A]/10 text-[#16A34A]';
    case 'draft':
      return 'bg-[#F59E0B]/10 text-[#F59E0B]';
    case 'scheduled':
      return 'bg-[#2563EB]/10 text-[#2563EB]';
    case 'archived':
      return 'bg-[#9CA3AF]/10 text-[#9CA3AF]';
    default:
      return 'bg-[#9CA3AF]/10 text-[#9CA3AF]';
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
// Content Table (journey, projects, gallery, media-content)
// ============================================================

interface ContentTableProps {
  items: ContentItem[];
  onAdd: (item: ContentItem) => void;
  onUpdate: (id: string, updates: Partial<ContentItem>) => void;
  onDelete: (id: string) => void;
}

function ContentTable({ items, onAdd, onUpdate, onDelete }: ContentTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [addForm, setAddForm] = useState({
    title: '',
    category: '',
    excerpt: '',
    status: 'draft' as ContentItem['status'],
  });

  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    excerpt: '',
    status: 'draft' as ContentItem['status'],
  });

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        search === '' ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' || item.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const handleAdd = () => {
    if (!addForm.title.trim()) return;
    onAdd({
      id: generateId(),
      title: addForm.title,
      section: items[0]?.section ?? ('journey' as ContentItem['section']),
      status: addForm.status,
      author: 'Admin',
      lastModified: todayFormatted(),
      tags: [],
      category: addForm.category,
      excerpt: addForm.excerpt,
    });
    setAddForm({ title: '', category: '', excerpt: '', status: 'draft' });
    setShowAddForm(false);
  };

  const handleEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      category: item.category,
      excerpt: item.excerpt ?? '',
      status: item.status,
    });
  };

  const handleSaveEdit = (id: string) => {
    onUpdate(id, {
      title: editForm.title,
      category: editForm.category,
      excerpt: editForm.excerpt,
      status: editForm.status,
      lastModified: todayFormatted(),
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-4">
      {/* Search + Filter + Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917]"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#1C1917]">Add New Item</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Title"
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                />
                <input
                  placeholder="Category"
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                />
              </div>
              <input
                placeholder="Excerpt"
                value={addForm.excerpt}
                onChange={(e) => setAddForm({ ...addForm, excerpt: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
              />
              <div className="flex items-center gap-3">
                <select
                  value={addForm.status}
                  onChange={(e) => setAddForm({ ...addForm, status: e.target.value as ContentItem['status'] })}
                  className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_120px_100px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
          <span>Title</span>
          <span>Status</span>
          <span>Category</span>
          <span>Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#57534E]">No items found.</div>
        ) : (
          filtered.map((item) => (
            <div key={item.id}>
              {editingId === item.id ? (
                <div className="px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 bg-[#F3F1ED]/20">
                  <div className="grid grid-cols-[1fr_100px_120px_100px] gap-4 items-center">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                    />
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ContentItem['status'] })}
                      className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="archived">Archived</option>
                    </select>
                    <input
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium hover:bg-[#8F7228] transition-colors cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[10px] font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      value={editForm.excerpt}
                      onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                      placeholder="Excerpt"
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-[1fr_100px_120px_100px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#57534E] shrink-0" />
                    <span className="text-sm text-[#1C1917] truncate">{item.title}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 w-fit ${statusBadgeClass(item.status)}`}>
                    {statusIcon(item.status)}
                    {item.status}
                  </span>
                  <span className="text-xs text-[#57534E]">{item.category}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer"
                      >
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
    </div>
  );
}

// ============================================================
// Journal Table
// ============================================================

interface JournalTableProps {
  articles: JournalArticle[];
  onAdd: (article: JournalArticle) => void;
  onUpdate: (id: string, updates: Partial<JournalArticle>) => void;
  onDelete: (id: string) => void;
}

function JournalTable({ articles, onAdd, onUpdate, onDelete }: JournalTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [addForm, setAddForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft' as JournalArticle['status'],
    readTime: '5 min',
  });

  const [editForm, setEditForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft' as JournalArticle['status'],
    readTime: '5 min',
  });

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch =
        search === '' ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase()) ||
        a.author.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' || a.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [articles, search, statusFilter]);

  const handleAdd = () => {
    if (!addForm.title.trim()) return;
    onAdd({
      id: generateId(),
      title: addForm.title,
      excerpt: addForm.excerpt,
      content: addForm.content,
      author: 'Admin',
      category: addForm.category,
      tags: addForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      status: addForm.status,
      publishedDate: addForm.status === 'published' ? todayFormatted() : '',
      lastModified: todayFormatted(),
      readTime: addForm.readTime,
      views: 0,
    });
    setAddForm({ title: '', excerpt: '', content: '', category: '', tags: '', status: 'draft', readTime: '5 min' });
    setShowAddForm(false);
  };

  const handleEdit = (article: JournalArticle) => {
    setEditingId(article.id);
    setEditForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags.join(', '),
      status: article.status,
      readTime: article.readTime,
    });
  };

  const handleSaveEdit = (id: string) => {
    onUpdate(id, {
      title: editForm.title,
      excerpt: editForm.excerpt,
      content: editForm.content,
      category: editForm.category,
      tags: editForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      status: editForm.status,
      readTime: editForm.readTime,
      lastModified: todayFormatted(),
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-4">
      {/* Search + Filter + Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917]"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#1C1917]">Add New Article</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Title"
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                />
                <input
                  placeholder="Category"
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                />
              </div>
              <input
                placeholder="Excerpt"
                value={addForm.excerpt}
                onChange={(e) => setAddForm({ ...addForm, excerpt: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
              />
              <textarea
                placeholder="Content"
                value={addForm.content}
                onChange={(e) => setAddForm({ ...addForm, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm resize-none"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  placeholder="Tags (comma-separated)"
                  value={addForm.tags}
                  onChange={(e) => setAddForm({ ...addForm, tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                />
                <input
                  placeholder="Read Time (e.g. 5 min)"
                  value={addForm.readTime}
                  onChange={(e) => setAddForm({ ...addForm, readTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                />
                <select
                  value={addForm.status}
                  onChange={(e) => setAddForm({ ...addForm, status: e.target.value as JournalArticle['status'] })}
                  className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_100px_100px_80px_60px_100px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
          <span>Title</span>
          <span>Author</span>
          <span>Category</span>
          <span>Status</span>
          <span>Published</span>
          <span>Views</span>
          <span>Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#57534E]">No articles found.</div>
        ) : (
          filtered.map((article) => (
            <div key={article.id}>
              {editingId === article.id ? (
                <div className="px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 bg-[#F3F1ED]/20 space-y-3">
                  <div className="grid grid-cols-[1fr_100px_100px] gap-3 items-center">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                    />
                    <input
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                    />
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as JournalArticle['status'] })}
                      className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                  <input
                    value={editForm.excerpt}
                    onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                    placeholder="Excerpt"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                  />
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    placeholder="Content"
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm resize-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={editForm.tags}
                      onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                      placeholder="Tags (comma-separated)"
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                    />
                    <input
                      value={editForm.readTime}
                      onChange={(e) => setEditForm({ ...editForm, readTime: e.target.value })}
                      placeholder="Read Time"
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveEdit(article.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium hover:bg-[#8F7228] transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[10px] font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-[1fr_100px_100px_100px_80px_60px_100px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#57534E] shrink-0" />
                    <span className="text-sm text-[#1C1917] truncate">{article.title}</span>
                  </div>
                  <span className="text-xs text-[#57534E] truncate">{article.author}</span>
                  <span className="text-xs text-[#57534E]">{article.category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 w-fit ${statusBadgeClass(article.status)}`}>
                    {statusIcon(article.status)}
                    {article.status}
                  </span>
                  <span className="text-[10px] text-[#57534E]">{article.publishedDate || '—'}</span>
                  <span className="text-[10px] text-[#57534E]">{article.views.toLocaleString()}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(article)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {deleteConfirmId === article.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(article.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer"
                      >
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
    </div>
  );
}

// ============================================================
// FAQ List
// ============================================================

interface FAQListProps {
  items: FAQItem[];
  onAdd: (item: FAQItem) => void;
  onUpdate: (id: string, updates: Partial<FAQItem>) => void;
  onDelete: (id: string) => void;
  onReorder: (items: FAQItem[]) => void;
}

function FAQList({ items, onAdd, onUpdate, onDelete, onReorder }: FAQListProps) {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [addForm, setAddForm] = useState({
    question: '',
    answer: '',
    category: '',
    published: true,
  });

  const [editForm, setEditForm] = useState({
    question: '',
    answer: '',
    category: '',
    published: true,
  });

  const filtered = useMemo(() => {
    return items
      .sort((a, b) => a.order - b.order)
      .filter((item) => {
        if (search === '') return true;
        return (
          item.question.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase()) ||
          item.answer.toLowerCase().includes(search.toLowerCase())
        );
      });
  }, [items, search]);

  const handleAdd = () => {
    if (!addForm.question.trim()) return;
    onAdd({
      id: generateId(),
      question: addForm.question,
      answer: addForm.answer,
      category: addForm.category,
      order: items.length + 1,
      published: addForm.published,
    });
    setAddForm({ question: '', answer: '', category: '', published: true });
    setShowAddForm(false);
  };

  const handleEdit = (item: FAQItem) => {
    setEditingId(item.id);
    setEditForm({
      question: item.question,
      answer: item.answer,
      category: item.category,
      published: item.published,
    });
  };

  const handleSaveEdit = (id: string) => {
    onUpdate(id, {
      question: editForm.question,
      answer: editForm.answer,
      category: editForm.category,
      published: editForm.published,
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...filtered];
    const temp = sorted[index];
    sorted[index] = sorted[index - 1];
    sorted[index - 1] = temp;
    const reordered = sorted.map((item, i) => ({ ...item, order: i + 1 }));
    onReorder(reordered);
  };

  const handleMoveDown = (index: number) => {
    if (index === filtered.length - 1) return;
    const sorted = [...filtered];
    const temp = sorted[index];
    sorted[index] = sorted[index + 1];
    sorted[index + 1] = temp;
    const reordered = sorted.map((item, i) => ({ ...item, order: i + 1 }));
    onReorder(reordered);
  };

  return (
    <div className="space-y-4">
      {/* Search + Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
          />
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#1C1917]">Add New FAQ</h4>
                <button onClick={() => setShowAddForm(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                placeholder="Question"
                value={addForm.question}
                onChange={(e) => setAddForm({ ...addForm, question: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
              />
              <textarea
                placeholder="Answer"
                value={addForm.answer}
                onChange={(e) => setAddForm({ ...addForm, answer: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm resize-none"
              />
              <div className="flex items-center gap-3">
                <input
                  placeholder="Category"
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                />
                <button
                  onClick={() => setAddForm({ ...addForm, published: !addForm.published })}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm cursor-pointer"
                >
                  {addForm.published ? (
                    <ToggleRight className="w-5 h-5 text-[#16A34A]" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-[#9CA3AF]" />
                  )}
                  <span className="text-xs text-[#57534E]">{addForm.published ? 'Published' : 'Draft'}</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8F7228] transition-colors cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ List */}
      <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_120px_80px_100px] gap-3 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
          <span></span>
          <span>Question</span>
          <span>Category</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#57534E]">No FAQs found.</div>
        ) : (
          filtered.map((item, index) => (
            <div key={item.id}>
              {editingId === item.id ? (
                <div className="px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 bg-[#F3F1ED]/20 space-y-3">
                  <div className="grid grid-cols-[40px_1fr] gap-3 items-center">
                    <div />
                    <input
                      value={editForm.question}
                      onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-[40px_1fr] gap-3 items-start">
                    <div />
                    <textarea
                      value={editForm.answer}
                      onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-[40px_1fr] gap-3 items-center">
                    <div />
                    <div className="flex items-center gap-3">
                      <input
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        placeholder="Category"
                        className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
                      />
                      <button
                        onClick={() => setEditForm({ ...editForm, published: !editForm.published })}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm cursor-pointer"
                      >
                        {editForm.published ? (
                          <ToggleRight className="w-5 h-5 text-[#16A34A]" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-[#9CA3AF]" />
                        )}
                        <span className="text-xs text-[#57534E]">{editForm.published ? 'Published' : 'Draft'}</span>
                      </button>
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium hover:bg-[#8F7228] transition-colors cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg border border-[#E8E5DF]/60 text-[10px] font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 hover:bg-[#F3F1ED]/30 transition-colors">
                  <div className="grid grid-cols-[40px_1fr_120px_80px_100px] gap-3 items-center">
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
                        disabled={index === filtered.length - 1}
                        className="w-6 h-6 rounded flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm text-[#1C1917] font-medium">{item.question}</p>
                      <p className="text-[10px] text-[#57534E] mt-0.5 line-clamp-1">{item.answer}</p>
                    </div>
                    <span className="text-xs text-[#57534E]">{item.category}</span>
                    <button
                      onClick={() => onUpdate(item.id, { published: !item.published })}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 w-fit cursor-pointer ${
                        item.published
                          ? 'bg-[#16A34A]/10 text-[#16A34A]'
                          : 'bg-[#9CA3AF]/10 text-[#9CA3AF]'
                      }`}
                    >
                      {item.published ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {item.published ? 'Published' : 'Draft'}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-[10px] font-medium cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded-lg border border-[#E8E5DF]/60 text-[10px] text-[#57534E] cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// Main AdminContent Component
// ============================================================

export const AdminContent: React.FC<AdminContentProps> = ({ activeSection }) => {
  const { pages } = useAdmin();

  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  const [journalArticles, setJournalArticles] = useState<JournalArticle[]>([]);

  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  const sectionMap: Record<string, ContentItem['section']> = {
    journey: 'journey',
    projects: 'projects',
    gallery: 'gallery',
    'media-content': 'media',
  };

  const currentSection = sectionMap[activeSection] ?? activeSection;
  const sectionTitle = SECTION_TITLES[activeSection] ?? activeSection;

  const sectionContentItems = useMemo(() => {
    return contentItems.filter((item) => item.section === currentSection);
  }, [contentItems, currentSection]);

  const handleAddContentItem = (item: ContentItem) => {
    setContentItems((prev) => [item, ...prev]);
  };

  const handleUpdateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteContentItem = (id: string) => {
    setContentItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddJournalArticle = (article: JournalArticle) => {
    setJournalArticles((prev) => [article, ...prev]);
  };

  const handleUpdateJournalArticle = (id: string, updates: Partial<JournalArticle>) => {
    setJournalArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const handleDeleteJournalArticle = (id: string) => {
    setJournalArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddFAQ = (item: FAQItem) => {
    setFaqs((prev) => [...prev, item]);
  };

  const handleUpdateFAQ = (id: string, updates: Partial<FAQItem>) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const handleReorderFAQs = (reordered: FAQItem[]) => {
    setFaqs((prev) => {
      const map = new Map(prev.map((f) => [f.id, f]));
      return reordered.map((f) => ({ ...map.get(f.id)!, order: f.order }));
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">{sectionTitle}</h1>
        <p className="text-sm text-[#57534E] mt-1">
          Manage {sectionTitle.toLowerCase()} content for your website.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {(activeSection === 'journey' || activeSection === 'projects' || activeSection === 'gallery' || activeSection === 'media-content') && (
          <ContentTable
            items={sectionContentItems}
            onAdd={handleAddContentItem}
            onUpdate={handleUpdateContentItem}
            onDelete={handleDeleteContentItem}
          />
        )}

        {activeSection === 'journal' && (
          <JournalTable
            articles={journalArticles}
            onAdd={handleAddJournalArticle}
            onUpdate={handleUpdateJournalArticle}
            onDelete={handleDeleteJournalArticle}
          />
        )}

        {activeSection === 'faqs' && (
          <FAQList
            items={faqs}
            onAdd={handleAddFAQ}
            onUpdate={handleUpdateFAQ}
            onDelete={handleDeleteFAQ}
            onReorder={handleReorderFAQs}
          />
        )}
      </motion.div>
    </div>
  );
};
