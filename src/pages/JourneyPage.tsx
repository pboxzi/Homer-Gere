import React, { useState } from 'react';
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
    if (sectionId === 'home') {
      navigate('/');
    } else if (sectionId === 'projects') {
      navigate('/projects');
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

  const handleHighlightClick = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFilmographyClick = (projectId: string) => {
    setActiveModal({ type: 'project', projectId });
  };

  const handleBtsImageClick = (imageSrc: string, title: string) => {
    setActiveModal({
      type: 'gallery',
      item: {
        id: `bts-${title}`,
        title,
        caption: title,
        category: 'Behind the Scenes',
        image: imageSrc,
      },
    });
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
          onExploreProjects={() => {
            navigate('/');
            setTimeout(() => {
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          onViewJournal={() => {
            navigate('/');
            setTimeout(() => {
              document.getElementById('journal')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />

        {/* 2. Meet Homer */}
        <JourneyIntro />

        {/* 3. Life At A Glance */}
        <JourneyGlance />

        {/* 4. Career Timeline */}
        <JourneyTimeline />

        {/* 4b. Career Highlights */}
        <JourneyHighlights onItemClick={handleHighlightClick} />

        {/* 5. The Craft */}
        <JourneyFilmography onItemClick={handleFilmographyClick} />

        {/* 6. Behind The Scenes */}
        <JourneyBehindTheScenes onImageClick={handleBtsImageClick} />

        {/* 7. Recognition & Press */}
        <JourneyPress />

        {/* 8. Frequently Asked Questions */}
        <JourneyFAQ />

        {/* 9. Next Chapter */}
        <JourneyNext
          onExploreProjects={() => {
            navigate('/');
            setTimeout(() => {
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          onOpenChat={() => handleOpenChat('fan')}
        />

        {/* 10. Continue Exploring */}
        <JourneyContinueExploring
          onExploreProjects={() => {
            navigate('/');
            setTimeout(() => {
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          onReadJournal={() => {
            navigate('/');
            setTimeout(() => {
              document.getElementById('journal')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
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
