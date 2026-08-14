import React, { useState, useCallback } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

/**
 * Image component that gracefully handles broken Supabase Storage URLs.
 * If the image fails to load, it falls back to a local asset or shows nothing.
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc,
  alt = '',
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasFailed, setHasFailed] = useState(false);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (hasFailed) return; // Prevent infinite loop
    setHasFailed(true);

    if (fallbackSrc && fallbackSrc !== src) {
      setImgSrc(fallbackSrc);
    } else {
      // Hide the broken image
      (e.target as HTMLImageElement).style.display = 'none';
    }

    onError?.(e);
  }, [hasFailed, fallbackSrc, src, onError]);

  if (hasFailed && !fallbackSrc) return null;

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};

/**
 * Check if a URL is a valid Supabase Storage URL
 */
export function isSupabaseStorageUrl(url: string): boolean {
  return url.includes('supabase.co/storage') || url.includes('supabase.storage');
}

/**
 * Get a safe image source — if the URL is a Supabase Storage URL that might be broken,
 * the SafeImage component will handle the fallback automatically.
 */
export function getSafeImageSrc(
  supabaseUrl: string | undefined | null,
  localFallback: string
): string {
  if (!supabaseUrl || supabaseUrl.trim() === '') return localFallback;
  return supabaseUrl;
}
