import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { DetailModal } from '../../components/DetailModal';
import { AuthModal } from '../../components/AuthModal';
import { ChatLanding } from './ChatLanding';
import { FanChat } from './FanChat';
import { BusinessChat } from './BusinessChat';
import { ChatConfirmation } from './ChatConfirmation';
import { SEO } from '../../components/SEO';
import { ModalType } from '../../types';
import { useAuth } from '../../context/AuthContext';


export default function ChatPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'fan';
  const [activeSection] = useState<string>('chat');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
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
    if (sectionId === 'contact') { navigate('/contact'); return; }
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
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    navigate('/dashboard?section=messages');
  }, [isAuthenticated, navigate]);

  const handleStartBusinessChat = useCallback(() => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    navigate('/dashboard?section=messages');
  }, [isAuthenticated, navigate]);

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
        ) : (mode === 'fan' || mode === 'business') && isAuthenticated ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 px-4">
              <p className="text-sm text-[#57534E]">Redirecting to your dashboard...</p>
              <button
                onClick={() => navigate('/dashboard?section=messages')}
                className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <ChatLanding onStartFanChat={handleStartFanChat} onStartBusinessChat={handleStartBusinessChat} />
        )}
      </div>

      <DetailModal
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenChat={handleOpenChat}
      />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} feature="Chat with Homer" />
    </div>
  );
}
