import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { MapPin, Clock, Globe, Instagram, Youtube } from 'lucide-react';

const SOCIAL_LINKS = [
  { name: 'Instagram', url: 'https://www.instagram.com/homergere', icon: Instagram },
  { name: 'TikTok', url: 'https://www.tiktok.com/@homergere', icon: Globe },
  { name: 'YouTube', url: 'https://www.youtube.com/@homergere', icon: Youtube },
];

export const ContactOfficeInfo: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Office Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
                Office Information
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mt-4 mb-6">
                Our office
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E8E5DF]/60">
                <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#1C1917] mb-1">Location</h3>
                  <p className="text-sm text-[#57534E]">Los Angeles, California</p>
                  <p className="text-xs text-[#A8A29E] mt-1">Visits by appointment only</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E8E5DF]/60">
                <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#1C1917] mb-1">Business Hours</h3>
                  <p className="text-sm text-[#57534E]">Monday – Friday: 9:00 AM – 6:00 PM (PST)</p>
                  <p className="text-xs text-[#A8A29E] mt-1">Email responses within 24–48 hours</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
                Connect
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mt-4 mb-6">
                Follow Homer
              </h2>
            </div>

            <div className="space-y-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#E8E5DF]/60 hover:border-[#A6852F]/20 transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] shrink-0 group-hover:bg-[#A6852F]/20 transition-colors">
                    <social.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#1C1917] group-hover:text-[#A6852F] transition-colors">{social.name}</h3>
                    <p className="text-xs text-[#57534E]">Follow for updates</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-[#1C1917] text-white">
              <h3 className="text-sm font-medium mb-2">Quick Response</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                For urgent enquiries, reach out via Instagram DM or use the contact form above.
                Our team monitors all channels during business hours.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
