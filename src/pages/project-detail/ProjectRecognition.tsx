import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Award, Trophy, Star, Calendar, ExternalLink, Newspaper } from 'lucide-react';
import { ProjectDetail } from '../../data/projectDetails';

interface ProjectRecognitionProps {
  project: ProjectDetail;
}

export const ProjectRecognition: React.FC<ProjectRecognitionProps> = ({ project }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  if (project.recognition.length === 0) return null;

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'Winner': return <Trophy className="w-5 h-5" />;
      case 'Nominated': return <Award className="w-5 h-5" />;
      case 'Featured': return <Newspaper className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Winner': return 'bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/25';
      case 'Nominated': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Featured': return 'bg-purple-50 text-purple-600 border-purple-200';
      default: return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    }
  };

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Recognition
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
            Press & Media
          </h2>
          <p className="text-[#52525B] max-w-lg mx-auto">
            Coverage from leading entertainment and lifestyle publications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.recognition.map((item, idx) => (
            <motion.div
              key={item.id}
              className="bg-[#FAF9F7] rounded-[1.5rem] p-8 border border-[#E8E5DF] hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-[#C9A84C]/5 transition-all duration-500 group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + idx * 0.08 }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${getResultColor(item.result)}`}>
                  {getResultIcon(item.result)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${getResultColor(item.result).split(' ')[1]}`}>
                      {item.result}
                    </span>
                  </div>
                  <h3 className="text-base font-editorial text-[#1C1917] group-hover:text-[#C9A84C] transition-colors duration-300">
                    {item.award}
                  </h3>
                  <p className="text-sm text-[#44403C] mt-1.5 leading-relaxed">{item.category}</p>
                  <div className="flex items-center gap-3 mt-3">
                    {item.year && (
                      <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
                        <Calendar className="w-3 h-3" />
                        <span>{item.year}</span>
                      </div>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#C9A84C] hover:text-[#B8983A] transition-colors"
                      >
                        <span>Read</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
