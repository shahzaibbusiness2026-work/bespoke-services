'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowDown } from 'lucide-react';
import { ASSETS } from '@/src/constants/assets';

interface HeroLinenProps {
  onSelectCategory?: (category: string) => void;
}

export const HeroLinen: React.FC<HeroLinenProps> = ({ onSelectCategory }) => {
  const handleShopNewArrivals = () => {
    if (onSelectCategory) {
      onSelectCategory('all');
    }
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreCollection = () => {
    const lookbookEl = document.getElementById('lookbook-section');
    if (lookbookEl) {
      lookbookEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleShopNewArrivals();
    }
  };

  return (
    <section id="hero-linen-section" className="relative w-full h-[85vh] sm:h-[90vh] min-h-[580px] overflow-hidden">
      {/* High-Resolution Bedroom Background Image matching screen1.png */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={ASSETS.hero.atelierEditorialDrape}
          alt="Elevate Your Everyday - BOSKI LIMITED"
          className="w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000"
        />
        {/* Soft Vignette Overlay for Crisp Typography Contrast */}
        <div className="absolute inset-0 bg-black/25 sm:bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
      </div>

      {/* Hero Content Container matching screen1.png */}
      <div className="relative z-10 max-w-5xl mx-auto h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-6 max-w-3xl"
        >
          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-white tracking-tight leading-[1.1] drop-shadow-sm">
            Elevate Your Everyday
          </h1>

          {/* Subtitle matching screen1.png */}
          <p className="text-white/90 text-sm sm:text-base md:text-lg font-light tracking-wide max-w-xl mx-auto leading-relaxed drop-shadow">
            Thoughtfully designed textiles for beautifully lived-in spaces. Experience the quiet luxury of natural fibers.
          </p>

          {/* CTA Buttons matching screen1.png */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <button
              id="hero-shop-new-arrivals-btn"
              onClick={handleShopNewArrivals}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.99]"
            >
              Shop New Arrivals
            </button>

            <button
              id="hero-explore-collection-btn"
              onClick={handleExploreCollection}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/20 hover:bg-white/30 text-white border border-white/60 font-semibold text-xs uppercase tracking-[0.2em] backdrop-blur-md transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99]"
            >
              Explore Collection
            </button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <button
          onClick={handleShopNewArrivals}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors flex flex-col items-center gap-1.5"
          aria-label="Scroll to collection"
        >
          <span className="text-[10px] uppercase tracking-widest font-light">Scroll to Explore</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
