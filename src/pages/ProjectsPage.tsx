import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { DetailModal } from '../components/DetailModal';
import { Footer } from '../components/Footer';
import { ProjectHero } from './projects/ProjectHero';
import { ProjectFeatured } from './projects/ProjectFeatured';
import { ProjectFilmography } from './projects/ProjectFilmography';
import { ProjectUpcoming } from './projects/ProjectUpcoming';
import { ProjectExploreMore } from './projects/ProjectExploreMore';
import { SEO } from '../components/SEO';
import { ModalType } from '../types';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [activeSection] = useState<string>('projects');
  const [activeModal, setActiveModal] = useState<ModalType>(null);

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

  const handleOpenChat = () => {
    navigate('/chat');
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title="Projects" />
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

      <DetailModal
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenChat={handleOpenChat}
      />
    </div>
  );
}
