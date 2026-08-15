import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { DashboardHome } from './dashboard/DashboardHome';
import { DashboardProfile } from './dashboard/DashboardProfile';
import { DashboardMembership } from './dashboard/DashboardMembership';
import { DashboardMessagesPage } from './dashboard/DashboardMessagesPage';
import { DashboardExperiences } from './dashboard/DashboardExperiences';
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
  'home', 'profile', 'membership', 'messages', 'experiences',
  'downloads', 'activity', 'bookmarks', 'favorites', 'notifications',
  'settings', 'security', 'help',
];

const SECTION_REDIRECTS: Record<string, DashboardSection> = {
  'membership-requests': 'membership',
  'payments': 'membership',
  'membership-card': 'membership',
  'requests': 'experiences',
  'chat': 'messages',
};

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
    if (!s) return;
    const redirect = SECTION_REDIRECTS[s];
    if (redirect) {
      setActiveSection(redirect);
      setSearchParams({ section: redirect }, { replace: true });
      return;
    }
    if (VALID_SECTIONS.includes(s) && s !== activeSection) {
      setActiveSection(s);
    }
  }, [searchParams]);

  const handleSectionChange = (section: DashboardSection) => {
    setActiveSection(section);
    setSearchParams({ section }, { replace: true });
  };

  const handleOpenChat = () => {
    navigate('/dashboard?section=messages&tab=fan');
  };

  const handleRequestExperience = () => {
    handleSectionChange('experiences');
    setOpenRequestForm(true);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home': return <DashboardHome onOpenChat={() => handleSectionChange('messages')} onRequestExperience={handleRequestExperience} onNavigate={handleSectionChange} />;
      case 'profile': return <DashboardProfile />;
      case 'membership': return <DashboardMembership />;
      case 'messages': return <DashboardMessagesPage />;
      case 'experiences': return <DashboardExperiences openRequestForm={openRequestForm} onRequestFormOpened={() => setOpenRequestForm(false)} />;
      case 'downloads': return <DashboardDownloads />;
      case 'activity': return <DashboardActivity />;
      case 'bookmarks': return <DashboardBookmarks />;
      case 'favorites': return <DashboardFavorites />;
      case 'notifications': return <DashboardNotifications />;
      case 'settings': return <DashboardSettings />;
      case 'security': return <DashboardSecurity />;
      case 'help': return <DashboardHelp />;
      default: return <DashboardHome onOpenChat={() => handleSectionChange('messages')} onRequestExperience={handleRequestExperience} onNavigate={handleSectionChange} />;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
      <SEO title="Dashboard" />
      {renderSection()}
    </DashboardLayout>
  );
}
