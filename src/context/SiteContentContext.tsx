import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import {
  TimelineMilestone,
  JournalArticle,
  Experience,
  MembershipTier,
  GalleryItem,
  FAQItem,
  MembershipFAQItem,
  MembershipStep,
  FilmographyEntry,
} from '../types';
import {
  METRICS,
  FEATURED_PROJECT,
  TIMELINE_MILESTONES,
  JOURNAL_ARTICLES,
  EXPERIENCES,
  MEMBERSHIP_TIERS,
  GALLERY_ITEMS,
  FOOTER_LINKS,
  FILMOGRAPHY,
  MEMBERSHIP_STEPS,
  EXPERIENCES_FAQ,
  MEMBERSHIP_FAQ,
  MEDIA_VIDEOS,
  MEDIA_PODCASTS,
  MEDIA_PRESS,
} from '../data/content';
import type { MediaVideo as DBMediaVideo, MediaPodcast as DBMediaPodcast, MediaPress as DBMediaPress } from '../types/database';

// ============================================================
// Image URL validation
// ============================================================

function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url || url.trim() === '') return false;
  // Local paths are always valid
  if (url.startsWith('/') || url.startsWith('./')) return true;
  // HTTP(S) URLs are assumed valid
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  return false;
}

function safeImage(url: string | undefined | null, fallback: string): string {
  return isValidImageUrl(url) ? url! : fallback;
}

// ============================================================
// Context type
// ============================================================

interface SiteContentType {
  metrics: typeof METRICS;
  featuredProject: typeof FEATURED_PROJECT;
  timelineMilestones: TimelineMilestone[];
  journalArticles: JournalArticle[];
  experiences: Experience[];
  membershipTiers: MembershipTier[];
  galleryItems: GalleryItem[];
  footerLinks: typeof FOOTER_LINKS;
  filmography: FilmographyEntry[];
  membershipSteps: MembershipStep[];
  experiencesFAQ: FAQItem[];
  membershipFAQ: MembershipFAQItem[];
  mediaVideos: typeof MEDIA_VIDEOS;
  mediaPodcasts: typeof MEDIA_PODCASTS;
  mediaPress: typeof MEDIA_PRESS;
  loading: boolean;

  updateMetrics: (metrics: typeof METRICS) => void;
  updateFeaturedProject: (project: typeof FEATURED_PROJECT) => void;
  updateTimelineMilestones: (milestones: TimelineMilestone[]) => void;
  updateJournalArticles: (articles: JournalArticle[]) => void;
  updateExperiences: (experiences: Experience[]) => void;
  updateMembershipTiers: (tiers: MembershipTier[]) => void;
  updateGalleryItems: (items: GalleryItem[]) => void;
  updateFooterLinks: (links: typeof FOOTER_LINKS) => void;
  updateFilmography: (entries: FilmographyEntry[]) => void;
  updateMembershipSteps: (steps: MembershipStep[]) => void;
  updateExperiencesFAQ: (faqs: FAQItem[]) => void;
  updateMembershipFAQ: (faqs: MembershipFAQItem[]) => void;
  updateMediaVideos: (videos: typeof MEDIA_VIDEOS) => void;
  updateMediaPodcasts: (podcasts: typeof MEDIA_PODCASTS) => void;
  updateMediaPress: (press: typeof MEDIA_PRESS) => void;
  refreshData: () => Promise<void>;
}

// ============================================================
// Mapping helpers: DB types -> Frontend types
// Only used when Supabase data is available and valid
// ============================================================

function mapJourneyToMilestone(entry: { id: string; year: number; title: string; description: string; details: string | null; highlight?: boolean; icon_name?: string | null }): TimelineMilestone {
  return {
    id: entry.id,
    year: String(entry.year),
    title: entry.title,
    description: entry.description,
    details: entry.details || '',
    highlight: entry.highlight ? 'Highlight' : undefined,
    iconName: entry.icon_name || 'Star',
  };
}

function mapJournalToFrontend(article: { id: string; title: string; excerpt: string; content: string; category: string; cover_image?: string; slug: string; published_date?: string; reading_time?: string; author?: string; image_alt?: string }): JournalArticle {
  // Find matching static article for image fallback
  const staticArticle = JOURNAL_ARTICLES.find((a) => a.slug === article.slug);
  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    image: safeImage(article.cover_image, staticArticle?.image || ''),
    date: article.published_date || '',
    readTime: article.reading_time || '5 min read',
    slug: article.slug,
    author: article.author,
    imageAlt: article.image_alt,
  };
}

