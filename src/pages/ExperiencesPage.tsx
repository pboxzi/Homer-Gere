import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { DetailModal } from '../components/DetailModal';
import { Footer } from '../components/Footer';
import { SectionFadeIn } from '../components/SectionFadeIn';
import { ExperiencesHero } from './experiences/ExperiencesHero';
import { HowItWorks } from './experiences/HowItWorks';
import { FeaturedExperiences } from './experiences/FeaturedExperiences';
import { ExperiencesBenefits } from './experiences/ExperiencesBenefits';
import { ExperiencesTestimonials } from './experiences/ExperiencesTestimonials';
import { ExperienceDetailModal } from './experiences/ExperienceDetailModal';
import { RequestExperienceForm } from './experiences/RequestExperienceForm';
import { ExperiencesFAQ } from './experiences/ExperiencesFAQ';
import { ExperiencesExplore } from './experiences/ExperiencesExplore';
import { SEO } from '../components/SEO';
import { ModalType, Experience } from '../types';

export default function ExperiencesPage() {
  const navigate = useNavigate();
  const [activeSection] = useState<string>('experiences');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showRequestForm, setShowRequestForm] = useState<boolean>(false);
  const [preselectedForRequest, setPreselectedForRequest] = useState<Experience | null>(null);

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
  const handleSelectExperience = (experience: Experience) => { setSelectedExperience(experience); setShowDetailModal(true); };
  const handleRequestExperience = (experience?: Experience) => { setShowDetailModal(false); setPreselectedForRequest(experience || null); setShowRequestForm(true); };
  const handleRequestFromHero = () => { setShowRequestForm(true); };
  const handleExploreMembership = () => { navigate('/membership'); };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title="Experiences" />
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} onOpenChat={handleOpenChat} onOpenSignIn={() => setActiveModal({ type: 'signin' })} />
      <main>
        <ExperiencesHero onRequestExperience={handleRequestFromHero} />
        <SectionFadeIn><HowItWorks /></SectionFadeIn>
        <SectionFadeIn><ExperiencesBenefits /></SectionFadeIn>
        <SectionFadeIn><FeaturedExperiences onSelectExperience={handleSelectExperience} onRequestExperience={handleRequestFromHero} /></SectionFadeIn>
        <SectionFadeIn><ExperiencesTestimonials /></SectionFadeIn>
        <SectionFadeIn><ExperiencesFAQ /></SectionFadeIn>
        <SectionFadeIn><ExperiencesExplore onExploreMembership={handleExploreMembership} onOpenChat={handleOpenChat} /></SectionFadeIn>
      </main>
      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />
      <DetailModal modal={activeModal} onClose={() => setActiveModal(null)} onOpenChat={handleOpenChat} />
      <ExperienceDetailModal experience={selectedExperience} onClose={() => { setShowDetailModal(false); setSelectedExperience(null); }} onRequestExperience={handleRequestExperience} />
      {showRequestForm && <RequestExperienceForm preselectedExperience={preselectedForRequest} onClose={() => { setShowRequestForm(false); setPreselectedForRequest(null); }} />}
    </div>
  );
}
