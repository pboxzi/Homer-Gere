import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Play, ExternalLink } from 'lucide-react';
import { ProjectDetail } from '../../data/projectDetails';

interface ProjectVideosProps {
  project: ProjectDetail;
}

export const ProjectVideos: React.FC<ProjectVideosProps> = ({ project }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  if (project.videos.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Videos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            Watch
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.videos.map((video, idx) => (
            <motion.a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-[1.5rem] overflow-hidden bg-[#111827] aspect-video"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + idx * 0.12 }}
            >
              {/* Thumbnail */}
              <img
                src={video.thumbnail || project.heroImage}
                alt={video.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
              />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#C9A84C] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#C9A84C]/30">
                  <Play className="w-6 h-6 text-white ml-1" fill="white" />
                </div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#111827] via-[#111827]/50 to-transparent">
                <span className="text-[10px] font-medium text-[#C9A84C] uppercase tracking-wider">
                  {video.type.replace('-', ' ')}
                </span>
                <h3 className="text-lg font-editorial text-white mt-1">{video.title}</h3>
              </div>

              {/* External Link Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ExternalLink className="w-4 h-4" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
