import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SEO } from '../../components/SEO';
import { Navbar } from '../../components/Navbar';
import { DetailModal } from '../../components/DetailModal';
import { getArticleBySlug, getRelatedArticles } from '../../data/journal';
import { ArticleDetailHero } from './article/ArticleDetailHero';
import { ArticleDetailBody } from './article/ArticleDetailBody';
import { ArticleDetailRelated } from './article/ArticleDetailRelated';
import { Footer } from '../../components/Footer';
import { ModalType } from '../../types';

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const relatedArticles = slug ? getRelatedArticles(slug, 3) : [];
  const [activeSection] = React.useState<string>('journal');
  const [activeModal, setActiveModal] = React.useState<ModalType>(null);

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
    } else {
      navigate('/');
    }
  };

  const handleOpenChat = () => {
    navigate('/chat');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-4xl sm:text-5xl font-editorial text-[#1C1917]">
            Article Not Found
          </h1>
          <p className="text-[#44403C] max-w-md mx-auto">
            The article you're looking for doesn't exist or hasn't been published yet.
          </p>
          <button
            onClick={() => navigate('/journal')}
            className="inline-flex items-center gap-2 bg-[#A6852F] hover:bg-[#B8983A] text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer"
          >
            Back to Journal
          </button>
        </div>
      </div>
    );
  }

  const siteUrl = 'https://homergere.com';
  const articleUrl = `${siteUrl}/journal/${article.slug}`;
  const ogImage = article.ogImage || article.image;

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title={article.title} description={article.seoDescription} />
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        onOpenSignIn={() => setActiveModal({ type: 'signin' })}
      />

      {/* SEO */}
      <Helmet>
        <title>{article.seoTitle}</title>
        <meta name="description" content={article.seoDescription} />
        <link rel="canonical" href={articleUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.seoTitle} />
        <meta property="og:description" content={article.seoDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:site_name" content="Homer Gere — Official Website" />
        <meta property="article:published_time" content={article.publishDate} />
        <meta property="article:author" content={article.author} />
        <meta property="article:section" content={article.category} />
        {article.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.seoTitle} />
        <meta name="twitter:description" content={article.seoDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Article Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.seoDescription,
            image: ogImage,
            datePublished: article.publishDate,
            author: {
              '@type': 'Organization',
              name: article.author,
              url: siteUrl,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Homer Gere — Official Website',
              url: siteUrl,
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': articleUrl,
            },
            keywords: article.tags.join(', '),
            wordCount: article.wordCount,
            articleSection: article.category,
          })}
        </script>

        {/* Breadcrumb Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: siteUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Journal',
                item: `${siteUrl}/journal`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: article.title,
                item: articleUrl,
              },
            ],
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <ArticleDetailHero
        article={article}
        onBack={() => navigate('/journal')}
      />

      {/* Body */}
      <ArticleDetailBody article={article} />

      {/* Related Articles */}
      <ArticleDetailRelated
        articles={relatedArticles}
        onNavigate={(slug) => navigate(`/journal/${slug}`)}
      />

      {/* Footer */}
      <Footer onNavigate={(path) => navigate(path)} onOpenChat={handleOpenChat} />

      <DetailModal
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenChat={handleOpenChat}
      />
    </div>
  );
}
