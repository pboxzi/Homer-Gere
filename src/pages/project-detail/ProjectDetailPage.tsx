import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { DetailModal } from '../../components/DetailModal';
import { Footer } from '../../components/Footer';
import { getProjectBySlug, type ProjectDetail } from '../../data/projectDetails';
import { projectsRepository } from '../../lib/repositories';
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
  const [project, setProject] = useState<ProjectDetail | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeSection] = React.useState<string>('projects');
  const [activeModal, setActiveModal] = React.useState<ModalType>(null);

  const handleNavigate = (sectionId: string) => {
    const routes: Record<string, string> = {
      home: '/', journey: '/journey', projects: '/projects', media: '/media',
      gallery: '/gallery', journal: '/journal', experiences: '/experiences',
      membership: '/membership', chat: '/chat', contact: '/contact',
    };
    navigate(routes[sectionId] || '/');
  };

  const handleOpenChat = () => {
    navigate('/chat');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) { setLoading(false); return; }

    const loadProject = async () => {
      setLoading(true);
      try {
        // Try Supabase first
        const result = await projectsRepository.getWithDetails(slug);
        if (result?.project) {
          const p = result.project;
          // Map Supabase data to ProjectDetail format
          const mapped: ProjectDetail = {
            slug: p.slug,
            title: p.title,
            year: String(p.year),
            type: (p.type as ProjectDetail['type']) || 'Film',
            status: (p.status as ProjectDetail['status']) || 'Announced',
            tagline: p.tagline || undefined,
            heroImage: p.hero_image || p.image || '',
            posterImage: p.poster_image || undefined,
            synopsis: p.synopsis || '',
            expandedSynopsis: p.expanded_synopsis || undefined,
            genre: p.genre || undefined,
            runtime: p.runtime || undefined,
            homerRole: {
              character: p.homer_role_title || 'Cast Member',
              description: p.homer_role_description || '',
            },
            cast: [],
            crew: p.director ? [{ name: p.director, role: 'Director' }] : [],
            media: result.media.map(m => ({ src: m.src, alt: m.alt || p.title, type: m.type || 'image' })),
            videos: result.videos.map(v => ({ url: v.url, title: v.title || '', type: v.type || 'youtube' })),
            recognition: result.recognition.map(r => ({ title: r.title, category: r.category || '', year: r.year ? String(r.year) : '', result: r.result || '' })),
            relatedSlugs: [],
          };
          setProject(mapped);
        } else {
          // Fallback to hardcoded data
          setProject(getProjectBySlug(slug));
        }
      } catch {
        // Fallback to hardcoded data on error
        setProject(getProjectBySlug(slug));
      }
      setLoading(false);
    };

    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#A6852F] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#57534E]">Loading project...</p>
        </div>
      </div>
    );
  }

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
