import React, { useState } from 'react';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { DashboardHome } from './dashboard/DashboardHome';
import { DashboardProfile } from './dashboard/DashboardProfile';
import { DashboardMembership } from './dashboard/DashboardMembership';
import { DashboardChat } from './dashboard/DashboardChat';
import { DashboardRequests } from './dashboard/DashboardRequests';
import { DashboardNotifications } from './dashboard/DashboardNotifications';
import { DashboardSettings } from './dashboard/DashboardSettings';
import { DashboardSecurity } from './dashboard/DashboardSecurity';
import { DashboardSection } from '../data/dashboardData';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home': return <DashboardHome />;
      case 'profile': return <DashboardProfile />;
      case 'membership': return <DashboardMembership />;
      case 'chat': return <DashboardChat />;
      case 'messages': return <Placeholder title="My Messages" description="View and manage all your message threads." />;
      case 'experiences': return <Placeholder title="Experiences" description="Browse and request exclusive experiences." />;
      case 'requests': return <DashboardRequests />;
      case 'bookmarks': return <Placeholder title="Journal Bookmarks" description="Articles and entries you've saved for later." />;
      case 'favorites': return <Placeholder title="Gallery Favorites" description="Your saved photos and media from the gallery." />;
      case 'notifications': return <DashboardNotifications />;
      case 'settings': return <DashboardSettings />;
      case 'security': return <DashboardSecurity />;
      case 'help': return <Placeholder title="Help & Support" description="Get help with your account, membership, or platform features." />;
      default: return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </DashboardLayout>
  );
}

const Placeholder: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="space-y-4">
    <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">{title}</h1>
    <p className="text-sm text-[#57534E]">{description}</p>
    <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/30 p-12 text-center">
      <p className="text-sm text-[#57534E]">This section is coming soon.</p>
    </div>
  </div>
);
