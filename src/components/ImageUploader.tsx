import React, { useState, useRef, useCallback } from 'react';
import { Upload, Link, X, Loader2, Check, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploaderProps {
  currentUrl?: string;
  bucket?: string;
  folder?: string;
  onUpload: (url: string) => void | Promise<void>;
  onRemove?: () => void;
  label?: string;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}

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
  admin: 'media',
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentUrl,
  bucket,
  folder = 'uploads',
  onUpload,
  onRemove,
  label = 'Image',
  className = '',
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 10,
}) => {
  const [mode, setMode] = useState<'preview' | 'url' | 'upload'>('preview');
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolvedBucket = bucket || 'media';

  const handleUrlSave = useCallback(async () => {
    if (!urlInput.trim()) return;
    setUploading(true);
    setError('');
    try {
      await onUpload(urlInput.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setMode('preview');
    } catch {
      setError('Failed to save URL');
    } finally {
      setUploading(false);
    }
  }, [urlInput, onUpload]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMB}MB.`);
      return;
    }
    setUploading(true);
    setError('');
    try {
      const path = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data, error: uploadErr } = await supabase.storage
        .from(resolvedBucket)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from(resolvedBucket).getPublicUrl(data.path);
      await onUpload(urlData.publicUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setMode('preview');
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [resolvedBucket, folder, maxSizeMB, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
      setUrlInput(text);
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-[10px] font-medium text-[#57534E] uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {mode === 'preview' && currentUrl ? (
        <div className="relative group rounded-xl overflow-hidden border border-[#E8E5DF]/60 bg-[#F3F1ED]">
          <img
            src={currentUrl}
            alt={label}
            referrerPolicy="no-referrer"
            className="w-full h-32 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
              (e.target as HTMLImageElement).alt = 'Image not found';
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => { setMode('upload'); setUrlInput(currentUrl); }}
              className="px-3 py-1.5 rounded-lg bg-white/90 text-[10px] font-medium text-[#1C1917] hover:bg-white transition-colors cursor-pointer"
            >
              Replace
            </button>
            {onRemove && (
              <button
                onClick={onRemove}
                className="px-3 py-1.5 rounded-lg bg-white/90 text-[10px] font-medium text-[#DC2626] hover:bg-white transition-colors cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
          {saved && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-[#16A34A] text-white text-[10px] font-medium">
              <Check className="w-3 h-3" /> Saved
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="rounded-xl border border-dashed border-[#E8E5DF] hover:border-[#A6852F]/40 bg-[#F3F1ED]/30 hover:bg-[#F3F1ED]/50 transition-all"
        >
          {mode === 'upload' ? (
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#A6852F]/30 bg-[#A6852F]/5 text-[11px] font-medium text-[#A6852F] hover:bg-[#A6852F]/10 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  {uploading ? 'Uploading...' : 'Choose File'}
                </button>
                <button
                  onClick={() => setMode('url')}
                  className="px-3 py-2 rounded-lg border border-[#E8E5DF]/60 text-[11px] font-medium text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                >
                  <Link className="w-3 h-3" />
                </button>
                <button
                  onClick={() => { setMode('preview'); setError(''); }}
                  className="px-2 py-2 rounded-lg text-[11px] text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              />
              <p className="text-[9px] text-[#57534E]/60 text-center">
                Max {maxSizeMB}MB. Drag & drop supported.
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-1">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleUrlSave(); }}
                  onPaste={handlePaste}
                  placeholder="Paste image URL..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#E8E5DF]/60 bg-white text-[11px] focus:outline-none focus:border-[#A6852F]/40"
                />
                <button
                  onClick={handleUrlSave}
                  disabled={uploading || !urlInput.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[#A6852F] text-white text-[10px] font-medium hover:bg-[#8F7228] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? '...' : 'Save'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-[#E8E5DF]/60" />
                <button
                  onClick={() => setMode('upload')}
                  className="text-[9px] text-[#57534E] hover:text-[#A6852F] transition-colors cursor-pointer"
                >
                  or upload file
                </button>
                <div className="flex-1 h-px bg-[#E8E5DF]/60" />
              </div>
              <button
                onClick={() => { setMode('preview'); setError(''); }}
                className="w-full text-[9px] text-[#57534E] hover:text-[#1C1917] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[10px] text-[#DC2626] mt-1">{error}</p>
      )}
    </div>
  );
};
