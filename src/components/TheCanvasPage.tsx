'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ASSETS } from '@/src/constants/assets';

interface Article {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

export const TheCanvasPage: React.FC = () => {
  const { setActivePage, isDarkMode } = useShop();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeArticleModal, setActiveArticleModal] = useState<Article | null>(null);

  const featuredArticle: Article = {
    id: 'feat-1',
    category: 'Textile Philosophy',
    title: 'The Considered Bed: Notes on Rest as an Architectural Act',
    excerpt:
      'Why the sanctuary of sleep demands the same intentionality as structural design. An exploration into natural fiber physics, breathability gradients, and how organic flax fundamentally alters nighttime body temperature regulation.',
    date: 'November 14, 2024',
    readTime: '8 min read',
    image: ASSETS.editorial.canvas01,
    featured: true,
  };

  const articles: Article[] = [
    {
      id: 'art-1',
      category: 'Master Weaving',
      title: 'The Thread That Binds: Inside Our Forty-Six Step Loom Process',
      excerpt:
        'From northern Normandy fields to our generational mill in Guimarães, trace the intricate harvesting, dew-retting, and shuttle-loom weaving that gives Boski linen its distinctive hand-feel.',
      date: 'October 28, 2024',
      readTime: '6 min read',
      image: ASSETS.editorial.canvas02,
    },
    {
      id: 'art-2',
      category: 'Ecological Standard',
      title: 'OEKO-TEX Class 1: Purity From Seed to Finished Hem',
      excerpt:
        'Every single spool of yarn entering our atelier is verified zero-toxic. Learn why pure European flax requires zero synthetic irrigation and leaves behind zero chemical footprint in your bedroom.',
      date: 'September 19, 2024',
      readTime: '5 min read',
      image: ASSETS.editorial.canvas03,
    },
    {
      id: 'art-3',
      category: 'Interior Architecture',
      title: 'Layering Tonal Gradients: Creating Depth Through Texture Alone',
      excerpt:
        'Architectural designer Amélie Renaud dissects how combining matte 280 GSM drapery with luminous 480TC Egyptian sateen creates acoustic calm and natural light diffusion without visual noise.',
      date: 'August 12, 2024',
      readTime: '7 min read',
      image: ASSETS.editorial.canvas04,
    },
    {
      id: 'art-4',
      category: 'Bespoke Craft',
      title: 'The Physics of Weighted Drapery Hems',
      excerpt:
        'Why true luxury curtains hang differently. The mathematical balance of hand-stitched lead weights and custom drop measurements that frame expansive residential windows perfectly.',
      date: 'July 30, 2024',
      readTime: '4 min read',
      image: ASSETS.editorial.canvas05,
    },
    {
      id: 'art-5',
      category: 'Material Science',
      title: 'Why Real Linen Only Improves With Every Wash',
      excerpt:
        'The molecular structure of cellulose fibers in flax becomes smoother, more pliable, and increasingly supple over decades. The science behind generational heirlooms.',
      date: 'June 18, 2024',
      readTime: '5 min read',
      image: ASSETS.editorial.canvas06,
    },
    {
      id: 'art-6',
      category: 'Quiet Living',
      title: 'Sensory Rituals: The Evening Transition to Restorative Sleep',
      excerpt:
        'Tactile environments shape circadian rhythms. How cool-to-touch percale sheets and low-ambient lighting signal the nervous system to decelerate into deep delta rest.',
      date: 'May 04, 2024',
      readTime: '6 min read',
      image: ASSETS.editorial.canvas07,
    },
  ];

