import React, { useState, useCallback, useEffect } from 'react';
import { AlertTriangle, Loader2, RefreshCw, ExternalLink, Upload } from 'lucide-react';
import { getSupabaseClient } from '../lib/repositories';

interface BrokenImage {
  table: string;
  field: string;
  id: string;
  title: string;
  currentUrl: string;
  issue: 'empty' | 'invalid_url' | 'not_found';
  section: string;
}

const IMAGE_FIELDS: { table: string; field: string; titleField: string; section: string }[] = [
  { table: 'journal_articles', field: 'cover_image', titleField: 'title', section: 'Journal' },
  { table: 'journal_articles', field: 'og_image', titleField: 'title', section: 'Journal' },
  { table: 'journal_articles', field: 'author_image', titleField: 'title', section: 'Journal' },
  { table: 'gallery_photos', field: 'src', titleField: 'alt', section: 'Gallery' },
  { table: 'gallery_collections', field: 'cover_image', titleField: 'title', section: 'Gallery' },
  { table: 'filmography_entries', field: 'image', titleField: 'title', section: 'Filmography' },
  { table: 'experiences', field: 'image', titleField: 'title', section: 'Experiences' },
  { table: 'media_videos', field: 'thumbnail', titleField: 'title', section: 'Media' },
  { table: 'media_podcasts', field: 'cover_art', titleField: 'episode_title', section: 'Media' },
  { table: 'media_press', field: 'image', titleField: 'headline', section: 'Media' },
  { table: 'projects', field: 'image', titleField: 'title', section: 'Projects' },
  { table: 'projects', field: 'hero_image', titleField: 'title', section: 'Projects' },
  { table: 'projects', field: 'poster_image', titleField: 'title', section: 'Projects' },
  { table: 'projects', field: 'logo_image', titleField: 'title', section: 'Projects' },
  { table: 'project_videos', field: 'thumbnail', titleField: 'title', section: 'Projects' },
  { table: 'journey_entries', field: 'image_url', titleField: 'title', section: 'Journey' },
  { table: 'profiles', field: 'avatar_url', titleField: 'email', section: 'Profile' },
];

function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || url.trim() === '') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('./')) return true;
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      new URL(trimmed);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

interface Props {
  onNavigateToSection?: (section: string) => void;
}

export const BrokenImageScanner: React.FC<Props> = ({ onNavigateToSection }) => {
  const [brokenImages, setBrokenImages] = useState<BrokenImage[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const scan = useCallback(async () => {
    setScanning(true);
    setBrokenImages([]);
    try {
      const client = getSupabaseClient();
      const results: BrokenImage[] = [];

      for (const { table, field, titleField, section } of IMAGE_FIELDS) {
        try {
          const { data, error } = await client
            .from(table)
            .select(`${field}, ${titleField}, id`)
            .limit(200);

          if (error || !data) continue;

          for (const row of data as any[]) {
            const url = row[field];
            if (!isValidImageUrl(url)) {
              results.push({
                table,
                field,
                id: row.id,
                title: row[titleField] || 'Untitled',
                currentUrl: url || '',
                issue: !url || url.trim() === '' ? 'empty' : 'invalid_url',
                section,
              });
            }
          }
        } catch {
          // Skip table on error
        }
      }

      setBrokenImages(results);
      setScanned(true);
    } finally {
      setScanning(false);
    }
  }, []);

  const sections = ['all', ...new Set(brokenImages.map((b) => b.section))];
  const filtered = filter === 'all' ? brokenImages : brokenImages.filter((b) => b.section === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-[#1C1917] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
            Broken Image Scanner
          </h3>
          <p className="text-[11px] text-[#57534E] mt-0.5">
            Scan database for missing or invalid image URLs
          </p>
        </div>
        <button
          onClick={scan}
          disabled={scanning}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-[#A6852F]/10 text-[#A6852F] hover:bg-[#A6852F]/20 transition-colors cursor-pointer disabled:opacity-50"
        >
          {scanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          {scanning ? 'Scanning...' : 'Scan Now'}
        </button>
      </div>

      {scanned && (
        <>
          {brokenImages.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {sections.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                    filter === s
                      ? 'bg-[#D97706]/10 text-[#D97706]'
                      : 'text-[#57534E] hover:bg-[#F3F1ED]'
                  }`}
                >
                  {s === 'all' ? 'All' : s}
                  <span className="ml-1 opacity-60">
                    ({s === 'all' ? brokenImages.length : brokenImages.filter((b) => b.section === s).length})
                  </span>
                </button>
              ))}
            </div>
          )}

          {brokenImages.length === 0 ? (
            <div className="text-center py-8 rounded-xl border border-[#16A34A]/20 bg-[#16A34A]/5">
              <p className="text-sm font-medium text-[#16A34A]">All images look good!</p>
              <p className="text-[11px] text-[#57534E] mt-1">No broken image references found.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#D97706]/20 overflow-hidden">
              <div className="bg-[#D97706]/5 px-4 py-2.5 border-b border-[#D97706]/10">
                <p className="text-[11px] font-medium text-[#D97706]">
                  {filtered.length} image{filtered.length !== 1 ? 's' : ''} require{filtered.length === 1 ? 's' : ''} attention
                </p>
              </div>
              <div className="divide-y divide-[#E8E5DF]/40 max-h-96 overflow-y-auto">
                {filtered.map((item) => (
                  <div key={`${item.table}-${item.field}-${item.id}`} className="px-4 py-3 flex items-center gap-3 hover:bg-[#F3F1ED]/30">
                    <div className="w-10 h-10 rounded-lg bg-[#D97706]/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1C1917] truncate">{item.title}</p>
                      <p className="text-[10px] text-[#57534E]">
                        {item.section} &middot; {item.table}.{item.field}
                      </p>
                      <p className="text-[10px] text-[#DC2626] mt-0.5">
                        {item.issue === 'empty' ? 'Image Required — No URL set' : `Invalid URL: ${item.currentUrl.substring(0, 60)}...`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {onNavigateToSection && (
                        <button
                          onClick={() => onNavigateToSection(item.section)}
                          className="px-2 py-1 rounded-lg bg-[#A6852F]/10 text-[10px] font-medium text-[#A6852F] hover:bg-[#A6852F]/20 transition-colors cursor-pointer"
                        >
                          <Upload className="w-3 h-3 inline mr-1" />
                          Upload
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!scanned && !scanning && (
        <div className="text-center py-8 rounded-xl border border-dashed border-[#E8E5DF]">
          <AlertTriangle className="w-8 h-8 text-[#57534E]/20 mx-auto mb-2" />
          <p className="text-[11px] text-[#57534E]">
            Click "Scan Now" to check for broken image references across all content tables.
          </p>
        </div>
      )}
    </div>
  );
};
