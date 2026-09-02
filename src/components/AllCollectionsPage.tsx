'use client';

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles, Filter, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ASSETS } from '@/src/constants/assets';

interface CollectionItem {
  id: string;
  name: string;
  season: 'All' | 'Winter' | 'Autumn' | 'Summer' | 'Architectural' | 'Spa';
  seasonLabel: string;
  year: number;
  productCount: number;
  description: string;
  details: string[];
  coverImage: string;
  launchDate: string;
  targetPage: 'bedding' | 'curtains' | 'towels' | 'throws-blankets' | 'shop';
  targetCategory?: string;
}

const ALL_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-winter-heritage',
    name: 'Winter Heritage Collection',
    season: 'Winter',
    seasonLabel: 'Autumn / Winter 2026',
    year: 2026,
    productCount: 24,
    description:
      'Generational heavyweight French flax, double-brushed thermal sateen weaves, and structured bedspreads engineered for restorative winter sanctuaries.',
    details: ['Heavyweight 220 GSM Normandy flax', 'Double-brushed thermal sateen finish', 'Hand-stitched mitered corners'],
    coverImage: ASSETS.editorial.lookbookMasterSuite,
    launchDate: 'Active Release',
    targetPage: 'bedding',
    targetCategory: 'sheets',
  },
  {
    id: 'col-belgian-sanctuary',
    name: 'Belgian Drapery Sanctuary',
    season: 'Architectural',
    seasonLabel: 'Bespoke Made-to-Measure',
    year: 2026,
    productCount: 16,
    description:
      'Custom drop architectural window treatments in heavy 280 GSM pure Belgian flax, framing panoramic vistas with acoustic gravity and diffused golden light.',
    details: ['Pure Flanders flax certified European Flax®', 'French pinch pleat & ripplefold options', 'Concealed zinc weighted hems'],
    coverImage: ASSETS.hero.atelierEditorialDrape,
    launchDate: 'Atelier Active',
    targetPage: 'curtains',
    targetCategory: 'curtains',
  },
  {
    id: 'col-normandy-summer',
    name: 'Normandy Summer Flax',
    season: 'Summer',
    seasonLabel: 'Spring / Summer 2026',
    year: 2026,
    productCount: 18,
    description:
      'Crisp, airy 165 GSM stonewashed linen sheets, breathable duvet covers, and gossamer gauze throws that exhale heat during warmer solstices.',
    details: ['165 GSM pre-washed European linen', 'Zero synthetic finishing or enzymes', 'Naturally thermoregulating weave'],
    coverImage: ASSETS.editorial.lookbookCoastalSanctuary,
    launchDate: 'Active Release',
    targetPage: 'bedding',
    targetCategory: 'duvets',
  },
  {
    id: 'col-aegean-spa',
    name: 'Aegean Bath & Rituals Suite',
    season: 'Spa',
    seasonLabel: 'Permanent Sanctuary',
    year: 2026,
    productCount: 14,
    description:
      'Indulgently plush 700 GSM Aegean long-staple bath sheets, honeycomb waffle hand towels, and textural spa robes crafted for daily restorative moments.',
    details: ['100% Organic certified Aegean cotton', 'Zero-twist micro-fiber loops', 'Double-reinforced woven selvages'],
    coverImage: ASSETS.hospitality.suiteInterior,
    launchDate: 'Permanent Archive',
    targetPage: 'towels',
    targetCategory: 'towels',
  },
  {
    id: 'col-sateen-silk',
    name: 'Raw Mulberry Silk & Sateen',
    season: 'Autumn',
    seasonLabel: 'Limited Atelier Run',
    year: 2026,
    productCount: 12,
    description:
      'Grade 6A 22-momme pure mulberry silk pillowcases and 480 thread-count long-staple Egyptian cotton sateen with subtle champagne luster.',
    details: ['Grade 6A Mulberry silk (22-Momme)', '480 TC Giza long-staple Egyptian cotton', 'Hypoallergenic natural luster'],
    coverImage: ASSETS.hero.rawSilkLoom,
    launchDate: 'Private Drop',
    targetPage: 'bedding',
    targetCategory: 'sheets',
  },
  {
    id: 'col-artisan-throws',
    name: 'Artisan Loom Throws & Quilts',
    season: 'Winter',
    seasonLabel: 'Limited Weaves',
    year: 2026,
    productCount: 15,
    description:
      'Slow-spun baby alpaca throws from high Peruvian plateaus and tactile honeycomb waffle quilts woven on heritage European shuttle looms.',
    details: ['100% Baby alpaca & organic cotton', 'Hand-knotted fringe detailing', 'Subtle micro-texture waffle weave'],
    coverImage: ASSETS.hero.coutureLinen,
    launchDate: 'Active Release',
    targetPage: 'throws-blankets',
    targetCategory: 'throws',
  },
];

