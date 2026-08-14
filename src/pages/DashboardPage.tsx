import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { DashboardHome } from './dashboard/DashboardHome';
import { DashboardProfile } from './dashboard/DashboardProfile';
import { DashboardMembership } from './dashboard/DashboardMembership';
import DashboardMembershipRequests from './dashboard/DashboardMembershipRequests';
import DashboardPayments from './dashboard/DashboardPayments';
import DashboardMembershipCard from './dashboard/DashboardMembershipCard';
import { DashboardChat } from './dashboard/DashboardChat';
import { DashboardMessages } from './dashboard/DashboardMessages';
import { DashboardExperiences } from './dashboard/DashboardExperiences';
import { DashboardRequests } from './dashboard/DashboardRequests';
import { DashboardBookmarks } from './dashboard/DashboardBookmarks';
import { DashboardFavorites } from './dashboard/DashboardFavorites';
import { DashboardNotifications } from './dashboard/DashboardNotifications';
import { DashboardSettings } from './dashboard/DashboardSettings';
import { DashboardSecurity } from './dashboard/DashboardSecurity';
import { DashboardHelp } from './dashboard/DashboardHelp';
import DashboardDownloads from './dashboard/DashboardDownloads';
import DashboardActivity from './dashboard/DashboardActivity';
import { SEO } from '../components/SEO';
import { DashboardSection } from '../data/dashboardData';

const VALID_SECTIONS: DashboardSection[] = [
  'home', 'profile', 'membership', 'membership-requests', 'payments',
  'membership-card', 'chat', 'messages', 'experiences', 'requests',
  'downloads', 'activity', 'bookmarks', 'favorites', 'notifications',
  'settings', 'security', 'help',
];

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSection = (searchParams.get('section') as DashboardSection) || 'home';
  const [activeSection, setActiveSection] = useState<DashboardSection>(
    VALID_SECTIONS.includes(initialSection) ? initialSection : 'home'
  );
  const [openRequestForm, setOpenRequestForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/auth/sign-in');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const s = searchParams.get('section') as DashboardSection;
    if (s && VALID_SECTIONS.includes(s) && s !== activeSection) {
      setActiveSection(s);
    }
  }, [searchParams]);

  const handleSectionChange = (section: DashboardSection) => {
    setActiveSection(section);
    setSearchParams({ section }, { replace: true });
  };

  const handleOpenChat = () => {
    navigate('/chat');
  };

  const handleRequestExperience = () => {
    handleSectionChange('experiences');
    setOpenRequestForm(true);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home': return <DashboardHome onOpenChat={() => handleSectionChange('chat')} onRequestExperience={handleRequestExperience} onNavigate={handleSectionChange} />;
      case 'profile': return <DashboardProfile />;
      case 'membership': return <DashboardMembership onNavigate={handleSectionChange} initialTab={(searchParams.get('tab') as 'overview' | 'plans' | 'history') || 'overview'} />;
      case 'membership-requests': return <DashboardMembershipRequests />;
      case 'payments': return <DashboardPayments />;
      case 'membership-card': return <DashboardMembershipCard />;
      case 'chat': return <DashboardChat />;
      case 'messages': return <DashboardMessages />;
      case 'experiences': return <DashboardExperiences openRequestForm={openRequestForm} onRequestFormOpened={() => setOpenRequestForm(false)} />;
      case 'requests': return <DashboardRequests />;
      case 'downloads': return <DashboardDownloads />;
      case 'activity': return <DashboardActivity />;
      case 'bookmarks': return <DashboardBookmarks />;
      case 'favorites': return <DashboardFavorites />;
      case 'notifications': return <DashboardNotifications />;
      case 'settings': return <DashboardSettings />;
      case 'security': return <DashboardSecurity />;
      case 'help': return <DashboardHelp />;
      default: return <DashboardHome onOpenChat={handleOpenChat} onRequestExperience={handleRequestExperience} onNavigate={handleSectionChange} />;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
      <SEO title="Dashboard" />
      {renderSection()}
    </DashboardLayout>
  );
}
