import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Globe, FileText, Users, MessageSquare, Image, CreditCard,
  BarChart3, Settings, LogOut, Menu, X, ChevronDown, ChevronRight, Shield, Search,
} from 'lucide-react';
import { AdminSection, ADMIN_SIDEBAR_GROUPS } from '../../data/adminData';
import { useAdmin, SearchResult } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';

const SECTION_ICONS: Record<string, React.FC<{ className?: string }>> = {
  overview: LayoutDashboard,
  homepage: Globe, navigation: Globe, footer: Globe, menus: Globe, seo: Shield,
  journey: FileText, projects: FileText, gallery: Image, 'media-content': Image, journal: FileText, faqs: FileText,
  members: Users, plans: Users, applications: Users, experiences: Users, 'experience-requests': Users,
  'fan-chat': MessageSquare, 'business-chat': MessageSquare, 'contact-messages': MessageSquare, 'admin-notifications': MessageSquare,
  images: Image, videos: Image, documents: FileText,
  'membership-payments': CreditCard, transactions: CreditCard,
  visitors: BarChart3, 'membership-stats': BarChart3, 'experience-stats': BarChart3, 'chat-stats': BarChart3,
  'website-settings': Settings, branding: Settings, 'comm-settings': Settings, 'email-templates': Settings, security: Shield, backups: Settings, integrations: Settings,
};

const SECTION_MAP: Record<string, AdminSection> = {
  member: 'members', plan: 'plans', application: 'applications',
  experience: 'experiences', experienceRequest: 'experience-requests',
  conversation: 'fan-chat', contactMessage: 'contact-messages',
  notification: 'admin-notifications', media: 'images',
  payment: 'membership-payments', page: 'homepage',
  membershipRequest: 'membership-requests', paymentMethod: 'payment-methods',
  paymentRequest: 'payment-requests', paymentSubmission: 'payment-submissions',
  membershipCard: 'membership-cards',
};

interface AdminLayoutProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeSection,
  onSectionChange,
  children,
}) => {
  const navigate = useNavigate();
  const { globalAdminSearch } = useAdmin();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(ADMIN_SIDEBAR_GROUPS.filter((g) => g.label).map((g) => [g.label, true]))
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = globalAdminSearch(searchQuery);
      setSearchResults(results);
      setSearchOpen(true);
    } else {
      setSearchResults([]);
      setSearchOpen(false);
    }
  }, [searchQuery, globalAdminSearch]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNav = (id: AdminSection) => {
    onSectionChange(id);
    setMobileOpen(false);
  };

  const handleSearchSelect = (result: SearchResult) => {
    const section = SECTION_MAP[result.type];
    if (section) onSectionChange(section);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-[#A6852F]/15 bg-gradient-to-b from-[#A6852F]/5 to-transparent">
        <button onClick={() => navigate('/')} className="group flex flex-col text-left focus:outline-none cursor-pointer">
          <span className="font-editorial tracking-[0.06em] text-[#1C1917] group-hover:text-[#A6852F] transition-all duration-500 uppercase leading-none text-base">
            Homer Gere
          </span>
          <span className="font-medium tracking-[0.35em] text-[#A6852F]/70 uppercase text-[7px] mt-0.5">
            Admin CMS
          </span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {ADMIN_SIDEBAR_GROUPS.map((group) => {
          if (!group.label) {
            return group.items.map((item) => {
              const Icon = SECTION_ICONS[item.id] || LayoutDashboard;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                    isActive ? 'bg-[#A6852F]/15 text-[#A6852F] font-medium shadow-sm' : 'text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            });
          }

          const isExpanded = expandedGroups[group.label] ?? true;
          const hasActive = group.items.some((i) => i.id === activeSection);

          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-medium uppercase tracking-[0.1em] transition-colors cursor-pointer ${
                  hasActive ? 'text-[#A6852F]' : 'text-[#57534E]/60 hover:text-[#57534E]'
                }`}
              >
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight className="w-3 h-3" />
                </motion.div>
                {group.label}
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0.5 py-1">
                      {group.items.map((item) => {
                        const Icon = SECTION_ICONS[item.id] || LayoutDashboard;
                        const isActive = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNav(item.id)}
                            className={`w-full flex items-center gap-2.5 pl-7 pr-3 py-1.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                              isActive ? 'bg-[#A6852F]/15 text-[#A6852F] font-medium shadow-sm' : 'text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917]'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="flex-1 text-left">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#A6852F]/10 bg-gradient-to-t from-[#A6852F]/5 to-transparent">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#A6852F] flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-[#A6852F]/20">SA</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1C1917] truncate">Super Admin</p>
            <p className="text-[11px] text-[#57534E] truncate">admin@homergere.com</p>
          </div>
        </div>
        <button
          onClick={async () => { await signOut(); navigate('/login'); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#57534E] hover:text-[#DC2626] hover:bg-[#DC2626]/5 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased flex">
      <aside className="hidden lg:flex w-60 bg-white border-r border-[#E8E5DF]/40 flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-60 min-h-screen flex flex-col">
        {/* Top bar with search */}
        <header className="sticky top-0 z-20 bg-[#FAF9F7]/90 backdrop-blur-xl border-b border-[#A6852F]/10 px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
          <span className="lg:hidden font-editorial text-sm text-[#1C1917] uppercase tracking-[0.06em]">Admin CMS</span>

          {/* Global Search */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]/40" />
              <input
                type="text"
                placeholder="Search members, content, payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setSearchOpen(true)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] placeholder:text-[#57534E]/40 focus:outline-none focus:border-[#A6852F]/40 transition-colors"
              />
            </div>
            <AnimatePresence>
              {searchOpen && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#E8E5DF]/80 shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto"
                >
                  {searchResults.slice(0, 10).map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSearchSelect(result)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#F3F1ED]/60 transition-colors text-left cursor-pointer border-b border-[#E8E5DF]/20 last:border-0"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#A6852F]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Search className="w-3 h-3 text-[#A6852F]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#1C1917] truncate">{result.title}</p>
                        <p className="text-[10px] text-[#57534E] truncate">{result.description}</p>
                      </div>
                      <span className="text-[9px] text-[#57534E]/60 uppercase shrink-0">{result.section}</span>
                    </button>
                  ))}
                </motion.div>
              )}
              {searchOpen && searchQuery && searchResults.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#E8E5DF]/80 shadow-lg p-4 text-center z-50"
                >
                  <p className="text-xs text-[#57534E]">No results found</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1" />

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#16A34A]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shadow-sm shadow-[#16A34A]/40 animate-pulse" />
            System Online
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
