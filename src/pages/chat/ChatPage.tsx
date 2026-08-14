import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { DetailModal } from '../../components/DetailModal';
import { ChatLanding } from './ChatLanding';
import { FanChat } from './FanChat';
import { BusinessChat } from './BusinessChat';
import { ChatConfirmation } from './ChatConfirmation';
import { SEO } from '../../components/SEO';
import { ModalType } from '../../types';


export default function ChatPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'fan';
  const [activeSection] = useState<string>('chat');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [submittedData, setSubmittedData] = useState<{
    fullName: string;
    email: string;
    company: string;
    enquiryType: string;
    message: string;
    method: string;
  } | null>(null);


  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'home') { navigate('/'); return; }
    if (sectionId === 'journey') { navigate('/journey'); return; }
    if (sectionId === 'projects') { navigate('/projects'); return; }
    if (sectionId === 'gallery') { navigate('/gallery'); return; }
    if (sectionId === 'journal') { navigate('/journal'); return; }
    if (sectionId === 'experiences') { navigate('/experiences'); return; }
    if (sectionId === 'membership') { navigate('/membership'); return; }
    if (sectionId === 'media') { navigate('/media'); return; }
    if (sectionId === 'chat') { navigate('/chat'); return; }
    navigate('/');
  };

  const handleOpenChat = () => {
    navigate('/chat');
  };

  const handleBusinessComplete = useCallback((data: {
    fullName: string;
    email: string;
    company: string;
    enquiryType: string;
    message: string;
    method: string;
  }) => {
    setSubmittedData(data);
  }, []);

  const handleCloseConfirmation = useCallback(() => {
    setSubmittedData(null);
    navigate('/');
  }, [navigate]);

  const handleStartFanChat = useCallback(() => {
    navigate('/chat?mode=fan');
  }, [navigate]);

  const handleStartBusinessChat = useCallback(() => {
    navigate('/chat?mode=business');
  }, [navigate]);

  return (
    <div className="h-dvh h-screen flex flex-col bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title="Chat with Homer" />
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        onOpenSignIn={() => setActiveModal({ type: 'signin' })}
      />

      <div className="flex-1 min-h-0 pt-16 lg:pt-20">
        {submittedData ? (
          <ChatConfirmation
            chatType="business"
            method={submittedData.method}
            formData={submittedData}
            onClose={handleCloseConfirmation}
          />
        ) : mode === 'business' ? (
          <BusinessChat onBack={() => navigate('/')} onComplete={handleBusinessComplete} />
        ) : mode === 'fan' ? (
          <FanChat onBack={() => navigate('/')} />
        ) : (
          <ChatLanding onStartFanChat={handleStartFanChat} onStartBusinessChat={handleStartBusinessChat} />
        )}
      </div>

      <DetailModal
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenChat={handleOpenChat}
      />
    </div>
  );
}
