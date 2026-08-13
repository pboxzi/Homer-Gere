import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, MapPin, CheckCircle2, AlertCircle, ArrowRight, Users, Calendar, Heart, Mic, Briefcase, Sparkles, Video, Play } from 'lucide-react';
import { Experience } from '../../types';

interface ExperienceDetailModalProps {
  experience: Experience | null;
  onClose: () => void;
  onRequestExperience: (experience: Experience) => void;
}

export const ExperienceDetailModal: React.FC<ExperienceDetailModalProps> = ({
  experience,
  onClose,
  onRequestExperience,
}) => {
  const getExperienceIcon = (iconName: string) => {
    switch (iconName) {
      case 'users': return <Users className="w-5 h-5" />;
      case 'calendar': return <Calendar className="w-5 h-5" />;
      case 'heart': return <Heart className="w-5 h-5" />;
      case 'mic': return <Mic className="w-5 h-5" />;
      case 'briefcase': return <Briefcase className="w-5 h-5" />;
      case 'sparkles': return <Sparkles className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'play': return <Play className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {experience && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] bg-[#FAF9F7] rounded-[2rem] overflow-hidden shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-all duration-300 focus:outline-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[85vh]">
              {/* Hero Image */}
              {experience.image && (
                <div className="relative h-56 sm:h-72 overflow-hidden">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7] via-transparent to-transparent" />
                </div>
              )}

              <div className="px-8 sm:px-10 pb-10 -mt-16 relative z-10">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#A6852F] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#A6852F]/25">
                    {getExperienceIcon(experience.iconName)}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">
                      {experience.title}
                    </h2>
                    <span className="text-sm font-medium text-[#A6852F] mt-1 block">
                      {experience.price}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-base text-[#44403C] leading-relaxed mb-8">
                  {experience.details}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {experience.duration && (
                    <div className="inline-flex items-center gap-2 text-sm text-[#57534E] bg-[#F3F1ED] px-4 py-2 rounded-xl">
                      <Clock className="w-4 h-4 text-[#A6852F]" />
                      {experience.duration}
                    </div>
                  )}
                  {experience.location && (
                    <div className="inline-flex items-center gap-2 text-sm text-[#57534E] bg-[#F3F1ED] px-4 py-2 rounded-xl">
                      <MapPin className="w-4 h-4 text-[#A6852F]" />
                      {experience.location}
                    </div>
                  )}
                </div>

                {/* What's Included */}
                {experience.whatsIncluded && experience.whatsIncluded.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-medium tracking-[0.05em] text-[#1C1917] uppercase mb-4">
                      What's Included
                    </h3>
                    <div className="space-y-3">
                      {experience.whatsIncluded.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] mt-0.5 shrink-0" />
                          <span className="text-sm text-[#44403C]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligibility */}
                {experience.eligibility && experience.eligibility.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-medium tracking-[0.05em] text-[#1C1917] uppercase mb-4">
                      Eligibility Requirements
                    </h3>
                    <div className="space-y-3">
                      {experience.eligibility.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <AlertCircle className="w-4 h-4 text-[#F59E0B] mt-0.5 shrink-0" />
                          <span className="text-sm text-[#44403C]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Notes */}
                {experience.importantNotes && experience.importantNotes.length > 0 && (
                  <div className="mb-8 p-5 rounded-2xl bg-[#F3F1ED]/60 border border-[#E8E5DF]/60">
                    <h3 className="text-sm font-medium tracking-[0.05em] text-[#1C1917] uppercase mb-3">
                      Important Notes
                    </h3>
                    <div className="space-y-2">
                      {experience.importantNotes.map((note, idx) => (
                        <p key={idx} className="text-sm text-[#57534E] leading-relaxed">
                          • {note}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => {
                    onClose();
                    onRequestExperience(experience);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-[#A6852F] hover:bg-[#B8983A] active:scale-[0.98] text-white font-medium text-sm px-7 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6852F]/25 focus:outline-none cursor-pointer"
                >
                  Request This Experience
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
