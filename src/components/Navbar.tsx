import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate as useRouterNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenChat: (mode?: 'fan' | 'business') => void;
  onOpenSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenChat,
  onOpenSignIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const routerNavigate = useRouterNavigate();
  const isJourneyPage = location.pathname === '/journey';
  const isProjectsPage = location.pathname === '/projects';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(height > 0 ? (winScroll / height) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'journey', label: 'Journey' },
    { id: 'projects', label: 'Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'journal', label: 'Journal' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'membership', label: 'Membership' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'journey') {
      routerNavigate('/journey');
    } else if (id === 'projects') {
      routerNavigate('/projects');
    } else if ((isJourneyPage || isProjectsPage) && id === 'home') {
      routerNavigate('/');
    } else {
      onNavigate(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FAF9F7]/85 backdrop-blur-2xl shadow-[0_1px_20px_rgba(0,0,0,0.04)]'
          : 'bg-[#FAF9F7]/40 backdrop-blur-lg'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-12' : 'h-16'}`}>
        {/* Brand */}
        <button
          onClick={() => handleNavClick('home')}
          className="group flex flex-col text-left focus:outline-none cursor-pointer"
        >
          <span className={`font-editorial tracking-[0.06em] text-[#1C1917] group-hover:text-[#C9A84C] transition-all duration-500 uppercase leading-none ${scrolled ? 'text-base' : 'text-lg sm:text-xl'}`}>
            Homer Gere
          </span>
          <span className={`font-medium tracking-[0.35em] text-[#C9A84C]/70 uppercase transition-all duration-500 ${scrolled ? 'text-[7px] mt-0.5' : 'text-[8px] sm:text-[9px] mt-1'}`}>
            Official Website
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = item.id === 'journey' ? isJourneyPage : item.id === 'projects' ? isProjectsPage : activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-1.5 text-[11px] font-medium tracking-[0.03em] transition-all duration-300 focus:outline-none rounded-full ${
                  isActive
                    ? 'text-[#C9A84C] bg-[#C9A84C]/10'
                    : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#C9A84C]/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenSignIn}
            className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white text-[11px] font-medium px-4 py-1.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#1C1917]/10 active:scale-95 focus:outline-none cursor-pointer"
          >
            <User className="w-3 h-3" />
            Sign In
          </button>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={onOpenSignIn}
            className="inline-flex items-center gap-1.5 bg-[#1C1917] text-white text-[10px] font-medium px-3 py-1.5 rounded-full focus:outline-none cursor-pointer"
          >
            <User className="w-3 h-3" />
          </button>
          {/* Morphing hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative w-8 h-8 flex items-center justify-center focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-[1.5px] bg-[#57534E] rounded-full transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-[4.5px]' : ''}`} />
              <span className={`block h-[1.5px] bg-[#57534E] rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
              <span className={`block h-[1.5px] bg-[#57534E] rounded-full transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-[4.5px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#E8E5DF]/50">
        <div
          className="h-full bg-gradient-to-r from-[#C9A84C]/40 via-[#C9A84C] to-[#C9A84C]/40 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mobile Drawer with staggered animation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F7]/95 backdrop-blur-2xl px-5 pt-4 pb-6 border-t border-[#C9A84C]/10">
          <div className="flex flex-col gap-0.5">
            {navItems.map((item, index) => {
              const isActive = item.id === 'journey' ? isJourneyPage : item.id === 'projects' ? isProjectsPage : activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#C9A84C]/10 text-[#C9A84C]'
                      : 'text-[#57534E] hover:bg-[#C9A84C]/5 hover:text-[#1C1917]'
                  }`}
                  style={{
                    animation: `fadeSlideIn 0.3s ease forwards`,
                    animationDelay: `${index * 50}ms`,
                    opacity: 0,
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
