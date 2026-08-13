import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ChatModal } from '../components/ChatModal';
import { DetailModal } from '../components/DetailModal';
import { Footer } from '../components/Footer';
import { SectionDivider } from '../components/SectionDivider';
import { SectionFadeIn } from '../components/SectionFadeIn';
import { ContactHero } from './contact/ContactHero';
import { ContactDirectory } from './contact/ContactDirectory';
import { ContactForm } from './contact/ContactForm';
import { ContactOfficeInfo } from './contact/ContactOfficeInfo';
import { ContactFAQ } from './contact/ContactFAQ';
import { ContactContinueExploring } from './contact/ContactContinueExploring';
import { ModalType } from '../types';

export default function ContactPage() {
  const navigate = useNavigate();
  const [activeSection] = useState<string>('contact');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);

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
    } else if (sectionId === 'chat') {
      navigate('/chat');
    } else if (sectionId === 'contact') {
      navigate('/contact');
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

  const handleSelectDepartment = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setTimeout(() => {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
        {/* 1. Hero */}
        <ContactHero />

        <SectionDivider />

        {/* 2. Contact Directory */}
        <SectionFadeIn>
          <ContactDirectory onSelectDepartment={handleSelectDepartment} />
        </SectionFadeIn>

        <SectionDivider />

        {/* 3. Contact Form */}
        <SectionFadeIn>
          <ContactForm
            preselectedDepartment={selectedDepartment}
            onBack={() => setSelectedDepartment(undefined)}
          />
        </SectionFadeIn>

        <SectionDivider />

        {/* 4. Office Information */}
        <SectionFadeIn>
          <ContactOfficeInfo />
        </SectionFadeIn>

        <SectionDivider />

        {/* 5. FAQ */}
        <SectionFadeIn>
          <ContactFAQ />
        </SectionFadeIn>

        <SectionDivider />

        {/* 6. Continue Exploring */}
        <SectionFadeIn>
          <ContactContinueExploring
            onExploreExperiences={() => navigate('/experiences')}
            onExploreMembership={() => navigate('/membership')}
            onOpenChat={() => handleOpenChat('fan')}
          />
        </SectionFadeIn>
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
