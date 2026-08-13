import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ChatModal } from '../components/ChatModal';
import { DetailModal } from '../components/DetailModal';
import { Footer } from '../components/Footer';
import { JourneyHero } from './journey/JourneyHero';
import { JourneyIntro } from './journey/JourneyIntro';
import { JourneyGlance } from './journey/JourneyGlance';
import { JourneyTimeline } from './journey/JourneyTimeline';
import { JourneyHighlights } from './journey/JourneyHighlights';
import { JourneyFilmography } from './journey/JourneyFilmography';
import { JourneyBehindTheScenes } from './journey/JourneyBehindTheScenes';
import { JourneyPress } from './journey/JourneyPress';
import { JourneyFAQ } from './journey/JourneyFAQ';
import { JourneyNext } from './journey/JourneyNext';
import { JourneyContinueExploring } from './journey/JourneyContinueExploring';
import { ModalType } from '../types';

export default function JourneyPage() {
  const navigate = useNavigate();
  const [activeSection] = useState<string>('journey');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'home') { navigate('/'); return; }
    if (sectionId === 'journey') { navigate('/journey'); return; }
    if (sectionId === 'projects') { navigate('/projects'); return; }
    if (sectionId === 'gallery') { navigate('/gallery'); return; }
    if (sectionId === 'journal') { navigate('/journal'); return; }
    if (sectionId === 'experiences') { navigate('/experiences'); return; }
    if (sectionId === 'membership') { navigate('/membership'); return; }
    if (sectionId === 'media') { navigate('/media'); return; }
    if (sectionId === 'chat') { navigate('/chat'); return; }
    const element = document.getElementById(sectionId);
    if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
  };

  const handleOpenChat = (mode: 'fan' | 'business' = 'fan') => {
    setChatMode(mode);
    setChatOpen(true);
  };

  const handleHighlightClick = (slug: string) => {
    if (slug === 'journey-glance') {
      const element = document.getElementById('journey-glance');
      if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
    } else {
      navigate(`/projects/${slug}`);
    }
  };

  const handleFilmographyClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleBtsImageClick = (imageSrc: string, title: string) => {
    setActiveModal({
      type: 'gallery',
      item: { id: `bts-${title}`, title, caption: title, category: 'Behind the Scenes', image: imageSrc },
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} onOpenChat={handleOpenChat} onOpenSignIn={() => setActiveModal({ type: 'signin' })} />

      <main>
        <JourneyHero
          onExploreProjects={() => navigate('/projects')}
          onViewJournal={() => navigate('/journal')}
        />

        <JourneyIntro />
        <JourneyGlance />
        <JourneyTimeline />
        <JourneyHighlights onItemClick={handleHighlightClick} />
        <JourneyFilmography onItemClick={handleFilmographyClick} />
        <JourneyBehindTheScenes onImageClick={handleBtsImageClick} />
        <JourneyPress />
        <JourneyFAQ />

        <JourneyNext
          onExploreProjects={() => navigate('/projects')}
          onOpenChat={() => handleOpenChat('fan')}
        />

        <JourneyContinueExploring
          onExploreProjects={() => navigate('/projects')}
          onReadJournal={() => navigate('/journal')}
          onOpenChat={() => handleOpenChat('fan')}
        />
      </main>

      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />
      <ChatModal isOpen={chatOpen} initialMode={chatMode} onClose={() => setChatOpen(false)} />
      <DetailModal modal={activeModal} onClose={() => setActiveModal(null)} onOpenChat={handleOpenChat} />
    </div>
  );
}
