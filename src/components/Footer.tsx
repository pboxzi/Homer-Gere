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
    <footer className="bg-white pt-16 pb-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-gray-100">
          
          {/* Logo & Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-cinzel text-2xl font-bold tracking-tight text-gray-900 uppercase">
                Homer Gere
              </span>
              <span className="text-[10px] tracking-widest text-gray-400 font-medium uppercase -mt-0.5">
                Official Website
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm leading-relaxed">
              Official website for actor, storyteller, and creator Homer Gere. Exploring character study, dramatic film work, and global creative connections.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-50 text-gray-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-50 text-gray-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors font-bold text-xs"
                aria-label="TikTok"
              >
                &#9834;
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-50 text-gray-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-50 text-gray-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-gray-900 uppercase">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-xs sm:text-sm text-gray-500 hover:text-blue-600 transition-colors focus:outline-none cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Homer Gere. All Rights Reserved.</p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none cursor-pointer"
          >
            <span>Back to top</span>
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ArrowUp className="w-3.5 h-3.5 text-gray-600" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
};
