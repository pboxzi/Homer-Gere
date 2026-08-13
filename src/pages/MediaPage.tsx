import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChatModal } from '../components/ChatModal';
import { DetailModal } from '../components/DetailModal';
import { SectionDivider } from '../components/SectionDivider';
import { ModalType } from '../types';
import { MediaHero } from './media/MediaHero';
import { FeaturedMedia } from './media/FeaturedMedia';
import { VideoLibrary } from './media/VideoLibrary';
import { AudioPodcast } from './media/AudioPodcast';
import { PressHighlights } from './media/PressHighlights';
import { ContinueExploring } from './media/ContinueExploring';

export default function MediaPage() {
  const [activeSection] = useState<string>('media');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');
  const navigate = useNavigate();

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'home') {
      navigate('/');
    } else if (sectionId === 'journey') {
      navigate('/journey');
    } else if (sectionId === 'projects') {
      navigate('/projects');
    } else if (sectionId === 'journal') {
      navigate('/journal');
    } else if (sectionId === 'gallery') {
      navigate('/gallery');
    } else if (sectionId === 'experiences') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (sectionId === 'chat') {
      setChatMode('fan');
      setChatOpen(true);
    } else {
      navigate('/');
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
        {/* 1. Hero */}
        <MediaHero onBack={() => navigate('/')} />

        <SectionDivider />

        {/* 2. Featured Media */}
        <FeaturedMedia onWatch={(url) => window.open(url, '_blank')} />

        <SectionDivider />

        {/* 3. Video Library */}
        <VideoLibrary onWatch={(url) => window.open(url, '_blank')} />

        {/* 4. Audio & Podcasts */}
        <AudioPodcast onListen={(url) => window.open(url, '_blank')} />

        <SectionDivider />

        {/* 5. Press Highlights */}
        <PressHighlights onReadArticle={(url) => window.open(url, '_blank')} />

        <SectionDivider />

        {/* 6. Continue Exploring */}
        <ContinueExploring onNavigate={handleNavigate} />
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
