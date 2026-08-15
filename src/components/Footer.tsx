import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, Instagram, Twitter, Youtube } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenChat }) => {
  const { footerLinks } = useSiteContent();
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (href: string) => {
    if (href === '/') {
      navigate('/');
    } else if (href.startsWith('/')) {
      navigate(href);
    } else {
      onNavigate(href);
    }
  };

  return (
    <footer className="pt-20 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-12 pb-14 border-b border-[#E8E5DF]">
          {/* Logo & Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex flex-col">
              <span className="font-editorial text-2xl tracking-[0.08em] text-[#1C1917] uppercase">
                Homer Gere
              </span>
              <span className="text-xs tracking-[0.2em] text-[#A6852F] font-medium uppercase mt-1.5">
                Official Website
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] max-w-sm leading-relaxed">
              Official website of Homer Gere — actor, producer, and advocate. From Euphoria Season 3 to The Shards and beyond.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-2xl bg-[#FAF9F7] text-[#57534E] hover:bg-[#A6852F] hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-2xl bg-[#FAF9F7] text-[#57534E] hover:bg-[#A6852F] hover:text-white flex items-center justify-center transition-all duration-300 font-medium text-xs"
                aria-label="TikTok"
              >
                &#9834;
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-2xl bg-[#FAF9F7] text-[#57534E] hover:bg-[#A6852F] hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-2xl bg-[#FAF9F7] text-[#57534E] hover:bg-[#A6852F] hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-xs font-medium tracking-[0.15em] text-[#1C1917] uppercase">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {(links as Array<{ label: string; href: string }>).map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-xs sm:text-sm text-[#57534E] hover:text-[#A6852F] transition-colors duration-300 focus:outline-none cursor-pointer"
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#57534E] gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p>&copy; 2026 Homer Gere. All Rights Reserved.</p>
            <span className="hidden sm:inline">·</span>
            <button onClick={() => navigate('/terms')} className="hover:text-[#A6852F] transition-colors cursor-pointer">Terms</button>
            <span>·</span>
            <button onClick={() => navigate('/privacy')} className="hover:text-[#A6852F] transition-colors cursor-pointer">Privacy</button>
            <span>·</span>
            <button onClick={() => navigate('/cookies')} className="hover:text-[#A6852F] transition-colors cursor-pointer">Cookies</button>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#57534E] hover:text-[#A6852F] p-2 rounded-xl hover:bg-[#FAF9F7] transition-all duration-300 focus:outline-none cursor-pointer"
          >
            <span>Back to top</span>
            <div className="w-7 h-7 rounded-xl bg-[#FAF9F7] flex items-center justify-center">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
