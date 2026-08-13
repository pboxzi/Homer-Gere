import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ChatModal } from '../components/ChatModal';
import { DetailModal } from '../components/DetailModal';
import { Footer } from '../components/Footer';
import { SectionDivider } from '../components/SectionDivider';
import { SectionFadeIn } from '../components/SectionFadeIn';
import { ExperiencesHero } from './experiences/ExperiencesHero';
import { HowItWorks } from './experiences/HowItWorks';
import { FeaturedExperiences } from './experiences/FeaturedExperiences';
import { ExperienceDetailModal } from './experiences/ExperienceDetailModal';
import { RequestExperienceForm } from './experiences/RequestExperienceForm';
import { ExperiencesFAQ } from './experiences/ExperiencesFAQ';
import { ExperiencesExplore } from './experiences/ExperiencesExplore';
import { ModalType, Experience } from '../types';

export default function ExperiencesPage() {
  const navigate = useNavigate();
  const [activeSection] = useState<string>('experiences');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showRequestForm, setShowRequestForm] = useState<boolean>(false);
  const [preselectedForRequest, setPreselectedForRequest] = useState<Experience | null>(null);

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

  const handleSelectExperience = (experience: Experience) => {
    setSelectedExperience(experience);
    setShowDetailModal(true);
  };

  const handleRequestExperience = (experience?: Experience) => {
    setShowDetailModal(false);
    setPreselectedForRequest(experience || null);
    setShowRequestForm(true);
  };

  const handleRequestFromHero = () => {
    setShowRequestForm(true);
  };

  const handleExploreMembership = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('membership')?.scrollIntoView({ behavior: 'smooth' });
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
        <ExperiencesHero onRequestExperience={handleRequestFromHero} />

        <SectionDivider />

        {/* 2. How It Works */}
        <SectionFadeIn>
          <HowItWorks />
        </SectionFadeIn>

        <SectionDivider />

        {/* 3. Featured Experiences */}
        <SectionFadeIn>
          <FeaturedExperiences
            onSelectExperience={handleSelectExperience}
            onRequestExperience={handleRequestFromHero}
          />
        </SectionFadeIn>

        <SectionDivider />

        {/* 3. FAQ */}
        <SectionFadeIn>
          <ExperiencesFAQ />
        </SectionFadeIn>

        <SectionDivider />

        {/* 4. Continue Exploring */}
        <SectionFadeIn>
          <ExperiencesExplore
            onExploreMembership={handleExploreMembership}
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

      {/* Experience Detail Modal */}
      <ExperienceDetailModal
        experience={selectedExperience}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedExperience(null);
        }}
        onRequestExperience={handleRequestExperience}
      />

      {/* Request Form Modal */}
      {showRequestForm && (
        <RequestExperienceForm
          preselectedExperience={preselectedForRequest}
          onClose={() => {
            setShowRequestForm(false);
            setPreselectedForRequest(null);
          }}
        />
      )}
    </div>
  );
}
