import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, User, Crown, MessageSquare, Inbox, Sparkles,
  FileText, Bookmark, Heart, Bell, Settings, Shield, HelpCircle,
  LogOut, Menu, X, ChevronRight, ArrowLeft, CreditCard, DollarSign,
} from 'lucide-react';
import { DashboardSection, DASHBOARD_NAV_ITEMS } from '../../data/dashboardData';
import { useDashboard } from '../../context/DashboardContext';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard, User, Crown, MessageSquare, Inbox, Sparkles,
  FileText, Bookmark, Heart, Bell, Settings, Shield, HelpCircle,
  CreditCard, DollarSign,
};

interface DashboardLayoutProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeSection,
  onSectionChange,
  children,
}) => {
  const navigate = useNavigate();
  const { profile } = useDashboard();
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainItems = DASHBOARD_NAV_ITEMS.filter((i) => i.group === 'main');
  const activityItems = DASHBOARD_NAV_ITEMS.filter((i) => i.group === 'activity');
  const accountItems = DASHBOARD_NAV_ITEMS.filter((i) => i.group === 'account');

  const handleNav = (id: DashboardSection) => {
    onSectionChange(id);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#A6852F]/25 bg-gradient-to-b from-[#A6852F]/8 to-transparent">
        <button onClick={() => navigate('/')} className="group flex flex-col text-left focus:outline-none cursor-pointer">
          <span className="font-editorial tracking-[0.06em] text-[#1C1917] group-hover:text-[#A6852F] transition-all duration-500 uppercase leading-none text-base">
            Homer Gere
          </span>
          <span className="font-medium tracking-[0.35em] text-[#A6852F]/70 uppercase text-[7px] mt-0.5">
            Member Dashboard
          </span>
        </button>
      </div>

      {/* Back to Homepage */}
      <div className="px-3 pt-3">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <NavGroup label="Main" items={mainItems} active={activeSection} onSelect={handleNav} />
        <NavGroup label="Activity" items={activityItems} active={activeSection} onSelect={handleNav} />
        <NavGroup label="Account" items={accountItems} active={activeSection} onSelect={handleNav} />
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-[#A6852F]/20 bg-gradient-to-t from-[#A6852F]/8 to-transparent">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#A6852F] flex items-center justify-center text-white text-sm font-bold shadow-md shadow-[#A6852F]/30">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1C1917] truncate">{profile.firstName} {profile.lastName}</p>
            <p className="text-[11px] text-[#57534E] truncate">{profile.email}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/login')}
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
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#A6852F]/20 flex-col fixed inset-y-0 left-0 z-30 shadow-lg shadow-[#A6852F]/5">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
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
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-[#FAF9F7]/90 backdrop-blur-xl border-b border-[#A6852F]/20 px-4 py-3 flex items-center gap-3 shadow-sm shadow-[#A6852F]/5">
          <button onClick={() => navigate('/')} className="w-9 h-9 rounded-xl flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer" title="Back to Homepage">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setMobileOpen(true)} className="w-9 h-9 rounded-xl flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-editorial text-sm text-[#1C1917] uppercase tracking-[0.06em]">Dashboard</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

interface NavGroupProps {
  label: string;
  items: typeof DASHBOARD_NAV_ITEMS;
  active: DashboardSection;
  onSelect: (id: DashboardSection) => void;
}

const NavGroup: React.FC<NavGroupProps> = ({ label, items, active, onSelect }) => (
  <div>
    <p className="px-3 mb-2 text-[10px] font-medium text-[#57534E]/60 uppercase tracking-[0.1em]">{label}</p>
    <div className="space-y-0.5">
      {items.map((item) => {
        const Icon = ICON_MAP[item.icon] || LayoutDashboard;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-[#A6852F]/20 text-[#A6852F] font-medium shadow-md shadow-[#A6852F]/20 border border-[#A6852F]/30'
                : 'text-[#57534E] hover:bg-[#A6852F]/8 hover:text-[#1C1917] border border-transparent'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="flex-1 text-left">{item.label}</span>
            {isActive && <ChevronRight className="w-3 h-3 text-[#A6852F]/60" />}
          </button>
        );
      })}
    </div>
  </div>
);
