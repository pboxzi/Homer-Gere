import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DetailModal } from '../components/DetailModal';
import { SEO } from '../components/SEO';
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
  const navigate = useNavigate();

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
    navigate('/');
  };

  const handleOpenChat = () => { navigate('/chat'); };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title="Media" />
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} onOpenChat={handleOpenChat} onOpenSignIn={() => setActiveModal({ type: 'signin' })} />
      <main>
        <MediaHero />
        <FeaturedMedia onWatch={(url) => window.open(url, '_blank')} />
        <VideoLibrary onWatch={(url) => window.open(url, '_blank')} />
        <AudioPodcast onListen={(url) => window.open(url, '_blank')} />
        <PressHighlights onReadArticle={(url) => window.open(url, '_blank')} />
        <ContinueExploring onNavigate={handleNavigate} />
      </main>
      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />
      <DetailModal modal={activeModal} onClose={() => setActiveModal(null)} onOpenChat={handleOpenChat} />
    </div>
  );
}
