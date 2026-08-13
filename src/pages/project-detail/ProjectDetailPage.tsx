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
      <footer className="bg-[#111827] text-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-editorial text-white mb-4">Homer Gere</h3>
              <p className="text-sm leading-relaxed max-w-sm">
                Actor, Brown University graduate, and son of Richard Gere and Carey Lowell. 
                Known for his roles in The Shards, Euphoria, and the upcoming White Lies.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Navigate</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/')} className="text-sm hover:text-[#C9A84C] transition-colors cursor-pointer">Home</button></li>
                <li><button onClick={() => navigate('/journey')} className="text-sm hover:text-[#C9A84C] transition-colors cursor-pointer">Journey</button></li>
                <li><button onClick={() => navigate('/projects')} className="text-sm hover:text-[#C9A84C] transition-colors cursor-pointer">Projects</button></li>
              </ul>
            </div>

            {/* Projects */}
            <div>
              <h4 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Projects</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/projects/the-shards')} className="text-sm hover:text-[#C9A84C] transition-colors cursor-pointer">The Shards</button></li>
                <li><button onClick={() => navigate('/projects/euphoria')} className="text-sm hover:text-[#C9A84C] transition-colors cursor-pointer">Euphoria</button></li>
                <li><button onClick={() => navigate('/projects/white-lies')} className="text-sm hover:text-[#C9A84C] transition-colors cursor-pointer">White Lies</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} Homer Gere. All rights reserved.
            </p>
            <p className="text-xs text-white/30">
              Built with care. All content sourced from verified public information.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
