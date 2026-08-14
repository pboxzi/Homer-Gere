import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { DetailModal } from '../../components/DetailModal';
import { AuthModal } from '../../components/AuthModal';
import { ChatLanding } from './ChatLanding';
import { SEO } from '../../components/SEO';
import { ModalType } from '../../types';
import { useAuth } from '../../context/AuthContext';


export default function ChatPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeSection] = useState<string>('chat');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authFeature, setAuthFeature] = useState('Chat with Homer');

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

  const handleStartFanChat = useCallback(() => {
    if (!isAuthenticated) {
      setAuthFeature('Chat with Homer');
      setAuthModalOpen(true);
      return;
    }
    navigate('/dashboard?section=chat');
  }, [isAuthenticated, navigate]);

  const handleStartBusinessChat = useCallback(() => {
    if (!isAuthenticated) {
      setAuthFeature('Chat with Homer');
      setAuthModalOpen(true);
      return;
    }
    navigate('/dashboard?section=messages');
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title="Chat with Homer" />
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        onOpenSignIn={() => setActiveModal({ type: 'signin' })}
      />

      <main className="pt-16 lg:pt-20">
        <ChatLanding
          onStartFanChat={handleStartFanChat}
          onStartBusinessChat={handleStartBusinessChat}
        />
      </main>

      <DetailModal
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenChat={handleOpenChat}
      />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} feature={authFeature} />
    </div>
  );
}
