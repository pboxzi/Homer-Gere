import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ChatModal } from '../components/ChatModal';
import { DetailModal } from '../components/DetailModal';
import { Footer } from '../components/Footer';
import { SectionDivider } from '../components/SectionDivider';
import { SectionFadeIn } from '../components/SectionFadeIn';
import { MembershipHero } from './membership/MembershipHero';
import { MembershipWhy } from './membership/MembershipWhy';
import { MembershipPlans } from './membership/MembershipPlans';
import { MembershipComparison } from './membership/MembershipComparison';
import { MembershipHowItWorks } from './membership/MembershipHowItWorks';
import { MembershipFAQ } from './membership/MembershipFAQ';
import { MembershipCTA } from './membership/MembershipCTA';
import { ModalType } from '../types';

export default function MembershipPage() {
  const navigate = useNavigate();
  const [activeSection] = useState<string>('membership');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');

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

  const handleBecomeMember = () => {
    const element = document.getElementById('membership-plans');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleComparePlans = () => {
    const element = document.getElementById('membership-comparison');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTier = (tierId: string) => {
    setActiveModal({ type: 'membership', tier: { id: tierId } as any });
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
        <MembershipHero
          onBecomeMember={handleBecomeMember}
          onComparePlans={handleComparePlans}
        />

        <SectionDivider />

        {/* 2. Why Become a Member */}
        <SectionFadeIn>
          <MembershipWhy />
        </SectionFadeIn>

        <SectionDivider />

        {/* 3. Membership Plans */}
        <SectionFadeIn>
          <MembershipPlans onSelectTier={handleSelectTier} />
        </SectionFadeIn>

        <SectionDivider />

        {/* 4. Comparison Table */}
        <SectionFadeIn>
          <MembershipComparison />
        </SectionFadeIn>

        <SectionDivider />

        {/* 5. How It Works */}
        <SectionFadeIn>
          <MembershipHowItWorks />
        </SectionFadeIn>

        <SectionDivider />

        {/* 6. FAQ */}
        <SectionFadeIn>
          <MembershipFAQ />
        </SectionFadeIn>

        {/* 7. CTA */}
        <MembershipCTA
          onBecomeMember={handleBecomeMember}
          onOpenChat={() => handleOpenChat('fan')}
        />
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