  const categories = ['all', 'Master Weaving', 'Interior Architecture', 'Material Science', 'Ecological Standard'];

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <main className={`flex-grow animate-fadeIn pb-24 transition-colors ${
      isDarkMode ? 'bg-[#111312] text-[#FAF8F5]' : 'bg-[#faf9f7] text-[#1a1c1b]'
    }`}>
      {/* Page Header */}
      <section className="w-full px-5 md:px-12 lg:px-16 max-w-[1440px] mx-auto pt-14 md:pt-20 pb-16">
        <div className="flex flex-col gap-4">
          <nav className={`text-label-caps uppercase tracking-[0.16em] flex items-center gap-2 text-xs ${
            isDarkMode ? 'text-[#A8A49C]' : 'text-[#505252]'
          }`}>
            <button
              onClick={() => {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors cursor-pointer ${isDarkMode ? 'hover:text-[#FAF8F5]' : 'hover:text-[#000000]'}`}
            >
              Home
            </button>
            <span className={isDarkMode ? 'text-[#383D3A]' : 'text-[#c4c7c7]'}>/</span>
            <span className={`font-semibold ${isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'}`}>The Canvas</span>
          </nav>

          <span className={`text-label-caps uppercase tracking-[0.2em] font-semibold mt-2 ${
            isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'
          }`}>
            The Canvas &middot; Journal &amp; Essays
          </span>
          <h1
            className={`text-[36px] sm:text-[54px] md:text-[64px] leading-[44px] sm:leading-[62px] md:leading-[72px] tracking-[-0.02em] max-w-3xl font-normal ${
              isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
            }`}
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            Perspectives on the art of fine rest
          </h1>
          <p className={`text-body-lg max-w-2xl font-light leading-relaxed ${
            isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
          }`}>
            Explorations into generational loom heritage, architectural interiors, and the physics of natural fibers that shape quiet sanctuaries.
          </p>
        </div>
      </section>

      {/* Featured Editorial Banner */}
      <section className="w-full px-5 md:px-12 lg:px-16 max-w-[1440px] mx-auto mb-20">
        <div className={`grid grid-cols-1 lg:grid-cols-12 border overflow-hidden group ${
          isDarkMode ? 'bg-[#141615] border-[#2A2E2C]' : 'bg-[#ffffff] border-[#c4c7c7]'
        }`}>
          {/* Image */}
          <div className="lg:col-span-7 relative overflow-hidden bg-[#efeeec] min-h-[380px] lg:min-h-[500px]">
            <img
              src={featuredArticle.image}
              alt={featuredArticle.title}
              className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/15" />
          </div>

          {/* Text Card with rigid typography hierarchy */}
          <div className={`lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between ${
            isDarkMode ? 'bg-[#141615]' : 'bg-[#ffffff]'
          }`}>
            <div>
              {/* Category Tag: uppercase, tracked */}
              <span className={`text-label-caps uppercase tracking-[0.2em] font-semibold block mb-3 ${
                isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'
              }`}>
                {featuredArticle.category}
              </span>

              {/* Article Title: serif h3 */}
              <h3
                className={`text-[28px] sm:text-[34px] leading-[36px] sm:leading-[42px] tracking-[-0.01em] font-normal mb-4 ${
                  isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                }`}
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                {featuredArticle.title}
              </h3>

              {/* Publication Date: muted sans-serif */}
              <div className={`flex items-center gap-3 text-body-sm font-sans mb-6 ${
                isDarkMode ? 'text-[#A8A49C]' : 'text-[#505252]'
              }`}>
                <time dateTime="2024-11-14">{featuredArticle.date}</time>
                <span>&middot;</span>
                <span>{featuredArticle.readTime}</span>
              </div>

              {/* Excerpt in elevated contrast body text */}
              <p className={`text-body-md leading-relaxed font-light mb-8 ${
                isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
              }`}>
                {featuredArticle.excerpt}
              </p>
            </div>

            {/* High-Contrast Primary CTA Button with 4px translate arrow */}
            <div>
              <button
                type="button"
                onClick={() => setActiveArticleModal(featuredArticle)}
                className={`inline-flex items-center justify-between gap-4 px-8 py-4 text-label-caps uppercase tracking-[0.18em] border transition-all duration-300 active:scale-[0.99] group/btn cursor-pointer w-full sm:w-auto shadow-sm font-medium ${
                  isDarkMode
                    ? 'bg-[#C5A059] text-black border-[#C5A059] hover:bg-[#D8B468]'
                    : 'bg-[#000000] text-white border-[#000000] hover:bg-[#252726]'
                }`}
              >
                <span>Read Essay</span>
                <span
                  className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover/btn:translate-x-1"
                  style={{ fontVariationSettings: "'wght' 300" }}
                >
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="w-full px-5 md:px-12 lg:px-16 max-w-[1440px] mx-auto mb-12">
        <div className={`flex items-center gap-3 overflow-x-auto scrollbar-hide border-b pb-4 ${
          isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]'
        }`}>
          <span className={`text-label-caps uppercase tracking-wider mr-2 font-semibold shrink-0 ${
            isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'
          }`}>
            Topics:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 border text-label-caps uppercase whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? isDarkMode
                    ? 'bg-[#C5A059] text-black border-[#C5A059] font-bold shadow-sm'
                    : 'bg-[#000000] text-white border-[#000000] shadow-sm'
                  : isDarkMode
                    ? 'bg-transparent text-[#A8A49C] border-[#383D3A] hover:border-[#C5A059] hover:text-[#FAF8F5]'
                    : 'bg-transparent text-[#2b2d2c] border-[#c4c7c7] hover:border-[#000000] hover:text-[#000000]'
              }`}
            >
              {cat === 'all' ? 'All Stories' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Unified CSS Grid for Editorial Cards */}
      <section className="w-full px-5 md:px-12 lg:px-16 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className={`border flex flex-col justify-between group transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-[#141615] border-[#2A2E2C] hover:border-[#C5A059]'
                  : 'bg-[#ffffff] border-[#c4c7c7] hover:border-[#000000]'
              }`}
            >
              {/* Media Header */}
              <div className="aspect-[16/10] overflow-hidden bg-[#efeeec] relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card Body enforcing Rigid Typography Hierarchy */}
              <div className="p-7 sm:p-8 flex flex-col flex-grow justify-between">
                <div>
                  {/* 1. Category Tag: uppercase, tracked */}
                  <span className={`text-label-caps uppercase tracking-[0.2em] font-semibold block mb-2.5 ${
                    isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'
                  }`}>
                    {article.category}
                  </span>

                  {/* 2. Article Title: serif h3 */}
                  <h3
                    className={`text-[22px] sm:text-[24px] leading-[30px] sm:leading-[32px] font-normal mb-2.5 ${
                      isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
                    }`}
                    style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                  >
                    {article.title}
                  </h3>

                  {/* 3. Publication Date: muted sans-serif */}
                  <div className={`flex items-center gap-2 text-body-sm font-sans mb-4 ${
                    isDarkMode ? 'text-[#A8A49C]' : 'text-[#505252]'
                  }`}>
                    <time dateTime={article.date}>{article.date}</time>
                    <span>&middot;</span>
                    <span>{article.readTime}</span>
                  </div>

                  {/* Excerpt in elevated color contrast (>= 4.5:1) */}
                  <p className={`text-body-sm leading-relaxed font-light line-clamp-3 mb-6 ${
                    isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
                  }`}>
                    {article.excerpt}
                  </p>
                </div>

                {/* Upgraded High-Contrast Secondary Button CTA with translate(4px) */}
                <div className={`pt-4 border-t ${
                  isDarkMode ? 'border-[#2A2E2C]' : 'border-[#e3e2e0]'
                }`}>
                  <button
                    type="button"
                    onClick={() => setActiveArticleModal(article)}
                    className={`w-full inline-flex items-center justify-between px-5 py-3 border text-label-caps uppercase tracking-[0.16em] transition-all duration-300 active:scale-[0.99] group/btn cursor-pointer font-medium ${
                      isDarkMode
                        ? 'border-[#383D3A] bg-transparent text-[#FAF8F5] hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059]'
                        : 'border-[#000000] bg-transparent text-[#000000] hover:bg-[#000000] hover:text-white'
                    }`}
                  >
                    <span>Read Essay</span>
                    <span
                      className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover/btn:translate-x-1"
                      style={{ fontVariationSettings: "'wght' 300" }}
                    >
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Reader Modal for Full Essay Reading */}
      {activeArticleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveArticleModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-article-title"
        >
          <div
            className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto border shadow-2xl p-8 sm:p-12 relative my-auto ${
              isDarkMode
                ? 'bg-[#141615] border-[#2A2E2C] text-[#FAF8F5]'
                : 'bg-[#faf9f7] border-[#000000] text-black'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveArticleModal(null)}
              className={`absolute top-6 right-6 w-11 h-11 flex items-center justify-center transition-colors cursor-pointer ${
                isDarkMode ? 'text-[#A8A49C] hover:text-[#FAF8F5]' : 'text-[#000000] hover:opacity-60'
              }`}
              aria-label="Close article"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <span className={`text-label-caps uppercase tracking-[0.2em] font-semibold block mb-2 ${
              isDarkMode ? 'text-[#C5A059]' : 'text-[#000000]'
            }`}>
              {activeArticleModal.category}
            </span>
            <h2
              id="modal-article-title"
              className={`text-[32px] sm:text-[40px] leading-[40px] sm:leading-[48px] font-normal mb-4 ${
                isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
              }`}
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              {activeArticleModal.title}
            </h2>
            <div className={`flex items-center gap-3 text-body-sm mb-8 pb-6 border-b ${
              isDarkMode ? 'text-[#A8A49C] border-[#2A2E2C]' : 'text-[#505252] border-[#c4c7c7]'
            }`}>
              <span>{activeArticleModal.date}</span>
              <span>&middot;</span>
              <span>{activeArticleModal.readTime}</span>
            </div>

            <div className="aspect-[16/9] overflow-hidden mb-8 bg-[#efeeec]">
              <img
                src={activeArticleModal.image}
                alt={activeArticleModal.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className={`space-y-6 text-body-md leading-relaxed font-light ${
              isDarkMode ? 'text-[#A8A49C]' : 'text-[#2b2d2c]'
            }`}>
              <p className={`text-lg leading-relaxed font-normal ${
                isDarkMode ? 'text-[#FAF8F5]' : 'text-[#000000]'
              }`}>
                {activeArticleModal.excerpt}
              </p>
              <p>
                In an era dominated by synthetic quick-fixes and mass manufacturing, the deliberate return to natural fiber architecture is both a sensory rebellion and an acoustic necessity. When properly harvested, Normandy flax fibers possess an inner hollow lumen that effortlessly traps air in cooler months while conducting ambient heat away in summer.
              </p>
              <p>
                At the BOSKI LIMITED atelier, our craftsmen preserve the ancient water-retting traditions that allow organic enzymes to naturally dissolve the pectin binding the flax bast to the stem. The result is a textile that never requires chemical softeners—its natural drape and buttery finish simply deepen over generations of laundering.
              </p>
            </div>

            <div className={`mt-10 pt-6 border-t flex justify-between items-center ${
              isDarkMode ? 'border-[#2A2E2C]' : 'border-[#c4c7c7]'
            }`}>
              <span className={`text-label-caps ${isDarkMode ? 'text-[#6E6B65]' : 'text-[#505252]'}`}>
                BOSKI LIMITED Editorial Archive
              </span>
              <button
                onClick={() => setActiveArticleModal(null)}
                className={`px-6 py-2.5 text-label-caps uppercase tracking-wider transition-colors cursor-pointer font-medium ${
                  isDarkMode
                    ? 'bg-[#C5A059] text-black hover:bg-[#D8B468]'
                    : 'bg-[#000000] text-white hover:bg-[#252726]'
                }`}
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
