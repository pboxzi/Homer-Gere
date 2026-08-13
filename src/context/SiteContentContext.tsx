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
import {
  journeyRepository,
  journalRepository,
  filmographyRepository,
  experiencesRepository,
  membershipPlansRepository,
  galleryRepository,
  mediaRepository,
} from '../lib/repositories';

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
// ============================================================

function mapJourneyToMilestone(entry: { id: string; year: number; title: string; description: string; details: string; highlight?: string; icon_name?: string }): TimelineMilestone {
  return {
    id: entry.id,
    year: String(entry.year),
    title: entry.title,
    description: entry.description,
    details: entry.details,
    highlight: entry.highlight || undefined,
    iconName: entry.icon_name || 'Star',
  };
}

function mapJournalToFrontend(article: { id: string; title: string; excerpt: string; content: string; category: string; cover_image?: string; slug: string; published_date?: string; reading_time?: string }): JournalArticle {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    image: article.cover_image || '',
    date: article.published_date || '',
    readTime: article.reading_time || '5 min read',
  };
}

function mapFilmographyToFrontend(entry: { id: string; title: string; role: string; year: number; status: string; description: string; type: string; image_url?: string }): FilmographyEntry {
  return {
    id: entry.id,
    title: entry.title,
    role: entry.role,
    year: String(entry.year),
    status: (entry.status as FilmographyEntry['status']) || 'Released',
    description: entry.description,
    type: (entry.type as 'film' | 'television') || 'film',
    image: entry.image_url || undefined,
  };
}

function mapExperienceToFrontend(exp: { id: string; title: string; description: string; type: string; price?: string; image_url?: string; availability?: string; duration?: string; location?: string; whats_included?: string[]; eligibility?: string[]; important_notes?: string[]; details?: string }): Experience {
  return {
    id: exp.id,
    title: exp.title,
    description: exp.description,
    details: exp.details || exp.description,
    price: exp.price || 'Price on request',
    iconName: 'Sparkles',
    type: (exp.type as Experience['type']) || 'meet-and-greet',
    image: exp.image_url || undefined,
    availability: (exp.availability as Experience['availability']) || 'available',
    whatsIncluded: exp.whats_included || [],
    eligibility: exp.eligibility || [],
    duration: exp.duration || undefined,
    location: exp.location || undefined,
    importantNotes: exp.important_notes || [],
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

function mapGalleryToFrontend(photo: { id: string; title: string; caption?: string; category: string; image_url: string }): GalleryItem {
  return {
    id: photo.id,
    title: photo.title,
    caption: photo.caption || '',
    category: photo.category,
    image: photo.image_url,
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
  const [mediaVideos] = useState<typeof MEDIA_VIDEOS>(MEDIA_VIDEOS);
  const [mediaPodcasts] = useState<typeof MEDIA_PODCASTS>(MEDIA_PODCASTS);
  const [mediaPress] = useState<typeof MEDIA_PRESS>(MEDIA_PRESS);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [journeyData, journalData, filmData, expData, planData, galleryData] = await Promise.allSettled([
        journeyRepository.getAll(),
        journalRepository.getPublished(),
        filmographyRepository.getAll(),
        experiencesRepository.getAll(),
        membershipPlansRepository.getActive(),
        galleryRepository.getAllPhotos(),
      ]);

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
    } catch {
      // Silent fail — use static defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update functions
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
    refreshData: loadData,
  }), [
    metrics, featuredProject, timelineMilestones, journalArticles, experiences,
    membershipTiers, galleryItems, footerLinks, filmography, membershipSteps,
    experiencesFAQ, membershipFAQ, mediaVideos, mediaPodcasts, mediaPress, loading,
    updateMetrics, updateFeaturedProject, updateTimelineMilestones, updateJournalArticles,
    updateExperiences, updateMembershipTiers, updateGalleryItems, updateFooterLinks,
    updateFilmography, updateMembershipSteps, updateExperiencesFAQ, updateMembershipFAQ,
    updateMediaVideos, updateMediaPodcasts, updateMediaPress, loadData,
  ]);

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};
