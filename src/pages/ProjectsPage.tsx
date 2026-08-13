import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ChatModal } from '../components/ChatModal';
import { DetailModal } from '../components/DetailModal';
import { Footer } from '../components/Footer';
import { ProjectHero } from './projects/ProjectHero';
import { ProjectFeatured } from './projects/ProjectFeatured';
import { ProjectFilmography } from './projects/ProjectFilmography';
import { ProjectUpcoming } from './projects/ProjectUpcoming';
import { ProjectExploreMore } from './projects/ProjectExploreMore';
import { ModalType } from '../types';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [activeSection] = useState<string>('projects');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'home') {
      navigate('/');
    } else if (sectionId === 'journey') {
      navigate('/journey');
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

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
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
        <ProjectHero
          onExploreFilms={() => {
            const el = document.getElementById('filmography');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Featured Project */}
        <ProjectFeatured onViewProject={handleProjectClick} />

        {/* 3. Complete Filmography */}
        <ProjectFilmography onItemClick={handleProjectClick} />

        {/* 4. Upcoming Projects */}
        <ProjectUpcoming />

        {/* 5. Explore More */}
        <ProjectExploreMore onNavigate={handleNavigate} />
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
