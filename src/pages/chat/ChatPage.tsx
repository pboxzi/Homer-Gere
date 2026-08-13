import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { ChatModal } from '../../components/ChatModal';
import { DetailModal } from '../../components/DetailModal';
import { Footer } from '../../components/Footer';
import { ChatTypeSelector } from './ChatTypeSelector';
import { FanChat } from './FanChat';
import { BusinessChat } from './BusinessChat';
import { ChatConfirmation } from './ChatConfirmation';
import { ModalType } from '../../types';

type ChatStep = 'select' | 'fan-chat' | 'business-form' | 'confirmation';

export default function ChatPage() {
  const navigate = useNavigate();
  const [activeSection] = useState<string>('chat');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');

  const [step, setStep] = useState<ChatStep>('select');
  const [chatType, setChatType] = useState<'fan' | 'business'>('fan');
  const [method, setMethod] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'home') {
      navigate('/');
    } else if (sectionId === 'journey') {
      navigate('/journey');
    } else if (sectionId === 'projects') {
      navigate('/projects');
    } else if (sectionId === 'media') {
      navigate('/media');
    } else if (sectionId === 'gallery') {
      navigate('/gallery');
    } else if (sectionId === 'journal') {
      navigate('/journal');
    } else if (sectionId === 'experiences') {
      navigate('/experiences');
    } else if (sectionId === 'membership') {
      navigate('/membership');
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenChat = (mode: 'fan' | 'business' = 'fan') => {
    setChatMode(mode);
    setChatOpen(true);
  };

  const handleSelectType = (type: 'fan' | 'business') => {
    setChatType(type);
    setStep(type === 'fan' ? 'fan-chat' : 'business-form');
  };

  const handleBusinessComplete = (data: { fullName: string; email: string; company: string; enquiryType: string; message: string; method: string }) => {
    setFormData(data);
    setMethod(data.method);
    setStep('confirmation');
  };

  const handleClose = () => {
    setStep('select');
    setChatType('fan');
    setMethod('');
    setFormData({});
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        onOpenSignIn={() => setActiveModal({ type: 'signin' })}
      />

      <main>
        {step === 'select' && (
          <ChatTypeSelector onSelect={handleSelectType} />
        )}

        {step === 'fan-chat' && (
          <FanChat onBack={handleClose} />
        )}

        {step === 'business-form' && (
          <BusinessChat
            onBack={handleClose}
            onComplete={handleBusinessComplete}
          />
        )}

        {step === 'confirmation' && (
          <ChatConfirmation
            chatType={chatType}
            method={method}
            formData={formData}
            onClose={handleClose}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />

      <ChatModal
        isOpen={chatOpen}
        initialMode={chatMode}
        onClose={() => setChatOpen(false)}
      />

      <DetailModal
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenChat={handleOpenChat}
      />
    </div>
  );
}
