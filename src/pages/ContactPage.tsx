import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { DetailModal } from '../components/DetailModal';
import { Footer } from '../components/Footer';
import { SectionFadeIn } from '../components/SectionFadeIn';
import { ContactHero } from './contact/ContactHero';
import { ContactDepartments } from './contact/ContactDepartments';
import { ContactBusinessEnquiry } from './contact/ContactBusinessEnquiry';
import { ContactFAQ } from './contact/ContactFAQ';
import { SEO } from '../components/SEO';
import { ModalType } from '../types';

export default function ContactPage() {
  const navigate = useNavigate();
  const [activeSection] = useState<string>('contact');
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'home') { navigate('/'); return; }
    if (sectionId === 'journey') { navigate('/journey'); return; }
    if (sectionId === 'projects') { navigate('/projects'); return; }
    if (sectionId === 'media') { navigate('/media'); return; }
    if (sectionId === 'gallery') { navigate('/gallery'); return; }
    if (sectionId === 'journal') { navigate('/journal'); return; }
    if (sectionId === 'experiences') { navigate('/experiences'); return; }
    if (sectionId === 'membership') { navigate('/membership'); return; }
    if (sectionId === 'chat') { navigate('/chat'); return; }
    if (sectionId === 'contact') { navigate('/contact'); return; }
    const element = document.getElementById(sectionId);
    if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
  };

  const handleOpenChat = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title="Contact" />
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        onOpenSignIn={() => setActiveModal({ type: 'signin' })}
      />

      <main>
        <ContactHero />

        <SectionFadeIn>
          <ContactDepartments />
        </SectionFadeIn>

        <SectionFadeIn>
          <ContactBusinessEnquiry />
        </SectionFadeIn>

        <SectionFadeIn>
          <ContactFAQ />
        </SectionFadeIn>
      </main>

      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />

      <DetailModal modal={activeModal} onClose={() => setActiveModal(null)} onOpenChat={handleOpenChat} />
    </div>
  );
}
