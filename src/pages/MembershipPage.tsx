import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ChatModal } from '../components/ChatModal';
import { DetailModal } from '../components/DetailModal';
import { Footer } from '../components/Footer';
import { SectionFadeIn } from '../components/SectionFadeIn';
import { MembershipHero } from './membership/MembershipHero';
import { MembershipWhy } from './membership/MembershipWhy';
import { MembershipPlans } from './membership/MembershipPlans';
import { MembershipComparison } from './membership/MembershipComparison';
import { MembershipHowItWorks } from './membership/MembershipHowItWorks';
import { MembershipFAQ } from './membership/MembershipFAQ';
import { MembershipCTA } from './membership/MembershipCTA';
import { SEO } from '../components/SEO';
import { ModalType } from '../types';

export default function MembershipPage() {
  const navigate = useNavigate();
  const [activeSection] = useState<string>('membership');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');

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

  const handleOpenChat = (mode: 'fan' | 'business' = 'fan') => { setChatMode(mode); setChatOpen(true); };
  const handleBecomeMember = () => { document.getElementById('membership-plans')?.scrollIntoView({ behavior: 'smooth' }); };
  const handleComparePlans = () => { document.getElementById('membership-comparison')?.scrollIntoView({ behavior: 'smooth' }); };
  const handleSelectTier = (tierId: string) => { setActiveModal({ type: 'membership', tier: { id: tierId } as any }); };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title="Membership" />
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} onOpenChat={handleOpenChat} onOpenSignIn={() => setActiveModal({ type: 'signin' })} />
      <main>
        <MembershipHero onBecomeMember={handleBecomeMember} onComparePlans={handleComparePlans} />
        <SectionFadeIn><MembershipWhy /></SectionFadeIn>
        <SectionFadeIn><MembershipPlans onSelectTier={handleSelectTier} /></SectionFadeIn>
        <SectionFadeIn><MembershipComparison /></SectionFadeIn>
        <SectionFadeIn><MembershipHowItWorks /></SectionFadeIn>
        <SectionFadeIn><MembershipFAQ /></SectionFadeIn>
        <MembershipCTA onBecomeMember={handleBecomeMember} onOpenChat={() => handleOpenChat('fan')} />
      </main>
      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />
      <ChatModal isOpen={chatOpen} initialMode={chatMode} onClose={() => setChatOpen(false)} />
      <DetailModal modal={activeModal} onClose={() => setActiveModal(null)} onOpenChat={handleOpenChat} />
    </div>
  );
}
