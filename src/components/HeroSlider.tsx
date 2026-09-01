import React from 'react';
import { useShop } from '../context/ShopContext';

interface HeroSliderProps {
  onSelectCategory?: (category: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = () => {
  const { setActivePage } = useShop();

  return (
    <section className="relative w-full h-[88vh] min-h-[620px] flex items-center justify-center overflow-hidden bg-[#efeeec]">
      {/* Background with subtle slow Ken Burns zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1920&q=85"
          alt="BOSKI LIMITED luxury bedroom sanctuary"
          className="w-full h-full object-cover transition-transform duration-[12000ms] ease-out scale-105 hover:scale-110"
        />
        {/* Editorial tonal gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/55" />
      </div>

      {/* Hero Content with staggered animation */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/25 mb-6 animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-label-caps text-white tracking-[0.25em] text-[11px] uppercase">
            BOSKI LIMITED · THE 2025 ATELIER
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className="text-[40px] sm:text-[64px] md:text-[76px] leading-[48px] sm:leading-[72px] md:leading-[84px] tracking-[-0.02em] text-white font-normal mb-6 drop-shadow-sm max-w-3xl"
          style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
        >
          Elevate Your Everyday
        </h1>

        {/* Subtitle */}
        <p className="text-body-lg sm:text-[19px] text-white/90 max-w-2xl mb-10 font-light leading-relaxed drop-shadow-sm">
          Master-loom linens, Egyptian sateen, and bespoke architectural drapery crafted for quiet, restorative sanctuaries.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
          <button
            id="hero-shop-new-arrivals-btn"
            onClick={() => {
              setActivePage('new-arrivals');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative overflow-hidden bg-white text-[#000000] py-4 px-9 text-label-caps uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#f4f3f1] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
          >
            <span>Shop New Arrivals</span>
            <span className="material-symbols-outlined text-[16px] btn-cta-arrow" style={{ fontVariationSettings: "'wght' 300" }}>
              arrow_forward
            </span>
          </button>

          <button
            id="hero-explore-collection-btn"
            onClick={() => {
              setActivePage('bedding');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group bg-transparent text-white py-4 px-9 text-label-caps uppercase tracking-[0.2em] hover:bg-white/15 transition-all duration-300 border border-white/80 backdrop-blur-sm active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Explore Bedding</span>
            <span className="material-symbols-outlined text-[16px] btn-cta-arrow" style={{ fontVariationSettings: "'wght' 300" }}>
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
