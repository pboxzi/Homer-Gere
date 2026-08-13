import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ChatModal } from '../components/ChatModal';
import { DetailModal } from '../components/DetailModal';
import { Footer } from '../components/Footer';
import { JourneyHero } from './journey/JourneyHero';
import { JourneyIntro } from './journey/JourneyIntro';
import { JourneyTimeline } from './journey/JourneyTimeline';
import { JourneyHighlights } from './journey/JourneyHighlights';
import { JourneyFilmography } from './journey/JourneyFilmography';
import { JourneyBehindTheScenes } from './journey/JourneyBehindTheScenes';
import { JourneyQuote } from './journey/JourneyQuote';
import { JourneyFAQ } from './journey/JourneyFAQ';
import { JourneyNext } from './journey/JourneyNext';
import { ModalType } from '../types';

export default function JourneyPage() {
  const navigate = useNavigate();
  const [activeSection] = useState<string>('journey');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'home') {
      navigate('/');
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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
        {/* 1. Editorial Hero */}
        <JourneyHero
          onExploreProjects={() => navigate('/')}
          onViewJournal={() => navigate('/')}
        />

        {/* 2. Biography */}
        <JourneyIntro />

        {/* 3. Career Timeline */}
        <JourneyTimeline />

        {/* 4. Career Highlights */}
        <JourneyHighlights />

        {/* 5. Filmography & Television */}
        <JourneyFilmography />

        {/* 6. Behind The Scenes */}
        <JourneyBehindTheScenes />

        {/* 7. Personal Philosophy */}
        <JourneyQuote />

        {/* 8. Frequently Asked Questions */}
        <JourneyFAQ />

        {/* 9. Next Chapter */}
        <JourneyNext
          onExploreProjects={() => navigate('/')}
          onOpenChat={() => handleOpenChat('fan')}
        />
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
