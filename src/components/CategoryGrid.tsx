'use client';

import React from 'react';
import { useShop, PageView } from '../context/ShopContext';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ASSETS } from '@/src/constants/assets';

interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
}

interface SanctuaryCategory {
  id: string;
  name: string;
  subtitle: string;
  categoryKey: string;
  page: PageView;
  image: string;
}

const SANCTUARY_CATEGORIES: SanctuaryCategory[] = [
  {
    id: 'cat-sheets',
    name: 'Sheets',
    subtitle: '480TC Long-Staple Sateen',
    categoryKey: 'sheets',
    page: 'bedding',
    image: ASSETS.categories.bedding,
  },
  {
    id: 'cat-duvets',
    name: 'Duvets',
    subtitle: 'Stonewashed French Linen',
    categoryKey: 'duvets',
    page: 'bedding',
    image: ASSETS.categories.cushions,
  },
  {
    id: 'cat-blankets',
    name: 'Blankets',
    subtitle: 'Waffle Weave & Baby Alpaca',
    categoryKey: 'blankets',
    page: 'throws-blankets',
    image: ASSETS.categories.throws,
  },
  {
    id: 'cat-curtains',
    name: 'Curtains',
    subtitle: 'Belgian Architectural Drops',
    categoryKey: 'curtains',
    page: 'curtains',
    image: ASSETS.categories.fabrics,
  },
  {
    id: 'cat-throws',
    name: 'Throws',
    subtitle: 'Hand-Fringed Pure Linen',
    categoryKey: 'throws',
    page: 'throws-blankets',
    image: ASSETS.categories.bespoke,
  },
  {
    id: 'cat-pillows',
    name: 'Pillows',
    subtitle: '22 Momme Mulberry Silk',
    categoryKey: 'pillows',
    page: 'bedding',
    image: ASSETS.categories.tableware,
  },
  {
    id: 'cat-towels',
    name: 'Towels',
    subtitle: '700 GSM Aegean Spun Cotton',
    categoryKey: 'towels',
    page: 'towels',
    image: ASSETS.categories.accessories,
  },
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const { setActivePage, isDarkMode } = useShop();

  const handleNavigate = (page: PageView, categoryKey: string) => {
    onSelectCategory(categoryKey);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const gold = '#C9A227';
  const sectionBg = isDarkMode ? 'bg-[#0B0D0C] text-[#F5F1E8]' : 'bg-[#FAF8F5] text-[#171717]';
  const cardBg = isDarkMode ? 'bg-[#141716] border-[#222624]' : 'bg-white border-[#E6E1D8]';
  const textSecondary = isDarkMode ? 'text-[#A9A39A]' : 'text-[#595652]';

  return (
    <section className={`py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${sectionBg} overflow-hidden`}>
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20">
        {/* Section Header with In-View Stagger */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
            <span
              className="text-[11px] uppercase font-mono tracking-[0.28em] font-medium"
              style={{ color: gold }}
            >
              Atelier Taxonomy &bull; Living Sanctuaries
            </span>
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.02em]"
            style={{ fontFamily: "'Libre Caslon Text', 'Cormorant Garamond', Georgia, serif" }}
          >
            The Textile Sanctuary
          </h2>
          <p className={`text-base sm:text-lg font-light leading-relaxed max-w-xl mx-auto ${textSecondary}`}>
            Crafted textiles designed for timeless living.
          </p>
        </motion.div>

        {/* 1. Large Featured Hero Image: Bedding Collection */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
          onClick={() => handleNavigate('bedding', 'bedding')}
          className={`border group cursor-pointer overflow-hidden transition-colors duration-500 hover:border-[#C9A227] ${cardBg}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Featured Image Canvas with Hardware Acceleration */}
            <div className="lg:col-span-8 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/11] overflow-hidden relative bg-black/40">
              <img
                src={ASSETS.hero.coutureLinen}
                alt="Bedding Collection"
                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1 text-[10px] uppercase font-mono tracking-widest bg-black/75 backdrop-blur-sm text-[#F5F1E8] border border-white/20">
                  Featured Atelier Foundation
                </span>
              </div>
            </div>

            {/* Featured Narrative Editorial Card */}
            <div className="lg:col-span-4 p-8 sm:p-12 lg:p-14 space-y-5 flex flex-col justify-center">
              <span className="text-xs uppercase font-mono tracking-[0.22em]" style={{ color: gold }}>
                Core Suite
              </span>
              <h3
                className="text-3xl sm:text-4xl font-normal tracking-tight"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                Bedding Collection
              </h3>
              <p className={`text-sm sm:text-base font-light leading-relaxed ${textSecondary}`}>
                Woven from generational Normandy flax and long-staple Egyptian Giza cotton. An unhurried tactile foundation engineered for deep, restorative sleep.
              </p>
              <div className="pt-3">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold group-hover:underline cursor-pointer" style={{ color: gold }}>
                  <span>Explore Bedding Suite</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Luxury Category Cards (7 Spacious Cards with Staggered Kinetic Reveal) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-inherit">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold opacity-70">
              Curated Architectural Categories
            </span>
            <span className="text-xs font-mono opacity-50">07 Sanctuaries</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {SANCTUARY_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.75, delay: (idx % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                onClick={() => handleNavigate(cat.page, cat.categoryKey)}
                className={`border group cursor-pointer flex flex-col justify-between overflow-hidden transition-colors duration-500 hover:border-[#C9A227] ${cardBg}`}
              >
                {/* Large Category Photo */}
                <div className="aspect-[4/5] relative overflow-hidden bg-black/30 border-b border-inherit">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 will-change-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Subtitle pill overlay */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 text-[9.5px] uppercase font-mono tracking-wider bg-black/75 backdrop-blur-sm text-[#F5F1E8] border border-white/20">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[11px] font-mono uppercase tracking-widest text-[#C9A227] mb-0.5">
                      {cat.subtitle}
                    </p>
                    <h4
                      className="text-2xl font-normal tracking-tight drop-shadow-sm"
                      style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                    >
                      {cat.name}
                    </h4>
                  </div>
                </div>

                {/* Card Bottom Strip */}
                <div className="p-5 flex items-center justify-between">
                  <span className={`text-xs font-light tracking-wide ${textSecondary}`}>
                    View Curated Pieces
                  </span>
                  <div className="w-7 h-7 border border-inherit flex items-center justify-center group-hover:border-[#C9A227] group-hover:text-[#C9A227] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
