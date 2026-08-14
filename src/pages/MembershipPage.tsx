import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { DetailModal } from '../components/DetailModal';
import { AuthModal } from '../components/AuthModal';
import { Footer } from '../components/Footer';
import { SectionFadeIn } from '../components/SectionFadeIn';
import { MembershipHero } from './membership/MembershipHero';
import { MembershipWhy } from './membership/MembershipWhy';
import { MembershipPlans } from './membership/MembershipPlans';
import { MembershipComparison } from './membership/MembershipComparison';
import { MembershipHowItWorks } from './membership/MembershipHowItWorks';
import { MembershipRequirements } from './membership/MembershipRequirements';
import { MembershipFAQ } from './membership/MembershipFAQ';
import { MembershipTestimonials } from './membership/MembershipTestimonials';
import { MembershipCTA } from './membership/MembershipCTA';
import { SEO } from '../components/SEO';
import { ModalType } from '../types';
import { useAuth } from '../context/AuthContext';

export default function MembershipPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeSection] = useState<string>('membership');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authFeature, setAuthFeature] = useState<string | undefined>();

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

  const handleOpenChat = () => { navigate('/chat'); };

  const handleBecomeMember = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setAuthFeature('Become a Member');
      setAuthModalOpen(true);
    }
  };

  const handleComparePlans = () => { document.getElementById('membership-comparison')?.scrollIntoView({ behavior: 'smooth' }); };

  const handleSelectTier = (tierId: string) => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setAuthFeature('Apply for Membership');
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title="Membership" />
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} onOpenChat={handleOpenChat} onOpenSignIn={() => setActiveModal({ type: 'signin' })} />
      <main>
        <MembershipHero onBecomeMember={handleBecomeMember} onComparePlans={handleComparePlans} />
        <SectionFadeIn><MembershipWhy /></SectionFadeIn>
        <SectionFadeIn><MembershipPlans onSelectTier={handleSelectTier} /></SectionFadeIn>
        <SectionFadeIn><MembershipComparison /></SectionFadeIn>
        <SectionFadeIn><MembershipRequirements /></SectionFadeIn>
        <SectionFadeIn><MembershipHowItWorks /></SectionFadeIn>
        <SectionFadeIn><MembershipTestimonials /></SectionFadeIn>
        <SectionFadeIn><MembershipFAQ /></SectionFadeIn>
        <MembershipCTA onBecomeMember={handleBecomeMember} onOpenChat={handleOpenChat} />
      </main>
      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />
      <DetailModal modal={activeModal} onClose={() => setActiveModal(null)} onOpenChat={handleOpenChat} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} feature={authFeature} />
    </div>
  );
}
