import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;

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
            className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8983A] text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
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
      <footer className="py-12 bg-[#111827] text-center">
        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} Homer Gere. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
