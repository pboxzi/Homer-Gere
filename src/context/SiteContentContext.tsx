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
}

// ============================================================
// localStorage helpers
// ============================================================

const STORAGE_KEY = 'homer_site_content';

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return key in parsed ? parsed[key] : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key: string, value: unknown) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch { /* ignore */ }
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
  const [metrics, setMetrics] = useState<typeof METRICS>(() => loadState('metrics', METRICS));
  const [featuredProject, setFeaturedProject] = useState<typeof FEATURED_PROJECT>(() => loadState('featuredProject', FEATURED_PROJECT));
  const [timelineMilestones, setTimelineMilestones] = useState<TimelineMilestone[]>(() => loadState('timelineMilestones', TIMELINE_MILESTONES));
  const [journalArticles, setJournalArticles] = useState<JournalArticle[]>(() => loadState('journalArticles', JOURNAL_ARTICLES));
  const [experiences, setExperiences] = useState<Experience[]>(() => loadState('experiences', EXPERIENCES));
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>(() => loadState('membershipTiers', MEMBERSHIP_TIERS));
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => loadState('galleryItems', GALLERY_ITEMS));
  const [footerLinks, setFooterLinks] = useState<typeof FOOTER_LINKS>(() => loadState('footerLinks', FOOTER_LINKS));
  const [filmography, setFilmography] = useState<FilmographyEntry[]>(() => loadState('filmography', FILMOGRAPHY));
  const [membershipSteps, setMembershipSteps] = useState<MembershipStep[]>(() => loadState('membershipSteps', MEMBERSHIP_STEPS));
  const [experiencesFAQ, setExperiencesFAQ] = useState<FAQItem[]>(() => loadState('experiencesFAQ', EXPERIENCES_FAQ));
  const [membershipFAQ, setMembershipFAQ] = useState<MembershipFAQItem[]>(() => loadState('membershipFAQ', MEMBERSHIP_FAQ));
  const [mediaVideos, setMediaVideos] = useState<typeof MEDIA_VIDEOS>(() => loadState('mediaVideos', MEDIA_VIDEOS));
  const [mediaPodcasts, setMediaPodcasts] = useState<typeof MEDIA_PODCASTS>(() => loadState('mediaPodcasts', MEDIA_PODCASTS));
  const [mediaPress, setMediaPress] = useState<typeof MEDIA_PRESS>(() => loadState('mediaPress', MEDIA_PRESS));

  // Persist to localStorage
  useEffect(() => { saveState('metrics', metrics); }, [metrics]);
  useEffect(() => { saveState('featuredProject', featuredProject); }, [featuredProject]);
  useEffect(() => { saveState('timelineMilestones', timelineMilestones); }, [timelineMilestones]);
  useEffect(() => { saveState('journalArticles', journalArticles); }, [journalArticles]);
  useEffect(() => { saveState('experiences', experiences); }, [experiences]);
  useEffect(() => { saveState('membershipTiers', membershipTiers); }, [membershipTiers]);
  useEffect(() => { saveState('galleryItems', galleryItems); }, [galleryItems]);
  useEffect(() => { saveState('footerLinks', footerLinks); }, [footerLinks]);
  useEffect(() => { saveState('filmography', filmography); }, [filmography]);
  useEffect(() => { saveState('membershipSteps', membershipSteps); }, [membershipSteps]);
  useEffect(() => { saveState('experiencesFAQ', experiencesFAQ); }, [experiencesFAQ]);
  useEffect(() => { saveState('membershipFAQ', membershipFAQ); }, [membershipFAQ]);
  useEffect(() => { saveState('mediaVideos', mediaVideos); }, [mediaVideos]);
  useEffect(() => { saveState('mediaPodcasts', mediaPodcasts); }, [mediaPodcasts]);
  useEffect(() => { saveState('mediaPress', mediaPress); }, [mediaPress]);

  // Update functions
  const updateMetrics = useCallback((value: typeof METRICS) => setMetrics(value), []);
  const updateFeaturedProject = useCallback((value: typeof FEATURED_PROJECT) => setFeaturedProject(value), []);
  const updateTimelineMilestones = useCallback((value: TimelineMilestone[]) => setTimelineMilestones(value), []);
  const updateJournalArticles = useCallback((value: JournalArticle[]) => setJournalArticles(value), []);
  const updateExperiences = useCallback((value: Experience[]) => setExperiences(value), []);
  const updateMembershipTiers = useCallback((value: MembershipTier[]) => setMembershipTiers(value), []);
  const updateGalleryItems = useCallback((value: GalleryItem[]) => setGalleryItems(value), []);
  const updateFooterLinks = useCallback((value: typeof FOOTER_LINKS) => setFooterLinks(value), []);
  const updateFilmography = useCallback((value: FilmographyEntry[]) => setFilmography(value), []);
  const updateMembershipSteps = useCallback((value: MembershipStep[]) => setMembershipSteps(value), []);
  const updateExperiencesFAQ = useCallback((value: FAQItem[]) => setExperiencesFAQ(value), []);
  const updateMembershipFAQ = useCallback((value: MembershipFAQItem[]) => setMembershipFAQ(value), []);
  const updateMediaVideos = useCallback((value: typeof MEDIA_VIDEOS) => setMediaVideos(value), []);
  const updateMediaPodcasts = useCallback((value: typeof MEDIA_PODCASTS) => setMediaPodcasts(value), []);
  const updateMediaPress = useCallback((value: typeof MEDIA_PRESS) => setMediaPress(value), []);

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
  }), [
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
  ]);

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};