export const AllCollectionsPage: React.FC = () => {
  const { setActivePage, isDarkMode, setIsContactOpen } = useShop();
  const [selectedSeason, setSelectedSeason] = useState<string>('All');

  const gold = '#C9A227';
  const pageBg = isDarkMode ? 'bg-[#0B0D0C] text-[#FAF8F5]' : 'bg-[#FAF8F5] text-[#171717]';
  const cardBg = isDarkMode ? 'bg-[#141716] border-[#242826]' : 'bg-white border-[#E6E1D8]';
  const textSecondary = isDarkMode ? 'text-[#A9A39A]' : 'text-[#595652]';

  const filterTabs = ['All', 'Winter', 'Summer', 'Architectural', 'Spa'];

  const filteredCollections = selectedSeason === 'All'
    ? ALL_COLLECTIONS
    : ALL_COLLECTIONS.filter((col) => col.season === selectedSeason);

  const handleNavigate = (page: 'bedding' | 'curtains' | 'towels' | 'throws-blankets' | 'shop') => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="all-collections-page" className={`min-h-screen ${pageBg} transition-colors duration-300 animate-fadeIn`}>
      {/* Editorial Header Banner */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-inherit overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
              <span className="text-[11px] uppercase font-mono tracking-[0.28em] font-semibold" style={{ color: gold }}>
                The Curated Archives &bull; All Collections
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-tight"
              style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
            >
              All Seasonal Collections
            </h1>

            <p className={`text-base sm:text-lg font-light leading-relaxed ${textSecondary}`}>
              Complete seasonal suites and architectural master-loom editions. Conceived to bring visual harmony, unhurried tactile honesty, and generational dignity to modern sanctuaries.
            </p>
          </motion.div>

          {/* Filter Bar & Concierge Inquiries */}
          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-inherit">
            <div className="flex flex-wrap items-center gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedSeason(tab)}
                  className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                    selectedSeason === tab
                      ? isDarkMode
                        ? 'bg-[#C9A227] text-black font-semibold'
                        : 'bg-black text-white font-semibold'
                      : isDarkMode
                        ? 'text-[#A9A39A] hover:text-[#FAF8F5] border border-[#242826]'
                        : 'text-[#595652] hover:text-black border border-[#E6E1D8]'
                  }`}
                >
                  {tab === 'All' ? 'All Curations' : tab}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsContactOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold hover:underline cursor-pointer self-start sm:self-auto"
              style={{ color: gold }}
            >
              <span>Custom Suite Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            <AnimatePresence mode="popLayout">
              {filteredCollections.map((col, idx) => (
                <motion.div
                  key={col.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={`border overflow-hidden group transition-all duration-500 hover:border-[#C9A227] ${cardBg}`}
                >
                  {/* Image Viewport */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-black/40 border-b border-inherit">
                    <img
                      src={col.coverImage}
                      alt={col.name}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 will-change-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                    {/* Season Tag */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider bg-black/80 backdrop-blur-sm text-[#F5F1E8] border border-white/20">
                        {col.seasonLabel}
                      </span>
                    </div>

                    {/* Piece Count */}
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-[#C9A227] text-black font-bold">
                        {col.productCount} Pieces
                      </span>
                    </div>

                    {/* Collection Title */}
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <h2
                        className="text-2xl sm:text-3xl font-normal tracking-tight drop-shadow-sm"
                        style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
                      >
                        {col.name}
                      </h2>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-8 space-y-6">
                    <p className={`text-sm sm:text-base font-light leading-relaxed ${textSecondary}`}>
                      {col.description}
                    </p>

                    {/* Material & Craftsmanship Highlights */}
                    <div className="space-y-2 pt-2 border-t border-inherit">
                      <span className={`text-[10px] uppercase tracking-widest font-mono ${isDarkMode ? 'text-[#C9A227]' : 'text-neutral-700'}`}>
                        Atelier Specifications
                      </span>
                      <ul className="space-y-1.5 text-xs font-light">
                        {col.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#C9A227]" />
                            <span className={textSecondary}>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-inherit flex items-center justify-between">
                      <span className={`text-xs font-mono ${textSecondary}`}>
                        Status: <strong className={isDarkMode ? 'text-[#FAF8F5]' : 'text-black'}>{col.launchDate}</strong>
                      </span>

                      <button
                        onClick={() => handleNavigate(col.targetPage)}
                        className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2 transition-all cursor-pointer ${
                          isDarkMode
                            ? 'bg-[#C9A227] text-black hover:bg-[#D8B468]'
                            : 'bg-black text-white hover:bg-neutral-800'
                        }`}
                      >
                        <span>Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};
