import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Building2 } from 'lucide-react';
import { DashboardChat } from './DashboardChat';
import { DashboardMessages } from './DashboardMessages';

type MessagesTab = 'fan' | 'business';

export const DashboardMessagesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as MessagesTab) || 'fan';
  const [activeTab, setActiveTab] = useState<MessagesTab>(
    initialTab === 'business' ? 'business' : 'fan'
  );

  useEffect(() => {
    const tab = searchParams.get('tab') as MessagesTab;
    if (tab === 'business' || tab === 'fan') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: MessagesTab) => {
    setActiveTab(tab);
    setSearchParams({ section: 'messages', tab }, { replace: true });
  };

  const tabs = [
    { key: 'fan' as const, label: 'Chat with Homer', icon: MessageSquare },
    { key: 'business' as const, label: 'Business Enquiries', icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 border-b border-[#E8E5DF]/40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors cursor-pointer relative ${
                isActive
                  ? 'text-[#A6852F]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A6852F] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'fan' ? <DashboardChat /> : <DashboardMessages />}
    </div>
  );
};
