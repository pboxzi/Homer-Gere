import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { DetailModal } from '../../components/DetailModal';
import { Footer } from '../../components/Footer';
import { getProjectBySlug } from '../../data/projectDetails';
import { ProjectDetailHero } from './ProjectDetailHero';
import { ProjectOverview } from './ProjectOverview';
import { ProjectHomerRole } from './ProjectHomerRole';
import { ProjectCastCrew } from './ProjectCastCrew';
import { ProjectMediaGallery } from './ProjectMediaGallery';
import { ProjectVideos } from './ProjectVideos';
import { ProjectRecognition } from './ProjectRecognition';
import { ProjectRelated } from './ProjectRelated';
import { ProjectContinueExploring } from './ProjectContinueExploring';
import { SEO } from '../../components/SEO';
import { ModalType } from '../../types';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const [activeSection] = React.useState<string>('projects');
  const [activeModal, setActiveModal] = React.useState<ModalType>(null);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'home') {
      navigate('/');
    } else if (sectionId === 'journey') {
      navigate('/journey');
    } else if (sectionId === 'projects') {
      navigate('/projects');
    } else if (sectionId === 'media') {
      navigate('/media');
    } else if (sectionId === 'gallery') {
      navigate('/gallery');
    } else {
      navigate('/');
    }
  };

  const handleOpenChat = () => {
    navigate('/chat');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-4xl sm:text-5xl font-editorial text-[#1C1917]">Project Not Found</h1>
          <p className="text-[#44403C] max-w-md mx-auto">
            The project you're looking for doesn't exist or hasn't been added yet.
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 bg-[#A6852F] hover:bg-[#B8983A] text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title={project.title} description={project.tagline || project.synopsis} />
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        onOpenSignIn={() => setActiveModal({ type: 'signin' })}
      />

      <ProjectDetailHero
        project={project}
        onBack={() => navigate('/projects')}
      />

      <ProjectOverview project={project} />

      <ProjectHomerRole project={project} />

      <ProjectCastCrew project={project} />

      <ProjectMediaGallery project={project} />

      <ProjectVideos project={project} />

      <ProjectRecognition project={project} />

      <ProjectRelated
        project={project}
        onNavigate={(slug) => navigate(`/projects/${slug}`)}
      />

      <ProjectContinueExploring onNavigate={(path) => navigate(path)} />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />

      <DetailModal
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenChat={handleOpenChat}
      />
    </div>
  );
}
