'use client';

import React, { useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { FALLBACK_IMAGE } from '../data/products';

interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
}

const DEFAULT_CATEGORY_METADATA: Record<string, { subtitle: string; image: string }> = {
  duvets: {
    subtitle: 'Stonewashed French Linen',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85',
  },
  sheets: {
    subtitle: '480TC Sateen Weave',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=85',
  },
  curtains: {
    subtitle: 'Belgian Linen Drapes',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85',
  },
  towels: {
    subtitle: '700 GSM Aegean Cotton',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=85',
  },
  blankets: {
    subtitle: 'Waffle Weave & Alpaca',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=85',
  },
  throws: {
    subtitle: 'Hand-Fringed Linen & Alpaca',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=85',
  },
  pillows: {
    subtitle: 'Mulberry Silk & Down',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=85',
  },
};

const DEFAULT_CATEGORIES = [
  {
    id: 'cat-linen',
    name: 'Linen Duvets',
    subtitle: 'Stonewashed French Linen',
    key: 'duvets',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85',
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-2',
  },
  {
    id: 'cat-sheets',
    name: 'Sheet Sets',
    subtitle: '480TC Sateen Weave',
    key: 'sheets',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=85',
    colSpan: 'md:col-span-1',
    rowSpan: '',
  },
  {
    id: 'cat-curtains',
    name: 'Curtains',
    subtitle: 'Belgian Linen Drapes',
    key: 'curtains',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85',
    colSpan: 'md:col-span-1',
    rowSpan: '',
  },
  {
    id: 'cat-towels',
    name: 'Towels & Bath',
    subtitle: '700 GSM Aegean Cotton',
    key: 'towels',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=85',
    colSpan: 'md:col-span-1',
    rowSpan: '',
  },
  {
    id: 'cat-blankets',
    name: 'Blankets & Throws',
    subtitle: 'Waffle Weave & Alpaca',
    key: 'blankets',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=85',
    colSpan: 'md:col-span-1',
    rowSpan: '',
  },
  {
    id: 'cat-silk',
    name: 'Pillowcases',
    subtitle: 'Mulberry Silk & Down',
    key: 'pillows',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=85',
    colSpan: 'md:col-span-1',
    rowSpan: '',
  },
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const { categories } = useShop();

  // Dynamically resolve category cards merging live context with visual styling
  const displayCategories = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map((c, index) => {
        const key = c.category.toLowerCase();
        const meta = DEFAULT_CATEGORY_METADATA[key] || {
          subtitle: 'Atelier Collection',
          image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=85',
        };
        const label = c.label || key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ');
        return {
          id: `cat-${key}`,
          name: label,
          subtitle: meta.subtitle,
          key,
          image: meta.image,
          colSpan: index === 0 ? 'md:col-span-2' : 'md:col-span-1',
          rowSpan: index === 0 ? 'md:row-span-2' : '',
        };
      });
    }
    return DEFAULT_CATEGORIES;
  }, [categories]);

  const handleClick = (key: string) => {
    onSelectCategory(key);
    setTimeout(() => {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <section
      id="categories-section"
      className="w-full px-5 md:px-16 py-24 max-w-[1440px] mx-auto"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <p className="text-label-caps text-[#505252] mb-3 uppercase tracking-wider font-semibold">Our Collections</p>
          <h2
            className="text-headline-lg text-[#000000] max-w-lg font-normal"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            The Textile Sanctuary
          </h2>
        </div>
        <p className="text-body-md text-[#2b2d2c] max-w-sm font-light">
          Explore thoughtfully crafted natural fiber textiles, rooted in generational European loom heritage.
        </p>
      </div>

      {/* Bento Grid with Smooth Hardware-Accelerated Lift */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[280px]">
        {displayCategories.map((cat) => (
          <div
            key={cat.id}
            id={`cat-card-${cat.key}`}
            onClick={() => handleClick(cat.key)}
            className={`group relative overflow-hidden cursor-pointer bg-[#efeeec] card-hover-lift ${cat.colSpan} ${cat.rowSpan}`}
          >
            {/* Background Image with 60fps Smooth Scale */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />

            {/* Contrast Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Text Content */}
            <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end text-white">
              <p className="text-label-caps text-white/80 mb-1 uppercase tracking-wider">{cat.subtitle}</p>
              <h3
                className="text-headline-sm text-white group-hover:translate-x-1 transition-transform duration-300 font-normal"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                {cat.name}
              </h3>
              <div className="flex items-center gap-2 mt-3 text-white/90 group-hover:text-white transition-colors">
                <span className="text-label-caps tracking-wider uppercase">Explore</span>
                <span
                  className="material-symbols-outlined text-sm btn-cta-arrow"
                  style={{ fontVariationSettings: "'wght' 300" }}
                >
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
