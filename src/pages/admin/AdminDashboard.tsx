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
import { AdminProvider } from '../../context/AdminContext';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <AdminOverview onNavigate={setActiveSection} />;
      // Website
      case 'homepage': case 'navigation': case 'footer': case 'menus': case 'seo':
        return <AdminWebsite activeSection={activeSection} />;
      // Content
      case 'journey': case 'projects': case 'gallery': case 'media-content': case 'journal': case 'faqs':
        return <AdminContent activeSection={activeSection} />;
      // Community
      case 'members': case 'plans': case 'applications': case 'experiences': case 'experience-requests':
        return <AdminCommunity activeSection={activeSection} />;
      // Communications
      case 'fan-chat': case 'business-chat': case 'contact-messages': case 'admin-notifications':
        return <AdminCommunications activeSection={activeSection} />;
      // Media Library
      case 'images': case 'videos': case 'documents':
        return <AdminMediaLibrary activeSection={activeSection} />;
      // Payments
      case 'membership-payments': case 'transactions':
        return <AdminPayments activeSection={activeSection} />;
      // Analytics
      case 'visitors': case 'membership-stats': case 'experience-stats': case 'chat-stats':
        return <AdminAnalytics activeSection={activeSection} />;
      // System
      case 'website-settings': case 'branding': case 'comm-settings': case 'email-templates': case 'security': case 'backups': case 'integrations':
        return <AdminSystem activeSection={activeSection} />;
      default:
        return <AdminOverview onNavigate={setActiveSection} />;
    }
  };

  return (
    <AdminProvider>
      <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderSection()}
      </AdminLayout>
    </AdminProvider>
  );
}
