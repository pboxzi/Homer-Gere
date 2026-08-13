import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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
import { SectionFadeIn } from './components/SectionFadeIn';
import { ScrollToTop } from './components/ScrollToTop';
import { ModalType, JournalArticle, TimelineMilestone, GalleryItem } from './types';
import JourneyPage from './pages/JourneyPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/project-detail/ProjectDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { JournalPage } from './pages/JournalPage';
import ArticleDetailPage from './pages/journal/ArticleDetailPage';
import MediaPage from './pages/MediaPage';
import ExperiencesPage from './pages/ExperiencesPage';
import MembershipPage from './pages/MembershipPage';
import ChatPage from './pages/chat/ChatPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function HomePage() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');
  const navigate = useNavigate();

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'journey') { navigate('/journey'); return; }
    if (sectionId === 'projects') { navigate('/projects'); return; }
    if (sectionId === 'gallery') { navigate('/gallery'); return; }
    if (sectionId === 'journal') { navigate('/journal'); return; }
    if (sectionId === 'experiences') { navigate('/experiences'); return; }
    if (sectionId === 'membership') { navigate('/membership'); return; }
    if (sectionId === 'chat') { navigate('/chat'); return; }
    if (sectionId === 'contact') { navigate('/contact'); return; }
    if (sectionId === 'media') { navigate('/media'); return; }
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
  };

  const handleOpenChat = (mode: 'fan' | 'business' = 'fan') => {
    setChatMode(mode);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} onOpenChat={handleOpenChat} onOpenSignIn={() => setActiveModal({ type: 'signin' })} />

      <main>
        <Hero onExploreJourney={() => handleNavigate('journey')} onViewProject={(projectId) => setActiveModal({ type: 'project', projectId })} onOpenChat={handleOpenChat} />

        <SectionFadeIn><FeaturedProject onDiscoverMore={(projectId) => setActiveModal({ type: 'project', projectId })} /></SectionFadeIn>

        <SectionFadeIn><JourneyTimeline onSelectMilestone={(milestone: TimelineMilestone) => setActiveModal({ type: 'milestone', milestone })} onViewFullTimeline={() => navigate('/journey')} /></SectionFadeIn>

        <SectionFadeIn><JournalSection onSelectArticle={(article: JournalArticle) => setActiveModal({ type: 'article', article })} onNavigate={handleNavigate} /></SectionFadeIn>

        <SectionFadeIn><ExperiencesSection onNavigate={handleNavigate} /></SectionFadeIn>

        <SectionFadeIn><MembershipSection onNavigate={handleNavigate} /></SectionFadeIn>

        <SectionFadeIn><ChatSection onStartChat={(mode) => handleOpenChat(mode)} /></SectionFadeIn>

        <SectionFadeIn><GallerySection onSelectImage={(item: GalleryItem) => setActiveModal({ type: 'gallery', item })} onNavigate={handleNavigate} /></SectionFadeIn>

        <SectionFadeIn><NewsletterBar /></SectionFadeIn>
      </main>

      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />
      <ChatModal isOpen={chatOpen} initialMode={chatMode} onClose={() => setChatOpen(false)} />
      <DetailModal modal={activeModal} onClose={() => setActiveModal(null)} onOpenChat={handleOpenChat} />
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
          <Route path="/experiences" element={<ExperiencesPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
