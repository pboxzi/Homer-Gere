import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate as useRouterNavigate } from 'react-router-dom';
import { User, LayoutDashboard, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenChat: () => void;
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const routerNavigate = useRouterNavigate();
  const { isAuthenticated, user, signOut } = useAuth();
  const isJourneyPage = location.pathname === '/journey';
  const isProjectsPage = location.pathname === '/projects';
  const isGalleryPage = location.pathname === '/gallery';
  const isJournalPage = location.pathname === '/journal';
  const isMediaPage = location.pathname === '/media';
  const isExperiencesPage = location.pathname === '/experiences';
  const isMembershipPage = location.pathname === '/membership';
  const isChatPage = location.pathname === '/chat';
  const isContactPage = location.pathname === '/contact';

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'journey', label: 'Journey' },
    { id: 'projects', label: 'Projects' },
    { id: 'media', label: 'Media' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'journal', label: 'Journal' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'membership', label: 'Membership' },
    { id: 'chat', label: 'Chat' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'journey') {
      routerNavigate('/journey');
    } else if (id === 'projects') {
      routerNavigate('/projects');
    } else if (id === 'media') {
      routerNavigate('/media');
    } else if (id === 'gallery') {
      routerNavigate('/gallery');
    } else if (id === 'journal') {
      routerNavigate('/journal');
    } else if (id === 'experiences') {
      routerNavigate('/experiences');
    } else if (id === 'membership') {
      routerNavigate('/membership');
    } else if (id === 'chat') {
      routerNavigate('/chat');
    } else if (id === 'contact') {
      routerNavigate('/contact');
    } else if ((isJourneyPage || isProjectsPage || isMediaPage || isGalleryPage || isJournalPage || isExperiencesPage || isMembershipPage || isChatPage || isContactPage) && id === 'home') {
      routerNavigate('/');
    } else {
      onNavigate(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
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
          <span className={`font-editorial tracking-[0.06em] text-[#1C1917] group-hover:text-[#A6852F] transition-all duration-500 uppercase leading-none ${scrolled ? 'text-base' : 'text-lg sm:text-xl'}`}>
            Homer Gere
          </span>
            <span className={`font-medium tracking-[0.35em] text-[#A6852F]/70 uppercase transition-all duration-500 ${scrolled ? 'text-[9px] mt-0.5' : 'text-[10px] sm:text-[11px] mt-1'}`}>
            Official Website
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = item.id === 'journey' ? isJourneyPage : item.id === 'projects' ? isProjectsPage : item.id === 'gallery' ? isGalleryPage : item.id === 'journal' ? isJournalPage : item.id === 'media' ? isMediaPage : item.id === 'experiences' ? isExperiencesPage : item.id === 'membership' ? isMembershipPage : item.id === 'chat' ? isChatPage : item.id === 'contact' ? isContactPage : activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-1.5 text-xs font-medium tracking-[0.03em] transition-all duration-300 focus:outline-none rounded-full ${
                  isActive
                    ? 'text-[#A6852F] bg-[#A6852F]/10'
                    : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#A6852F]/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-[#A6852F]/5 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#A6852F]/15 flex items-center justify-center">
                  <span className="text-[11px] font-semibold text-[#A6852F]">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#57534E]">{user?.firstName}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#E8E5DF]/60 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-[#E8E5DF]/60">
                    <p className="text-xs font-medium text-[#1C1917]">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[11px] text-[#57534E] mt-0.5 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setUserMenuOpen(false); routerNavigate((user?.role === 'admin' || user?.role === 'super_admin') ? '/admin' : '/dashboard'); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors"
                    >
                      {(user?.role === 'admin' || user?.role === 'super_admin') ? <Shield className="w-3.5 h-3.5" /> : <LayoutDashboard className="w-3.5 h-3.5" />}
                      {(user?.role === 'admin' || user?.role === 'super_admin') ? 'Admin Panel' : 'Dashboard'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); signOut(); setUserMenuOpen(false); routerNavigate('/'); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#57534E] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => routerNavigate('/auth/sign-in')} className="text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F]">
              Sign In
            </button>
          )}
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full hover:bg-[#A6852F]/5 transition-colors min-h-[44px] min-w-[44px] justify-center"
              >
                <div className="w-8 h-8 rounded-full bg-[#A6852F]/15 flex items-center justify-center">
                  <span className="text-[11px] font-semibold text-[#A6852F]">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[#E8E5DF]/60 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-[#E8E5DF]/60">
                    <p className="text-xs font-medium text-[#1C1917]">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[11px] text-[#57534E] mt-0.5 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setUserMenuOpen(false); routerNavigate((user?.role === 'admin' || user?.role === 'super_admin') ? '/admin' : '/dashboard'); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors min-h-[44px]"
                    >
                      {(user?.role === 'admin' || user?.role === 'super_admin') ? <Shield className="w-3.5 h-3.5" /> : <LayoutDashboard className="w-3.5 h-3.5" />}
                      {(user?.role === 'admin' || user?.role === 'super_admin') ? 'Admin Panel' : 'Dashboard'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); signOut(); setUserMenuOpen(false); routerNavigate('/'); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-[#57534E] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors min-h-[44px]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => routerNavigate('/auth/sign-in')}
              className="inline-flex items-center gap-1.5 bg-[#1C1917] text-white text-xs font-medium px-3 py-1.5 rounded-full focus:outline-none cursor-pointer min-h-[44px]"
            >
              <User className="w-3 h-3" />
            </button>
          )}
          {/* Morphing hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative w-11 h-11 flex items-center justify-center focus:outline-none"
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
          className="h-full bg-gradient-to-r from-[#A6852F]/40 via-[#A6852F] to-[#A6852F]/40 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mobile Drawer with staggered animation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F7]/95 backdrop-blur-2xl px-5 pt-4 pb-6 border-t border-[#A6852F]/10">
          <div className="flex flex-col gap-0.5">
            {navItems.map((item, index) => {
            const isActive = item.id === 'journey' ? isJourneyPage : item.id === 'projects' ? isProjectsPage : item.id === 'media' ? isMediaPage : item.id === 'gallery' ? isGalleryPage : item.id === 'journal' ? isJournalPage : item.id === 'experiences' ? isExperiencesPage : item.id === 'membership' ? isMembershipPage : item.id === 'chat' ? isChatPage : item.id === 'contact' ? isContactPage : activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#A6852F]/10 text-[#A6852F]'
                      : 'text-[#57534E] hover:bg-[#A6852F]/5 hover:text-[#1C1917]'
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
    </>
  );
};
