import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Home } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';

export default function NotFoundPage() {
  const navigate = useNavigate();

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

  const handleOpenChat = () => { navigate('/chat'); };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." noindex />
      <Navbar activeSection="" onNavigate={handleNavigate} onOpenChat={handleOpenChat} onOpenSignIn={() => {}} />

      <main className="flex items-center justify-center min-h-[70vh] px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-8xl sm:text-9xl font-editorial text-[#A6852F]/20 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            404
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight mb-4">
            Page not found
          </h1>

          <p className="text-base text-[#57534E] leading-relaxed mb-8">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-[#A6852F] hover:bg-[#B8983A] text-white text-sm font-medium px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 bg-[#F3F1ED] hover:bg-[#E8E5DF] text-[#1C1917] text-sm font-medium px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </main>

      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />
    </div>
  );
}