function mapFilmographyToFrontend(entry: { id: string; title: string; role: string; year: number; status: string; description: string; type: string; image_url?: string }): FilmographyEntry {
  // Find matching static filmography for image fallback
  const staticEntry = FILMOGRAPHY.find((f) => f.title === entry.title);
  return {
    id: entry.id,
    title: entry.title,
    role: entry.role,
    year: String(entry.year),
    status: (entry.status as FilmographyEntry['status']) || 'Released',
    description: entry.description,
    type: (entry.type as 'film' | 'television') || 'film',
    image: safeImage(entry.image_url, staticEntry?.image || undefined),
  };
}

function mapExperienceToFrontend(exp: { id: string; title: string; description: string; type: string; price?: string | null; image?: string | null; availability?: string | null; duration?: string | null; location?: string | null; whats_included?: string[]; eligibility?: string | null; important_notes?: string | null; details?: string | null }): Experience {
  // Find matching static experience for image fallback
  const staticExp = EXPERIENCES.find((e) => e.title === exp.title);
  return {
    id: exp.id,
    title: exp.title,
    description: exp.description,
    details: exp.details || exp.description,
    price: exp.price || 'Price on request',
    iconName: 'Sparkles',
    type: (exp.type as Experience['type']) || 'meet-and-greet',
    image: safeImage(exp.image, staticExp?.image || ''),
    availability: (exp.availability as Experience['availability']) || 'available',
    whatsIncluded: exp.whats_included || [],
    eligibility: typeof exp.eligibility === 'string' ? exp.eligibility.split(';').filter(Boolean) : (exp.eligibility || []),
    duration: exp.duration || undefined,
    location: exp.location || undefined,
    importantNotes: typeof exp.important_notes === 'string' ? exp.important_notes.split(';').filter(Boolean) : (exp.important_notes || []),
  };
}

function mapPlanToFrontend(plan: { id: string; name: string; description?: string; price: number; currency: string; period: string; badge?: string; is_popular: boolean; features: string[]; cta_text: string; availability: string; requires_approval: boolean }): MembershipTier {
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description || '',
    price: plan.price,
    currency: plan.currency,
    period: plan.period,
    duration: plan.period,
    badge: plan.badge || undefined,
    isPopular: plan.is_popular,
    features: plan.features.map((f) => ({ label: f, included: true })),
    ctaText: plan.cta_text,
    availability: (plan.availability as MembershipTier['availability']) || 'available',
    requiresApproval: plan.requires_approval,
  };
}

function mapGalleryToFrontend(photo: { id: string; alt: string; caption?: string | null; category: string; src: string; date?: string | null; event?: string | null; photographer?: string | null; featured?: boolean; collection_id?: string | null; sort_order?: number }): GalleryItem {
  // Find matching static gallery item for image fallback
  const staticItem = GALLERY_ITEMS.find((g) => g.title === photo.alt);
  return {
    id: photo.id,
    title: photo.alt,
    caption: photo.caption || '',
    category: photo.category,
    image: safeImage(photo.src, staticItem?.image || ''),
    date: photo.date || '',
    event: photo.event || undefined,
    photographer: photo.photographer || undefined,
    featured: photo.featured || false,
    collectionId: photo.collection_id || undefined,
    order: photo.sort_order ?? 0,
  };
}

function mapVideoToFrontend(v: DBMediaVideo): typeof MEDIA_VIDEOS[number] {
  // Find matching static video for thumbnail fallback
  const staticVid = MEDIA_VIDEOS.find((sv) => sv.title === v.title);
  return {
    id: v.id,
    title: v.title,
    description: v.description || '',
    thumbnail: safeImage(v.thumbnail, staticVid?.thumbnail || ''),
    duration: v.duration || '',
    date: v.date || '',
    source: v.source || '',
    category: v.category || 'interviews',
    url: v.url,
    featured: v.featured,
  };
}

function mapPodcastToFrontend(p: DBMediaPodcast): typeof MEDIA_PODCASTS[number] {
  // Find matching static podcast for cover art fallback
  const staticPod = MEDIA_PODCASTS.find((sp) => sp.episodeTitle === p.episode_title);
  return {
    id: p.id,
    episodeTitle: p.episode_title,
    showName: p.show_name,
    description: p.description || '',
    coverArt: safeImage(p.cover_art, staticPod?.coverArt || ''),
    date: p.date || '',
    url: p.url,
  };
}

function mapPressToFrontend(p: DBMediaPress): typeof MEDIA_PRESS[number] {
  // Find matching static press for image fallback
  const staticPress = MEDIA_PRESS.find((sp) => sp.headline === p.headline);
  return {
    id: p.id,
    headline: p.headline,
    publisher: p.publisher,
    date: p.date || '',
    summary: p.summary || '',
    url: p.url,
    image: safeImage(p.image, staticPress?.image || ''),
  };
}

