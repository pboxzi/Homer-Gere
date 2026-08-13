import React from 'react';
import { ArrowUp, Instagram, Twitter, Youtube } from 'lucide-react';
import { FOOTER_LINKS } from '../data/content';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenChat: (mode?: 'fan' | 'business') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenChat }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (href: string) => {
    if (href === '#chat') {
      onOpenChat('fan');
    } else {
      const targetId = href.replace('#', '');
      onNavigate(targetId);
    }
  };

  return (
    <footer className="bg-[#EDE9E0] pt-20 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-14 border-b border-[#E4DFD5]">
          {/* Logo & Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex flex-col">
              <span className="font-editorial text-2xl font-bold tracking-[0.08em] text-[#111827] uppercase">
                Homer Gere
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#C8A96A] font-medium uppercase mt-1.5">
                Official Website
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#78716C] max-w-sm leading-relaxed">
              Official website for actor, storyteller, and creator Homer Gere. Exploring character study, dramatic film work, and global creative connections.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#F5F2EB] text-[#78716C] hover:bg-[#C8A96A] hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#F5F2EB] text-[#78716C] hover:bg-[#C8A96A] hover:text-white flex items-center justify-center transition-all duration-300 font-bold text-xs"
                aria-label="TikTok"
              >
                &#9834;
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#F5F2EB] text-[#78716C] hover:bg-[#C8A96A] hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#F5F2EB] text-[#78716C] hover:bg-[#C8A96A] hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-[11px] font-semibold tracking-[0.15em] text-[#111827] uppercase">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-xs sm:text-sm text-[#78716C] hover:text-[#C8A96A] transition-colors duration-300 focus:outline-none cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A8580] gap-4">
          <p>&copy; 2026 Homer Gere. All Rights Reserved.</p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#78716C] hover:text-[#C8A96A] p-2 rounded-xl hover:bg-[#F5F2EB] transition-all duration-300 focus:outline-none cursor-pointer"
          >
            <span>Back to top</span>
            <div className="w-7 h-7 rounded-xl bg-[#F5F2EB] flex items-center justify-center">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
