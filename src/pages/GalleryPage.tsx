import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { GalleryHero } from './gallery/GalleryHero';
import { GalleryFeatured } from './gallery/GalleryFeatured';
import { GalleryCategories } from './gallery/GalleryCategories';
import { GalleryGrid } from './gallery/GalleryGrid';
import { GalleryStory } from './gallery/GalleryStory';
import { GalleryLatest } from './gallery/GalleryLatest';
import { GalleryExplore } from './gallery/GalleryExplore';
import { Footer } from '../components/Footer';
import { SectionFadeIn } from '../components/SectionFadeIn';
import { GalleryCategory, getPhotosByCategory, GALLERY_PHOTOS } from '../data/gallery';

export const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const filteredPhotos = useMemo(() => getPhotosByCategory(activeCategory), [activeCategory]);

  const categorySectionRef = useRef<HTMLDivElement>(null);
  const categoryInView = useInView(categorySectionRef, { once: true, margin: '-60px' });

  const [activeSection, setActiveSection] = useState<string>('gallery');
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'journey') navigate('/journey');
    else if (sectionId === 'projects') navigate('/projects');
    else if (sectionId === 'media') navigate('/media');
    else if (sectionId === 'home') navigate('/');
    else navigate('/');
  };

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChat={(mode) => { setChatMode(mode || 'fan'); setChatOpen(true); }}
        onOpenSignIn={() => {}}
      />
      {/* 1. Hero */}
      <GalleryHero />

      {/* 2. Featured Collection */}
      <GalleryFeatured
        onViewCollection={(id) => {
          setActiveCategory('Premieres');
          categorySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {/* 3. Category Filter + Gallery Grid */}
      <section ref={categorySectionRef} className="py-24 sm:py-32 bg-[#F3F1ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={categoryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
              Browse by Category
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
              Explore the Collection
            </h2>
            <p className="text-[#52525B] max-w-2xl mx-auto">
              Filter by category to find specific moments — from premieres and
              behind-the-scenes to editorial and press.
            </p>
          </motion.div>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={categoryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <GalleryCategories
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </motion.div>

          {/* Results count */}
          <div className="mb-6 text-sm text-[#71717A]">
            {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}{' '}
            {activeCategory !== 'All' && (
              <>
                in <span className="text-[#111827] font-medium">{activeCategory}</span>
              </>
            )}
          </div>

          <GalleryGrid photos={filteredPhotos} />
        </div>
      </section>

      {/* 4. Featured Story */}
      <GalleryStory />

      {/* 5. Latest Additions */}
      <GalleryLatest initialCount={8} loadMore={4} />

      {/* 6. Explore More */}
      <GalleryExplore onNavigate={(path) => navigate(path)} />

      {/* Footer */}
      <Footer onNavigate={(path) => navigate(path)} onOpenChat={() => {}} />
    </main>
  );
};
