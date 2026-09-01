import React from 'react';

interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
}

const CATEGORIES = [
  {
    id: 'cat-linen',
    name: 'Linen Duvets',
    subtitle: 'Stonewashed French Linen',
    key: 'duvets',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85',
    colSpan: 'md:col-span-2',
    rowSpan: 'row-span-2',
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
    id: 'cat-blankets',
    name: 'Blankets',
    subtitle: 'Waffle Weave Cotton',
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
          <p className="text-label-caps text-[#444748] mb-4">Our Collections</p>
          <h2
            className="text-headline-lg text-[#000000] max-w-lg"
            style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
          >
            The Textile Sanctuary
          </h2>
        </div>
        <p className="text-body-md text-[#444748] max-w-sm">
          Explore thoughtfully crafted natural fiber textiles, rooted in generational European loom heritage.
        </p>
      </div>

      {/* Bento Grid — matches reference bento pattern */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            id={`cat-card-${cat.key}`}
            onClick={() => handleClick(cat.key)}
            className={`group relative overflow-hidden cursor-pointer bg-[#efeeec] product-card ${cat.colSpan} ${cat.rowSpan}`}
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="product-img w-full h-full object-cover object-center"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-400" />

            {/* Text Content */}
            <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end text-white">
              <p className="text-label-caps text-white/70 mb-1">{cat.subtitle}</p>
              <h3
                className="text-headline-sm text-white group-hover:translate-x-0.5 transition-transform duration-300"
                style={{ fontFamily: "'Libre Caslon Text', Georgia, serif" }}
              >
                {cat.name}
              </h3>
              <div className="flex items-center gap-2 mt-3 text-white/80 group-hover:text-white transition-colors">
                <span className="text-label-caps">Explore</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'wght' 300" }}>
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
