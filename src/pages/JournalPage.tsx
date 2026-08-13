import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalHero } from './journal/JournalHero';
import { JournalFeatured } from './journal/JournalFeatured';
import { JournalCategories } from './journal/JournalCategories';
import { JournalLatest } from './journal/JournalLatest';
import { JournalTrending } from './journal/JournalTrending';
import { JournalNewsletter } from './journal/JournalNewsletter';
import { JournalExplore } from './journal/JournalExplore';
import { Footer } from '../components/Footer';
import {
  JournalCategory,
  FEATURED_ARTICLE,
  TRENDING_ARTICLES,
  getArticlesByCategory,
} from '../data/journal';

export const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<JournalCategory>('All');
  const filteredArticles = useMemo(
    () => getArticlesByCategory(activeCategory),
    [activeCategory]
  );

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      {/* 1. Hero */}
      <JournalHero onBack={() => navigate('/')} />

      {/* 2. Featured Story */}
      <JournalFeatured article={FEATURED_ARTICLE} />

      {/* 3. Browse Categories + Latest Articles */}
      <section className="py-24 sm:py-32 bg-[#F3F1ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
              Browse by Category
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#111827] tracking-tight">
              All Articles
            </h2>
            <p className="text-[#52525B] max-w-2xl mx-auto">
              Filter through verified stories, production updates, interviews,
              and official announcements.
            </p>
          </div>

          <div className="mb-12">
            <JournalCategories
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Results count */}
          <div className="mb-6 text-sm text-[#71717A]">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}{' '}
            {activeCategory !== 'All' && (
              <>
                in{' '}
                <span className="text-[#111827] font-medium">{activeCategory}</span>
              </>
            )}
          </div>

          <JournalLatest articles={filteredArticles} initialCount={6} loadMore={3} />
        </div>
      </section>

      {/* 4. Trending Stories */}
      <JournalTrending articles={TRENDING_ARTICLES} />

      {/* 5. Newsletter */}
      <JournalNewsletter />

      {/* 6. Continue Exploring */}
      <JournalExplore onNavigate={(path) => navigate(path)} />

      {/* Footer */}
      <Footer onNavigate={(path) => navigate(path)} onOpenChat={() => {}} />
    </main>
  );
};
