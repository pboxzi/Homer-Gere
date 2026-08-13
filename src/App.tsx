import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedProject } from './components/FeaturedProject';
import { JourneyTimeline } from './components/JourneyTimeline';
import { JournalSection } from './components/JournalSection';
import { ExperiencesSection } from './components/ExperiencesSection';
import { MembershipSection } from './components/MembershipSection';
import { ChatSection } from './components/ChatSection';
import { NewsletterBar } from './components/NewsletterBar';
import { GallerySection } from './components/GallerySection';
import { Footer } from './components/Footer';
import { ChatModal } from './components/ChatModal';
import { DetailModal } from './components/DetailModal';
import { SectionDivider } from './components/SectionDivider';
import { SectionFadeIn } from './components/SectionFadeIn';
import { ScrollToTop } from './components/ScrollToTop';
import { ModalType, JournalArticle, TimelineMilestone, Experience, MembershipTier, GalleryItem } from './types';
import { JOURNAL_ARTICLES, TIMELINE_MILESTONES, EXPERIENCES, MEMBERSHIP_TIERS, GALLERY_ITEMS } from './data/content';
import JourneyPage from './pages/JourneyPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/project-detail/ProjectDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { JournalPage } from './pages/JournalPage';
import ArticleDetailPage from './pages/journal/ArticleDetailPage';
import MediaPage from './pages/MediaPage';

function HomePage() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');
  const navigate = useNavigate();

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'journey') {
      navigate('/journey');
      return;
    }
    if (sectionId === 'projects') {
      navigate('/projects');
      return;
    }
    if (sectionId === 'gallery') {
      navigate('/gallery');
      return;
    }
    if (sectionId === 'journal') {
      navigate('/journal');
      return;
    }
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenChat = (mode: 'fan' | 'business' = 'fan') => {
    setChatMode(mode);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        onOpenSignIn={() => setActiveModal({ type: 'signin' })}
      />

      <main>
        <Hero
          onExploreJourney={() => handleNavigate('journey')}
          onViewProject={(projectId) => setActiveModal({ type: 'project', projectId })}
          onOpenChat={handleOpenChat}
        />

        <SectionDivider />

        <SectionFadeIn>
          <FeaturedProject
            onDiscoverMore={(projectId) => setActiveModal({ type: 'project', projectId })}
          />
        </SectionFadeIn>

        <SectionDivider />

        <SectionFadeIn>
          <JourneyTimeline
            onSelectMilestone={(milestone: TimelineMilestone) =>
              setActiveModal({ type: 'milestone', milestone })
            }
            onViewFullTimeline={() => navigate('/journey')}
          />
        </SectionFadeIn>

        <SectionDivider />

        <SectionFadeIn>
          <JournalSection
            onSelectArticle={(article: JournalArticle) =>
              setActiveModal({ type: 'article', article })
            }
            onViewAllArticles={() =>
              setActiveModal({ type: 'article', article: JOURNAL_ARTICLES[0] })
            }
          />
        </SectionFadeIn>

        <SectionDivider />

        <SectionFadeIn>
          <ExperiencesSection
            onSelectExperience={(experience: Experience) =>
              setActiveModal({ type: 'experience', experience })
            }
            onViewAllExperiences={() =>
              setActiveModal({ type: 'experience', experience: EXPERIENCES[0] })
            }
          />
        </SectionFadeIn>

        <SectionDivider />

        <SectionFadeIn>
          <MembershipSection
            onSelectTier={(tier: MembershipTier) =>
              setActiveModal({ type: 'membership', tier })
            }
            onExploreMembership={() =>
              setActiveModal({ type: 'membership', tier: MEMBERSHIP_TIERS[1] })
            }
          />
        </SectionFadeIn>

        <SectionDivider />

        <SectionFadeIn>
          <ChatSection onStartChat={(mode) => handleOpenChat(mode)} />
        </SectionFadeIn>

        <SectionDivider />

        <SectionFadeIn>
          <GallerySection
            onSelectImage={(item: GalleryItem) =>
              setActiveModal({ type: 'gallery', item })
            }
            onViewFullGallery={() =>
              setActiveModal({ type: 'gallery', item: GALLERY_ITEMS[0] })
            }
          />
        </SectionFadeIn>

        <SectionDivider />

        <SectionFadeIn>
          <NewsletterBar />
        </SectionFadeIn>
      </main>

      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />

      <ChatModal
        isOpen={chatOpen}
        initialMode={chatMode}
        onClose={() => setChatOpen(false)}
      />

      <DetailModal
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenChat={handleOpenChat}
      />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/:slug" element={<ArticleDetailPage />} />
          <Route path="/media" element={<MediaPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
