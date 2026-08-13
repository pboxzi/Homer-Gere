import React, { useState } from 'react';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { DashboardHome } from './dashboard/DashboardHome';
import { DashboardProfile } from './dashboard/DashboardProfile';
import { DashboardMembership } from './dashboard/DashboardMembership';
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
import { DashboardSection } from '../data/dashboardData';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home': return <DashboardHome />;
      case 'profile': return <DashboardProfile />;
      case 'membership': return <DashboardMembership />;
      case 'chat': return <DashboardChat />;
      case 'messages': return <DashboardMessages />;
      case 'experiences': return <DashboardExperiences />;
      case 'requests': return <DashboardRequests />;
      case 'bookmarks': return <DashboardBookmarks />;
      case 'favorites': return <DashboardFavorites />;
      case 'notifications': return <DashboardNotifications />;
      case 'settings': return <DashboardSettings />;
      case 'security': return <DashboardSecurity />;
      case 'help': return <DashboardHelp />;
      default: return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </DashboardLayout>
  );
}
