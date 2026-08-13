import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { AdminOverview } from './AdminOverview';
import { AdminWebsite } from './AdminWebsite';
import { AdminContent } from './AdminContent';
import { AdminCommunity } from './AdminCommunity';
import { AdminCommunications } from './AdminCommunications';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminPayments } from './AdminPayments';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminSystem } from './AdminSystem';
import { AdminSection } from '../../data/adminData';

const Placeholder: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="space-y-4">
    <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">{title}</h1>
    <p className="text-sm text-[#57534E]">{description}</p>
    <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/30 p-12 text-center">
      <p className="text-sm text-[#57534E]">This section is coming soon.</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <AdminOverview />;
      // Website
      case 'homepage': case 'navigation': case 'footer': case 'menus': case 'seo':
        return <AdminWebsite />;
      // Content
      case 'journey': case 'projects': case 'gallery': case 'media-content': case 'journal': case 'faqs':
        return <AdminContent />;
      // Community
      case 'members': case 'plans': case 'applications': case 'experiences': case 'experience-requests':
        return <AdminCommunity />;
      // Communications
      case 'fan-chat': case 'business-chat': case 'contact-messages': case 'admin-notifications':
        return <AdminCommunications />;
      // Media Library
      case 'images': case 'videos': case 'documents':
        return <AdminMediaLibrary />;
      // Payments
      case 'membership-payments': case 'transactions':
        return <AdminPayments />;
      // Analytics
      case 'visitors': case 'membership-stats': case 'experience-stats': case 'chat-stats':
        return <AdminAnalytics />;
      // System
      case 'website-settings': case 'branding': case 'comm-settings': case 'email-templates': case 'security': case 'backups': case 'integrations':
        return <AdminSystem />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </AdminLayout>
  );
}
