import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate as useRouterNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

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
  const location = useLocation();
  const routerNavigate = useRouterNavigate();
  const isJourneyPage = location.pathname === '/journey';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
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
    } else if (isJourneyPage && id === 'home') {
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
          ? 'bg-[#F8F5EF]/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(200,169,106,0.1)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => handleNavClick('home')}
          className="group flex flex-col text-left focus:outline-none cursor-pointer py-1"
        >
          <span className="font-editorial text-2xl sm:text-3xl tracking-[0.08em] text-[#1C1917] group-hover:text-[#C9A84C] transition-colors duration-500 uppercase leading-none">
            Homer Gere
          </span>
          <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.3em] text-[#C9A84C] uppercase mt-1.5">
            Official Website
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-10">
          {navItems.map((item) => {
            const isActive = item.id === 'journey' ? isJourneyPage : activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-2 text-[13px] font-medium tracking-wide transition-colors duration-300 focus:outline-none ${
                  isActive
                    ? 'text-[#C9A84C] font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#C9A84C] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={onOpenSignIn}
            className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B89A5A] text-white text-[13px] font-medium px-5 py-2.5 rounded-2xl transition-all duration-300 transform hover:shadow-lg hover:shadow-[#C9A84C]/20 active:scale-95 focus:outline-none cursor-pointer"
          >
            <User className="w-4 h-4" />
            Sign In
          </button>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={onOpenSignIn}
            className="inline-flex items-center gap-1.5 bg-[#C9A84C] text-white text-xs font-medium px-3.5 py-2 rounded-2xl focus:outline-none cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#57534E] hover:text-[#1C1917] rounded-xl hover:bg-[#F3EFE7] transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F8F5EF]/98 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3 border-t border-[#ECE8E1]">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = item.id === 'journey' ? isJourneyPage : activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#C9A84C]/10 text-[#C9A84C] font-semibold'
                      : 'text-[#57534E] hover:bg-[#F3EFE7] hover:text-[#1C1917]'
                  }`}
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
