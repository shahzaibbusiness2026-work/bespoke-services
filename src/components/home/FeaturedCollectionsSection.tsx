'use client';

import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ArrowRight, Layers, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Collection } from '../../types';

export const FeaturedCollectionsSection: React.FC = () => {
  const { collections, setActivePage, isDarkMode } = useShop();

  const gold = '#C9A227';
  const sectionBg = isDarkMode ? 'bg-[#0B0D0C] text-[#F5F1E8]' : 'bg-[#FAF8F5] text-[#171717]';
  const cardBg = isDarkMode ? 'bg-[#141716] border-[#222624]' : 'bg-white border-[#E6E1D8]';
  const textSecondary = isDarkMode ? 'text-[#A9A39A]' : 'text-[#595652]';

  // Curated fallback if collections not loaded yet
  const defaultCollections = [
    {
      id: 'col-winter-heritage',
      name: 'Winter Heritage Collection',
      season: 'Winter',
      year: 2026,
      productCount: 24,
      description: 'Generational heavyweight French flax, double-brushed flannel, and thermal sateen weaves engineered for restorative winter sanctuaries.',
      coverImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=85',
      launchDate: 'Autumn / Winter 2026',
    },
    {
      id: 'col-belgian-sanctuary',
      name: 'Belgian Drapery Sanctuary',
      season: 'Autumn',
      year: 2026,
      productCount: 16,
      description: 'Custom drop architectural window treatments in heavy 280 GSM Belgian flax, framing panoramic vistas with quiet acoustic gravity.',
      coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
      launchDate: 'Bespoke Made-to-Measure',
    },
    {
      id: 'col-normandy-summer',
      name: 'Normandy Summer Flax',
      season: 'Summer',
      year: 2026,
      productCount: 18,
      description: 'Crisp, airy 165 GSM stonewashed linen sheets and gossamer throws that exhale heat during warmer solstices.',
      coverImage: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=85',
      launchDate: 'Spring / Summer 2026',
    },
  ];

  const items = collections && collections.length > 0 ? collections.slice(0, 3) : defaultCollections;

  const handleOpenCollection = (name: string) => {
    if (name.toLowerCase().includes('drapery') || name.toLowerCase().includes('curtain')) {
      setActivePage('curtains');
    } else {
      setActivePage('bedding');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className={`py-28 sm:py-36 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${sectionBg} overflow-hidden`}>
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20">
        {/* Section Header with In-View Animation */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-inherit"
        >
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
              <span className="text-[11px] uppercase font-mono tracking-[0.28em] font-medium" style={{ color: gold }}>
                Curated Releases &bull; Seasonal Editions
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl font-normal tracking-tight"
              style={{ fontFamily: "'Libre Caslon Text', 'Cormorant Garamond', Georgia, serif" }}
            >
              Featured Collections
            </h2>
            <p className={`text-base font-light leading-relaxed ${textSecondary}`}>
              Seasonal atelier suites conceived to bring visual harmony and tactile depth to modern architectural residences.
            </p>
          </div>

          <button
            onClick={() => {
              setActivePage('new-arrivals');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold hover:underline cursor-pointer self-start md:self-auto group"
            style={{ color: gold }}
          >
            <span>View All Curations</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* 3 Large Editorial Collection Showcases with Staggered Entrance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {items.map((col, idx) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: idx * 0.14, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
              onClick={() => handleOpenCollection(col.name)}
              className={`border group cursor-pointer flex flex-col justify-between overflow-hidden transition-colors duration-500 hover:border-[#C9A227] ${cardBg}`}
            >
              {/* Cover Image Canvas */}
              <div className="aspect-[16/11] relative overflow-hidden bg-black/40 border-b border-inherit">
                <img
                  src={col.coverImage}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-[9.5px] uppercase font-mono tracking-wider bg-black/80 backdrop-blur-sm text-[#F5F1E8] border border-white/20">
                    {col.season} {col.year}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 text-[9.5px] uppercase font-mono tracking-wider bg-[#C9A227] text-black font-bold">
                    {col.productCount || 20} Pieces
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3
                    className="text-2xl font-normal tracking-tight drop-shadow-sm"
                    style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                  >
                    {col.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow space-y-4">
                <p className={`text-xs sm:text-sm font-light leading-relaxed line-clamp-3 ${textSecondary}`}>
                  {col.description}
                </p>

                <div className="pt-4 border-t border-inherit flex items-center justify-between">
                  <span className={`text-[11px] font-mono ${textSecondary}`}>
                    {col.launchDate || 'Atelier Active'}
                  </span>
                  <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold group-hover:text-[#C9A227] transition-colors">
                    <span>Explore Suite</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
