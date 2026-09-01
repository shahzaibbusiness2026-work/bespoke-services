import React, { useState, useEffect, useRef } from 'react';
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

const AUTOPLAY_INTERVAL = 5500;

export const HeroSlider: React.FC = () => {
  const { setActivePage } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_INTERVAL);
  };

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (!isPaused) startTimer();
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    if (!isPaused) startTimer();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    if (!isPaused) startTimer();
  };

  const handleCtaClick = (cta: Slide['primaryCta']) => {
    setActivePage(cta.page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeSlide = SLIDES[currentIndex];

  return (
    <section
      id="hero-carousel-section"
      className="relative w-full h-[88vh] min-h-[620px] max-h-[920px] flex items-center justify-center overflow-hidden bg-[#121313] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="BOSKI LIMITED Featured Collections"
    >
      {/* Background Image Carousel Layer with GPU Cross-Fade */}
      {SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out will-change-[opacity,transform] ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            <img
              src={slide.image}
              alt={slide.headline}
              className={`w-full h-full object-cover object-center kenburns-zoom ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Editorial Tonal Vignette & Contrast Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/40" />
          </div>
        );
      })}

      {/* Hero Content Animated Layer */}
      <div
        key={activeSlide.id}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center animate-slideUp"
      >
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/25 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-label-caps text-white tracking-[0.22em] text-[11px] uppercase font-medium">
            {activeSlide.tagline}
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className="text-[40px] sm:text-[62px] md:text-[76px] leading-[48px] sm:leading-[70px] md:leading-[84px] tracking-[-0.02em] text-white font-normal mb-6 drop-shadow-sm max-w-3xl"
          style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
        >
          {activeSlide.headline}
        </h1>

        {/* Subtitle */}
        <p className="text-body-lg sm:text-[19px] text-white/90 max-w-2xl mb-10 font-light leading-relaxed drop-shadow-sm">
          {activeSlide.subtitle}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
          <button
            id={`hero-primary-cta-${activeSlide.id}`}
            onClick={() => handleCtaClick(activeSlide.primaryCta)}
            className="group relative overflow-hidden bg-white text-[#000000] py-4 px-9 text-label-caps uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#f4f3f1] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{activeSlide.primaryCta.label}</span>
            <span
              className="material-symbols-outlined text-[16px] btn-cta-arrow"
              style={{ fontVariationSettings: "'wght' 300" }}
            >
              arrow_forward
            </span>
          </button>

          <button
            id={`hero-secondary-cta-${activeSlide.id}`}
            onClick={() => handleCtaClick(activeSlide.secondaryCta)}
            className="group bg-transparent text-white py-4 px-9 text-label-caps uppercase tracking-[0.2em] hover:bg-white/15 transition-all duration-300 border border-white/80 backdrop-blur-sm active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{activeSlide.secondaryCta.label}</span>
            <span
              className="material-symbols-outlined text-[16px] btn-cta-arrow"
              style={{ fontVariationSettings: "'wght' 300" }}
            >
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* Slide Navigation Arrows (Desktop) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm border border-white/20 transition-all cursor-pointer group"
        aria-label="Previous Slide"
      >
        <span className="material-symbols-outlined text-[24px] group-hover:-translate-x-0.5 transition-transform">
          chevron_left
        </span>
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm border border-white/20 transition-all cursor-pointer group"
        aria-label="Next Slide"
      >
        <span className="material-symbols-outlined text-[24px] group-hover:translate-x-0.5 transition-transform">
          chevron_right
        </span>
      </button>

      {/* Bottom Progress Bars and Slide Indicators */}
      <div className="absolute bottom-8 inset-x-0 z-20 flex justify-center items-center gap-3 px-6">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className="group flex flex-col items-center gap-2 p-2 cursor-pointer focus:outline-none"
              aria-label={`Slide ${index + 1}: ${slide.headline}`}
            >
              {/* Progress Bar Container */}
              <div className="relative w-12 sm:w-16 h-1 bg-white/30 overflow-hidden transition-all">
                {isActive ? (
                  <div
                    key={`bar-${index}-${isPaused}`}
                    className="h-full bg-white transition-all"
                    style={{
                      width: '100%',
                      transitionDuration: isPaused ? '0ms' : `${AUTOPLAY_INTERVAL}ms`,
                      transitionTimingFunction: 'linear',
                    }}
                  />
                ) : (
                  <div className="h-full bg-transparent group-hover:bg-white/50 transition-colors" />
                )}
              </div>
              {/* Subtle Slide Number on Hover/Active */}
              <span
                className={`text-[10px] font-mono tracking-widest uppercase transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-white/50 group-hover:text-white/80'
                }`}
              >
                0{index + 1}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
