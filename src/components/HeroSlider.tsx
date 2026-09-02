'use client';

import React, { useState, useEffect } from 'react';
import { useShop, PageView } from '../context/ShopContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface Slide {
  id: string;
  tagline: string;
  headline: string;
  subtitle: string;
  image: string;
  primaryCta: { label: string; page: PageView };
  secondaryCta: { label: string; page: PageView };
}

const SLIDES: Slide[] = [
  {
    id: 'slide-linen',
    tagline: 'NORMANDY MARITIME FLAX · 185 GSM',
    headline: 'Stonewashed French Linen',
    subtitle:
      'Cultivated in the misty coastal fields of Normandy. Woven on generational shuttle looms to breathe with quiet gravity and soften with every laundering cycle for decades of restorative sleep.',
    image:
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=2400&q=90',
    primaryCta: { label: 'Discover Collection', page: 'bedding' },
    secondaryCta: { label: 'Explore Craftsmanship', page: 'canvas' },
  },
  {
    id: 'slide-drapery',
    tagline: 'ARCHITECTURAL WINDOW TREATMENTS',
    headline: 'Belgian Weighted Drapery',
    subtitle:
      'Heavyweight 280 GSM pure Flanders flax tailored with lead-weighted perimeter hems that sculpt daylight into quiet, acoustic calm.',
    image:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2400&q=90',
    primaryCta: { label: 'Discover Collection', page: 'curtains' },
    secondaryCta: { label: 'Explore Craftsmanship', page: 'bespoke' },
  },
  {
    id: 'slide-sateen',
    tagline: 'EGYPTIAN GIZA 480TC SATEEN',
    headline: 'Signature Core Sheet Suite',
    subtitle:
      'Silky single-ply combed staple yarns pre-washed in organic mountain water. A luminous touch designed to elevate your everyday sanctuary.',
    image:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=2400&q=90',
    primaryCta: { label: 'Discover Collection', page: 'bedding' },
    secondaryCta: { label: 'Explore Craftsmanship', page: 'canvas' },
  },
];

const AUTOPLAY_INTERVAL = 7000;

interface HeroSliderProps {
  onSelectCategory?: (category: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onSelectCategory }) => {
  const { setActivePage } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Subtle ambient rotation — pauses when user interacts
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleCtaClick = (page: PageView) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeSlide = SLIDES[currentIndex];

  return (
    <section
      id="hero-editorial-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[88vh] min-h-[800px] max-h-[1100px] flex items-center justify-center overflow-hidden bg-[#0e100f] select-none"
      aria-label="BOSKI LIMITED Editorial Atelier"
    >
      {/* Background Image Layer with Cinematic Clarity & Reduced Dark Overlay */}
      {SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out will-change-[opacity] ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            <img
              src={slide.image}
              alt={slide.headline}
              className={`w-full h-full object-cover object-center transition-transform duration-[12000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Lighter, nuanced tonal overlay letting textile texture and weave glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/15" />
            <div className="absolute inset-0 bg-black/10 backdrop-contrast-[1.02]" />
          </div>
        );
      })}

      {/* Hero Content Layer with Fluid Staggered Editorial Typography */}
      <div className="relative z-10 text-center px-6 sm:px-8 max-w-4xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Luxury Provenance Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/35 backdrop-blur-md border border-white/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
              <span className="text-white tracking-[0.26em] text-[10.5px] uppercase font-mono font-medium">
                {activeSlide.tagline}
              </span>
            </div>

            {/* Main Headline in Elegant Editorial Serif */}
            <h1
              className="text-[44px] sm:text-[68px] md:text-[84px] leading-[1.05] tracking-[-0.025em] text-[#FAF8F5] font-normal mb-6 drop-shadow-sm max-w-3xl"
              style={{ fontFamily: "'Libre Caslon Text', 'Cormorant Garamond', Georgia, serif" }}
            >
              {activeSlide.headline}
            </h1>

            {/* Emotional Narrative Description */}
            <p className="text-base sm:text-lg md:text-[20px] text-[#FAF8F5]/90 max-w-2xl mb-10 font-light leading-relaxed drop-shadow-sm">
              {activeSlide.subtitle}
            </p>

            {/* Luxury Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
              <button
                id="hero-primary-cta"
                onClick={() => handleCtaClick(activeSlide.primaryCta.page)}
                className="group relative overflow-hidden bg-[#FAF8F5] text-[#141615] py-4 px-10 text-[12.5px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-[#C9A227] hover:text-black active:scale-[0.98] shadow-xl flex items-center justify-center gap-2.5 cursor-pointer rounded-none border border-[#FAF8F5]"
              >
                <span>{activeSlide.primaryCta.label}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => handleCtaClick(activeSlide.secondaryCta.page)}
                className="group bg-black/30 backdrop-blur-md text-[#FAF8F5] py-4 px-10 text-[12.5px] uppercase tracking-[0.2em] font-semibold hover:bg-white/15 transition-all duration-300 border border-white/70 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer rounded-none"
              >
                <span>{activeSlide.secondaryCta.label}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle Editorial Progress Bars & Ambient Navigation (Zero Generic Slider Arrows) */}
      <div className="absolute bottom-10 inset-x-0 z-20 flex justify-center items-center gap-3 px-6">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(index)}
              className="group py-2 px-1 cursor-pointer focus:outline-none"
              aria-label={`Slide ${index + 1}: ${slide.headline}`}
            >
              <div
                className={`h-[2px] transition-all duration-700 rounded-none ${
                  isActive
                    ? 'w-14 bg-[#C9A227] shadow-sm'
                    : 'w-6 bg-white/35 group-hover:bg-white/70'
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};
