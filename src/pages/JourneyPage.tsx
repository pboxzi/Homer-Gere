import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ChatModal } from '../components/ChatModal';
import { DetailModal } from '../components/DetailModal';
import { Footer } from '../components/Footer';
import { JourneyHero } from './journey/JourneyHero';
import { JourneyIntro } from './journey/JourneyIntro';
import { JourneyTimeline } from './journey/JourneyTimeline';
import { JourneyValues } from './journey/JourneyValues';
import { JourneyHighlights } from './journey/JourneyHighlights';
import { JourneyBehindTheScenes } from './journey/JourneyBehindTheScenes';
import { JourneyQuote } from './journey/JourneyQuote';
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
    <div className="min-h-screen bg-[#F8F5EF] text-[#111827] font-body antialiased">
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        onOpenSignIn={() => setActiveModal({ type: 'signin' })}
      />

      <main>
        <JourneyHero
          onExploreProjects={() => navigate('/')}
          onViewJournal={() => navigate('/')}
        />

        <JourneyIntro />

        <JourneyTimeline />

        <JourneyValues />

        <JourneyHighlights />

        <JourneyBehindTheScenes />

        <JourneyQuote />

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