// ============================================================
// Context
// ============================================================

const SiteContentContext = createContext<SiteContentType | null>(null);

export const useSiteContent = (): SiteContentType => {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent must be used within SiteContentProvider');
  return ctx;
};

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Static data is the foundation — always available immediately
  const [metrics] = useState<typeof METRICS>(METRICS);
  const [featuredProject] = useState<typeof FEATURED_PROJECT>(FEATURED_PROJECT);
  const [timelineMilestones, setTimelineMilestones] = useState<TimelineMilestone[]>(TIMELINE_MILESTONES);
  const [journalArticles, setJournalArticles] = useState<JournalArticle[]>(JOURNAL_ARTICLES);
  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCES);
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>(MEMBERSHIP_TIERS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [footerLinks] = useState<typeof FOOTER_LINKS>(FOOTER_LINKS);
  const [filmography, setFilmography] = useState<FilmographyEntry[]>(FILMOGRAPHY);
  const [membershipSteps] = useState<MembershipStep[]>(MEMBERSHIP_STEPS);
  const [experiencesFAQ] = useState<FAQItem[]>(EXPERIENCES_FAQ);
  const [membershipFAQ] = useState<MembershipFAQItem[]>(MEMBERSHIP_FAQ);
  const [mediaVideos, setMediaVideos] = useState<typeof MEDIA_VIDEOS>(MEDIA_VIDEOS);
  const [mediaPodcasts, setMediaPodcasts] = useState<typeof MEDIA_PODCASTS>(MEDIA_PODCASTS);
  const [mediaPress, setMediaPress] = useState<typeof MEDIA_PRESS>(MEDIA_PRESS);
  // loading starts false — static data is ready immediately
  const [loading, setLoading] = useState(false);

  // One-time Supabase overlay: fetch once, only replace if valid data exists
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Dynamic import to avoid breaking the app if supabase module has issues
        const { journeyRepository, journalRepository, filmographyRepository, experiencesRepository, membershipPlansRepository, galleryRepository, mediaRepository } = await import('../lib/repositories');

        const results = await Promise.allSettled([
          journeyRepository.getAll(),
          journalRepository.getPublished(),
          filmographyRepository.getAll(),
          experiencesRepository.getAll(),
          membershipPlansRepository.getActive(),
          galleryRepository.getAllPhotos(),
          mediaRepository.getVideos(),
          mediaRepository.getPodcasts(),
          mediaRepository.getPress(),
        ]);

        if (cancelled) return;

        const [journeyData, journalData, filmData, expData, planData, galleryData, vidData, podData, pressData] = results;

        // Only replace static data if Supabase returned valid, non-empty arrays
        if (journeyData.status === 'fulfilled' && journeyData.value.length > 0) {
          setTimelineMilestones(journeyData.value.map(mapJourneyToMilestone));
        }
        if (journalData.status === 'fulfilled' && journalData.value.length > 0) {
          setJournalArticles(journalData.value.map(mapJournalToFrontend));
        }
        if (filmData.status === 'fulfilled' && filmData.value.length > 0) {
          setFilmography(filmData.value.map(mapFilmographyToFrontend));
        }
        if (expData.status === 'fulfilled' && expData.value.length > 0) {
          setExperiences(expData.value.map(mapExperienceToFrontend));
        }
        if (planData.status === 'fulfilled' && planData.value.length > 0) {
          setMembershipTiers(planData.value.map(mapPlanToFrontend));
        }
        if (galleryData.status === 'fulfilled' && galleryData.value.length > 0) {
          setGalleryItems(galleryData.value.map(mapGalleryToFrontend));
        }
        if (vidData.status === 'fulfilled' && vidData.value.length > 0) {
          setMediaVideos(vidData.value.map(mapVideoToFrontend));
        }
        if (podData.status === 'fulfilled' && podData.value.length > 0) {
          setMediaPodcasts(podData.value.map(mapPodcastToFrontend));
        }
        if (pressData.status === 'fulfilled' && pressData.value.length > 0) {
          setMediaPress(pressData.value.map(mapPressToFrontend));
        }
      } catch {
        // Silent fail — static data is already displayed
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Update functions (used by admin CMS to push changes)
  const updateMetrics = useCallback(() => {}, []);
  const updateFeaturedProject = useCallback(() => {}, []);
  const updateTimelineMilestones = useCallback((value: TimelineMilestone[]) => setTimelineMilestones(value), []);
  const updateJournalArticles = useCallback((value: JournalArticle[]) => setJournalArticles(value), []);
  const updateExperiences = useCallback((value: Experience[]) => setExperiences(value), []);
  const updateMembershipTiers = useCallback((value: MembershipTier[]) => setMembershipTiers(value), []);
  const updateGalleryItems = useCallback((value: GalleryItem[]) => setGalleryItems(value), []);
  const updateFooterLinks = useCallback(() => {}, []);
  const updateFilmography = useCallback((value: FilmographyEntry[]) => setFilmography(value), []);
  const updateMembershipSteps = useCallback(() => {}, []);
  const updateExperiencesFAQ = useCallback(() => {}, []);
  const updateMembershipFAQ = useCallback(() => {}, []);
  const updateMediaVideos = useCallback(() => {}, []);
  const updateMediaPodcasts = useCallback(() => {}, []);
  const updateMediaPress = useCallback(() => {}, []);

  // Manual refresh — re-fetches from Supabase
  const refreshData = useCallback(async () => {
    try {
      const { journeyRepository, journalRepository, filmographyRepository, experiencesRepository, membershipPlansRepository, galleryRepository, mediaRepository } = await import('../lib/repositories');

      const results = await Promise.allSettled([
        journeyRepository.getAll(),
        journalRepository.getPublished(),
        filmographyRepository.getAll(),
        experiencesRepository.getAll(),
        membershipPlansRepository.getActive(),
        galleryRepository.getAllPhotos(),
        mediaRepository.getVideos(),
        mediaRepository.getPodcasts(),
        mediaRepository.getPress(),
      ]);

      const [journeyData, journalData, filmData, expData, planData, galleryData, vidData, podData, pressData] = results;

      if (journeyData.status === 'fulfilled' && journeyData.value.length > 0) {
        setTimelineMilestones(journeyData.value.map(mapJourneyToMilestone));
      }
      if (journalData.status === 'fulfilled' && journalData.value.length > 0) {
        setJournalArticles(journalData.value.map(mapJournalToFrontend));
      }
      if (filmData.status === 'fulfilled' && filmData.value.length > 0) {
        setFilmography(filmData.value.map(mapFilmographyToFrontend));
      }
      if (expData.status === 'fulfilled' && expData.value.length > 0) {
        setExperiences(expData.value.map(mapExperienceToFrontend));
      }
      if (planData.status === 'fulfilled' && planData.value.length > 0) {
        setMembershipTiers(planData.value.map(mapPlanToFrontend));
      }
      if (galleryData.status === 'fulfilled' && galleryData.value.length > 0) {
        setGalleryItems(galleryData.value.map(mapGalleryToFrontend));
      }
      if (vidData.status === 'fulfilled' && vidData.value.length > 0) {
        setMediaVideos(vidData.value.map(mapVideoToFrontend));
      }
      if (podData.status === 'fulfilled' && podData.value.length > 0) {
        setMediaPodcasts(podData.value.map(mapPodcastToFrontend));
      }
      if (pressData.status === 'fulfilled' && pressData.value.length > 0) {
        setMediaPress(pressData.value.map(mapPressToFrontend));
      }
    } catch {
      // Silent fail — existing data persists
    }
  }, []);

  const value: SiteContentType = useMemo(() => ({
    metrics,
    featuredProject,
    timelineMilestones,
    journalArticles,
    experiences,
    membershipTiers,
    galleryItems,
    footerLinks,
    filmography,
    membershipSteps,
    experiencesFAQ,
    membershipFAQ,
    mediaVideos,
    mediaPodcasts,
    mediaPress,
    loading,
    updateMetrics,
    updateFeaturedProject,
    updateTimelineMilestones,
    updateJournalArticles,
    updateExperiences,
    updateMembershipTiers,
    updateGalleryItems,
    updateFooterLinks,
    updateFilmography,
    updateMembershipSteps,
    updateExperiencesFAQ,
    updateMembershipFAQ,
    updateMediaVideos,
    updateMediaPodcasts,
    updateMediaPress,
    refreshData,
  }), [
    metrics, featuredProject, timelineMilestones, journalArticles, experiences,
    membershipTiers, galleryItems, footerLinks, filmography, membershipSteps,
    experiencesFAQ, membershipFAQ, mediaVideos, mediaPodcasts, mediaPress, loading,
    updateMetrics, updateFeaturedProject, updateTimelineMilestones, updateJournalArticles,
    updateExperiences, updateMembershipTiers, updateGalleryItems, updateFooterLinks,
    updateFilmography, updateMembershipSteps, updateExperiencesFAQ, updateMembershipFAQ,
    updateMediaVideos, updateMediaPodcasts, updateMediaPress, refreshData,
  ]);

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};
