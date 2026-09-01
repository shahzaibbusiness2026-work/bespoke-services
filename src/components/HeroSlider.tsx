import React from 'react';
import { useShop } from '../context/ShopContext';

interface HeroSliderProps {
  onSelectCategory?: (category: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onSelectCategory }) => {
  const { setActivePage } = useShop();

  const handleShopNow = () => {
    setActivePage('home');
    if (onSelectCategory) onSelectCategory('all');
    setTimeout(() => {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    /* Hero Section — exactly matches homepage/code.html */
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Full-viewport bedroom image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1920&q=85"
          alt="A minimalist, sun-drenched bedroom featuring premium linen bedding in soft ivory and warm sand tones — quiet luxury editorial aesthetic"
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay for text contrast */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
        <h1
          className="text-[36px] md:text-[64px] leading-[44px] md:leading-[72px] tracking-[-0.02em] text-white drop-shadow-md mb-6"
          style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontWeight: 400 }}
        >
          Elevate Your Everyday
        </h1>
        <p className="text-body-lg text-white/90 drop-shadow mb-10 max-w-xl">
          Thoughtfully designed textiles for beautifully lived-in spaces. Experience the quiet luxury of natural fibers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
          <button
            id="hero-shop-new-arrivals-btn"
            onClick={handleShopNow}
            className="bg-[#ffffff] text-[#000000] py-4 px-8 text-label-caps uppercase tracking-widest hover:bg-[#f4f3f1] transition-colors duration-300 border border-transparent"
          >
            Shop New Arrivals
          </button>
          <button
            id="hero-explore-collection-btn"
            onClick={() => { setActivePage('home'); if (onSelectCategory) onSelectCategory('all'); }}
            className="bg-transparent text-white py-4 px-8 text-label-caps uppercase tracking-widest hover:bg-white/10 transition-colors duration-300 border border-white backdrop-blur-sm"
          >
            Explore Collection
          </button>
        </div>
      </div>
    </section>
  );
};
