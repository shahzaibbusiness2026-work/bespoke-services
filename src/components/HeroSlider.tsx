import React, { useState, useEffect } from 'react';
import { useShop, PageView } from '../context/ShopContext';

interface Slide {
  id: string;
  tagline: string;
  headline: string;
  subtitle: string;
  image: string;
  primaryCta: { label: string; page: PageView; category?: string };
  secondaryCta: { label: string; page: PageView; category?: string };
}

const SLIDES: Slide[] = [
  {
    id: 'slide-1',
    tagline: 'BOSKI LIMITED · THE 2025 ATELIER',
    headline: 'Elevate Your Everyday',
    subtitle:
      'Master-loom linens, Egyptian sateen, and bespoke architectural drapery crafted for quiet, restorative sanctuaries.',
    image:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1920&q=85',
    primaryCta: { label: 'Shop New Arrivals', page: 'new-arrivals' },
    secondaryCta: { label: 'Explore Bedding', page: 'bedding' },
  },
  {
    id: 'slide-2',
    tagline: 'ARCHITECTURAL DRAPERY & LIGHT',
    headline: 'Belgian Linen Curtains',
    subtitle:
      'Heavyweight 280 GSM pure flax with tailored weighted hems that gently diffuse sunlight into calming, tonal layers.',
    image:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=85',
    primaryCta: { label: 'Explore Curtains', page: 'curtains' },
    secondaryCta: { label: 'Bespoke Consultation', page: 'bespoke' },
  },
  {
    id: 'slide-3',
    tagline: 'HOTEL-GRADE SPA RITUALS',
    headline: 'Aegean Cotton Towels',
    subtitle:
      'Spun from rare long-staple Turkish cotton at 700 GSM density for cloud-like absorbency and enduring softness.',
    image:
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1920&q=85',
    primaryCta: { label: 'Discover Towels', page: 'towels' },
    secondaryCta: { label: 'View Complete Shop', page: 'shop' },
  },
  {
    id: 'slide-4',
    tagline: 'GENERATIONAL HEIRLOOM WEAVES',
    headline: 'Stonewashed French Linen',
    subtitle:
      'Harvested in Normandy, pre-washed for effortless suppleness that becomes softer and more luminous with every single laundering.',
    image:
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1920&q=85',
    primaryCta: { label: 'Explore Bedding Sets', page: 'bedding' },
    secondaryCta: { label: 'Read Our Story', page: 'canvas' },
  },
];

const AUTOPLAY_INTERVAL = 2000;

export const HeroSlider: React.FC = () => {
  const { setActivePage } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic slide rotation every 2 seconds - reliable, uninterrupted
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const handleCtaClick = (cta: Slide['primaryCta']) => {
    setActivePage(cta.page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeSlide = SLIDES[currentIndex];

  return (
    <section
      id="hero-carousel-section"
      className="relative w-full h-[88vh] min-h-[620px] max-h-[920px] flex items-center justify-center overflow-hidden bg-[#121313] select-none"
      aria-roledescription="carousel"
      aria-label="BOSKI LIMITED Featured Collections"
    >
      {/* Background Image Carousel Layer with Smooth Pure Opacity Cross-Fade (NO layout shake) */}
      {SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-500 ease-in-out will-change-[opacity] ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            <img
              src={slide.image}
              alt={slide.headline}
              className="w-full h-full object-cover object-center"
            />
            {/* Editorial Tonal Vignette & Contrast Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/40" />
          </div>
        );
      })}

      {/* Hero Content Layer (Completely stable layout with zero position jumping or shaking) */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/25 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-label-caps text-white tracking-[0.22em] text-[11px] uppercase font-medium">
            {activeSlide.tagline}
          </span>
        </div>

        {/* Main Headline with smooth cross-fade */}
        <h1
          className="text-[40px] sm:text-[62px] md:text-[76px] leading-[48px] sm:leading-[70px] md:leading-[84px] tracking-[-0.02em] text-white font-normal mb-6 drop-shadow-sm max-w-3xl transition-opacity duration-500"
          style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
        >
          {activeSlide.headline}
        </h1>

        {/* Subtitle */}
        <p className="text-body-lg sm:text-[19px] text-white/90 max-w-2xl mb-10 font-light leading-relaxed drop-shadow-sm transition-opacity duration-500 min-h-[56px]">
          {activeSlide.subtitle}
        </p>

        {/* Action CTAs (Clean hover and click without button scaling or viewport shake) */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
          <button
            id={`hero-primary-cta-${activeSlide.id}`}
            onClick={() => handleCtaClick(activeSlide.primaryCta)}
            className="group relative overflow-hidden bg-white text-[#000000] py-4 px-9 text-[13px] uppercase tracking-[0.16em] font-medium transition-colors duration-200 hover:bg-[#f4f3f1] active:opacity-85 shadow-lg flex items-center justify-center gap-2 cursor-pointer rounded-none border border-white"
          >
            <span>{activeSlide.primaryCta.label}</span>
            <span
              className="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover:translate-x-1"
              style={{ fontVariationSettings: "'wght' 300" }}
            >
              arrow_forward
            </span>
          </button>

          <button
            id={`hero-secondary-cta-${activeSlide.id}`}
            onClick={() => handleCtaClick(activeSlide.secondaryCta)}
            className="group bg-transparent text-white py-4 px-9 text-[13px] uppercase tracking-[0.16em] font-medium hover:bg-white/15 transition-colors duration-200 border border-white/80 backdrop-blur-sm active:opacity-85 flex items-center justify-center gap-2 cursor-pointer rounded-none"
          >
            <span>{activeSlide.secondaryCta.label}</span>
            <span
              className="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover:translate-x-1"
              style={{ fontVariationSettings: "'wght' 300" }}
            >
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Minimal Slide Indicator Dots (NO Next or Previous buttons) */}
      <div className="absolute bottom-8 inset-x-0 z-20 flex justify-center items-center gap-3 px-6">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(index)}
              className="group p-2 cursor-pointer focus:outline-none"
              aria-label={`Slide ${index + 1}: ${slide.headline}`}
            >
              <div
                className={`h-1.5 transition-all duration-500 rounded-none ${
                  isActive
                    ? 'w-10 bg-white shadow-sm'
                    : 'w-4 bg-white/40 group-hover:bg-white/70'
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};
