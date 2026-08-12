import React, { useState } from 'react';
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
import { ModalType, JournalArticle, TimelineMilestone, Experience, MembershipTier, GalleryItem } from './types';
import { JOURNAL_ARTICLES, TIMELINE_MILESTONES, EXPERIENCES, MEMBERSHIP_TIERS, GALLERY_ITEMS } from './data/content';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');

  const handleNavigate = (sectionId: string) => {
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
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-700 antialiased">
      
      {/* Sticky Header Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        onOpenSignIn={() => setActiveModal({ type: 'signin' })}
      />

      {/* Main Content Sections - Strictly Following Reference Section Order */}
      <main>
        {/* 1. Hero Section */}
        <Hero
          onExploreJourney={() => handleNavigate('journey')}
          onViewProject={(projectId) => setActiveModal({ type: 'project', projectId })}
          onOpenChat={handleOpenChat}
        />

        {/* 2. Featured Project Section ("The Shards") */}
        <FeaturedProject
          onDiscoverMore={(projectId) => setActiveModal({ type: 'project', projectId })}
        />

        {/* 3. The Journey Section */}
        <JourneyTimeline
          onSelectMilestone={(milestone: TimelineMilestone) =>
            setActiveModal({ type: 'milestone', milestone })
          }
          onViewFullTimeline={() =>
            setActiveModal({ type: 'milestone', milestone: TIMELINE_MILESTONES[5] })
          }
        />

        {/* 4. Latest from the Journal Section */}
        <JournalSection
          onSelectArticle={(article: JournalArticle) =>
            setActiveModal({ type: 'article', article })
          }
          onViewAllArticles={() =>
            setActiveModal({ type: 'article', article: JOURNAL_ARTICLES[0] })
          }
        />

        {/* 5. Experiences Section */}
        <ExperiencesSection
          onSelectExperience={(experience: Experience) =>
            setActiveModal({ type: 'experience', experience })
          }
          onViewAllExperiences={() =>
            setActiveModal({ type: 'experience', experience: EXPERIENCES[0] })
          }
        />

        {/* 6. Membership Section */}
        <MembershipSection
          onSelectTier={(tier: MembershipTier) =>
            setActiveModal({ type: 'membership', tier })
          }
          onExploreMembership={() =>
            setActiveModal({ type: 'membership', tier: MEMBERSHIP_TIERS[1] })
          }
        />

        {/* 7. Chat with Homer In-Page Section */}
        <ChatSection onStartChat={(mode) => handleOpenChat(mode)} />

        {/* 8. Stay Updated Newsletter Bar */}
        <NewsletterBar />

        {/* 9. Quote & Photo Gallery Section */}
        <GallerySection
          onSelectImage={(item: GalleryItem) =>
            setActiveModal({ type: 'gallery', item })
          }
          onViewFullGallery={() =>
            setActiveModal({ type: 'gallery', item: GALLERY_ITEMS[0] })
          }
        />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />

      {/* Interactive AI Chat Drawer/Modal */}
      <ChatModal
        isOpen={chatOpen}
        initialMode={chatMode}
        onClose={() => setChatOpen(false)}
      />

      {/* Universal Detail Reader & Action Modal */}
      <DetailModal
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenChat={handleOpenChat}
      />
    </div>
  );
}
