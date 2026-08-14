import React, { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedProject } from './components/FeaturedProject';
import { JourneyTimeline } from './components/JourneyTimeline';
import { JournalSection } from './components/JournalSection';
import { ExperiencesSection } from './components/ExperiencesSection';
import { MembershipSection } from './components/MembershipSection';
import { NewsletterBar } from './components/NewsletterBar';
import { GallerySection } from './components/GallerySection';
import { Footer } from './components/Footer';
import { DetailModal } from './components/DetailModal';
import { SectionFadeIn } from './components/SectionFadeIn';
import { ScrollToTop } from './components/ScrollToTop';
import { ModalType, JournalArticle, TimelineMilestone, GalleryItem } from './types';
import { DashboardProvider } from './context/DashboardContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const JourneyPage = React.lazy(() => import('./pages/JourneyPage'));
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = React.lazy(() => import('./pages/project-detail/ProjectDetailPage'));
const GalleryPage = React.lazy(() => import('./pages/GalleryPage').then(m => ({ default: m.GalleryPage })));
const JournalPage = React.lazy(() => import('./pages/JournalPage').then(m => ({ default: m.JournalPage })));
const ArticleDetailPage = React.lazy(() => import('./pages/journal/ArticleDetailPage'));
const MediaPage = React.lazy(() => import('./pages/MediaPage'));
const ExperiencesPage = React.lazy(() => import('./pages/ExperiencesPage'));
const MembershipPage = React.lazy(() => import('./pages/MembershipPage'));
const ChatPage = React.lazy(() => import('./pages/chat/ChatPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function HomePage() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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

  const handleOpenChat = () => {
    navigate('/chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-[#A6852F]/20 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-2 border-[#A6852F] border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-editorial text-[#1C1917]">Homer Gere</p>
            <p className="text-[10px] text-[#57534E] mt-1">Loading experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} onOpenChat={handleOpenChat} onOpenSignIn={() => setActiveModal({ type: 'signin' })} />

      <main>
        <Hero onExploreJourney={() => handleNavigate('journey')} onViewProject={(projectId) => navigate(`/projects/${projectId}`)} onOpenChat={handleOpenChat} />

        <SectionFadeIn><FeaturedProject onDiscoverMore={(projectId) => setActiveModal({ type: 'project', projectId })} /></SectionFadeIn>

        <SectionFadeIn><JourneyTimeline onSelectMilestone={(milestone: TimelineMilestone) => setActiveModal({ type: 'milestone', milestone })} onViewFullTimeline={() => navigate('/journey')} /></SectionFadeIn>

        <SectionFadeIn><JournalSection onSelectArticle={(article: JournalArticle) => setActiveModal({ type: 'article', article })} onNavigate={handleNavigate} /></SectionFadeIn>

        <SectionFadeIn><ExperiencesSection onNavigate={handleNavigate} /></SectionFadeIn>

        <SectionFadeIn><MembershipSection onNavigate={handleNavigate} /></SectionFadeIn>

        <SectionFadeIn><GallerySection onSelectImage={(item: GalleryItem) => setActiveModal({ type: 'gallery', item })} onNavigate={handleNavigate} /></SectionFadeIn>

        <SectionFadeIn><NewsletterBar /></SectionFadeIn>
      </main>

      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />
      <DetailModal modal={activeModal} onClose={() => setActiveModal(null)} onOpenChat={handleOpenChat} />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SiteContentProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={
            <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-[#A6852F]/20 rounded-full" />
                  <div className="absolute inset-0 w-16 h-16 border-2 border-[#A6852F] border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-editorial text-[#1C1917]">Homer Gere</p>
                  <p className="text-[10px] text-[#57534E] mt-1">Loading page...</p>
                </div>
              </div>
            </div>
          }>
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
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardProvider><DashboardPage /></DashboardProvider>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SiteContentProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
