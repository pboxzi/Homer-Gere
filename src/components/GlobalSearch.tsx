import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, BookOpen, ImageIcon, Users, MessageSquare, Sparkles } from 'lucide-react';
import { PROJECT_DETAILS } from '../data/projectDetails';
import { useSiteContent } from '../context/SiteContentContext';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
}

export const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { journalArticles, galleryItems, experiences, mediaVideos, mediaPodcasts, mediaPress } = useSiteContent();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const r: SearchResult[] = [];

    Object.values(PROJECT_DETAILS).forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.synopsis.toLowerCase().includes(q)) {
        r.push({ id: p.slug, type: 'project', title: p.title, description: p.synopsis.slice(0, 100) + '...', url: `/projects/${p.slug}`, icon: <Film className="w-4 h-4" /> });
      }
    });

    journalArticles.forEach((a) => {
      if (a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)) {
        r.push({ id: a.id, type: 'journal', title: a.title, description: a.excerpt, url: `/journal/${(a as any).slug || a.id}`, icon: <BookOpen className="w-4 h-4" /> });
      }
    });

    galleryItems.forEach((p) => {
      if ((p.caption || '').toLowerCase().includes(q) || p.title.toLowerCase().includes(q)) {
        r.push({ id: p.id, type: 'gallery', title: p.title, description: p.category, url: '/gallery', icon: <ImageIcon className="w-4 h-4" /> });
      }
    });

    experiences.forEach((e) => {
      if (e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)) {
        r.push({ id: e.id, type: 'experience', title: e.title, description: e.description, url: '/experiences', icon: <Sparkles className="w-4 h-4" /> });
      }
    });

    mediaVideos.forEach((v) => {
      if (v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)) {
        r.push({ id: v.id, type: 'media', title: v.title, description: v.description.slice(0, 100) + '...', url: '/media', icon: <Film className="w-4 h-4" /> });
      }
    });

    mediaPodcasts.forEach((p) => {
      if (p.episodeTitle.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
        r.push({ id: p.id, type: 'media', title: p.episodeTitle, description: p.showName, url: '/media', icon: <MessageSquare className="w-4 h-4" /> });
      }
    });

    mediaPress.forEach((p) => {
      if (p.headline.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)) {
        r.push({ id: p.id, type: 'media', title: p.headline, description: p.publisher, url: '/media', icon: <Users className="w-4 h-4" /> });
      }
    });

    setResults(r.slice(0, 10));
  }, [query]);

  const handleSelect = (url: string) => {
    navigate(url);
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh]" onClick={() => setIsOpen(false)}>
      <div className="w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, articles, gallery, media..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto p-2">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelect(r.url)}
                className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-left transition-colors"
              >
                <div className="mt-0.5 text-gray-400">{r.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                  <p className="text-xs text-gray-500 truncate">{r.description}</p>
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{r.type}</span>
              </button>
            ))}
          </div>
        )}
        {query && results.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-400">No results found for "{query}"</div>
        )}
        {!query && (
          <div className="p-8 text-center text-sm text-gray-400">Type to search across all content</div>
        )}
      </div>
    </div>
  );
};
